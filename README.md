Data Collector Web App
----------------------------------

 - Using AdminLTE website template 2.3.11

 - OpenShift App Deployment

Features
--------

- Local Authentication using Email and Password
- Flash notifications
- MVC Project Structure
- Bootstrap 3
- Contact Form
- **Account Management**
 - Profile picture
 - Profile Details
 - Change Password
 - Forgot Password
 - Reset Password
 - Delete Account
- **Security**
 - CSRF protection
 - Brute force protection
 - Secure cookies

Requirements
-------
node > 0.12

Install
-------
After installing Node.js & npm:
- $ npm install -g grunt-cli
- $ npm install
- $ grunt build

Deployment
-------
Set npm environment variable:
- $ rhc env set NPM_CONFIG_PRODUCTION="true"

Add openshift remote to Github repo:
- $ git remote add openshift -f ssh://XXXXXXXXXXXXXXXXXXXXXXXXX@YYYYYYY.rhcloud.com/~/git/ZZZZZZZZ.git/
- $ git merge openshift/master -s recursive -X ours
- $ git push openshift HEAD

Run
-------
- $ node nodejs/server.js

Sign Up
-------
- Signing up is currently locked down to admin@1.com to prevent multiple users

Packages
--------
- See package.json
