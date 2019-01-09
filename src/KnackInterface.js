/* Knack Interface */

const getStoreItemSync = key => {
  switch (ENV) {
    case "browser": return JSON.parse(localStorage.getItem(key))
    case "knack": return _runtime.getFromFile(key, JSON.stringify(val)) || true
  }
}

const getStoreItemAsync = (key, cb) => {
  switch (ENV) {
    case "browser":
      setTimeout(() => cb(JSON.parse(localStorage.getItem(key))), 1)
      break;
    case "knack":
      _runtime.getFromFile(key, val => cb(JSON.parse(val)))
  }
}

const setStoreItem = (key, val) => {
  switch (ENV) {
    case "browser": return localStorage.setItem(key, JSON.stringify(val)) || true
    case "knack": return _runtime.setToFile(key, JSON.stringify(val)) || true
  }
}

export const localStore = {
  set: setStoreItem,
  get: getStoreItemAsync
}


export const fuzzyMatch = _runtime.fuzzyMatch
