import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TodoObj {
    tid: number
    desc: string
    due: string
    state: number
}

interface TodoState {
    value: TodoObj[]
}

const initialState: TodoState = {
    value: []
}

export const todoSlice = createSlice({
    name: 'todos',
    initialState,

    reducers: {

        // Sets the global todos state to the payload
        addTodos: (state, action: PayloadAction<TodoObj[]>) => {
            state.value = action.payload
        },

        // Adds a new todo to the global todo store
        newTodo: (state, action: PayloadAction<TodoObj>) => {
            var buff: TodoObj[] = state.value;
            buff.push(action.payload);
            state.value = buff
        },

        // Updates a specific todo from the global todo store
        updateTodo: (state, action: PayloadAction<TodoObj>) => {
            const todo = action.payload;

            var newTodos: TodoObj[] = []
            var currentTodos: TodoObj[] = state.value

            currentTodos.forEach(t => {
                if (t.tid !== todo.tid) {
                    newTodos.push(t)
                } else {
                    newTodos.push(todo)
                }
            });
            state.value = newTodos;
        },

        // Deletes a specified todo from the global todo store
        deleteTodo: (state, action: PayloadAction<TodoObj>) => {
            const todo = action.payload
            var newTodos: TodoObj[] = []

            const currentTodos: TodoObj[] = state.value
            currentTodos.forEach(t => {
                if (t.tid !== todo.tid) {
                    newTodos.push(t)
                }
            });

            state.value = newTodos;
        }

    }
});

export const { addTodos, newTodo, updateTodo, deleteTodo } = todoSlice.actions;

export default todoSlice.reducer;