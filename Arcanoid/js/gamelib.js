function Game() {
    "use strict";

    var gameover = false;
    var winner = false;
    var newResizer = new Resizer();
    var canvas = document.getElementById("aCanvas"),
        ctx = canvas.getContext('2d'),
        newPlatform = new Platform(canvas.width, canvas.height),
        scale = newResizer.GetScale();

    var audioPlatform = new Audio('./sound/platform.wav');
    var audioBrick = new Audio('./sound/brick.wav');
    var audioFale = new Audio('./sound/fale.wav');
    var audioBonus;

    var m = 9;
    var n = 12;
    var colors = ["#5b6dfb", "#6cbb73", "#f73737", "#6cbb73", "#5b6dfb", "#6cbb73", "#5b6dfb"];
    var bricks = new Array(m);
    var newPlayer;

    var CONST_TEXT_START = "PUSH LEFT MOUSE BUTTON TO START";
    var CONST_TEXT_GAMEOVER = "GAME OVER";
    var CONST_TEXT_WINNER = "WINNER";

    this.Init = function () {
        canvas.addEventListener("mouseenter", MouseEnterHandler, false);
        canvas.addEventListener("mouseleave", MouseLeaveHandler, false);
        canvas.addEventListener("mousemove", MouseMoveHandler, false);
        canvas.addEventListener("mousedown", MouseClickHandler, false);
        canvas.addEventListener("MSHoldVisual", function (e) { e.preventDefault(); }, false);
        canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); }, false);
        newResizer.resize();
        newPlayer = new Player(canvas);
        for (var i = 0; i < bricks.length; i++) {
            bricks[i] = new Array(n);
        }
        for (var i = 0; i < m; i++) {
            for (var j = 0; j < n; j++) {
                bricks[i][j] = {
                    x: 0,
                    y: 0,
                    width: 50,
                    height: 20,
                    destroyed: false,
                    color: "green",
                    bonus: false,
                    life: 1
                };
                bricks[i][j].x = (canvas.width - n * bricks[i][j].width) / 2 + (j) * bricks[i][j].width + 1;
                bricks[i][j].y = 50 + (i - 1) * bricks[i][j].height + 1;
                bricks[i][j].color = colors[Math.floor(Math.random() * 7)];
                if (bricks[i][j].color == "#f73737") {
                    bricks[i][j].life = 2;
                    bricks[i][j].bonus = true;
                }
            }
        }
        Play();
    };

    var bonusType = [1, 2, 4, 5, 1, 2, 4, 5, 1, 2, 4, 5, 3];
    var bonusImages = ['./img/plus.gif', './img/minus.gif', './img/Heart.gif', './img/bcrist.gif', './img/rcrist.gif', './img/balls.gif'];
    var bonusArray = [];
    var ball = {
        x: 0,
        y: 0,
        radius: 6,
        speed: 6,
        dx: 0,
        dy: 0,
        collor: "#dc4106",
        onPlatform: true,
        CheckContact: function (_x, _y, _width, _height) {
            var brickRect = { x: _x, y: _y, width: _width, height: _height };
            var ballRect = {
                x: (ball.x - ball.radius),
                y: (ball.y - ball.radius),
                width: 2 * ball.radius,
                height: 2 * ball.radius
            };

            if ((brickRect.x < ballRect.x + ballRect.width) && (brickRect.x + brickRect.width > ballRect.x) &&
                (brickRect.y < ballRect.y + ballRect.height) && (brickRect.height + brickRect.y > ballRect.y)) {
                if ((ballRect.x > brickRect.x) && (ballRect.x < brickRect.x + brickRect.width) &&
                    (ballRect.y + ballRect.height > brickRect.y) && (ballRect.y + ballRect.height < brickRect.y + brickRect.height)) {
                    if ((ballRect.x + ballRect.width > brickRect.x) && (ballRect.x + ballRect.width < brickRect.x + brickRect.width)) {
                        ball.dy = -ball.dy;
                        return true;
                    }
                    else
                        if ((ballRect.x > brickRect.x) && (ballRect.x < brickRect.x + brickRect.width) &&
                            (ballRect.y > brickRect.y) && (ballRect.y < brickRect.y + brickRect.height))
                            ball.dx = -ball.dx;
                        else {
                            if (ball.dy > 0)
                                ball.dy = -ball.dy;
                            if (ball.dx < 0)
                                ball.dx = -ball.dx;
                        }
                    return true;
                }

                if ((ballRect.x + ballRect.width > brickRect.x) && (ballRect.x + ballRect.width < brickRect.x + brickRect.width) &&
                    (ballRect.y + ballRect.height > brickRect.y) && (ballRect.y + ballRect.height < brickRect.y + brickRect.height)) {
                    if ((ballRect.y > brickRect.y) && (ballRect.y < brickRect.y + brickRect.height)) {
                        ball.dx = -ball.dx;
                        return true;
                    }
                    else {
                        if (ball.dy > 0)
                            ball.dy = -ball.dy;
                        if (ball.dx > 0)
                            ball.dx = -ball.dx;
                    }

                    return true;
                }

                if ((ballRect.x + ballRect.width > brickRect.x) && (ballRect.x + ballRect.width < brickRect.x + brickRect.width) &&
                    (ballRect.y > brickRect.y) && (ballRect.y < brickRect.y + brickRect.height)) {
                    if ((ballRect.x > brickRect.x) && (ballRect.x < brickRect.x + brickRect.width))
                        ball.dy = -ball.dy;
                    else {
                        if (ball.dy < 0)
                            ball.dy = -ball.dy;
                        if (ball.dx > 0)
                            ball.dx = -ball.dx;
                    }
                    return true;
                }

                if ((ballRect.x > brickRect.x) && (ballRect.x < brickRect.x + brickRect.width) &&
                    (ballRect.y > brickRect.y) && (ballRect.y < brickRect.y + brickRect.height)) {
                    if (ball.dy < 0)
                        ball.dy = -ball.dy;
                    if (ball.dx < 0)
                        ball.dx = -ball.dx;
                    return true;
                }
            }
            return false;
        }
    };
    var mouse = {
        active: false,
        x: 0,
        y: 0
    };

    function MouseLeaveHandler(e) {
        mouse.active = false;
    };
    function MouseEnterHandler(e) {
        mouse.active = true;
    };
    function MouseMoveHandler(e) {
        scale = newResizer.GetScale();
        mouse.x = e.layerX * scale.x;
    };
    function MouseClickHandler(e) {
        if (ball.onPlatform)
            ball.onPlatform = false;
    };

    function Update() {
        if (mouse.active) {
            newPlatform.x = mouse.x - newPlatform.width / 2;
            if (newPlatform.x <= 0)
                newPlatform.x = 0;
            if (newPlatform.x + newPlatform.width >= canvas.width)
                newPlatform.x = canvas.width - newPlatform.width;
        };
        if (ball.onPlatform) {
            ball.x = newPlatform.x + newPlatform.width / 2;
            ball.y = newPlatform.y - ball.radius;
            ball.dy = -ball.speed;
            ball.dx = ball.speed;
        } else {
            if (newPlayer.bricks == n * m)
                winner = true;
            if (((ball.x + ball.radius) > canvas.width) || ((ball.x - ball.radius) < 0))
                ball.dx = -ball.dx;
            if ((ball.y - ball.radius) < 0)
                ball.dy = -ball.dy;
            if (ball.CheckContact(newPlatform.x, newPlatform.y, newPlatform.width, newPlatform.height))
                audioPlatform.play();
            if (bonusArray.length > 0)
                for (var i = 0; i < bonusArray.length; i++) {
                    bonusArray[i].y += bonusArray[i].dy;
                }
            for (var i = 0; i < bonusArray.length; i++) {
                if (bonusArray[i].CheckContact(newPlatform.x, newPlatform.y, newPlatform.width, newPlatform.height)) {                   
                    switch (bonusArray[i].type) {
                        case 1:
                            newPlatform.width += 15;
                            newPlayer.score += 30;
                            break;
                        case 2:
                            newPlatform.width -= 15;
                            newPlayer.score += 50;
                            break;
                        case 3:
                            newPlayer.life += 1;
                            newPlayer.score += 20;
                            break;
                        case 4:
                            newPlayer.score += 150;
                            break;
                        case 5:
                            newPlayer.score += 200;
                            break;
                        case 6:
                            break;
                    };
                    audioBonus = new Audio('./sound/bonus.wav');
                    audioBonus.play();
                    bonusArray.splice(i, 1);
                }
            }
            if ((ball.y - ball.radius) > canvas.height) {
                audioFale.play();
                newPlayer.life -= 1;
                if (newPlayer.life == 0)
                    gameover = true;
                else
                    ball.onPlatform = true;
            }
            if ((ball.y + ball.radius) < (bricks[0][0].height * m + bricks[0][0].height + 50))
                loop: {
                for (var i = 0; i < m; i++) {
                    for (var j = 0; j < n; j++) {
                        if (!bricks[i][j].destroyed)
                            if (ball.CheckContact(bricks[i][j].x, bricks[i][j].y, bricks[i][j].width, bricks[i][j].height)) {
                                if (bricks[i][j].life == 1) {
                                    bricks[i][j].destroyed = true;
                                    if (bricks[i][j].color == "#f73737") {
                                        newPlayer.score += 20;
                                        newPlayer.bricks += 1;
                                        bonusArray[bonusArray.length] = {
                                            type: bonusType[Math.floor(Math.random() * 7)],
                                            image: new Image(),
                                            x: bricks[i][j].x + bricks[i][j].width / 2,
                                            y: bricks[i][j].y + bricks[i][j].height,
                                            width: 20,
                                            height: 20,
                                            dy: ball.speed / 2,
                                            DrawBonus: function () {
                                                this.image.src = bonusImages[this.type - 1];
                                                ctx.drawImage(this.image, this.x - 7, this.y, this.width, this.height);
                                            },
                                            CheckContact: function (_x, _y, _width, _height) {
                                                if ((_x < this.x + this.width) && (_x + _width > this.x) &&
                                                    (_y < this.y + this.height) && (_y + _height > this.y))
                                                    return true;
                                                else
                                                    return false;
                                            }
                                        };
                                    }
                                    else {
                                        newPlayer.score += 10;
                                        newPlayer.bricks += 1;
                                    }
                                }
                                else
                                    bricks[i][j].life = 1;
                                if (bricks[i][j].color != "#f73737") {
                                    audioBrick = new Audio('./sound/brick.wav');
                                    audioBrick.play();
                                } else {
                                    audioBrick = new Audio('./sound/boombrick.wav');
                                    audioBrick.play();
                                }
                                break loop;
                            }
                    }
                }
            }
            ball.x += ball.dx;
            ball.y += ball.dy;
        }
    };
    function Draw() {
        canvas.width = canvas.width;
        if (ball.onPlatform) {
            ctx.fillStyle = "white";
            ctx.font = "30px Arial";
            ctx.fillText(CONST_TEXT_START, canvas.width / 2 - 280, canvas.height / 2 - 30);
        }
        if (gameover) {
            ctx.fillStyle = "white";
            ctx.font = "50px Arial";
            ctx.fillText(CONST_TEXT_GAMEOVER, canvas.width / 2 - 155, canvas.height / 2 - 30);
        }
        if (winner) {
            ctx.fillStyle = "white";
            ctx.font = "50px Arial";
            ctx.fillText(CONST_TEXT_WINNER, canvas.width / 2 - 100, canvas.height / 2 - 30);
        }
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("SCORE: " + newPlayer.score, 10, canvas.height - 15);
        ctx.fillStyle = ball.collor;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        for (var i = 0; i < bonusArray.length; i++) {
            bonusArray[i].DrawBonus();
        }
        ctx.fillStyle = 'darkblue';
        ctx.fillRect(newPlatform.x, newPlatform.y, newPlatform.width, newPlatform.height);
        for (var i = 0; i < m; i++) {
            for (var j = 0; j < n; j++) {
                if (!bricks[i][j].destroyed) {
                    ctx.fillStyle = bricks[i][j].color;
                    if ((ctx.fillStyle == "#f73737") && (bricks[i][j].life == 1))
                        ctx.globalAlpha = 0.5;
                    ctx.fillRect(bricks[i][j].x, bricks[i][j].y, bricks[i][j].width, bricks[i][j].height);
                    ctx.globalAlpha = 1;
                    ctx.fillStyle = 'black';
                    ctx.strokeRect(bricks[i][j].x, bricks[i][j].y, bricks[i][j].width, bricks[i][j].height);
                }
            }
        }
        newPlayer.DrawLife();
    };
    function Play() {
        if (!gameover && !winner)
            Update();
        Draw();
        window.requestAnimationFrame(Play);
    };
};

