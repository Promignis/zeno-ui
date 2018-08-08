import { h, Component } from 'preact'
import Editor from 'react-medium-editor';

require('medium-editor/dist/css/medium-editor.css');
require('medium-editor/dist/css/themes/default.css');

class MEditor extends Component {
    render() {
        return (
            <Editor
                tag="pre"
                text={this.state.text}
                onChange={this.handleChange}
                options={{toolbar: {buttons: ['bold', 'underline']}}}
            />
        )
    }
}

export default Editor