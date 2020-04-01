const Auth = require('../Auth/AuthController.js');

var fs = require('fs');

var AllData = [];

//Function for saving data to file
function SaveData()  {
    let json = JSON.stringify(AllData);
    function callback() {
    }
    fs.writeFile('AllData.json', json, 'utf8', callback);
}
//for calling save remotely
exports.SaveallData=() => {
    let json = JSON.stringify(AllData);
    function callback() {
    }
    fs.writeFile('AllData.json', json, 'utf8', callback);
};
//For reading a file
exports.ReadData = () => {
    fs.readFile('AllData.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            AllData = JSON.parse(data); //now it an object
        }
    });

};
//This function will only disclose the AccountData information of a user
exports.GetAccountDataByUserName = (userName) => {
    for (let i = 0; i < AllData.length; i++) {
        //loop until found
        if (AllData[i].AccountData.username === userName) {
            //data match
            return AllData[i].AccountData;
        }
    }
    return {};
};
//With the UserID a call can be made internally to get a user structure
exports.GetUserByID = (ID) => {
    for (let i = 0; i < AllData.length; i++) {
        //loop until found
        if (AllData[i].uuid === ID) {
            //data match
            return AllData[i];
        }
    }
    return {};
};

function GetUserByID(ID) {
    for (let i = 0; i < AllData.length; i++) {
        //loop until found
        if (AllData[i].uuid === ID) {
            //data match
            return AllData[i];
        }
    }
    return {};
}

//This call will return the structure so we can parse the information inside
function GetUserByToken(USER_TOKEN) {
    for (let i = 0; i < AllData.length; i++) {
        //loop until found
        if (AllData[i].AccountData.oauth2.token === USER_TOKEN) {
            //data match
            return AllData[i];
        }
    }
    return {};
}

//This call will return the structure so we can parse the information inside
exports.GetUserByToken = (USER_TOKEN) => {
    for (let i = 0; i < AllData.length; i++) {
        //loop until found
        if (AllData[i].AccountData.oauth2.token === USER_TOKEN) {
            //data match
            return AllData[i];
        }
    }
    return {};
};

//This call Will be used to validate the API token to allow the call to continue
exports.ValidateToken = (ApiToken) => {
    for (let i = 0; i < AllData.length; i++) {
        //loop until found
        if (AllData[i].AccountData.oauth2.token === ApiToken) {
            //data match
            return true
        }
    }
    return false;
};
//THis function creates the new user obj and adds it to the total list of users
exports.CreateUser = (userName, password, email, res) => {
    //run checks on user input
    if (CheckUserExists(userName, email)) {
        res.status(404).send({result: false, data: 'The Username/Email Already Exists'});
        return;
    }
    //check for length
    if (!(userName.length > 1 && password.length > 1 && email.length > 1)) {
        res.status(404).send({result: false, data: 'User Input is to Short'});
        return;
    }
    //Create the new user object
    AllData.push({
        uuid: Auth.GenerateNewUserID(),
        AccountData: {
            username: userName,
            password: Auth.HashPassword(password),
            email: email,
            accounttype: "",
            oauth2: {}
        },
        ProfileData: {}
    });
    SaveData();
    return res.status(201).send({result: true, data: AllData[AllData.length - 1].AccountData})
};

//This function will check to see if the username/email is already taken
/**
 * @return {boolean}
 */
function CheckUserExists(userName, email) {
    for (let i = 0; i < AllData.length; i++) {
        //loop until found
        if (AllData[i].AccountData.username === userName || AllData[i].AccountData.email === email) {
            //data match
            return true;
        }
    }
    return false;
}

function CheckUserExistsV2(email) {
    for (let i = 0; i < AllData.length; i++) {
        //loop until found
        if (AllData[i].AccountData.username === email) {
            //data match
            return true;
        }
    }
    return false;
}

