//-------------------------------------WebAPI.js---------------------------------------------
//Developed by Mr_Cleean#5252 4/14/20
//CS-452 Project API Controller
//--------------------------------------------------------------------------------------------

//Define Global Structures
const WebAPI_MainURL = "http://API.loot.agency:28015/";
const WebAPI_TestURL = "http://localhost:28015/";
var DebugMode = true;
const WebAPI_Endpoints = {
    CreateAccount:"api/v2/Auth/CreateAccount",
    Login:"api/v2/Auth/Login",
    GetProfile:"api/v2/data/profile",
    GetEmail:"api/v2/data/useremail",
    AddCourse:"api/v2/data/Profile/Education/courses",
    UpdateProfile:"api/v2/data/profile",
    SearchforJob:"api/v2/data/Student/SearchForJobsWithTags",
    NewJobListing:"api/v2/data/Employer/NewJobListing",
    SearchForStudent:"api/v2/data/Employers/SearchForStudentWithTags",
    GetAllCourses:"api/v2/data/allcourses"
};

//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
function CreateAccount(User_NewEmail, User_NewPassword,User_firstname,User_Lastname) {
    //Pull information from the webpage
    let JSON_Structure = {
        email: User_NewEmail,
        password: User_NewPassword,
        accounttype:"Student",
        firstname:User_firstname,
        lastname:User_Lastname
    };
    POSTRequest(WebAPI_Endpoints.CreateAccount, JSON_Structure)
        .then((data) => {
            if (data.uuid) {
                //Account Sighup Success
                console.log("Account Created Successfully");
                //Send User To Login
                User_login(User_NewEmail,User_NewPassword);
            } else {
                console.log("Account was not created successfully")
            }
            if(data.reason){
                console.log(data.reason);
            }
            if(data.data){
                console.log(data.data);
            }
        });
}
//--------------------------------------------------------------------------------------------
function User_login(User_NewEmail, User_NewPassword) {
    let JSON_Structure = {email: User_NewEmail, password: User_NewPassword};
    POSTRequest(WebAPI_Endpoints.Login, JSON_Structure)
        .then((data) => {
            if (data.AccountData) {
                //Login Success Reset Local Storage
                let LoggedInUser = {uuid: "", accounttype: "", AccountData: {}, ProfileData: {}};
                let Token = "";
                LoggedInUser = data;
                Token = data.AccountData.oauth2.token;
                console.log("Login Success => API Token: [" + data.AccountData.oauth2.token + "]");
                //Create storage variable for token
                localStorage.setItem('current_token', Token);
                localStorage.setItem('LoggedInUser', JSON.stringify(LoggedInUser));
                if (!(LoggedInUser.accounttype === "employer")) {
                    setTimeout(function () {
                        location.href = "ProfilePage.html";
                    }, 100);
                } else {
                    setTimeout(function () {
                        location.href = "employer_profile.html";
                    }, 100);
                }
            } else {
                console.log("Error: [Login Failed]");
            }
            if(data.reason){
                console.log(data.reason);
            }
            if(data.data){
                console.log(data.data);
            }
        })
}
//--------------------------------------------------------------------------------------------
function Get_Profile(Callback) {
    let User_Token = localStorage.getItem('current_token');
    if (!User_Token) {
        return console.log("Error: [Get Request Made with no Login Token] ");
    }
    //Send Request to get Profile For user
    GetRequest(WebAPI_Endpoints.GetProfile)
        .then((data) => {
            if (data.info) {
                //Pull from localstorage first!!
                let LoggedInUser = JSON.parse(localStorage.getItem('LoggedInUser'));
                console.log("Current Structure ",LoggedInUser);
                LoggedInUser.ProfileData = data;
                localStorage.setItem('LoggedInUser', JSON.stringify(LoggedInUser));
                console.log("Profile Fetch Success => ProfileData: " + data);
                if(Callback){
                    return Callback();
                }
            } else {
                console.log("Error: [GET Failed]");
            }
        })
}
//--------------------------------------------------------------------------------------------
function AddNewCourse(CourseCode) {
   let  User_Token = localStorage.getItem('current_token');
    if (!User_Token) {
        return console.log("Error: [Get Request Made with no Login Token] ");
    }
    if(CourseCode==="Capitol"){
        return console.log("Error: Cant Add Default ");
    }
    let CourseSrruct = {coursecode: CourseCode};
    POSTRequest(WebAPI_Endpoints.AddCourse, CourseSrruct)
        .then((data) => {
            if (data.CourseCode) {
                console.log("Added Course to Profile");
                console.log(data);
                Get_Profile(UpdateCourseDisplayList())
            } else {
                console.log("Error In Adding Course");
            }
        })
}
//--------------------------------------------------------------------------------------------
function GetAllCourses(Callback) {
    POSTRequest(WebAPI_Endpoints.GetAllCourses,{schooluuid:"7xrGCjKnEnQBB3oxP8K2iw=="})
        .then((data) => {
            if (data) {
                console.log("Received All Courses");
                console.log(data);
                localStorage.setItem('AllCourses', JSON.stringify(data));
                return Callback(data);
            } else {
                console.log("Error In Receiving Courses");
            }
        })
}
//--------------------------------------------------------------------------------------------
function UpdateProfileData(school, degree, year,info,work,personal) {
    User_Token = localStorage.getItem('current_token');
    if (!User_Token) {
        return console.log("Error: [Get Request Made with no Login Token] ");
    }
    let JSON_Profile = {
        education: {
            schoolname: school,
            degreename: degree,
            degreeyear: year
        }
    };
        JSON_Profile.info = info;
        JSON_Profile.work = work;
        JSON_Profile.personal = personal;
    POSTRequest(WebAPI_Endpoints.UpdateProfile,JSON_Profile)
        .then((data) => {
            if (data) {
                console.log("[POST]=>Updated Profile", data);
                Get_Profile();
                let LoggedInUser = JSON.parse(localStorage.getItem('LoggedInUser'));
                if (!(LoggedInUser.accounttype === "employer")) {
                    setTimeout(function () {
                        location.href = "ProfilePage.html";
                    }, 100);
                } else {
                    setTimeout(function () {
                        location.href = "employer_profile.html";
                    }, 100);
                }
            } else {
                console.log("[POST]=>Update Profile Failed")
            }
        });
}
//--------------------------------------------------------------------------------------------
//Function for Searching for Jobs With Tags from profile
function SearchForJobStudent2(callabck) {
   // Get_Profile();
    var CurrentUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    let TempTags = [];
    if (CurrentUser.ProfileData) {
        console.log("User Has ProfileData");
            for (let y = 0; y < CurrentUser.ProfileData.education.courses.length; y++) {
                for (let w = 0; w < CurrentUser.ProfileData.education.courses[y].CourseTags.length; w++) {
                    console.log("User Has CourseTags "+CurrentUser.ProfileData.education.courses[y].CourseTags[w]);
                    if (!TempTags.includes(CurrentUser.ProfileData.education.courses[y].CourseTags[w])) {
                        TempTags.push(CurrentUser.ProfileData.education.courses[y].CourseTags[w]);
                    }
                }
            }
    }
    console.log("Temp Tags = "+TempTags);
    let TempRequestData = {tags: TempTags};
    POSTRequest(WebAPI_Endpoints.SearchforJob, TempRequestData)
        .then((data) => {
            if (data.Found !== 0) {
                //Display Jobs to User
                for (let i = 0; i < data.Found; i++) {
                    console.log("THis is Job " + (i + 1) + "'s Name" + data.Jobstoreturn[i].Job_Title);
                }
                if(callabck){
                    return callabck(data.Jobstoreturn);
                }
                return (data.Jobstoreturn);
            }
        })
}
//--------------------------------------------------------------------------------------------
async function POSTRequest(API_Endpoint, JSONData) {
    let URL;
    if(DebugMode){
        URL = WebAPI_TestURL
    }else{
        URL = WebAPI_MainURL
    }
    //Pull most Recent Token From Storage
    let Token = localStorage.getItem('current_token');
    if(!Token){
        console.log("POST Request made With No Token")
    }
    //Send POST Request
    const response = await postData('' + URL + API_Endpoint + '?token=' + Token, JSONData)
        .then((data) => {
            if (data) {
                //Data Pulled successfully
                console.log("LOG: Data POST at endpoint " + API_Endpoint + " Was Successful");
                console.log(data);
                return data;
            } else {
                console.log("LOG: Data POST at endpoint " + API_Endpoint + " Failed");
            }
        });
    return await response;
}
//--------------------------------------------------------------------------------------------
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
}
//--------------------------------------------------------------------------------------------
async function GetRequest(API_Endpoint) {
    let URL;
    if(DebugMode){
        URL = WebAPI_TestURL
    }else{
        URL = WebAPI_MainURL
    }
    //Pull most Recent Token From Storage
    let Token = localStorage.getItem('current_token');
    if(!Token){
        console.log("GET Request made With No Token")
    }
    //Send GET Request
    const response = await getData('' + URL + API_Endpoint + '?token=' + Token)
        .then((data) => {
            if (data) {
                //Data Pulled successfully
                console.log("LOG: Data Get at endpoint " + API_Endpoint + " Was Successful");
                console.log(data);
                return data;
            } else {
                console.log("LOG: Data Get at endpoint " + API_Endpoint + " Failed");
            }
        });
    return await response;
}
//--------------------------------------------------------------------------------------------
async function getData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            // 'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        //  body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
}
