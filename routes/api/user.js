const express = require("express");
const router = express.Router();

//include the model (aka DB connection)
const db = require('../../models/dbconnection');

// Send a status (200 or 404) depending on if the user is logged in
router.get('/logged-in', function (req, res) {
    if (req.session.Uid) {
        return res.status(200).send("User is logged in");
    } else {
        return res.status(404).send("User is NOT logged in");
    }
});

// Send a json containing user account type
router.get('/account-type', function (req, res) {
    if (req.session.Uid) {
        return res.status(200).json({ Account_Type: req.session.Account_Type});
    } else {
        return res.status(404).send("User is NOT logged in");
    }
});

// Retrieve array of actions from Action table corresponding to user
router.get('/getActions', function (req, res) {
    if (!req.session.Uid) {
        return res.status(404).send("User is not logged in");
    } else {
        const query = 'SELECT A.Aid, PI.SDIid, A.PIid, A.ActionType, A.IsCompleted, A.CompletedDate, A.IsStarted, A.Note' +
            ' FROM Actions AS A, Patient_Info AS PI WHERE A.PIid = PI.PIid AND PI.Uid = ?;';
        const filter = [req.session.Uid];
        db.query(query, filter, function(err, result){
            if (err) {
                return res.sendStatus(500);
            } else {
                return res.status(200).send(JSON.stringify(result));
            }
        });
    }
});

// Retrieve array of materials corresponding to child
router.get('/getMaterials', function (req, res) {
    if (!req.session.Uid) {
        return res.status(404).send("User is not logged in");
    } else {
        const query = 'SELECT * FROM Materials';
        db.query(query, function(err, result) {
            if (err) {
                return res.sendStatus(500);
            } else {
                return res.status(200).send(JSON.stringify(result));
            }
        });
    }
});

router.post('/updateAction', function (req, res) {
    const action = req.body;
    if (!req.session.Uid) {
        return res.status(404).send("User is not logged in");
    } else {
        const query = 'UPDATE Actions SET IsCompleted = ? , CompletedDate = ?, IsStarted = ?, Note = ? WHERE Aid = ?';
        const filter = [action.IsCompleted, action.CompletedDate, action.IsStarted, action.Note, action.Aid];
        db.query(query, filter, function(err){
            if (err) {
                return res.sendStatus(500);
            } else {
                return res.status(200).send("Successfully updated action in DB.")
            }
        });
    }
});

router.post('/updateActionNote', function (req, res) {
    const action = req.body;
    if (!req.session.Uid) {
        return res.status(404).send("User is not logged in");
    } else {
        const query = 'UPDATE Actions SET Note = ? WHERE Aid = ?';
        const filter = [action.Note, action.Aid];
        db.query(query, filter, function(err){
            if (err) {
                return res.sendStatus(500);
            } else {
                return res.status(200).send("Successfully updated action in DB.")
            }
        });
    }
});

// Retrieve array of patients from Patient_Info table corresponding to user
router.get('/getPatientInfo', function (req, res) {
    if (!req.session.Uid) {
        return res.status(404).send("User is not logged in");
    } else {
        const query = 'SELECT * FROM Patient_Info WHERE Uid = ?';
        const filter = [req.session.Uid];
        db.query(query, filter, function(err, result){
            if (err) {
                return res.sendStatus(500);
            }
            else{
                return res.status(200).send(JSON.stringify(result));
            }
        });
    }
});

router.get('/getSchoolDistrict/:SDid', function(req, res) {
    const districtId = req.params.SDid;
    if (!req.session.Uid) {
        return res.status(404).send("User is not logged in");
    } else {
        const query = 'SELECT * FROM School_District_Info WHERE SDIid = ?';
        const filter = [districtId];
        db.query(query, filter, function (err, result) {
            if (err) {
                return res.sendStatus(500);
            } else {
                return res.status(200).send(JSON.stringify(result));
            }
        });
    }
});

// Retrieve FName from User table by session Uid
router.get('/fname', function (req, res) {
    if (req.session.Uid && req.session.Fname) {
        return res.status(200).json({ Fname: req.session.Fname });
    } else {
        return res.status(404).send("User not logged in");
    }
});

// Retrieve FName from User table by session Uid
router.get('/lname', function (req, res) {
    if (req.session.Uid && req.session.Lname) {
        return res.status(200).json({ Lname: req.session.Lname });
    } else {
        return res.status(404).send("User not logged in");
    }
});

