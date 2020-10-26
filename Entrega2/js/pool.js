/*+--------------------------------------------------------------------------------------+
  |    2nd Laboratory Delivery - Computer Graphics 2020 - Instituto Superior Técnico     |
  +--------------------------------------------------------------------------------------+
  |                          David Miranda nº 93697 Group 10                             |
  |                         João Salgueiro nº 93725 Group 10                             |
  +--------------------------------------------------------------------------------------+*/

var scene, camera, renderer, helper, cameraPerspective, activeCamera, cameraMotion;
var geometry, material, materialGreen,materialBrown, materialWhite, retangle, group, materialBlack;
var ViewSize = 50; // Camera View Size
var raio = 0.5; // radius of ball
var alturaMesa = 2.2; // Hight of table
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
var clock = new THREE.Clock();  //clock init
var delta = 0; //starts time (delta) at 0
var table; 
var vectorBalls = [];
var vectorPivots = [];
var vectorSticks = [];
var vectorHoles = [];
var ang = 0;
var numberOfRandomBalls = 15;
var vecRotation = new THREE.Vector3(0,0,raio);
var vecRotation2 = new THREE.Vector3(0,0,-raio);
var vecNull = new THREE.Vector3(0,0,0);
var randomPositions = [];
var ballInCamera = 0, inShootingMotion = false, c3 = false;
var camera3Vector = new THREE.Vector3(0,0,0);
var line1 = [], line2 = [], line3 = [], line4 = [];
var test;

