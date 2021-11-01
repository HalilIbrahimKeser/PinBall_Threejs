import {ammoPhysicsWorld} from "../lib/ammohelpers/lib/AmmoPhysicsWorld.js";
import {myThreeScene} from "../lib/threehelpers/MyThreeScene.js";
import * as THREE from "../lib/three/build/three.module.js";
import {mySphere} from "../lib/ammohelpers/MySphere.js";

import {board} from "/js/Parts/Board.js";

export const pinBallBoard = {
    clock: new THREE.Clock(),
    currentlyPressedKeys: [],

    start() {
        //Input - standard Javascript / WebGL:
        document.addEventListener('keyup', this.handleKeyUp.bind(this), false);
        document.addEventListener('keydown', this.handleKeyDown.bind(this), false);

        // three:
        myThreeScene.setupGraphics();
        myThreeScene.camera.position.set(100, 200, 200);
        // ammo:
        ammoPhysicsWorld.init(myThreeScene.scene);

        // ulike figurer/shapes:
        board.init(ammoPhysicsWorld);
        board.create();

        mySphere.init(ammoPhysicsWorld);
        mySphere.create();

        this.animate();
    },

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        let deltaTime = this.clock.getDelta();
        //Oppdaterer fysikken:
        ammoPhysicsWorld.updatePhysics(deltaTime);
        //Sjekker input:
        this.keyCheck(deltaTime);
        //Oppdaterer grafikken:
        myThreeScene.updateGraphics(deltaTime);
    },

    keyCheck(elapsed) {
        if (this.currentlyPressedKeys[72]) {	//H
            mySphere.createRandom(true);
        }
        // Rotasjon om Z:
        if (this.currentlyPressedKeys[65]) {	//A
            board.tilt(3, 0.03);
        }
        if (this.currentlyPressedKeys[68]) {	//D
            board.tilt(3, -0.03);
        }
        // Rotasjon om X:
        if (this.currentlyPressedKeys[87]) {	//W
            board.tilt(1, -0.03);
        }
        if (this.currentlyPressedKeys[83]) {	//S
            board.tilt(1, 0.03);
        }

    },

    handleKeyUp(event) {
        this.currentlyPressedKeys[event.keyCode] = false;
    },

    handleKeyDown(event) {
        this.currentlyPressedKeys[event.keyCode] = true;
    }
}