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
    this.state = {
      text: ""
    }
  }

  componentDidMount() {
    this.editor = hm.fromTextArea(this.textArea, this.props.opts)
    window.codeEditor = this.editor //for testing
    this.editor.on('change', (inst, obj) => {
      console.log(obj)
      if (!(obj.origin === "+input" || obj.origin === "complete")) return
      const content = this.editor.getValue()
      // this.setState({ text: content })
      this.props.onChange(content)
    })

    this.editor.on("inputRead", (cm, change) => {
      // if (change.text.length === 1 && (change.text[0] === DELIM_HASHTAG || change.text[0] === DELIM_MENTION)) {
      this.editor.showHint()
      // }
    })
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

function createHintFunc(data) {
  return function (ref, options) {
    const cursor = ref.getCursor(),
      line = ref.getLine(cursor.line),
      start = cursor.ch - 1,
      end = cursor.ch,
      delimiter = line.slice(start, cursor.ch).toLowerCase(),
      dataList = data
        .filter((item) => item.delimiter == delimiter)
        .map((item) => delimiter + item.value)
    return {
      list: dataList,
      from: cm.Pos(cursor.line, start),
      to: cm.Pos(cursor.line, end)
    }
  }
}


export default HyperMD