function createRenderer()
{
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);              
    document.body.appendChild(renderer.domElement);

}
function createCamera() //Camera 1 ("1") - Top view of table
{
    camera = new THREE.OrthographicCamera(-aspect*ViewSize / 2, aspect*ViewSize / 2, ViewSize / 2, -ViewSize / 2, - 1000, 1000);
    camera.rotation.x = -Math.PI / 2;
    camera.position.set(0,5,0);
    activeCamera = camera;
    scene.add(camera);
}
function createCameraPerspective() //Camera 2 ("2") - Perspective view of table
{
    cameraPerspective = new THREE.PerspectiveCamera( 50, SCREEN_WIDTH/SCREEN_HEIGHT, 1, 1000 );
    cameraPerspective.position.set(30,30,25);
    cameraPerspective.rotation.x = -Math.PI / 4;
    cameraPerspective.rotation.y = +Math.PI / 4;
    cameraPerspective.rotation.z = +Math.PI / 4;
    scene.add(cameraPerspective);
}
function createCameraMotion() //Camera 3 ("3") - Follows one of the selected balls in the shooting motion
{
    cameraMotion = new THREE.PerspectiveCamera( 50, SCREEN_WIDTH/SCREEN_HEIGHT, 1, 1000 );
    cameraMotion.position.set(6 + 4 ,1 + raio + 4,-7.5);
    cameraMotion.lookAt(new THREE.Vector3(6,1 + raio,-7.5));
    scene.add(cameraMotion);
}
function initRandom() // initializes the random vector bidimensional matrix with 0 (0 == no ball in the spot)
{
    randomPositions[0] = line1;
    randomPositions[1] = line2;
    randomPositions[2] = line3;
    randomPositions[3] = line4;


    for(i = 0; i < 4; i++){
        for(j = 0; j < 7; j++){
            randomPositions[i][j] = 0;
        }
    }

}
function giveRandomSpeeds(){
    for(i = 6; i < 6+numberOfRandomBalls; i++){
        vectorBalls[i].userData.direction.copy(new THREE.Vector3(Math.floor(Math.random() * 3) ,0,Math.floor(Math.random() * 2)));
    }
}
function createRandom() // Randomly assigns a number of balls to their spots (var numberOfRandomBalls)
{ 
    var num = 0, r;
    test = 0;
    while(test != numberOfRandomBalls){
        for(i=0; i < 4; i++){
            for(j = 0; j < 7; j++){
                r = Math.floor(Math.random() * 11);
                if(r < 5 && randomPositions[i][j] == 0 && test <= numberOfRandomBalls){
                    randomPositions[i][j] = 1;
                    test++;
                    if(test == numberOfRandomBalls){
                        return;
                    }
                }
            }
        }
    }
}
function defineBall()
{
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
function createHole(xCord,yCord,zCord,rotation,r)
{
    hole = new THREE.Mesh(geometry, materialBlack);
    hole.position.x = xCord;
    hole.position.y = yCord;
    hole.position.z = zCord;

    hole.rotation.y += rotation;
    hole.userData = {raio : r};

    vectorHoles.push(hole);
    table.add(hole);
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
    table.add(retangle);
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

    table.add(leg);
}
function createStick(xCord, yCord, zCord, type) //lying down = 1 (45º Rotation) -> type defines the rotation of the stick
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

function createBall(xCord, yCord, zCord)
{
    ball = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff}));

    ball.position.x = xCord;
    ball.position.y = yCord;
    ball.position.z = zCord;
    ball.userData = {momentum: 0, collision: -1 ,direction: new THREE.Vector3(0,0,0), falling : false};

    vectorBalls.push(ball);
    scene.add(ball);

    return ball;
}
function initTable() // Inits all the component of the pool table
{
    defineLegs();
    createLegs(7,-4.5,14.5);
    createLegs(7,-4.5,-14.5);
    createLegs(-7,-4.5,-14.5);
    createLegs(-7,-4.5,14.5);

    defineHole1();
    createHole(-7.5,0.5,-15, 0,2);
    createHole(-7.5,0.5, 15, Math.PI /2,2);
    createHole(7.5,0.5, 15, Math.PI ,2);
    createHole(7.5,0.5, -15, - 5 * (Math.PI/2) ,2);

    defineHole2();
    createHole(-7.5,0.5,0, 0,1.5);
    createHole(7.5,0.5,0, Math.PI,1.5);

    defineRetangleSmall();
    createRetangle(0,1.1,-15,1);
    createRetangle(0,1.1,15,1);

    defineRetangleBig();
    createRetangle(-7.5,1.1,0,2);
    createRetangle(7.5,1.1,0,2);

    defineBottomTable();
    createRetangle(0,0.5,0,3);
    scene.add(table);
}
function initPivots(num) // Inits the center rotation point of the cues (Pivot == center point of rotation)
{
    while( num > 0)
    {
        pivotPoint = new THREE.Object3D();
        pivotPoint.userData = {selected: 0, onShootPosition: true};
        vectorPivots.push(pivotPoint)
        num--;
    }
}
function unitePivotStick() // agregates the cue's structure togheter
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
    vectorPivots[4].position.set(0,alturaMesa,14);
    vectorPivots[5].add(vectorSticks[5]);
    vectorPivots[5].position.set(0,alturaMesa,-14); 
}
function initCues() // inicializes the cues
{
    defineStick();
    initPivots();
    initPivots(6);

    createStick(5.5,1.5,0,0);
    createStick(-5.5,1.5,0,2);
    createStick(5.5,1.5,0,0);
    createStick(-5.5,1.5,0,2);
    createStick(0,1.5,5.5,1);
    createStick(0,1.5,-5.5,3);

    unitePivotStick();
   
    // Pivot points
    scene.add(vectorPivots[0]);
    scene.add(vectorPivots[1]);
    scene.add(vectorPivots[2]);
    scene.add(vectorPivots[3]);
    scene.add(vectorPivots[4]);
    scene.add(vectorPivots[5]);
}
function createRandomBalls() // Inicializes all Randomly allocated balls
{
    var x = -3, z = -6;

    for(i = 0; i < 4; i++){
        z = -6;
        for(j = 0; j < 7; j++){
            if(randomPositions[i][j] == 1){
                createBall(x, 1 + raio, z);
            }
            z += 2;
        }
        x += 2;
    }
}

function initBalls()  //Inicializes all balls
{
    defineBall();
    createBall(6,1 + raio,-7.5);//Ball0
    createBall(-6,1 + raio,-7.5);//Ball1
    createBall(6,1 + raio,7.5);//Ball2
    createBall(-6,1 + raio,7.5);//Ball3
    createBall(0,1 + raio,14);//Ball4
    createBall(0,1 + raio,-14);//Ball5

    createRandomBalls();
}

