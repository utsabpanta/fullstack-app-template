import { Request, Response } from 'express';
import { dynamoDb } from '../dynamo/dynamoClient'; // Import the configured DynamoDB client
import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
  QueryCommand,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { TaskAttributes, Task } from '../models/task';
import { transformTask } from '../utils/transformTask';

const TABLE_NAME = 'Tasks';

// TODO: Add Zod/joi/ajv validation

/**
 * Fetches all the tasks for all users from the DynamoDB table.
 *
 * This function performs a scan operation on the DynamoDB table to retrieve all tasks.
 *
 * **Note:** The scan operation is a costly and non-performant operation, especially for large tables.
 * It reads every item in the table, which can be slow and resource-intensive.
 * Therefore, it is not recommended to use this operation in production environments.
 *
 * This implementation is provided for demonstration purposes only and should be replaced with more
 * efficient querying techniques in a production setting.
 * * **Route:** `GET api/tasks`
 *
 */
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const params = {
    TableName: TABLE_NAME,
  };

  try {
    const data = await dynamoDb.send(new ScanCommand(params));

    if (data.Items && data.Items.length > 0) {
      const tasks = data.Items.map(item => transformTask(item as Task));
      res.status(200).json(tasks);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.log('Error fetching tasks:', JSON.stringify(error));
    const errorMessage = 'Could not fetch tasks';
    res.status(500).json({ error: errorMessage });
  }
};

/**
 * Fetches all tasks for a specific user from the DynamoDB table.
 *
 * This function performs a query operation on the DynamoDB table to retrieve all tasks
 * associated with a particular user, identified by their `userId`.
 *
 * The `userId` is expected to be provided as a URL parameter in the route.
 *
 * **Route:** `GET api/users/:userId/tasks`
 * TODO - Add pagination support
 */

export const getTasksByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.userId;

  const params = {
    TableName: 'Tasks',
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: {
      ':pk': `USER#${userId}`,
    },
  };

  try {
    const data = await dynamoDb.send(new QueryCommand(params));
    if (data.Items && data.Items.length > 0) {
      // Use transformTask to remove PK and SK from each task
      const tasks = data.Items.map(item => transformTask(item as Task));
      res.status(200).json(tasks);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.log('Error fetching tasks:', JSON.stringify(error));
    res.status(500).json({ error: 'Could not fetch tasks for the user' });
  }
};

/**
 * Fetches a specific task for a user by task ID from the DynamoDB table.
 *
 * This function performs a `Get` operation on the DynamoDB table to retrieve a single task
 * based on the provided `userId` and `taskId`. The task is identified using the combination
 * of the primary key (PK) and sort key (SK) in the table.
 *
 * The `userId` and `taskId` are expected to be provided as URL parameters in the route.
 *
 * If the task is found, it is returned as a JSON object. If the task is not found, a 404 error
 * is returned. If there is an error during the operation, a 500 error is returned.
 *
 * **Route:** `GET api/users/:userId/tasks/:taskId`
 */
export const getTaskById = async (req: Request, res: Response) => {
  const { userId, taskId } = req.params;
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: `USER#${userId}`,
      SK: `TASK#${taskId}`,
    },
  };

  try {
    const data = await dynamoDb.send(new GetCommand(params));
    if (data.Item) {
      const taskAttributes = transformTask(data.Item as Task);
      res.status(200).json(taskAttributes);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.log('error message is', JSON.stringify(error));
    res.status(500).json({ error: 'Could not fetch task' });
  }
};

/**
 * Creates a new task for a specific user in the DynamoDB table.
 *
 * This function validates the required fields (`userId`, `title`, `description`, `status`, `dueDate`)
 * from the request body. If any required field is missing, it returns a 400 error with a descriptive message.
 * If all required fields are present, it generates a unique `taskId`, constructs the task object, and
 * inserts it into the DynamoDB table. Upon successful creation, it returns a 201 status with the `taskId`.
 *
 * **Route:** `POST api/users/:userId/tasks`
 */
