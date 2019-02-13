const express = require("express");
const router = express.Router();

//include the model (aka DB connection)
const db = require('../../models/dbconnection');

router.get('/:PIid', function (req, res) {
    const PIid = req.params.PIid;

    if (!req.session.Uid) {
        res.status(404).send("User is not logged in");
    } else {
        // Filter by Uid to prevent Users from accessing Patient_Info rows that do not belong to them
        const query = 'SELECT PI.Fname, PI.Lname, PI.DoB, PI.SDIid FROM Patient_Info AS PI WHERE PI.Uid = ? AND PI.PIid = ?;';
        const filter = [req.session.Uid, PIid];
        db.query(query, filter, function(err, result){
            if (err) throw err;
            else{
                res.status(200).send(JSON.stringify(result));
            }
        });
    }
});

router.post('/update_progress', function (req, res) {
    const action = req.body;
    const query = "INSERT INTO Progress (PIid, Aid, progress, time) VALUES (?, ?, ?, ?);";
    const filter = [action.PIid, action.Aid, action.progress, action.timestamp];
    db.query(query, filter, function(err){
        if (err) throw err;
        else{
            res.status(200).send("Successfully updated action in DB.")
        }
    });
});

router.get('/progress/:PIid/:Aid', function(req, res) {
    const PIid = req.params.PIid;
    const Aid = req.params.Aid;
    const query = "SELECT progress, time from Progress where PIid=? and Aid=?;";
    const filter = [PIid, Aid];
    db.query(query, filter, function(err, result){
        if (err) throw err;
        else{
            res.status(200).send(JSON.stringify(result));
        }
    });
});

module.exports = router;