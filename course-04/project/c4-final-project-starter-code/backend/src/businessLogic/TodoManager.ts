import { TodoItem } from "../models/TodoItem";
import { ITodoDataAccess } from "../dataLayer/ITodoDataAccess";
import { TodoDocumentClient } from "../dataLayer/TodoDocumentClient";


const todoDataAccess: ITodoDataAccess = new TodoDocumentClient();

export class TodoManager {

    static async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        return todoDataAccess.createTodo(todoItem)
    }

    static async getTodoItems(userId: string): Promise<Array<TodoItem>> {
        return todoDataAccess.getTodos(userId)
    }

    static updateTodoItem() {

    }

    static deleteTodoItem(todoId: string, userId: string): Promise<string> {
        return todoDataAccess.deleteTodo(todoId, userId)
    }
}
