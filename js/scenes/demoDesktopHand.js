export const init = async model => {
    model.setTable(false);
    const jointNum = 21;
    let joint = [[],[]];
    let jointSize = [[],[]];
    for(let i = 0; i < 2; i ++)
        for(let j = 0; j < jointNum; j ++) {
            joint[i][j] = {mesh: model.add('sphere').color(1,0,0), detected: false};
        }
            
    model.animate(() => {

        for(let i = 0; i < window.handInfo.length; i ++) {
            for(let j = 0; j < jointNum; j ++) {
                joint[i][j].mesh.identity().move(-0.5 + window.handInfo[i].landmarks[j].x,2 - window.handInfo[i].landmarks[j].y,window.handInfo[i].landmarks[j].z);
                joint[i][j]. detected = true;
            } 
        }

        for(let i = 0; i < 2; i ++)
            for(let j = 0; j < jointNum; j ++) 
                joint[i][j].mesh.scale(joint[i][j].detected ? 0.02 : 0);
    });
 }