import React from 'react';
import { Alert, Card, Input, Form, Spin, Typography, Button } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useLogin from '../hooks/useLogin';
import '../styles/Login.css';

const Login = () => {
    const { error, loading, loginUser } = useLogin();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/'; // Default to home page if no from state

    const handleLogin = async (values) => {
        const success = await loginUser(values); // Wait for login attempt and get success status

    // Only navigate if login was successful
    if (success) {
        navigate(from, { replace: true });
    }
    };

    return (
        <Card className="form-container-login">
            <div className="form-content">
                <Typography.Title level={3} strong className="title">
                    Log in
                </Typography.Title>
                <Form
                    layout="vertical"
                    onFinish={handleLogin}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Te rugăm să introduci emailul',
                            },
                            {
                                type: 'email',
                                message: 'Emailul introdus nu este valid!',
                            },
                        ]}
                    >
                        <Input size="large" placeholder="Introdu emailul tău" />
                    </Form.Item>
                    <Form.Item
                        label="Parola"
                        name="parola"
                        rules={[
                            {
                                required: true,
                                message: 'Te rugăm să introduci parola',
                            },
                        ]}
                    >
                        <Input.Password size="large" placeholder="Introdu parola ta" />
                    </Form.Item>
                    {error && (
                        <Alert
                            description={error}
                            type="error"
                            showIcon
                            closable
                            className="alert"
                        />
                    )}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            className="btn"
                            loading={loading}
                        >
                            {loading ? <Spin /> : 'Log in'}
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Link to="/register">
                            <Button size="large" className="btn">
                                Creaza cont
                            </Button>
                        </Link>
                    </Form.Item>
                </Form>
            </div>
        </Card>
    );
};

export default Login;