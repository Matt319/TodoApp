import React from 'react';
import './Login.css';
import { Formik, Field, Form } from 'formik';
import { TextField, Button } from '@material-ui/core';

interface LoginProps {
    setToken: React.Dispatch<React.SetStateAction<any>>
}

export default function Login(Props: LoginProps) {

    return(
        <div className='Wrap'>
            <h2>Please login</h2>
            <Formik initialValues={{ uname: '', pass: '' }} onSubmit={(data, {setSubmitting}) => {
                setSubmitting(true);
                
                fetch('http://localhost:8080/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }).then((data) => {
                    if (data.status !== 200) {
                        // Add flag to form
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
                        <div className='Element'>
                            <Button type='submit' disabled={isSubmitting} variant='contained' color='primary' >submit</Button>
                        </div>
                    </Form>
                )}</Formik>
        </div>
    );
}
