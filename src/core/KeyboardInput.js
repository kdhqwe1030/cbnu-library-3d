// src/core/KeyboardInput.js
import * as THREE from "three";

export class KeyboardInput extends THREE.Vector3 {
  #activeKeys = new Set();
  #keyMapping = {};
  #isRunning = false;

  constructor(keyMapping) {
    super();

    if (keyMapping) this.#keyMapping = keyMapping;
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  get isRunning() {
    return this.#isRunning;
  }

  onKeyDown = (e) => {
    const key = e.key.toLowerCase();
    const activeKeys = this.#activeKeys;
    const { left, right, up, down } = this.#keyMapping;

    // Shift 키로 달리기 설정
    this.#isRunning = e.shiftKey;

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

    // Shift 키로 달리기 설정
    this.#isRunning = e.shiftKey;

    activeKeys.delete(key);

    switch (key) {
      case left:
        if (!activeKeys.has(right) && !activeKeys.has("ㅇ")) this.setX(0);
        break;
      case right:
        if (!activeKeys.has(left) && !activeKeys.has("ㅁ")) this.setX(0);
        break;
      case up:
        if (!activeKeys.has(down) && !activeKeys.has("ㄴ")) this.setY(0);
        break;
      case down:
        if (!activeKeys.has(up) && !activeKeys.has("ㅈ")) this.setY(0);
        break;
      default:
        break;
    }
  };
}
