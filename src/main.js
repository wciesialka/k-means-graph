(function (window, document, undefined) {
    window.onload = init;
})(window, document, undefined);

function line(ctx, x1, y1, x2, y2) {
    ctx.save();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
}


function draw_graph(ctx, space, w, h) {
    for (var i = space; i < w; i += space) {
        ctx.strokeStyle = "#3F3F3F"
        line(ctx, 0, i, w, i);
        line(ctx, i, 0, i, h);
    }
}

function generate_points(n, w, h) {
    var points = [];
    for (var i = 0; i < n; i++) {
        var point = {}
        point.x = Math.floor(Math.random() * w);
        point.y = Math.floor(Math.random() * h);
        points.push(point);
    }
    return points;
}

function point(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, true);
    ctx.fill();
}

function plot_points(ctx, points) {
    points.forEach(function(element) {
        point(ctx, element.x, element.y, 3)
    });
}

function init() {
    var canvas = document.getElementById("graph");
    var ctx = canvas.getContext("2d");
    var w = ctx.canvas.width;
    var h = ctx.canvas.height;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);

    draw_graph(ctx, 10, w, h);

    var points = generate_points(100,w,h);

    ctx.fillStyle = "red";
    plot_points(ctx,points);

    draw_graph(canvas);
}