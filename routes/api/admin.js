const express = require("express");
const router = express.Router();

//include the model (aka DB connection)
const db = require('../../models/dbconnection');

// Get info on all users, accessible by admins only
router.get('/users', function (req, res) {
    if (!req.session.Uid) {
        res.status(404).send("Access denied. User is not logged in");
    } else if (req.session.Account_Type !== 'Admin') {
        res.status(404).send("Access denied. User is not an admin.");
    } else {
        const query = 'SELECT * FROM Users';
        db.query(query, function(err, result){
            if (err) throw err;
            res.status(200).send(JSON.stringify(result));
        });
    }
});

// Delete selected user
router.post('/delete', function (req, res) {
    if (!req.session.Uid) {
        res.status(404).send("Access denied. User is not logged in");
    } else if (req.session.Account_Type !== 'Admin') {
        res.status(404).send("Access denied. User is not an admin.");
    } else {
        const params = req.body; // Contains properties {email} and {password}
        const filter = [params.Uid];
        const query = 'DELETE FROM Users WHERE Uid = ?';

        db.query(query, filter, function(err){
            if (err) throw err;
            res.status(200).send("Successfully deleted");
        });
    }
});

// Add user
router.post('/add', function (req, res) {
    if (!req.session.Uid) {
        res.status(404).send("Access denied. User is not logged in");
    } else if (req.session.Account_Type !== 'Admin') {
        res.status(404).send("Access denied. User is not an admin.");
    } else {
        const params = req.body; // Contains properties {email} and {password}
        const validateQuery = 'SELECT * FROM Users WHERE Email = ?';
        const insertQuery = 'Insert Into Users (Account_Type, Fname, Lname, Email, Password) VALUES (?, ?, ?, ?, ?);';
        const filter = [params.accountType,  params.firstName, params.lastName, params.email, params.password];

        db.query(validateQuery, filter.slice(1,2), function(err, result){
            if (err) {
                throw err;
            }
            if(result && result.length > 0){
                console.log("Account " + params.email + "already exists.");
                return res.status(400).json({ ERROR: "Account already exists."});
            }
        });

        db.query(insertQuery, filter, function(err){
            if (err){
                throw err;
            }
            return res.status(200).json({data: "successfully registered."});
        });
    }
});

router.get('/users/:Uid', function (req, res) {
    const Uid = req.params.Uid;
    if (req.session.Uid === Uid || req.session.Account_Type === 'Admin') {
        const query = 'SELECT * FROM Users WHERE Uid = ?';
        const filter = [Uid];
        db.query(query, filter, function(err, result){
            if (err) throw err;
            if (result && result.length === 1) {
                res.status(200).send(result[0]);
            } else {
                res.status(404).send("User with Uid '" + Uid + "' not found");
            }
        });
    } else {
        res.status(404).send("Access denied");
    }
});

module.exports = router;