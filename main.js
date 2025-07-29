import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.157.0/examples/jsm/loaders/GLTFLoader.js';

// Камера как фон
const video = document.getElementById('bg-video');
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then((stream) => (video.srcObject = stream))
    .catch((err) => console.error('Camera error:', err));

// Сцена
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 1, 3);

// Свет
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(light);

// Загрузка модели
const loader = new GLTFLoader();
loader.load('NewCat.glb', (gltf) => {
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    scene.add(model);
    playSound();
}, undefined, (err) => console.error('Model load error:', err));

// Звук
const listener = new THREE.AudioListener();
camera.add(listener);
const sound = new THREE.Audio(listener);

function playSound() {
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('speech.mp3', (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(false);
        sound.setVolume(1);
        sound.play();
    });
}

// Анимация
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