function onResize()
{
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (window.innerHeight > 0 && window.innerWidth > 0) {
        activeCamera.aspect = window.innerWidth / window.innerHeight;
        activeCamera.updateProjectionMatrix();
    }
}
function onKeyDown(e)  //KeyPressed
{    
    switch (e.keyCode) {
    case 32://SPACE
        shootBalls();
        break;
    case 49://1
        activeCamera = camera;
        c3 =  false;
        break;
    case 50://2
        activeCamera = cameraPerspective;
        c3 = false;
        break;
    case 51://3
        activeCamera = cameraMotion;
        c3 = true;
        break;
    case 52: //4
        vectorPivots[0].userData.selected ^= 1;//XOR operation
        if(inShootingMotion == false){
            ballInCamera = 0;
        }
        break;
    case 53: //5
        vectorPivots[1].userData.selected ^= 1;//XOR operation
        if(inShootingMotion == false){
            ballInCamera = 1;
        }
        break;
    case 54: //6
        vectorPivots[2].userData.selected ^= 1;//XOR operation
        if(inShootingMotion == false){
            ballInCamera = 2;
        }
        break;
    case 55: //7
        vectorPivots[3].userData.selected ^= 1;//XOR operation
        if(inShootingMotion == false){
            ballInCamera = 3;
        }
        break;
    case 56: //8
        vectorPivots[4].userData.selected ^= 1;//XOR operation
        if(inShootingMotion == false){
            ballInCamera = 4;
        }
        break;
    case 57: //9
        vectorPivots[5].userData.selected ^= 1;//XOR operation
        if(inShootingMotion == false){
            ballInCamera = 5;
        }
        break;
   case 37: // Left key
        if(ang >= -60 && ang <= 60){
            for(i = 0; i < 6; i++){
                if(vectorPivots[i].userData.selected == 1){
                    if(ang < Math.PI/3){
                        vectorPivots[i].rotation.y += (2*Math.PI/3) * delta;
                        ang += (2*Math.PI/3) * delta;
                    }
                }
            }
        }
        break;
    case 39: // Left key
        if(ang >= -60 && ang <= 60){
            for(i = 0; i < 6; i++){
                if(vectorPivots[i].userData.selected == 1){
                    if(ang >= -Math.PI/3){
                        vectorPivots[i].rotation.y -= (2*Math.PI/3) * delta;
                        ang -= (2*Math.PI/3) * delta;
                    }
                }
            }
        }
        break
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
function createScene()
{
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x808080); //light blue
    scene.add(new THREE.AxisHelper(50));  //Axis with 50 length
}

function camera3() // Sees what ball the camera must follow and updates the camera's vector
{
    var sel = -1, center = new THREE.Vector3(0,0,0);
    if(c3){

        center.copy(getCenterPoint(vectorBalls[ballInCamera]));

        activeCamera.position.set(center.getComponent(0) + 4 ,center.getComponent(1)  + raio + 4, center.getComponent(2));
        activeCamera.lookAt(center);
        camera3Vector.copy(vectorBalls[ballInCamera].userData.direction);
        
    }
}
function shootBalls() // Shoots all selected Balls (updates the vector of motion)
{
    var i, dir = new THREE.Vector3();
    for(i = 0; i < 6; i++)
    {
        if(vectorPivots[i].userData.selected == 1 && vectorPivots[i].userData.onShootPosition == true)
        {
            centerBall = getCenterPoint(vectorBalls[i]);

            centerCue = getCenterPointStick(vectorSticks[i]);
            centerCue.setY(1.5);/*Ficar da mesma altura da bola de snooker*/

            vectorBalls[i].userData.direction.copy(dir.subVectors(centerBall,centerCue).normalize());
            dir.subVectors(centerBall,centerCue).normalize()
            shootBall(i);
        }
        vectorPivots[i].userData.selected = 0;
    }
}
function shootBall(num) // Gives a ball to be shot velocity
{
    if(vectorPivots[num].userData.onShootPosition == true){
        vectorPivots[num].userData.onShootPosition = false;
        vectorBalls[num].userData.direction.multiplyScalar(50 * delta);
    }
}

function getCenterPointStick(mesh) // Returns a Vector3 of the center point of Stick
{
    var middle = new THREE.Vector3();
    var geometry = mesh.geometry;

    geometry.computeBoundingBox();

    middle.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
    middle.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
    middle.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;
    mesh.localToWorld( middle );
    return middle;
}
function getCenterPoint(mesh) // Returns a Vector3 of the center point of a Ball
{ 
    return new THREE.Vector3(mesh.position.x,1+raio, mesh.position.z);
}
function checkBallCollision(collisionCenter, center) // Checks for colisions between balls
{
    return (collisionCenter.distanceToSquared(center) <= (raio*raio*4)) && (collisionCenter.equals(center) == false);
}
function correctBallPosition(ball, collisionBall) // Corrects the overlap between balls after colision
{
    var collisionCenter, d1, d2;
    var center, vecTrans,test = new THREE.Vector3();
    var vecTrans;
    vecTrans = ball.userData.direction;
    collisionCenter = getCenterPoint(collisionBall);
    center = getCenterPoint(ball);
    test.copy(center);
    d1 = test.add(vecTrans).distanceTo(collisionCenter);
    test.copy(center);
    d2 = center.sub(vecTrans).distanceTo(collisionCenter);
    if( d1< d2){
        center = getCenterPoint(ball);
        center.addScaledVector(vecTrans,-0.01);
        while(checkBallCollision(collisionCenter, center) == true)
        {
            center.addScaledVector(vecTrans,-0.01);
        }
        ball.position.x = center.getComponent(0);
        ball.position.z = center.getComponent(2);
    }
    else
    {
        center = getCenterPoint(ball);
        center.addScaledVector(vecTrans,0.01);
        while(checkBallCollision(collisionCenter, center) == true)
        {
            center.addScaledVector(vecTrans,0.01);
        }
        ball.position.x = center.getComponent(0);
        ball.position.z = center.getComponent(2);
    }
}
function reflectsVector(vector, wallNum) // updates a vector of a ball when it colides with a wall
{
    if(wallNum == 1){ // Z axis Wall
        vector.setComponent(0, -vector.getComponent(0));
    }
    if(wallNum == 2){ //X axis Wall
       vector.setComponent(2, -vector.getComponent(2));
    }
    return vector;
}
function updateBallsStats(ball,collisionBall) // Updates the balls vectors of movement after colision between balls
{
    var newDirBall= new THREE.Vector3(), newDirCollisionBall= new THREE.Vector3(), ballDir = new THREE.Vector3(), collisionBallDir= new THREE.Vector3() ;
    var center = getCenterPoint(ball);
    var collisionBallCenter = getCenterPoint(collisionBall);
    var dotB, dif = new THREE.Vector3(), random = new THREE.Vector3(), yo = new THREE.Vector3();
    ballDir.copy(ball.userData.direction);
    collisionBallDir.copy(collisionBall.userData.direction);

    dif.copy(center.sub(collisionBallCenter));
    yo.copy(ballDir.sub(collisionBallDir));
    dotB = yo.dot(dif);
    ballDir.copy(ball.userData.direction);
    random.copy(dif.multiplyScalar(dotB/dif.lengthSq()));
    newDirBall.copy(ballDir.sub(random));
    
    center = getCenterPoint(ball);
    collisionBallCenter = getCenterPoint(collisionBall);
    ballDir.copy(ball.userData.direction);
    collisionBallDir.copy(collisionBall.userData.direction);

    dif.copy(collisionBallCenter.sub(center));
    yo.copy(collisionBallDir.sub(ballDir));
    dotB = yo.dot(dif);
    collisionBallDir.copy(collisionBall.userData.direction);
    random.copy(dif.multiplyScalar(dotB/dif.lengthSq()));
    newDirCollisionBall.copy(collisionBallDir.sub(random));

    ball.translateOnAxis
    ball.userData.direction.copy(newDirBall);
    collisionBall.userData.direction.copy(newDirCollisionBall);
}
function colideWall(ball) // Updates the balls vectors of movement after colision between wall and ball
{
    center = getCenterPoint(ball);

    if(center.getComponent(0) - raio <= -6.85){
        ball.position.x = -6.85 + raio;
        ball.userData.direction.copy(reflectsVector(ball.userData.direction, 1));
    }
    if(center.getComponent(0) + raio >= 6.85){
        ball.position.x = 6.85 - raio;
        ball.userData.direction.copy(reflectsVector(ball.userData.direction, 1));
    }
    if(center.getComponent(2) + raio >= 14.85){
        ball.position.z = 14.85 - raio;
        ball.userData.direction.copy(reflectsVector(ball.userData.direction, 2));
    }
    if(center.getComponent(2) - raio <= - 14.85){
        ball.userData.direction.copy(reflectsVector(ball.userData.direction, 2));
        ball.position.z = -14.85 + raio;
    }
}
function fallIntoHole(ball) // Updates the vectors of movement of a ball when it falls into a hole (falls into infinity)
{
    for(i = 0 ; i < 6; i++){
        if(checkBallCollision(getCenterPoint(vectorHoles[i]), getCenterPoint(ball).addScaledVector(ball.userData.direction, raio*3)) && ball.userData.falling == false){
            ball.userData.direction.copy(new THREE.Vector3(0,-1*delta,0));
            ball.userData.falling = true;
        }

    }
}
function colideBall(ball,id) // Checks for all colisions that might happen and corrects the ball movement (wall-ball & ball-ball)
{
    var i, collisionCenter, center;
    center = getCenterPoint(ball);


    fallIntoHole(ball);
    center = getCenterPoint(ball);
    colideWall(ball);
    center = getCenterPoint(ball);

    for(i = id; i < 21; i++)
    {
        if(vectorBalls[i].userData.falling == false){
            if(i <= 5){
                if(vectorPivots[i].userData.onShootPosition == false){

                    collisionCenter = getCenterPoint(vectorBalls[i]);
                    if(checkBallCollision(collisionCenter, center))
                    {
                            if(ball.userData.direction.length() < vectorBalls[i].userData.direction.length()){
                                correctBallPosition(vectorBalls[i],ball);/*A vectorBall foi a que colidiu*/
                                updateBallsStats(vectorBalls[i],ball);
                            }
                            else
                            {
                                correctBallPosition(ball,vectorBalls[i]);/*A bola foi a que colidiu*/
                                updateBallsStats(ball,vectorBalls[i]);
                            }
                            center = getCenterPoint(ball);
                            collisionCenter = getCenterPoint(vectorBalls[i]);
                            return ;
                    }
                }
            }
            else{
                collisionCenter = getCenterPoint(vectorBalls[i]);

                if(checkBallCollision(collisionCenter, center))
                {
                        if(ball.userData.direction.length() < vectorBalls[i].userData.direction.length()){
                            correctBallPosition(vectorBalls[i],ball);/*A vectorBall foi a que colidiu*/
                            updateBallsStats(vectorBalls[i],ball);
                        }
                        else
                        {
                            correctBallPosition(ball,vectorBalls[i]);/*A bola foi a que colidiu*/
                            updateBallsStats(ball,vectorBalls[i]);
                        }
                        center = getCenterPoint(ball);
                        collisionCenter = getCenterPoint(vectorBalls[i]);
                        return ;
                }
            }
        }
    }

    return ;// No colision
}
function init()
{
    materialWhite = new THREE.MeshBasicMaterial({color: 0xffffff});
    materialBrown = new THREE.MeshBasicMaterial({color: 0x35281E});
    materialGreen = new THREE.MeshBasicMaterial({color: 0x0a6c03});
    materialBlack = new THREE.MeshBasicMaterial({color: 0x000000});
    table = new THREE.Group();

    initRandom();
    createRandom();

    createScene();
    createRenderer();
    createCamera();
    createCameraPerspective();
    createCameraMotion();

    initCues();
    initTable();
    initBalls();

    giveRandomSpeeds();


    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}
function changeCuesColor() // Visual update for the selected cues
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
function updateBallPosition(ball) // Updates positions 
{ 

    ball.position.x += ball.userData.direction.getComponent(0);
    ball.position.z += ball.userData.direction.getComponent(2);
    if(ball.userData.falling){
        ball.position.y += ball.userData.direction.getComponent(1);
        ball.userData.direction.setComponent(1,ball.userData.direction.getComponent(1)*1.01);
    }
    else{
        ball.position.y = 1 + raio;
    }
}
function updateBallAnimation(ball) // Updates ball postion and rotation
{
    updateBallPosition(ball);
    ball.rotation.x += (ball.userData.direction.getComponent(0) * Math.PI) / raio;
    ball.rotation.z += (ball.userData.direction.getComponent(2) * Math.PI) / raio; /*roda em funcao do raio da bola*/
    if(ball.userData.falling == false){
        ball.userData.direction = ball.userData.direction.multiplyScalar(0.97);
    }
}
function updateBalls()
{
    var i;
    for(i = 0; i < 21; i++)
    {
        updateBallAnimation(vectorBalls[i]);
    }
    if(c3){
        activeCamera.position.x += camera3Vector.getComponent(0);
        activeCamera.position.z += camera3Vector.getComponent(2);
     }
}
function resetCollisionFlag()
{ 
    var i;
    for(i = 0; i < 21; i++)
    {
        vectorBalls[i].userData.collision = -1;
    }

}
function colideBalls()
{
    var i;
    for(i = 0; i < 21; i++){
        if(vectorBalls[i].userData.falling == false){
            if(i <=5)
            {
                if(vectorPivots[i].userData.onShootPosition == false){
                    colideBall(vectorBalls[i],i+1);
                }
            }
            else
            {
                colideBall(vectorBalls[i],i+1);
            }
        }
        
    }
}
function update()
{
    changeCuesColor();
    colideBalls();
    
    updateBalls();
    camera3();
    resetCollisionFlag();
} 

function animate() {
    delta = clock.getDelta(); //obtains current time
    update();
    renderer.render(scene,activeCamera);
    requestAnimationFrame(animate);
}
