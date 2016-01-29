var n = 25;
var m = 25;
var si, sj;
var corrAttribute;
var arrayLabirint = new Array(n);
var ctx;

$(function () {
    drawLabirint(n, m);
    //     $("#myCanvas").bind("click",function (evt){
    //         var ctx = this.getContext('2d');
    //         var rect = this.getBoundingClientRect();    
    //         var x= evt.clientX - rect.left;
    //         var y= evt.clientY - rect.top;
    //         var i = Math.floor(x/22);
    //         var j = Math.floor(y/22);
    //         console.log(i+ " " + j);
    //         if (isBottomEdge(i,j,ctx))
    //             console.log("Net prohoda snizu");
    //         if (isRightEdge(i,j,ctx))
    //             console.log("Net prohoda sprava"); 
    // });   
});

function isBottomEdge(j, i, ctx) {
    var imgData = ctx.getImageData((i) * 22 + 10, (j) * 22 + 19, 1, 7);
    for (var index = 0; index < imgData.data.length; index += 4) {
        if ((imgData.data[index] == 0) && (imgData.data[index + 1] == 0) && (imgData.data[index + 2] == 0) && (imgData.data[index + 3] == 255))
            return true;
    }
    return false;
}

function isRightEdge(j, i, ctx) {
    var imgData = ctx.getImageData((i) * 22 + 19, (j) * 22 + 10, 7, 1);
    for (var index = 0; index < imgData.data.length; index += 4) {
        if ((imgData.data[index] == 0) && (imgData.data[index + 1] == 0) && (imgData.data[index + 2] == 0) && (imgData.data[index + 3] == 255))
            return true;
    }
    return false;
}

//Поиск пути, на данный момент 3 часа
function findPass(ctx, n, m) {
    for (var i = 0; i < m; i++) {
        arrayLabirint[i] = new Array(m);
        for (var j = 0; j < n; j++) {
            arrayLabirint[i][j] = -1;
        }
    }

    arrayLabirint[m - 1][0] = 0;
    arrayLabirint[0][n - 1] = -2;

    var attribute = 0;

    var path_found = false;

    ctx.fillStyle = 'yellow';

    // распространение волны
    while (!path_found) {
        for (var i = 0; i < m; i++)
            for (var j = 0; j < n; j++)
                if (arrayLabirint[i][j] == attribute) {
                    // ячейка сверху
                    if (i != 0)
                        if (!isBottomEdge(i - 1, j, ctx)) {
                            if (arrayLabirint[i - 1][j] == -1)
                                arrayLabirint[i - 1][j] = attribute + 1;
                            else if (arrayLabirint[i - 1][j] == -2) {
                                path_found = true;
                                arrayLabirint[i - 1][j] = attribute + 1;
                            }
                        }
                    // ячейка слева
                    if (j != 0)
                        if (!isRightEdge(i, j - 1, ctx)) {
                            if (arrayLabirint[i][j - 1] == -1)
                                arrayLabirint[i][j - 1] = attribute + 1;
                            else if (arrayLabirint[i][j - 1] == -2) {
                                path_found = true;
                                arrayLabirint[i][j - 1] = attribute + 1;
                            }
                        }
                    // ячейка снизу
                    if (i != m - 1)
                        if (!isBottomEdge(i, j, ctx)) {
                            if (arrayLabirint[i + 1][j] == -1)
                                arrayLabirint[i + 1][j] = attribute + 1;
                            else if (arrayLabirint[i + 1][j] == -2) {
                                path_found = true;
                                arrayLabirint[i + 1][j] = attribute + 1;
                            }
                        }
                    // ячейка справа
                    if (j != n + 1)
                        if (!isRightEdge(i, j, ctx)) {
                            if (arrayLabirint[i][j + 1] == -1)
                                arrayLabirint[i][j + 1] = attribute + 1;
                            else if (arrayLabirint[i][j + 1] == -2) {
                                path_found = true;
                                arrayLabirint[i][j + 1] = attribute + 1;
                            }
                        }
                }

        // Есть ли дальше возможность для распространения волны, если нет и путь всё ещё не найден,
        // то решения у лабиринта нет
        var maxAttribute = 0;
        for (var i = 0; i < m; i++)
            for (var j = 0; j < n; j++) {
                if (maxAttribute < arrayLabirint[i][j])
                    maxAttribute = arrayLabirint[i][j];
            }

        if (maxAttribute == attribute) {
            alert("Labirint dont have any solution!");
            return;
        }
        attribute++;
    }
    sj = n - 1;
    si = 0;
    corrAttribute = maxAttribute;
    ctx.fillStyle = 'green';
    setTimeout("paintPath()", 150);
}

