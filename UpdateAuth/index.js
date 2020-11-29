const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
AWS.config.update({ region: 'ap-south-1' });

exports.handler = (event, context, callback) => {
    // The event parameter is the input to your lambda function
    console.log(JSON.stringify(event));

    //initialize variables
    let documentClient = new AWS.DynamoDB.DocumentClient();
    let table = "authorization_db"
    var group = event.group
    let policies = event.policies
    let response = []
    
    //iterate over policies and update the data source. 
    //make conditional update to avoid upserts
    policies.forEach(policy => {
            var params = {
                TableName: table,
                Key: {
                    "role_name": group,
                    "resource": policy.resource
                },
                ConditionExpression: "#res = :r",
                UpdateExpression: "set #perm=:p,effect=:e",
                ExpressionAttributeValues: {
                    ":p": policy.permissions,
                    ":e":policy.effect,
                    ":r":policy.resource
                },
                ExpressionAttributeNames: {
                    "#perm": "permissions",
                    "#res":"resource"
                },
            ReturnValues: "UPDATED_NEW"
        };

        console.info("About to update record with role: %s and resource: %s", group, policy.resource); documentClient.update(params, function(err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                response.push(JSON.stringify(err, null, 2))
            }
            else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                response.push(JSON.stringify(data, null, 2))
            }
        });
    })
    
    console.log("response:\n"+response)
}
