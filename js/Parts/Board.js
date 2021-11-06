import * as THREE from "../../../PinBall/lib/three/build/three.module.js";
import {commons} from "../../../PinBall/lib/ammohelpers/lib/Common.js";

/**
 * Utgangspunktet for denne klassen er hentet fra ammohelpers/MyGameBoard
 *
 */

export const board= {
    //Physics Ammo
    myPhysicsWorld: undefined,
    //Rigid bodies for physics
    gameBoardRigidBody: undefined,
    bottom2Rigid: undefined,
    bottomBoardRigidBody: undefined,
    coverBoardRigidBody: undefined,
    startRampRigidBody: undefined,
    diagonalBarBody: undefined,
    upperLeftConcaveBody: undefined,
    upperRightConcaveBody: undefined,
    lowerLeftConcaveBody: undefined,
    lowerRightConcaveBody: undefined,

    TERRAIN_SIZE: 100,

    init(myPhysicsWorld) {
        this.myPhysicsWorld = myPhysicsWorld;
    },

    create(setCollisionMask=true) {
        const position = {x:0, y:0, z:50};
        const mass = 0;

        //THREE, bruker Shape og ExtrudeGeometry:
        let groupMesh = new THREE.Group();
        groupMesh.userData.tag = 'gameboard';
        groupMesh.userData.name = 'terrain';
        groupMesh.position.set(position.x, position.y, position.z);

        //FRAME
        let hole1 = new THREE.Shape();
        hole1.moveTo( 5,5 );
        hole1.lineTo( 5, this.TERRAIN_SIZE * 3.5 -5 );
        hole1.lineTo( this.TERRAIN_SIZE * 2-5, this.TERRAIN_SIZE * 3.5-5 );
        hole1.lineTo( this.TERRAIN_SIZE * 2-5, 5 );
        hole1.lineTo( this.TERRAIN_SIZE * 2-25, 5 );
        hole1.lineTo( (this.TERRAIN_SIZE * 2-5)/2-5, -15 );
        hole1.lineTo( 5, 5 );
        let frameBoardMaterial = new THREE.MeshPhongMaterial( { color: 0x3d85c6, side: THREE.DoubleSide } );
        let frameShape = this.createThreeShape(this.TERRAIN_SIZE*2, this.TERRAIN_SIZE*3.5);
        frameShape.holes.push(hole1);
        let frameBoardMesh = this.createExtrudeMesh(frameShape, 1, 15, true, 1, 1,0,1,frameBoardMaterial);
        frameBoardMesh.rotation.x = -Math.PI / 2;
        frameBoardMesh.position.x = -this.TERRAIN_SIZE;
        frameBoardMesh.position.z = this.TERRAIN_SIZE;
        frameBoardMesh.receiveShadow = true;
        groupMesh.add( frameBoardMesh );

        //BOTTOM
        let hole2 = new THREE.Shape();
        hole2.moveTo(5, 5);
        hole2.lineTo(5, 8);
        hole2.lineTo(this.TERRAIN_SIZE * 2.5-73, 8);
        hole2.lineTo(this.TERRAIN_SIZE * 2.5-73, 5);
        hole2.lineTo((this.TERRAIN_SIZE * 2-5)/2-5, -15);
        hole2.lineTo(5, 5);
        let bottomBoardMaterial = new THREE.MeshPhongMaterial( { color: 0x121212, side: THREE.DoubleSide } );
        let bottomBoardShape = this.createThreeShape(this.TERRAIN_SIZE*2, this.TERRAIN_SIZE*3.5);
        bottomBoardShape.holes.push(hole2);
        let bottomBoardMesh = this.createExtrudeMesh(bottomBoardShape, 1, 7, true, 1,1, 0, 1, bottomBoardMaterial);
        bottomBoardMesh.rotation.x = -Math.PI / 2;
        bottomBoardMesh.position.x = -this.TERRAIN_SIZE;
        bottomBoardMesh.position.z = this.TERRAIN_SIZE;
        bottomBoardMesh.position.y = -2;
        bottomBoardMesh.receiveShadow = true;
        groupMesh.add( bottomBoardMesh );

        let bottom2Material = new THREE.MeshPhongMaterial( { color: 0xea660d, side: THREE.DoubleSide } );
        let bottom2Shape = this.createThreeShape(this.TERRAIN_SIZE*2, this.TERRAIN_SIZE*3.5);
        let bottom2Mesh = this.createExtrudeMesh(bottom2Shape, 1, 1, true, 0.1,1, 0, 1, bottom2Material);
        bottom2Mesh.rotation.x = -Math.PI / 2;
        bottom2Mesh.position.x = -this.TERRAIN_SIZE;
        bottom2Mesh.position.z = this.TERRAIN_SIZE;
        bottom2Mesh.position.y = -2;
        bottom2Mesh.receiveShadow = true;
        groupMesh.add( bottom2Mesh);

        //GLASS COVER; Ingen AMMO, dvs ballen kan komme gjennom
        let coverBoardMaterial = new THREE.MeshPhongMaterial( { color: 0xeeeeee, side: THREE.DoubleSide } );
        coverBoardMaterial.transparent = true;
        coverBoardMaterial.opacity = 0.1;
        let coverShape = this.createThreeShape(this.TERRAIN_SIZE*2, this.TERRAIN_SIZE*3.5);
        let coverBoardMesh = this.createExtrudeMesh(coverShape, 1, 0.3, true, 1, 1, 0, 1, coverBoardMaterial);
        coverBoardMesh.rotation.x = -Math.PI / 2;
        coverBoardMesh.position.x = -this.TERRAIN_SIZE;
        coverBoardMesh.position.z = this.TERRAIN_SIZE;
        coverBoardMesh.position.y = 16;
        coverBoardMesh.receiveShadow = true;
        groupMesh.add( coverBoardMesh );

        //RAMP on the right
        let startRampMaterial = new THREE.MeshPhongMaterial( { color: 0xF31CEC, side: THREE.DoubleSide } );
        //let startRampShape = this.createThreeShape(10, this.TERRAIN_SIZE*3.5-75);
        //let startRampMesh = this.createExtrudeMesh(startRampShape, 1, 15, true, 1,1,0, 1, startRampMaterial);
        let startRampMesh = this.makeSimpleBoxMesh(7, 10, 280, startRampMaterial);
        //startRampMesh.rotation.x = -Math.PI / 2;
        startRampMesh.position.x = 83;
        startRampMesh.position.y = 10;
        startRampMesh.position.z = -40;
        startRampMesh.receiveShadow = true;
        groupMesh.add(startRampMesh);

        //Top right Corner
        let concaveShape = this.createConcaveShape();
        let upperRightConcaveMesh = this.createExtrudeMesh(concaveShape, 1, 15, false, 0.1, 1, 0, 1, frameBoardMaterial);
        upperRightConcaveMesh.scale.x = 15;
        upperRightConcaveMesh.scale.y = 15;
        upperRightConcaveMesh.rotation.x = -Math.PI / 2;
        upperRightConcaveMesh.rotation.z = 2.35;
        upperRightConcaveMesh.position.z =  -210;
        upperRightConcaveMesh.position.x =  62;
        upperRightConcaveMesh.receiveShadow = true;
        groupMesh.add(upperRightConcaveMesh);

        //Top left corner
        let upperLeftConcaveMesh = this.createExtrudeMesh(concaveShape, 1, 15, false, 0.1, 1, 0, 1, frameBoardMaterial);
        upperLeftConcaveMesh.scale.x = 15;
        upperLeftConcaveMesh.scale.y = 15;
        upperLeftConcaveMesh.rotation.x = -Math.PI / 2;
        upperLeftConcaveMesh.rotation.z = -2.35;
        upperLeftConcaveMesh.position.z =  -210;
        upperLeftConcaveMesh.position.x =  -62;
        upperLeftConcaveMesh.receiveShadow = true;
        groupMesh.add(upperLeftConcaveMesh);

        // lower boundaries (Actually right)
        let concaveMaterial = new THREE.MeshPhongMaterial( { color: 0x6735e5, side: THREE.DoubleSide } );
        let lowerLeftConcaveMesh = this.createExtrudeMesh(concaveShape, 1, 15, false, 0.1, 1, 0, 1, concaveMaterial);
        lowerLeftConcaveMesh.scale.x = 13;
        lowerLeftConcaveMesh.scale.y = 9;
        lowerLeftConcaveMesh.rotation.x = -Math.PI / 2;
        lowerLeftConcaveMesh.rotation.z = 0.78;
        lowerLeftConcaveMesh.position.z =  55;
        lowerLeftConcaveMesh.position.x =  37;
        lowerLeftConcaveMesh.receiveShadow = true;
        groupMesh.add(lowerLeftConcaveMesh);

        //Actually left
        let lowerRightConcaveMesh = this.createExtrudeMesh(concaveShape, 1, 15, false, 0.1, 1, 0, 1, concaveMaterial);
        lowerRightConcaveMesh.scale.x = 13;
        lowerRightConcaveMesh.scale.y = 9;
        lowerRightConcaveMesh.rotation.x = -Math.PI / 2;
        lowerRightConcaveMesh.rotation.z = -0.78;
        lowerRightConcaveMesh.position.z =  55;
        lowerRightConcaveMesh.position.x = -55;
        lowerRightConcaveMesh.receiveShadow = true;
        groupMesh.add(lowerRightConcaveMesh);


        let springConstraintMaterial = new THREE.MeshPhongMaterial({color: 0xf78a1d, side: THREE.DoubleSide});

        let springConstraintMesh = this.createSpringConstraint( 0,20,
            {x: 90, y: 15, z: 91}, {x: 90, y: 15, z: 50}, {x: 7, y: 7, z: 7}, springConstraintMaterial);
        groupMesh.add(springConstraintMesh.springCubeMesh1);
        groupMesh.add(springConstraintMesh.springCubeMesh2);

        /**********Shapes and obstacles**********/

        //Cylinders top of board

        // Top left cone
        let topLeftCylinderMaterial = new THREE.MeshPhongMaterial( { color: 0xf4d800, side: THREE.DoubleSide } );
        let topLeftCylinderMesh = this.makeCylinderMesh(10, 20, 15, 50, 1, false, 0, 6.3, topLeftCylinderMaterial);
        topLeftCylinderMesh.position.y = 7;
        topLeftCylinderMesh.position.z = -200;
        topLeftCylinderMesh.position.x = -70;
        groupMesh.add(topLeftCylinderMesh);

        // Top right cone
        let topRightCylinderMaterial = new THREE.MeshPhongMaterial( { color: 0xf4d800, side: THREE.DoubleSide } );
        let topRightCylinderMesh = this.makeCylinderMesh(10, 20, 15, 50, 1, false, 0, 6.3, topRightCylinderMaterial);
        topRightCylinderMesh.position.y = 7;
        topRightCylinderMesh.position.z = -200;
        topRightCylinderMesh.position.x = 60;
        groupMesh.add(topRightCylinderMesh);

        // Middle cylinders
        let topMiddleLeftCylinderMaterial = new THREE.MeshPhongMaterial( { color: 0xf4d800, side: THREE.DoubleSide } );
        let topMiddleLeftCylinderMesh = this.makeCylinderMesh(10, 10, 15, 50, 1, false, 0, 6.3, topMiddleLeftCylinderMaterial);
        topMiddleLeftCylinderMesh.position.y = 7;
        topMiddleLeftCylinderMesh.position.z = -180;
        topMiddleLeftCylinderMesh.position.x = 30;
        groupMesh.add(topMiddleLeftCylinderMesh);

        let topMiddleCylinderMaterial = new THREE.MeshPhongMaterial( { color: 0xf4d800, side: THREE.DoubleSide } );
        let topMiddleCylinderMesh = this.makeCylinderMesh(10, 10, 15, 50, 1, false, 0, 6.3, topMiddleCylinderMaterial);
        topMiddleCylinderMesh.position.y = 7;
        topMiddleCylinderMesh.position.z = -180;
        topMiddleCylinderMesh.position.x = -5;
        groupMesh.add(topMiddleCylinderMesh);

        let topMiddleRightCylinderMaterial = new THREE.MeshPhongMaterial( { color: 0xf4d800, side: THREE.DoubleSide } );
        let topMiddleRightCylinderMesh = this.makeCylinderMesh(10, 10, 15, 50, 1, false, 0, 6.3, topMiddleRightCylinderMaterial);
        topMiddleRightCylinderMesh.position.y = 7;
        topMiddleRightCylinderMesh.position.z = -180;
        topMiddleRightCylinderMesh.position.x = -40;
        groupMesh.add(topMiddleRightCylinderMesh);

        //Middle section
        //Middle Left
        let middleLeftRectangleMaterial = new THREE.MeshPhongMaterial( { color: 0x48ca10, side: THREE.DoubleSide } );
        let middleLeftRectangleMesh = this.makeSimpleBoxMesh(2, 15, 30, middleLeftRectangleMaterial);
        middleLeftRectangleMesh.position.y = 7;
        middleLeftRectangleMesh.position.x = -85;
        middleLeftRectangleMesh.position.z = -75;
        middleLeftRectangleMesh.rotation.y = Math.PI/3.6
        groupMesh.add(middleLeftRectangleMesh);

        let middleLeftRectangleMaterial2 = new THREE.MeshPhongMaterial( { color: 0x48ca10, side: THREE.DoubleSide } );
        let middleLeftRectangleMesh2 = this.makeSimpleBoxMesh(2, 15, 25, middleLeftRectangleMaterial2);
        middleLeftRectangleMesh2.position.y = 7;
        middleLeftRectangleMesh2.position.x = -85;
        middleLeftRectangleMesh2.position.z = -65;
        middleLeftRectangleMesh2.rotation.y = Math.PI/2
        groupMesh.add(middleLeftRectangleMesh2);

        //Middle right
        let middleRightRectangleMaterial = new THREE.MeshPhongMaterial( { color: 0x48ca10, side: THREE.DoubleSide } );
        let middleRightRectangleMesh = this.makeSimpleBoxMesh(2, 15, 30, middleRightRectangleMaterial);
        middleRightRectangleMesh.position.y = 7;
        middleRightRectangleMesh.position.x = 67;
        middleRightRectangleMesh.position.z = -75;
        middleRightRectangleMesh.rotation.y = Math.PI/1.4
        groupMesh.add(middleRightRectangleMesh);

        let middleRightRectangleMaterial2 = new THREE.MeshPhongMaterial( { color: 0x48ca10, side: THREE.DoubleSide } );
        let middleRightRectangleMesh2 = this.makeSimpleBoxMesh(2, 15, 25, middleRightRectangleMaterial2);
        middleRightRectangleMesh2.position.y = 7;
        middleRightRectangleMesh2.position.x = 67;
        middleRightRectangleMesh2.position.z = -65;
        middleRightRectangleMesh2.rotation.y = Math.PI/2
        groupMesh.add(middleRightRectangleMesh2);

        //Lower rectangles over arms
        //Lower left arm
        let lowerLeftRectangleMaterial = new THREE.MeshPhongMaterial( { color: 0x48ca10, side: THREE.DoubleSide } );
        let lowerLeftRectangleMesh = this.makeSimpleBoxMesh(4, 15, 60, lowerLeftRectangleMaterial);
        lowerLeftRectangleMesh.position.y = 7;
        lowerLeftRectangleMesh.position.x = -50;
        lowerLeftRectangleMesh.position.z = 15;
        lowerLeftRectangleMesh.rotation.y = Math.PI/3.6
        groupMesh.add(lowerLeftRectangleMesh);

        // Lower right arm
        let lowerRightRectangleMaterial = new THREE.MeshPhongMaterial( { color: 0x48ca10, side: THREE.DoubleSide } );
        let lowerRightRectangleMesh = this.makeSimpleBoxMesh(4, 15, 60, lowerRightRectangleMaterial);
        lowerRightRectangleMesh.position.y = 7;
        lowerRightRectangleMesh.position.x = 30;
        lowerRightRectangleMesh.position.z = 15;
        lowerRightRectangleMesh.rotation.y = Math.PI/1.4
        groupMesh.add(lowerRightRectangleMesh);

        /***********Start: Shape example codes, NO AMMOS***********************/

        //Heart example
        let heartShape = this.createHeartShape();
        let heartMesh = this.createExtrudeMesh(heartShape, 1, 15, false, 0.1, 1, 0, 1, startRampMaterial);
        heartMesh.rotation.x = -Math.PI/2;
        heartMesh.rotation.z = -Math.PI;
        heartMesh.scale.x = 0.2;
        heartMesh.scale.y = 0.2;
        heartMesh.position.x = -3.8;
        heartMesh.position.z = -40;
        groupMesh.add(heartMesh);
        /***********END: Shape example codes, NO AMMOS************** *********/


        //Rotate board slightly for downward pull on the ball
        groupMesh.rotation.x = this.toRadians(11.45)


        /**************Add Ammos********************************/
        //PhysicsAmmo: frame
        this.addAmmo(frameBoardMesh, this.gameBoardRigidBody, groupMesh, 0.05, 0.3, position, mass, setCollisionMask);
        //PhysicsAmmo: bottom
        this.addAmmo(bottomBoardMesh, this.bottomBoardRigidBody, groupMesh, 0.05, 0.3, position, mass, setCollisionMask);
        this.addAmmo(bottom2Mesh, this.bottom2Rigid, groupMesh, 0.05, 0.3, position, mass, setCollisionMask);
        //PhysicsAmmo Cover
        this.addAmmo(coverBoardMesh, this.coverBoardRigidBody, groupMesh, 0.05, 0.3, position, mass, setCollisionMask);
        //PhysicsAmmo Ramp
        this.addAmmo(startRampMesh, this.startRampRigidBody, groupMesh, 0.05, 0.3, position, mass, setCollisionMask);
        //Top right ammo
        this.addAmmo(upperRightConcaveMesh, this.upperRightConcaveBody, groupMesh, 0.05, 0.3, position, mass, setCollisionMask);
        //Top left ammo
        this.addAmmo(upperLeftConcaveMesh, this.upperLeftConcaveBody, groupMesh, 0.05, 0.3, position, mass, setCollisionMask);
        // Lower left middle concave
        this.addAmmo(lowerLeftConcaveMesh, this.lowerLeftConcaveBody, groupMesh, 0.05, 0.3, position, mass, setCollisionMask);
        // Lower right middle concave
        this.addAmmo(lowerRightConcaveMesh, this.lowerRightConcaveBody, groupMesh, 0.05, 0.3, position, mass, setCollisionMask);
        // Spring constraint
        this.addAmmo(springConstraintMesh.springCubeMesh1, this.lowerRightConcaveBody, groupMesh, 0.05, 0.3, position, mass, setCollisionMask);
        this.addAmmo(springConstraintMesh.springCubeMesh2, this.lowerRightConcaveBody, groupMesh, 0.05, 0.3, position, mass, setCollisionMask);

    },

    //Prepares rigid body for addition to Physics World
    addAmmo(mesh, rigidBody, groupMesh, restitution, friction, position, mass, collisionMask){
        let compoundShape = new Ammo.btCompoundShape();
        commons.createTriangleShapeAddToCompound(compoundShape, mesh);
        rigidBody= commons.createAmmoRigidBody(compoundShape, groupMesh, restitution, friction, position, mass);
        rigidBody.setCollisionFlags(rigidBody.getCollisionFlags() | 2);
        rigidBody.setActivationState(4);

        this.addPhysicsAmmo(rigidBody, groupMesh, collisionMask);
    },

    //Adds to PhysicsWorld
    addPhysicsAmmo(rigidBody, groupMesh, collisionMask){
        this.myPhysicsWorld.addPhysicsObject(
            rigidBody,
            groupMesh,
            collisionMask,
            this.myPhysicsWorld.COLLISION_GROUP_PLANE,
            this.myPhysicsWorld.COLLISION_GROUP_SPHERE |
            this.myPhysicsWorld.COLLISION_GROUP_COMPOUND |
            this.myPhysicsWorld.COLLISION_GROUP_MOVEABLE |
            this.myPhysicsWorld.COLLISION_GROUP_CONVEX |
            this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE
        );
    },

    //Creates a board shape with sharp bottom
    createThreeShape(length, width) {
        //let length = this.TERRAIN_SIZE * 2;
        //let width = this.TERRAIN_SIZE * 3;
        let shape = new THREE.Shape();
        shape.moveTo( 0,0 );
        shape.lineTo( 0, width );
        shape.lineTo( length, width );
        shape.lineTo( length, 0 );
        shape.lineTo( length-20, 0 );
        shape.lineTo(length/2-7, -20);
        shape.lineTo( 0, 0 );
        return shape;
    },

    //Creates extrudeMesh
    createExtrudeMesh(shape, steps, depth, bevelEnabled, bevelThickness, bevelSize, bevelOffset, bevelSegments, material){
        let extrudeSettings = {
            steps: steps,
            depth: depth,
            bevelEnabled: bevelEnabled,
            bevelThickness: bevelThickness,
            bevelSize: bevelSize,
            bevelOffset: bevelOffset,
            bevelSegments: bevelSegments};
        let shapeGeometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
        let extrudeMesh = new THREE.Mesh(shapeGeometry, material);
        return extrudeMesh;
    },

    createSpringConstraint(mass1, mass2, pos1, pos2, size, material) {
        let sprConsSettings = {
            mass1 : mass1,
            mass2 : mass2,
            pos1 : pos1,
            pos2 : pos2,
            size : size,
            material : material
        };

        let springCubeMesh1 = new THREE.Mesh(new THREE.BoxGeometry(sprConsSettings.size.x, sprConsSettings.size.y, sprConsSettings.size.z), material);
        springCubeMesh1.position.set(sprConsSettings.pos1.x, sprConsSettings.pos1.y, sprConsSettings.pos1.z);

        let springCubeMesh2 = new THREE.Mesh(new THREE.BoxGeometry(sprConsSettings.size.x, sprConsSettings.size.y, sprConsSettings.size.z),
            new THREE.MeshPhongMaterial( { color: 0xe4d190, side: THREE.DoubleSide } ));
        springCubeMesh2.position.set(sprConsSettings.pos2.x, sprConsSettings.pos2.y, sprConsSettings.pos2.z);

        // Ammo: samme shape brukes av begge RBs:
        let boxShape = new Ammo.btBoxShape(
            new Ammo.btVector3( sprConsSettings.size.x/2, sprConsSettings.size.y/2, sprConsSettings.size.z/2 ) );

        let rbBox1 = commons.createAmmoRigidBody(boxShape, springCubeMesh1, 0.4, 0.6, sprConsSettings.pos1, sprConsSettings.mass1);
        let rbBox2 = commons.createAmmoRigidBody(boxShape, springCubeMesh2, 0.4, 0.6, sprConsSettings.pos2, sprConsSettings.mass2);

        //FJÆR MELLOM box1 og 2: https://stackoverflow.com/questions/46671809/how-to-make-a-spring-constraint-with-bullet-physics
        let transform1 = new Ammo.btTransform();
        transform1.setIdentity();
        transform1.setOrigin( new Ammo.btVector3( 0, -1, 0 ) );
        let transform2 = new Ammo.btTransform();
        transform2.setIdentity();
        transform2.setOrigin( new Ammo.btVector3( 0, 0, 0 ) );

        let springConstraint = new Ammo.btGeneric6DofSpringConstraint(
            rbBox1,
            rbBox2,
            transform1,
            transform2,
            true);

        springConstraint.setLinearLowerLimit(new Ammo.btVector3(0.0, 1.0, 0.0));
        springConstraint.setLinearUpperLimit(new Ammo.btVector3(0.0, 0.0, 0.0));

        springConstraint.setAngularLowerLimit(new Ammo.btVector3(0, 0.0, 0.0));
        springConstraint.setAngularUpperLimit(new Ammo.btVector3(0, 0.0, 0.0));

        springConstraint.enableSpring(1,  true);    // Translation on y-axis

        springConstraint.setStiffness(1, 55);

        springConstraint.setDamping  (1,  0.9);

        return { springCubeMesh1, springCubeMesh2 }
    },

    //Cube mesh, from three js bicycle project
    makeSimpleBoxMesh(width, height, depth, material){
    let boxGeo = new THREE.BoxGeometry(width, height, depth);
    let boxMesh = new THREE.Mesh(boxGeo, material);
    return boxMesh
    },

    //Cylinder mesh, from three js bicycle project
    makeCylinderMesh(radiusTop, radiusBottom, height, radialSegments, heightegments, openEnded, thetaStart, thetaLength, material){
        let cylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments,heightegments,openEnded,thetaStart, thetaLength);
        let cylinderMesh = new THREE.Mesh(cylinderGeometry, material);
        return cylinderMesh;
    },

    //Creates Concave shape (based from Extrude examples)
    createConcaveShape(){
        let concaveShape = new THREE.Shape();
        concaveShape.moveTo( -3.4, 0 );
        concaveShape.splineThru([
            new THREE.Vector2(-3, -0.3),
            new THREE.Vector2(-2, -0.9),
            new THREE.Vector2(-1, -1.3),
            new THREE.Vector2(0, -1.45),
            new THREE.Vector2(1, -1.3),
            new THREE.Vector2(2, -0.9),
            new THREE.Vector2(3, -0.3),
            new THREE.Vector2(3.4, 0),
        ]);
        concaveShape.lineTo(0,-3.5);
        concaveShape.lineTo(-3.4,0);
        concaveShape.lineTo(-3.4,0);
        return concaveShape;
    },

    // From threejs.org/docs...
    createHeartShape(){
        const heartShape = new THREE.Shape();
        heartShape.moveTo( 25, 25 );
        heartShape.bezierCurveTo( 25, 25, 20, 0, 0, 0 );
        heartShape.bezierCurveTo( - 30, 0, - 30, 35, - 30, 35 );
        heartShape.bezierCurveTo( - 30, 55, - 10, 77, 25, 95 );
        heartShape.bezierCurveTo( 60, 77, 80, 55, 80, 35 );
        heartShape.bezierCurveTo( 80, 35, 80, 0, 50, 0 );
        heartShape.bezierCurveTo( 35, 0, 25, 25, 25, 25 );
        return heartShape;
    },

    toRadians(degrees) {
        var pi = Math.PI;
        return degrees * (pi / 180);  //endret denne. Den var feil
    }
}