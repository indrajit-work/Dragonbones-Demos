"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * How to use
 * 1. Load data.
 *
 * 2. Parse data.
 *    factory.parseDragonBonesData();
 *    factory.parseTextureAtlasData();
 *
 * 3. Build armature.
 *    armatureDisplay = factory.buildArmatureDisplay("armatureName");
 *
 * 4. Play animation.
 *    armatureDisplay.animation.play("animationName");
 *
 * 5. Add armature to stage.
 *    addChild(armatureDisplay);
 */
var HelloDragonBonesCustom = /** @class */ (function (_super) {
    __extends(HelloDragonBonesCustom, _super);
    function HelloDragonBonesCustom() {
        var _this = _super.call(this) || this;
        _this._resources.push(
        // "resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.json",
        "resource/Red/RedShirt_ske.json", "resource/Red/RedShirt_tex.json", "resource/Red/RedShirt_tex.png");
        return _this;
    }
    HelloDragonBonesCustom.prototype._onStart = function () {
        var factory = dragonBones.PixiFactory.factory;
        // factory.parseDragonBonesData(this._pixiResource["resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.json"].data);
        factory.parseDragonBonesData(this._pixiResources["resource/Red/RedShirt_ske.json"].data);
        factory.parseTextureAtlasData(this._pixiResources["resource/Red/RedShirt_tex.json"].data, this._pixiResources["resource/Red/RedShirt_tex.png"].texture);
        var armatureDisplay = factory.buildArmatureDisplay("RedShirtArmeture", "Redshirtdragonbone");
        armatureDisplay.animation.play("animtion0");
        armatureDisplay.x = 0.0;
        armatureDisplay.y = 200.0;
        this.effectSlot = armatureDisplay.armature.getBone("spine");
        this.addChild(armatureDisplay);
        PIXI.ticker.shared.add(this._enterFrameHandler, this);
    };
    HelloDragonBonesCustom.prototype._enterFrameHandler = function (deltaTime) {
        //console.log("update frame");
       
        console.log(this.effectSlot.offset.x =NoseX)
    };
    return HelloDragonBonesCustom;
}(BaseDemo));


var Net;
const video = document.createElement("video");
// Wrap your code in DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function() {
    
    video.width = 640;
    video.height = 480;

    video.addEventListener("click", detectFrame);

    document.body.appendChild(video);

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
        video.play();
    });


    posenet.load().then((net) => {
        Net = net;
        console.log("posenet loaded!");
        detectFrame().then((p) => {
            console.log(p.keypoints[10].position.y);
        });
    }).catch((error) => {
        console.error("Error loading PoseNet:", error);
    });


    window.requestAnimationFrame(step);
});

async function detectFrame() {
    if(Net == null)
    {
        console.log("Posenet not loaded")
        return;
    }
  var pose = await Net.estimateSinglePose(video);
  return new Promise((resolve) => {
    resolve(pose);
  });
}

let NoseX = 0;



function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t;
}



let oldy = 0;
let newDir = "";
let prevDir = "";
let msg = "";
function step(timestamp) {
  detectFrame().then((p) => {
    let y = p.keypoints[10].position.y;
    let y1 = lerp(oldy, y, 0.3);
    let d = y1 - y;
    let tempdir = y1 > oldy ? "down" : "up";
    oldy = y1;
    let flapThreshold = 35;
    let passThreshold = Math.abs(d) > flapThreshold;
    let value = y1 / video.height;
    if (passThreshold) newDir = tempdir;

    let oldmsg = msg;
    if (prevDir == "up" && newDir == "down") msg = "down";
    if (prevDir == "down" && newDir == "up") msg = "up";
    if (msg == "down" && msg != oldmsg) flap();
    //status.innerHTML = msg
    // if((msg=='down' || 'up') && msg != oldmsg) console.log(msg,Date.now())
    if (passThreshold) prevDir = newDir;
    dot.style.top = `${value * video.height}px`;

    NoseX = p.keypoints[0].position.x;
    
  });
  window.requestAnimationFrame(step);
}
//window.requestAnimationFrame(step);


let dot = document.createElement('div')
dot.setAttribute('style', 'background-color:red; width:50px; height:50px; position:absolute; z-index:1000; top:0; left:50px; border-radius:25px')
document.body.appendChild(dot)

let status = document.createElement('div')
status.style.fontSize = '72px'
status.innerHTML = '...'
document.body.appendChild(status)

function flap() {
  console.log("flap!", Date.now());
  //mainState.jump();
}