function Platform(canvasHeight, canvasWidth) {
    this.width = 90;
    this.height = 15;
    this.x = canvasWidth / 2 - this.width / 2;
    this.y = canvasHeight - 1 / 9 * canvasHeight;
};
function Resizer() {
    var inputScale = {
        x: 1,
        y: 1,
        offsetX: 0,
        offsetY: 0
    };

    this.resize = function resize() {
        var canvas = document.getElementById("aCanvas");
        var targetAspect = canvas.width / canvas.height,
            newWidth = window.innerWidth,
            newHeight = window.innerHeight,
            newAspect = newWidth / newHeight;

        if (newAspect > targetAspect) {
            newWidth = newHeight * targetAspect;
            canvas.style.height = newHeight + "px";
            canvas.style.width = newWidth + "px";
            var offsetLeft = (window.innerWidth - newWidth) / 2;
            canvas.style.left = offsetLeft + "px";
            canvas.style.top = "0px";
            inputScale.offsetX = offsetLeft;
            inputScale.offsetY = 0;
        } else {
            newHeight = newWidth / targetAspect;
            canvas.style.width = newWidth + "px";
            canvas.style.height = newHeight + "px";
            var offsetTop = (window.innerHeight - newHeight) / 2
            canvas.style.top = offsetTop + "px";
            canvas.style.left = "0px";
            inputScale.offsetX = 0;
            inputScale.offsetY = offsetTop;
        }

        inputScale.x = canvas.width / newWidth;
        inputScale.y = canvas.height / newHeight;
    }

    window.addEventListener("resize", this.resize, false);
    window.addEventListener("orientationchange", this.resize, false);

    this.GetScale = function () {
        return {
            x: inputScale.x,
            y: inputScale.y,
            offsetX: inputScale.offsetX,
            offsetY: inputScale.offsetY
        };
    }
};
function Player(canvas) {
    this.life = 3;
    this.score = 0;
    this.bricks = 0;
    var image = new Image();
    image.src = './img/Heart.gif';
    var ctx = canvas.getContext('2d');
    this.DrawLife = function () {
        if (this.life!=0)
            for (var i = 0; i < this.life; i++) {
                ctx.drawImage(image, canvas.width - 30 - i * 20, canvas.height - 30, 15, 15);
            }
    };
};