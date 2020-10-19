/*+--------------------------------------------------------------------------------------+
  |    1st Laboratory Delivery - Computer Graphics 2020 - Instituto Superior Técnico     |
  +--------------------------------------------------------------------------------------+
  |                          David Miranda nº 93697 Group 10                             |
  |                         João Salgueiro nº 93725 Group 10                             |
  +--------------------------------------------------------------------------------------+*/

var scene, camera, renderer, helper, cameraTop, activeCamera, cameraSide;
var geometry, material, cube;
var ViewSize = 20;
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
var clock = new THREE.Clock();
var speed = 5; //units a second
var delta = 0; //starts time at 0
var g1,g2,g3,g4; //groups

function createRenderer()
{
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

}
function createCamera()
{
    camera = new THREE.OrthographicCamera(-aspect*ViewSize / 2, aspect*ViewSize / 2, ViewSize / 2, -ViewSize / 2, - 1000, 1000);
    camera.position.set(0,5,0);
    activeCamera = camera;
    scene.add(camera);
}
function createCameraTop()
{
    cameraTop = new THREE.OrthographicCamera(-aspect*ViewSize / 2, aspect*ViewSize / 2, ViewSize / 2, -ViewSize / 2, - 1000, 1000);
    cameraTop.rotation.x = -Math.PI / 2;
    cameraTop.position.set(0,5,0);
    scene.add(cameraTop);
}
function createCameraSide()
{
    cameraSide = new THREE.OrthographicCamera(-aspect*ViewSize / 2, aspect*ViewSize / 2, ViewSize / 2, -ViewSize / 2, - 1000, 1000);
    cameraSide.rotation.y = Math.PI / 2;
    cameraSide.position.set(0,5,0);
    scene.add(cameraSide);
}
function defineCube()
{
    geometry = new THREE.BoxGeometry(1,1,1);
    material = new THREE.MeshBasicMaterial({color: 0x0000ff});
}
function defineCylinder()
{
    geometry = new THREE.CylinderGeometry(0.5,0.5,1,64);
    material = new THREE.MeshBasicMaterial({color: 0xff00ff});
}
function defineMiniCylinder()
{
    material = new THREE.MeshBasicMaterial({color: 0x000000});
}
function createTubes(xCord, yCord, zCord, comprimento,deitado, id) //deitado = 1 : tube lies down (45º Rotation)
{
    geometry = new THREE.CylinderGeometry(0.1,0.1,comprimento,64);
    cylinder = new THREE.Mesh(geometry, material);
    if(deitado == 1)
    {
        cylinder.rotation.z = Math.PI / 2;
    }
    cylinder.position.x = xCord;
    cylinder.position.y = yCord;
    cylinder.position.z = zCord;
    if(id == 1){
        g1.add(cylinder);
    }
    else if(id == 2){
        g2.add(cylinder);
    }
    else if(id == 3){
        g3.add(cylinder);
    }
}

function makeTubes() //Creates Tube Structure in the Mobile
{
    defineMiniCylinder();
    createTubes(0,0,0,4.15,1,3);
    createTubes(-2,-0.5,0,1.15,0,3);
    createTubes(1,-1,0,2.15,0,3);
    createTubes(1,-2,0,4.15,1,3);
    createTubes(-1,-2.5,0,1.15,0,3);
    createTubes(0,1,0,2.15,0,2);
    createTubes(0,0,0,4.15,1,2);
    createTubes(-2,-0.5,0,1.15,0,2);
    createTubes(1,-1,0,2.15,0,2);
    createTubes(0,9,0,1.15,0,1);
    createTubes(2,10.5,0,2.15,0,1);
    createTubes(0.5,11.5,0,5.15,1,1);
    createTubes(-2,11,0,1.15,0,1);
    createTubes(2,9.5,0,4.15,1,1);
    createTubes(0,36.5,0,50.15,0,1);
}
function createCylinder(xCord, yCord, zCord, id)
{
    cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.x = xCord;
    cylinder.position.y = yCord;
    cylinder.position.z = zCord;
    if(id == 1){
        g1.add(cylinder);
    }
    else if(id == 2){
        g2.add(cylinder);
    }
    else if(id == 3){
        g3.add(cylinder);
    }
}
function makeCylinder() //Creates all Cilinders supported by the structure of tubes
{
    defineCylinder();
    createCylinder(2.5, 0,0,3);
    createCylinder(3.5, -2,0,3);
    createCylinder(2.5, 0,0,2);
    createCylinder(3.5, 11.5,0,1);
    createCylinder(4.5, 9.5,0,1);
}
function createCube(xCord, yCord, zCord, id)
{
    cube = new THREE.Mesh(geometry, material);
    cube.position.x = xCord;
    cube.position.y = yCord;
    cube.position.z = zCord;
    if(id == 1){
        g1.add(cube);
    }
    else if(id == 2){
        g2.add(cube);
    }
    else if(id == 3){
        g3.add(cube);
    }
}

