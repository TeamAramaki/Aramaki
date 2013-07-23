/// <reference path="jquery.d.ts" />
var Greeter = (function () {
    function Greeter(element) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }
    Greeter.prototype.start = function () {
        var _this = this;
        this.timerToken = setInterval(function () {
            return _this.span.innerHTML = new Date().toUTCString();
        }, 500);
    };

    Greeter.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };
    return Greeter;
})();

window.onload = function () {
    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    greeter.start();
};

var Garden = (function () {
    function Garden(canvas) {
        this.canvas = canvas;
        this.flowers = [];
        this.butterfly = null;
        this.flowerSize = 20;
        this.context = canvas.getContext('2d');
    }
    Garden.prototype.draw = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var that = this;
        this.flowers.forEach(function (flower) {
            flower.draw(that.context);
        });
        if (this.butterfly) {
            this.butterfly.draw(this.context);
        }
    };

    Garden.prototype.addFlower = function (x, y) {
        this.flowers.push(new Flower(x - this.flowerSize / 2, y - this.flowerSize / 2, this.randomColor(), this.flowerSize));
        this.draw();
    };

    Garden.prototype.randomColor = function () {
        var color = Math.floor(Math.random() * 5);
        switch (color) {
            case 0:
                return 'red';
            case 1:
                return 'yellow';
            case 2:
                return 'orange';
            case 3:
                return 'pink';
            case 4:
                return 'purple';
        }
    };

    Garden.prototype.setButterfly = function (butterfly) {
        this.butterfly = butterfly;
        this.draw();
    };

    Garden.prototype.nearestFlower = function () {
        var i, len, minDistance = Infinity, nearest = null, d;
        for (i = 0, len = this.flowers.length; i < len; i++) {
            d = this.butterfly.distance(this.flowers[i]);
            if (minDistance > d) {
                minDistance = d;
                nearest = this.flowers[i];
            }
        }
        return nearest;
    };

    Garden.prototype.removeFlower = function (flower) {
        var i, len;
        for (i = 0, len = this.flowers.length; i < len; i++) {
            if (flower === this.flowers[i]) {
                this.flowers.splice(i, 1);
            }
        }
    };
    return Garden;
})();

var Flower = (function () {
    function Flower(x, y, color, size) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
    }
    Flower.prototype.draw = function (context) {
        var oldColor = context.fillStyle;
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        context.fill();
        context.fillStyle = oldColor;
    };
    return Flower;
})();

var Butterfly = (function () {
    function Butterfly(garden, x, y, color, size) {
        this.garden = garden;
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.speed = 10;
        this.timer = null;
    }
    Butterfly.prototype.draw = function (context) {
        var oldColor = context.fillStyle;
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        context.fill();
        context.fillStyle = oldColor;
    };

    Butterfly.prototype.distance = function (flower) {
        return Math.sqrt(Math.pow(this.x - flower.x, 2) + Math.pow(this.y - flower.y, 2));
    };

    Butterfly.prototype.flyTo = function (flower) {
        this.moveTo(flower);
        if (this.isCatched(flower)) {
            this.color = flower.color;
            this.garden.removeFlower(flower);
        }
    };

    Butterfly.prototype.moveTo = function (flower) {
        var d = this.distance(flower), dx = (this.x - flower.x) / d, dy = (this.y - flower.y) / d;
        this.x -= dx * this.speed;
        this.y -= dy * this.speed;
    };

    Butterfly.prototype.isCatched = function (flower) {
        return (this.distance(flower) < this.size + flower.size);
    };

    Butterfly.prototype.startFlying = function () {
        var that = this;
        if (this.timer) {
            return;
        }
        this.timer = setInterval(function () {
            var flower = that.garden.nearestFlower();
            if (!flower) {
                return;
            }
            that.flyTo(flower);
            garden.draw();
        }, 100);
    };

    Butterfly.prototype.stopFlying = function () {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    };
    return Butterfly;
})();

//class EV {
//    constructor(public row: number, public column: number) {
//        this.element = $("<div class='cell notBombed'></div>")[0];
//    }
//    speed: number = 10;
//    timer: number = null;
//    private positioningEnabled: bool;
//    playerTurn = false;          // Set to true when player can move
//    onEvent: Function;           // Callback function when an action on the board occurs
//    shipSizes = [5, 4, 3, 3, 2];
//     dragAndDropEnabled(val: bool) {
//        var cells = $(this.element).children(".cell");
//        var ships = $(this.element).children(".ship");
//        this.positioningEnabled = val;
//        ships.draggable("option", "disabled", !val);
//        cells.droppable("option", "disabled", !val);
//    }
//    public Image(context): void {
//        var oldColor: string = context.fillStyle;
//        context.beginPath();
//        context.fillStyle = this.color;
//        context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
//        context.fill();
//        context.fillStyle = oldColor;
//    }
//    public distance(flower: Flower): number {
//        return Math.sqrt(Math.pow(this.x - flower.x, 2) + Math.pow(this.y - flower.y, 2));
//    }
//}
//$(new Function("var game = new Game();"));
var ImageView = (function () {
    function ImageView(id) {
        this.dom = $(id);
    }
    ImageView.prototype.setImage = function (image) {
        this.dom.children("img").attr("src", image);
    };
    return ImageView;
})();

var canvas = document.getElementById('canvas');
var garden = new Garden(canvas);
var butterfly = new Butterfly(garden, 100, 100, 'gray', 10);
garden.setButterfly(butterfly);
butterfly.startFlying();

document.onclick = function (event) {
    garden.addFlower(event.x, event.y);
};
//@ sourceMappingURL=app.js.map
