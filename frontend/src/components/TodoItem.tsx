import DateFnsUtils from '@date-io/date-fns';
import { Select, TextField, MenuItem, IconButton, Paper } from '@material-ui/core';
import { Formik, Field, Form } from 'formik';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DeleteIcon from '@material-ui/icons/Delete'
import SaveIcon from '@material-ui/icons/Save';
import React from 'react';
import './TodoItem.css'

interface TodoItemProps {
    token: string
    setToken: React.Dispatch<React.SetStateAction<any>>
    tid: number
    desc: string
    state: number
    due: string
}

export default function TodoItem(Props: TodoItemProps) {

    // Handle delete button click
    function deleteTodo() {
        fetch(`http://localhost:8080/tasks/${Props.tid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Props.token
            }
        }).then((data) => {
            if (data.status === 401) {
                Props.setToken('')
                return
            }
        });
    }

    return (
        <Paper className='item-wrapper' variant='outlined'>

            <Formik initialValues={{ desc: Props.desc, state: Props.state, due: Props.due }} onSubmit={(todo, {setSubmitting}) => {
                setSubmitting(true)

                let tidObj = { 'tid': Props.tid }
                let body = Object.assign(tidObj, todo)
                
                fetch('http://localhost:8080/tasks', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': Props.token
                    },
                    body: JSON.stringify(body)
                }).then((data) => {
                    setSubmitting(false);
                    if (data.status === 401) {
                        Props.setToken('');
                    }
                });
            }}>
                {formProps => (
                    <Form className='form-wrapper'>
                        <Field name='desc' type='input' label='Description' className='description' required={true} as={TextField} />

                        <Field name='state' label='State' type='input' className='element-right-aligned' as={Select} >
                            <MenuItem value={1}>Todo</MenuItem>
                            <MenuItem value={2}>In-progress</MenuItem>
                            <MenuItem value={3}>Done</MenuItem>
                        </Field>

                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Field name='due' label='Due date' type='input' disablePast className='element-right-aligned' variant='inline' format='MM/dd/yyyy' required={true} onChange={(value: any) => formProps.setFieldValue('due', value)} as={DatePicker} />
                        </MuiPickersUtilsProvider>

                        <IconButton type='submit' className='element-right-aligned' disabled={!formProps.dirty && !formProps.isSubmitting}>
                            <SaveIcon />
                        </IconButton>

                        <IconButton className='element-right-aligned' onClick={deleteTodo}>
                            <DeleteIcon />
                        </IconButton>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
}