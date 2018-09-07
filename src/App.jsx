import { h, Component } from 'preact'
import Editor from 'Components/Editor'
import Search from 'Components/Search'
import Sidebar from 'Components/Sidebar'
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
    // currentLinkId: String
    // userSettings: { 
    //      theme: String
    // }
    this.state = {
      firstKey: null,
      notes: this.getAllNotes(),
      links: this.getAllLinks(),
      currentNoteId: "nt1",
      currentLinkId: "#first",
      userSettings: this.getUserSettings(),
      uiState: {
          sidebar: true
      }
    }
  }

  getAllNotes() {
    return [ 
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
            text: "this is another test note\n#first\n#second",
            title: "",
            lastModified: Date.parse("01 Jan 2000 00:00:01 GMT"),
            lastCursorPosition: {
                row: 0,
                column: 0
            }
        }
    ]
  }

  getAllLinks() {
    return [
        {
            delimiter: "#",
            value: "first",
            instances: [
                {
                    noteId: "nt1",
                    row: 1,
                    column: 0
                },
                {
                    noteId: "nt2",
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
                    noteId: "nt2",
                    row: 2,
                    column: 0
                }
            ]
        }
    ]
  }

  getUserSettings() {
    return JSON.parse(localStorage.getItem("userSettings"))
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
          let matchedLinks = []
          delimMatched.forEach((word) => {
              const linkExists = matchedLinks.find((link) =>
                link.value == word
              )
              if (!linkExists) {
                let newLink = { 
                    delimiter,
                    value: word.trim().slice(1),
                    instances: [{ noteId: this.state.currentNoteId }]
                };
                linkMatches = linkMatches.concat(newLink)
              } else {
                linkMatches = linkMatches.concat(matchedLinks)
              }
          })
      })
      let newLinks = linkMatches.filter((link) =>
        !this.state.links.find((currLink) =>
            (currLink.delimiter == link.delimiter &&
                currLink.value == link.value)))
      let existingLinks = linkMatches.filter((link) =>
        this.state.links.find((currLink) =>
            (currLink.delimiter == link.delimiter &&
            currLink.value == link.value)))
    
      this.setState({
          notes: this.state.notes.map((note) =>
            note.id == this.state.currentNodeId ? text : note),
          links: this.state.links.map((link) => {
              const found = existingLinks.find((currLink) =>
                (currLink.delimiter == link.delimiter &&
                    currLink.value == link.value))
              if (!found) return link
              let newInstances = []
              console.log(found)
              found.instances.forEach((inst) => {
                  const foundInstance = link.instances.find((currInst) =>
                    currInst.noteId === inst.noteId &&
                    currInst.row === inst.row &&
                    currInst.column === currInst.column
                  )
                  if (foundInstance) return
                  newInstances = newInstances.concat(inst)
              })
              link.instances = link.instances.concat(newInstances)
              return link
          }).concat(newLinks)
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
    const list = this.state.links.map((item) => {
        return {
            text: item.delimiter + item.value
        }
    })
    const currLinkInstances = this.state.links.find((item) => item.delimiter + item.value == this.state.currentLinkId).instances.map((item) => {
        return {
            text: item.noteId
        }
    })
    const sidebarUI = () => {
        if (!this.state.uiState.sidebar) return <div></div>;
        return (
            <div className="sidebar-container">
                <Sidebar
                    list={list}
                    for="links"
                    onItemChange={this.onLinkChange.bind(this)} />

                <Sidebar
                    list={currLinkInstances}
                    for="instances"
                    onItemChange={this.onNoteChange.bind(this)} />
            </div>
        )
    }
    return (
      <div 
        className={"app " + this.state.userSettings.theme + "-theme"}
        onKeyDown={this.handleKeydown.bind(this)}
        onKeyUp={this.handleKeyup.bind(this)} >

        {sidebarUI()}

        <Editor
            ref={(self) => this.contentEditable = self}
            text={this.state.notes.find((note) => note.id == this.state.currentNoteId).text}
            onChange={this.handleChange.bind(this)}
            links={this.state.links} />

        <Search
            ref={(self) => this.search = self}
            onClose={(ev) => this.contentEditable.editor.focus()} />

      </div>
    )
  }
}

export default App