//Рисуем путь по построенному массиву Ли
function paintPath() {
if (corrAttribute == 0) {
        ctx.fillRect(4, si * 22 + 4, 14, 14);
        clearTimeout();
        return;
    }
    
    // ячейка сверху
    if (si != 0)
        if (arrayLabirint[si - 1][sj] == (corrAttribute - 1)) {
            if (!isBottomEdge(si - 1, sj, ctx)) {
                corrAttribute--;
                si--;
                ctx.fillRect(sj * 22 + 4, (si) * 22 + 4, 14, 36);
                setTimeout("paintPath ()", 150);
                return;
            }
        }
            
    // ячейка слева
    if (sj != 0)
        if (arrayLabirint[si][sj - 1] == (corrAttribute - 1)) {
            if (!isRightEdge(si, sj - 1, ctx)) {
                corrAttribute--;
                sj--;
                ctx.fillRect((sj) * 22 + 4, si * 22 + 4, 36, 14);
                setTimeout("paintPath ()", 150);
                return;
            }
        }
            
    // ячейка снизу
    if (si != m - 1)
        if (arrayLabirint[si + 1][sj] == (corrAttribute - 1)) {
            if (!isBottomEdge(si, sj, ctx)) {
                si++;
                corrAttribute--;
                ctx.fillRect(sj * 22 + 4, (si - 1) * 22 + 4, 14, 36);
                setTimeout("paintPath ()", 150);
                return;
            }
        }
            
    // ячейка справа
    if (sj != n - 1)
        if (arrayLabirint[si][sj + 1] == (corrAttribute - 1)) {
            if (!isRightEdge(si, sj, ctx)) {
                sj++;
                corrAttribute--;
                ctx.fillRect((sj - 1) * 22 + 4, si * 22 + 4, 36, 14);
                setTimeout("paintPath ()", 150);
                return;
            }
        }
}

//Рисуем лабиринт (Потратил 2,5 часа)
function drawLabirint(n, m) {
    var canvas = document.getElementById('myCanvas');
    canvas.width = 22 * n;
    canvas.height = 22 * m;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = 'green';
    ctx.fillRect((n - 1) * 22, 0, 22, 22);
    ctx.fillStyle = 'red';
    ctx.fillRect(0, (m - 1) * 22, 22, 22);
    cutLabirint(0, 0, canvas.width, canvas.height, ctx);
    findPass(ctx, n, m);
}

