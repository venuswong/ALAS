const express = require("express");
const router = express.Router();
//const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken");
//const keys = require("../../config/keys");
//const passport = require("passport");

// Load Admin Model
//const Admin = require("../../models/Admin");

// @route 	GET api/test/ping
// @desc		Tests api route
// @access	Public
//router.get("/test", (req, res) => res.json({ msg: "admin works" }));
router.get("/ping", function (req, res) {
    return res.send({ express: 'Pong' });

});
// @route 	GET api/admin/test
// @desc		Tests admin route
// @access	Public
//router.get("/login", (req, res) => res.json({ msg: "admin works" }));

module.exports = router;