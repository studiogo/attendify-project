import React, { useState } from "react";
import { Link } from 'react-router-dom'; // Import Link
// Import Layout
import { Form, Input, Button, Alert, Spin, Row, Col, Typography, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Content } = Layout; // Import Content from Layout

function Login({ onLogin }) {
  // Removed useState for email and password as Form handles state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // Ant Design Form instance

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    console.log("Attempting login with:", values); // Debug log
    const API_BASE_URL = 'http://localhost:8001'; // Define backend base URL (PORT CHANGED!)

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
    // Apply dark purple gradient background
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #4a0e6c, #8a2be2)' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px' }}>
         {/* Keep the white container for the form */}
        <div style={{ background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', width: '100%', maxWidth: '400px' }}> {/* Slightly stronger shadow */}
          <Spin spinning={loading} tip="Logowanie...">
            <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>Logowanie do Attendify</Title> {/* Updated Title */}
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

            <Form.Item style={{ marginBottom: 0 }}> {/* Remove default bottom margin */}
              <Button type="primary" htmlType="submit" block loading={loading} size="large"> {/* Larger button */}
                Zaloguj się
              </Button>
            </Form.Item>
             {/* Add Forgot Password link */}
             <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <Link to="/forgot-password">Zapomniałeś hasła?</Link>
            </div>
          </Form>
         </Spin>
        </div>
      </Content>
    </Layout>
  );
}

export default Login;
