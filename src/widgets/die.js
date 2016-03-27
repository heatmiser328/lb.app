var dicex       = 25;        // Position of dice (x)
var dicey       = 25;        // Position of dice (y)
var dicew       = 100;       // Dice width
var diceh       = 100;       // Dice height
var dotrad      = 3;         // Radius of dots on dice face

function dieDrawface(ctx, dieColor, dotColor, n) {

    ctx.lineWidth = 2;
    ctx.clearRect(dicex,dicey,dicew,diceh);

    ctx.fillStyle = dieColor;
    ctx.fillRect(dicex,dicey,dicew,diceh);

    ctx.fillStyle = "#000000";
    ctx.strokeRect(dicex,dicey,dicew,diceh);

    ctx.fillStyle = dotColor;

    switch (n) {

        case 1:
            dieDraw1(ctx);
            break;

        case 2:
            dieDraw2(ctx);
            break;

        case 3:
            dieDraw2(ctx);
            dieDraw1(ctx);
            break;

        case 4:
            dieDraw2(ctx);
            dieDraw2(ctx, true);
            break;

        case 5:
            dieDraw2(ctx);
            dieDraw2(ctx, true);
            dieDraw1(ctx);
            break;

        case 6:
            dieDraw2(ctx);
            dieDraw2(ctx,true);
            dieDraw2mid(ctx);
            break;
    }
}

/*
 * This function draws a dot in the center of the die.
 */
function dieDraw1(ctx) {

    var dot_x;
    var dot_y;

    ctx.beginPath();
    dot_x = dicex + .5 * dicew;
    dot_y = dicey + .5 * diceh;
    ctx.arc( dot_x, dot_y, dotrad, 0, Math.PI * 2);//, true );
    ctx.closePath();
    ctx.fill();
}

/*
 * This function draws a dot in two oposit corners (lower right and upper left).
 * If reverse is true it draws the dots in the oposite corners.
 */
function dieDraw2(ctx,reverse) {

    reverse = typeof(reverse) != 'undefined' ? reverse : false;

    var dot_x;
    var dot_y;

    ctx.beginPath();
    dot_x = dicex + 3 * dotrad;
    dot_y = reverse ? dicey + diceh - 3 * dotrad : dicey + 3 * dotrad;
    ctx.arc( dot_x, dot_y, dotrad, 0, Math.PI * 2);//, true );

    dot_x = dicex + dicew - 3 * dotrad;
    dot_y = reverse ? dicey + 3 * dotrad : dicey + diceh - 3 * dotrad;
    ctx.arc( dot_x, dot_y, dotrad, 0, Math.PI * 2);//, true );

    ctx.closePath();
    ctx.fill();

}

/*
 * This function draws two dots on either side (left and right) centered vertically
 * on the y axis. It is used to create the '6'.
 */
function dieDraw2mid(ctx) {

    var dot_x;
    var dot_y;

    ctx.beginPath();
    dot_x = dicex + 3 * dotrad;
    dot_y = dicey + .5 * diceh;
    ctx.arc( dot_x, dot_y, dotrad, 0, Math.PI * 2);//, true );

    dot_x = dicex + dicew - 3 * dotrad;
    ctx.arc( dot_x, dot_y, dotrad, 0, Math.PI * 2);//, true );

    ctx.closePath();
    ctx.fill();

}

function create(layout, color, dot, value) {
    var canvasBounds = {};
    var dieColor = color;
    var dotColor = dot;
    dicex = 0;
    dicey = 0;
    dicew = layout.width;
    diceh = layout.height;

    var dieCanvas = new tabris.Canvas({
        layoutData: layout
    }).on("resize", function(canvas, bounds) {
        canvasBounds = bounds;
        var ctx = canvas.getContext("2d", bounds.width, bounds.height);
        dieDrawface(ctx, dieColor, dotColor, value);
    });
    dieCanvas.set = function(v) {
        var ctx = dieCanvas.getContext("2d", canvasBounds.width, canvasBounds.height);
        dieDrawface(ctx, dieColor, dotColor, v);
    }

    return dieCanvas;
}

module.exports = {
    create: function(layout, color, dot, value) {
        return create(layout, color, dot, value);
    }
};
