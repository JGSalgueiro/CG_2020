/*+--------------------------------------------------------------------------------------+
  |    1st Laboratory Delivery - Computer Graphics 2020 - Instituto Superior Técnico     |
  +--------------------------------------------------------------------------------------+
  |                          David Miranda nº 93697 Group 10                             |
  |                         João Salgueiro nº 93725 Group 10                             |
  +--------------------------------------------------------------------------------------+*/

var scene, camera, renderer, helper, cameraTop, activeCamera, cameraSide;
var geometry, material, materialGreen,materialBlack, retangle, group, materialRed;
var stick1, stick2, stick3, stick4, stick5, stick6;
var ViewSize = 50;
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
function defineRetangleSmall()
{
    geometry= new THREE.BoxGeometry(7,3,0.3);
}
function defineRetangleBig()
{
    geometry = new THREE.BoxGeometry(0.3,3,20);
}
function defineBottomTable()
{
    geometry = new THREE.BoxGeometry(7,1,20);
}
function defineStick()
{
    geometry = new THREE.CylinderGeometry(0.25,0.125,5,64);
}
function createRetangle(xCord, yCord, zCord,type) //deitado = 1 : tube lies down (45º Rotation)
{
    if(type == 1)
    {
        retangle = new THREE.Mesh(geometry, materialBlack);
    }
    else if(type == 2)
    {
        retangle = new THREE.Mesh(geometry, materialBlack);
    }
    else if(type == 3)
    {
        retangle = new THREE.Mesh(geometry, materialGreen);
    }
    retangle.position.x = xCord;
    retangle.position.y = yCord;
    retangle.position.z = zCord;
    group.add(retangle);
}
function createStick(xCord, yCord, zCord, type) //deitado = 1 : tube lies down (45º Rotation)
{
    stick = new THREE.Mesh(geometry, materialRed);
    stick.position.x = xCord;
    stick.position.y = yCord;
    stick.position.z = zCord;
    if (type == 0){
        stick.rotation.z = -Math.PI / 2.5;
    }
    else if (type == 1)
    {
        stick.rotation.x = Math.PI / 2.5;
    }
    else if (type == 2)
    {
        stick.rotation.z = Math.PI / 2.5;
    }
    else if (type == 3)
    {
        stick.rotation.x = -Math.PI / 2.5;
    }

    return stick;
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
        material.wireframe = !material.wireframe;
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
function createScene()
{
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd1edf2); //light blue
    scene.add(new THREE.AxisHelper(50));  //Axis with 50 length
}
function init() {
    materialBlack = new THREE.MeshBasicMaterial({color: 0x000000});
    materialGreen = new THREE.MeshBasicMaterial({color: 0x0a6c03});
    materialRed = new THREE.MeshBasicMaterial({color: 0x003297});
    group = new THREE.Group();
    /*texture = new THREE.TextureLoader().load( 'pool_table.jpg' );
    materialGreen = new THREE.MeshBasicMaterial({map: texture});*/
    createScene();
    createRenderer();
    createCamera();
    createCameraTop();
    createCameraSide();
    defineRetangleSmall();
    createRetangle(0,1.5,-10,1);
    createRetangle(0,1.5,10,1);
    defineRetangleBig();
    createRetangle(-3.5,1.5,0,2);
    createRetangle(3.5,1.5,0,2);
    defineBottomTable();
    createRetangle(0,0.5,0,3);
    defineStick();
    stick1 = createStick(6,4,-5,0);
    stick2 = createStick(6,4,5,0);
    stick3 = createStick(0,4,12.5,1);
    stick4 = createStick(-6,4,5,2);
    stick5 = createStick(-6,4,-5,2);
    stick6 = createStick(0,4,-12.5,3);
    scene.add(stick1);
    scene.add(stick2);
    scene.add(stick3);
    scene.add(stick4);
    scene.add(stick5);
    scene.add(stick6);
    scene.add(group);

    renderer.render(scene,activeCamera);

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}
function update()
{
}
function animate() {
    delta = clock.getDelta(); //obtains current time
    update();
    renderer.render(scene,activeCamera);
    requestAnimationFrame(animate);
}
