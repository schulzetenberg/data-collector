Data Collector Web App
----------------------------------

 - Using Express, MongoDB, & React

Features
--------

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
Node (Tested on v12)
MongoDB (Tested on v4)

Install
-------
After installing Node.js:
```console
$ npm i
```

Run
-------
- $ npm run start

Sign Up
-------
- Signing up is currently locked down to admin@1.com to prevent multiple users

Deployment on Google Cloud Platform - Compute
--------
- See this  [link](https://cloud.google.com/community/tutorials/deploy-mean-app-mongodb-replication) for instructions setting up a MEAN application on Google Cloud

Re-deploy on GCP
--------
SSH into the GCP VM
```console
$ sudo su - bitnami
$ cd /home/bitnami/apps/collector/htdocs/
$ git pull
Download build.zip from https://github.com/schulzetenberg/data-collector/releases & unzip to frontend/
$ ./start-data-collector.sh
```

Agenda Scheduler
--------
- http://localhost:3000/agenda/

Requirements
--------
- MongoDB
- NodeJS

Run Locally (Backend)
--------
$ npm i
$ npm run start
Express server will start on localhost:3000

Run Locally (Frontend)
--------
$ npm i
$ npm run build (first time only)
$ npm run start
Local web server will start & open webpage to localhost:8999, with a proxy to the backend server on port 3000