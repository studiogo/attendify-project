import React, { useState } from 'react';
import { Form, Input, Button, Alert, Spin, Row, Col, Typography, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons'; // Removed UserOutlined
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const { Title } = Typography;

function Register() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate(); // Hook for navigation

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    console.log('Attempting registration with:', values); // Debug log

    // Backend serializer expects email, password, and password2
    const registrationData = {
      email: values.email,
      password: values.password,
      password2: values.confirmPassword, // Add the confirmation password
    };
    const API_BASE_URL = 'http://localhost:8000'; // Define backend base URL

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register/`, { // Use full URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      const responseData = await response.json(); // Try to parse JSON regardless of status

      if (!response.ok) {
        // Extract specific error messages if available (adjust keys based on your API response)
        let errorMessage = `Błąd: ${response.status} ${response.statusText}`;
        if (responseData) {
          // Example: Combine multiple errors if backend returns them in fields
          const errorDetails = Object.entries(responseData)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
          if (errorDetails) {
            errorMessage = errorDetails;
          } else if (responseData.detail) {
             errorMessage = responseData.detail;
          }
        }
        console.error('Registration failed:', errorMessage); // Debug log
        throw new Error(errorMessage);
      }

      console.log('Registration successful:', responseData); // Debug log
      message.success('Rejestracja zakończona pomyślnie! Możesz się teraz zalogować.');
      navigate('/login'); // Redirect to login page after successful registration

    } catch (err) {
      console.error('Caught error during registration:', err); // Debug log
      setError(err.message || 'Wystąpił nieoczekiwany błąd rejestracji.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
      <Col xs={22} sm={16} md={12} lg={8} xl={6}>
        <Spin spinning={loading} tip="Rejestrowanie...">
          <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>Rejestracja</Title>
          {error && (
            <Alert
              message="Błąd rejestracji"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
              style={{ marginBottom: '24px' }}
            />
          )}
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Proszę podać adres email!' },
                { type: 'email', message: 'Proszę podać poprawny adres email!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" autoComplete="email" />
            </Form.Item>

            <Form.Item
              label="Hasło"
              name="password"
              rules={[{ required: true, message: 'Proszę podać hasło!' }]}
              hasFeedback // Adds feedback icon based on validation status
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Hasło" autoComplete="new-password" />
            </Form.Item>

            <Form.Item
              label="Potwierdź hasło"
              name="confirmPassword"
              dependencies={['password']} // Dependency for password match validation
              hasFeedback
              rules={[
                { required: true, message: 'Proszę potwierdzić hasło!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Hasła nie są zgodne!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Potwierdź hasło" autoComplete="new-password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Zarejestruj się
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Col>
    </Row>
  );
}

export default Register;
