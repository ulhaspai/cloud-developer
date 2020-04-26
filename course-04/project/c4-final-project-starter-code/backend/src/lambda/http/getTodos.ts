import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { LambdaUtils } from "../LambdaUtils";
import { TodoManager } from "../../businessLogic/TodoManager";
import { createLogger } from "../../utils/logger";

const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("getTodos: Started");

    // grab the user id from the JWT payload
    const userId: string = LambdaUtils.getUserId(event)
    logger.info("getTodos: userId = ", userId);

    // get items using TodoManager
    const items = await TodoManager.getTodoItems(userId);

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            items
        })
    }
}
