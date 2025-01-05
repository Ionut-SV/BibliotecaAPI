import { useAuth } from "../contexts/AuthContext.jsx";
import { message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useLogin = () => {
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const loginUser = async (values) => {
        try {
            setError(null);
            setLoading(true);
            const res = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                credentials: 'include', // Send cookies with the request
                headers: {
                    'Content-Type': 'application/json', // Ensure this is correct
                },
                body: JSON.stringify(values), // Ensure values is properly structured
            });
    
            const data = await res.json();
            if (res.status === 200) {
                message.success(data.message);
                login(data.token, data.user);
                navigate('/home');
            } else if (res.status === 404) {
                setError(data.message);
            } else {
                message.error('Logarea a esuat');
            }
        } catch (error) {
            message.error('Logarea a esuat');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, loginUser };
};

export default useLogin;