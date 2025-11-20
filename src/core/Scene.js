// src/core/Scene.js
import * as THREE from "three";
import { createFloor2 } from "../floors/floor2/index.js";
import { OrbitalCamera } from "./OrbitalCamera.js";
import { Player } from "./Player.js";
import { KeyboardInput } from "./KeyboardInput.js";

export class Scene extends THREE.Scene {
  #renderer;
  #orbital;
  #player;
  #controls;
  #prevTimestamp;

  constructor() {
    super();

    this.#renderer = new THREE.WebGLRenderer({ antialias: true });
    document.body.appendChild(this.#renderer.domElement);

    this.#addLights();
    this.#standardSet();
    this.#setupControls();
    this.#setupPlayerAndCamera();

    // 층 생성 (비동기)
    this.#loadFloors();

    this.#renderer.setAnimationLoop(this.#render);
  }

  async #loadFloors() {
    const floor2 = await createFloor2();
    this.add(floor2);
    document.querySelector("#loading").style.display = "none";
  }

  #standardSet() {
    this.background = new THREE.TextureLoader().load("/imgs/sky2.jpg");
    // 원래 필드 세팅 코드 등…
  }

  #setupControls() {
    this.#controls = {
      position: new KeyboardInput({
        left: "a",
        right: "d",
        up: "s",
        down: "w",
      }),
      rotation: new KeyboardInput({
        left: "arrowleft",
        right: "arrowright",
        up: "arrowup",
        down: "arrowdown",
      }),
    };
  }

  #setupPlayerAndCamera() {
    this.#player = new Player({
      animationNames: ["idle", "walk", "run"],
      modelName: "root",
      path: "https://assets.codepen.io/829639/",
      onLoad: () => console.log("player loaded"),
    });

    this.add(this.#player);

    this.#orbital = new OrbitalCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );

    this.#player.add(this.#orbital);
  }

  #addLights() {
    const directional = new THREE.DirectionalLight(0xffffff, 2);
    directional.position.set(50, 50, 50);
    directional.castShadow = true;
    this.add(directional);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.add(ambient);
  }

  #update = (elapsedTime) => {
    this.#renderer.setSize(window.innerWidth, window.innerHeight);

    // Rotate the camera
    const easeIn = 91;
    let { x: yRotation, y: xRotation } = this.#controls.rotation;
    xRotation = Math.pow(xRotation, easeIn);
    const cameraRotation = new THREE.Euler(xRotation, yRotation, 0);
    this.#orbital.update(elapsedTime, cameraRotation);

    // Reposition the player
    const { x: xPos, y: zPos } = this.#controls.position;
    const playerPosition = new THREE.Vector3(xPos, 0, zPos);
    playerPosition.multiplyScalar(Player.timeDilation);
    // This applies any orbital rotation to the new player position so that the "forward" direction (the A key) will always move the player "up" on the screen (and the same for left, down, and right).
    playerPosition.applyEuler(this.#orbital.rotation);
    this.#player.update(elapsedTime, playerPosition);
  };

  #render = (timestamp) => {
    if (this.#prevTimestamp === undefined) this.#prevTimestamp = timestamp;
    const elapsedTime = (timestamp - this.#prevTimestamp) / 1000;

    this.#update(elapsedTime);
    this.#renderer.render(this, this.#orbital.camera);

    this.#prevTimestamp = timestamp;
  };
}
