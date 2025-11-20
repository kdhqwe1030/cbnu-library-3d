import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

const gltfLoader = new GLTFLoader();
const fbxLoader = new FBXLoader();

// 경로별로 한 번만 로드하고, 이후엔 clone 해서 돌려주기 위한 캐시
const gltfCache = new Map();
const fbxCache = new Map();

export async function loadGLTF(path) {
  if (gltfCache.has(path)) {
    return gltfCache.get(path).clone(true); // 복제본 반환
  }

  const gltf = await new Promise((resolve, reject) => {
    gltfLoader.load(path, resolve, undefined, reject);
  });

  const scene = gltf.scene;
  gltfCache.set(path, scene);
  return scene.clone(true);
}

export async function loadFBX(path) {
  if (fbxCache.has(path)) {
    return fbxCache.get(path).clone(true);
  }

  const model = await new Promise((resolve, reject) => {
    fbxLoader.load(path, resolve, undefined, reject);
  });

  fbxCache.set(path, model);
  return model.clone(true);
}
