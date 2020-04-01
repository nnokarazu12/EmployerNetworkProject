

//Define Global Specs
var Current_token = "";
var CurrentUser = {};
var WebApi_URL = "http://api.loot.agency:28015/";
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
    let SignupData = POSTRequest("api/v2/Auth/CreateAccount",Temp_Login);
    if (SignupData.uuid) {
        //we got a UUID From the server so the account was created so print success
        console.log("Account Created Successfully");
        CurrentUser = SignupData;
        //Save the structure to storage
        localStorage.setItem('CurrentUser', CurrentUser);
        User_login(Temp_Login.email, Temp_Login.password);
    } else {
        console.log("Account was not created successfully")
    }
}
function User_login(User_NewEmail, User_NewPassword) {
    let Temp_Login = { email: User_NewEmail, password: User_NewPassword };
    let LoginData = POSTRequest("api/v2/Auth/Login",Temp_Login);
    //login request sent
            if (LoginData.oauth2.token) {
                CurrentUser.AccountData = LoginData;
                Current_token = data.oauth2.token;
                console.log("Login Success => API Token: ["+data.oauth2.token+"]");
                //Create storage variable for token
                localStorage.setItem('current_token', Current_token);
                localStorage.setItem('CurrentUser', CurrentUser);
                //Fetch the user Profile
                Get_Profile();
                //update the webpage
                setTimeout(function () {
                    location.href = "student_profile.html";
                }, 100);
            } else {
                console.log("Error: [Login Failed]");
            }
}

function Get_Profile() {
    //Send Request to get Profile For user
   let TempProfile = GetRequest("api/v2/data/profile");

            if (TempProfile) {
                //Pull from localstorage first!!
                CurrentUser = localStorage.getItem('CurrentUser');
                CurrentUser.ProfileData = TempProfile;
                //localStorage.setItem('profile_data', CurrentUser.ProfileData);
                //localStorage.setItem('firstname', CurrentUser.ProfileData.info.firstname);
                //localStorage.setItem('lastname', CurrentUser.ProfileData.info.lastname);
               // localStorage.setItem('schoolname', data.education.schoolname);
               // localStorage.setItem('degree', data.education.degreename);
               // localStorage.setItem('year', data.education.degreeyear);
                console.log("Profile Fetch Success => ProfileData: "+TempProfile);
            } else {
                console.log("Error: [GET Failed]");
            }
}

//Add Course
function Profile_AddNewCourse(CourseCode) {
    let CourseSrruct = { coursecode: CourseCode };
    let Temp_Course = POSTRequest("api/v2/data/Profile/Education/courses",CourseSrruct);
            if (Temp_Course) {
                console.log("Updated CourseCode to Profile");
                CurrentUser = localStorage.getItem('CurrentUser');
                CurrentUser.ProfileData.education.Courses.push(Temp_Course);
                let TempSchool = localStorage.getItem('School');
                TempSchool.courses.push(data);
                localStorage.setItem('School', TempSchool);
                localStorage.setItem('CurrentUser', CurrentUser);
            } else {
                console.log("Error In Fetch Call")
            }
}

function POST_Profile(school, degree, year) {
    Current_token = localStorage.getItem('current_token');
    if (!Current_token) {
        return console.log("Error Login First");
    }
    let TempData = {
        education: {
            schoolname: school,
            degreename: degree,
            degreeyear: year
        }
    };
    postData('http://api.loot.agency:28015/api/v2/data/profile?token=' + Current_token, TempData)
        .then((data) => {
            console.log(data);
            if (data) {
                console.log("Pushed Profile Data Sucessfully");
                CurrentUser = localStorage.getItem('CurrentUser');
                CurrentUser.ProfileData = data;
                localStorage.setItem('CurrentUser', CurrentUser);
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


function GetRequest (API_Endpoint)  {
    User_Token = localStorage.getItem('current_token');
    if (!User_Token) {
        return console.log("Error: [Get Request Made with no Login Token] ");
    }
    //User has login token Make request
    getData(WebApi_URL+API_Endpoint+'?token=' + User_Token)
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
    return -1;
};
function POSTRequest (API_Endpoint,JSONData) {
    User_Token = localStorage.getItem('current_token');
    if (!User_Token) {
        return console.log("Error: [Get Request Made with no Login Token] ");
    }
    //User has login token Make request
    postData(WebApi_URL+API_Endpoint+'?token=' + User_Token,JSONData)
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
    return -1;
};
