class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
        this.h = 1;
    }
}

let root = null;

function getHeight(node) { return node ? node.h : 0; }
function getBF(node) { return node ? getHeight(node.left) - getHeight(node.right) : 0; }

function updateHeight(node) {
    if (node) node.h = 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

function rightRotate(y) {
    let x = y.left;
    let T2 = x.right;
    x.right = y;
    y.left = T2;
    updateHeight(y);
    updateHeight(x);
    return x;
}

function leftRotate(x) {
    let y = x.right;
    let T2 = y.left;
    y.left = x;
    x.right = T2;
    updateHeight(x);
    updateHeight(y);
    return y;
}

function insert(node, x) {
    if (!node) return new Node(x);
    if (x < node.data) node.left = insert(node.left, x);
    else if (x > node.data) node.right = insert(node.right, x);
    else return node;

    updateHeight(node);
    let bf = getBF(node);

    if (bf > 1 && x < node.left.data) return rightRotate(node);
    if (bf < -1 && x > node.right.data) return leftRotate(node);
    if (bf > 1 && x > node.left.data) {
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }
    if (bf < -1 && x < node.right.data) {
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }
    return node;
}

function handleAdd() {
    const input = document.getElementById('nodeValue');
    const val = parseInt(input.value);
    if (isNaN(val)) return;
    root = insert(root, val);
    drawTree();
    input.value = '';
    input.focus();
}

function clearTree() {
    root = null;
    document.getElementById('treeSvg').innerHTML = '';
}

function drawTree() {
    const svg = document.getElementById('treeSvg');
    svg.innerHTML = ''; 
    if (root) renderNode(root, 500, 50, 200);
}

function renderNode(node, x, y, offset) {
    const svg = document.getElementById('treeSvg');
    const NS = "http://www.w3.org/2000/svg";

    if (node.left) {
        let line = document.createElementNS(NS, "line");
        line.setAttribute("x1", x); line.setAttribute("y1", y);
        line.setAttribute("x2", x - offset); line.setAttribute("y2", y + 60);
        svg.appendChild(line);
        renderNode(node.left, x - offset, y + 60, offset / 2);
    }
    if (node.right) {
        let line = document.createElementNS(NS, "line");
        line.setAttribute("x1", x); line.setAttribute("y1", y);
        line.setAttribute("x2", x + offset); line.setAttribute("y2", y + 60);
        svg.appendChild(line);
        renderNode(node.right, x + offset, y + 60, offset / 2);
    }

    let circle = document.createElementNS(NS, "circle");
    circle.setAttribute("cx", x); circle.setAttribute("cy", y); circle.setAttribute("r", "18");
    svg.appendChild(circle);

    let text = document.createElementNS(NS, "text");
    text.setAttribute("x", x); text.setAttribute("y", y + 5);
    text.setAttribute("text-anchor", "middle");
    text.textContent = node.data;
    svg.appendChild(text);
}