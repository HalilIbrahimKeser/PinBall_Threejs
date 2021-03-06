import * as THREE from "../../lib/three/build/three.module.js";
import {commons} from "../../lib/ammohelpers/lib/Common.js";

/**
 * Utgangspunktet for denne klassen er hentet fra ammohelpers/MyHinge.js
 *
 */


/**
 * Pinnen er forankret i kula (som står i ro, dvs. masse=0).
 * Man bestemmer selv om ankret (Kula) skal tegnes/vises.
 * Pinnen kan beveges - gjøres vha. applyCentralImpulse
 * MERK: dersom posStick og posAnchor er ulik vil "sticken" rotere frem og tilbake ved oppstart. Er de lik vil den stå i ro (stort sett).
 *
 * Se: https://pybullet.org/Bullet/phpBB3/viewtopic.php?t=4145
 * og: https://gamedev.stackexchange.com/questions/71436/what-are-the-parameters-for-bthingeconstraintsetlimit
 * MERK:
	void btHingeConstraint::setLimit    (
		btScalar    low,
		btScalar    high,
		btScalar    _softness = 0.9f,
		btScalar    _biasFactor = 0.3f,
		btScalar    _relaxationFactor = 1.0f
	)
	The parameters low and high are the angles restricting the hinge.
	The angle between the two bodies stays in that range.
	For no restriction, you pass a lower limit <= -pi and an upper limit >= pi here. This might be useful for things that
    rotate completely around other things, for example wheels on a car. For the other three parameters, I can only guess,
    so I don't claim this answer is complete.
    _softness might be a negative measure of the friction that determines how much the hinge rotates for a given force.
    A high softness would make the hinge rotate easily like it's oiled then.
    _biasFactor might be an offset for the relaxed rotation of the hinge. It won't be right in the middle of the low
    and high angles anymore. 1.0f is the neural value.
	_relaxationFactor might be a measure of how much force is applied internally to bring the hinge in its central rotation.
    This is right in the middle of the low and high angles. For example, consider a western swing door.
    After walking through it will swing in both directions but at the end it stays right in the middle.
 */
