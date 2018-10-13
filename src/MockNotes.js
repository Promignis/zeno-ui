export default [
  {
    id: "nt1",
    text: "this is the first note\n#first @test\n",
    title: "test1",
    lastModified: (new Date("01 Jan 2000 00:00:00 GMT")).toUTCString(),
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
    lastModified: (new Date("01 Jan 2000 00:00:01 GMT")).toUTCString(),
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
    id: "nt3",
    text: "One more test note\nThis one has no links\n# first",
    title: "",
    lastModified: (new Date("01 Jan 2000 00:00:01 GMT")).toUTCString(),
    lastCursorPosition: {
      row: 1,
      column: 4
    },
    links: [
    ]
  },
  {
    id: "nt4",
    text: "Testing them notes\n@first\n#third",
    title: "",
    lastModified: (new Date("01 Jan 2000 00:00:01 GMT")).toUTCString(),
    lastCursorPosition: {
      row: 1,
      column: 4
    },
    links: [
      {
        char: "@",
        value: "first",
        position: {
          row: 1,
          column: 0
        }
      },
      {
        char: "#",
        value: "third",
        position: {
          row: 2,
          column: 0
        }
      }
    ]
  },
]
