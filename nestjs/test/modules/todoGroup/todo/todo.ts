import {TodoEntity} from "../../../../src/modules/todoGroup/todo/entities/todo.entity";
import {getSavedTodoGroup} from "../todoGroup";

export const savedTodoData = {
    idx: 1,
    content: '테스트 할일 1'
};

export const getSavedTodo = (): TodoEntity => {
    const savedTodo: TodoEntity = new TodoEntity();
    savedTodo.dataMigration({
        ...savedTodoData,
        todoGroup: getSavedTodoGroup()
    });

    return savedTodo;
};

export const getCreateTodoData = (): TodoEntity => {
    const todo = new TodoEntity();

    todo.dataMigration({
        idx: 111,
        todoGroup: getSavedTodoGroup(),
        content: '테스트 할일 111'
    });

    return todo;
}