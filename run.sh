cd ./web
pwd
npm run build
rm -rf ../app/public/*
mv ./build/* ../app/public