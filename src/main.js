(function (window, document, undefined) {
    window.onload = init;
})(window, document, undefined);

// random color generation

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function random_color() {
    var h = Math.floor(Math.random() * 72) * 5;
    var s = (Math.random() * 0.5) + 0.5;
    var v = 1;
    var rgb = HSVtoRGB(h / 360, s, v);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
}

// drawing

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

function plot_point(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, true);
    ctx.fill();
}

function plot_centroids(ctx, centroids) {

    centroids.forEach(centroid => {
        ctx.fillStyle = centroid.c;
        centroid.children.forEach(point => {
            plot_point(ctx, point.x, point.y, 3);
        });
    });

}

// points

function generate_points(n, w, h) {
    var points = [];
    for (var i = 0; i < n; i++) {
        var point = {}
        point.x = Math.floor(Math.random() * w);
        point.y = Math.floor(Math.random() * h);
        point.centroid_index = -1;
        points.push(point);
    }
    return points;
}

function dist(a, b) {
    return Math.pow((b.x - a.x), 2) + Math.pow((b.y - a.y), 2);
}

function calculate_centroids(centroids, points) {
    var convergence = true;

    centroids.forEach(centroid => {
        centroid.children = [];
    });

    points.forEach(point => {
        var min = 2147483647;
        var cen = -1;
        for (var i = 0; i < centroids.length; i++) {
            centroid = centroids[i];
            var d = dist(point, centroid)
            if (d < min) {
                min = d;
                cen = i;
            }
        }

        centroids[cen].children.push(point);

        if (point.centroid_index != cen) {
            convergence = false;
            point.centroid_index = cen;
        }
    });

    centroids.forEach(centroid => {
        var newX = 0;
        var newY = 0;
        centroid.children.forEach(p => {
            newX += p.x;
            newY += p.y;
        });
        newX /= centroid.children.length;
        newY /= centroid.children.length;
        centroid.x = newX;
        centroid.y = newY;
    });

    if(convergence)
    {
        return centroids;
    } else
    {
        calculate_centroids(centroids,points);
    }
}

function k_means(k, points) {
    var centroids = [];
    var used_indices = [];
    for (var i = 0; i < k; i++) {
        var index = Math.floor(Math.random() * points.length);
        while (index in used_indices) {
            index = Math.floor(Math.random() * points.length);
        }
        var p = points[index];
        var centroid = {
            x: p.x,
            y: p.y,
            c: random_color()
        }
        centroids.push(centroid);
    }

    calculate_centroids(centroids, points);

    console.log("Centroids Calculated.");

    return centroids;
}

// init

function init() {

    const n = 100;
    const k = 3;

    var canvas = document.getElementById("graph");
    var ctx = canvas.getContext("2d");
    var w = ctx.canvas.width;
    var h = ctx.canvas.height;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);

    draw_graph(ctx, 10, w, h);

    var points = generate_points(n, w, h);

    var centroids = k_means(k, points);

    plot_centroids(ctx, centroids);
}