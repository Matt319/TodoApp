import React from 'react';
import AddTodo from './AddTodo';
import './Dashboard.css'
import TodoList from './TodoList';

interface DashboardProps {
    token: string
    setToken: React.Dispatch<React.SetStateAction<any>>
}

export default function Dashboard(Props: DashboardProps) {
    return(
        <div className='wrapper'>
            <div className='todo-list'>
                <TodoList token={Props.token} setToken={Props.setToken} />
            </div>
            <AddTodo token={Props.token} setToken={Props.setToken}/>
        </div>  
    );
}