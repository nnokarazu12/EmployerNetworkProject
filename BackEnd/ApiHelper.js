const Auth = require('./Auth/AuthController.js');
const Users = require('./Data/ClientData.js');
const Middleware = require('./Auth/AuthMiddleware.js');

//TokenParse => Parses Query for input and Helps Parse Data into correct Location
exports.TokenParse = (req, res, next) => {
    if (req.query && req.query.token) {//The Call Has data we need to parse into the correct location
        req.body.token = req.query.token.replace(/ /g, "+");//This call adds the token to the body from Params
    }
    return next();
};
//IDCheck => Checks if ID Belongs to Token Holder or what level access token holder has to that Profile
//The Token IS VALID entering this function
exports.IDCheck = (req, res, next) => {
    //Get the Users Profile From the Token
    let TokenUser = Users.GetUserByToken(req.body.token);//Token Will always be in Body
    let IDToAccess = TokenUser.uuid;//The ID the user wants to access set default to the token owner
    let AccessLevel = 0; //level 15 is Owner of TOKEN
    //Check if Call Includes an ID To Parse
    if ((req.query && req.query.ID)) {//The Call Has data we need to parse into the correct location
        IDToAccess = req.query.ID.replace(/ /g, "+");//Parse in the ID BASE64
    }
    //Check access Level For Token
    if (TokenUser.uuid === IDToAccess) {
        AccessLevel = 15;//Set Owner
    }

    return next();
};

