//instrument downstream calls
const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
AWS.config.update({ region: 'ap-south-1' });

exports.handler = (event, context, callback) => {
    console.log(JSON.stringify(event));

    //initialize dynamodb client
    let documentClient = new AWS.DynamoDB.DocumentClient();
    if (event === undefined) {
        console.log("Error in processing the event")
    }
    else {
        //retrieve group
        var group = event.group
        let resource = event.resource
        let table = "authorization_db"
        // Create the DynamoDB service object
        var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
        var params = {
            TableName: table,
            Key: {
                "role_name": group,
                "resource": resource
            },
        };

        documentClient.get(params, function(err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                return JSON.stringify(err, null, 2)
            }
            else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                return JSON.stringify(err, null, 2)
            }
        });
    }
}