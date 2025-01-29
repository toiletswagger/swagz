const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.6;

let isDrawing = false;
let isErasing = false;
let color = document.getElementById('color').value;
let brushSize = document.getElementById('size').value;

let undoStack = [];

function saveState() {
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
}
function startDrawing(e) {
    if (e.button !== 0) return;
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
    saveState();
}

function draw(e) {
    if (!isDrawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = isErasing ? '#f0f0f0' : color;
    ctx.lineWidth = brushSize;
    ctx,linecap = 'round';
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
    ctx.closePath();
}

function toggleErase() {
    isErasing = !isErasing;
    document.getElementById('erase').innerText = isErasing ? 'Drawing Mode' : 'Erase';
}

function clearCanvas() {
    saveState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function undo(e) {
    if (e.button === 2) {
        e.preventDefault();
        if (undoStack.length > 0) {
            const lastState = undoStack.pop();
            ctx.putImageData(lastState, 0, 0);
        } else {
            alert('Nothing to undo blud!');
        }
    }
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

canvas.addEventListener('contextmenu', undo);

document.getElementById('color').addEventListener('input', (e) => {
    color = e.target.value;
    isErasing = false;
});

document.getElementById('size').addEventListener('input', (e) => {
    brushSize = e.target.value;
})

document.getElementById('erase').addEventListener('click', toggleErase);
document.getElementById('clear').addEventListener('click', clearCanvas);
