import { grouping } from "../util/blob-detection.js";
import { registerKeyUpHandler } from "../util/input_keyboard.js";
/*
   This is a simple example of showing video from your camera.
   It won't work in your VR headset, only on your computer.

   When you enter Control mode by hitting the SPACE bar, and then
   hit CNTRL-h, the view of the video will toggle into a heads-up
   display (HUD).

   After you leave Control mode (by hitting the SPACE bar again)
   while in HUD mode, the video will follow you as you move your
   view around the scene.
*/
function lerp(start, target, rate) {
   return start + rate * (target - start);
}

export const init = async model => {
   let isHUD = false;
   model.control('h', 'toggle HUD', () => isHUD = ! isHUD);
   let cube = model.add('cube').texture('camera');
   let obj = model.add("sphere").move(0.3,1.6,0).scale(0.05);
   let spheres = [model.add('sphere').color(1,0.2,0.2), model.add('sphere').color(1,0.8,0.2)];
   let fingerX = [null, null];
   let fingerY = [null, null];
   let t = [0, 0];
   let catched = -1;

   model.animate(() => {
      let pos = [grouping([255, 100, 100], 25), grouping([245, 235, 75], 25)]; // red and yellow
      for(let i = 0; i < 2; i ++) {
         if(pos[i]) {
            t[i] = model.time;
            if(!fingerX[i]) {
               fingerX[i] = 0.7 - pos[i][0];
               fingerY[i] = 2.1 - pos[i][1];
            } else {
               fingerX[i] = lerp(fingerX[i], 0.7 - pos[i][0], 0.3);
               fingerY[i] = lerp(fingerY[i], 2.1 - pos[i][1], 0.3);
            }
         } else if(model.time - t[i] > 0.2) {
            fingerX[i] = null;
            fingerY[i] = null;
         }
      }

      if (isHUD) {
      cube.setMatrix(model.viewMatrix()).move(0,0,-1).turnY(Math.PI);
         for(let i = 0; i < 2; i ++) {
            if(fingerX[i] != null) {
               spheres[i].setMatrix(model.viewMatrix()).move(fingerX[i], fingerY[i], 0).scale(0.01);
            } 
            else spheres[i].scale(0);
         }
      } else {
      cube.identity().move(0,1.6,0);
      catched =  -1;
         for(let i = 0; i < 2; i ++) {
            if(fingerX[i] != null) {
               spheres[i].identity().move(fingerX[i], fingerY[i], 0).scale(0.01);
               let x0 = spheres[i].getMatrix()[12];
               let y0 = spheres[i].getMatrix()[13];
               let mat = obj.getMatrix();
               let x1 = mat[12];
               let y1 = mat[13];
               let dist = Math.sqrt(Math.pow(x0 - x1, 2), Math.pow(y0 - y1, 2));
               if(dist < 0.1) {
                  catched = i;
                  mat[12] = x0;
                  mat[13] = y0;
               } 
            } else {
               spheres[i].scale(0);
            } 
         }
      }
         
      cube.scale(.7,.5,.01);
      switch(catched) {
         case -1:
            obj.color(1,1,1);
            break;
         case 0:
            obj.color(1,0,0);
            break;
         case 1:
            obj.color(1,0.8,0.2);
            break;
      }
         
   });
 }
 
