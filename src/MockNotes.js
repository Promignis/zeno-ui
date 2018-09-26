export default [ 
  {
    id: "nt1",
    text: "this is a test note\n#first @test\n",
    title: "test1",
    lastModified: Date.parse("01 Jan 2000 00:00:00 GMT"),
    lastCursorPosition: {
      row: 2,
      column: 0
    },
    links: [
      {
        char: "#",
        value: "first",
        position: {
          row: 1,
          column: 0
        }
      },
      {
        char: "@",
        value: "test",
        position: {
          row: 1,
          column: 0
        }
      }
    ]
  },
  {
    id: "nt2",
    text: "this is another test note\n#first\n#second",
    title: "",
    lastModified: Date.parse("01 Jan 2000 00:00:01 GMT"),
    lastCursorPosition: {
      row: 1,
      column: 4
    },
    links: [
      {
        char: "#",
        value: "first",
        position: {
          row: 1,
          column: 0
        }
      },
      {
        char: "#",
        value: "second",
        position: {
          row: 2,
          column: 0
        }
      }
    ]
  },
  {
    id: "nt2",
    text: "this is another test note\n# first",
    title: "",
    lastModified: Date.parse("01 Jan 2001 00:00:01 GMT"),
    lastCursorPosition: {
      row: 1,
      column: 4
    },
    links: [
    ]
  }
]
