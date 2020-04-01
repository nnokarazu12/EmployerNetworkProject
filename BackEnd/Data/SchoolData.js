const Users = require('../Data/ClientData.js');
const bodyParser = require('body-parser');
const Auth = require('../Auth/AuthController.js');
const crypto = require('crypto');
var fs = require('fs');

var School_Array = [];

//function to add a a new school to the api list
exports.AddNewSchool = (req, res) => {
//parse the body for the required information then create the new school object
    let missing = "";
    if (!req.body.school_name) {
        missing += "School Name, ";
    }
    if (missing.length > 0) {
        return res.status(400).send({error: true, data: "Error you are missing " + missing});
    }
    let TempSchoolID = crypto.randomBytes(16).toString('base64');
    School_Array.push({
        SchoolName: req.body.school_name,
        SchoolID: TempSchoolID,
        Courses_offered: [],
        Degrees_offered: [],
        Current_Students: []
    });
    return GetSchoolInfo(req, res, TempSchoolID);
};
//function to add a new course to the school
exports.AddCourseToSchool = (req, res) => {
    let missing = "";
    if (!req.body.schooluuid) {
        missing += "University's UUID, ";
    }
    if (!req.body.coursename) {
        missing += "Course Name, ";
    }
    if (!req.body.corsecode) {
        missing += "Course Code, ";
    }
    if (missing.length > 0) {
        return res.status(400).send({error: true, data: "Error you are missing " + missing});
    }
    let TempUniversityindex = GetSchoolByID(req.body.schooluuid);
    let TempCourseID = crypto.randomBytes(16).toString('base64');
    let TempNewCourse = {
        CourseName: req.body.coursename,
        CourseCode: req.body.corsecode,
        CourseID: TempCourseID,
        CourseTags: []
    };
    School_Array[TempUniversityindex].Courses_offered.push(TempNewCourse);
    GetSchoolInfo(req, res, req.body.schooluuid);
};
//function to add a new degree to the schoolID
exports.AddDegreeToSchool = (req, res) => {
    let missing = "";
    if (!req.body.schooluuid) {
        missing += "University's UUID, ";
    }
    if (!req.body.degreename) {
        missing += "degree Name, ";
    }
    if (missing.length > 0) {
        return res.status(400).send({error: true, data: "Error you are missing " + missing});
    }
    let TempUniversityindex = GetSchoolByID(req.body.schooluuid);
    let TempdegreeID = crypto.randomBytes(16).toString('base64');
    let TempNewdegree = {DegreeName: req.body.degreename, DegreeID: TempdegreeID, DegreeCourses: []};
    School_Array[TempUniversityindex].Degrees_offered.push(TempNewdegree);
    GetSchoolInfo(req, res, req.body.schooluuid);
};
//Function to add a new student enlisted to the schoolID
exports.AddStudentToSchool = (req, res) => {
    let missing = "";
    if (!req.body.schooluuid) {
        missing += "University's UUID, ";
    }
    if (!req.body.studentuuid) {
        missing += "student uuid, ";
    }
    if (missing.length > 0) {
        return res.status(400).send({error: true, data: "Error you are missing " + missing});
    }
    let TempUniversityindex = GetSchoolByID(req.body.schooluuid);
    let TempNewStudent = {studentUUID: req.body.studentuuid};
    School_Array[TempUniversityindex].Current_Students.push(TempNewStudent);
    GetSchoolInfo(req, res, req.body.schooluuid);
};
//this function adds tags to an existing course
exports.AddTagsToCourse = (req, res) => {
    let missing = "";
    if (!req.body.schooluuid) {
        missing += "University's UUID, ";
    }
    if (!req.body.courseuuid) {
        missing += "Course's UUID, ";
    }
    if (!req.body.tags) {
        missing += "tags[], ";
    }
    if (missing.length > 0) {
        return res.status(400).send({error: true, data: "Error you are missing " + missing});
    }
    let TempUniversityindex = GetSchoolByID(req.body.schooluuid);
    let TempCourse = GetCourseByUUID(req.body.schooluuid, req.body.courseuuid);
    for (let i = 0; i < req.body.tags.length; i++) {
        School_Array[TempUniversityindex].Courses_offered[TempCourse].CourseTags.push(req.body.tags[i]);
    }
    GetSchoolInfo(req, res, req.body.schooluuid);
};
//this function adds a courseID to an existing degree
exports.AddCourseToDegree = (req, res) => {
    let missing = "";
    if (!req.body.schooluuid) {
        missing += "University's UUID, ";
    }
    if (!req.body.courseuuid) {
        missing += "Course's UUID, ";
    }
    if (!req.body.degreeuuid) {
        missing += "Course's UUID, ";
    }
    if (missing.length > 0) {
        return res.status(400).send({error: true, data: "Error you are missing " + missing});
    }
    let TempUniversityindex = GetSchoolByID(req.body.schooluuid);
    let TempDegreeindex = GetDegreeByUUID(req.body.schooluuid, req.body.degreeuuid);
    School_Array[TempUniversityindex].Degrees_offered[TempDegreeindex].DegreeCourses.push(req.body.courseuuid);
    GetSchoolInfo(req, res, req.body.schooluuid);
};
//For entering all the school data at once #requiresmasterKey
exports.MasterOverrideAddSchool = (req, res) => {
    if (req.query.masterkey !== "2357") {
        res.status(400).send("Master Code Invalid!!");
    }
    let missing = "";
    if (!req.body.schooluuid) {
        missing += "University's UUID, ";
    }
    if (!req.body.data) {
        missing += "Master Override School Info, ";
    }
    if (missing.length > 0) {
        return res.status(400).send({error: true, data: "Error you are missing " + missing});
    }
    let TempUniversityindex = GetSchoolByID(req.body.schooluuid);
    School_Array[TempUniversityindex] = req.body.data;
    GetSchoolInfo(req, res, req.body.schooluuid);
};

