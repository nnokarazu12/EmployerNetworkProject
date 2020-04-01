const Auth = require('./Auth/AuthController.js');
const Users = require('./Data/ClientData.js');
const Students = require('./Data/StudentData.js');
const Middleware = require('./Auth/AuthMiddleware.js');
const Schools = require('./Data/SchoolData.js');
const ApiHelper = require('./ApiHelper.js');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const http = require('http');
const https = require('https');
const port = 3000;

app.listen(port, () => {
    console.log(`WebAPI app listening on port ${port}!`);
    Users.ReadData();
    Schools.ReadData();
});
app.use(bodyParser.json());
app.use(cors());

//User entered create new account
app.post('/api/v1/Auth/CreateAccount', [Middleware.hasAuthValidFields, Users.NewUser]);
//This function will login the User and generate new oath2 token
app.get('/api/v1/Auth/Login', [Middleware.hasAuthValidFields, Auth.Login]);
//This function will login the User and generate new oath2 token
app.post('/api/v1/Auth/Login', [Middleware.hasAuthValidFields, Auth.Login]);
//This call will return the User structure containing all account info
app.get('/api/v1/data/AccountData', [Middleware.hasAuthToken, Middleware.hasAuthValidToken,]);
//This call will return the User structure containing all account info
app.post('/api/v1/data/AccountData', [Middleware.hasAuthToken, Middleware.hasAuthValidToken,]);
//This function Will receive the call to check token
app.get('/api/v1/Auth/TestToken', [Middleware.hasAuthToken, Middleware.hasAuthValidToken, function (req, res) {
    res.status(200).send({result: true, response: "Token Valid"});
}]);
//This function is for updating the users profile with an api key
app.post('/api/v1/data/ProfileData', [Middleware.hasAuthToken, Middleware.hasAuthValidToken, Users.UpdateUserProfile]);
//This function Will receive the call to check token and will return the users profile
app.get('/api/v1/data/ProfileData', [Middleware.hasAuthToken, Middleware.hasAuthValidToken, Users.ViewUserProfile]);

///api/v2/data/Profile:ID GET=> returns Profile Structure POST=> Adds/modify profile structure
///api/v2/data/Colleagues:ID GET=> Returns a list of Colleagues for that ID POST=> Adds new Colleague to User by Token

//Handle the request coming in and parse for get and POST add values to body and return account V2
app.get('/api/v2/Auth/Login', [Middleware.ParseValidFields, Middleware.hasAuthV2ValidFields, Auth.LoginV2]);
app.post('/api/v2/Auth/Login', [Middleware.ParseValidFields, Middleware.hasAuthV2ValidFields, Auth.LoginV2]);
//Create new user account with Email as username and password
app.get('/api/v2/Auth/CreateAccount', [Middleware.ParseValidFields, Middleware.hasAuthV2ValidFields, Users.NewUserV2]);
//Create new user account with Email as username and password
app.post('/api/v2/Auth/CreateAccount', [Middleware.ParseValidFields, Middleware.hasAuthV2ValidFields, Users.NewUserV2]);
//Test the token the user entered to see if it is valid
app.get('/api/v2/Auth/TestToken', [Middleware.hasAuthToken, Middleware.hasAuthValidToken, function (req, res) {
    res.status(200).send({result: true, response: "Token Valid"});
}]);

//Api/V2/Data Path Redirect
///api/v2/data/Profile:ID GET=> returns Profile Structure POST=> Parse the fields for information and parse into correct fields for adding to profile
app.post('/api/v2/data/Profile', [Middleware.hasAuthToken, Middleware.hasAuthValidToken, Users.POST_Profile]);

