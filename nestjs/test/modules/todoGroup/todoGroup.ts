import {TodoGroup} from "../../../src/modules/todoGroup/entities/todoGroup.entity";
import {getSavedMember} from "../member/member";

export const savedTodoGroupData = {
    idx: 1,
    title: '테스트 할일 그룹',
    order: 1
};

export const getSavedTodoGroup = (): TodoGroup => {
    const savedTodoGroup: TodoGroup = new TodoGroup();
    savedTodoGroup.dataMigration({
        ...savedTodoGroupData,
        member: getSavedMember()
    });

    return savedTodoGroup
};

export const getCreateTodoGroupData = (): TodoGroup => {
    const todoGroup = new TodoGroup();

    todoGroup.dataMigration({
        idx: 277,
        member: getSavedMember(),
        title: '테스트 할일 그룹'
    });

    return todoGroup;
}