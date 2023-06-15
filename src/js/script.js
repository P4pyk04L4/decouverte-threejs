import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import * as dat from 'dat.gui';
import datGui from 'https://cdn.skypack.dev/dat.gui';

import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

const renderer = new THREE.WebGLRenderer();

// Pour afficher les ombres
renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,     // Entre 40 et 80, angle de vue
    window.innerWidth / innerHeight,       // Largeur de la vue, divisée par sa hauteur
    0.1,    // Near
    1000    // Far
);

// On ajoute ici les caractéristiques du contrôle orbital

const orbit = new OrbitControls( camera, renderer.domElement );
orbit.update();


// On peut afficher les axes pour s'aider
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(-5, 5, 20);

// Création d'une BOX
const boxGeometry = new THREE.BoxGeometry(1,1,1);
const boxMaterial = new THREE.MeshStandardMaterial({color : 0x00ff00});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

// Création d'une PLANE
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide  // Permet d'afficher le material de chaque côté
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;  // Orientation selon trigonométrie
plane.receiveShadow = true;         // On indique que la surface peut recevoir une ombre

// Création d'une SHPERE

const sphereGeometry = new THREE.SphereGeometry(2, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000FF,
    wireframe: false
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(2, 2 , 0);
scene.add(sphere);
sphere.castShadow = true;       // On indique la possibilité d'envoyer de l'ombre

// 💡 LUMIERES !!!

// Lumière directionnelle

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFFF, 0.6);
scene.add(directionalLight);
directionalLight.position.set(-30, 50,0)
directionalLight.castShadow = true;     // On indique la possibilité d'envoyer des ombres
directionalLight.shadow.camera.top = 12

// On peut ajouter des helpers pour les lumières directionnelles
const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(dLightHelper);

const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dLightShadowHelper);

// Lumière spotlight

const spotLight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(50, 100, 0);
spotLight.castShadow = true;
// L'ombre est malheureusement pixélisée, pour ce faire, nous pouvons réduire l'angle
spotLight.angle = 0.2;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// ☁️ BROUILLARD

// Deux types, l'un seon la hauteur, l'autre exponentiel selon la distance avec la caméra
// scene.fog = new THREE.Fog(0xFFFFFF, 0, 70);
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

// COULEUR et IMAGE DE FOND

renderer.setClearColor(0xefefbe);

const loader = new THREE.TextureLoader();
// const bgTexture = loader.load('./img/nebuleuse.jpg');
// scene.background = bgTexture;
const cubeTextureLoader = new THREE.CubeTextureLoader()
scene.background = cubeTextureLoader.load([
    './img/stars.jpg',
    './img/stars.jpg',
    './img/stars.jpg',
    './img/stars.jpg',
    './img/stars.jpg',
    './img/stars.jpg'
]);

const box2Geometry = new THREE.BoxGeometry(4,4,4);
const box2Material = new THREE.MeshBasicMaterial({
    // color: 0x00FF00,
    // map: loader.load('./img/nebula.jpg')
});
const box2 = new THREE.Mesh(box2Geometry, box2Material);
scene.add(box2);
box2.position.set(0,8,-7);
box2.material.map = loader.load('./img/nebula.jpg');

// 🎛️ DAT.GUI - Palette d'options
const gui = new datGui.GUI();

const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1
};

gui.addColor(options, 'sphereColor').onChange(function(e){
    sphere.material.color.set(e);
});
gui.add(options, 'wireframe').onChange(function(e){
    sphere.material.wireframe = e;
})
gui.add(options, 'speed', 0, 0.1);
gui.add(options, 'angle', 0, 0.1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1);

// On peut s'aider d'un gridHelper (taille, divisions)
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

// Paramètres pour faire rebondir la balle
let step = 0;
// let speed = 0.01;        // On la passe dans les propriétés

// SELECTIONNER DES OBJETS DE LA SCENE
const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function(e) {
    mousePosition.x = (e.clientX / this.window.innerWidth) * 2 - 1;
    mousePosition.y = (e.clientY / this.window.innerHeight) * 2 - 1;
});

const rayCaster = new THREE.Raycaster();

// On peut récupérer les id des objets et faire des changement au survol si on veut
const sphereId = sphere.id;
box2.name = "theBox";

// OBJET 3D

const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();
mtlLoader.load('./assets/airplane.mtl', (mtl) => {
    mtl.preload();
    objLoader.setMaterials(mtl);
    objLoader.load('./assets/airplane.obj', (root) => {
    scene.add(root);
    });
});


// FONCTION D'ANIMATION

function animate(time) {
    // Rotation de la BOX
    // On peut gérer le temps de la rotation en ajoutant l'argument 'time'
    // On peut faire une animatiion 60 fois par seconde. On ajoute donc chaque seconde la valeur '+= 0.01' ici
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;

    // Rebond de la balle
    // step += speed;
    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    // Autres options
    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    sLightHelper.update();

    // On ajoute le RayCaster
    rayCaster.setFromCamera(mousePosition, camera);
    const intersect = rayCaster.intersectObjects(scene.children);
    // console.log(intersect);

    // Animation au survol
    for (let i = 0; i < intersect.length; i++){
        if(intersect[i].object.id === sphereId){
            intersect[i].object.material.color.set(0xFF0000);
        }
        if(intersect[i].object.name === "theBox"){
            intersect[i].object.rotation.x = time / 1000;
            intersect[i].object.rotation.y = time / 1000;
        }
    }

    // On affiche la mise à jour
    renderer.render(scene, camera);

}

renderer.setAnimationLoop(animate);

// Pour permettre la rotation libre par la souris, on ajoute le module OrbitControl

// RESPONSIVE !!!

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})