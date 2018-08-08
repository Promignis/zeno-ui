import { h, Component } from 'preact'
import Editor from './components/editor/editor'

require ("./styles/base.css")

class App extends Component {
  render() {
    return (
      <Editor />
    )
  }
}

export default App
