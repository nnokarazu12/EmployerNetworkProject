

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
    let TempStruct = {
        uuid: TempUDID,
        AccountData: {
            password: TempPassword,
            email: req.body.email,
            oauth2: {}
        },
        Profile: {},
        JobListings: [],
        JobSearching: []
    };
    EmployerData.push(TempStruct);
    SaveData();
    return res.status(201).send(TempStruct)
};
//Create new Employer Profile
exports.NewProfile = (req, res) => {
    //TODO run checks on user input
    let TempObj;
    if ((req.query && req.query.token)) {
        TempObj = GetUserByToken(req.query.token).ProfileData;
    } else {
        TempObj = GetUserByToken(req.body.token).ProfileData;
    }
    if(TempObj===-1){
        return res.status(400).send({Status:false,Message:"Error in finding profile From Token"});
    }
    TempObj.Profile.name = req.body.name;
    TempObj.Profile.state = req.body.state;
    TempObj.Profile.country = req.body.country;
    TempObj.Profile.bio = req.body.bio;
    SaveData();
    return res.status(201).send(TempObj);
};
//Create new job Listing
exports.NewJobListing = (req, res) => {
    var TempObj;
    if ((req.query && req.query.token)) {
        TempObj = GetUserByToken(req.query.token);
    } else {
        TempObj = GetUserByToken(req.body.token);
    }
    //Set Values From Body
    let TempListing = {
        Job_Udid:Auth.GenerateNewUserID(),
        Job_Title: req.body.title,
        Job_Description: req.body.description,
        Job_Location: req.body.location,
        job_Skills: [],
        job_pay: req.body.pay,
        Job_Availability: req.body.availability,
        Job_Duration: req.body.duration
    };
    let TempTags = [];
    //Loop Thorough Tags and add them to the array from body
    for (let i = 0; i < req.body.tags.length; i++) {
        TempTags.push(req.body.tags[i]);
    }
    TempListing.job_Skills = TempTags;
    //push the values to the org profile
    TempObj.JobListings.push(TempListing);

    //return with the org profile
    SaveData();
    return res.status(201).send(TempListing);
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
    SaveData();
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
//This function will only disclose the AccountData information of a user
exports.GetAccountDataByUserName = (userName) => {
    for (let i = 0; i < EmployerData.length; i++) {
        //loop until found
        if (EmployerData[i].AccountData.email === userName) {
            //data match
            return EmployerData[i].AccountData;
        }
    }
    return -1;
};
//Function for saving data to file
function SaveData()  {
    let json = JSON.stringify(EmployerData);
    function callback() {
    }
    fs.writeFile('EmployerData.json', json, 'utf8', callback);
}
//for calling save remotely
exports.SaveallData=() => {
    let json = JSON.stringify(EmployerData);
    function callback() {
    }
    fs.writeFile('EmployerData.json', json, 'utf8', callback);
};
//For reading a file
exports.ReadData = () => {
    fs.readFile('EmployerData.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            EmployerData = JSON.parse(data); //now it an object
        }
    });

};
//This call will return the structure so we can parse the information inside
function GetUserByToken(USER_TOKEN) {
    for (let i = 0; i < EmployerData.length; i++) {
        //loop until found
        if (EmployerData[i].AccountData.oauth2.token === USER_TOKEN) {
            //data match
            return EmployerData[i];
        }
    }
    return {};
}

//This call will return the structure so we can parse the information inside
exports.GetUserByToken = (USER_TOKEN) => {
    for (let i = 0; i < EmployerData.length; i++) {
        //loop until found
        if (EmployerData[i].AccountData.oauth2.token === USER_TOKEN) {
            //data match
            return EmployerData[i];
        }
    }
    return {};
};
exports.SearchWithTag = (tag) => {
    let TempReturn = [];
    for (let i = 0; i < EmployerData.length; i++) {
        for (let j = 0; j < EmployerData[i].JobListings.length; j++) {
            for (let y = 0; y < EmployerData[i].JobListings[j].job_Skills.length; y++) {
                if (EmployerData[i].JobListings[j].job_Skills[y].toLowerCase() === tag.toLowerCase()) {
                    TempReturn.push(EmployerData[i].JobListings[j]);
                }
            }
        }
    }
    return TempReturn;
};
