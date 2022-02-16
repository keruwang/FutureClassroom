import { buttonState,controllerMatrix } from "../render/core/controllerInput.js";

let obj, obj2, root;
let disR, disL;
let delX, delZ;
let pX = 0;
let pZ = 0;
let speedX = 0;
let speedZ = 0;
let speedXO = 0;
let speedZO = 0;
let speed = 0;
let speedO = 0;
let sliding = false;
let slidingO = false;

export const init = async (model) => {
    root = model.add();
    obj = root.add();
    obj2 = root.add();
    obj.move(0,0.85,0).scale(.1).add('cube');
    obj2.move(0.5,0.85,0.5).scale(.1).add('sphere');
}

export const display = (model) => {
   model.animate(() => {
    if(window.vr) {
        let crx = controllerMatrix.right[12], cry = controllerMatrix.right[13], crz = controllerMatrix.right[14];
        let clx = controllerMatrix.left[12], cly = controllerMatrix.left[13], clz = controllerMatrix.left[14];
        let objx = obj.getMatrix()[12], objy = obj.getMatrix()[13], objz = obj.getMatrix()[14];
        disR = Math.sqrt(Math.pow(crx - objx, 2) + Math.pow(cry - objy, 2) + Math.pow(crz - objz, 2));
        delX = crx - pX;
        delZ = crz - pZ;
        if(disR < 0.3 && buttonState.right[0].pressed) {
            obj.color(1,0,0);
            speed = 1;
            sliding = true;
            speedX = delX;
            speedZ = delZ;
            let mat = obj.getMatrix();
            mat[12] += speed * speedX;
            mat[14] += speed * speedZ;
        //   let mat = cg.mMultiple(obj.getMatrix(),controllerMatrix.right);
            // mat[14] = crz;
        } else {
            if(sliding) {
                speed *= 0.85;
                let mat = obj.getMatrix();
                mat[12] += speed * speedX;
                mat[14] += speed * speedZ;
            } else {
                speed = 0;
                sliding = false;
            } 
            obj.color(1,1,1);
        }
        let m = obj2.getMatrix();
        let oX = m[12];
        let oY = m[13];
        let oZ = m[14];
        let disO = Math.sqrt(Math.pow(oX - objx, 2) + Math.pow(oY - objy, 2) + Math.pow(oZ - objz, 2));
        if(disO < 0.25 && ((oX > objx && speedX > 0) || (oX < objx && speedX < 0)) && ((oZ > objz && speedZ > 0) || (oZ < objz && speedZ < 0)) ) {
            slidingO = true;
            speedO = 1;
            speedXO = speedX;
            speedZO = speedZ;
            m[12] += speedO * speedXO;
            m[14] += speedO * speedZO;
        } else {
            if(slidingO && speedO > 0.05) {
                speedO *= 0.999;
                let m = obj2.getMatrix();
                m[12] += speedO * speedXO;
                m[14] += speedO * speedZO;
            } else {
                speedO = 0;
                slidingO = false;
            } 
        } 
        pX = crx;
        pZ = crz;
    }
   });
}