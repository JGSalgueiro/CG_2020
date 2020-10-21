/*+--------------------------------------------------------------------------------------+
  |    2nd Laboratory Delivery - Computer Graphics 2020 - Instituto Superior Técnico     |
  +--------------------------------------------------------------------------------------+
  |                          David Miranda nº 93697 Group 10                             |
  |                         João Salgueiro nº 93725 Group 10                             |
  +--------------------------------------------------------------------------------------+*/

var scene, camera, renderer, helper, cameraTop, activeCamera, cameraSide;
var geometry, material, materialGreen,materialBrown, materialWhite, retangle, group, materialBlack;
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
var vecRotation = new THREE.Vector3(0,0,raio);
var vecRotation2 = new THREE.Vector3(0,0,-raio);


function createRenderer()
{
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);              
    document.body.appendChild(renderer.domElement);

}
function createCamera()
{
    camera = new THREE.OrthographicCamera(-aspect*ViewSize / 2, aspect*ViewSize / 2, ViewSize / 2, -ViewSize / 2, - 1000, 1000);
    camera.rotation.x = -Math.PI / 2;
    camera.position.set(0,5,0);
    activeCamera = camera;
    scene.add(camera);
}
function createCameraTop()
{
    cameraTop = new THREE.PerspectiveCamera( 30, SCREEN_WIDTH/SCREEN_HEIGHT, 1, 1000 );
    cameraTop.position.set(30,30,25);
    cameraTop.rotation.x = -Math.PI / 4;
    cameraTop.rotation.y = +Math.PI / 4;
    cameraTop.rotation.z = +Math.PI / 4;
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
function createHole(xCord,yCord,zCord,rotation){
    hole = new THREE.Mesh(geometry, materialBlack);
    hole.position.x = xCord;
    hole.position.y = yCord;
    hole.position.z = zCord;

    hole.rotation.y += rotation;

    group.add(hole);
}

function createRetangle(xCord, yCord, zCord,type) //deitado = 1 : tube lies down (45º Rotation)
{
    if(type == 1)
    {
        retangle = new THREE.Mesh(geometry, materialBrown);
    }
    else if(type == 2)
    {
        retangle = new THREE.Mesh(geometry, materialBrown);
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
function defineLegs()
{
    geometry = new THREE.CylinderGeometry(2,2,15,64);
}
function defineHole1()
{
    geometry = new THREE.CylinderGeometry(2,2,1.1,64,0,false,0,1.6);
}
function defineHole2()
{
    geometry = new THREE.CylinderGeometry(1.5,1.5,1.1,64,0,false,0,3.2);
}
function createLegs(xCord,yCord,zCord)
{
    leg =  new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,10,64), materialBrown);
    leg.position.x = xCord;
    leg.position.y = yCord;
    leg.position.z = zCord;

    group.add(leg);
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
    defineLegs();
    createLegs(7,-4.5,14.5);
    createLegs(7,-4.5,-14.5);
    createLegs(-7,-4.5,-14.5);
    createLegs(-7,-4.5,14.5);

    defineHole1();
    createHole(-7.5,0.5,-15, 0);
    createHole(-7.5,0.5, 15, Math.PI /2);
    createHole(7.5,0.5, 15, Math.PI );
    createHole(7.5,0.5, -15, - 5 * (Math.PI/2) );

    defineHole2();
    createHole(-7.5,0.5,0, 0);
    createHole(7.5,0.5,0, Math.PI);

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
    vectorPivots[0].position.set(6,alturaMesa,-7.5);
    vectorPivots[1].add(vectorSticks[1]);
    vectorPivots[1].position.set(-6,alturaMesa,-7.5);
    vectorPivots[2].add(vectorSticks[2]);
    vectorPivots[2].position.set(6,alturaMesa,7.5);
    vectorPivots[3].add(vectorSticks[3]);
    vectorPivots[3].position.set(-6,alturaMesa,7.5);
    vectorPivots[4].add(vectorSticks[4]);
    vectorPivots[4].position.set(0,alturaMesa,12);
    vectorPivots[5].add(vectorSticks[5]);
    vectorPivots[5].position.set(0,alturaMesa,-12); 
}
function initCues(){
    defineStick();
    initPivots();
    initPivots(6);

    createStick(5.5,1.5,0,0);
    createStick(-5.5,1.5,0,2);
    createStick(5.5,1.5,0,0);
    createStick(-5.5,1.5,0,2);
    createStick(0,1.6,7.5,1);
    createStick(0,1.6,-7.5,3);

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
    createBall(6,1 + raio,-7.5);//Ball0
    createBall(-6,1 + raio,-7.5);//Ball1
    createBall(6,1 + raio,7.5);//Ball2
    createBall(-6,1 + raio,7.5);//Ball3
    createBall(0,1 + raio,14);//Ball4
    createBall(0,1 + raio,-14);//Ball5

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
    if(vectorPivots[num].userData.onShootPosition == true){
        vectorPivots[num].userData.onShootPosition = false;
        vectorBalls[num].userData.momentum = 0.8;
    }
    vectorPivots[num].userData.selected = 0;
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
function checkBallCollision(collisionBall, ball)
{
    var collisionCenter = getCenterPoint(collisionBall);
    var center = getCenterPoint(ball);
    return (collisionCenter.distanceToSquared(center) <= (raio*raio*4)) && (collisionCenter.equals(center) == false);
}
function checkPointColision(ball, collisionBall)
{
    var rad = 0.0174533;/*Precisao de 1 grau*/
    var startAngle = 0;
    var i,e;
    var x1,x2,z1,z2,cx,cy, cx2,cy2;
    var bufferVec;
    var ballPoints = [];
    var collisionBallPoints = [];
    var collisionCenter = getCenterPoint(collisionBall);
    var center = getCenterPoint(ball);

    cx = center.getComponent(0);
    cy = center.getComponent(2);
    window.alert(cy+0.5);
    cx2 = collisionCenter.getComponent(0);
    cy2 = collisionCenter.getComponent(2);

    for(i = 0; i < 360; i++)
    {
        x1 = Math.round((cx + raio*Math.cos(startAngle + rad))*100) / 100;
        z1 = Math.round((cy + raio*Math.sin(startAngle + rad))*100) / 100;
        bufferVec = new THREE.Vector3(x1, 1 + raio,z1);
        ballPoints.push(bufferVec);


        x2 = Math.round((cx2 + raio*Math.cos(startAngle + rad))* 100) /100;
        z2 = Math.round((cy2 + raio*Math.sin(startAngle + rad))*100) /100;
        bufferVec = new THREE.Vector3(x2, 1 + raio,z2);
        collisionBallPoints.push(bufferVec);
        startAngle += rad;
    }
    for(i = 0; i < 360; i++)
    {
        for(e = 0; e < 360; e++)
        {
            /*window.alert("YO Z:" + collisionBallPoints[e].getComponent(2));*/
            if(ballPoints[i].equals(collisionBallPoints[e]))
            {
                window.alert("PUTAS: z" + collisionBallPoints[e].getComponent(2) +
                            "PUTAS: x" + collisionBallPoints[e].getComponent(0)
                            +"A: z" + ballPoints[i].getComponent(2) +
                            "A: x" + ballPoints[i].getComponent(0));
            }
        }
    }
    window.alert("cry")

}

function colideBall(ball)
{
    var i, collisionCenter, center;
    center = getCenterPoint(ball);
    for(i = 0; i <= 5; i++)
    {
        //collisionCenter = getCenterPoint(vectorBalls[i]);
        if(checkBallCollision(vectorBalls[i], ball))
        {
            checkPointColision(ball,vectorBalls[i]);
            return ;
        }
    }
    return vecNo;/*Nao ha colisao*/
}
function init() {
    materialWhite = new THREE.MeshBasicMaterial({color: 0xffffff});
    materialBrown = new THREE.MeshBasicMaterial({color: 0x35281E});
    materialGreen = new THREE.MeshBasicMaterial({color: 0x0a6c03});
    materialBlack = new THREE.MeshBasicMaterial({color: 0x000000});
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
function updateBallAnimation(ball)
{
    ball.position.z += 2*ball.userData.momentum;/* Tem de ser substituido por uma funcao q calcule a direcao do movimento*/
    ball.rotation.x += (2+ball.userData.momentum) / raio; /*roda em funcao do raio da bola*/
    ball.userData.momentum = ball.userData.momentum/1.05;
}
function updateWhiteBalls()
{
    var i;
    for(i = 0; i < 6; i++)
    {
        updateBallAnimation(vectorBalls[i]);
    }
}
function updateBalls(){  /*Tem de dizer que o onShootPosition passa para 0*/
    updateWhiteBalls();
}
  
function update()
{
    var vec,i;
    // Update nos Selected Cues
    changeCuesColor();
    //updateSticks();
    colideBall(vectorBalls[5]);
    updateBalls();
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
