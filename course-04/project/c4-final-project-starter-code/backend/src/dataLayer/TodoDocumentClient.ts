import * as AWS from "aws-sdk"
import { TodoItem } from "../models/TodoItem"
import { ITodoDataAccess } from "./ITodoDataAccess";
import { createLogger } from "../utils/logger";

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(require('aws-sdk'))

const logger = createLogger('TodoDocumentClient')

/**
 * TodoDocumentClient is an AWS implementation for the {@link ITodoDataAccess}
 */
export class TodoDocumentClient implements ITodoDataAccess {
    private readonly documentClient: AWS.DynamoDB.DocumentClient
    private static readonly TODOS_TABLE: string = process.env.TODOS_TABLE
    private static readonly USER_ID_INDEX: string = process.env.USER_ID_INDEX_NAME

    constructor() {
        this.documentClient = TodoDocumentClient.getDynamoDBClient()
    }

    private static getDynamoDBClient(): AWS.DynamoDB.DocumentClient {
        if (process.env.IS_OFFLINE) {
            logger.info('Creating a local DynamoDB instance')
            return new XAWS.DynamoDB.DocumentClient({
                region: 'localhost',
                endpoint: 'http://localhost:8000'
            })
        }

        return new XAWS.DynamoDB.DocumentClient()
    }

    async getTodos(userId: string): Promise<Array<TodoItem>> {
        const result = await this.documentClient.query({
            TableName: TodoDocumentClient.TODOS_TABLE,
            IndexName: TodoDocumentClient.USER_ID_INDEX,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        return result.Count > 0
            ? result.Items.map(i => TodoDocumentClient.convertDbItemToTodoItem(i))
            : []
    }

    async getTodo(todoId: string, userId: string): Promise<TodoItem> {
        const result = await this.documentClient.query({
            TableName: TodoDocumentClient.TODOS_TABLE,
            IndexName: TodoDocumentClient.USER_ID_INDEX,
            KeyConditionExpression: 'todoId = :todoId and userId = :userId',
            ExpressionAttributeValues: {
                ':todoId': todoId,
                ':userId': userId
            }
        }).promise()

        if (result.Count != 0) {
            return Promise.resolve(TodoDocumentClient.convertDbItemToTodoItem(result.Items[0]))
        }
        return Promise.resolve(null)
    }

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        try {
            await this.documentClient.put({
                TableName: TodoDocumentClient.TODOS_TABLE,
                Item: todoItem
            }).promise()
            return Promise.resolve(todoItem)
        } catch (err) {
            logger.info(" Error creating todo item", err)
        }
    }

    async updateTodo(todoItem: TodoItem): Promise<TodoItem> {
        await this.documentClient.put({
            TableName: TodoDocumentClient.TODOS_TABLE,
            Item: todoItem,
        }).promise()
        return Promise.resolve(todoItem);
    }

    async deleteTodo(todoId: string, userId: string): Promise<string> {
        try {
            await this.documentClient.delete({
                TableName: TodoDocumentClient.TODOS_TABLE,
                Key: {
                    todoId,
                    userId
                }
            }).promise()
            return Promise.resolve(todoId)
        } catch (err) {
            logger.info("Error deleting todo item", err)
        }
    }

    private static convertDbItemToTodoItem(dbItem: AWS.DynamoDB.DocumentClient.AttributeMap): TodoItem {
        return {
            todoId: dbItem.todoId,
            userId: dbItem.userId,
            createdAt: dbItem.createdAt,
            name: dbItem.name,
            dueDate: dbItem.dueDate,
            done: dbItem.done,
        }
    }

}