//For creating new user accounts
exports.NewUser = (req, res) => {
    //run checks on user input
    if (CheckUserExists(req.body.username, req.body.email)) {
        return res.status(402).send({result: false, data: 'The Username/Email Already Exists'});
    }
    //Create the new user object
    AllData.push({
        uuid: Auth.GenerateNewUserID(),
        AccountData: {
            username: req.body.username,
            password: Auth.HashPassword(req.body.password),
            email: req.body.email,
            accounttype: "",
            oauth2: {}
        },
        ProfileData: {}
    });
    SaveData();
    return res.status(201).send({result: true, data: AllData[AllData.length - 1].AccountData})
};
exports.NewUserV2 = (req, res) => {
    //run checks on user input
    if (CheckUserExistsV2(req.body.email)) {
        return res.status(402).send({result: false, data: 'The Email Already Exists'});
    }
    //Create the new user object
    AllData.push({
        uuid: Auth.GenerateNewUserID(),
        accounttype: req.body.accounttype,
        AccountData: {
            username: req.body.email,
            password: Auth.HashPassword(req.body.password),
            accounttype: req.body.accounttype,
            oauth2: {}
        },
        ProfileData: {info:{firstname:req.body.firstname,lastname:req.body.lastname}}
    });
    SaveData();
    return res.status(201).send(AllData[AllData.length - 1])
};

//This function updates the users profile
exports.UpdateUserProfile = (req, res) => {
    //get the profile from the user API Key assuming the token key is valid
    let profile;
    if ((req.query && req.query.token)) {
        profile = GetUserByToken(req.query.token).ProfileData;
    } else {
        profile = GetUserByToken(req.body.token).ProfileData;
    }
    //check values and update The user structure
    if (req.body.firstname) {
        profile.firstname = req.body.firstname;
    }
    if (req.body.lastname) {
        profile.lastname = req.body.lastname;
    }
    if (req.body.pfpurl) {
        profile.pfpurl = req.body.pfpurl;
    }
    if (req.body.bio) {
        profile.bio = req.body.bio;
    }
    if (req.body.usid) {
        profile.usid = req.body.usid;
    }
    if (req.body.status) {
        profile.status = req.body.status;
    }
    if (req.body.employment) {
        profile.employment = req.body.employment;
    }
    //return the object updated
    SaveData();
    return res.status(200).send(profile);
};

exports.ViewUserProfile = (req, res) => {
    //get the profile from the user API Key assuming the token key is valid
    let profile;
    if ((req.query && req.query.token)) {
        profile = GetUserByToken(req.query.token).ProfileData;
    } else {
        profile = GetUserByToken(req.body.token).ProfileData;
    }
//return the object updated
    return res.status(200).send(profile);
};

exports.ViewDegree = (req, res) => {
    //get the profile from the user API Key assuming the token key is valid
    let profile;
    if ((req.query && req.query.token)) {
        profile = GetUserByToken(req.query.token).ProfileData;
    } else {
        profile = GetUserByToken(req.body.token).ProfileData;
    }
    if(profile){//user has a valid Profile update and return the profile
        profile.degree  = {};

        if(req.query.schoolname){
        profile.degree.schoolname = req.query.schoolname;
        }
        if(req.query.degreename){

            profile.degree.degreename = req.query.degreename;
        }
        if(req.query.degreeyear){
            profile.degree.degreeyear = req.query.degreeyear;
        }
        SaveData();
        return res.status(200).send(profile.degree);
    }else{
        return res.status(404).send("No Profile Found");
    }
};


exports.ViewProfileV2 = (req, res) => {
    //get the profile from the user API Key assuming the token key is valid
    let profile;
    profile = GetUserByID(req.params.ID);
//return the object updated
    return res.status(200).send(profile);
};


//Will parse the incoming call for valid fields and update the user who called returning the complete structure
exports.POST_Profile = (req, res) => {
    //get the profile from the user API Key assuming the token key is valid
    let profile;
    if ((req.query && req.query.token)) {
        profile = GetUserByToken(req.query.token).ProfileData;
    } else {
        profile = GetUserByToken(req.body.token).ProfileData;
    }
    //Now that we have a valid profile Lets check what information the user wishes to update

    if (req.body.info) {
        //user has included about the profile of the user
        if (!profile.info) {
            profile.info = {};
        }
        POST_Profile_Info(req.body.info, profile.info);
    }
    if (req.body.education) {
        //user has included about the education of the user
        if (!profile.education) {
            profile.education = {};
        }
        POST_Profile_education(req.body.education, profile.education);
    }
    if (req.body.work) {
        //user has included about the work of the user
        if (!profile.work) {
            profile.work = {};
        }
        POST_Profile_Work(req.body.work, profile.work);
    }
    if (req.body.personal) {
        //user has included about the personal of the user
        if (!profile.personal) {
            profile.personal = {};
        }
        POST_Profile_Personal(req.body.personal, profile.personal);
    }
    SaveData();
    return res.status(200).send(profile);
};

