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

  policies.forEach(policy => {
    //create params object for resource deletion
    var params = {
      TableName: table,
      Key: {
        "role_name": group,
        "resource": policy.resource
      }
    };
    console.info("About to delete record having role %s and resource %s", group, policy.resource)
    console.log(params)
    documentClient.delete(params, function(err, data) {
      if (err) {
        console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
        return JSON.stringify(data, null, 2)
      }
      else {
        console.info("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        return JSON.stringify(data, null, 2)
      }
    });
  });
}