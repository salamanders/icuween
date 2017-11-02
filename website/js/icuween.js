/* jshint esversion: 6 */
/* jshint unused:true */
/* jshint devel: true, browser: true */
/* global THREE */

// MatCap-style image rendered on a sphere
// modify sphere UVs instead of using a ShaderMaterial

var camera, scene, renderer, image, meshEye, meshLidRotated, tween;

var eyeTextures = [
    'img/eye1.jpg',
    'img/eye2.jpg',
    'img/eye3.jpg',
    'img/eye4.jpg'
];

let getRandomRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

let lookSomewhere = () => {
    // y = side side, +x = down
    tween = new TWEEN.Tween(meshEye.rotation)
        .to({ 
            x: THREE.Math.degToRad(getRandomRange(-15,15)),
            y: THREE.Math.degToRad(getRandomRange(-30,30))
            }, getRandomRange(10,200))
        .start();

    setTimeout(() => { lookSomewhere(); }, getRandomRange(200, 3000));
};

let onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    console.log(`onWindowResize: camera.aspect=${camera.aspect}`)
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
};

let init = () => {

    if(document.documentElement.requestFullscreen) {
        console.log('Supports fullscreen request.');
        document.documentElement.addEventListener('click', () => {
            document.documentElement.requestFullscreen();
        }, false);
    } else {
        window.scrollTo(0,1);
    }

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 80);
    scene.add(camera);

/*
    let controls = new THREE.OrbitControls(camera);
    controls.minDistance = 75;
    controls.maxDistance = 200;
    controls.enablePan = false;
*/
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    let light = new THREE.PointLight(0xffffff, 1);
    camera.add(light);

    image = document.createElement('img');
    let eyeTexture = eyeTextures[Math.floor(Math.random() * eyeTextures.length)];
    console.log(eyeTexture);
    image.src = eyeTexture;

    // document.body.appendChild(image);
    let texture = new THREE.Texture(image);
    image.addEventListener('load', () => {
        texture.needsUpdate = true;
    });

    let material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x050505,
        shininess: 50,
        map: texture
    });

    // https://threejs.org/docs/#api/geometries/SphereGeometry
    let geometry = new THREE.SphereGeometry(30, 24, 24);

    // modify UVs to accommodate MatCap texture (I don't know what this means)
    let faceVertexUvs = geometry.faceVertexUvs[0];
    for (let i = 0; i < faceVertexUvs.length; i++) {
        for (let j = 0; j < 3; j++) {
            faceVertexUvs[i][j].x = geometry.faces[i].vertexNormals[j].x * 0.5 + 0.5;
            faceVertexUvs[i][j].y = geometry.faces[i].vertexNormals[j].y * 0.5 + 0.5;
        }
    }

    meshEye = new THREE.Mesh(geometry, material);
    scene.add(meshEye);

    // Eyelid
    let geometryLid = new THREE.SphereGeometry(30.6, 24, 24, (Math.PI * 2) * 0.25, (Math.PI * 2) * 0.80);
    let meshLid = new THREE.Mesh(geometryLid, new THREE.MeshPhongMaterial({
        color: 0x111111,
        specular: 0x050505,
        shininess: 20
    }));
    // x side side, y up down
    meshLid.rotation.z = Math.PI / 2;
    meshLid.rotation.x = -Math.PI / 4;

    meshLidRotated = new THREE.Object3D();
    meshLidRotated.add(meshLid);

    scene.add(meshLidRotated);
};

let animate = () => {
    requestAnimationFrame(animate);
    TWEEN.update();
    renderer.render(scene, camera);
};

window.addEventListener( 'resize', onWindowResize, false );

navigator.serviceWorker.register('/service-worker.js')
  .then(registration=>console.log(`Service Worker: registered with scope ${registration.scope}`))
  .catch(error=>console.error(`Service Worker: error ${error}`));
navigator.serviceWorker.ready
  .then(()=>console.log('Service Worker: ready'));

init();
onWindowResize();
lookSomewhere();
console.log(meshEye.rotation.x, meshEye.rotation.y, meshEye.rotation.z);
animate();
