import { useState } from 'react';

export default function useToken() {

    const getToken = () => {
        return sessionStorage.getItem('token')
    }

    const [token, setToken] = useState(getToken());

    const storeToken = (token: string) => {
        sessionStorage.setItem('token', token);
        setToken(token);
    }

    return {
        setToken: storeToken,
        token
    }
}
