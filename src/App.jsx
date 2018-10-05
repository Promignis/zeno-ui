import { h, Component } from 'preact'
import Editor from 'Components/Editor'
import Search from 'Components/Search'
import mockNotes from './MockNotes'
import { default as Config } from '../app.config'
import "./styles/base.css"

const R = require('ramda')

// keycodes for opening search
const KEYCODE_CTRL = 17
const KEYCODE_SPACE = 32


// characters eligible for links
const CHAR_HASHTAG = "#"
const CHAR_MENTION = "@"

// links options
const allowedLinks = [
  {
    char: CHAR_HASHTAG,
    text: "Hashtags"
  },
  {
    char: CHAR_MENTION,
    text: "Mentions"
  }
]

class App extends Component {

  constructor(props) {
    super(props)
    /* Types
     * Note :: {
     *   id :: String,
     *   text :: String,
     *   title :: String,
     *   lastModified :: Time,
     *   lastCursorPosition :: Position ,
     *   links :: [ Link ]
     * }
     * Link :: {
     *   char :: String,
     *   value :: String,
     *   position :: Position,
     *   created :: Time
     * }
     * Position :: {
     *   row :: Int,
     *   column :: Int
     * }
     * Settings :: {
     *   theme :: String
     * }
     * AppState :: {
     *   notes :: [ Note ]
     * }
     * UIState :: {
     *   currentNoteId :: String,
     *   currentLinkId :: String,
     *   firstKey :: Nullable String,
     *   sidebar :: {
     *     visible :: Boolean
     *   }
     * }
     * State :: {
     *   app :: AppState,
     *   ui :: UIState,
     *   userSettings :: Settings
     * }
     */

    // set mock data for testing
    setStoreItem("userSettings", { theme: "dark" })
    setStoreItem("appState", { notes: mockNotes })

    this.state = {
      app: getStoreItem("appState"),
      ui : {
        currentNoteId: "nt1",
        currentLinkId: "#first",
        firstKey: null,
        sidebar: {
          visible: true
        }
      },
      userSettings: getStoreItem("userSettings")
    }
  }

  handleKeyDown(event) {
    if (event.which === KEYCODE_CTRL) {
      this.setState({
        ui: Object.assign({}, this.state.ui, { firstKey: KEYCODE_CTRL })
      })
      return
    }
    if (this.state.ui.firstKey === KEYCODE_CTRL && event.which === KEYCODE_SPACE) {
      this.search.toggleVisibility()
    }
  }

  handleKeyUp(event) {
    if (event.which !== KEYCODE_CTRL) return
    this.state.firstKey = null
  }

  getNoteLinks(lNoteId) {
    const getNote = note => note.id == lNoteId
    const foundNote = this.state.app.notes.find(getNote)
    if (!foundNote) return null
    return foundNote.links.slice(0)
  }

  setNoteText(noteId, content) {
    let newNotes = R.clone(this.state.app.notes)
    let changedNote = R.find(R.propEq("id", noteId), newNotes)
    changedNote.text = content
    this.setState({
      app: {
        notes: newNotes
      }
    })
  }

  createNoteLink(newLink) {
    let newNotes = R.clone(this.state.app.notes)
    let changedNote = R.find(R.propEq("id", this.state.ui.currentNoteId), newNotes)
    changedNote.links = R.append(newLink, changedNote.links)
    this.setState({
      app: {
        notes: newNotes
      }
    })
  }

  addNote(id, text) {
    this.setState({
      notes: this.state.notes.concat({
        id: id,
        text: text,
        title: "",
        lastModified: Date.parse("01 Jan 2000 00:00:01 GMT"),
        lastCursorPosition: {
          row: 0,
          column: 0
        }
      }),
      currentNoteId: id
    })
  }

  changeNote(id) {
    let text = "hello there\n#hello"
    this.addNote(id, text)
  }

  handleNoteChange(id) {
    this.setState({
      ui: Object.assign({}, this.state.ui, { currentNoteId: id })
    })
  }

  handleLinkChange(id) {
    this.setState({
      ui: Object.assign({},
        this.state.ui,
        {
          currentLinkId: id,
          currentNoteId: getLinkOccurrences(this.state.app.notes, id)[0].noteId
        })
    })
  }

  /*
   * functions for rendering
   */
  renderSidebarLink(link) {
      return (
        <li
          className={"sidebar-link-category-list-item " + (this.state.ui.currentLinkId == linkText(link) ? "selected" : "")}
          onClick={this.handleLinkChange.bind(this, linkText(link))}
          >
          {linkText(link)}
        </li>
      )
    }

