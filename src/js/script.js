import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const renderer = new THREE.WebGLRenderer();

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

camera.position.set(0, 2, 5);

// Création d'une BOX
const boxGeometry = new THREE.BoxGeometry(1,1,1);
const boxMaterial = new THREE.MeshBasicMaterial({color : 0x00ff00});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);


function animate(time) {
    // Rotation de la BOX
    // On peut gérer le temps de la rotation en ajoutant l'argument 'time'
    // On peut faire une animatiion 60 fois par seconde. On ajoute donc chaque seconde la valeur '+= 0.01' ici
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;
    // On affiche la mise à jour
    renderer.render(scene, camera);

}

renderer.setAnimationLoop(animate);

// Pour permettre la rotation libre par la souris, on ajoute le module OrbitControl

