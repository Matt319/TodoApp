import React, { useEffect, useState } from 'react';
import TodoItem from './TodoItem';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { newTodo, addTodos, updateTodo, deleteTodo } from '../TodoSlice';
import { useAppDispatch, useAppSelector } from '../Hooks';
import FilterBar from './FilterBar';

interface TodoObj {
    tid: number
    desc: string
    due: string
    state: number
}

interface TodoListProps {
    token: string
    setToken: React.Dispatch<React.SetStateAction<any>>
}

export default function TodoList(Props: TodoListProps) {

    const [dateFilter, setDateFilter] = useState(null);
    const [stateFilter, setStateFilter] = useState(0);

    const todos = useAppSelector(state => state.todos.value);
    const dispatch = useAppDispatch();

    // Determines if two date objects are the same day
    const isSameDay = (d1: Date, d2: Date) => {
        if (d1.getUTCFullYear() !== d2.getUTCFullYear()) { return false }
        if (d1.getUTCDate() !== d2.getUTCDate()) { return false }
        if (d1.getUTCMonth() !== d2.getUTCMonth()) { return false }
        return true
    }

    const filtered = (todos: TodoObj[]) => {
        var filteredTodos: TodoObj[] = []

        var formatedDateFilter = (dateFilter !== null) ? new Date(String(dateFilter)) : new Date(0)

        todos.forEach((todo, _) => {

            let todoDate = new Date(todo.due)

            if (dateFilter === null || isSameDay(todoDate, formatedDateFilter)) {
                if (stateFilter === 0 || stateFilter === todo.state) {
                    filteredTodos.push(todo)
                }
            }
        });
        return filteredTodos
    }

    useEffect(() => {
        fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/tasks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Props.token
            }
        }).then((data) => {
            if (data.status === 401) {
                Props.setToken('')
                return
            }
            data.json().then((todos) => {
                if (todos != null) {
                    dispatch(addTodos(todos))
                }
            });
        });

        const ws = new W3CWebSocket(`ws://localhost:${process.env.REACT_APP_SERVER_PORT}/ws?token=${Props.token}`)
        ws.onopen = () => {}
        ws.onmessage = (message) => {            
            let json = JSON.parse(message.data.toString())  // Convert message to JSON

            switch (json['Event']) {
                case 'ADD':
                    dispatch(newTodo(json['Data']))
                    break;
            
                case 'UPDATE':
                    dispatch(updateTodo(json['Data']))
                    break;

                case 'DELETE':
                    dispatch(deleteTodo(json['Data']))
                    break;

                default:
                    break;
            }
        }
    }, []);

    return (
        <div>
            <h2>Your To-Do List</h2>
            <FilterBar dateFilter={dateFilter} setDateFilter={setDateFilter} stateFilter={stateFilter} setStateFiter={setStateFilter} />
            <div>
                {filtered(todos).map((todo: TodoObj) => {
                    return (
                        <TodoItem key={todo.tid} tid={todo.tid} desc={todo.desc} state={todo.state} due={todo.due} token={Props.token} setToken={Props.setToken} />
                    )
                })}
            </div>
        </div>
    )
}
