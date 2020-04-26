import { TodoItem } from "../models/TodoItem";
import { ITodoDataAccess } from "../dataLayer/ITodoDataAccess";
import { TodoDocumentClient } from "../dataLayer/TodoDocumentClient";
import { S3Client } from "../dataLayer/S3Client";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { createLogger } from "../utils/logger";

const todoDataAccess: ITodoDataAccess = new TodoDocumentClient()
const s3Client: S3Client = new S3Client()

const logger = createLogger('TodoManager')

/**
 * TodoManager provides all the business logic for the todos application
 */
export class TodoManager {

    /**
     * verify that the to-do item belongs to this user
     *
     * @param todoId the todoId of the to-do item
     * @param userId the userId of the user
     * @return true if the to-do belongs to user, false otherwise
     */
    static async verifyTodo(todoId: string, userId: string): Promise<boolean> {
        logger.info('verifying todo belongs to user')
        const todo = await TodoManager.getTodoItem(todoId, userId)
        if (!!todo === false) {
            logger.info("Todo does not belong to user. Todo Id = " + todoId + " User Id = " + userId)
        }
        return !!todo
    }

    /**
     * if the to-do item does not belongs to the userId then, an error is thrown.
     * if no error is thrown everything validated correctly
     *
     * @param todoId the todoId of the to-do item
     * @param userId the userId of the user
     * @throws an error if the to-do does not belong to user, otherwise executes without errors
     */
    static async verifyTodoBelongsToUser(todoId: string, userId: string) {
        // verify the to-do item belongs to this user
        const verify = await TodoManager.verifyTodo(todoId, userId)
        if (!verify) {
            logger.info('todo does not belong to user')
            throw new Error("Authorization error")
        }
    }

    /**
     * creates a new to-do item for the user
     *
     * @param todoItem the to-do item to be created
     */
    static async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        todoItem.attachmentUrl = s3Client.getSignedGetUrl(todoItem.todoId)
        return todoDataAccess.createTodo(todoItem)
    }

    /**
     * gets all the todos for the input userId
     *
     * @param userId the user id of the user whose todos are to be fetched
     */
    static async getTodoItems(userId: string): Promise<Array<TodoItem>> {
        const todos = await todoDataAccess.getTodos(userId)
        todos.forEach(todo => {
            todo.attachmentUrl = s3Client.getSignedGetUrl(todo.todoId)
        })
        return todos
    }

    /**
     * fetches the to-do item for the input todoId and userId
     *
     * @param todoId the todoId of the to-do item
     * @param userId the userId of the user
     * @return the to-do if it exists, null if the to-do does not exist or does not belong to that user
     */
    static async getTodoItem(todoId: string, userId: string): Promise<TodoItem> {
        const todo = await todoDataAccess.getTodo(todoId, userId)
        todo.attachmentUrl = s3Client.getSignedGetUrl(todo.todoId)
        return todo
    }

    /**
     * updates the to-do item for the input params
     *
     * @param todoId the todoId of the to-do item to be updated
     * @param userId the user id of the user
     * @param updateTodoRequest the values to be be updated
     * @return the updated to-do item
     * @throws an error if the to-do item does not belong to the user
     */
    static async updateTodoItem(todoId: string, userId: string, updateTodoRequest: UpdateTodoRequest): Promise<TodoItem> {
        // verify the todoId belongs to the userId
        await TodoManager.verifyTodoBelongsToUser(todoId, userId)

        // get the current value
        const currentValue = await TodoManager.getTodoItem(todoId, userId)

        // create the to-do object to be updated
        const update: TodoItem  = {
            userId,
            todoId,
            createdAt: currentValue.createdAt,
            attachmentUrl: currentValue.attachmentUrl,
            ...updateTodoRequest
        }

        // update the to-do item
        const updatedTodoItem = await todoDataAccess.updateTodo(update)

        // return the updated to-do item
        return Promise.resolve(updatedTodoItem)
    }

    /**
     * deletes the to-do item for the input params
     *
     * @param todoId the todoId of the to-do item
     * @param userId the userId of the user
     * @return the deleted todoId
     * @throws an error if the to-do item does not belong to the user
     */
    static async deleteTodoItem(todoId: string, userId: string): Promise<string> {
        // verify the todoId belongs to the userId
        await TodoManager.verifyTodoBelongsToUser(todoId, userId)

        // delete the to-do item
        const deletedTodoId = await todoDataAccess.deleteTodo(todoId, userId)

        // delete any attachments if exists
        await s3Client.deleteAttachment(todoId)

        // return the deleted todoId
        return Promise.resolve(deletedTodoId)
    }

    /**
     * fetches the attachment upload url for the input todoId and userId
     *
     * @param todoId the todoId of the to-do item
     * @param userId the userId of the user
     * @return a signed url that allows the user to upload an attachment image to the to-do item
     * @throws an error if the to-do item does not belong to the user
     */
    static async getAttachmentUploadUrl(todoId: string, userId: string): Promise<string> {
        // verify the todoId belongs to the userId
        await TodoManager.verifyTodoBelongsToUser(todoId, userId)

        // return the attachment upload url
        return Promise.resolve(s3Client.getSignedPutUrl(todoId))
    }
}
