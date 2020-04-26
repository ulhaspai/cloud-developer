import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as UUID from 'uuid'
import { LambdaUtils } from "../LambdaUtils";
import { TodoItem } from "../../models/TodoItem";
import { TodoManager } from "../../businessLogic/TodoManager";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("createTodo: Started")

    // grab the user id from the JWT payload
    const userId: string = LambdaUtils.getUserId(event)
    console.log("createTodo: userId = ", userId)

    // grab the request body
    const newTodoRequest: CreateTodoRequest = JSON.parse(event.body)

    // generate a new todoId
    const todoId = UUID.v4()
    console.log("createTodo: todoId = ", todoId)

    // generate the upload url for an image
    // const url = getUploadUrl(imageId)

    // create the to-do object to be saved to the data store
    let newTodoItem: TodoItem = {
        userId: userId,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        name: newTodoRequest.name,
        dueDate: newTodoRequest.dueDate,
        done: false,
    }
    console.log("createTodo: newTodoItem = ", newTodoItem)

    // save item using TodoManager
    newTodoItem = await TodoManager.createTodoItem(newTodoItem)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            item: newTodoItem
        })
    }
}
