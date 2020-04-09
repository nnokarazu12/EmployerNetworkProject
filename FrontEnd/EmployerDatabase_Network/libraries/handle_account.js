

//Define Global Specs
var Current_token = "";
CurrentUser = {uuid:"",accounttype:"",AccountData:{},ProfileData:{}};
var WebApi_URL = "http://192.168.0.238:28015/";
var User_Token = "";
var User_Structure = {};


//This function is designed to load the information from the backend api and sync it with the local storage
//Requires Valid API Token
function Load_userInfo (){



}

function User_Signup(User_NewEmail, User_NewPassword) {
    //Pull information from the webpage
    let Temp_Login = {
        email: document.getElementById('semail').value,
        password: document.getElementById('spassword').value,
        accounttype: document.getElementById('accounttype').value,
        firstname: document.getElementById('sfirstname').value,
        lastname: document.getElementById('slastname').value
    };
     POSTRequest("api/v2/Auth/CreateAccount",Temp_Login)
        .then((data) => {
            if (data.uuid) {
                //we got a UUID From the server so the account was created so print success
                console.log("Account Created Successfully");
                //Save the structure to storage
                CurrentUser = {uuid:"",accounttype:"",AccountData:{},ProfileData:{}};
                CurrentUser = data;
                localStorage.setItem('CurrentUser', JSON.stringify(CurrentUser));
                User_login(Temp_Login.email, Temp_Login.password);
            } else {
                console.log("Account was not created successfully")
            }
        });
}
function User_login(User_NewEmail, User_NewPassword) {

    let Temp_Login = { email: User_NewEmail, password: User_NewPassword };
    POSTRequest("api/v2/Auth/Login",Temp_Login)
        .then((data) => {
            //login request sent
            if (data.oauth2.token) {
                let CurrentUser = JSON.parse(localStorage.getItem('CurrentUser'));
                if(!CurrentUser){
                    CurrentUser = {uuid:"",accounttype:"",AccountData:{},ProfileData:{}};
                }
                CurrentUser.AccountData = data;
                Current_token = data.oauth2.token;
                console.log("Login Success => API Token: [" + data.oauth2.token + "]");
                //Create storage variable for token
                localStorage.setItem('current_token', Current_token);
                localStorage.setItem('CurrentUser', JSON.stringify(CurrentUser));
                //Fetch the user Profile
                Get_Profile();
                //update the webpage
                //redierct to correct page
                CurrentUser = JSON.parse(localStorage.getItem('CurrentUser'));
                if(!(CurrentUser.accounttype === "employer")){
                    setTimeout(function () {
                        location.href = "student_profile.html";
                    }, 100);
                }else{
                    setTimeout(function () {
                        location.href = "employer_profile.html";
                    }, 100);
                }



            } else {
                console.log("Error: [Login Failed]");
            }
        })
}

function Get_Profile() {
    User_Token = localStorage.getItem('current_token');
    if (!User_Token) {
        return console.log("Error: [Get Request Made with no Login Token] ");
    }
    //Send Request to get Profile For user
    GetRequest("api/v2/data/profile")
        .then((data) => {
        if (data) {
            //Pull from localstorage first!!
           let CurrentUser = JSON.parse(localStorage.getItem('CurrentUser'));
            console.log("LOGGGG: "+ data.info.lastname);
            //CurrentUser.ProfileData = data;
            console.log(CurrentUser);
            CurrentUser.ProfileData = data;
            //CurrentUser.ProfileData.info.lastname = data.info.lastname;
            //localStorage.setItem('profile_data', CurrentUser.ProfileData);
            //localStorage.setItem('firstname', CurrentUser.ProfileData.info.firstname);
            //localStorage.setItem('lastname', CurrentUser.ProfileData.info.lastname);
            // localStorage.setItem('schoolname', data.education.schoolname);
            // localStorage.setItem('degree', data.education.degreename);
            // localStorage.setItem('year', data.education.degreeyear);
            localStorage.setItem('CurrentUser', JSON.stringify(CurrentUser));
            console.log("Profile Fetch Success => ProfileData: " + data);
        } else {
            console.log("Error: [GET Failed]");
        }
    })
}