export const flipperRight = {
	myPhysicsWorld: undefined,
	stickMesh: undefined,
	rbStick: undefined,
	boardRotAxis: {x: 1, y:0, z:0 },
	boardRotAngle: 0.35,
	IMPULSE_FORCE_STICK: 150,
	threeDirectionVectorStick: undefined,

	init(myPhysicsWorld) {
		this.myPhysicsWorld = myPhysicsWorld;
	},

	addArrow(length, hex, arrowHelper) {
		arrowHelper.setColor(new THREE.Color(hex));
		arrowHelper.setLength(length);
		this.myPhysicsWorld.scene.add( arrowHelper );
	},

	create(setCollisionMask=true) {
		let posStick = {x: 40, y: -7, z: 95};     // Cylinder
		let sizeStick = {x: 45, y: 1, z: 3, radiusTop : 3, radiusBottom : 1, height : 45,
			radialSegments : 30, heightSegments : 1, openEnded : false, thetaStart : 0, thetaLength : 2*Math.PI};   // Størrelse på pinnen.
		let massStick = 10;                     // Kuben/"stikka" festes til kula og skal kunne rotere. Må derfor ha masse.

		let posAnchor = {x: 40, y: -7, z: 95};    // Sphere, forankringspunkt.
		let radiusAnchor = 4;                         // Størrelse på kula.
		let massAnchor = 0;                     // Sphere, denne skal stå i ro.

		//THREE, kule:
		let threeQuat = new THREE.Quaternion();  // Roterer i forhold til planet (dersom satt).
		threeQuat.setFromAxisAngle( new THREE.Vector3( this.boardRotAxis.x, this.boardRotAxis.y, this.boardRotAxis.z ), this.boardRotAngle);
		let anchorMesh = new THREE.Mesh(
			new THREE.SphereGeometry(radiusAnchor),
			new THREE.MeshPhongMaterial({color: 0xb846db, transparent: true, opacity: 0.5}));
		anchorMesh.userData.tag = 'anchor';
		anchorMesh.position.set(posAnchor.x, posAnchor.y, posAnchor.z);
		//anchorMesh.rotation.x = this.toRadians(45)
		anchorMesh.setRotationFromQuaternion(threeQuat);
		anchorMesh.castShadow = true;
		anchorMesh.receiveShadow = true;

		//AMMO, kule:
		let shapeAnchor = new Ammo.btSphereShape(radiusAnchor);
		let rigidBodyAnchor = commons.createAmmoRigidBody(shapeAnchor, anchorMesh, 1, 0.6, posAnchor, massAnchor);
		this.myPhysicsWorld.addPhysicsObject(
			rigidBodyAnchor,
			anchorMesh,
			setCollisionMask,
			this.myPhysicsWorld.COLLISION_GROUP_HINGE_SPHERE,
			this.myPhysicsWorld.COLLISION_GROUP_PLANE |
				this.myPhysicsWorld.COLLISION_GROUP_SPHERE |
				this.myPhysicsWorld.COLLISION_GROUP_COMPOUND |
				this.myPhysicsWorld.COLLISION_GROUP_CONVEX |
				this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE |
				this.myPhysicsWorld.COLLISION_GROUP_MOVEABLE
		);

		//THREE, cylinder/stick:
		this.stickMesh = new THREE.Mesh(
			new THREE.CylinderGeometry(sizeStick.radiusTop, sizeStick.radiusBottom, sizeStick.height,
				sizeStick.radialSegments, sizeStick.heightSegments, sizeStick.openEnded,
				sizeStick.thetaStart, sizeStick.thetaLength),
			new THREE.MeshPhongMaterial({color: 0xf78a1d}));
		this.stickMesh.userData.tag = 'stick';
		this.stickMesh.position.set(posStick.x, posStick.y, posStick.z);
		//this.stickMesh.rotation.z = this.toRadians(45)
		this.stickMesh.castShadow = true;
		this.stickMesh.receiveShadow = true;
		this.stickMesh.collisionResponse = (mesh1) => {
			mesh1.material.color.setHex(Math.random() * 0xffffff);
		};

		//AMMO, kube/stick:
		let stickColShape =  new Ammo.btBoxShape( new Ammo.btVector3( sizeStick.y/2, sizeStick.x/2, sizeStick.z/2 ) );
		this.rbStick = commons.createAmmoRigidBody(stickColShape, this.stickMesh, 1, 0.3, posStick, massStick);
		this.myPhysicsWorld.addPhysicsObject(
			this.rbStick,
			this.stickMesh,
			setCollisionMask,
			this.myPhysicsWorld.COLLISION_GROUP_BOX,
			this.myPhysicsWorld.COLLISION_GROUP_PLANE |
			this.myPhysicsWorld.COLLISION_GROUP_SPHERE |
			this.myPhysicsWorld.COLLISION_GROUP_COMPOUND |
			this.myPhysicsWorld.COLLISION_GROUP_CONVEX |
			this.myPhysicsWorld.COLLISION_GROUP_TRIANGLE |
			this.myPhysicsWorld.COLLISION_GROUP_MOVEABLE
		);

		//AMMO, hengsel: SE F.EKS: https://www.panda3d.org/manual/?title=Bullet_Constraints#Hinge_Constraint:
		let anchorPivot = new Ammo.btVector3( 0, 1, 0 );
		let stickPivot = new Ammo.btVector3(  0,-sizeStick.x/2, 0 );
		const anchorAxis = new Ammo.btVector3(0,1,0);
		const stickAxis = new Ammo.btVector3(1,0,0);
		let hingeConstraint = new Ammo.btHingeConstraint(
			rigidBodyAnchor,
			this.rbStick,
			anchorPivot,
			stickPivot,
			anchorAxis,
			stickAxis,
			false
		);

		let lowerLimit = this.toRadians(-40);
		let upperLimit = this.toRadians(40);
		let softness = 0.3;
		let biasFactor = 1;
		let relaxationFactor = 0.9;
		hingeConstraint.setLimit( lowerLimit, upperLimit, softness, biasFactor, relaxationFactor);
		this.myPhysicsWorld.ammoPhysicsWorld.addConstraint( hingeConstraint, false );
		//this.stickMesh.rotation.y = this.toRadians(60)
	},

	impulseLeft() {
		if (!this.rbStick)
			return;
		this.rbStick.activate(true);
		let tmp = this.getCentralImpulse();
		let direction = new THREE.Vector3(-tmp.x, -tmp.y, -tmp.z);
		let rdv1 = new Ammo.btVector3(direction.x * this.IMPULSE_FORCE_STICK , direction.y * this.IMPULSE_FORCE_STICK , direction.z * this.IMPULSE_FORCE_STICK );
		this.rbStick.applyCentralImpulse( rdv1 );
	},

	impulseRight() {
		if (!this.rbStick)
			return;
		this.rbStick.activate(true);
		let direction = this.getCentralImpulse();
		let rdv1 = new Ammo.btVector3(direction.x * this.IMPULSE_FORCE_STICK , direction.y * this.IMPULSE_FORCE_STICK , direction.z * this.IMPULSE_FORCE_STICK );
		this.rbStick.applyCentralImpulse( rdv1 );

	},

	getCentralImpulse() {
		// NB! Denne er viktig. rigid bodies "deaktiveres" når de blir stående i ro, må aktiveres før man bruker applyCentralImpulse().
		//this.rbStick.activate(true);

		let tmpTrans = new Ammo.btTransform();
		// STICKEN / KUBEN:
		// 1. Henter gjeldende rotasjon for "sticken"/kuben (Ammo):
		let ms1 = this.rbStick.getMotionState();
		ms1.getWorldTransform( tmpTrans );
		let q1 = tmpTrans.getRotation();        // q1 inneholder nå stickens rotasjon.

		// 2. Lager en (THREE) vektor som peker i samme retning som sticken:
		this.threeDirectionVectorStick = new THREE.Vector3(1,0,0);
		//   2.1 Lager en THREE-kvaternion for rotasjon basert på Ammo-kvaternionen (q1) over:
		let threeQuaternionStick = new THREE.Quaternion(q1.x(), q1.y(), q1.z(), q1.w());
		//   2.2 Roterer (THREE) retningsvektoren slik at den peker i samme retning som sticken:
		this.threeDirectionVectorStick.applyQuaternion(threeQuaternionStick);

		// 3. Lager vektorer som står vinkelrett på threeDirectionVectorStick vha. mesh.getWorldDirection():
		// Disse brukes igjen til å dytte sticken vha. applyCentralImpulse()
		let threeDirection = new THREE.Vector3();
		this.stickMesh.getWorldDirection(threeDirection);  // NB! worldDIRECTION! Gir en vektor som peker mot Z. FRA DOC: Returns a vector representing the direction of object's positive z-axis in world space.

		return threeDirection;
	},

	toRadians(degrees) {
		var pi = Math.PI;
		return degrees * (pi / 180);  //endret denne. Den var feil
	},
}
