import { h, render } from 'preact';
import mockNotes from './src/MockNotes'
import { localStore } from './src/KnackInterface'
// for dev only
import 'preact/devtools'


// this holds our rendered root element so we can re-render in response to HMR updates.
let root;

// If this is webpack-dev-server, set up HMR :)
if (module.hot) module.hot.accept('./src/app', init);

// Making our app's initialization a function means it's repeatable.
const init = () => {
	// HMR requires that this be a require()
	let App = require('./src/app').default;

  var pAppState = new Promise((resolve, reject) =>
    localStore.get("appState", resolve))
  var pUserSettings = new Promise((resolve, reject) =>
    localStore.get("userSettings", resolve))
  Promise.all([pAppState, pUserSettings]).then(values => {
    const props = {
      app: values[0],
      config: {
        user: values[1]
      }
    }
    root = render(<App {...props} />, document.body, root);
  })
}


// set mock data for testing
localStore.set("userSettings", { theme: "dark" })
localStore.set("appState", { notes: mockNotes })

init();
