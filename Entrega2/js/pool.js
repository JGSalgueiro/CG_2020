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
var vectorBalls = [];
var vectorPivots = [];
var vectorSticks = [];
var testVec;
var testVec2 = new THREE.Vector3(0,1.5,-9);
var pass = 0;
var vecNo = new THREE.Vector3(120,120,120);
var ang = 0;

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
    geometry= new THREE.BoxGeometry(15,alturaMesa,0.3);
}
function defineRetangleBig()
{
    geometry = new THREE.BoxGeometry(0.3,alturaMesa,30);
}
function defineBottomTable()
{
    geometry = new THREE.BoxGeometry(15,1,30);
}
function defineStick()
{
    geometry = new THREE.CylinderGeometry(0.25,0.125,10,64);
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
    stick = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0x003297}));
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

    vectorSticks.push(stick);
}

function createBall(xCord, yCord, zCord){
    ball = new THREE.Mesh(geometry, materialWhite);

    ball.position.x = xCord;
    ball.position.y = yCord;
    ball.position.z = zCord;
    ball.userData = {momentum: 0};

    vectorBalls.push(ball);
    scene.add(ball);

    return ball;
}

function initTable(){
    defineRetangleSmall();
    createRetangle(0,1.1,-15,1);
    createRetangle(0,1.1,15,1);

    defineRetangleBig();
    createRetangle(-7.5,1.1,0,2);
    createRetangle(7.5,1.1,0,2);

    defineBottomTable();
    createRetangle(0,0.5,0,3);
    scene.add(group);
}
function initPivots(num)
{
    while( num > 0)
    {
        pivotPoint = new THREE.Object3D();
        pivotPoint.userData = {selected: 0, onShootPosition: true};
        vectorPivots.push(pivotPoint)
        num--;
    }
}
function unitePivotStick()
{
    vectorPivots[0].add(vectorSticks[0]);
    vectorPivots[0].position.set(2.5,alturaMesa,-5);
    vectorPivots[1].add(vectorSticks[1]);
    vectorPivots[1].position.set(-2.5,alturaMesa,-5);
    vectorPivots[2].add(vectorSticks[2]);
    vectorPivots[2].position.set(2.5,alturaMesa,5);
    vectorPivots[3].add(vectorSticks[3]);
    vectorPivots[3].position.set(-2.5,alturaMesa,5);
    vectorPivots[4].add(vectorSticks[4]);
    vectorPivots[4].position.set(0,alturaMesa,9);
    vectorPivots[5].add(vectorSticks[5]);
    vectorPivots[5].position.set(0,alturaMesa,-9); 
}
function initCues(){
    defineStick();
    initPivots();
    initPivots(6);

    createStick(3.5,1,0,0);
    createStick(-3.5,1,0,2);
    createStick(3.5,1,0,0);
    createStick(-3.5,1,0,2);
    createStick(0,1,3.5,1);
    createStick(0,1,-3.5,3);

    unitePivotStick();
   
    // Pivot points
    //cue1.add(pivotPoint1);
    scene.add(vectorPivots[0]);
    scene.add(vectorPivots[1]);
    scene.add(vectorPivots[2]);
    scene.add(vectorPivots[3]);
    scene.add(vectorPivots[4]);
    scene.add(vectorPivots[5]);
    
    /*scene.add(stick2);
    scene.add(stick3);
    scene.add(stick4);
    scene.add(stick5);
    scene.add(stick6);*/
}
function initBalls(){
    defineBall();
    createBall(2.5,1 + raio,-5);//Ball0
    createBall(-2.5,1 + raio,-5);//Ball1
    createBall(2.5,1 + raio,5);//Ball2
    createBall(-2.5,1 + raio,5);//Ball3
    createBall(0,1 + raio,9);//Ball4
    createBall(0,1 + raio,-9);//Ball5

    /*scene.add(ball1);
    scene.add(ball2);
    scene.add(ball3);
    scene.add(ball4);
    scene.add(ball5);
    scene.add(ball6);*/
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
    case 32://SPACE
        shootBalls();
        break;
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
        vectorPivots[0].userData.selected ^= 1;//XOR operation
        break;
    case 53: //5
        vectorPivots[1].userData.selected ^= 1;//XOR operation
        break;
    case 54: //6
        vectorPivots[2].userData.selected ^= 1;//XOR operation
        break;
    case 55: //7
        vectorPivots[3].userData.selected ^= 1;//XOR operation
        break;
    case 56: //8
        vectorPivots[4].userData.selected ^= 1;//XOR operation
        break;
    case 57: //9
        vectorPivots[5].userData.selected ^= 1;//XOR operation
        break;
    //---------------------------------------------------------
    case 37: // Left key
        if(ang >= -60 && ang <= 60){
            for(i = 0; i < 6; i++){
                if(vectorPivots[i].userData.selected == 1){
                    vectorPivots[i].rotation.y += 0.05;
                    ang += 0.05
                }
            }
        }
        break;
    case 39: // Left key
        if(ang >= -60 && ang <= 60){
            for(i = 0; i < 6; i++){
                if(vectorPivots[i].userData.selected == 1){
                    vectorPivots[i].rotation.y -= 0.05;
                    ang -= 0.05
                }
            }
        }
        break;
    //---------------------------------------------------------
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

/*function onKeyUp(e) { 
    switch (e.keyCode) {
    }
}*/
function createScene()
{
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x808080); //light blue
    scene.add(new THREE.AxisHelper(50));  //Axis with 50 length
}

