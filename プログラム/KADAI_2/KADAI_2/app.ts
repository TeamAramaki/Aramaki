/// <reference path="jquery.d.ts" />
class Greeter {
    element: HTMLElement;
    span: HTMLElement;
    timerToken: number;

    constructor(element: HTMLElement) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }

    start() {
        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
    }
  


    stop() {
        clearTimeout(this.timerToken);
    }

}


window.onload = () => {


    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    greeter.start();


};


class Garden {
    private context;
    private flowers: Flower[] = [];
    private butterfly: Butterfly = null;
    private flowerSize = 20;

    constructor(public canvas: HTMLCanvasElement) {
        this.context = canvas.getContext('2d');
    }

    public draw(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var that = this;
        this.flowers.forEach(function (flower) {
            flower.draw(that.context);
        });
        if (this.butterfly) {
            this.butterfly.draw(this.context);
        }
    }

    public addFlower(x, y): void {
        this.flowers.push(new Flower(x - this.flowerSize / 2, y - this.flowerSize / 2, this.randomColor(), this.flowerSize));
        this.draw();
    }

    private randomColor(): string {
        var color = Math.floor(Math.random() * 5);
        switch (color) {
            case 0: return 'red';
            case 1: return 'yellow';
            case 2: return 'orange';
            case 3: return 'pink';
            case 4: return 'purple';
        }
    }

    public setButterfly(butterfly: Butterfly): void {
        this.butterfly = butterfly;
        this.draw();
    }

    public nearestFlower(): Flower {
        var i,
            len,
            minDistance: number = Infinity,
            nearest: Flower = null,
            d;
        for (i = 0, len = this.flowers.length; i < len; i++) {
            d = this.butterfly.distance(this.flowers[i]);
            if (minDistance > d) {
                minDistance = d;
                nearest = this.flowers[i];
            }
        }
        return nearest;
    }

    public removeFlower(flower: Flower): void {
        var i, len;
        for (i = 0, len = this.flowers.length; i < len; i++) {
            if (flower === this.flowers[i]) {
                this.flowers.splice(i, 1);
            }
        }
    }
}

class Flower {
    constructor(public x: number, public y: number, public color: string, public size: number) {
    }

    public draw(context): void {
        var oldColor: string = context.fillStyle;
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        context.fill();
        context.fillStyle = oldColor;
    }
}

class Butterfly {
    speed: number = 10;
    timer: number = null;

    constructor(private garden: Garden, public x: number, public y: number, private color: string, private size: number) {
    }

    public draw(context): void {
        var oldColor: string = context.fillStyle;
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        context.fill();
        context.fillStyle = oldColor;
    }

    public distance(flower: Flower): number {
        return Math.sqrt(Math.pow(this.x - flower.x, 2) + Math.pow(this.y - flower.y, 2));
    }

    public flyTo(flower: Flower): void {
        this.moveTo(flower);
        if (this.isCatched(flower)) {
            this.color = flower.color;
            this.garden.removeFlower(flower);
        }
    }

    public moveTo(flower: Flower): void {
        var d = this.distance(flower),
            dx = (this.x - flower.x) / d,
            dy = (this.y - flower.y) / d;
        this.x -= dx * this.speed;
        this.y -= dy * this.speed;
    }

    public isCatched(flower): bool {
        return (this.distance(flower) < this.size + flower.size);
    }

    public startFlying(): void {
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
    }

    public stopFlying(): void {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}




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

class ImageView {
    private dom: JQuery;

    constructor(id: string) {
        this.dom = $(id);
    }

    setImage(image: string) {
        this.dom.children("img").attr("src", image);
    }
}

var canvas = <HTMLCanvasElement> document.getElementById('canvas');
var garden: Garden = new Garden(canvas);
var butterfly = new Butterfly(garden, 100, 100, 'gray', 10);
garden.setButterfly(butterfly);
butterfly.startFlying();



document.onclick = function (event) {
    garden.addFlower(event.x, event.y);
};



