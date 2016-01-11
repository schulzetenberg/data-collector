Boilerplate Nodejs Web Application
----------------------------------

 - Built upon Hackathon Starter 3.2.0

 - Using AdminLTE website template 2.3.2

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

Install
-------
After installing Node.js & npm:
- npm install -g bower
- npm install -g grunt-cli
- npm install

Deployment
-------
Create a build file in <your git repo>/.openshift/action_hooks/ and add the following script to the file:

# Save the old HOME so we can revert after running the script.
# Set $HOME to the REPO_DIR temporarily.
OLD_HOME=$HOME

##########
echo "INFO: Running 'bower install'"
cd $OPENSHIFT_REPO_DIR
export HOME=$OPENSHIFT_REPO_DIR
bower install

##########
echo "INFO: Running 'grunt build'"
grunt build

#########
export HOME=$OLD_HOME
echo "INFO: HOME is $HOME"

Run
-------
- node nodejs/server.js

Packages
--------
- Front-end: See bower.json
- Server-side: See package.json
