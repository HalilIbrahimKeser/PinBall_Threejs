import {ammoPhysicsWorld} from "../lib/ammohelpers/lib/AmmoPhysicsWorld.js";
import {myThreeScene} from "../lib/threehelpers/MyThreeScene.js";
import * as THREE from "../lib/three/build/three.module.js";
import {board} from "/js/Parts/Board.js";
import {ball} from "/js/Parts/Ball.js";
import {myHinge} from "../lib/ammohelpers/MyHinge.js";
import {myHingeLeft} from "./Parts/MyHingeLeft.js";

/**
 *Utgangspunktet for denne klassen er hentet fra eksemplet GameBoard av Werner
 */
export const pinBallBoard = {
    clock: new THREE.Clock(),
    currentlyPressedKeys: [],

    start() {
        //Input - standard Javascript / WebGL:
        document.addEventListener('keyup', this.handleKeyUp.bind(this), false);
        document.addEventListener('keydown', this.handleKeyDown.bind(this), false);

        // three:
        myThreeScene.setupGraphics();
        myThreeScene.camera.position.set(0, 300, 200);
        // ammo:
        ammoPhysicsWorld.init(myThreeScene.scene);

        // ulike figurer/shapes:
        board.init(ammoPhysicsWorld);
        board.create();

        ball.init(ammoPhysicsWorld);
        ball.create();

        myHinge.init(ammoPhysicsWorld);
        myHinge.create();

        myHingeLeft.init(ammoPhysicsWorld);
        myHingeLeft.create();

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
            ball.createRandom(true);
        }
        // Rotasjon om Z:
        if (this.currentlyPressedKeys[65]) {	//A
            //board.tilt(3, 0.03);
        }
        if (this.currentlyPressedKeys[68]) {	//D
            //board.tilt(3, -0.03);
        }
        // Rotasjon om X:
        if (this.currentlyPressedKeys[87]) {	//W
            //board.tilt(1, -0.03);
        }
        if (this.currentlyPressedKeys[83]) {	//S
            //board.tilt(1, 0.03);
        }
        if (this.currentlyPressedKeys[86]) {	//V
            myHinge.impulseLeft();
        }
        if (this.currentlyPressedKeys[66]) {	//B
            myHinge.impulseRight();
        }

    },

    handleKeyUp(event) {
        this.currentlyPressedKeys[event.keyCode] = false;
    },

    handleKeyDown(event) {
        this.currentlyPressedKeys[event.keyCode] = true;
    }
}