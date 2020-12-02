const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))

module.exports = {
 bar: function () {
    // whatever
  }
}