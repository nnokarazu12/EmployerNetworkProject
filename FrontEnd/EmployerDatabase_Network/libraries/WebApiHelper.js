//This class will assist the main api with getting and sending data

//Define Global Specs
var WebApi_URL = "http://api.loot.agency:28015/";

var User_Profile = {};
var User_Token = "";
var Current_UDID = "";

//Uses current user token to make a get request to the endpoint
exports.GetRequest = (API_Endpoint) => {
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
exports.POSTRequest = (API_Endpoint,JSONData) => {
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
