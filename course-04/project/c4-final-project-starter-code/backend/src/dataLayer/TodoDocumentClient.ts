import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client"
import * as AWS from "aws-sdk"
import { TodoItem } from "../models/TodoItem"
import { ITodoDataAccess } from "./ITodoDataAccess";

/**
 * TodoDocumentClient is an AWS implementation for the {@link ITodoDataAccess}
 */
export class TodoDocumentClient implements ITodoDataAccess {
    private readonly documentClient: DocumentClient
    private static readonly TODOS_TABLE: string = process.env.TODOS_TABLE
    private static readonly USER_ID_INDEX: string = process.env.USER_ID_INDEX_NAME

    constructor() {
        this.documentClient = TodoDocumentClient.getDynamoDBClient()
    }

    private static getDynamoDBClient(): DocumentClient {
        if (process.env.IS_OFFLINE) {
            console.log('Creating a local DynamoDB instance')
            return new AWS.DynamoDB.DocumentClient({
                region: 'localhost',
                endpoint: 'http://localhost:8000'
            })
        }

        return new AWS.DynamoDB.DocumentClient()
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

        return result.Items as Array<TodoItem>
    }

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        try {
            console.log("TodoDocumentClient: creating new todo = ", todoItem)
            await this.documentClient.put({
                TableName: TodoDocumentClient.TODOS_TABLE,
                Item: todoItem
            }).promise()
            return Promise.resolve(todoItem)
        } catch (err) {
            console.log(" Error creating todo item", err)
        }
    }

    async deleteTodo(todoId: string, userId: string): Promise<string> {
        try {
            console.log("TodoDocumentClient: deleting todo todoId = ", todoId)
            console.log("TodoDocumentClient: deleting todo userId = ", userId)

            await this.documentClient.delete({
                TableName: TodoDocumentClient.TODOS_TABLE,
                Key: {
                    todoId,
                    userId
                }
            }).promise()
            return Promise.resolve(todoId)
        } catch (err) {
            console.log("Error deleting todo item", err)
        }
        throw new Error("Method not implemented.");
    }
}
