import { h, Component } from 'preact'
import HyperMD from 'Components/HyperMD'
const R = require('ramda')

// characters eligible for autocomplete
const CHAR_HASHTAG = "#"
const CHAR_MENTION = "@"

// options for codemirror
const codeMirrorOpts = {
  mode: {
    name: "hypermd",
    hashtag: true,
  },
  lineNumbers: false,
  lineSeparator: null,
  lineWrapping: true,
  theme: "hypermd-light dark",
  extraKeys: {
      "Shift-Space": "autocomplete"
  },
  showCursorWhenSelecting: true
}

/*
 * Note:
 * There are a lot of different user actions to handle for the editor to work perfectly and give the rich text editing experience.
 * These user events can be handled incrementally.
 * Unhandler user actions will be functional, but can cause issues in either autocomplete or creation of new links.
 *
 * Events handled currently -
 * Regular single character insertion using keyboard
 * Regular single character deletion using keyboard backspace and delete key
 *
 * Events yet to handle -
 * Any Selection based editing
 * Any cut copy paste based editing
 * Using arrow keys to navigate and edit
 */

class Editor extends Component {

  constructor(props) {
    /* Types
     *
     * Position :: {
     *  row :: Int,
     *  column :: Int
     * }
     * Link :: {
     *  char :: String,
     *  value :: String,
     *  positionFrom :: Position,
     *  positionTo :: Position
     * }
     *
     * State :: {
     *  currentLink :: Maybe Link
     * }
     */
    super(props)
    this.state = {
      currentLink: null,
      content: this.props.note.text
    }
  }

  handleChange(evt, ctx) {
    const allowedDelimiters = [ CHAR_HASHTAG, CHAR_MENTION ]
    let loc = evt.from
    const currPos = { row : loc.line, column: loc.ch }
    const content = ctx.getValue("\n")
    const currChar = getCharAtPos(currPos, content)
    // found delimiter
    if (R.find(R.equals(currChar), allowedDelimiters)) {
      this.setState({
        currentLink : {
          char: currChar,
          positionFrom: currPos
        }
      })
    }
    // found link complete
    if (this.state.currentLink && !currChar.trim()) {
      const currLink = this.state.currentLink
      const positionFrom = { line: currLink.positionFrom.row, ch: currLink.positionFrom.column + 1 }
      const positionTo = { line: currPos.row, ch: currPos.column }
      const completedLink = Object.assign({}, this.state.currentLink, {
        value: ctx.getRange(positionFrom, positionTo),
        positionTo: currPos
      })
      this.setState({
        currentLink: completedLink
      })
      this.addLink(this.state.currentLink)
    }
    this.setState({
      content: content
    })
    this.props.onContentUpdate(this.props.note.id, this.state.content)
  }

  addLink(newLink) {
    // Storing only initial position, as final position can be calculated
    const newNoteLink = {
      char: newLink.char,
      value: newLink.value,
      position: newLink.positionFrom
    }
    this.props.onLinkCreate(newNoteLink)
    this.setState({
      currentLink: null
    })
  }

  componentWillReceiveProps(newProps) {
    if (newProps.note.id == this.props.note.id) return
    this.props.onContentUpdate(this.props.note.id, this.state.content)
    this.setState({
      content: newProps.note.text
    })
  }

  render() {
    return (
      <HyperMD
        opts={codeMirrorOpts}
        id={this.props.note.id}
        text={this.state.content}
        hintData={R.map(linkText ,this.props.links)}
        onChange={this.handleChange.bind(this)} />
    )
  }
}

// TODO: move common transformers to utils file
const linkText = link => R.concat(link.char, link.value)

const linkEq = (link1, link2) => R.equals(linkText(link1), linkText(link2))

const linkExists = (link, linkArr) => R.find(R.curry(linkEq)(link))(linkArr)

const getLine = (row, content) => {
  return R.compose(
    R.curry(arrIndex)(row),
    R.split("\n")
  )(content)
}

const arrIndex = (idx, arr) => arr[idx]
const strCharAt = (idx, str) => str.charAt(idx)

const getCharAtPos = (pos, content) => {
  return R.compose(
    R.curry(strCharAt)(pos.column),
    R.curry(getLine)(pos.row)
  )(content)
}

export default Editor
