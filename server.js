// Import express package
const express = require('express');
const fs = require('fs')
const path = require('path')
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3002;
// Initialize our app variable by setting it to the value of express()
const app = express();

// sets up express app to handle data parser, middle wear created req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static('public'));



// app.get('/', (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")));

//route to index.html 
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
  console.log(`${req.method} request made to get the notes.html`)
})
// GET request for reviews
app.get('/api/notes', (req, res) => {

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err)
    } else {
      const parsedNotes =JSON.parse(data)
      res.status(200).json(parsedNotes)
    }
  })
  // Send a message to the client
  console.log(`${req.method} request received to get notes`)

  // Log our request to the terminal
  console.info(`${req.method} request received to get notes`);
});

app.get('*', (req, res) => {
  res.sendFile(`${__dirname} /public/index.html`)
  console.log(`${request.method} request made to get the index.html`)
})

// POST request to add a note
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a notes`);

  // Destructuring assignment for the items in req.body
  const {title, text} = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };

    // Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);
        // Add a new review
        parsedNotes.push(newNote);

        // Write updated notes back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting notes');
  }
});

app.delete('/api/notes/:id', (req, res) => {
 let noteID = req.params.id;
 console.log(noteID)
 fs.readFile('./db/db.json', 'utf8', (err, data) => {
  if (err) {
    console.log(err)
  } else {
    let parsedNotes =JSON.parse(data)
    let newNotes = parsedNotes.map(note => note.note_id !== noteID?note:null).filter(filteredData => filteredData !== null)
    console.log(newNotes)
    //respond with the new notes 
    res.json(newNotes)

    fs.writeFile(
      './db/db.json',
      JSON.stringify(newNotes, null, 4),
      (writeErr) =>
        writeErr
          ? console.error(writeErr)
          : console.info('Successfully deleted notes!'),
          
    );
  }
});

  }
)



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);