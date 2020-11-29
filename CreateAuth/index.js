//instrument downstream calls
const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
AWS.config.update({ region: 'ap-south-1' });

exports.handler = (event, context, callback) => {
  console.log(JSON.stringify(event));
  console.log("creating new auth")
  //initialize dynamodb client
  let documentClient = new AWS.DynamoDB.DocumentClient();
  if (event === undefined) {
    console.log("Error in processing the event")
  }
  else {
    //retrieve group
    var group = event.group
    let policies = event.policies

    // Create the DynamoDB service object
    var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
    policies.forEach(policy => {
      console.log(policy)
      var params = {
        TableName: 'authorization_db',
        Item: {
          'role_name': { S: group },
          'resource': { S: policy["resource"] },
          'permissions': { SS: policy["permissions"] },
          'effect': { S: policy["effect"] }
        }
      };
      console.log("Adding a new auth mapping with params:\n"+params.Item)
      // Call DynamoDB to add the item to the table
      ddb.putItem(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        }
        else {
          console.log("Success", data);
        }
      });
    });
  }
}