//This function will parse the body for information about the information of a user and update that information
function POST_Profile_Info(bodyinfo, profileinfo) {
    //limit the scope of the call to the users info
    if (bodyinfo.firstname) {
        profileinfo.firstname = bodyinfo.firstname;
    }
    if (bodyinfo.lastname) {
        profileinfo.lastname = bodyinfo.lastname;
    }
    if (bodyinfo.phonenumber) {
        profileinfo.phonenumber = bodyinfo.phonenumber;
    }
    if (bodyinfo.email) {
        profileinfo.email = bodyinfo.email;
    }
}

//This function will parse the body for information about the information of a user and update that information
function POST_Profile_education(bodyeducation, profileeducation) {
    //limit the scope of the call to the users info
    if (bodyeducation.schoolname) {
        profileeducation.schoolname = bodyeducation.schoolname;
    }
    if (bodyeducation.degreename) {
        profileeducation.degreename = bodyeducation.degreename;
    }
    if (bodyeducation.degreeyear) {
        profileeducation.degreeyear = bodyeducation.degreeyear;
    }
}

//This function will parse the body for information about the information of a user and update that information
function POST_Profile_Work(bodyWork, profileWork) {
    //limit the scope of the call to the users info
    if (bodyWork.employername) {
        profileWork.employername = bodyWork.employername;
    }
    if (bodyWork.jobtitle) {
        profileWork.jobtitle = bodyWork.jobtitle;
    }
    if (bodyWork.timeworked) {
        profileWork.timeworked = bodyWork.timeworked;
    }
}

//This function will parse the body for information about the information of a user and update that information
function POST_Profile_Personal(bodyPersonal, profilePersonal) {
    //limit the scope of the call to the users info
    if (bodyPersonal.resame) {
        profilePersonal.resame = bodyPersonal.resame;
    }
    if (bodyPersonal.bio) {
        profilePersonal.bio = bodyPersonal.bio;
    }
    if (bodyPersonal.pfp) {
        profilePersonal.pfp = bodyPersonal.pfp;
    }
}

//This function will parse the body for information about the information of a user and update that information
exports.POST_Profile_Info = (bodyinfo, profileinfo) => {
    //limit the scope of the call to the users info
    if (bodyinfo.firstname) {
        profileinfo.firstname = bodyinfo.firstname;
    }
    if (bodyinfo.lastname) {
        profileinfo.lastname = bodyinfo.lastname;
    }
    if (bodyinfo.phonenumber) {
        profileinfo.phonenumber = bodyinfo.phonenumber;
    }
    if (bodyinfo.email) {
        profileinfo.email = bodyinfo.email;
    }
};

//This function will parse the body for information about the information of a user and update that information
exports.POST_Profile_education = (bodyeducation, profileeducation) => {
    //limit the scope of the call to the users info
    if (bodyeducation.schoolname) {
        profileeducation.schoolname = bodyeducation.schoolname;
    }
    if (bodyeducation.degreename) {
        profileeducation.degreename = bodyeducation.degreename;
    }
    if (bodyeducation.degreeyear) {
        profileeducation.degreeyear = bodyeducation.degreeyear;
    }
};

//This function will parse the body for information about the information of a user and update that information
exports.POST_Profile_Work = (bodyWork, profileWork) => {
    //limit the scope of the call to the users info
    if (bodyWork.employername) {
        profileWork.employername = bodyWork.employername;
    }
    if (bodyWork.jobtitle) {
        profileWork.jobtitle = bodyWork.jobtitle;
    }
    if (bodyWork.timeworked) {
        profileWork.timeworked = bodyWork.timeworked;
    }
};

//This function will parse the body for information about the information of a user and update that information
exports.POST_Profile_Personal = (bodyPersonal, profilePersonal) => {
    //limit the scope of the call to the users info
    if (bodyPersonal.resame) {
        profilePersonal.resame = bodyPersonal.resame;
    }
    if (bodyPersonal.bio) {
        profilePersonal.bio = bodyPersonal.bio;
    }
    if (bodyPersonal.pfp) {
        profilePersonal.pfp = bodyPersonal.pfp;
    }
};















