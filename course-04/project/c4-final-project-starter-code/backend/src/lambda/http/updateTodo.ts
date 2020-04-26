import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from "../../utils/logger";
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { LambdaUtils } from "../LambdaUtils";
import { TodoManager } from "../../businessLogic/TodoManager";

const logger = createLogger('updateTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("updateTodo: Started")

    // grab the user id from the JWT payload
    const userId: string = LambdaUtils.getUserId(event)
    logger.info("updateTodo: userId = ", userId)

    // grab the todoId to be deleted
    const todoId = event.pathParameters.todoId
    logger.info("updateTodo: todoId = ", todoId)

    // grab the request body
    const updateTodoRequest: UpdateTodoRequest = JSON.parse(event.body)

    // update the to-do item for this user
    await TodoManager.updateTodoItem(todoId, userId, updateTodoRequest)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: null
    }
}
