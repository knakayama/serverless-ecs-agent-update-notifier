const AWS = require('aws-sdk');

const kms = new AWS.KMS();

module.exports = (kmsEncryptedSlackHookUriPath) => {
  const cipherText = {
    CiphertextBlob: new Buffer(kmsEncryptedSlackHookUriPath, 'base64'),
  };

  return kms.decrypt(cipherText).promise();
};
