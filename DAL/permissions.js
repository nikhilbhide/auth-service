const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))

module.exports = {
  create: function (event) {
    //initialize dynamodb client
  let documentClient = new AWS.DynamoDB.DocumentClient();
  var resource = event.resource
  let permissions = event.permissions

    // Create the DynamoDB service object
    var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
    var params = {
        TableName: 'permissions_db',
        Item: {
          'resource': { S: resource },
          'permissions': { SS: permissions }
        }
      };
      console.log("Adding a new permissions %s for resource %s",permissions,resource)
      // Call DynamoDB to add the item to the table
      ddb.putItem(params, function(err, data) {
        if (err) {
          console.log("Error", err);
          return "false"
        }
        else {
          console.log("Successfully added resource and permission", data);
          return "true"
        }
      });
    },
  bar: function () {
    // whatever
  }
}