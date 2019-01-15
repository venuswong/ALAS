const express = require("express");
const router = express.Router();

//include the model (aka DB connection)
const db = require('../../models/dbconnection');

/* ------------------ Used by ClinicianView ---------------------- */
// Get all patients, only usable by admin and clinician
router.get('/getPatients', function (req, res) {
    if (!req.session.Uid) {
        res.status(404).send("User is not logged in");
    } else {
        if (req.session.Account_Type !== 'Admin' && req.session.Account_Type !== 'Clinician') {
            res.status(404).send("User is not an admin or clinician");
        } else {
            // TODO: Filter by Uid to prevent Users from accessing Patient_Info rows that do not belong to them
            const query = 'SELECT * FROM Patient_Info';
            db.query(query, function(err, result){
                if (err) throw err;
                else{
                    res.status(200).send(JSON.stringify(result));
                }
            });
        }
    }
});

// Get all actions for a patient by PIid
router.get('/:PIid/getActions', function (req, res) {
    const PIid = req.params.PIid;
    if (!req.session.Uid) {
        res.status(404).send("User is not logged in");
    } else {
        if (req.session.Account_Type !== 'Admin' && req.session.Account_Type !== 'Clinician') {
            res.status(404).send("User is not an admin or clinician");
        } else {
            // Filter by Uid to prevent Users from accessing Patient_Info rows that do not belong to them
            const query = 'SELECT * FROM Actions WHERE PIid = ?';
            const filter = [PIid];
            db.query(query, filter, function(err, result){
                if (err) throw err;
                else{
                    res.status(200).send(JSON.stringify(result));
                }
            });
        }
    }
});

// get parent's email association with child with PIid
router.get('/:PIid/getEmail', function (req, res) {
    const PIid = req.params.PIid;
    if (!req.session.Uid) {
        res.status(404).send("User is not logged in");
    } else {
        if (req.session.Account_Type !== 'Admin' && req.session.Account_Type !== 'Clinician') {
            res.status(404).send("User is not an admin or clinician");
        } else {
            // Filter by Uid to prevent Users from accessing Patient_Info rows that do not belong to them
            const query = 'SELECT U.Email FROM Users AS U, Patient_Info AS PI WHERE '
                            + 'PI.PIid = ? AND U.Uid = PI.Uid';
            const filter = [PIid];
            db.query(query, filter, function(err, result){
                if (err) throw err;
                else{
                    res.status(200).send(JSON.stringify(result));
                }
            });
        }
    }
});

router.post('/updateQuestion', function (req, res) {
    const params = req.body;
    const QuestionID = params.QuestionID;
    const Answer = params.Answer;
    const IsFAQ = params.IsFAQ;
    const Answerer = req.session.Uid;
    if (!req.session.Uid) {
        res.status(404).send("User is not logged in");
    } else {
        if (req.session.Account_Type !== 'Clinician') {
            res.status(404).send("User is not a clinician");
        } else {
            const query = 'UPDATE Questions ' +
                            'SET Answer = ?, Answerer = ?, IsFAQ = ? ' +
                            'WHERE QuestionID = ?;';
            const filter = [Answer, Answerer, IsFAQ, QuestionID];
            db.query(query, filter, function (err, result) {
                if (err) throw err;
                else {
                    res.status(200).send(JSON.stringify(result));
                }
            });
        }
    }
});

/* --------------------------------------------------- */

module.exports = router;
