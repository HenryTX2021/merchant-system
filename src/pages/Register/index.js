import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Toast } from 'antd-mobile';
import { UserOutline, LockOutline, PhoneFill, MailOutline } from 'antd-mobile-icons';
import './style.css';

const Register = ({ history }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    // 模拟注册请求
    setTimeout(() => {
      setLoading(false);
      Toast.show({
        icon: 'success',
        content: '注册成功，请登录',
      });
      history.push('/login');
    }, 1500);
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <div className="register-logo">
          <img src="/arllogo.svg" alt="ARL Logo" />
        </div>
        <h2>ARL商家系统</h2>
        <p>创建您的账户</p>
      </div>

      <Form
        layout="horizontal"
        onFinish={onFinish}
        footer={
          <Button block type="submit" color="primary" loading={loading} size="large">
            注册
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
          name="phone"
          rules={[{ required: true, message: '请输入手机号' }]}
        >
          <Input placeholder="手机号" prefix={<PhoneFill />} />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[{ required: true, message: '请输入邮箱' }]}
        >
          <Input placeholder="邮箱" prefix={<MailOutline />} />
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

        <Form.Item
          name="confirmPassword"
          rules={[
            { required: true, message: '请确认密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input
            placeholder="确认密码"
            type="password"
            prefix={<LockOutline />}
          />
        </Form.Item>
      </Form>

      <div className="register-footer">
        <p>
          已有账户？ <Link to="/login">立即登录</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;