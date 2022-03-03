export const init = async model => {
    model.setTable(false);
    const jointNum = 21;
    let joint = [[],[]];
    let jointSize = [[],[]];
    for(let i = 0; i < 2; i ++)
        for(let j = 0; j < jointNum; j ++) {
            joint[i][j] = {mesh: model.add('sphere'), detected: false};
        }
            
    model.animate(() => {

        for(let i = 0; i < window.handInfo.length; i ++) {
            for(let j = 0; j < jointNum; j ++) {
                joint[i][j].mesh.identity().move(window.handInfo[i].worldLandmarks[j].x,2 - window.handInfo[i].worldLandmarks[j].y,window.handInfo[i].worldLandmarks[j].z);
                joint[i][j]. detected = true;
            } 
        }

        for(let i = 0; i < 2; i ++)
            for(let j = 0; j < jointNum; j ++) 
                joint[i][j].mesh.scale(joint[i][j].detected ? 0.01 : 0);
    });
 }