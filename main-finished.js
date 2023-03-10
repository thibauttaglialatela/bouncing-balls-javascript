// set up canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

let para = document.querySelector('p');

// function to generate random number

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
    return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape {

    constructor(x, y, velX, velY, exists) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.exists = exists;
    }
}

class Ball extends Shape {
    constructor(x, y, velX, velY, exists, color, size) {
        super(x, y, velX, velY, exists)
        this.color = color;
        this.size = size;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    update() {
        if ((this.x + this.size) >= width) {
            this.velX = -(Math.abs(this.velX));
        }

        if ((this.x - this.size) <= 0) {
            this.velX = Math.abs(this.velX);
        }

        if ((this.y + this.size) >= height) {
            this.velY = -(Math.abs(this.velY));
        }

        if ((this.y - this.size) <= 0) {
            this.velY = Math.abs(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    collisionDetect() {
        for (const ball of balls) {
            if (!(this === ball)) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + ball.size) {
                    ball.color = this.color = randomRGB();
                }
            }
        }
    }

}

class EvilCircle extends Shape {
    constructor(x, y, velX, velY, exists, color, size) {
        super(x, y, velX, velY, exists);
        this.color = color;
        this.size = size;
    }

    draw() {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
    }

    checkBounds() {
        if ((this.x + this.size) >= width) {
            this.x -= this.size;
        }

        if ((this.x - this.size) <= 0) {
            this.x += this.size;
        }

        if ((this.y + this.size) >= height) {
            this.y -= this.size;
        }

        if ((this.y - this.size) <= 0) {
            this.y += this.size;
        }

    }

    setControls() {
        let _this = this;
        window.addEventListener("keydown", (event) => {
            switch (event.code) {
                case 'ArrowLeft':
                    _this.x -= _this.velX;
                    break;
                case 'ArrowRight':
                    _this.x += _this.velX;
                    break;
                case "ArrowUp":
                    _this.y -= _this.velY;
                    break;
                case "ArrowDown":
                    _this.y += _this.velY;
                    break;

                default:
                    break;
            }
        })
    }

    collisionDetect() {
        for (const ball of balls) {
            if (ball.exists) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + ball.size) {
                    ball.exists = false;
                    ballCount--;
                    para.innerText = "Ball Count: " + ballCount;
                }
            }
        }
    }
}

const balls = [];


while (balls.length < 25) {
    const size = random(10, 20);
    const ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas, to avoid drawing errors
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        true,
        randomRGB(),
        size
    );

    balls.push(ball);
}

let ballCount = balls.length;

const viseur = new EvilCircle(random(0, width), random(0, height), 20, 20, true, 'white', 10);
viseur.setControls();

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);


    for (const ball of balls) {
        if (ball.exists === true) {
            ball.draw();
            ball.update();
            ball.collisionDetect();
        }
        viseur.draw();
        viseur.checkBounds();
        viseur.collisionDetect();
    }


    requestAnimationFrame(loop);
}

loop();

//affichage du score


para.innerText = "Ball Count: " + ballCount;
