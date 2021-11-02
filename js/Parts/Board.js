import * as THREE from "../../../PinBall/lib/three/build/three.module.js";
import {commons} from "../../../PinBall/lib/ammohelpers/lib/Common.js";

/**
 * MERK1: Her brukes BoxGeometry, altså et volum, som plan.
 * MERK2: Bruker btBvhTriangleMeshShape (og ikke btBvhConvexTriangleMeshShape) til planet.
 */
export const board= {
    //Physics Ammo
    myPhysicsWorld: undefined,
    //Rigid bodies for physics
    gameBoardRigidBody: undefined,
    bottomBoardRigidBody: undefined,
    coverBoardRigidBody: undefined,
    startRampRigidBody: undefined,
    diagonalBarBody: undefined,

    TERRAIN_SIZE: 100,



    init(myPhysicsWorld) {
        this.myPhysicsWorld = myPhysicsWorld;
    },

    create(setCollisionMask=true) {
        const position = {x:0, y:0, z:0};
        const mass = 0;

        //THREE, bruker Shape og ExtrudeGeometry:
        let groupMesh = new THREE.Group();
        groupMesh.userData.tag = 'gameboard';
        groupMesh.userData.name = 'terrain';
        groupMesh.position.set(position.x, position.y, position.z);

        //FRAME
        let hole1 = new THREE.Shape();
        hole1.moveTo( 5,5 );
        hole1.lineTo( 5, this.TERRAIN_SIZE * 3 -5 );
        hole1.lineTo( this.TERRAIN_SIZE * 2-5, this.TERRAIN_SIZE * 3-5 );
        hole1.lineTo( this.TERRAIN_SIZE * 2-5, 5 );
        hole1.lineTo( 5, 5 );
        let frameBoardMaterial = new THREE.MeshPhongMaterial( { color: 0x3d85c6, side: THREE.DoubleSide } );
        let frameBoardMesh = this.createExtrudeMesh(this.TERRAIN_SIZE*2, this.TERRAIN_SIZE*3, 1, 15, true, 1, 1,0,1,frameBoardMaterial, hole1);
        frameBoardMesh.rotation.x = -Math.PI / 2;
        frameBoardMesh.position.x = -this.TERRAIN_SIZE;
        frameBoardMesh.position.z = this.TERRAIN_SIZE;
        frameBoardMesh.receiveShadow = true;
        groupMesh.add( frameBoardMesh );

        //BOTTOM
        let bottomBoardMaterial = new THREE.MeshPhongMaterial( { color: 0x121212, side: THREE.DoubleSide } );
        let bottomBoardMesh = this.createExtrudeMesh(this.TERRAIN_SIZE*2,this.TERRAIN_SIZE*3, 1, 5, true, 1,1, 0, 1, bottomBoardMaterial);
        bottomBoardMesh.rotation.x = -Math.PI / 2;
        bottomBoardMesh.position.x = -this.TERRAIN_SIZE;
        bottomBoardMesh.position.z = this.TERRAIN_SIZE;
        bottomBoardMesh.receiveShadow = true;
        groupMesh.add( bottomBoardMesh );

        /**************Start: No Ammos Yet!********************************/
        //GLASS COVER; Ingen AMMO, dvs ballen kan komme gjennom
        let coverBoardMaterial = new THREE.MeshPhongMaterial( { color: 0xeeeeee, side: THREE.DoubleSide } );
        coverBoardMaterial.transparent = true;
        coverBoardMaterial.opacity = 0.1;
        let coverBoardMesh = this.createExtrudeMesh(this.TERRAIN_SIZE*2, this.TERRAIN_SIZE*3, 1, 0.3, true, 1, 1, 0, 1, coverBoardMaterial);
        coverBoardMesh.rotation.x = -Math.PI / 2;
        coverBoardMesh.position.x = -this.TERRAIN_SIZE;
        coverBoardMesh.position.z = this.TERRAIN_SIZE;
        coverBoardMesh.position.y = 16;
        coverBoardMesh.receiveShadow = true;
        groupMesh.add( coverBoardMesh );

        //RAMP on the right
        let startRampMaterial = new THREE.MeshPhongMaterial( { color: 0xF31CEC, side: THREE.DoubleSide } );
        let startRampMesh = this.createExtrudeMesh(10, this.TERRAIN_SIZE*3-70, 1, 15, true, 1,1,0, 1, startRampMaterial);
        startRampMesh.rotation.x = -Math.PI / 2;
        startRampMesh.position.x = this.TERRAIN_SIZE - 30;
        startRampMesh.position.z = this.TERRAIN_SIZE - 5;
        startRampMesh.receiveShadow = true;
        groupMesh.add(startRampMesh);

        //RAMP on top right
        let diagonalRampMaterial = new THREE.MeshPhongMaterial( { color: 0xF5571F, side: THREE.DoubleSide } );
        let diagonalRampMesh = this.createExtrudeMesh(5, 94.2, 1,14,true, 1, 1, 0,1, diagonalRampMaterial);
        diagonalRampMesh.rotation.x = -Math.PI / 2;
        diagonalRampMesh.rotation.z = 1.05;
        diagonalRampMesh.position.x = this.TERRAIN_SIZE -2.3;
        diagonalRampMesh.position.z = -this.TERRAIN_SIZE - 50;
        diagonalRampMesh.receiveShadow = true;
        groupMesh.add(diagonalRampMesh);
        /*************End: No ammos.*************************************/

        /******ACTIVATE WHEN BOARD IS FINISHED*******/
            //groupMesh.rotation.x = 0.2;


        //PhysicsAmmo: frame
        let compoundShape = new Ammo.btCompoundShape();
        commons.createTriangleShapeAddToCompound(compoundShape, frameBoardMesh);
        this.gameBoardRigidBody = commons.createAmmoRigidBody(compoundShape, groupMesh, 0.05, 0.3, position, mass);
        this.gameBoardRigidBody.setCollisionFlags(this.gameBoardRigidBody.getCollisionFlags() | 2);
        this.gameBoardRigidBody.setActivationState(4);
        this.addPhysicsAmmo(this.gameBoardRigidBody, groupMesh, setCollisionMask);

        //PhysicsAmmo: bottom
        let bottomCompoundShape = new Ammo.btCompoundShape();
        commons.createTriangleShapeAddToCompound(bottomCompoundShape, bottomBoardMesh);
        this.bottomBoardRigidBody = commons.createAmmoRigidBody(bottomCompoundShape, groupMesh, 0.05, 0.3, position, mass);
        this.bottomBoardRigidBody.setCollisionFlags(this.bottomBoardRigidBody.getCollisionFlags() | 2);
        this.bottomBoardRigidBody.setActivationState(4);
        this.addPhysicsAmmo(this.bottomBoardRigidBody, groupMesh, setCollisionMask);


    },



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

    createThreeShape(length, width) {
        //let length = this.TERRAIN_SIZE * 2;
        //let width = this.TERRAIN_SIZE * 3;
        let shape = new THREE.Shape();
        shape.moveTo( 0,0 );
        shape.lineTo( 0, width );
        shape.lineTo( length, width );
        shape.lineTo( length, 0 );
        shape.lineTo( 0, 0 );
        return shape;
    },

    createExtrudeMesh(length, width, steps, depth, bevelEnabled, bevelThickness, bevelSize, bevelOffset, bevelSegments, material, hole){
        let shape = this.createThreeShape(length, width);
        if (hole){
            shape.holes.push(hole);
        }
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

    makeSimpleBoxMesh(width, height, depth, material){
    let boxGeo = new THREE.BoxGeometry(width, height, depth);
    let boxMesh = new THREE.Mesh(boxGeo, material);
    return boxMesh
    },

    makeCylinderMesh(radiusTop, radiusBottom, height, radialSegments, heightegments, openEnded, thetaStart, thetaLength, material){
        let cylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments,heightegments,openEnded,thetaStart, thetaLength);
        let cylinderMesh = new THREE.Mesh(cylinderGeometry, material);
        return cylinderMesh;
    },




    // axisNo: 1=x, 2=y, 3=z
    tilt(axisNo, angle) {
        //this.terrainRigidBody.activate(true);
        let axis;
        switch (axisNo) {
            case 1:
                axis = new THREE.Vector3( 1, 0, 0 );
                break;
            case 2:
                axis = new THREE.Vector3( 0,1, 0);
                break;
            case 3:
                axis = new THREE.Vector3( 0,0, 1);
                break;
            default:
                axis = new THREE.Vector3( 1, 0, 0 );
        }
        // Henter gjeldende transformasjon:
        let terrainTransform = new Ammo.btTransform();
        let terrainMotionState = this.gameBoardRigidBody.getMotionState();
        terrainMotionState.getWorldTransform( terrainTransform );
        let ammoRotation = terrainTransform.getRotation();

        let terrainMotionState2 = this.bottomBoardRigidBody.getMotionState();
        terrainMotionState2.getWorldTransform( terrainTransform );


        // Roter gameBoardRigidBody om en av aksene (bruker Three.Quaternion til dette):
        let threeCurrentQuat = new THREE.Quaternion(ammoRotation.x(), ammoRotation.y(), ammoRotation.z(), ammoRotation.w());
        let threeNewQuat = new THREE.Quaternion();
        threeNewQuat.setFromAxisAngle(axis, this.toRadians(angle));
        // Slår sammen eksisterende rotasjon med ny/tillegg.
        let resultQuaternion = threeCurrentQuat.multiply(threeNewQuat);
        // Setter ny rotasjon på ammo-objektet:
        terrainTransform.setRotation( new Ammo.btQuaternion( resultQuaternion.x, resultQuaternion.y, resultQuaternion.z, resultQuaternion.w ) );
        terrainMotionState.setWorldTransform(terrainTransform);
        terrainMotionState2.setWorldTransform(terrainTransform);
    },

    toRadians(angle) {
        return angle/(2*Math.PI);
    }
}