// @flow
import React from 'react'

let CodeMirror = require('codemirror')
let HyperMD = require('hypermd')
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/show-hint.css'


// delimiters to capture for autocomplete
let DELIM_HASHTAG = "#"
let DELIM_MENTION = "@"

class Editor extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            text: ""
        }
    }

    componentDidMount() {
        let opts = {
            mode: {
                name: "hypermd",
                hashtag: true,
            },
            lineNumbers: false,
            lineSeparator: null,
            lineWrapping: true,
            extraKeys: {
                "Shift-Space": "autocomplete"
            },
            showCursorWhenSelecting: true
        }
        this.editor = HyperMD.fromTextArea(this.textArea, opts)
        window.codeEditor = this.editor //for testing
        this.editor.on('change', (ev, obj) => {
            const content = this.editor.getValue()
            // this.setState({ text: content })
            this.props.onChange(this.editor.getValue())
        })

        this.editor.on("inputRead", (cm, change) => {
            if (change.text.length === 1 && (change.text[0] === DELIM_HASHTAG || change.text[0] === DELIM_MENTION)) {
                this.editor.showHint()
            }
        })
    }

    // TODO fix
    componentWillReceiveProps(newProps) {
        if (!this.editor) return
        this.editor.setOption("hintOptions", { "hint": createHintFunc(newProps.links) })
        if (newProps.text != this.state.text) {
            this.editor.getDoc().setValue(newProps.text)
            this.setState({ text: newProps.text })
        }
    }

    render() {
        return (
            <textArea ref={(self) => this.textArea = self} class="editable" autofocus></textArea>
        )
    }
}

function createHintFunc(data) {
    return function (cm, options) {
        const cursor = cm.getCursor(),
            line = cm.getLine(cursor.line),
            start = cursor.ch - 1,
            end = cursor.ch,
            delimiter = line.slice(start, cursor.ch).toLowerCase(),
            dataList = data
                .filter((item) => item.delimiter == delimiter)
                .map((item) => delimiter + item.value)
        return {
            list: dataList,
            from: CodeMirror.Pos(cursor.line, start),
            to: CodeMirror.Pos(cursor.line, end)
        }
    }
}


export default Editor