import {Todo} from "../../../../src/modules/todoGroup/todo/entities/todo.entity";
import {getSavedTodoGroup} from "../todoGroup";

export const savedTodoData = {
    idx: 1,
    content: '테스트 할일 1'
};

export const getSavedTodo = (): Todo => {
    const savedTodo: Todo = new Todo();
    savedTodo.dataMigration({
        ...savedTodoData,
        todoGroup: getSavedTodoGroup()
    });

    return savedTodo;
};

export const getCreateTodoData = (): Todo => {
    const todo = new Todo();

    todo.dataMigration({
        idx: 111,
        todoGroup: getSavedTodoGroup(),
        content: '테스트 할일 111'
    });

    return todo;
}