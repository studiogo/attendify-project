import React, { useState } from "react";
import { Form, Input, Button, Alert, Spin, Row, Col, Typography } from 'antd'; // Import Ant Design components
import { UserOutlined, LockOutlined } from '@ant-design/icons'; // Import icons

const { Title } = Typography; // Destructure Title for convenience

function Login({ onLogin }) {
  // Removed useState for email and password as Form handles state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // Ant Design Form instance

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    console.log("Attempting login with:", values); // Debug log
    const API_BASE_URL = 'http://localhost:8000'; // Define backend base URL

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/token/`, { // Use full URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values), // Send values from Ant Design form
      });

      const responseData = await response.json(); // Try to parse JSON regardless of status

      if (!response.ok) {
        // Use error details from backend if available
        const errorMessage = responseData.detail || `Błąd: ${response.status} ${response.statusText}`;
        console.error("Login failed:", errorMessage); // Debug log
        throw new Error(errorMessage);
      }

      console.log("Login successful:", responseData); // Debug log
      localStorage.setItem("access", responseData.access);
      localStorage.setItem("refresh", responseData.refresh);
      if (onLogin) onLogin(); // Call the callback on successful login

    } catch (err) {
      console.error("Caught error during login:", err); // Debug log
      setError(err.message || "Wystąpił nieoczekiwany błąd logowania.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
      <Col xs={22} sm={16} md={12} lg={8} xl={6}>
        <Spin spinning={loading} tip="Logowanie...">
          <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>Logowanie</Title>
          {error && (
            <Alert
              message="Błąd logowania"
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
            name="login"
            onFinish={onFinish} // Use onFinish for Ant Design Form
            initialValues={{ remember: true }}
            autoComplete="off"
            layout="vertical" // Vertical layout for labels above inputs
          >
            <Form.Item
              label="Email"
              name="email" // Corresponds to the key in the 'values' object in onFinish
              rules={[
                { required: true, message: 'Proszę podać adres email!' },
                { type: 'email', message: 'Proszę podać poprawny adres email!' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" autoComplete="username" />
            </Form.Item>

            <Form.Item
              label="Hasło"
              name="password" // Corresponds to the key in the 'values' object in onFinish
              rules={[{ required: true, message: 'Proszę podać hasło!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Hasło" autoComplete="current-password" />
            </Form.Item>

            {/* Optional: Remember me checkbox
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Zapamiętaj mnie</Checkbox>
            </Form.Item>
            */}

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Zaloguj się
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Col>
    </Row>
  );
}

export default Login;
