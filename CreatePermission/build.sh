#Install the AWS SDK into the folder
    npm install --prefix . aws-sdk
    npm install --prefix . aws-xray-sdk-core

#Zip up your code 
    zip -r ../auth_service_create_permission.zip .
    
    
    aws lambda create-function --function-name auth_service_create_permission --runtime nodejs12.x  --handler CreatePermission/index.handler --publish --zip-file fileb://auth_service_create_permission.zip
    