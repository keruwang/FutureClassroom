const canvas = document.createElement("canvas");
const threshold = 25;
let blobs = [];
let ratio = 1;

function getScreenshot(videoEl, scale) {
    scale = scale || 1;
    canvas.width = videoEl.clientWidth * scale;
    canvas.height = videoEl.clientHeight * scale;
    canvas.getContext('2d').drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    ratio =  canvas.width / canvas.height;
    const data = canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
    return data;
}

class Blob {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.height = 1;
        this.width = 1;
        this.size = 1;
    }
    
    addPixel(x, y) {
        this.x = this.x * this.size;
        this.y = this.y * this.size;
        this.size ++;
        this.x += x;
        this.y += y;
        this.x /= this.size;
        this.y /= this.size;
    }

}

function dist(color1, color2) {
    let r1 = color1[0], g1 = color1[1], b1 = color1[2],
        r2 = color2[0], g2 = color2[1], b2 = color2[2];
    return Math.sqrt( Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)); 
}

export let grouping = (color, threshold) => {
    let imgData = getScreenshot(window.video, 0.1);
    // console.log(imgData);
    blobs = [];
    for(let x = 0; x < canvas.width; x ++) {
        for(let y = 0; y < canvas.height; y ++) {
            let ind = x + y * canvas.width;
            let offset = ind * 4;
            let r = imgData[offset], g = imgData[offset + 1], b = imgData[offset + 2];
            if(dist(color, [r,g,b]) < threshold) {
                if(blobs.length == 0) {
                    blobs.push(new Blob(x, y));
                } else {
                    blobs[0].addPixel(x, y);
                }
            }
        }
    }

    if(blobs.length != 0) {
        // console.log(blobs[0].x, blobs[0].y);
        return [ratio * blobs[0].x / canvas.width, blobs[0].y / canvas.height];
    } 
}