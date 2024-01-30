import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// const myModel = require("./public/cave.glb");
// const myTexture = require("./public/CavenNormal-min.png");

const width = window.innerWidth, height = window.innerHeight;
const loader = new GLTFLoader();


// init

const camera = new THREE.PerspectiveCamera( 100, width / height, 0.01, 100 );
camera.position.z = 3;

const scene = new THREE.Scene();

const lightColor = new THREE.Color(0xD6E7FF);
const lightIntensity = Math.PI * 5;
const lightDistance = 8;
const lightAngle = Math.PI/13.5;

const light1 = new THREE.SpotLight(lightColor, lightIntensity);
light1.position.set(-lightDistance, 2.5, -3);
light1.castShadow = true;
light1.angle = lightAngle;
scene.add(light1);

const light2 = new THREE.SpotLight(lightColor, lightIntensity);
light2.position.set(lightDistance, 0, 0);
light2.castShadow = true;
light2.angle = lightAngle;
scene.add(light2);

const light3 = new THREE.SpotLight(lightColor, lightIntensity);
light3.position.set(0, 3, -lightDistance);
light3.castShadow = true;
light3.angle = lightAngle;
scene.add(light3);

const highlight = new THREE.PointLight(0xFFD567, Math.PI * 2.5);
highlight.position.set(0,0,0);
highlight.castShadow = true;
scene.add(highlight);

let cave = null;
loader.load(
    "./cave.glb",
	function (gltf) {
		cave = gltf.scene;
        cave.traverse(function (child) {
            if (child.isMesh) {
                const m = child;
                m.receiveShadow = true;
                m.castShadow = true;
				let mat = new THREE.MeshStandardMaterial;
				mat.color = new THREE.Color(0x000000);
				mat.roughness = 0.4;
				const normalTexture = new THREE.TextureLoader().load( "./CavenNormal-min.png" );
				normalTexture.colorSpace = THREE.NoColorSpace;
				normalTexture.flipY = false;
				mat.normalMap = normalTexture;
				mat.wireframe = false;
				m.material = mat;
            }
        //     if (((child as THREE.Light)).isLight) {
        //         const l = (child as THREE.SpotLight)
        //         l.castShadow = true
        //         l.shadow.bias = -.003
        //         l.shadow.mapSize.width = 2048
        //         l.shadow.mapSize.height = 2048
        //     }
        })
		const scale = 1;
		cave.scale.x = scale;
		cave.scale.y = -scale;
		cave.scale.z = -scale;
		cave.rotation.x = Math.PI * 1;
		cave.rotation.y += Math.PI * 0.5;
		console.log(cave);
        scene.add(cave);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)
const orb = new THREE.SphereGeometry( 0.7, 32, 16 ); 
const orbMaterial = new THREE.MeshStandardMaterial( { color: 0xFFD567 } ); 
orbMaterial.emissive = new THREE.Color(0xFFD567);
orbMaterial.roughness = 0.5;
const orbSphere = new THREE.Mesh( orb, orbMaterial );
scene.add( orbSphere );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setSize( width, height );
renderer.setAnimationLoop( animation );

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();
document.body.appendChild( renderer.domElement );

function animation( time ) {
	let posY = Math.sin(time/2500) * 0.5;
	let posX = Math.sin(time/2000) * 0.15;
	let posZ = Math.cos(time/3000) * 0.15 + 0.5;
	orbSphere.position.y = posY;
	highlight.position.y = posY;
	orbSphere.position.x = posX;
	highlight.position.x = posX;
	orbSphere.position.z = posZ;
	highlight.position.z = posZ;
	let lightAni = (Math.sin(time/750) + 1) / 2;
	let lightFactor = 2.5;
	orbMaterial.emissiveIntensity = Math.PI * (lightAni * lightFactor * 0.3) + 0.1;
	highlight.intensity = Math.PI * (lightAni * lightFactor) + 0.25;

	// Other lights
	
	let light1Ani = (Math.sin(time/251 + 0.2) + 1) / 2;
	let light2Ani = (Math.sin(time/153 + 0.62) + 1) / 2;
	let light3Ani = (Math.sin(time/441 + 0.4) + 1) / 2;
	light1.intensity = lightIntensity * (1 - (light1Ani * 0.25));
	light2.intensity = lightIntensity * (1 - (light2Ani * 0.25));
	light3.intensity = lightIntensity * (1 - (light3Ani * 0.25));
	controls.update();
	renderer.render( scene, camera );
}