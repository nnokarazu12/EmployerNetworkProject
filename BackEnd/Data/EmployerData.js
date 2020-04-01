const Users = require('../Data/ClientData.js');
const bodyParser = require('body-parser');
const Auth = require('../Auth/AuthController.js');
const crypto = require('crypto');
var fs = require('fs');

//TODO User Story 3: As an Employer,
// I wish to create my basic profile
// including organization name and state and country
// so that I can be discovered by relevant potential employees (1)

var EmployerData = [];


//Create new Employer Profile
exports.NewOrg = (req, res) => {
    //TODO run checks on user input

    //Create the new Profile
    let TempUDID = Auth.GenerateNewUserID();
    let TempPassword = Auth.HashPassword(req.body.password);
    EmployerData.push({
        uuid: TempUDID,
        AccountData: {
            password: TempPassword,
            email: req.body.email,
            oauth2: {}
        },
        Profile: {},
        JobListings: [],
        JobSearching: []
    });
    return res.status(201).send({result: true, udid: TempUDID, email: req.body.email, password: TempPassword})
};
//Create new Employer Profile
exports.NewProfile = (req, res) => {
    //TODO run checks on user input

    //TODO Get UUID From Token
    let TempToken = "test";
    let TempObj = GetOrgFromUdid();
    //Set Values From Body
    TempObj.Profile.name = req.body.name;
    TempObj.Profile.state = req.body.state;
    TempObj.Profile.country = req.body.country;
    TempObj.Profile.bio = req.body.bio;
    return res.status(201).send(TempObj);
};
//Create new job Listing
exports.NewJobListing = (req, res) => {
    //TODO run checks on user input

    //TODO Get UUID From Token
    let TempToken = "test";
    let TempObj = GetOrgFromUdid();
    //Set Values From Body
    let TempListing = {
        jobtitle: req.body.title,
        joblocation: req.body.location,
        jobbio: req.body.bio,
        jobpay: req.body.pay
    };
    //push the values to the org profile
    TempObj.JobListings.push(TempListing);
    //return with the org profile
    return res.status(201).send(TempObj);
};
//Add new Tags Org Is looking for
exports.NewTags = (req, res) => {
    //TODO run checks on user input

    //TODO Get UUID From Token
    let TempToken = "test";
    let TempObj = GetOrgFromUdid();
    //Set Values From Body
    let TempTags = [];
    //Loop Thorugh Tags and add them to the array from body
    for (let i = 0; i < req.body.tags.length; i++) {
        TempTags.push(req.body.tags[i]);
    }
    //add tags to org profile
    TempObj.JobSearching.push(TempTags);
    //return with the org profile
    return res.status(201).send(TempObj);
};


function GetOrgFromUdid(UDID) {
    for (let i = 0; i < EmployerData.length; i++) {
        if (EmployerData[i].uuid === UDID) {
            return EmployerData[i];
        }
    }
    return -1;
}
