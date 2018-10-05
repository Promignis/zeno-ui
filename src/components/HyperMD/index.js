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
    this.setHintData(this.props.hintData)
    this.editor.on('change', (inst, obj) => {
      //if (!(obj.origin === "+input" || obj.origin === "complete")) return
      // dont handle change if setValue
      if (obj.origin == "setValue") return
      this.props.onChange(obj, this.editor)
    })

    this.editor.on("inputRead", (cm, change) => {
      // if (change.text.length === 1 && (change.text[0] === DELIM_HASHTAG || change.text[0] === DELIM_MENTION)) {
      this.editor.showHint()
      // }
    })
  }

  componentWillReceiveProps(newProps) {
    if (!this.editor) return
    this.setHintData(this.props.hintData)
    if (this.props.id != newProps.id) {
      this.editor.getDoc().setValue(newProps.text)
    }
  }

  setHintData(data) {
    this.editor.setOption("hintOptions", { "hint": createHintFunc(data) })
  }

  render() {
    return (
      <div className="editable">
        <textArea ref={(self) => this.textArea = self} autofocus>
          {this.props.text}
        </textArea>
      </div>
    )
  }
}

const createHintFunc = dataList => {
  return (ref, options) => {
    const cursor = ref.getCursor(),
      line = ref.getLine(cursor.line),
      start = cursor.ch - 1,
      end = cursor.ch,
      delimiter = line.slice(start, cursor.ch).toLowerCase()
    return {
      list: dataList.filter(key => key[0] == delimiter),
      from: CodeMirror.Pos(cursor.line, start),
      to: CodeMirror.Pos(cursor.line, end)
    }
  }
}


export default HyperMD