//Add Course
function Profile_AddNewCourse(CourseCode) {
    User_Token = localStorage.getItem('current_token');
    if (!User_Token) {
        return console.log("Error: [Get Request Made with no Login Token] ");
    }
    let CourseSrruct = { coursecode: CourseCode };
     POSTRequest("192.168.0.238:28015/api/v2/data/Profile/Education/courses",CourseSrruct)
        .then((data) => {
            if (data) {
                console.log("Updated CourseCode to Profile");
                let CurrentUser = JSON.parse(localStorage.getItem('CurrentUser'));
                CurrentUser.ProfileData.education.Courses.push(data);
                let TempSchool = localStorage.getItem('School');
                TempSchool.courses.push(data);
                localStorage.setItem('School', TempSchool);
                localStorage.setItem('CurrentUser', JSON.stringify(CurrentUser));
            } else {
                console.log("Error In Fetch Call")
            }
        })
}

function POST_Profile(school, degree, year) {

    User_Token = localStorage.getItem('current_token');
    if (!User_Token) {
        return console.log("Error: [Get Request Made with no Login Token] ");
    }
    let TempData = {
        education: {
            schoolname: school,
            degreename: degree,
            degreeyear: year
        }
    };
    postData('http://192.168.0.238:28015/api/v2/data/profile?token=' + User_Token, TempData)
        .then((data) => {
            console.log(data);
            if (data) {
                console.log("Pushed Profile Data Sucessfully",data);
                let  CurrentUser = JSON.parse(localStorage.getItem('CurrentUser'));
                CurrentUser.ProfileData = data;
                localStorage.setItem('CurrentUser', JSON.stringify(CurrentUser));
                Get_Profile(Current_token);
                setTimeout(function () {
                    location.href = "student_profile.html";
                }, 50);
            } else {
                console.log("Nothing in Account")
            }
        });
}
function UpdateProfile(school, degree, year) {
    CurrentUser.ProfileData = localStorage.getItem('profile_data');
    if (!CurrentUser.ProfileData) {
        return console.log("Error No Profile Found Please Login First");
    }
    //CurrentUser.ProfileData.info = { firstname: "TestFirst", lastname: "TestLast", phonenumber: "7035555555", email: "Test@test.com" };
    CurrentUser.ProfileData.education = { schoolname: school, degreename: degree, degreeyear: year};
    CurrentUser.ProfileData.work = { employername: "BigLootCo", jobtitle: "Loot Finder", timeworked: "2Y" };
    CurrentUser.ProfileData.personal = { bio: "This is the bio section where the bio is", pfp: "www.google.com/loot.jpg" };
    //POST_Profile(localStorage.getItem('current_token'));
    //Get_Profile(localStorage.getItem('current_token'));

    setTimeout(function () {
        location.href = "student_profile.html";
    }, 50);
}


async function GetRequest (API_Endpoint)  {
    //User has login token Make request
    const response = await getData(''+WebApi_URL+API_Endpoint+'?token=' + User_Token)
        .then((data) => {
            if (data) {
                //Data Pulled successfully
                console.log("LOG: Data Get at endpoint "+API_Endpoint+" Was Successful");
                console.log(data);
                return data;
            } else {
                console.log("LOG: Data Get at endpoint "+API_Endpoint+" Failed");
            }
        });
    return await response;
}
async function POSTRequest(API_Endpoint,JSONData) {

    //User has login token Make request
    const response = await postData(''+WebApi_URL+API_Endpoint+'?token=' + User_Token,JSONData)
        .then((data) => {
            if (data) {
                //Data Pulled successfully
                console.log("LOG: Data POST at endpoint "+API_Endpoint+" Was Successful");
                console.log(data);
                return data;
            } else {
                console.log("LOG: Data POST at endpoint "+API_Endpoint+" Failed");
            }
        });
    return await response;
}
// Example POST method implementation:
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
