import * as THREE from "../../../PinBall/lib/three/build/three.module.js";
import {commons} from "../../../PinBall/lib/ammohelpers/lib/Common.js";

/**
 * Utgangspunktet for denne klassen er hentet fra ammohelpers/MySphere.js
 *
 */

export const ball = {
    myPhysicsWorld: undefined,
    mesh: undefined,

    init(myPhysicsWorld) {
        this.myPhysicsWorld = myPhysicsWorld;
    },

    create(setCollisionMask=true, position={x:90, y:30, z:10}, color= Math.random() * 0xbcbcbc, mass= 10 ) {
        let radius = 3.5;

        //THREE
        this.mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), new THREE.MeshPhongMaterial({color: color}));
        this.mesh.userData.tag = 'sphere';
        this.mesh.position.set(position.x, position.y, position.z);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        // Implementer denne ved behov. Kalles fra MyPhysicsWorld ved kollisjon.
        this.mesh.collisionResponse = (mesh1) => {
            mesh1.material.color.setHex(Math.random() * 0xffffff);
        };

        //AMMO
        let shape = new Ammo.btSphereShape(radius);
        let rigidBody = commons.createAmmoRigidBody(shape, this.mesh, 1,  0.3, position, mass);

        // Legger til physics world:
        this.myPhysicsWorld.addPhysicsObject(
            rigidBody,
            this.mesh,
            setCollisionMask,
            this.myPhysicsWorld.COLLISION_GROUP_SPHERE,
            this.myPhysicsWorld.COLLISION_GROUP_SPHERE |
            this.myPhysicsWorld.COLLISION_GROUP_PLANE |
            this.myPhysicsWorld.COLLISION_GROUP_COMPOUND |
            this.myPhysicsWorld.COLLISION_GROUP_CONVEX |
            this.myPhysicsWorld.COLLISION_GROUP_MOVEABLE |
            this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE |
            this.myPhysicsWorld.COLLISION_GROUP_BOX |
            this.myPhysicsWorld.COLLISION_GROUP_HINGE_SPHERE
        );
    },
}
