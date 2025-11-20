// src/core/Player.js
import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

export class Player extends THREE.Group {
  static timeDilation = 0.15;

  #action;
  #actionList = {};
  #areModelsLoaded = false;
  #mixer;
  #model;

  constructor(props) {
    super();

    const { animationNames, modelName, onLoad, path } = props;
    const loader = new FBXLoader();
    loader.setPath(path);
    loader.load(
      `${modelName}.fbx`,
      (model) => {
        model.scale.setScalar(0.05);

        model.traverse((mesh) => {
          mesh.castShadow = true;
          if (mesh.material?.name === "asdf1:Beta_HighLimbsGeoSG2") {
            mesh.material.color.setHex(0x333333);
            mesh.metalicness = 1;
            mesh.roughness = 0;
          } else if (mesh.material?.name === "Beta_Joints_MAT") {
            mesh.material.color.setRGB(
              (Math.floor(Math.random() * 80) + 20) / 100,
              (Math.floor(Math.random() * 80) + 20) / 100,
              (Math.floor(Math.random() * 80) + 20) / 100
            );
          }
        });

        model.position.set(0, 25, 0);
        model.setRotationFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          Math.PI
        );
        this.#model = model;
        this.add(model);

        this.#mixer = new THREE.AnimationMixer(this.#model);

        const loadingManager = new THREE.LoadingManager();
        const loader = new FBXLoader(loadingManager);
        loader.setPath(path);
        loadingManager.onLoad = () => {
          this.#areModelsLoaded = true;
          this.#setAction("idle");
          if (typeof onLoad === "function") onLoad();
        };

        animationNames.forEach((name) => {
          loader.load(`${name}.fbx`, (model) => {
            const clip = model.animations[0];
            const action = this.#mixer.clipAction(clip);
            action.name = name;

            this.#actionList[name] = action;
          });
        });
      },
      null,
      (e) => console.log(e)
    );
  }

  update = (elapsedTime, movement) => {
    if (!this.#action) return;
    this.#animate(elapsedTime, movement);
    this.#move(elapsedTime, movement);
  };

  #animate = (elapsedTime, movement) => {
    const { x, z } = movement;

    const speed = Math.min(Math.abs(x) + Math.abs(z), 1);

    let action = "idle";

    if (speed === 0) action = "idle";
    else if (speed < 0.3) action = "walk";
    else action = "run";

    this.#setAction(action);
    this.#mixer.update(elapsedTime);
  };

  #move = (elapsedTime, movement) => {
    if (!movement instanceof THREE.Vector3) return;
    if (movement.x === 0 && movement.z === 0) return;

    const nextPosition = this.position.clone();
    nextPosition.add(movement);

    const angle =
      Math.PI +
      Math.atan2(
        this.position.x - nextPosition.x,
        this.position.z - nextPosition.z
      );

    this.position.copy(nextPosition);

    if (this.#model)
      this.#model.setRotationFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        angle
      );
  };

  #setAction(name) {
    const prevAction = this.#action;
    if (prevAction?.name === name) return;

    this.#action = this.#actionList[name];

    if (prevAction) {
      this.#action.time = 0.1;
      this.#action.enabled = true;
      this.#action.setEffectiveTimeScale(Player.timeDilation);
      this.#action.setEffectiveWeight(1.0);
      this.#action.crossFadeFrom(prevAction, 0.5, true);
    }

    this.#action.play();
  }
}
