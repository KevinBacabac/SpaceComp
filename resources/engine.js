class Engine {
  constructor() {
    this.bots = new Bots();
    this.explosions = new Explosions();

    this.active = new Map();
    this.active.set("Planet", new Planets());
    this.active.set("Ship", new Ships());

    this.active.get("Planet").initialize(this.bots.listPlayers());
    this.colourManager = new ColourManager(this.bots.listPlayers());

    this.resetEvents();
  }

  resetEvents() {
    this.events = new Map();
    this.events.set("Death", new Set());
    this.events.set("Hit", new Set());
    this.events.set("Player", new Set());
  }

  // Takes planet ids
  shoot(action) {
    const sourceID = action.get("Source ID");
    const sourceType = action.get("Source Type");
    const target = action.get("Target");

    const source = this.active.get(sourceType).find(sourceID);
    const dest = this.active.get("Planet").find(target);

    const shipHealth = Math.min(source.health, action.get("Health"));
    if (shipHealth == 0 || source == dest) return;

    source.health -= shipHealth;

    const srcPos = source.rect.center();
    const destPos = dest.rect.center();

    const owner = source.owner;

    let helper = new Helper(this.active, this.events, this.getAlivePlayers());
    this.active.get("Ship").add(...srcPos, ...destPos,
      shipHealth, owner, sourceID, "Planet", target, helper);

    if (sourceType == "Ship" && source.health == 0) {
      this.active.get("Ship").remove(sourceID);
    }
  }

  update(dTime) {
    this.active.get("Ship").all.forEach((ship, id) => {
      ship.move(dTime);
      this.collide(id);
    });

    this.active.get("Planet").all.forEach((planet, id) => {
      planet.update(dTime);
    });
  }

  doTurn() {
    let helper = new Helper(this.active, this.events, this.getAlivePlayers());
    let actions = this.bots.getActions(helper);

    this.resetEvents();

    for (var action of actions) {
      this.events.get("Player").add(action);

      if (action.get("Type") == "Attack") {
        this.shoot(action);
      }
    }
  }

  collide(id) {
    const playerShip = this.active.get("Ship").find(id);
    if (playerShip.delay > 0) return;

    const destId = playerShip.targetID;
    const dest = this.active.get("Planet").find(destId);

    const pop = playerShip.health;
    const owner = playerShip.owner;

    var death;
    var offense;

    [death, offense] = dest.takeDamage(owner, pop);

    if (offense) {
      this.explosions.add(...playerShip.rect.center());
    }

    this.active.get("Ship").remove(id);
  }

  getAlivePlayers() {
    var players = this.bots.listPlayers();
    var alive = new Set();

    for (var id of players) {
      let planets = this.active.get("Planet").exportOwner(id);
      let ships = this.active.get("Ship").exportOwner(id);

      if (planets.size + ships.size > 0) {
        alive.add(id);
      }
    }

    return alive;
  }
}
