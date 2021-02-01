import { Vector3, Euler, Quaternion } from 'https://threejs.org/build/three.module.js'
import CANNON from 'https://sortaphysics.sortagames.repl.co/cannonModule.js';
let PhysicsControls = function (t,cannonBody) {
  var o = this;
  this.minPolarAngle = 0, this.maxPolarAngle = Math.PI;
  var n, r = new Euler(0, 0, 0, "YXZ"),
    e = Math.PI / 2,
    i = new Vector3();
  let camera = t;
  let contactNormal = new CANNON.Vec3();
  let upAxis = new CANNON.Vec3(0,1,0);
  let velocity = cannonBody.velocity;
  let minSpeed = new Vector3(-10,-20,-10);
  let maxSpeed = new Vector3(10,20,10);
  let jumpVelocity = 10;
  let PI_2 = Math.PI /2;
  let inputVelocity = new Vector3();
  let quat = new Quaternion();
  let vec = new Vector3();
  let canJump = false;
  cannonBody.addEventListener("collide", function (e) {
    var contact = e.contact;

    // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
    // We do not yet know which one is which! Let's check.
    if (contact.bi.id == cannonBody.id)  // bi is the player body, flip the contact normal
      contact.ni.negate(contactNormal);
    else
      contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is

    // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
    if (contactNormal.dot(upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
      canJump = true;
  });

  this.update = function(keys,dt){
    dt *= 0.1;
    //dt == time
    inputVelocity.set(velocity.x,velocity.y,velocity.z);
    if(keys['w']){
      vec.setFromMatrixColumn(camera.matrix,0);
      vec.crossVectors(camera.up, vec);
      inputVelocity.addScaledVector(vec,1);
    }
    if(keys['s']){
      vec.setFromMatrixColumn(camera.matrix,0);
      vec.crossVectors(camera.up, vec);
      inputVelocity.addScaledVector(vec,-1);
    }
    if(keys['a']){
    vec.setFromMatrixColumn(camera.matrix, 0);
    inputVelocity.addScaledVector(vec,-1);
    }
    if(keys['d']){
    vec.setFromMatrixColumn(camera.matrix, 0);
    inputVelocity.addScaledVector(vec,1);
    }
    
    inputVelocity.clamp(minSpeed,maxSpeed);
    velocity.x = inputVelocity.x;
    velocity.y = inputVelocity.y;
    velocity.z = inputVelocity.z;
    if(keys[' ']){
      if(canJump == true){
        velocity.y = jumpVelocity;
      }
      canJump = false;
    }
    t.position.set(cannonBody.position.x,cannonBody.position.y,cannonBody.position.z);
  }

  this.mousemove = function (n) {
    var i = n.x, a = n.y;
    r.setFromQuaternion(t.quaternion), r.y -= .002 * i, r.x -= .002 * a, r.x = Math.max(e - o.maxPolarAngle, Math.min(e - o.minPolarAngle, r.x)), t.quaternion.setFromEuler(r)
  };
    this.moveForward = function (o) {
      i.setFromMatrixColumn(t.matrix, 0), i.crossVectors(t.up, i), t.position.addScaledVector(i, o)
    };
    this.moveRight = function (o) {
      i.setFromMatrixColumn(t.matrix, 0), t.position.addScaledVector(i, o)
    }
};

export default PhysicsControls;