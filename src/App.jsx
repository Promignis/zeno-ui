import { h, Component } from 'preact'
import Editor from './components/editor/editor'
import Search from './components/search/search'

require ("./styles/base.css")

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      firstChar: null
    }
  }

  handleKeydown(event) {
    //17 = CTRL
    //32 = SPACE

    //save char code in var if it is ctrl
    if (event.which == 17) {
      this.state.firstChar = event.which;
    }

    //if firstchar is ctrl and the current keydown event char is space, continue
    if (this.state.firstChar == 17 && event.which == 32) {
      this.toggleSearch()
      //delete firstchar var
      this.state.firstChar = null
    }
  }

  toggleSearch() {
    this.search.toggleVisibility()
  }

  render() {
    return (
      <div class="app" onKeyDown={this.handleKeydown.bind(this)} >
        <Search ref={(self) => this.search = self} onClose={(ev) => this.contentEditable.editor.focus()} />
        <Editor ref={(self) => this.contentEditable = self}/>
      </div>
    )
  }
}

export default App
