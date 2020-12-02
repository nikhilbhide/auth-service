//instrument downstream calls
const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const permissions = require('DAL/permissions')
AWS.config.update({ region: 'ap-south-1' });

exports.handler = (event, context, callback) => {
  try {
    let resource = event.resource
    let perm = event.permissions
    let documentClient = new AWS.DynamoDB.DocumentClient();
    //get unique permissions from the input
    let permissions = event.permissions.filter((item, i, ar) => ar.indexOf(item) === i);

    // Create the DynamoDB service object
    var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
    var params = {
      TableName: 'permissions_db',
      Item: {
        'resource': { S: resource },
        'permissions': { SS: permissions }
      }
    };
    console.log("adding a new permissions %s for resource %s", permissions, resource)
    // Call DynamoDB to add the item to the table
    ddb.putItem(params, function(err, data) {
      if (err) {
        console.log("error", err);
      }
      else {
        console.log("successfully added resource and permission", data);
      }
    });
  }
  catch (err) {
    console.log("error in processing event\n" + JSON.stringify(event))
  }
}
