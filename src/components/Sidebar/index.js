import { h, Component } from 'preact'

var R = require('ramda')
import './base.css'

class Sidebar extends Component {

  constructor(props) {
    super(props)
    /* Types
     * Item :: { text :: String }
     * Category :: {
     *   text :: String,
     *   items :: [ Item ]
     * }
     * Props :: {
     *   data :: [ Category ],
     *   onItemChange :: Function
     * }
     */
    this.state = {
      flattenedItems: '',
      selected: ''
    }
  }

  onItemSelected(val) {
    this.props.onItemChange(val)
    this.setState({
      selected: this.state.items.find((item) => item.text === val)
    })
  }

  renderCategory(category) {
    return (
      <li className="sidebar-category">
        <p className="sidebar-category-text">{category.text}</p>
        <ul className="sidebar-category-list">{category.items.map(this.renderItem.bind(this))}</ul>
      </li>
    )
  }

  renderItem(item) {
    //className={this.state.selected.text !== item.text ? "" : "selected"}
    return (
      <li
        className="sidebar-category-list-item"
        onclick={this.onItemSelected.bind(this, item.text)} >
        {item.text}
      </li>
    )
  }

  render() {
    return (
      <div className={"sidebar " + this.props.for}>
        <ul>
          {this.props.data.map(this.renderCategory.bind(this))}
        </ul>
      </div>
    )
  }
}


export default Sidebar