//function returns the school data to caller ending api call
function GetSchoolInfo(req, res, School_ID) {
    let Schoolindex = GetSchoolByID(School_ID);
    if (Schoolindex === -1) {
        //No SchoolID Found Return Error
        return res.status(400).send({error: true, data: "Error No School Info Found With ID School_ID"});
    }
    //Save ALL THE data from the universitys
    SaveData();
//Found SchoolID Return info
    return res.status(200).send(School_Array[Schoolindex]);
}

//function returns the school data to caller ending api call
exports.GetSchoolInfo = (req, res) => {
    let missing = "";
    if (!req.body.schooluuid) {
        missing += "University's UUID, ";
    }
    if (missing.length > 0) {
        return res.status(400).send("Error you are missing " + missing);
    }
    let Schoolindex = GetSchoolByID(req.body.schooluuid);
    if (Schoolindex === -1) {
        //No SchoolID Found Return Error
        return res.status(400).send({error: true, data: "Error No School Info Found With ID School_ID"});
    }
//Found SchoolID Return info
    return res.status(200).send(School_Array[Schoolindex]);
};

/**
 * @return {number}
 */
//Gets the school obj by the Schools UUID
function GetSchoolByID(School_ID) {
    for (let i = 0; i < School_Array.length; i++) {
        if (School_Array[i].SchoolID === School_ID) {
            return i;
        }
    }
    return -1;
}

//Gets the School Object by The Name of the university
function GetSchoolByName(School_Name) {
    for (let i = 0; i < School_Array.length; i++) {
        if (School_Array[i].SchoolName === School_Name) {
            return i;
        }
    }
    return -1;
}

//Gets the school object by the students UUID
function GetSchoolByStudentUUID(Student_UUID) {
    for (let i = 0; i < School_Array.length; i++) {
        for (let j = 0; J < School_Array[i].Current_Students.length; j++) {
            if (School_Array[i].Current_Students[j] === Student_UUID) {
                //Found Student In University
                return i;
            }
        }
    }
    return -1;
}

//Gets the course obj by course UUID EZindex
function GetCourseByUUID(School_ID, Course_ID) {
    let TempSchooIndex = GetSchoolByID(School_ID);
    for (let j = 0; j < School_Array[TempSchooIndex].Courses_offered.length; j++) {
        if (School_Array[TempSchooIndex].Courses_offered[j].CourseID === Course_ID) {
            return j;
        }
    }
    return -1;
}

//Gets the Degree obj by Degree UUID EZindex
function GetDegreeByUUID(School_ID, Degree_ID) {
    let TempSchooIndex = GetSchoolByID(School_ID);
    for (let j = 0; j < School_Array[TempSchooIndex].Degrees_offered.length; j++) {
        if (School_Array[TempSchooIndex].Degrees_offered[j].DegreeID === Degree_ID) {
            return j;
        }
    }
    return -1;
}

function SaveData() {
    let json = JSON.stringify(School_Array);

    function callback() {
    }

    fs.writeFile('schooldata.json', json, 'utf8', callback);
}

//For reading a file
exports.ReadData = () => {
    fs.readFile('schooldata.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            School_Array = JSON.parse(data); //now it an object
        }
    });
};
