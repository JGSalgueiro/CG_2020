/*+--------------------------------------------------------------------------------------+
  |    2nd Laboratory Delivery - Computer Graphics 2020 - Instituto Superior Técnico     |
  +--------------------------------------------------------------------------------------+
  |                          David Miranda nº 93697 Group 10                             |
  |                         João Salgueiro nº 93725 Group 10                             |
  +--------------------------------------------------------------------------------------+*/

var scene, camera, renderer, helper, cameraTop, activeCamera, cameraSide;
var geometry, material, materialGreen,materialBlack, materialWhite, retangle, group, materialRed;
var stick1, stick2, stick3, stick4, stick5, stick6;
var ball1, ball2, ball3, ball4, ball5, ball6, balltest;
var ViewSize = 50;
var raio = 0.5;
var alturaMesa = 2.2;
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
var clock = new THREE.Clock();
var speed = 5; //units a second
var delta = 0; //starts time at 0
var cue1,cue2,cue3,cue4,cue5,cue6,group; //groups
var pivotPoint1,pivotPoint2,pivotPoint3,pivotPoint4,pivotPoint5,pivotPoint6;
var momentum = [0,0,0,0,0,0];
var vectorBalls = [6];
var testVec;
var testVec2 = new THREE.Vector3(0,1.5,-9);

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
function defineBall(){
    geometry = new THREE.SphereGeometry(raio,32,32);
}
function defineRetangleSmall()
{
    geometry= new THREE.BoxGeometry(7,alturaMesa,0.3);
}
function defineRetangleBig()
{
    geometry = new THREE.BoxGeometry(0.3,alturaMesa,20);
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

function createBall(xCord, yCord, zCord){
    ball = new THREE.Mesh(geometry, materialWhite);

    ball.position.x = xCord;
    ball.position.y = yCord;
    ball.position.z = zCord;

    vectorBalls.push(ball);

    return ball;
}

function initTable(){
    defineRetangleSmall();
    createRetangle(0,1.1,-10,1);
    createRetangle(0,1.1,10,1);

    defineRetangleBig();
    createRetangle(-3.5,1.1,0,2);
    createRetangle(3.5,1.1,0,2);

    defineBottomTable();
    createRetangle(0,0.5,0,3);
    scene.add(group);
}

function initCues(){
    defineStick();
    pivotPoint1 = new THREE.Object3D();
    pivotPoint2 = new THREE.Object3D();
    pivotPoint3 = new THREE.Object3D();
    pivotPoint4 = new THREE.Object3D();
    pivotPoint5 = new THREE.Object3D();
    pivotPoint6 = new THREE.Object3D();

    stick1 = createStick(3.5,1,0,0);
    stick2 = createStick(-3.5,1,0,2);
    stick3 = createStick(3.5,1,0,0);
    stick4 = createStick(-3.5,1,0,2);
    stick5 = createStick(0,1,3.5,1);
    stick6 = createStick(0,1,-3.5,3);

    pivotPoint1.add(stick1);
    pivotPoint1.position.set(2.5,alturaMesa,-5);
    pivotPoint2.add(stick2);
    pivotPoint2.position.set(-2.5,alturaMesa,-5);
    pivotPoint3.add(stick3);
    pivotPoint3.position.set(2.5,alturaMesa,5);
    pivotPoint4.add(stick4);
    pivotPoint4.position.set(-2.5,alturaMesa,5);
    pivotPoint5.add(stick5);
    pivotPoint5.position.set(0,alturaMesa,9);
    pivotPoint6.add(stick6);
    pivotPoint6.position.set(0,alturaMesa,-9);
    // Pivot points
    //cue1.add(pivotPoint1);

    scene.add(pivotPoint1);
    scene.add(pivotPoint2);
    scene.add(pivotPoint3);
    scene.add(pivotPoint4);
    scene.add(pivotPoint5);
    scene.add(pivotPoint6);
    /*scene.add(stick2);
    scene.add(stick3);
    scene.add(stick4);
    scene.add(stick5);
    scene.add(stick6);*/
}
function initBalls(){
    defineBall();
    ball6 = createBall(0,1 + raio,-9);
    ball5 = createBall(0,1 + raio,9);
    ball4 = createBall(-2.5,1 + raio,5);
    ball3 = createBall(2.5,1 + raio,5);
    ball2 = createBall(-2.5,1 + raio,-5);
    ball1 = createBall(2.5,1 + raio,-5);
    scene.add(ball1);
    scene.add(ball2);
    scene.add(ball3);
    scene.add(ball4);
    scene.add(ball5);
    scene.add(ball6);
}

function onResize(){
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
        shootBall(6);
        break;
    case 69:  //e
        scene.traverse(function (node) {
            if (node instanceof THREE.AxisHelper) {
                node.visible = !node.visible;
            }
        });
        break;

    case 81://Q
        pivotPoint1.rotation.y += 0.05;
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
    scene.background = new THREE.Color(0x808080); //light blue
    scene.add(new THREE.AxisHelper(50));  //Axis with 50 length
}

function shootBall(num){
    if(num == 6){
        pivotPoint6.position.z += 0.5;
        momentum[5] = 0.8;

    }
    if(num == 2){
        pivotPoint6.position.z += 0.5;
        momentum[2] = 0.5;
        
    }
    if(num == 3){
        pivotPoint6.position.z += 0.5;
        momentum[3] = 0.5;
        
    }
    if(num == 4){
        pivotPoint6.position.z += 0.5;
        momentum[4] = 0.5;
    }
}
function getCenterPoint(mesh) {/*Funcao so funciona depois de se fazer render IDKW*/
    var middle = new THREE.Vector3();
    var geometry = mesh.geometry;

    geometry.computeBoundingBox();

    middle.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
    middle.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
    middle.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;
    mesh.localToWorld( middle );
    return middle;
}
function colide()
{

}
function init() {
    materialWhite = new THREE.MeshBasicMaterial({color: 0xffffff});
    materialBlack = new THREE.MeshBasicMaterial({color: 0x000000});
    materialGreen = new THREE.MeshBasicMaterial({color: 0x0a6c03});
    materialRed = new THREE.MeshBasicMaterial({color: 0x003297});
    group = new THREE.Group();


    createScene();
    createRenderer();
    createCamera();
    createCameraTop();
    createCameraSide();

    initCues();
    initTable();
    initBalls();
    renderer.render(scene,activeCamera);/*Tirar depois!!!!!*/
    testVec = getCenterPoint(ball6);
    //vector[0] = testVec;
    //window.alert(vectorBalls[2].y);
    

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}
function update()
{
    ball6.position.z += 2 * momentum[5];
    momentum[5] = momentum[5]/1.10;
}

function animate() {
    delta = clock.getDelta(); //obtains current time
    update();
    renderer.render(scene,activeCamera);
    requestAnimationFrame(animate);
}
