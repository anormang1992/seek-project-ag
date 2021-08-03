import * as THREE from "./three.js-master/build/three.module.js"
import {GLTFLoader} from "./three.js-master/examples/jsm/loaders/GLTFLoader.js"
import {OrbitControls} from "./three.js-master/examples/jsm/controls/OrbitControls.js"

//global vars
var scene, camera, renderer, controls, loader, model;
var models = ["static/models/book/scene.gltf","static/models/tower/scene.gltf","static/models/ship/scene.gltf"]
var models_index = 0

//size params
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}
//model-canvas
var canvas = document.querySelector('.model-canvas')

init();

function init() {
	//setting up the scene with camera to hold the method. Then, add camera to the scene
	scene = new THREE.Scene()
	camera = new THREE.PerspectiveCamera(60, sizes.width/sizes.height, .1, 1000)
	camera.position.set(0,0.5,3);
	scene.add(camera)


	//lighting design
	scene.background = new THREE.Color('#E2E2E2');

	const lightDirectionTop = new THREE.DirectionalLight(0xffffff, 1)
	lightDirectionTop.position.set(0,1,0 );
	lightDirectionTop.castShadow = true;
	scene.add(lightDirectionTop)


	const lightAmbient = new THREE.AmbientLight( '#ece1bc' );
	document.addEventListener('DOMContentLoaded', function () {
	  var checkbox = document.querySelector('input[type="checkbox"]');
	  //trigger for turning the ambient light on/off with switch
	  checkbox.addEventListener('change', function () {
	    if (checkbox.checked) {
			scene.add(lightAmbient);
	    } else {
	    	scene.remove(lightAmbient);
	    }
	  });
	});

	//setting up the WebGLRenderer and appendeding to the DOM
	renderer = new THREE.WebGLRenderer({
		canvas:canvas
	})
	renderer.setSize(sizes.width, sizes.height)
	renderer.shadowMap.enable = true


	//setting up user controls via Orbit 
	controls = new OrbitControls(camera, renderer.domElement);
	controls.update();	

	//setting up the loader. Logic for switching models goes here.
	loader = new GLTFLoader()
	document.addEventListener('DOMContentLoaded', function () {
		var left_chevron = document.getElementById('cycle-left');
		var right_chevron = document.getElementById('cycle-right');

		right_chevron.addEventListener("click", function() {
			models_index += 1;
			if (models_index < models.length) {
				scene.remove(model)
				loadModel()
			} else {
				scene.remove(model);
				models_index = 0;
				loadModel();
			}
		});

		left_chevron.addEventListener("click", function() {
			models_index -= 1;
			if (models_index >= 0) {
				scene.remove(model);
				loadModel();
			} else {
				scene.remove(model);
				models_index = (models.length - 1);
				loadModel();
			
			}
		});		
	});

	loadModel();
};

//extracted load model logic to its own function to play nicely with model switchin' in the UI.
function loadModel() {
	loader.load(models[models_index], function(gltf){
		model = gltf.scene;
		model.scale.set(0.03, 0.03,0.03);
		scene.add(model);

		animate();
		console.log(gltf);
	});
}

function animate() {
	requestAnimationFrame(animate);

	if (model) {
		model.rotation.y += 0.01;
	}

	controls.update();
	renderer.render(scene, camera);
};