export const createTask = async (req: Request, res: Response) => {
  const { userId, title, description, status, dueDate } = req.body;

  // Validate required fields
  if (!userId || !title || !description || !status || !dueDate) {
    return res.status(400).json({
      error:
        'Missing required fields: userId, title, description, status, and dueDate are required',
    });
  }

  const taskId = uuidv4();
  const params = {
    TableName: TABLE_NAME,
    Item: {
      PK: `USER#${userId}`,
      SK: `TASK#${taskId}`,
      title,
      description,
      status,
      dueDate,
    },
  };

  try {
    await dynamoDb.send(new PutCommand(params));
    res.status(201).json({ message: 'Task created', taskId });
  } catch (error) {
    console.log('error message is', JSON.stringify(error));
    res.status(500).json({ error: 'Could not create task' });
  }
};

/**
 * Updates an existing task for a user in the DynamoDB table.
 *
 * This function first retrieves the current state of the task identified by the `userId` and `taskId`.
 * If the task exists, it dynamically builds an update expression based on the fields provided in the
 * request body (`title`, `description`, `status`, `dueDate`). The task is then updated with the new values,
 * and the updated task is returned as a JSON object.
 *
 * The `userId` and `taskId` are expected to be provided as URL parameters in the route.
 *
 * **Route:** `PUT api/users/:userId/tasks/:taskId`
 */
export const updateTask = async (req: Request, res: Response) => {
  const { userId, taskId } = req.params;
  const body: TaskAttributes = req.body;

  // First, get the existing task
  const getParams = {
    TableName: TABLE_NAME,
    Key: {
      PK: `USER#${userId}`,
      SK: `TASK#${taskId}`,
    },
  };

  try {
    const existingData = await dynamoDb.send(new GetCommand(getParams));
    if (!existingData.Item) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updateExpressions: string[] = [];
    const expressionAttributeValues: { [key: string]: any } = {};
    const expressionAttributeNames: { [key: string]: string } = {};

    // Dynamically process only allowed attributes from the TaskAttributes type
    for (const key of Object.keys(body) as (keyof TaskAttributes)[]) {
      const value = body[key];
      if (value !== undefined && value !== null) {
        const attributeName = key === 'status' ? '#status' : key;
        updateExpressions.push(`${attributeName} = :${key}`);
        expressionAttributeValues[`:${key}`] = value;

        if (key === 'status') {
          expressionAttributeNames['#status'] = 'status'; // Alias for reserved keyword
        }
      }
    }

    if (updateExpressions.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const params: UpdateCommandInput = {
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: `TASK#${taskId}`,
      },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      // Conditionally add ExpressionAttributeNames if it's not empty
      ...(Object.keys(expressionAttributeNames).length > 0 && {
        ExpressionAttributeNames: expressionAttributeNames,
      }),
      ReturnValues: 'UPDATED_NEW', // Return the updated attributes
    };

    const data = await dynamoDb.send(new UpdateCommand(params));

    // Merge the existing attributes with the updated ones
    const updatedTask = {
      ...existingData.Item, // Include all original attributes
      ...data.Attributes, // Overwrite with any updated attributes
    };

    const taskResponse = transformTask(updatedTask as Task);

    res.status(200).json(taskResponse); // Return the full task object
  } catch (error) {
    console.log('Error updating task:', JSON.stringify(error));
    res.status(500).json({ error: 'Could not update task' });
  }
};

/**
 * Deletes a specific task for a user from the DynamoDB table.
 *
 * This function deletes a task identified by the `userId` and `taskId` from the DynamoDB table.
 * The task is identified using the combination of the primary key (PK) and sort key (SK) in the table.
 *
 * The `userId` and `taskId` are expected to be provided as URL parameters in the route.
 *
 * Upon successful deletion, a 200 status is returned with a confirmation message.
 * If there is an error during the deletion operation, a 500 error is returned.
 *
 * **Route:** `DELETE api/users/:userId/tasks/:taskId`
 */
export const deleteTask = async (req: Request, res: Response) => {
  const { userId, taskId } = req.params;
  console.log('looging userId and taskId', userId, taskId);
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: `USER#${userId}`,
      SK: `TASK#${taskId}`,
    },
  };

  try {
    await dynamoDb.send(new DeleteCommand(params));
    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    console.log('error message is', JSON.stringify(error));
    res.status(500).json({ error: 'Could not delete task' });
  }
};