function makeCubes() //Creates all Cubes supported by the structure of tubes
{
    defineCube();
    createCube(-2, -1.5,0,3);
    createCube(-1, -3.5,0,3);
    createCube(-2, -1,0,2);
    createCube(-2, 10,0,1);
    createCube(0, 8.5,0,1);
}

function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (window.innerHeight > 0 && window.innerWidth > 0) {
        activeCamera.aspect = window.innerWidth / window.innerHeight;
        activeCamera.updateProjectionMatrix();
    }
}

function onKeyDown(e) { //KeyPressed
    
    switch (e.keyCode) {
    case 49://1
        activeCamera = camera;
        break;
    case 50://2
        activeCamera = cameraTop;
        break;
    case 51://3
        activeCamera = cameraSide;
        break;
    case 52: //4
        scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                node.material.wireframe = !node.material.wireframe;
            }
        });
        break;
    case 69:  //e
        scene.traverse(function (node) {
            if (node instanceof THREE.AxisHelper) {
                node.visible = !node.visible;
            }
        });
        break;
    case 37:// <-
        g1.userData.keyLeft = true;
        break;
    case 39:// ->
        g1.userData.keyRight = true;
        break;
    case 38://Up key
        g1.userData.keyUp = true
        break;
    case 40://Down key
        g1.userData.keyDown =  true;
        break;
    case 81://Q
        g1.userData.rotationClock = true;
       break;
    case 87://W
        g1.userData.rotationAntiClock = true;
       break;
    case 65://A
       g2.userData.rotationClock = true;
       break;
    case 68://D
        g2.userData.rotationAntiClock = true;
       break;
    case 67://C
       g3.userData.rotationAntiClock = true;
       break;
    case 90://Z
       g3.userData.rotationClock = true;
       break;
    }
}

function onKeyUp(e) { //KeyRealeased
    switch (e.keyCode) {
    case 81://Q
        g1.userData.rotationClock = false;
       break;
    case 87://W
        g1.userData.rotationAntiClock = false;
       break;
    case 65://A
        g2.userData.rotationClock = false;
        break;
    case 68://D
        g2.userData.rotationAntiClock = false;
        break;
    case 67://C
        g3.userData.rotationAntiClock = false;
        break;
    case 90://Z
        g3.userData.rotationClock = false;
        break;
    case 37:// <-
        g1.userData.keyLeft = false;
        break;
    case 39:// ->
        g1.userData.keyRight = false;
        break;
    case 38:// Up Key
        g1.userData.keyUp = false
        break;
    case 40:// Down Key
        g1.userData.keyDown =  false;
        break;
    }
}
function initializeMobile() // Creates the Mobile Figure. Starts at a stopped motion.
{
    makeCubes();
    makeCylinder();
    makeTubes();    
    g2.position.y = 7.5;
    g2.position.x = 3;
    g3.position.y = -2;
    g3.position.x = 1;
    g1.userData = { rotationClock: false, rotationAntiClock: false, keyUp: false, keyDown: false, keyLeft: false, keyRight: false};
    g2.userData = { rotationClock: false, rotationAntiClock: false};
    g3.userData = { rotationClock: false,rotationAntiClock: false};

}
function createScene()
{
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd1edf2); //light blue
    scene.add(new THREE.AxisHelper(50));  //Axis with 50 length
}
function init() {
    g1 = new THREE.Object3D();
    g2 = new THREE.Object3D();
    g3 = new THREE.Object3D();

    createScene();
    createRenderer();
    createCamera();
    createCameraTop();
    createCameraSide();
    initializeMobile();

    g2.add(g3);
    g1.add(g2);
    scene.add(g1);

    renderer.render(scene,activeCamera);

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}
function update()
{
    if(g1.userData.rotationClock == true) //Q 
    {
        g1.rotateY(Math.PI*speed * delta * 0.3);
    }
    if(g2.userData.rotationClock == true) //A
    {
        g2.rotateY(Math.PI*speed * delta * 0.3);
    }
    if(g3.userData.rotationClock == true) //Z
    {
        g3.rotateY(Math.PI*speed * delta * 0.3);
    }
    if(g1.userData.rotationAntiClock == true) //W
    {
        g1.rotateY(-Math.PI*speed * delta * 0.3);
    }
    if(g2.userData.rotationAntiClock == true) //D
    {
        g2.rotateY(-Math.PI*speed * delta * 0.3);
    }
    if(g3.userData.rotationAntiClock == true) //C
    {
        g3.rotateY(-Math.PI*speed * delta * 0.3);
    }
    if(g1.userData.keyRight == true){ //Right key
        g1.position.x += speed * delta;
    }
    if(g1.userData.keyLeft == true){ //Left key
        g1.position.x += -speed * delta;
    }
    if(g1.userData.keyUp == true){ //Up key
        g1.position.z += -speed * delta;
    }
    if(g1.userData.keyDown == true){ //Down key
        g1.position.z += speed * delta;
    }
}
function animate() {
    delta = clock.getDelta(); //obtains current time
    update();
    renderer.render(scene,activeCamera);
    requestAnimationFrame(animate);
}
