import { TodoItem } from "../models/TodoItem";

export interface ITodoDataAccess {
    /**
     * returns all the to-do items for the input userId
     *
     * @param userId the user id of the user
     * @return all the to-do items for the user
     */
    getTodos(userId: string): Promise<Array<TodoItem>>

    /**
     * creates the input to-do item
     *
     * @param todoItem the to-do item to be created
     */
    createTodo(todoItem: TodoItem): Promise<TodoItem>

    /**
     * deletes the to-do item for the input todoId and userId
     *
     * @param todoId the todoId of the to-do
     * @param userId the userId of the user
     */
    deleteTodo(todoId: string, userId: string): Promise<string>
}
