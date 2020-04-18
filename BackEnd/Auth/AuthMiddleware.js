
const Users = require('../Data/ClientData.js');
const bodyParser = require('body-parser');
const Org = require ('../Data/EmployerData.js');

//This function Helps parse the data inside the Body for the username and password
exports.hasAuthValidFields = (req, res, next) => {
    let errors = [];

    if (req.body) {
        if (!req.body.email) {
            errors.push('Missing email field');
        }
        if (!req.body.password) {
            errors.push('Missing password field');
        }
        if (!req.body.username) {
            errors.push('Missing username field');
        }

        if (errors.length) {
            return res.status(400).send({errors: errors.join(',')});
        } else {
            return next();
        }
    } else {
        return res.status(400).send({errors: 'Missing a required field'});
    }
};
//This function Helps parse the data inside the Body for the username and password
exports.hasAuthV2ValidFields = (req, res, next) => {
    let errors = [];

    if (req.body) {
        if (!req.body.firstname) {
            req.body.name = "";
        }
        if (!req.body.lastname) {
            req.body.lastname = "";
        }
        if (!req.body.email) {
            errors.push('Missing email field');
        }
        if (!req.body.password) {
            errors.push('Missing password field');
        }
        if (errors.length) {
            return res.status(400).send({errors: errors.join(',')});
        } else {
            return next();
        }
    } else {
        return res.status(400).send({errors: 'Missing a required field'});
    }
};
//for checking token inputs
exports.hasAuthToken = (req, res, next) => {
    if ((req.body && req.body.token)) {
        //found token
        return next();
    } else {
        if ((req.query && req.query.token)) {
            //found token
            req.query.token = req.query.token.replace(/ /g, "+");
            return next();
        }
        return res.status(401).send({error: 'No Token field', value: req.body.token});
    }
};
//for checking if token has valid user
exports.hasAuthValidToken = (req, res, next) => {
    if (Users.ValidateToken(req.body.token)) {
        return next();
    } else {
        if (Users.ValidateToken(req.query.token)) {
            return next();
        }
        return res.status(400).send({error: 'Invalid API Token'});
    }
};

exports.ParseValidFields = (req, res, next) => {

    if (req.query.email) {
        req.body.email = req.query.email;
    }
    if (req.query.accounttype) {
        req.body.accounttype = req.query.accounttype;
    }
    if (req.query.firstname) {
        req.body.firstname = req.query.firstname;
    }
    if (req.query.lastname) {
        req.body.lastname = req.query.lastname;
    }
    if (req.query.password) {
        req.body.password = req.query.password;
    }
    if (req.query.username) {
        req.body.username = req.query.username;
    }

    return next();
};
//Create Search Function
exports.SearchForJobWithTag = (Tags) => {
    var JobSearchReturn = [];
    var r = 0;
    for (let i = 0; i < Tags.length; i++) {
        let Temp = Org.SearchWithTag(Tags[i]);
        if (Temp !== []) {
            for (let k = 0; k < Temp.length; k++) {
                r = 0;
                for (let l = 0; l < JobSearchReturn.length; l++) {
                    if (JobSearchReturn[l].Job_Udid === Temp[k].Job_Udid) {
                        r = 1;
                    }
                }
                if (r === 0) {
                    JobSearchReturn.push(Temp[k]);
                }
            }
        }
    }
    return JobSearchReturn;
};

exports.SearchForStudentWithTag = (Tags) => {
    var StudentSearchReturn = [];
    let r = 0;
    for(let i = 0;i<Tags.length;i++){
        let Temp = Users.SearchWithTag(Tags[i]);
        if(Temp !== []){
            for(let k = 0;k<Temp.length;k++) {
                r=0;
                for(let l=0;l<StudentSearchReturn.length;l++){
                    if(StudentSearchReturn[l].uuid === Temp[k].uuid){
                        r=1;
                    }
                }
                if(r===0){
                    StudentSearchReturn.push(Temp[k]);
                }
            }
        }
    }
    for(let i =0;i<StudentSearchReturn.length;i++){
        let TempTags = [];
            for (let y = 0; y < StudentSearchReturn[i].ProfileData.education.courses.length; y++) {
                for (let w = 0; w < StudentSearchReturn[i].ProfileData.education.courses[y].CourseTags.length; w++) {
                    if(!TempTags.includes(StudentSearchReturn[i].ProfileData.education.courses[y].CourseTags[w])) {
                        TempTags.push(StudentSearchReturn[i].ProfileData.education.courses[y].CourseTags[w]);
                    }
                }

        }
        let TempReturn = {
            udid:StudentSearchReturn[i].uuid,
            email:StudentSearchReturn[i].AccountData.username,
            firstname:StudentSearchReturn[i].ProfileData.info.firstname,
            Tags:TempTags,
        };
        StudentSearchReturn[i] = TempReturn
    }
    return StudentSearchReturn;
};
