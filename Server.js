const Database = require('better-sqlite3');
const db = new Database('resources/Fruit.db');

const express = require('express')
const app = express()

const formProcessor = require('express-formidable');
app.use(formProcessor());

const fruit = express.Router();

fruit.get('/list', function (req, res) {
    try {
        let ps = db.prepare("SELECT Id AS 'id', Name AS 'name', Image AS 'image', Colour AS 'colour', Size AS 'size' FROM Fruits");
        let results = ps.all();
        res.json(results);
    } catch (error) {
        console.log("ERROR: " + error);
        res.json({error: 'Unable to list fruits'});
    }
})

fruit.get('/get/:id', function (req, res) {
    try {
        let ps = db.prepare("SELECT Id AS 'id', Name AS 'name', Image AS 'image', Colour AS 'colour', Size AS 'size' FROM Fruits WHERE Id = ?");
        let result = ps.get(req.params.id);
        res.json(result);
    } catch (error) {
        console.log("ERROR: " + error);
        res.json({error: 'Unable to get requested fruit'});
    }
})

fruit.post('/new', function (req, res) {
    try {
        let ps = db.prepare('INSERT INTO Fruits (Name, Image, Colour, Size) VALUES (?, ?, ?, ?)');
        let result = ps.run(req.fields['name'], req.fields['image'], req.fields['colour'], req.fields['size']);
        if (result.changes === 1) {
            res.json({status: 'OK'});
        } else {
            throw 'Unable to create new fruit';
        }
    } catch (error) {
        console.log("ERROR: " + error);
        res.json({error});
    }
})

fruit.post('/update', function (req, res) {
    try {
        let ps = db.prepare('UPDATE Fruits SET Name = ?, Image = ?, Colour = ?, Size = ? WHERE Id = ?');
        let result = ps.run(req.fields['name'], req.fields['image'], req.fields['colour'], req.fields['size'], req.fields['id']);
        if (result.changes === 1) {
            res.json({status: 'OK'});
        } else {
            throw 'Unable to update fruit';
        }
    } catch (error) {
        console.log("ERROR: " + error);
        res.json({error});
    }
})

fruit.post('/delete', function (req, res) {
    try {
        let ps = db.prepare('DELETE FROM Fruits WHERE Id = ?');
        let result = ps.run(req.fields['id']);
        if (result.changes === 1) {
            res.json({status: 'OK'});
        } else {
            throw 'Unable to delete fruit';
        }
    } catch (error) {
        console.log("ERROR: " + error);
        res.json({error});
    }
})

app.use('/fruit',
    (req, res, next) => {
        console.log("Fruit API: /fruit" + req.path);
        next();
    },
    fruit
);

app.use('/client',
    (req, res, next) => {
        console.log("Serving static content: " + req.path);
        next();
    },
    express.static('resources/client')
);

const port = 8081;

app.listen(port, function(){
  console.log('Server is running, port ', port);
});
