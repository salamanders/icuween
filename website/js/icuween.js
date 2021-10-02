/* jshint esversion: 8 */
/* jshint unused:true */
/* jshint devel: true, browser: true */
/* global THREE, onWindowResize, lookSomewhere, animate */
/* globals renderer: true, scene:true, camera:true, image:true,eyeTextures:true, meshEye:true, meshLidRotated:true */

const eyeTextures = [
    'img/eye1.jpg',
    'img/eye2.jpg',
    'img/eye3.jpg',
    'img/eye4.jpg',
    'highres.jpg',
    'scary.jpg'
];

const init = () => {

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
        const controls = new THREE.OrbitControls(camera);
        controls.minDistance = 75;
        controls.maxDistance = 200;
        controls.enablePan = false;
    */
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    const light = new THREE.PointLight(0xffffff, 1);
    camera.add(light);

    image = document.createElement('img');
    const eyeTexture = eyeTextures[Math.floor(Math.random() * eyeTextures.length)];
    console.log(eyeTexture);
    image.src = eyeTexture;

    // document.body.appendChild(image);
    const texture = new THREE.Texture(image);
    image.addEventListener('load', () => {
        texture.needsUpdate = true;
    });

    const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x050505,
        shininess: 50,
        map: texture
    });

    // https://threejs.org/docs/#api/geometries/SphereGeometry
    const geometry = new THREE.SphereGeometry(30, 24, 24);

    // modify UVs to accommodate MatCap texture (I don't know what this means)
    const faceVertexUvs = geometry.faceVertexUvs[0];
    for (let i = 0; i < faceVertexUvs.length; i++) {
        for (let j = 0; j < 3; j++) {
            faceVertexUvs[i][j].x = geometry.faces[i].vertexNormals[j].x * 0.5 + 0.5;
            faceVertexUvs[i][j].y = geometry.faces[i].vertexNormals[j].y * 0.5 + 0.5;
        }
    }

    meshEye = new THREE.Mesh(geometry, material);
    scene.add(meshEye);

    // Eyelid
    const geometryLid = new THREE.SphereGeometry(30.6, 24, 24, (Math.PI * 2) * 0.25, (Math.PI * 2) * 0.80);
    const meshLid = new THREE.Mesh(geometryLid, new THREE.MeshPhongMaterial({
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

init();
onWindowResize();
lookSomewhere();
console.log(meshEye.rotation.x, meshEye.rotation.y, meshEye.rotation.z);
animate();
