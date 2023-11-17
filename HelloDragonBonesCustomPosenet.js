"use strict";
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (d, b) {
          d.__proto__ = b;
        }) ||
      function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
    return function (d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
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
      "resource/Red/RedShirt_ske.json",
      "resource/Red/RedShirt_tex.json",
      "resource/Red/RedShirt_tex.png"
    );
    return _this;
  }
  HelloDragonBonesCustom.prototype._onStart = function () {
    var factory = dragonBones.PixiFactory.factory;
    // factory.parseDragonBonesData(this._pixiResource["resource/mecha_1002_101d_show/mecha_1002_101d_show_ske.json"].data);
    factory.parseDragonBonesData(
      this._pixiResources["resource/Red/RedShirt_ske.json"].data
    );
    factory.parseTextureAtlasData(
      this._pixiResources["resource/Red/RedShirt_tex.json"].data,
      this._pixiResources["resource/Red/RedShirt_tex.png"].texture
    );
    var armatureDisplay = factory.buildArmatureDisplay(
      "RedShirtArmeture",
      "Redshirtdragonbone"
    );
    armatureDisplay.animation.play("animtion0");
    armatureDisplay.x = 0.0;
    armatureDisplay.y = 200.0;
    this.effectSlot = armatureDisplay.armature.getBone("spine");
    this.addChild(armatureDisplay);
    PIXI.ticker.shared.add(this._enterFrameHandler, this);
  };
  HelloDragonBonesCustom.prototype._enterFrameHandler = function (deltaTime) {
    //console.log("update frame");

    this.effectSlot.offset.x = NoseX;
  };
  return HelloDragonBonesCustom;
})(BaseDemo);

var Net;
var noseCircle;
const video = document.createElement("video");
// Wrap your code in DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function () {
  video.width = 640;
  video.height = 480;

  video.addEventListener("click", detectFrame);

  document.body.appendChild(video);

  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream;
    video.play();
  });

  posenet
    .load()
    .then((net) => {
      Net = net;
      console.log("posenet loaded!");
      detectFrame().then((p) => {
        console.log(p.keypoints[10].position.y);
      });
    })
    .catch((error) => {
      console.error("Error loading PoseNet:", error);
    });

  noseCircle = document.createElement("div");
  noseCircle.setAttribute(
    "style",
    "background-color:blue; width:20px; height:20px; position:absolute; z-index:1000; border-radius:50%"
  );
  document.body.appendChild(noseCircle);
  window.requestAnimationFrame(step);
});

async function detectFrame() {
  if (Net == null) {
    console.log("Posenet not loaded");
    return;
  }
  var pose = await Net.estimateSinglePose(video);
  return new Promise((resolve) => {
    resolve(pose);
  });
}

let NoseX = 0;
let NoseY = 0;

function step(timestamp) {
  detectFrame().then((p) => {
    NoseX = p.keypoints[0].position.x;
    NoseY = p.keypoints[0].position.y;
    console.log(NoseY)
    noseCircle.style.left = `${NoseX}px`;
    noseCircle.style.top = `${NoseY}px`;
  });
  window.requestAnimationFrame(step);
}
//window.requestAnimationFrame(step);
