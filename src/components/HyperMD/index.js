import { h, Component } from 'preact'

let CodeMirror = require('codemirror')
let hm = require('hypermd')
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/show-hint.css'
import './base.css'

// delimiters to capture for autocomplete
let DELIM_HASHTAG = "#"
let DELIM_MENTION = "@"


class HyperMD extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.editor = hm.fromTextArea(this.textArea, this.props.opts)
    window.codeEditor = this.editor //for testing
    this.editor.setOption("hintOptions", { "hint": this.props.hintFunc })
    this.editor.on('change', (inst, obj) => {
      //if (!(obj.origin === "+input" || obj.origin === "complete")) return
      // dont handle change if setValue
      if (obj.origin == "setValue") return
      this.props.onChange(obj, this.editor)
    })

    this.editor.on("inputRead", (cm, change) => {
      // if (change.text.length === 1 && (change.text[0] === DELIM_HASHTAG || change.text[0] === DELIM_MENTION)) {
      CodeMirror.showHint(this.editor, this.props.hintFunc, { async: true })
      // }
    })
  }

  componentWillReceiveProps(newProps) {
    if (!this.editor) return
    this.editor.setOption("hintOptions", { "hint": this.props.hintFunc })
    if (this.props.id != newProps.id) {
      this.editor.getDoc().setValue(newProps.text)
    }
  }

  render() {
    return (
      <div className="editable">
        <textArea id="hypermd-editor" ref={(self) => this.textArea = self} autofocus>
          {this.props.text}
        </textArea>
      </div>
    )
  }
}

export default HyperMD
