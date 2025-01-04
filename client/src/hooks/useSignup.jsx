import { useAuth } from "../contexts/AuthContext.jsx";
import { message } from 'antd';
import { useState } from 'react';

const useSignup = () => {
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const registerUser = async (values) => {
        // Validation for required fields
        if (!values.email || !values.parola || !values.rol) {
            setError("Email, parola, și rolul sunt obligatorii!");
            return;
        }

        // Password match validation
        if (values.parola !== values.parolaConfirm) {
            setError("Parolele nu se potrivesc!");
            return;
        }

        try {
            setError(null);
            setLoading(true);
            const res = await fetch('http://localhost:5000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();
            if (res.status === 201) {
                message.success(data.message);
                login(data.token, data.user);
            } else if (res.status === 400) {
                setError(data.message);
            } else {
                message.error('Înregistrarea a eșuat');
            }
        } catch (error) {
            message.error('Înregistrarea a eșuat');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, registerUser };
};

export default useSignup;
