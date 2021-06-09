import React from 'react';
import { Formik, Field, Form } from 'formik';
import { TextField, Button, Select, MenuItem, Paper } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import './AddTodo.css'

interface AddTodoProps {
    token: string
    setToken: React.Dispatch<React.SetStateAction<any>>
}

export default function AddTodo(Props: AddTodoProps) {
    return (
        <div className='wrap'>
            <h2>Add a To-Do</h2>
            <Paper variant='outlined' className='paper'>
                <Formik initialValues={{ desc: '', state: 1, due: new Date(Date.now()).toISOString()}} onSubmit={(data, {setSubmitting, resetForm}) => {
                    setSubmitting(true);

                    data.state = Number(data.state);  // Odd behaviour (state was being stored as a string)

                    // Do some async call to submit the todo
                    fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/tasks`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': Props.token
                        },
                        body: JSON.stringify(data)
                    }).then((data) => {
                        setSubmitting(false);
                        if (data.status === 401) {
                            Props.setToken('');
                        }
                        resetForm();
                    });
                }}>
                    {props => (
                        <Form className='form'>
                            <div className='Element-spacer'>
                                <Field name='desc' label='Description' placeholder='New task' type='input' required={true} InputLabelProps={{shrink: true}} as={TextField} />
                            </div>
                            <div className='Element-spacer'>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Field name='due' label='Due date' type='input' disablePast variant='inline' format='MM/dd/yyyy' required={true} onChange={(value: any) => props.setFieldValue('due', value)} as={KeyboardDatePicker} />
                                </MuiPickersUtilsProvider>
                            </div>
                            <div className='Element-spacer'>
                                <Field name='state' label='State' type='input' as={Select} >
                                    <MenuItem value={1}>Todo</MenuItem>
                                    <MenuItem value={2}>In-progress</MenuItem>
                                    <MenuItem value={3}>Done</MenuItem>
                                </Field>
                            </div>
                            <div className='Element-spacer'>
                                <Button type='submit' color='primary' variant='contained' disabled={props.isSubmitting}>Add</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </div>
    )
}