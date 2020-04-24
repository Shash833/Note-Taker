const express = require("express");
const path = require("path");
const fs = require("fs")

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


//HTML ROUTES:
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//API ROUTES:
//GET - To retrieve from database: 
app.get("/api/notes", function (req, res) {
    //To read data from db.json and present in API
    const database = fs.readFileSync("db/db.json", 'utf8')
    if (database) {
        const notesArray = JSON.parse(database)
        return res.json(notesArray);
    }
});

//POST - to post new data to database:
app.post("/api/notes", function (req, res) {
    const notesArray = JSON.parse(fs.readFileSync("db/db.json", 'utf8'));
    //New note to be added to database:
    const newNote = req.body;
    //To add a unique ID to new note:
    function findUniqueID() {
        let potentialID = Math.floor((Math.random() * 10000))
        if (notesArray.length > 0) {
            for (let i = 0; i < notesArray.length; i++) {
                if (notesArray[i].id == potentialID) {
                    findUniqueID()
                }
                else (newNote.id = potentialID)
            }
        } else (newNote.id = potentialID)
    }
    findUniqueID()
    //Add new note to array of notes
    notesArray.push(newNote);
    const newDB = JSON.stringify(notesArray)
    //Write new array to database
    fs.writeFile('db/db.json', newDB, function (err) {
        if (err) throw err;
        console.log('DB updated');
    });
    res.json(newNote);
});

//DELETE: To delete chosen data from database 
app.delete("/api/notes/:id", function (req, res) {
    //chosen ID:
    const item = req.params.id;
    const notesArray = JSON.parse(fs.readFileSync("db/db.json", 'utf8'))
    //To find note with matching ID:
    for (let i = 0; i < notesArray.length; i++) {
        //note with matching ID to be removed from array
        if (item == notesArray[i].id) {
            let deleteNote = notesArray[i]
            notesArray.splice(i, 1)
            let newDB = JSON.stringify(notesArray)
            //Write new array to database
            fs.writeFile('db/db.json', newDB, function (err) {
                if (err) throw err;
                console.log('DB updated');
            });
            return res.json(deleteNote);
        }
    }
});

//local server
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

