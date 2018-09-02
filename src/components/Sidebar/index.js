import { h, Component } from 'preact'

class Sidebar extends Component {

    constructor(props) {
        super(props)
    }

    onItemSelected(val) {
        if (this.props.onItemChange) {
            this.props.onItemChange(val)
        }
    }

    render() {
        const listItem = (itemData) => {
            return <li onclick={this.onItemSelected.bind(this, itemData.text)}>{itemData.text}</li>
        }
        return (
            <div className={"sidebar " + this.props.for}>
                <ul>
                    { this.props.list.map(listItem) }
                </ul>
            </div>
        )
    }
}

export default Sidebar