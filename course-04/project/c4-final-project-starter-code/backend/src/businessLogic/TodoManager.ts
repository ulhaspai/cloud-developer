import { TodoItem } from "../models/TodoItem";
import { ITodoDataAccess } from "../dataLayer/ITodoDataAccess";
import { TodoDocumentClient } from "../dataLayer/TodoDocumentClient";
import { S3Client } from "../dataLayer/S3Client";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

const todoDataAccess: ITodoDataAccess = new TodoDocumentClient()
const s3Client: S3Client = new S3Client()

/**
 * TodoManager provides all the business logic for the todos application
 */
export class TodoManager {

    /**
     * verify that the to-do item belongs to this user
     *
     * @param todoId the todoId of the to-do item
     * @param userId the userId of the user
     */
    static async verifyTodo(todoId: string, userId: string): Promise<boolean> {
        const todos = await TodoManager.getTodoItems(userId)
        const todo = todos.find(todo => todo.todoId === todoId)
        return !!todo
    }

    /**
     * if the to-do item does not belongs to the userId then, an error is thrown.
     * if no error is thrown everything validated correctly
     *
     * @param todoId the todoId of the to-do item
     * @param userId the userId of the user
     */
    static async verifyTodoBelongsToUser(todoId: string, userId: string) {
        // verify the to-do item belongs to this user
        const verify = await TodoManager.verifyTodo(todoId, userId)
        if (!verify) {
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

    static async getTodoItems(userId: string): Promise<Array<TodoItem>> {
        const todos = await todoDataAccess.getTodos(userId)
        todos.forEach(todo => {
            todo.attachmentUrl = s3Client.getSignedGetUrl(todo.todoId)
        })
        return todos
    }

    static async getTodoItem(todoId: string, userId: string): Promise<TodoItem> {
        const todo = await todoDataAccess.getTodo(todoId, userId)
        todo.attachmentUrl = s3Client.getSignedGetUrl(todo.todoId)
        return todo
    }

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

        // return the update to-do item
        return Promise.resolve(updatedTodoItem)
    }

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

    static async getAttachmentUploadUrl(todoId: string, userId: string): Promise<string> {
        // verify the todoId belongs to the userId
        await TodoManager.verifyTodoBelongsToUser(todoId, userId)

        // return the attachment upload url
        return Promise.resolve(s3Client.getSignedPutUrl(todoId))
    }
}
