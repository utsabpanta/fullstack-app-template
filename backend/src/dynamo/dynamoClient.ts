import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// DynamoDB client configuration
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.DYNAMODB_ENDPOINT || 'http://dynamodb-local:8000',
  credentials: {
    accessKeyId: 'key',
    secretAccessKey: 'secret',
  },
});

// DynamoDB Document Client
export const dynamoDb = DynamoDBDocumentClient.from(client);
