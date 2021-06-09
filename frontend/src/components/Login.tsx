import React from 'react';
import './Login.css';
import { Formik, Field, Form } from 'formik';
import { TextField, Button, Paper } from '@material-ui/core';

interface LoginProps {
    setToken: React.Dispatch<React.SetStateAction<any>>
}

export default function Login(Props: LoginProps) {

    return(
        <div className='Wrap'>
            <Paper className='Container' variant='outlined'>
                <h2 className='Element'>Please login</h2>
                <Formik initialValues={{ uname: '', pass: '' }} onSubmit={(data, {setSubmitting}) => {
                    setSubmitting(true);
                    
                    fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/auth`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    }).then((data) => {
                        if (!data.ok) {
                            alert(data.statusText)  // Idealy this should be displayed on the form
                            return
                        }
                        data.json().then(token => Props.setToken(token))
                    });

                    setSubmitting(false);
                }}>
                    {({ isSubmitting }) => (
                        <Form>
                            <div className='Element'>
                                <Field name='uname' label='Username' required={true} type='input' as={TextField} />
                            </div>
                            <div className='Element'>
                                <Field name='pass' label='Password' required={true} type='password' as={TextField} />
                            </div>
                            <div>
                                <Button type='submit' className='Submit' disabled={isSubmitting} variant='contained' color='primary' >submit</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </div>
    );
}
