var fs = require('fs');
const Users = require('./ClientData.js');

var Students = [];

//Function for saving data to file
function SaveData() {
    let json = JSON.stringify(Students);

    function callback() {
    }

    fs.writeFile('Students.json', json, 'utf8', callback);
}

//for calling save remotely
exports.SaveallData = () => {
    let json = JSON.stringify(Students);

    function callback() {
    }

    fs.writeFile('Students.json', json, 'utf8', callback);
};
//For reading a file
exports.ReadData = () => {
    fs.readFile('Students.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            Students = JSON.parse(data); //now it an object
        }
    });

};
//TODO PROFILE:ID PARSE for token => getAuthLevel => return profile if user is firneds or user owns

//todo POST PROFILE:ID NOID parse TOKEN => getauthlevel owner => update profile with data
function findbyID(IDToAcess) {
    return undefined;
}

//THis function will determine the level of auth the calling usser has on the profile
exports.IDCheck = (req, res, next) => {

    //the calling user will be an ID of a student profile
    let TokenUser = Users.GetUserByToken(req.body.token);//Token Will always be in Body
    let TokenUUID = TokenUser.uuid;//The ID the user wants to access set default to the token owner
    let IDToAcess = TokenUser.uuid;
    let AccessLevel = 0; //level 15 is Owner of TOKEN


    //Check if Call Includes an ID To Parse
    if ((req.params && req.params.ID)) {//The Call Has data we need to parse into the correct location
        IDToAcess = req.params.ID.replace(/ /g, "+");//Parse in the ID BASE64
    }
    //Check access Level For Token

    AccessLevel = 15;//Set Owner
    return Users.UpdateUserProfile(req, res); //Update Owners Profile

    if (!TokenUser.colleagues) {
        return res.status(403).send("You Do Not Have Any Colleagues");
    } else {
        let colleagueID = findbyID(IDToAcess);
        //The user is friends with them so we return their entire profile

    }
    //The user inst Friends with the ID Selected so return the basic view of their profile

    return next();
};

exports.OwnerProfile = (req, res, next) => {
    //Access Level Will be 15 here so we will be updating the token holders profile
    let TokenUser = Users.GetUserByToken(req.body.token);//Token Will always be in Body
    if (!TokenUser) {
        //Profile Doesnt Exist Lets create it now
        //TODO create profile
    }
    //Update the owners profile
    //TODO update Owner Profile
};
