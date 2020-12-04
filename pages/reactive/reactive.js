let targetMap = new WeakMap();

//  格式如下：
//  map : {
//     [target]: {
//         [key]: [effect1, effect2....]
//     }
// }

// 用于存储effect
let effectStack = [];

/**
 * @description: 收集依赖到targetMap
 * @return {*}
 * @author: Hjm
 * @param {*} target
 * @param {*} type
 * @param {*} key
 */
function track(target, type, key) {
  const effect = effectStack[effectStack.length - 1];
  if (effect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = new Set()));
    }
    if (!dep.has(effect)) {
      dep.add(effect);
    }
  }
  //
}

/**
 * @description: 触发依赖
 * @return {*}
 * @author: Hjm
 * @param {*} target
 * @param {*} type
 * @param {*} key
 */
function trigger(target, type, key) {
  // 找到对应的effect并触发
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let dep = depsMap.get(key);
  if (!dep) {
    return;
  }
  // 获取已存在的Dep Set执行
  dep.forEach((effect) => {
    effect();
  });
  //
}

/**
 * @description: reactive将数据进行响应式绑定
 * @return {*}
 * @author: Hjm
 * @param {*} obj
 */
function reactive(obj) {
  if (typeof obj === "object") {
    for (let key in obj) {
      if (typeof obj[key] === "object") {
        obj[key] = reactive(obj[key]);
      }
    }
  }
  let handler = {
    get(target, key, value) {
      // 收集依赖
      track(target, "GET", key);
      //
      return Reflect.get(target, key);
    },
    set(target, key, value) {
      let res = Reflect.set(target, key, value);
      // 触发依赖
      trigger(target, "SET", key);
      return res;
    },
  };
  return new Proxy(obj, handler);
}

/**
 * @description:
 * @return {*}
 * @author: Hjm
 * @param {*} effect
 * @param {*} fn
 * @param {*} args
 */
function run(effect, fn, args) {
  try {
    effectStack.push(effect);
    return fn(...args); //执行fn以收集依赖
  } finally {
    effectStack.pop();
  }
}

/**
 * @description:
 * @return {*}
 * @author: Hjm
 * @param {*} fn
 * @param {*} lazy
 */
function effect(fn, lazy = false) {
  // 从effectMap找到对应的effect 并执行
  const effect1 = function (...args) {
    return run(effect1, fn, args);
  };
  if (!lazy) {
    effect1();
  }
  return effect1;
}
