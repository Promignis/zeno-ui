import { h, Component } from 'preact'
import './base.css'

class Sidebar extends Component {

    constructor(props) {
        super(props)
        //list : Array listItem
        //listItem : { text, children }
        //selectedItem : listItem
        this.state = {
            items: this.props.list,
            selected: this.props.list[0]
        }
    }

    onItemSelected(val) {
        this.props.onItemChange(val)
        this.setState({
            selected: this.state.items.find((item) => item.text === val)
        })
    }

    render() {
        const listItem = (itemData) => {
            return <li className={this.state.selected.text !== itemData.text ? "" : "selected"} onclick={this.onItemSelected.bind(this, itemData.text)}>{itemData.text}</li>
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