import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import * as dat from 'dat.gui';
import datGui from 'https://cdn.skypack.dev/dat.gui';



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

// LUMIERES !!!

// Lumière directionnelle

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFFF, 0.8);
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



// DAT.GUI - Palette d'options
const gui = new datGui.GUI();

const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01
};

gui.addColor(options, 'sphereColor').onChange(function(e){
    sphere.material.color.set(e);
});
gui.add(options, 'wireframe').onChange(function(e){
    sphere.material.wireframe = e;
})
gui.add(options, 'speed', 0, 0.1);

// On peut s'aider d'un gridHelper (taille, divisions)
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

// Paramètres pour faire rebondir la balle
let step = 0;
// let speed = 0.01;        // On la passe dans les propriétés

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

    // On affiche la mise à jour
    renderer.render(scene, camera);

}

renderer.setAnimationLoop(animate);

// Pour permettre la rotation libre par la souris, on ajoute le module OrbitControl

