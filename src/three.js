import * as THREE from 'three';
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js"
import vShader from './shaders/vertexShader.js';
import fShader from './shaders/fragmentShader.js';


const width = window.innerWidth;
const height = window.innerHeight;

// camera
const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
// audio data
let listener = new THREE.AudioListener();
camera.add(listener);
const sound = new THREE.Audio(listener);
const loader = new THREE.AudioLoader();
loader.loadAsync('./assets/TPA.mp3', (buffer)=>{
    sound.setBuffer(buffer);
    sound.setVolume(1);
    sound.play();
  })
  let analyzer = new THREE.AudioAnalyser(sound, 128);
  camera.position.set(-220, 1100, 60);

const controls = new OrbitControls(camera, document.getElementById("app"));
// renderer
const dimension =  Math.min(window.innerHeight / 1.5, window.innerWidth / 1.5)
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("app"),
  });
renderer.setSize(dimension, dimension)  
// Lighting 

const light = new THREE.PointLight(
    new THREE.Color("#FFCB8E").convertSRGBToLinear().convertSRGBToLinear(),
    80,
    200
  );


  renderer.setSize(width, height);

// geometries
let lines = new THREE.Group();
function addLine(AudioVal){
    let planeGeo = new THREE.PlaneGeometry(64,64, 64, 64);
    let plane = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({color: 0x000000, wireframe: false, transparent:false}));
    lines.add(plane);
    const lineGeo = new THREE.BufferGeometry();
    let lineVertices = []
    for (let i = 0; i < 200; i++) {
        lineVertices.push(planeGeo.attributes.position.array[3*i]); // share the upper points of the plane
        lineVertices.push(planeGeo.attributes.position.array[3*i+1]);
        lineVertices.push(planeGeo.attributes.position.array[3*i+2]);
    }
    
    lineGeo.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(lineVertices), 3 ) );
    // material
    const lineMat = new THREE.LineBasicMaterial({ color: 0xE1E1E1, transparent: true, opacity: .57 })
    const line =  new THREE.Line(lineGeo, lineMat);

    plane.add(line);
    for (let i = 0; i < 200; i ++) {
        let y = 0;
        if(i >= 39 && i < 100){
            y += AudioVal[102 - i]
        }else if(i >= 100 && i < 161){
            y += AudioVal[i - 97]
        }
        y = Math.pow(y, 1.2)
        plane.geometry.attributes.position.array[(i*3)+1] = y    
        line.geometry.attributes.position.array[(i*3)+1] = y
    }
}

function deleteLines() {
    let planesThatHaveGoneFarEnough = []
    lines.children.forEach(plane => {
        for(let i = 0; i < 400; i++){
            plane.geometry.attributes.position.array[(i*3)+2] -= 1
            if(i < 200){
                plane.children[0].geometry.attributes.position.array[(i*3)+2] -= 1
            }
        }
        if(plane.geometry.attributes.position.array[2] <= -500){
            planesThatHaveGoneFarEnough.push(plane)
        }else{
            plane.geometry.attributes.position.needsUpdate  = true
            plane.children[0].geometry.attributes.position.needsUpdate  = true
        }
    })
    planesThatHaveGoneFarEnough.forEach(plane => lines.remove(plane))
}

// scene
const scene = new THREE.Scene();
scene.add(lines);


// scene.add( plane );
let clock = new THREE.Clock();
// audio


(async function (){
    renderer.setAnimationLoop((x)=>{
        console.log(camera.position)
        let analyzerData = analyzer.getFrequencyData();
        renderer.render(lines, camera);
        deleteLines();
        addLine(analyzerData);
    })
})();