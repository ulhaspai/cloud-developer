import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { LambdaUtils } from "../LambdaUtils";
import { TodoManager } from "../../businessLogic/TodoManager";
import { createLogger } from "../../utils/logger";

const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("deleteTodo: Started")

  // grab the user id from the JWT payload
  const userId: string = LambdaUtils.getUserId(event)
  logger.info("deleteTodo: userId = ", userId)

  // grab the todoId to be deleted
  const todoId = event.pathParameters.todoId

  // remove the to-do item for this user
  await TodoManager.deleteTodoItem(todoId, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: null
  }
}


