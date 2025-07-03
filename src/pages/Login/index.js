import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Toast } from 'antd-mobile';
import { UserOutline, LockOutline } from 'antd-mobile-icons';
import './style.css';

const Login = ({ history }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    // 模拟登录请求
    setTimeout(() => {
      setLoading(false);
      // 假设登录成功
      localStorage.setItem('merchantToken', 'demo-token');
      localStorage.setItem('merchantInfo', JSON.stringify({
        id: '1',
        name: '测试商家',
        phone: '13800138000'
      }));
      Toast.show({
        icon: 'success',
        content: '登录成功',
      });
      history.push('/merchant/dashboard');
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="login-logo">
          <img src="/arllogo.svg" alt="ARL Logo" />
        </div>
        <h2>ARL商家系统</h2>
        <p>登录您的账户</p>
      </div>

      <Form
        layout="horizontal"
        onFinish={onFinish}
        footer={
          <Button block type="submit" color="primary" loading={loading} size="large">
            登录
          </Button>
        }
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="用户名" prefix={<UserOutline />} />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input
            placeholder="密码"
            type="password"
            prefix={<LockOutline />}
          />
        </Form.Item>
      </Form>

      <div className="login-footer">
        <p>
          还没有账户？ <Link to="/register">立即注册</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;