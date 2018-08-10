import { h, Component } from 'preact'
import Editor from './components/editor/editor'
import Search from './components/search/search'

require ("./styles/base.css")

let KEYCODE_CTRL = 17
let KEYCODE_SPACE = 32

class App extends Component {

  constructor(props) {
    super(props)
    //links/mentions just array of text for now, will store obj when required
    this.state = {
      firstKey: null,
      links: ["test"],
      mentions: ["test"]
    }
  }

  handleKeydown(event) {
    if (event.which === KEYCODE_CTRL) {
      this.state.firstKey = event.which;
      return
    }
    if (this.state.firstKey === KEYCODE_CTRL && event.which === KEYCODE_SPACE) {
      this.search.toggleVisibility()
    }
  }

  handleKeyup(event) {
      if (event.which === KEYCODE_CTRL) {
          this.state.firstKey = null
      }
  }

  //TODO cleanup
  handleChange(text) {
      let linkMatches = text.match(/\s?#(\w+)\s/g) || []
      let mentionsMatches = text.match(/\s?@(\w+)\s/g) || []
      linkMatches = linkMatches.map((tag) => tag.trim().slice(1)).filter((link) => this.state.links.indexOf(link) == -1)
      mentionsMatches = mentionsMatches.map((tag) => tag.trim().slice(1)).filter((link) => this.state.mentions.indexOf(link) == -1)
      this.setState({
          links: this.state.links.concat(linkMatches),
          mentions: this.state.mentions.concat(mentionsMatches)
      })
  }

  render() {
    return (
      <div class="app" onKeyDown={this.handleKeydown.bind(this)} onKeyUp={this.handleKeyup.bind(this)} >
        <Search ref={(self) => this.search = self} onClose={(ev) => this.contentEditable.editor.focus()} />
        <Editor ref={(self) => this.contentEditable = self} onChange={this.handleChange.bind(this)} links={this.state.links} mentions={this.state.mentions} />
      </div>
    )
  }
}

export default App
