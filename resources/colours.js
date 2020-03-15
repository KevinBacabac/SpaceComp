class ColourManager {
  constructor(playerNames) {
    this.colours = new Map();

    for (var name of playerNames) {
      let hueAngle = randUniform(0, 360);
      let colour = HueAngleToRGB(hueAngle);

      this.colours.set(name, colour);
    }
  }

  draw(ctx, helper) {
    var x = 50;
    var y = 20;

    ctx.font = "16pt BebasNeue-Regular";
    ctx.textAlign = "left";

    this.colours.forEach((item, i) => {
      let your_state = helper.getYourState(i);
      let planetCount = your_state.get("Planet").size;

      y += 30;
      ctx.fillStyle = item;
      ctx.fillText(`${i}: ${planetCount}`, x, y);
    });
  }

  getColour(playerName) {
    return this.colours.get(playerName);
  }
}