app.get('/api/v2/data/Profile', [Middleware.ParseValidFields, Middleware.hasAuthToken, Middleware.hasAuthValidToken, function (req, res) {
    return res.status(200).send(Users.GetUserByToken(req.query.token).ProfileData);
}]);
//TODO add profileGet Without ID For Owner
///api/v2/data/Profile:ID GET=> returns Profile Structure POST=> Adds/modify profile structure
app.get('/api/v2/data/Profile/:ID', [Middleware.ParseValidFields, Middleware.hasAuthToken, Middleware.hasAuthValidToken, Users.ViewProfileV2]);
//Parse Valid Data Into Body => verify Token => Get data by UUID => Return ProfileData
///api/v2/data/Colleagues:ID GET=> Returns a list of Colleagues for that ID POST=> Adds new Colleague to User by Token
app.get('/api/v2/data/Colleagues/:ID', [Middleware.hasAuthToken, Middleware.hasAuthValidToken, Users.ViewUserProfile]);
//TODO Add api call for adding thw school and degree to thew users profile
///api/v2/data/Degree GET's/Sets the Degree of user => Validate Token => Parse valid fields => Add To Profile
app.get('/api/v2/data/Degree', [Middleware.hasAuthToken, Middleware.hasAuthValidToken, Users.ViewDegree]);
//todo motify api call to add name into create account
app.get('/api/v2/data/Profile/Education', [Middleware.ParseValidFields, Middleware.hasAuthToken, Middleware.hasAuthValidToken, function (req, res) {
    return res.status(200).send(Users.GetUserByToken(req.query.token).ProfileData.education);
}]);

function MatchCode(codetomatch) {
    let returndata = {
        classname: "Agile Methods for Software Eng",
        code: "CS-452",
        term: "D01_2020_30"
    };
    if (codetomatch !== "CS452") {
        return {
            classname: "", code: "", term: ""
        };
        return carray.codetomatch
    }
    return returndata;
}

app.post('/api/v2/data/Profile/Education/class', [Middleware.ParseValidFields, Middleware.hasAuthToken, Middleware.hasAuthValidToken, function (req, res) {
    let CCode = req.query.ccode;
    let courses = Users.GetUserByToken(req.query.token).ProfileData.education;
    courses = {course: {}};
    courses.course = MatchCode(CCode);
    return res.status(200).send(MatchCode(CCode));
}]);
app.get('/api/v2/data/Profile/Work', [Middleware.ParseValidFields, Middleware.hasAuthToken, Middleware.hasAuthValidToken, function (req, res) {
    return res.status(200).send(Users.GetUserByToken(req.query.token).ProfileData.work);
}]);
app.get('/api/v2/data/Profile/info', [Middleware.ParseValidFields, Middleware.hasAuthToken, Middleware.hasAuthValidToken, function (req, res) {
    return res.status(200).send(Users.GetUserByToken(req.query.token).ProfileData.info);
}]);
app.get('/api/v2/data/Profile/personal', [Middleware.ParseValidFields, Middleware.hasAuthToken, Middleware.hasAuthValidToken, function (req, res) {
    return res.status(200).send(Users.GetUserByToken(req.query.token).ProfileData.personal);
}]);


//Add all school hardcoded Data

//This function will create a new School object Requires School name and returns the Object Structure
app.post('/api/v2/data/schools', [Schools.AddNewSchool]);
//This function will create a new Course  Requires School UUID CourseName and CourseCode, returns the Object Structure
app.post('/api/v2/data/schools/course', [Schools.AddCourseToSchool]);
app.post('/api/v2/data/schools/course/tag', [Schools.AddTagsToCourse]);
app.post('/api/v2/data/schools/degree', [Schools.AddDegreeToSchool]);
app.post('/api/v2/data/schools/degree/course', [Schools.AddCourseToDegree]);
app.post('/api/v2/data/schools/student', [Schools.AddStudentToSchool]);
app.post('/api/v2/data/masteroveride/schools', [Schools.MasterOverrideAddSchool]);
app.get('/api/v2/data/schools', [Schools.GetSchoolInfo]);
//TODO check for existing
