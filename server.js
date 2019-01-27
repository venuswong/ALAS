const express = require('express');
const session = require('express-session');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//const http = require('http');
//const enforce = require('express-sslify');
const secure = require('ssl-express-www');
const path = require('path');

const test = require("./routes/api/test");

const app = express();

if (process.env.NODE_ENV === "production") {
    app.use(secure);
}
app.use(cookieParser());
app.use(session({
    // sid is automatically generated
    secret: 'supersecret'
}));

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.set('port', process.env.PORT || 3001);

const login = require("./routes/api/login");
const user = require("./routes/api/user");
const patient = require("./routes/api/patient");
const admin = require("./routes/api/admin");
const faq = require("./routes/api/faq");
const clinician = require("./routes/api/clinician");

// Use Routes
app.use("/api/login", login);
app.use("/api/user", user);
app.use("/api/patient", patient);
app.use("/api/admin", admin);
app.use("/api/faq", faq);
app.use("/api/clinician", clinician);


// Server static assets if in production
if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("client/build"));
    //app.get("*", (req, res) => {
    //    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    //});
}
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

app.listen(app.get('port'), () => {
    console.log('Server is running on PORT:', app.get('port'));
});