# JWT-Based-Authentication

## Installation

Clone the repository

Do `npm install` to install packages.

To run the application `npm run start`


> All the payload validations are done using express-validator

## Register API - POST Request
http://localhost:10001/api/user/register

{
    "name":"Vibe",
    "password": "test1234",
    "contact": "9123456789",
    "gender":"Male",
    "country":"india",
    "address":"L271, Horanha, Jojino"
}

Registers the users and stores the data in the database with encrypted password.
In this, 'name' field should be unique as I am considering it as userId. But in real, time userId and name will be different.

## Login API - POST Request
http://localhost:10001/api/login/

{
    "name": "Vibe",
    "password": "test1234"
}

User Data is matched with Database. And returns two JWT Tokens. [Access Token and Refresh Token]

Access Token is very short lived token. So if the hacker/Man in the middle gets to know the Access Token, it wouldn't be a major problem as it is short lived.
Refresh Token is long lived token. We use this token to generate a new Access token. We don't use this token for other purposes. 

Since the Refresh token is used with only authorization server, there will be very less chances of it getting hacked.

As of now, the refresh tokens are stored in the application cache. In Production, its better if we store it in Redis.
We can set expiry time for redis keys. So we can set expiry time as refresh token expiry time.

If anonymous refresh token comes in, we can validate the token from redis.

## Logout API - POST Request
http://localhost:10001/api/logout

{
    "token": <refresh_token>
}

We destroy the session and remove the refresh token from cache.

## Search API - POST Request
http://localhost:10001/api/user/search

{
    "contact":"9349200022"
}

or
http://localhost:10001/api/user/search

{
    "name":"Vibe"
}

The search is based on either contact parameter or name parameter.

## Refresh Token API - POST Request
http://localhost:10001/api/login/refreshToken

{
    "token": <refresh_token>
}

Returns a new access token.
Since the access token is short lived. Instead of logging in everytime, we get a new access token using refresh token.

## Home Page/Dashboard API - POST Request
http://localhost:10001/api/login/verifyAuthtoken
{}

Here, verification of auth token is done.

## Troubleshooting

#### Error 1

###### ReferenceError: TextEncoder is not defined

If the above error comes, Please follow the below steps

Remove these 2 lines from \node_modules\whatwg-url\dist\encoding.js
```
const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder("utf-8", { ignoreBOM: true });
```

Add these 3 lines in \node_modules\whatwg-url\dist\encoding.js
```
const util = require('util');
const utf8Encoder = new util.TextEncoder();
const utf8Decoder = new util.TextDecoder("utf-8", { ignoreBOM: true });
```
