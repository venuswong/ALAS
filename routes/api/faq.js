const express = require("express");
const router = express.Router();

//include the model (aka DB connection)
const db = require('../../models/dbconnection');

router.get('/get-questions', function (req, res) {
    const query = 'SELECT * FROM Questions WHERE Answer IS NOT NULL AND IsFAQ=1 ORDER BY Frequency DESC;';
    db.query(query, function(err, result){
        if (err) throw err;
        else{
            res.status(200).send(JSON.stringify(result));
        }
    });
});

router.post('/update-frequency', function (req, res) {
    const params = req.body;
    const query = 'UPDATE Questions SET Frequency = Frequency + 1 WHERE Question = ?;';
    const filter = [params.questionTitle];

    db.query(query, filter, function(err, result){
        if (err) throw err;
        else{
            res.status(200).send(JSON.stringify(result));
        }
    });
});

router.post('/new-question', function (req, res) {

    if (!req.session.Uid) {
            res.status(404).send("Access denied. User is not logged in");
    } else {
        const params = req.body;
        const Uid = req.session.Uid;
        const query = 'INSERT INTO Questions (Question, Asker) VALUES (?, ?);';
        const filter = [params.question_value, Uid];

        db.query(query, filter, function(err, result){
            if (err) throw err;
            else{
                res.status(200).send(JSON.stringify(result));
            }
        });
    }

});

router.get('/unanswered_questions', function (req, res) {
    const query = 'SELECT Questions.QuestionID, Questions.Question, Users.Fname, Users.Lname, Users.Email from Questions join Users on Users.Uid=Questions.Asker WHERE Answer IS NULL;'
    db.query(query, function(err, result){
        if (err) throw err;
        else{
            res.status(200).send(JSON.stringify(result));
        }
    });
});

module.exports = router;