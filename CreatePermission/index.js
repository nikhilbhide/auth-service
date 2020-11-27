//instrument downstream calls
const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))

exports.handler = (event, context, callback) => {
  console.log("Here it goes")
  // Load the AWS SDK for Node.js
  var AWS = require('aws-sdk');
  // Set the region 
  AWS.config.update({ region: 'ap-south-1' });

  console.log(event)
  console.log(event.groups)

  if (event === undefined) {
    console.log("Error in processing the event. identity ")
  }
  else {
    //retrieve group
    var group = event.groups
    var resource = event.resource
    var permissions = event.permissions
    var effect = event.effect
    
    AWSXRay.captureFunc('annotations', function(subsegment){
    subsegment.addAnnotation('group', group);
  });
  
    console.log(group)
    if (group === undefined || group === "null") {
      console.log("Error in processing the event")
    }
    else {
      // Create the DynamoDB service object
      var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

      var params = {
        TableName: 'authorization_db',
        Item: {
          'role_name': { S: group },
          'resource': { S: resource },
          'permissions': { SS: permissions },
          'effect':{S:effect}
        }
      };

      // Call DynamoDB to add the item to the table
      ddb.putItem(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        }
        else {
          console.log("Success", data);
        }
      });
    };

  }
}
