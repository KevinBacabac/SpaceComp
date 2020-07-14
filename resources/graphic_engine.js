class GraphicEngine extends Engine {
  draw(ctx, dTime) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, w, h);

    this.active.forEach((item, i) => {
      item.draw(ctx, this.colourManager);
    });

    this.explosions.draw(ctx, dTime);

    let helper = new Helper(this.active, this.events, this.getAlivePlayers());
    this.colourManager.draw(ctx, helper);
  }

  update(ctx, dTime) {
    super.update(dTime);
    this.draw(ctx, dTime);
  }
}
