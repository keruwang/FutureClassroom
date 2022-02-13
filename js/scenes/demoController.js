import { buttonState,controllerMatrix } from "../render/core/controllerInput.js";

let controller, trigger, squeeze;

export const init = async (model) => {
   model.move(0,1.5,0).scale(0.1);
   controller = model.add();
   controller.add('donut').color(1,1,1).move(0,-0.6,-1).scale(1,1,0.6);
   controller.add('tubeZ').color(1,1,1).scale(0.38,0.28,0.8); // 0,0.3,2
   trigger = controller.add('cube').scale(0.2).move(0,1.,-2.);
   squeeze = controller.add('cube').scale(0.1,0.1,0.2).move(-4,.5,-2);
}

export const display = (model) => {
   model.animate(() => {
      if(window.vr) {
         model.setMatrix(controllerMatrix['right']);
         controller.identity().scale(0.1);
         buttonState['right'][0].pressed ? trigger.color(1,0,0) : trigger.color(1,1,1);
         buttonState['right'][1].pressed ? squeeze.color(1,0,0) : squeeze.color(1,1,1);
      }
   });
}