import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { StorageStack } from '../lib/stack/StorageStack';
import { NetworkingStack } from '../lib/stack/NetworkingStack';

describe('StorageStack', () => {
  let template: Template;

  beforeAll(() => {
    const app = new cdk.App();
    const stack = new StorageStack(app, 'TestStorageStack', {
      hostingBucketName: 'test.example.com',
    });
    template = Template.fromStack(stack);
  });

  test('synthesizes an S3 bucket with website hosting enabled', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      BucketName: 'test.example.com',
      WebsiteConfiguration: {
        IndexDocument: 'index.html',
      },
    });
  });
});

describe('NetworkingStack', () => {
  let template: Template;

  beforeAll(() => {
    const app = new cdk.App();
    const storageStack = new StorageStack(app, 'TestStorageStack2', {
      hostingBucketName: 'test.example.com',
      env: { account: '123456789012', region: 'us-east-1' },
    });
    const networkingStack = new NetworkingStack(app, 'TestNetworkingStack', {
      domainName: 'example.com',
      hostingBucket: storageStack.hostingBucket,
      env: { account: '123456789012', region: 'us-east-1' },
    });
    template = Template.fromStack(networkingStack);
  });

  test('synthesizes a Route 53 A record', () => {
    template.hasResourceProperties('AWS::Route53::RecordSet', {
      Type: 'A',
    });
  });
});
