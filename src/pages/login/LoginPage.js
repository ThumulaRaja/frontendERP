/* eslint-disable */
import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // Change import statement
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './styles.css';
import Cookies from 'js-cookie';




const Login = () => {
    const [loading, setLoading] = useState(false);
    const history = useHistory(); // Change to useHistory



    const onFinish = async (values) => {
        setLoading(true);

        try {
            console.log('Login values:', values);
            const response = await axios.post('http://localhost:3001/login', values);

            if (response.status === 200) {
                message.success('Login successful');
                const { USER_ID, NAME,EMAIL,ROLE,PHOTO  } = response.data.user;

                if (values.remember) {
                    Cookies.set('rememberedUser', JSON.stringify({ USER_ID, NAME,EMAIL,ROLE,PHOTO }), { expires: 2 });
                    // console.log('rememberedUser', { USER_ID, NAME,EMAIL,ROLE });
                }
                // Navigate to the dashboard using history.push
                history.push('/dashboard');
            } else {
                message.error('Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            message.error('Login failed. Please try again.');
        }

        setLoading(false);
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="login-page">
            <div className="login-box">
                <div className="illustration-wrapper">
                    <img src="https://i.ibb.co/ykWXkGt/Untitled-design-4.png" alt="Login"/>
                </div>
                <Form
                    name="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    className="login-form"
                >
                    <p className="form-title">Welcome To Nihal Gems ERP System</p>
                    <p>Login to the Dashboard</p>
                    <Form.Item
                        name="user"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="Username"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            LOGIN
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;
