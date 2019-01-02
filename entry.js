import { h, render } from 'preact';
import { default as Config } from './app.config'
import mockNotes from './src/MockNotes'
// for dev only
import 'preact/devtools'


// this holds our rendered root element so we can re-render in response to HMR updates.
let root;
// If this is webpack-dev-server, set up HMR :)
if (module.hot) module.hot.accept('./src/app', init);

// Making our app's initialization a function means it's repeatable.
const init = async () => {
	// HMR requires that this be a require()
	let App = require('./src/app').default;

  // async getStoreItem api
  if (Config.target == "knack") {
    var pAppState = new Promise((resolve, reject) =>
      getStoreItemAsync("appState", resolve))
    var pUserSettings = new Promise((resolve, reject) =>
      getStoreItemAsync("userSettings", resolve))
      let values = await Promise.all([pAppState, pUserSettings])
      const props = {
        app: values[0],
        config: {
          app: Config,
          user: values[1]
        }
      }
      root = render(<App {...props} />, document.body, root);
  } else {
    // sync getStoreItem api
    const props = {
      app: getStoreItemSync("appState"),
      config: {
        app: Config,
        user: getStoreItemSync("userSettings")
      }
    }
    root = render(<App {...props} />, document.body, root);
  }
}

/*
 * general helpers
 */
const getStoreItemSync = key => {
  if (Config.target == "browser") return JSON.parse(localStorage.getItem(key))
  // Knack test
  if (Config.target == "knack-test") {
    window.__store = window.__store || {}
    return window.__store[key]
  }
  // add knack storage api
  if (Config.target == "knack") return _runtime.getFromFile(key, JSON.stringify(val)) || true
}


const getStoreItemAsync = (key, cb) => {
  if (Config.target == "browser") {
    setTimeOut(() => cb(JSON.parse(localStorage.getItem(key))), 1)
  }
  // Knack test
  if (Config.target == "knack-test") {
    window.__store = window.__store || {}
    setTimeOut(() => cb(window.__store[key]), 1)
  }
  // add knack storage api
  if (Config.target == "knack") {
    _runtime.getFromFile(key, val => cb(JSON.parse(val)))
  }
}

const setStoreItem = (key, val) => {
  if (Config.target == "browser") return localStorage.setItem(key, JSON.stringify(val)) || true
  // Knack test
  if (Config.target == "knack-test") {
    window.__store = window.__store || {}
    window.__store[key] = val
    return
  }
  // add knack storage api
  if (Config.target == "knack") return _runtime.setToFile(key, JSON.stringify(val)) || true
}

(async () => {
  init();
})()

// set mock data for testing
setStoreItem("userSettings", { theme: "dark" })
setStoreItem("appState", { notes: mockNotes })
