import React from 'react';
import { Alert, Card, Input, Form, Spin, Typography, Button, Select } from 'antd';
import { Link } from 'react-router-dom';
import useSignup from '../hooks/useSignup';

const Register = () => {
    const { loading, error, registerUser } = useSignup();

    const handleRegister = (values) => {
        registerUser(values);
    };

    return (
        <Card className="form-container">
            <div className="flex-container">
                {/* form */}
                <div className="flex-item">
                    <Typography.Title level={3} strong className="title">
                        Creează un cont
                    </Typography.Title>
                    <Form
                        layout="vertical"
                        onFinish={handleRegister}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Nume"
                            name="nume"  // Updated from 'name' to 'nume'
                            rules={[
                                {
                                    required: true,
                                    message: 'Te rugăm să introduci numele tău',
                                },
                            ]}
                        >
                            <Input size="large" placeholder="Introdu numele tău" />
                        </Form.Item>
                        <Form.Item
                            label="Prenume"
                            name="prenume"
                            rules={[
                                {
                                    required: true,
                                    message: 'Te rugăm să introduci prenumele tău',
                                },
                            ]}
                        >
                            <Input size="large" placeholder="Introdu prenumele tău" />
                        </Form.Item>
                        <Form.Item
                            label="Gen"
                            name="gen"
                            rules={[
                                {
                                    required: true,
                                    message: 'Te rugăm să introduci genul tău',
                                },
                            ]}
                        >
                            <Input size="large" placeholder="Introdu prenumele tău" />
                        </Form.Item>
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
                            label="Adresă"
                            name="adresa"  // Updated to 'adresa'
                            rules={[
                                {
                                    required: true,
                                    message: 'Te rugăm să introduci adresa ta',
                                },
                            ]}
                        >
                            <Input size="large" placeholder="Introdu adresa ta" />
                        </Form.Item>
                        <Form.Item
                            label="Parolă"
                            name="parola"  // Updated to 'parola'
                            rules={[
                                {
                                    required: true,
                                    message: 'Te rugăm să introduci parola',
                                },
                            ]}
                        >
                            <Input.Password size="large" placeholder="Introdu parola ta" />
                        </Form.Item>
                        <Form.Item
                            label="Confirmă parola"
                            name="parolaConfirm"  // Updated to 'parolaConfirm'
                            rules={[
                                {
                                    required: true,
                                    message: 'Te rugăm să confirmi parola',
                                },
                            ]}
                        >
                            <Input.Password size="large" placeholder="Reintrodu parola" />
                        </Form.Item>
                        <Form.Item
                            label="Rol"
                            name="rol"  // Updated to 'rol'
                            rules={[
                                {
                                    required: true,
                                    message: 'Te rugăm să selectezi rolul',
                                },
                            ]}
                        >
                            <Select
                                size="large"
                                placeholder="Selectează rolul"
                                options={[
                                    { value: 'membru', label: 'Membru' },
                                    { value: 'bibliotecar', label: 'Bibliotecar' },
                                ]}
                            />
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
                                type={`${loading ? '' : 'primary'}`}
                                htmlType="submit"
                                size="large"
                                className="btn"
                            >
                                {loading ? <Spin /> : 'Creează contul'}
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Link to="/login">
                                <Button size="large" className="btn">
                                    Autentifică-te
                                </Button>
                            </Link>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </Card>
    );
};

export default Register;
