class Ship extends SpaceObject {
  LINE_WIDTH = 3
  SIZE = 10;
  SPEED = 100;
  TYPE = "Ship";

  constructor(x, y, destX, destY, // Visualizer
              health, owner, sourceID, sourceType, targetID, helper) {
    super();
    this.setOwner(owner);

    this.rect = new Rect(0, 0, this.SIZE, this.SIZE);
    this.rect.setCenterx(x);
    this.rect.setCentery(y);

    this.targetPlanet(destX, destY, targetID, helper)
    this.health = health

    this.sourceID = sourceID;
    this.sourceType = sourceType;
  }

  draw(ctx, colourMan) {
    this.colour = colourMan.getColour(this.owner);

    // Connecting these points traces out ship
    this.pointList = [];

    for (var angle of [0, 140, 220]) {
      var temp = rotatePoint(0, 0, 0, -this.SIZE,
                   // "angle" is in degrees
                   // this.rotation in radians and clockwise from vertical
                   angle * TAU / 360 + this.rotation + TAU / 4
                   );

      // Flip y coordinates so rotations are done in conventional math form but match screen
      temp.y *= -1;
      this.pointList.push(temp);
    }

    this.basicDraw(this.colour);

    // Draw health
    ctx.fillStyle = this.colour;
    ctx.font = "12pt BebasNeue-Regular";
    ctx.fillText(this.health, this.rect.centerx(),
                 this.rect.centery() - this.SIZE);
  }

  move(dTime) {
    super.move(dTime);
    this.delay -= dTime;
  }

  setOwner(owner) {
    // Same as planet
    this.owner = owner;
  }

  serialize() {
    var out = new Map();
    out.set("Delay", this.delay);
    out.set("Health", this.health);
    out.set("ID", this.id);
    out.set("Owner", this.owner);

    out.set("Source ID", this.sourceID);
    out.set("Source Type", this.sourceType);
    out.set("Target", this.targetID);

    return out;
  }

  targetPlanet(destX, destY, targetID, helper) {
    const deltaX = destX - this.rect.centerx();
    const deltaY = destY - this.rect.centery();

    this.rotation = Math.atan2(deltaY, deltaX);
    this.dx = this.SPEED * Math.cos(this.rotation);
    this.dy = this.SPEED * Math.sin(this.rotation);

    this.targetID = targetID;

    this.delay = helper.getPlanetDelay(targetID, this)
  }
}

class Ships extends PlayerCollection {
  classType = Ship;

  getDistance(idOne, idTwo) {
    var objOne = this.find(idOne);
    var objTwo = this.find(idTwo);

    return objOne.rect.dist(objTwo.rect);
  }
}
