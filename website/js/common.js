/* jshint esversion: 8 */
/* jshint unused:true */
/* jshint devel: true, browser: true */
/* global THREE */

// MatCap-style image rendered on a sphere
// modify sphere UVs instead of using a ShaderMaterial

let camera, scene, renderer, image, meshEye, meshLidRotated, tween;

const getRandomRange = (min, max) => {
    return Math.random() * (max - min) + min;
};

const lookSomewhere = () => {
    // y = side side, +x = down
    tween = new TWEEN.Tween(meshEye.rotation)
        .to({
            x: THREE.Math.degToRad(getRandomRange(-15,15)),
            y: THREE.Math.degToRad(getRandomRange(-30,30))
        }, getRandomRange(10,200))
        .start();

    setTimeout(() => { lookSomewhere(); }, getRandomRange(200, 3000));
};

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    console.log(`onWindowResize: camera.aspect=${camera.aspect}`)
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
};
window.addEventListener( 'resize', onWindowResize, false );


const animate = () => {
    requestAnimationFrame(animate);
    TWEEN.update();
    renderer.render(scene, camera);
};



navigator.serviceWorker.register('/service-worker.js')
    .then(registration=>console.log(`Service Worker: registered with scope ${registration.scope}`))
    .catch(error=>console.error(`Service Worker: error ${error}`));
navigator.serviceWorker.ready
    .then(()=>console.log('Service Worker: ready'));

