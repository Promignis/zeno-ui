import { h, Component } from 'preact'
import ReactDOM from 'react-dom'
let codemirror = require('codemirror')
let HyperMD = require('hypermd')

require('codemirror/lib/codemirror.css')
require('codemirror/mode/markdown/markdown')

class Editor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            text: "some **value**"
        }
    }

    componentDidMount() {
        let opts = {
            mode: 'markdown',
            highlightFormatting: true,
            fencedCodeBlobkFormatting: true
        }
        this.editor = HyperMD.fromTextArea(this.ref)
        this.editor.setOption("lineNumbers", false)
        // this.editor.on('change', () => this.props.onChange(this.editor.getValue()))
    }

    render() {
        return (
            <textArea ref={(self) => this.ref = self} class=".editable" autofocus></textArea>
        )
    }
}

export default Editor