import { h, Component } from 'preact'
import Editor from 'Components/Editor'
import Search from 'Components/Search'
import Sidebar from 'Components/Sidebar'
import mockNotes from './MockNotes'
import { default as Config } from '../app.config'
import "./styles/base.css"

var R = require('ramda')

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
     *   title, lastModified,
     *   lastCursorPosition :: Position ,
     *   links :: [ Link ]
     * }
     * Link :: {
     *   char :: String,
     *   value :: String,
     *   position :: Position
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

  handleChange(text) {
    const allowedDelimiters = [ DELIM_HASHTAG, DELIM_MENTION ]
    //let linkMatches = []
    //allowedDelimiters.forEach((delimiter) => {
      //const regex = new RegExp('\\s?' + delimiter + "(\\w+)\\s", "gi")
      //let delimMatched = text.match(regex) || []
      //let matchedLinks = []
      //delimMatched.forEach((word) => {
        //const linkExists = matchedLinks.find((link) =>
          //link.value == word
        //)
        //if (!linkExists) {
          //let newLink = {
            //delimiter,
            //value: word.trim().slice(1),
            //instances: [{ noteId: this.state.currentNoteId }]
          //};
          //linkMatches = linkMatches.concat(newLink)
        //} else {
          //linkMatches = linkMatches.concat(matchedLinks)
        //}
      //})
    //})
    //let newLinks = linkMatches.filter((link) =>
      //!this.state.links.find((currLink) =>
        //(currLink.delimiter == link.delimiter &&
          //currLink.value == link.value)))
    //let existingLinks = linkMatches.filter((link) =>
      //this.state.links.find((currLink) =>
        //(currLink.delimiter == link.delimiter &&
          //currLink.value == link.value)))

    //this.setState({
      //notes: this.state.notes.map((note) =>
        //note.id == this.state.currentNodeId ? text : note),
      //links: this.state.links.map((link) => {
        //const found = existingLinks.find((currLink) =>
          //(currLink.delimiter == link.delimiter &&
            //currLink.value == link.value))
        //if (!found) return link
        //let newInstances = []
        //console.log(found)
        //found.instances.forEach((inst) => {
          //const foundInstance = link.instances.find((currInst) =>
            //currInst.noteId === inst.noteId &&
            //currInst.row === inst.row &&
            //currInst.column === currInst.column
          //)
          //if (foundInstance) return
          //newInstances = newInstances.concat(inst)
        //})
        //link.instances = link.instances.concat(newInstances)
        //return link
      //}).concat(newLinks)
    //})
  }

  getNoteLinks(lNoteId) {
    const getNote = note => note.id == lNoteId
    const foundNote = this.state.app.notes.find(getNote)
    if (!foundNote) return null
    return foundNote.links.slice(0)
  }


  updateNoteLinks(lNoteId, newLinks) {
    // TODO update state with new links from editor component
    this.setState({ links: this.state.links })
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

  onLinkChange(id) {
    this.setState({
      currentLinkId: id
    })
  }

  onNoteChange(id) {
    this.setState({
      currentNoteId: id
    })
  }

  render() {
    const currentNoteLinks = R.pipe(
      R.find(R.propEq("id", this.state.ui.currentNoteId)),
      R.prop("links")
    )(this.state.app.notes)

    const sidebarUI = () => {
      if (!this.state.ui.sidebar.visible) return <div></div>;
      return (
        <div className="sidebar-container">
          <Sidebar
            data={sidebarData(getUniqueLinks(this.state.app.notes))}
            for="links"
            onItemChange={this.onLinkChange.bind(this)} />

          <Sidebar
            data={[]}
            for="instances"
            onItemChange={this.onNoteChange.bind(this)} />
        </div>
      )
    }
    console.log(getLinkOccurrences(this.state.app.notes, "#first"))
    return (
      <div 
        className={"app " + this.state.userSettings.theme + "-theme"}
        onKeyDown={this.handleKeyDown.bind(this)}
        onKeyUp={this.handleKeyUp.bind(this)} >

        {sidebarUI()}

        <Editor
          ref={(self) => this.contentEditable = self}
          note={getNoteById(this.state.ui.currentNoteId, this.state.app.notes)}
          text={this.state.app.notes.find((note) => note.id == this.state.ui.currentNoteId).text}
          onLinkUpdate={this.updateNoteLinks.bind(this)}
          links={getUniqueLinks(this.state.app.notes)} />

        <Search
          ref={(self) => this.search = self}
          onClose={(ev) => this.contentEditable.editor.focus()} />

      </div>
    )
  }
}

function getNoteById(nId, notes) {
  return R.find(R.propEq("id", nId), notes)
}
 
function getUniqueLinks(notes) {
  const linkText = link => R.concat(link.char, link.value)
  const linkEq = (link1, link2) => R.equals(linkText(link1), linkText(link2))
  return R.pipe(
    R.map(R.prop("links")),
    R.flatten,
    R.uniqWith(linkEq),
    R.groupBy(R.prop("char"))
  )(notes)
}

function getLinkOccurrences(notes, lKey) {
  const linkText = link => R.concat(link.char, link.value)
  const linkEq = (link1, link2) => R.equals(linkText(link1), linkText(link2))
  const linkTextEq = (text, link) => R.equals(text, linkText(link))
  const ret = R.pipe(
    R.map(R.prop("links")),
    R.flatten,
    R.uniqWith(linkEq),
    R.filter(R.curry(linkTextEq)(lKey))
  )(notes)
  return ret
}

function sidebarData(uniqueLinks) {
  const categories = R.keys(uniqueLinks)
  const transformItem = item => {
    return {
      text: item.char + item.value
    }
  }
  const transform = category => { 
    return { 
      text: R.prop("text", R.find(R.propEq("char", category),  allowedLinks)),
      char: category,
      items: R.map(transformItem, uniqueLinks[category])
    } 
  }
  return R.map(transform)(categories)
}

function getStoreItem(key) {
  if (Config.target == "browser") return JSON.parse(localStorage.getItem(key))
  // add knack storage api
  if (Config.target == "knack") return {}
}

function setStoreItem(key, val) {
  if (Config.target == "browser") return localStorage.setItem(key, JSON.stringify(val)) || true
  // add knack storage api
  if (Config.target == "knack") return {}
}

export default App
