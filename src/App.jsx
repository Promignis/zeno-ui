import { h, Component } from 'preact'
import Editor from './components/editor/editor'
import Search from './components/search/search'
import "./styles/base.css"

// keycodes for opening search
let KEYCODE_CTRL = 17
let KEYCODE_SPACE = 32


// delimiters to capture for autocomplete
let DELIM_HASHTAG = "#"
let DELIM_MENTION = "@"

class App extends Component {

  constructor(props) {
    super(props)
    // Note: { id, text, title, lastModified, lastCursorPosition: { row, column } }
    // Notes: [ Note ]
    // Link: { delimiter, value, instances:[ { noteId, row, column } ] }
    // Links: [ Link ]
    // currentNoteId: String
    let initialNotes = [ 
        {
            id: "nt1",
            text: "this is a test note\n#first",
            title: "test1",
            lastModified: Date.parse("01 Jan 2000 00:00:00 GMT"),
            lastCursorPosition: {
                row: 0,
                column: 0
            }
        },
        {
            id: "nt2",
            text: "this is another test note\n#second",
            title: "",
            lastModified: Date.parse("01 Jan 2000 00:00:01 GMT"),
            lastCursorPosition: {
                row: 0,
                column: 0
            }
        }
    ]

    let initialLinks = [
        {
            delimiter: "#",
            value: "first",
            instances: [
                {
                    nodeId: "nt1",
                    row: 1,
                    column: 0
                },
                {
                    nodeId: "nt2",
                    row: 1,
                    column: 0
                },
            ]
        },
        {
            delimiter: "#",
            value: "second",
            instances: [
                {
                    nodeId: "nt2",
                    row: 2,
                    column: 0
                }
            ]
        }
    ]

    this.state = {
      firstKey: null,
      notes: initialNotes,
      links: initialLinks,
      currentNoteId: "nt1"
    }
  }

  handleKeydown(event) {
    if (event.which === KEYCODE_CTRL) {
      this.state.firstKey = event.which;
      return
    }
    if (this.state.firstKey === KEYCODE_CTRL && event.which === KEYCODE_SPACE) {
      this.search.toggleVisibility()
    }
  }

  handleKeyup(event) {
      if (event.which !== KEYCODE_CTRL) return
      this.state.firstKey = null
  }

  handleChange(text) {
      const allowedDelimiters = [ DELIM_HASHTAG, DELIM_MENTION ]
      let linkMatches = []
      allowedDelimiters.forEach((delimiter) => {
          const regex = new RegExp('\\s?' + delimiter + "(\\w+)\\s", "gi")
          let delimMatched = text.match(regex) || []
          const matchedLinks = delimMatched.map((word) => {
              return { 
                  delimiter,
                  value: word.trim().slice(1),
                  instances: [ { noteId: this.state.currentNoteId } ]
              }
          })
          linkMatches = linkMatches.concat(matchedLinks)
      })
      let newLinks = linkMatches.filter((link) => !this.state.links.find((currLink) => (currLink.delimiter == link.delimiter && currLink.value == link.value)))
      let existingLinks = linkMatches.filter((link) => this.state.links.find((currLink) => (currLink.delimiter == link.delimiter && currLink.delimiter == link.value)))

      this.setState({
          notes: this.state.notes.map((note, index) => index == this.state.currentNoteIndex ? text : note),
          links: this.state.links.map((link) => {
              const found = existingLinks.filter((currLink) => (currLink.delimiter == link.delimiter && currLink.delimiter == link.value))
              const concatedInstances = found.reduce((pre, foundLink) => pre.concat(foundLink.instances), [])
              link.instances = link.instances.concat(concatedInstances)
              return link
          }).concat(newLinks),
      })
  }

  componentDidUpdate(newState) {
      let logObj = {
          links : newState.links
      }
    //   console.warn(logObj)
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

  render() {
    return (
      <div class="app" onKeyDown={this.handleKeydown.bind(this)} onKeyUp={this.handleKeyup.bind(this)} >
        <Search ref={(self) => this.search = self} onClose={(ev) => this.contentEditable.editor.focus()} />
        <Editor ref={(self) => this.contentEditable = self} text={this.state.notes.find((note) => note.id == this.state.currentNoteId).text || ""} onChange={this.handleChange.bind(this)} links={this.state.links} />
      </div>
    )
  }
}

export default App
