export SESSION_SECRET=SECRETHERE!!!!!!!
export IP_ADDRESS=0.0.0.0
export PORT=3000
export DB=mongodb://root:PASSWORDHERE!!!!!!!@localhost:27017/data-collector?authSource=admin
export CLOUDINARY_CLOUD_NAME=WRONGCLOUDNAME!!!
export CLOUDINARY_API_KEY=WRONGAPIKEY!!!
export CLOUDINARY_API_SECRET=WRONGAPISECRET!!!

cd frontend
npm i
npm run build

cd ..
npm i

forever stopall
forever start ./nodejs/server.js