// Retrieve Account_Type, Fname, Lname, Email, Password, Picture, from User table by session Uid
router.get('/profile', function (req, res) {
    if (req.session.Uid) {
        const query = 'SELECT Account_Type, Fname, Lname, Email, Password, Picture, Language FROM Users WHERE Uid = ?';
        const filter = [req.session.Uid];
        db.query(query, filter, function(err, result){
            if (err) {
                return res.sendStatus(500);
            }   
            if (result && result.length === 1) {
                return res.json(200, { Account_Type: result[0].Account_Type, Fname: result[0].Fname, Lname: result[0].Lname, Email: result[0].Email, Password: result[0].Password, Picture: result[0].Picture, Language: result[0].Language});
            } else {
                return res.status(404).send("User not logged in");
            }
        });
    } else {
        return res.status(404).send("User not logged in");
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
        const query = 'SELECT I.IName FROM Insurance AS I, Patient_Info AS PI WHERE I.Iid = PI.Iid AND PI.Uid = ?;';
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

router.get('/childrenprovider', function (req, res) {
    if (req.session.Uid) {
        const query = "SELECT DISTINCT Pr.Name, Pr.Prov_ID, Loc.Phone, Loc.Address_Line1, Loc.City, Loc.State, Loc.Zip\n" +
            "FROM ABA_Providers AS Pr, Users AS U, Provider_Locations AS Loc, Patient_Info AS PI\n" +
            "WHERE (Loc.Loc_ID = Pr.Address)\n" +
            "AND (INSTR(Pr.Ins_Id, PI.Iid) > 0)\n" +
            "AND (U.Uid = ?);";
        const filter = [req.session.Uid];
        db.query(query, filter, function(err, result){
            if (err) throw err;
            if (result && result.length >= 0) {
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
                'SET Patient_Info.Iid =(SELECT Iid FROM Insurance WHERE Insurance.IName = ?) ' +
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

router.post('/updatechildschool', function (req, res) {

    const params = req.body;

    const PIid = params.Info.PIid;
    const Uid =  params.Info.Uid
    const schoolID = params.schoolID;

    if (!req.session.Uid) {

        res.status(404).send("User is not logged in");
    } else {
        if (req.session.Uid !== Uid) {
            res.status(404).send("User currently logged in does not correspond to child");
        } else {
            const query = 'UPDATE Patient_Info SET Patient_Info.SDIid = ? WHERE Patient_Info.PIid = ?;';
            const filter = [schoolID, PIid];
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
        const query = 'SELECT * FROM School_District_Info AS SDI, Patient_Info AS PI WHERE SDI.SDIid = PI.SDIid AND PI.Uid = ?;';
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

router.get('/SD_in_zip/:P_ID', function(req, res) {
    const PatientID = req.params.P_ID;
    if (!req.session.Uid) {
        return res.status(404).send("User is not logged in");
    } else {
        const query = 'select Dname, SD.SDIid from School_District_Info AS SD, (Select * From ZipCode AS Z, Patient_Info AS PI WHERE Z.ZipID = PI.PI_Zip AND PI.PIid = ?) as Zip where Zip.District1 = SD.SDIid OR  Zip.District2 = SD.SDIid or  Zip.District3 = SD.SDIid or  Zip.District4 = SD.SDIid or  Zip.District5 = SD.SDIid or  Zip.District6 = SD.SDIid or  Zip.District7 = SD.SDIid or Zip.District8 = SD.SDIid;';
        const filter = [PatientID];
        db.query(query, filter, function (err, result) {
            if (err) {
                return res.sendStatus(500);
            } else {
                return res.status(200).send(JSON.stringify(result));
            }
        });
    }
});

router.get('/SDiID_to_Phone/:SDI_id', function(req, res) {
    const SchoolID = req.params.SDI_id;
    if (!req.session.Uid) {
        return res.status(404).send("User is not logged in");
    } else {
        const query = 'select Phone From School_District_Info where SDIid = ?;';
        const filter = [SchoolID];
        db.query(query, filter, function (err, result) {
            if (err) {
                return res.sendStatus(500);
            } else {
                return res.status(200).send(JSON.stringify(result));
            }
        });
    }
});

router.get('zip_to_SD', function (req, res) {
    if (req.session.Uid) {
        const query = 'SELECT Dname FROM School_District_Info AS SD WHERE SD.SD_Zip = ?;';
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
