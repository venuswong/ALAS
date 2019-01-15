const express = require("express");
const router = express.Router();

//include the model (aka DB connection)
const db = require('../../models/dbconnection');

// Send a status (200 or 404) depending on if the user is logged in
router.get('/logged-in', function (req, res) {
    if (req.session.Uid) {
        res.status(200).send("User is logged in");
    } else {
        res.status(404).send("User is NOT logged in");
    }
});

// Send a json containing user account type
router.get('/account-type', function (req, res) {
    if (req.session.Uid) {
        return res.status(200).json({ Account_Type: req.session.Account_Type});
    } else {
        res.status(404).send("User is NOT logged in");
    }
});

// Retrieve array of actions from Action table corresponding to user
router.get('/getActions', function (req, res) {
    if (!req.session.Uid) {
        res.status(404).send("User is not logged in");
    } else {
        const query = 'SELECT A.Aid, A.PIid, A.ActionType, A.IsCompleted, A.CompletedDate, A.IsStarted FROM Actions AS A, Patient_Info AS PI WHERE A.PIid = PI.PIid AND PI.Uid = ?;';
        const filter = [req.session.Uid];
        db.query(query, filter, function(err, result){
            if (err) throw err;
            else{
                res.status(200).send(JSON.stringify(result));
            }
        });
    }
});

router.post('/updateAction', function (req, res) {
    const action = req.body;
    if (!req.session.Uid) {
        res.status(404).send("User is not logged in");
    } else {
        const query = 'UPDATE Actions SET IsCompleted = ? , CompletedDate = ?, IsStarted = ? WHERE Aid = ?';
        const filter = [action.IsCompleted, action.CompletedDate, action.IsStarted, action.Aid];
        db.query(query, filter, function(err){
            if (err) throw err;
            else{
                res.status(200).send("Successfully updated action in DB.")
            }
        });
    }
});

// Retrieve array of patients from Patient_Info table corresponding to user
router.get('/getPatientInfo', function (req, res) {
    if (!req.session.Uid) {
        res.status(404).send("User is not logged in");
    } else {
        const query = 'SELECT * FROM Patient_Info WHERE Uid = ?';
        const filter = [req.session.Uid];
        db.query(query, filter, function(err, result){
            if (err) {
                throw err;
            }
            else{
                res.status(200).send(JSON.stringify(result));
            }
        });
    }
});

// Retrieve FName from User table by session Uid
router.get('/fname', function (req, res) {
    if (req.session.Uid && req.session.Fname) {
        res.status(200).json({ Fname: req.session.Fname });
    } else {
        res.status(404).send("User not logged in");
    }
});

// Retrieve FName from User table by session Uid
router.get('/lname', function (req, res) {
    if (req.session.Uid && req.session.Lname) {
        res.status(200).json({ Lname: req.session.Lname });
    } else {
        res.status(404).send("User not logged in");
    }
});

// Retrieve Account_Type, Fname, Lname, Email, Password, Picture, from User table by session Uid
router.get('/profile', function (req, res) {
    if (req.session.Uid) {
        const query = 'SELECT Account_Type, Fname, Lname, Email, Password, Picture, Language FROM Users WHERE Uid = ?';
        const filter = [req.session.Uid];
        db.query(query, filter, function(err, result){
            if (err) throw err;
            if (result && result.length === 1) {
                return res.json(200, { Account_Type: result[0].Account_Type, Fname: result[0].Fname, Lname: result[0].Lname, Email: result[0].Email, Password: result[0].Password, Picture: result[0].Picture, Language: result[0].Language});
            } else {
                res.status(404).send("User not logged in");
            }
        });
    } else {
        res.status(404).send("User not logged in");
    }
});

// Retrieve all child info from Patient_Info table by session Uid
router.get('/children', function (req, res) {
    if (req.session.Uid) {
        const query = 'SELECT * FROM Patient_Info WHERE Uid = ?';
        const filter = [req.session.Uid];
        db.query(query, filter, function(err, result){
            if (err) throw err;
            if (result && result.length >= 1) {
                //console.log(result);
                return res.status(200).json({result});
            } else {
                res.status(404).send("User not logged in");
            }
        });
    } else {
        res.status(404).send("User not logged in");
    }
});

router.post('/change-language', function (req, res) {
    if (req.session.Uid) {
        const params = req.body;
        const query = 'UPDATE Users SET Language=? WHERE Uid=?;';
        const filter = [params.language, req.session.Uid];

        db.query(query, filter, function (err, result) {
            if (err) throw err;
            else {
                res.status(200).send(JSON.stringify(result));
            }
        });
    } else {
        res.status(404).send("User not logged in");
    }
});


// Retrieve child insurance info from Insurance table by joining session Uid and Patient_Info.Iid on Insurance.Iid
router.get('/childreninsurance', function (req, res) {
    if (req.session.Uid) {
        const query = 'SELECT I.Name FROM Insurance AS I, Patient_Info AS PI WHERE I.Iid = PI.Iid AND PI.Uid = ?;';
        const filter = [req.session.Uid];
        db.query(query, filter, function(err, result){
            if (err) throw err;
            if (result && result.length >= 1) {
                return res.status(200).json({result});
            } else {
                res.status(404).send("User not logged in");
            }
        });
    } else {
        res.status(404).send("User not logged in");
    }
});

router.post('/updatechildinsurance', function (req, res) {
    const params = req.body;
    const information = params.information;
    const insurance = params.insurance;
    const Uid = information.Uid;
    const PIid = information.PIid;
    const insuranceName = insurance.Name;
    if (!req.session.Uid) {
        res.status(404).send("User is not logged in");
    } else {
        if (req.session.Uid !== Uid) {
            res.status(404).send("User currently logged in does not correspond to child");
        } else {
            const query = 'UPDATE Patient_Info ' +
                'SET Patient_Info.Iid =(SELECT Iid FROM Insurance WHERE Insurance.Name = ?) ' +
                'WHERE Patient_Info.PIid = ?';
            const filter = [insuranceName, PIid];
            db.query(query, filter, function (err, result) {
                if (err) throw err;
                else {
                    res.status(200).send(JSON.stringify(result));
                }
            });
        }
    }
});

router.get('/childrenschool', function (req, res) {
    if (req.session.Uid) {
        const query = 'SELECT Dname, Phone, Email FROM School_District_Info AS SDI, Patient_Info AS PI WHERE SDI.SDIid = PI.SDIid AND PI.Uid = ?;';
        const filter = [req.session.Uid];
        db.query(query, filter, function(err, result){
            if (err) throw err;
            if (result && result.length >= 1) {
                return res.status(200).json({result});
            } else {
                res.status(404).send("User not logged in");
            }
        });
    } else {
        res.status(404).send("User not logged in");
    }
});

module.exports = router;