export SESSION_SECRET=SECRETHERE!!!!!!!
export IP_ADDRESS=0.0.0.0
export PORT=3000
export DB=mongodb://root:PASSWORDHERE!!!!!!!@localhost:27017/data-collector?authSource=admin

npm i

forever stopall
forever start ./nodejs/server.js
