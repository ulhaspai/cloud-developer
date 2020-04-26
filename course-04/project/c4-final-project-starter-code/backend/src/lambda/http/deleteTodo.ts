import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { LambdaUtils } from "../LambdaUtils";
import { TodoManager } from "../../businessLogic/TodoManager";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("deleteTodo: Started")

  // grab the user id from the JWT payload
  const userId: string = LambdaUtils.getUserId(event)
  console.log("deleteTodo: userId = ", userId)

  // grab the todoId to be deleted
  const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
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
