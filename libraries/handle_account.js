var urlwebapi = "webapiv2.eastus.cloudapp.azure.com:3000/api/v2/";

var Current_token = "";
var Current_UUID = "";
var Current_Secret = "";
var CurrentUser = {};
//User_Signup("Test5","test","Student","w","e");

function User_Signup(emailin, passwordin) {
    //Signup input fields
    let semail = document.getElementById('semail').value;
    let spassword = document.getElementById('spassword').value;
    let saccounttype = document.getElementById('accounttype').value;
    let firstName = document.getElementById('sfirstname').value;
    let lastName = document.getElementById('slastname').value;

    //Login input fields
    let lemail = document.getElementById('email').value;
    let lpassword = document.getElementById('password').value;

    postData('http://webapiv2.eastus.cloudapp.azure.com:3000/api/v2/Auth/CreateAccount', { email: emailin, password: passwordin, accounttype: saccounttype, firstname: firstName, lastname: lastName })
        .then((data) => {
            //console.log(data); // JSON data parsed by `response.json()` call
            //we Expect the signup to ether return true or false
            if (data.uuid) {
                //we got a UUID From the server so the account was created so print success
                console.log("Account Created Sucessfully");
                CurrentUser = data;
                User_login(emailin, passwordin);
                //TODO add response such as next page?
            } else {
                console.log("Account was not created sucessfully")
                //TODO add response such as error box?
            }
        });
}
function User_login(emailin, passwordin) {
    //let lemail = document.getElementById('email').value;
    //let lpassword = document.getElementById('password').value;
    postData('http://webapiv2.eastus.cloudapp.azure.com:3000/api/v2/Auth/Login', { email: emailin, password: passwordin })
        .then((data) => {
            console.log(data); // JSON data parsed by `response.json()` call
            //we Expect the signup to ether return true or false
            if (data.oauth2.token) {
                //we got a UUID From the server so the account was created so print sucess
                console.log("Login Successful");
                CurrentUser.AccountData = data;
                Current_token = data.oauth2.token;
                //Create storage variable for token
                localStorage.setItem('current_token', Current_token);
                Current_Secret = data.oauth2.secret;
                //TODO add response such as next page?
                Get_Profile(localStorage.getItem('current_token'));
                setTimeout(function () {
                    location.href = "student_profile.html";
                }, 100);
                
            } else {
                console.log("Account was not created successfully");
                //TODO add response such as error box?
            }
        });
}
function Get_Profile(token) {
    Current_token = token;
    if (!Current_token) {
        return console.log("Error Login First");
    }
    getData('http://webapiv2.eastus.cloudapp.azure.com:3000/api/v2/data/profile?token=' + Current_token)
        .then((data) => {
            console.log(data); // JSON data parsed by `response.json()` call
            //we Expect the signup to ether return true or false
            if (data) {
                //we got a UUID From the server so the account was created so print sucess
                console.log("Pulled Data Sucessfully");
                CurrentUser.ProfileData = data;
                localStorage.setItem('profile_data', CurrentUser.ProfileData);
                localStorage.setItem('firstname', CurrentUser.ProfileData.info.firstname);
                localStorage.setItem('lastname', CurrentUser.ProfileData.info.lastname);
                localStorage.setItem('schoolname', data.education.schoolname);
                localStorage.setItem('degree', data.education.degreename);
                localStorage.setItem('year', data.education.degreeyear);
                console.log(CurrentUser.ProfileData.info.firstname);
                //TODO add response such as next page?
            } else {
                console.log("Nothing in Account")
                //TODO add response such as error box?
            }
        });
}

function POST_Profile(school, degree, year) {
    Current_token = localStorage.getItem('current_token');
    if (!Current_token) {
        return console.log("Error Login First");
    }
    postData('http://webapiv2.eastus.cloudapp.azure.com:3000/api/v2/data/profile?token=' + Current_token, CurrentUser.ProfileData)
        .then((data) => {
            console.log(data); // JSON data parsed by `response.json()` call
            //we Expect the signup to ether return true or false
            if (data) {
                //we got a UUID From the server so the account was created so print sucess
                console.log("Pushed Profile Data Sucessfully");
                CurrentUser.ProfileData = data;
                data.education = { schoolname: school, degreename: degree, degreeyear: year };
                Get_Profile(Current_token);

                setTimeout(function () {
                    location.href = "student_profile.html";
                }, 50);
                /*
                localStorage.setItem('schoolname', school);
                localStorage.setItem('degree', degree);
                localStorage.setItem('year', year);
                */
                //TODO add response such as next page?
            } else {
                console.log("Nothing in Account")
                //TODO add response such as error box?
            }
        });
}
function UpdateProfile(school, degree, year) {
    CurrentUser.ProfileData = localStorage.getItem('profile_data');
    if (!CurrentUser.ProfileData) {
        return console.log("Error No Profile Found Please Login First");
    }
    //CurrentUser.ProfileData.info = { firstname: "TestFirst", lastname: "TestLast", phonenumber: "7035555555", email: "Test@test.com" };
    CurrentUser.ProfileData.education = { schoolname: school, degreename: degree, degreeyear: year };
    CurrentUser.ProfileData.work = { employername: "BigLootCo", jobtitle: "Loot Finder", timeworked: "2Y" };
    CurrentUser.ProfileData.personal = { bio: "This is the bio section where the bio is", pfp: "www.google.com/loot.jpg" };
    //POST_Profile(localStorage.getItem('current_token'));
    //Get_Profile(localStorage.getItem('current_token'));

    setTimeout(function () {
        location.href = "student_profile.html";
    }, 50);
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

async function postData(url = '', data = {}) {
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