// Настройка камеры
const video = document.getElementById('bg-video');
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => video.srcObject = stream)
    .catch(err => console.error('Camera error:', err));

// Настройка WebGL
const canvas = document.getElementById('glcanvas');
const gl = canvas.getContext('webgl');

// Установим размеры
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Простая отрисовка 3D куба
const vert = `
  attribute vec4 a_position;
  uniform mat4 u_matrix;
  void main() {
    gl_Position = u_matrix * a_position;
  }
`;

const frag = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(1, 0.3, 0.1, 1);
  }
`;

function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

function createProgram(vs, fs) {
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    return program;
}

const vs = createShader(gl.VERTEX_SHADER, vert);
const fs = createShader(gl.FRAGMENT_SHADER, frag);
const program = createProgram(vs, fs);
gl.useProgram(program);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -0.5, -0.5, 0,
    0.5, -0.5, 0,
    -0.5,  0.5, 0,
    0.5,  0.5, 0,
]), gl.STATIC_DRAW);

const a_position = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(a_position);
gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);

const u_matrix = gl.getUniformLocation(program, "u_matrix");

function drawScene(time) {
    time *= 0.001;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const aspect = canvas.width / canvas.height;
    const fov = Math.PI / 4;
    const zNear = 0.1;
    const zFar = 100;
    const projection = mat4.perspective([], fov, aspect, zNear, zFar);
    const view = mat4.lookAt([], [0, 0, 3], [0, 0, 0], [0, 1, 0]);
    const model = mat4.rotateY([], mat4.create(), time);
    const mvp = mat4.multiply([], projection, mat4.multiply([], view, model));

    gl.uniformMatrix4fv(u_matrix, false, mvp);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(drawScene);
}
import { mat4 } from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/esm/index.js';
requestAnimationFrame(drawScene);
