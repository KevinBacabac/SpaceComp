class Planet {
  INTERVAL = 2;
  LINE_WIDTH = 6;
  TYPE = "Planet";

  constructor(owner, x, y, health) {
    const radius = 30;
    this.radius = radius;

    this.rect = new Rect(0, 0, radius, radius);
    this.rect.setCenterx(x);
    this.rect.setCentery(y);

    this.counter = 0;
    this.setOwner(owner);
    this.health = health;
  }

  draw(ctx, colourMan) {
    this.colour = colourMan.getColour(this.owner);

    ctx.strokeStyle = this.colour;
    ctx.lineWidth = this.LINE_WIDTH;

    ctx.beginPath();
    ctx.arc(...this.rect.center(), this.radius, 0, TAU);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = this.colour;
    ctx.font = "16pt BebasNeue-Regular";
    ctx.fillText(this.health, ...this.rect.center())
  }

  update(dTime) {
    this.counter += dTime;

    while (this.counter > this.INTERVAL) {
      this.health += 1;
      this.counter -= this.INTERVAL;
    }
  }

  setOwner(owner) {
    this.owner = owner;
  }

  serialize() {
    var out = new Map();
    out.set("Health", this.health);
    out.set("ID", this.id);
    out.set("Owner", this.owner);

    return out;
  }

  takeDamage(owner, pop) {
    var offense = this.owner != owner;
    var death = false;

    if (this.owner == owner) {
      this.health += pop;
    } else {
      this.health -= pop;

      death = this.health < 0;
      if (death) {  // Switch allegiance
        this.setOwner(owner);
        this.health *= -1;
      }
    }

    return [death, offense];
  }
}

class Planets extends PlayerCollection {
  classType = Planet;

  initialize(playerIDs) {
    for (var i = 0; i < 3; ++i) {
      for (var id of playerIDs) {
        let x = randUniform(100, 1000);
        let y = randUniform(100, 600);

        this.add(id, x, y, Math.round(Math.random() * 100));
      }
    }
  }

  getDistance(idOne, idTwo) {
    const objOne = this.find(idOne);
    const objTwo = this.find(idTwo);
    const dist = objOne.rect.dist(objTwo.rect) - objOne.radius - objTwo.radius;

    return Math.max(0, dist);
  }
}
