const Users = require('../Data/ClientData.js');
const bodyParser = require('body-parser');
const Auth = require('../Auth/AuthController.js');
const crypto = require('crypto');
var fs = require('fs');

//TODO ‘Find my employers’, Web page (linked to from student profile)
// that finds all employers seeking one or more of your obtained skills

//TODO
//employers cre4atinbg new jobs
//employer edits current job
//employer deletes job
//student search for job with tags
//search for job


//Define global objects
var JobData = [];
//Define global functions