//Разделяем на прямоугольники
function cutLabirint(sx, sy, fx, fy, ctx) {
    var nx = (fx - sx) / 22;
    var ny = (fy - sy) / 22;
    if ((nx > 1) && (ny > 1)) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'square';
        //Режим по x
        var cx = Math.floor(Math.random() * (nx - 1)) + 1;
        
        //Режим по y
        var cy = Math.floor(Math.random() * (ny - 1)) + 1;

        var rndy, rndx;
        
        //Делаем проходы в трех случайных (нужно подумать и оптимизировать)
        var notCutPass = Math.floor(Math.random() * 4) + 1;
        switch (notCutPass) {
            case 1:
                //Первая вертикальная
                rndy = (Math.floor(Math.random() * (cy - 1)) + 0) * 22;
                ctx.beginPath();
                ctx.moveTo(sx + cx * 22, sy);
                ctx.lineTo(sx + cx * 22, sy + rndy);
                ctx.moveTo(sx + cx * 22, sy + rndy + 22);
                ctx.lineTo(sx + cx * 22, sy + cy * 22);
                ctx.stroke();
                
                //Вторая вертикальная
                rndy = (Math.floor(Math.random() * (ny - cy - 1)) + 0) * 22;
                ctx.beginPath();
                ctx.moveTo(sx + cx * 22, sy + cy * 22);
                ctx.lineTo(sx + cx * 22, sy + cy * 22 + rndy);
                ctx.moveTo(sx + cx * 22, sy + cy * 22 + rndy + 22);
                ctx.lineTo(sx + cx * 22, fy);
                ctx.stroke();
                
                //Первая горизонтальная
                ctx.beginPath();
                ctx.moveTo(sx, sy + cy * 22);
                ctx.lineTo(sx + cx * 22, sy + cy * 22);
                ctx.stroke();
                
                //Вторая горизонтальная
                rndx = (Math.floor(Math.random() * (nx - cx - 1)) + 0) * 22;
                ctx.beginPath();
                ctx.moveTo(sx + cx * 22, sy + cy * 22);
                ctx.lineTo(sx + cx * 22 + rndx, sy + cy * 22);
                ctx.moveTo(sx + cx * 22 + rndx + 22, sy + cy * 22);
                ctx.lineTo(fx, sy + cy * 22);
                ctx.stroke();
                break;
            case 2:
                //Первая вертикальная
                ctx.beginPath();
                ctx.moveTo(sx + cx * 22, sy);
                ctx.lineTo(sx + cx * 22, sy + cy * 22);
                ctx.stroke();
                
                //Вторая вертикальная
                rndy = (Math.floor(Math.random() * (ny - cy - 1)) + 0) * 22;
                ctx.beginPath();
                ctx.moveTo(sx + cx * 22, sy + cy * 22);
                ctx.lineTo(sx + cx * 22, sy + cy * 22 + rndy);
                ctx.moveTo(sx + cx * 22, sy + cy * 22 + rndy + 22);
                ctx.lineTo(sx + cx * 22, fy);
                ctx.stroke();
                
                //Первая горизонтальная
                rndx = (Math.floor(Math.random() * (cx - 1)) + 0) * 22;
                ctx.beginPath();
                ctx.moveTo(sx, sy + cy * 22);
                ctx.lineTo(sx + rndx, sy + cy * 22);
                ctx.moveTo(sx + rndx + 22, sy + cy * 22);
                ctx.lineTo(sx + cx * 22, sy + cy * 22);
                ctx.stroke();
                
                //Вторая горизонтальная
                rndx = (Math.floor(Math.random() * (nx - cx - 1)) + 0) * 22;
                ctx.beginPath();
                ctx.moveTo(sx + cx * 22, sy + cy * 22);
                ctx.lineTo(sx + cx * 22 + rndx, sy + cy * 22);
                ctx.moveTo(sx + cx * 22 + rndx + 22, sy + cy * 22);
                ctx.lineTo(fx, sy + cy * 22);
                ctx.stroke();
                break;
            case 3:
                //Первая горизонтальная
                rndx = (Math.floor(Math.random() * (cx - 1)) + 0) * 22;
                ctx.beginPath();
                ctx.moveTo(sx, sy + cy * 22);
                ctx.lineTo(sx + rndx, sy + cy * 22);
                ctx.moveTo(sx + rndx + 22, sy + cy * 22);
                ctx.lineTo(sx + cx * 22, sy + cy * 22);
                ctx.stroke();
                
                //Вторая горизонтальная
                ctx.beginPath();
                ctx.moveTo(sx + cx * 22, sy + cy * 22);
                ctx.lineTo(fx, sy + cy * 22);
                ctx.stroke();
                
                //Первая вертикальная
                rndy = (Math.floor(Math.random() * (cy - 1)) + 0) * 22;
                ctx.beginPath();
                ctx.moveTo(sx + cx * 22, sy);
                ctx.lineTo(sx + cx * 22, sy + rndy);
                ctx.moveTo(sx + cx * 22, sy + rndy + 22);
                ctx.lineTo(sx + cx * 22, sy + cy * 22);
                ctx.stroke();
                
                //Вторая вертикальная
                rndy = (Math.floor(Math.random() * (ny - cy - 1)) + 0) * 22;
                ctx.beginPath();
                ctx.moveTo(sx + cx * 22, sy + cy * 22);
                ctx.lineTo(sx + cx * 22, sy + cy * 22 + rndy);
                ctx.moveTo(sx + cx * 22, sy + cy * 22 + rndy + 22);
                ctx.lineTo(sx + cx * 22, fy);
                ctx.stroke();
                break;
            case 4:
                //Первая горизонтальная
                rndx = (Math.floor(Math.random() * (cx - 1)) + 0) * 22;
                ctx.beginPath();
                ctx.moveTo(sx, sy + cy * 22);
                ctx.lineTo(sx + rndx, sy + cy * 22);
                ctx.moveTo(sx + rndx + 22, sy + cy * 22);
                ctx.lineTo(sx + cx * 22, sy + cy * 22);
                ctx.stroke();
                
                //Первая вертикальная
                rndy = (Math.floor(Math.random() * (cy - 1)) + 0) * 22;
                ctx.beginPath();
                ctx.moveTo(sx + cx * 22, sy);
                ctx.lineTo(sx + cx * 22, sy + rndy);
                ctx.moveTo(sx + cx * 22, sy + rndy + 22);
                ctx.lineTo(sx + cx * 22, sy + cy * 22);
                ctx.stroke();
                
                //Вторая горизонтальная
                rndx = (Math.floor(Math.random() * (nx - cx - 1)) + 0) * 22;
                ctx.beginPath();
                ctx.moveTo(sx + cx * 22, sy + cy * 22);
                ctx.lineTo(sx + cx * 22 + rndx, sy + cy * 22);
                ctx.moveTo(sx + cx * 22 + rndx + 22, sy + cy * 22);
                ctx.lineTo(fx, sy + cy * 22);
                ctx.stroke();
                
                //Вторая вертикальная
                ctx.beginPath();
                ctx.moveTo(sx + cx * 22, sy + cy * 22);
                ctx.lineTo(sx + cx * 22, fy);
                ctx.stroke();
                break;
            default:
                break;
        } 
        
        //Рекурсивно передаем получившиеся части
        cutLabirint(sx, sy, sx + cx * 22, sy + cy * 22, ctx);
        cutLabirint(sx + cx * 22, sy, fx, sy + cy * 22, ctx);
        cutLabirint(sx, sy + cy * 22, sx + cx * 22, fy, ctx);
        cutLabirint(sx + cx * 22, sy + cy * 22, fx, fy, ctx);
    }
}
