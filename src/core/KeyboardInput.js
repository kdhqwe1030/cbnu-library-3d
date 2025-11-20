// src/core/KeyboardInput.js
import * as THREE from "three";

export class KeyboardInput extends THREE.Vector3 {
  #activeKeys = new Set();
  #keyMapping = {};

  constructor(keyMapping) {
    super();

    if (keyMapping) this.#keyMapping = keyMapping;
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  onKeyDown = (e) => {
    const key = e.key.toLowerCase();
    const activeKeys = this.#activeKeys;
    const { left, right, up, down } = this.#keyMapping;

    activeKeys.add(key);
    switch (key) {
      case left:
        this.setX(-1);
        break;
      case right:
        this.setX(1);
        break;
      case up:
        this.setY(1);
        break;
      case down:
        this.setY(-1);
        break;
      default:
        break;
    }
  };

  onKeyUp = (e) => {
    const key = e.key.toLowerCase();
    const activeKeys = this.#activeKeys;
    const { left, right, up, down } = this.#keyMapping;

    activeKeys.delete(key);

    switch (key) {
      case left:
        if (!activeKeys.has(right)) this.setX(0);
        break;
      case right:
        if (!activeKeys.has(left)) this.setX(0);
        break;
      case up:
        if (!activeKeys.has(down)) this.setY(0);
        break;
      case down:
        if (!activeKeys.has(up)) this.setY(0);
        break;
      default:
        break;
    }
  };
}
