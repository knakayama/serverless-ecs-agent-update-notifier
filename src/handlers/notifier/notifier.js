const rp = require('request-promise');

const decrypt = require('../../lib/decrypt');

class Notifier {
  constructor(event, context, callback) {
    this.event = event;
    this.context = context;
    this.callback = callback;
    this.slackChannel = process.env.SLACK_CHANNEL;
    this.kmsEncryptedSlackHookUriPath = process.env.KMS_ENCRYPTED_SLACK_HOOK_URI_PATH;
    this.documentUrl = 'http://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI_launch_latest.html';
  }

  notify2Slack(slackHookUriPath) {
    const message = this.event.Records[0].Sns.Message;
    const options = {
      method: 'POST',
      uri: `https://hooks.slack.com/services/${slackHookUriPath}`,
      body: {
        channel: this.slackChannel,
        username: 'ecs-optimized-ami-notifier',
        icon_emoji: ':ghost:',
        text: `<!here> New ECS-Optimized AMI Released! - ${message.ECSAgent.ReleaseVersion}\n${this.documentUrl}`,
      },
      json: true,
    };
    return rp(options);
  }

  notify() {
    decrypt(this.kmsEncryptedSlackHookUriPath)
      .then((data) => {
        const kmsDecryptedSlackHookUriPath = data.Plaintext.toString('ascii');
        return this.notify2Slack(kmsDecryptedSlackHookUriPath);
      })
      .then((data) => {
        const response = {
          statusCode: 200,
          body: JSON.stringify({ message: data }),
        };
        this.callback(null, response);
      })
      .catch((err) => {
        const response = {
          statusCode: err.statusCode,
          body: JSON.stringify(err),
        };
        console.log(response);
        this.callback(response);
      });
  }
}

module.exports = Notifier;
