import React from 'react'

require("./search.css")

class Search extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            value: "",
            results: []
        }
    }

    toggleVisibility () {
        if (this.state.visible) {
            this.setState({
                visible: false,
                value: ""
            })
        } else {
            this.setState({
                visible: true
            })
        }
   }

    componentDidUpdate() {
        if (this.state.visible) {
            this.searchbox.focus()
        }
        else this.searchbox.blur()
    }

    handleChange(ev) {
        this.setState({
            value: this.searchbox.value
        })
    }

    handleClose(ev) {
        this.setState({
            value: "",
            visible: false
        })
        this.props.onClose(ev)
    }

    render() {
        return (
            <div
                id="spotlight_wrapper"
                style={this.state.visible ? { "display": "block" } : { "display" : "none" } }
            >
                <input
                    type="text"
                    id="spotlight"
                    value={this.state.value}
                    ref={(self) => this.searchbox = self}
                    placeholder="Search"
                    onChange={this.handleChange.bind(this)}
                    onBlur={this.handleClose.bind(this)}
                />
            </div>
        )
    }
}

export default Search