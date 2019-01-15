const express = require("express");
const router = express.Router();

//include the model (aka DB connection)
const db = require('../../models/dbconnection');


router.post('/autofill', function (req, res) {
    const params = req.body; // Contains properties {email} and {password}
	console.log("autofill");
	console.log(params.serialCode);

	const query = 'SELECT * FROM Reports WHERE Serial = ?';
	const query2 = 'SELECT U.Email AS email FROM Users U INNER JOIN Patient_Info P ON U.Uid = P.Uid INNER JOIN Reports R ON P.Rid = R.Rid WHERE R.Serial = ?';
    const filter = [params.serialCode];

	 db.query(query2, filter, function(err, result){
        if (err) throw err;
        if (result && result.length >= 1) {
            console.log(result);
			console.log("Autofill successful with Rid: " + result[0].email);
		//	req.session.Autofill_Email = result[0].Rid;
			res.status(200).json({Autofill_Email: result[0].email});
        } else {
            console.log("Autofill failed, sending error");
			res.status(401).send({ error: 'serial code does not exist' });
        }
    });
});

router.post('/login', function (req, res) {
    const params = req.body; // Contains properties {email} and {password}
    const query = 'SELECT Uid, Account_Type, Language, Fname FROM Users WHERE Email = ? AND Password = ?';
    const filter = [params.email, params.password];

    db.query(query, filter, function(err, result){
        if (err) throw err;
        if (result && result.length === 1) {
            // add uid and account type to session information
            req.session.Uid = result[0].Uid;
            req.session.Account_Type = result[0].Account_Type;
            req.session.Language = result[0].Language;
            req.session.Fname = result[0].Fname;
            res.status(200).json({ Language: result[0].Language});
        } else {
            console.log("Failed login, sending error");
            res.status(401).send({ error: 'invalid login credentials' });
        }
    });
});

router.post('/register', function(req, res) {
    const params = req.body; // Contains properties {email} and {password}
    const validateQuery = 'SELECT * FROM Users WHERE Email = ?';
    const insertQuery = 'INSERT INTO Users (Account_Type, Email, Password) VALUES ("Patient", ?, ?)';
    const filter = [params.email, params.password];

    db.query(validateQuery, filter.slice(0,1), function(err, result){
        if (err) throw err;
        if(result && result.length > 0){
            console.log("Account " + params.email + "already exists.");
            return res.status(400).json({ ERROR: "Account already exists."});
        }
    });

    db.query(insertQuery, filter, function(err, result){
        if (err) throw err;
        return res.status(200).json({data: "successfully registered."});
    });
});

router.get('/logout', function (req, res) {
    if (req.session) {
        req.session.destroy();
        res.status(200).send("You are now logged out. Please close the web browser.");
    } else {
        res.status(401).send("Access denied. User is not logged in.");
    }
});

module.exports = router;
