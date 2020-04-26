import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
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

    // get the upload url for this todoId and userId
    const uploadUrl = await TodoManager.getAttachmentUploadUrl(todoId, userId)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            uploadUrl
        })
    }
}
