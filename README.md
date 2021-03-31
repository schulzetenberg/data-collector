# Data Collector Web App
### Built with Express, MongoDB, & React, deployed to Google Cloud 🚀

Features
-------
- Local Authentication using Email and Password
- Material UI
- **Account Management**
 - Profile picture
 - Profile Details
 - Change Password
 - Forgot Password
 - Reset Password
 - Delete Account
- **Security**
 - Brute force protection
 - Secure cookies

Requirements
-------
Node (Tested on v14)
MongoDB (Tested on v4)

Install
-------
After installing Node.js:
```console
$ npm i
$ npm i -g nodemon
$ npm i -g forever
```

Run
-------
$ npm run start

Sign Up
-------
Signing up is currently locked down to admin@1.com to prevent multiple users

Deployment on Google Cloud Platform - Compute
--------
See this  [link](https://cloud.google.com/community/tutorials/deploy-mean-app-mongodb-replication) for instructions setting up a MEAN application on Google Cloud

Re-deploy on GCP
--------
- Run build script from frontend/package.json
- Create a build.zip file & upload to a new Github release
- SSH into the GCP VM

```console
$ sudo su - bitnami
$ cd /home/bitnami/apps/collector/htdocs/
$ git pull
Download build.zip from https://github.com/schulzetenberg/data-collector/releases & unzip to frontend/  (the index.html path should be ~/apps/collector/htdocs/frontend/build/index.html)
$ ./start-data-collector.sh
```

Agenda Scheduler
--------
http://localhost:3000/agenda/

Run Locally (Backend)
--------
- $ npm i
- $ npm run start
- Express server will start on localhost:3000

Run Locally (Frontend)
--------
- $ npm i
- $ npm run build (first time only)
- $ npm run start
- Local web server will start & open webpage to localhost:8999, with a proxy to the backend server on port 3000