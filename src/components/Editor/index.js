import { h, Component } from 'preact'
import HyperMD from 'Components/HyperMD'

// characters eligible for autocomplete
const CHAR_HASHTAG = "#"
const CHAR_MENTION = "@"

// options for codemirror
const codeMirrorOpts = {
  mode: {
    name: "hypermd",
    hashtag: true,
  },
  lineNumbers: false,
  lineSeparator: null,
  lineWrapping: true,
  theme: "hypermd-light dark",
  extraKeys: {
      "Shift-Space": "autocomplete"
  },
  showCursorWhenSelecting: true
}

class Editor extends Component {

  constructor(props) {
    super(props)
    this.state = {
      note: props.note,
      links: props.links || []
    }
  }

  handleChange(event) {
    const allowedDelimiters = [ CHAR_HASHTAG, CHAR_MENTION ]
  }

  updateLinks(newLink) {
    this.props.onLinkUpdate(this.state.links)
  }

  render() {
    return (
      <HyperMD
        opts={codeMirrorOpts}
        text={this.props.note.text}
        onChange={this.handleChange.bind(this)} />
    )
  }
}

export default Editor
