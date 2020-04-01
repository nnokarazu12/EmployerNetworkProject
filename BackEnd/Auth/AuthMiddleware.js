const Users = require('../Data/ClientData.js');
const bodyParser = require('body-parser');

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