function shootBalls(){/*Determina as bolas*/
    var i;
    for(i = 0; i < 6; i++)
    {
        if(vectorPivots[i].userData.selected == 1)
        {
            shootBall(i);
        }
    }
}
function shootBall(num){/*bolas vao de 0-5 || Tacos n voltam para tras*/
    vectorPivots[num].userData.onShootPosition = false;
    vectorBalls[num].userData.momentum = 0.8;
    /*vectorPivots[num].position.z -= 0.5;*/
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
function checkBallCollision(collisionCenter, center)
{
    return (collisionCenter.distanceToSquared(center) <= (raio*raio*4)) && (collisionCenter.equals(center) == false);
}
function colideBall(ball)
{
    var i, collisionCenter, center;
    center = getCenterPoint(ball);
    for(i = 0; i <= 5; i++)
    {
        collisionCenter = getCenterPoint(vectorBalls[i]);
        if(checkBallCollision(collisionCenter, center))
        {
            return collisionCenter;
        }
    }
    return vecNo;/*Nao ha colisao*/
}
function init() {
    materialWhite = new THREE.MeshBasicMaterial({color: 0xffffff});
    materialBlack = new THREE.MeshBasicMaterial({color: 0x000000});
    materialGreen = new THREE.MeshBasicMaterial({color: 0x0a6c03});
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
    testVec = getCenterPoint(vectorBalls[5]);
    //vector[0] = testVec;
    //window.alert(vectorBalls[2].y);
    

    /*window.addEventListener("keyup", onKeyUp);*/
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}
function changeCuesColor()
{
    for(i = 0; i < 6; i++)
    {
        if (vectorPivots[i].userData.selected == 1){
            vectorSticks[i].material.color.setHex(0x8b0000);
        }
        else
        {
            vectorSticks[i].material.color.setHex(0x003297);
        }
    }
}
/*function updateSticks() Se quisermos mesmo fazer os sticcks a fazer a animação de mexer
{
    if(vectorPivots[0].userData.onShootPosition == 1)
    {
        vectorPivots[0].position.x -= 0.5;
    }
    else if(vectorPivots[0].userData.onShootPosition == 0)
    {
        vectorPivots[0].position.x += 0.5;
    }
    if(vectorPivots[1].userData.onShootPosition == 1)
    {
        vectorPivots[1].position.x += 0.5;
    }
    else if(vectorPivots[1].userData.onShootPosition == 0)
    {
        vectorPivots[1].position.x -= 0.5;
    }
    if(vectorPivots[2].userData.onShootPosition == 1)
    {
        vectorPivots[2].position.x -= 0.5;
    }
    else if(vectorPivots[2].userData.onShootPosition == 0)
    {
        vectorPivots[2].position.x += 0.5;
    }
    if(vectorPivots[3].userData.onShootPosition == 1)
    {
        vectorPivots[3].position.x += 0.5;
    }
    else if(vectorPivots[3].userData.onShootPosition == 0)
    {
        vectorPivots[3].position.x -= 0.5;
    }
    if(vectorPivots[4].userData.onShootPosition == 1)
    {
        vectorPivots[4].position.z -= 0.5;
    }
    else if(vectorPivots[4].userData.onShootPosition == 0)
    {
        vectorPivots[4].position.z += 0.5;
    }
    if(vectorPivots[5].userData.onShootPosition == 1)
    {
        vectorPivots[5].position.z += 0.5;
    }
    else if(vectorPivots[5].userData.onShootPosition == 0)
    {
        vectorPivots[5].position.z -= 0.5;
    }
}*/
function updateball(){  /*Tem de dizer que o onShootPosition passa para 0*/
}
  
function update()
{
    var vec,i;
    // Update nos Selected Cues
    changeCuesColor();
    //updateSticks();
    //updateBall();
    
    /*vectorBalls[5].position.z += 2 * momentum[5];
    momentum[5] = momentum[5]/1.10;
    vec = colideBall(vectorBalls[5]);
    if(vec.equals(vecNo) == false)
    {
        window.alert("YEEEEEEE");
    }*/
} 

function animate() {
    delta = clock.getDelta(); //obtains current time
    update();
    renderer.render(scene,activeCamera);
    requestAnimationFrame(animate);
}
