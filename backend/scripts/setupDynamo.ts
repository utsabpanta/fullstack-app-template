import {
  DynamoDBClient,
  CreateTableCommand,
  AttributeDefinition,
  KeySchemaElement,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

// DynamoDB client configuration
const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'key',
    secretAccessKey: 'secret',
  },
});

const dynamoDb = DynamoDBDocumentClient.from(client);

// Function to create the table with composite key
const createTable = async () => {
  const params = {
    TableName: 'Tasks',
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' } as KeySchemaElement, // Partition key
      { AttributeName: 'SK', KeyType: 'RANGE' } as KeySchemaElement, // Sort key
    ],
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' } as AttributeDefinition,
      { AttributeName: 'SK', AttributeType: 'S' } as AttributeDefinition,
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5000,
      WriteCapacityUnits: 5000,
    },
  };

  try {
    await client.send(new CreateTableCommand(params));
    console.log('Table created successfully');
  } catch (error) {
    console.error('Unable to create table:', error);
  }
};

// Function to seed data into the table
const seedData = async () => {
  const tasks = [
    {
      PK: `USER#b7ca0fd2-9a9b-4808-9ccc-281812ae2db4`, // one userid is hardcoded for frontend's users task page
      SK: `TASK#${uuidv4()}`,
      title: 'Sample Task 1',
      description: 'This is a sample task.',
      status: 'pending',
      dueDate: new Date('2024-08-27').toISOString(),
    },
    {
      PK: `USER#${uuidv4()}`,
      SK: `TASK#${uuidv4()}`,
      title: 'Sample Task 2',
      description: 'This is another sample task.',
      status: 'completed',
      dueDate: new Date('2024-08-15').toISOString(),
    },
    {
      PK: `USER#${uuidv4()}`,
      SK: `TASK#${uuidv4()}`,
      title: 'Sample Task 3',
      description: 'This is a third sample task.',
      status: 'in-progress',
      dueDate: new Date('2024-09-01').toISOString(),
    },
  ];

  for (const task of tasks) {
    const params = {
      TableName: 'Tasks',
      Item: task,
    };

    try {
      await dynamoDb.send(new PutCommand(params));
      console.log(`Task added: ${task.title}`);
    } catch (error) {
      console.error('Unable to add task:', error);
    }
  }
};

const setup = async () => {
  await createTable();
  await seedData();
};

setup().catch(console.error);
