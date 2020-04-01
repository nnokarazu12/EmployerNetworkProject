# CSDataWebApi Database System 
*Developed For My CS-452 Class Assigment for WebApi Calls*

![Node.js CI](https://github.com/william86370/CSDataWebApi/workflows/Node.js%20CI/badge.svg)
## Purpose
Allow for easy access and usage for a backend Server Written in NodeJS
## Installation
 [![NPM Version][npm-image]][npm-url]
 [![NPM Downloads][downloads-image]][downloads-url]
  
This uses a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install express --save
```


## Features
- [mongoose](https://github.com/Automattic/mongoose) to drive mongodb (user model: https://github.com/timqian/auth-api/blob/master/src/models/User.js);
## How dose the Api Work?

1. Generate the following AUTH api for you at `http://localhost:3000`


|Method| URL                        | data(if needed)                        | server action(The Request is Successful)          |
| ---- |----------------------------| ---------------------------------------| --------------------------------------------------|
| GET | /api/v1/Auth                |                                        |Lists The Api Structure and usage Calls            |
| POST | /api/v1/Auth/CreateAccount  | {name: ..., email: ..., password: ...} |Checks inputs and creates new Account              |
| POST | /api/v1/Auth/Login          | {email: ..., password: ...}            |Checks username/passwords and Generates APi Token  |
| GET | /api/v1/Auth/TestToken      | {token(the generated Login token)}           |verifies token and displays test data              |
| GET | /api/v1/Data                | {token(the generated Login token)}           |verifies token and displays Users Data             |

(more details coming soon!!)

## Calling The API!!
To use the API all you have to do is make an HTTP Call to the web address with the correct information Added

Example 1.) Calling in Powershell
```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/v1/Auth
```
Example 2.) Calling Basic Api Using HTTP:
```http
http://localhost:3000/api/v1/Auth
```
Example 3.) Calling CreateAccount Using HTTP:

To add items to the request just append them to the url using HTTP Query
 ```http
http://localhost:3000/api/v1/Auth/CreateAccount
?username=TestUsername         //First Value Gets a ?
&password=TestPassword         //Other Values Get a &
&email=TestEmail@captechu.edu  //Other Values Get a &
 ```
The Entire Example
```http
http://localhost:3000/api/v1/Auth/CreateAccount?username=TestUsername&password=TestPassword&email=TestEmail@email.edu
```
The response Will look Like this
```json
{
    "result":true,
     "data":{
        "username":"TestUsername",
        "password":"B3HJyF69ue3HvHOO9arYBA==$1FK3trdZWx8BYvfsl1hDn9Yciu4PwBGUiVxGKFRYGN//jArcRA501rQOdPJOuZrbeIKBP30bcMYbOYNe+vpHkw==",
        "email":"TestEmail@captechu.edu",
        "accounttype":"",
        "oauth2":{}
     }
}
```






## TODOS

   - [ ] better http status code
   - [ ] better config params
   - [ ] docs
   - [ ] new features

## license
    MIT license
    
    William Wright
    wawright@captechu.edu
[npm-image]: https://img.shields.io/npm/v/express.svg
[npm-url]: https://npmjs.org/package/express
[downloads-image]: https://img.shields.io/npm/dm/express.svg
[downloads-url]: https://npmjs.org/package/express