  renderSidebarCategory (category) {
    return (
      <li
        className={"sidebar-link-category sidebar-link-" + category.text.toLowerCase()}
      >
        <p className="sidebar-link-category-text">{category.text}</p>
        <ul className="sidebar-link-category-list">
          {R.map(this.renderSidebarLink.bind(this), category.links)}
        </ul>
      </li>
    )
  }

  renderSidebarNote (linkOccurence) {
    const note = getNoteById(linkOccurence.noteId, this.state.app.notes)
    return (
      <li
        className={"sidebar-note-list-item " + (this.state.ui.currentNoteId == note.id ? "selected" : "")}
        onClick={this.handleNoteChange.bind(this, note.id)}
      >
        <p className="sidebar-note-list-item-header">{getLine(0, note.text)}</p>
        <p className="sidebar-note-list-item-text">{getLine(1, note.text)}</p>
      </li>
    )
  }

  render() {

    const sidebarUI = (
        <div className="sidebar-container">
          <div className="sidebar">
            <div className="sidebar-column sidebar-link">
              <h2 className="sidebar-no-filter">All</h2>
              <ul className="sidebar-link-list">
                {
                  R.compose(
                    R.map(this.renderSidebarCategory.bind(this)),
                    getUniqueLinksByCategory
                  )(this.state.app.notes)
                }
              </ul>
            </div>
            <div className="sidebar-column sidebar-note">
              <div className="sidebar-search"></div>
              <ul className="sidebar-note-list">
                {
                  R.compose(
                    R.map(this.renderSidebarNote.bind(this)),
                    R.curry(getLinkOccurrences)(this.state.app.notes)
                  )(this.state.ui.currentLinkId)
                }
              </ul>
            </div>
          </div>
        </div>
      )

    return (
      <div
        className={"app " + this.state.userSettings.theme + "-theme"}
        onKeyDown={this.handleKeyDown.bind(this)}
        onKeyUp={this.handleKeyUp.bind(this)} >
        {sidebarUI}
        <Editor
          ref={(self) => this.contentEditable = self}
          note={getNoteById(this.state.ui.currentNoteId, this.state.app.notes)}
          links={getAllFlattenedLinks(this.state.app.notes)}
          onLinkCreate={this.createNoteLink.bind(this)}
          onContentUpdate={this.setNoteText.bind(this)}
        />
        <Search
          ref={(self) => this.search = self}
          onClose={(ev) => this.contentEditable.editor.focus()} />

      </div>
    )
  }
}


 /*
  * all transformers
  */
const getNoteById = (nId, notes) => R.find(R.propEq("id", nId), notes)

const getLinksInNote = (nId, notes) => R.prop("links", getNoteById(nId, notes))

const getTextForChar = key => R.find(R.propEq("char")(key))(allowedLinks).text

const getUniqueLinksByCategory = notes => {
  const uniqObj = R.compose(
    R.groupBy(R.prop("char")),
    R.uniqWith(linkEq),
    R.flatten,
    R.map(R.prop("links"))
  )(notes)
  const objToArr = key => {
    return { char: key, links: uniqObj[key], text: getTextForChar(key) }
  }
  return Object.keys(uniqObj).map(objToArr)
}

const linkText = link => R.concat(link.char, link.value)

const linkEq = (link1, link2) => R.equals(linkText(link1), linkText(link2))

const linkExists = (link, linkArr) => R.find(R.curry(linkEq)(link))(linkArr)

const getAllFlattenedLinks = (notes) => {
  const linkNotes = note => {
    const notePosition = pos => {
      return { position: Object.assign({}, pos, { noteId: note.id }) }
    }
    return note.links.map(link => Object.assign({}, link, notePosition(link.position)))
  }
  const linkOccurences = (acc, cur) => {
    const existingLink = linkExists(cur, acc)
    if (!existingLink) {
      const newObj = { char: cur.char, value: cur.value, occurences: [].concat(cur.position) }
      return acc.concat(newObj)
    }
    existingLink.occurences = existingLink.occurences || []
    existingLink.occurences.push(cur.position)
    return acc
  }
  const links = R.compose(
    R.reduce(linkOccurences, []),
    R.flatten,
    R.map(linkNotes)
  )(notes)
  return links
}

const getLinkOccurrences = (notes, lKey) => {
  const links = getAllFlattenedLinks(notes)
  const linkFound = links.find(link => (link.char + link.value) == lKey)
  return linkFound ? linkFound.occurences : []
}

/*
* Editor helpers
*/
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


/*
 * general helpers
 */
const getStoreItem = key => {
  if (Config.target == "browser") return JSON.parse(localStorage.getItem(key))
  // add knack storage api
  if (Config.target == "knack") return {}
}

const setStoreItem = (key, val) => {
  if (Config.target == "browser") return localStorage.setItem(key, JSON.stringify(val)) || true
  // add knack storage api
  if (Config.target == "knack") return {}
}

export default App
