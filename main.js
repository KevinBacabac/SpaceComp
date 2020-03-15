var canvas;
var explosionsOn = true;

$(document).ready(() => {
  document.body.onmousedown = () => { return false; } // so page is unselectable

	// Canvas stuff
	canvas = $("#canvas")[0];
  addListeners(canvas);
	ctx = canvas.getContext("2d");
	w = $("#canvas").width();
	h = $("#canvas").height();

	init();
});

function init() {
  game = new GraphicEngine();
  setInterval(() => {
    game.doTurn();
  }, 1000);

  start = null;
	requestAnimationFrame(paint);
}

////////	Main Game Engine
function paint(timestamp) {
  if (!start) start = timestamp;  // First frame
  var dTime = (timestamp - start) / 1000;

  game.update(ctx, dTime);

  start = timestamp;
  requestAnimationFrame(paint);
}
