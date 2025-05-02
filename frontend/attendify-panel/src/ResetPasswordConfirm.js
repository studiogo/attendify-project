import React, { useState } from 'react';
import { Form, Input, Button, Alert, Spin, Typography, Layout, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import useParams and useNavigate

const { Title } = Typography;
const { Content } = Layout;
const API_BASE_URL = 'http://localhost:8001'; // Consider moving to config

function ResetPasswordConfirm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [form] = Form.useForm();
  const { uid, token } = useParams(); // Get uid and token from URL parameters
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    console.log('Attempting to set new password');

    // Backend view expects new_password1 and new_password2
    const data = {
      new_password1: values.password,
      new_password2: values.confirmPassword,
      uid: uid, // Add uid and token from URL
      token: token,
    };

    try {
      // Call the new DRF API endpoint for setting the password
      const response = await fetch(`${API_BASE_URL}/api/auth/password/set-new/`, { // Use the new fixed path
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), // Send uid, token, new_password1, new_password2
      });

      // Expect JSON response from DRF view
      const responseData = await response.json();

      if (response.ok) { // Check for 200 OK status
        console.log('Password reset successful.');
        setSuccess(true);
        form.resetFields();
        // Optionally redirect to login after a delay
        setTimeout(() => navigate('/login'), 3000);
      } else {
        console.error('Password reset confirmation failed:', response.status, responseData);
        // Extract error message from DRF response
        let errorMessage = 'Nie udało się zresetować hasła. Link mógł wygasnąć lub jest nieprawidłowy.';
        if (responseData) {
            const errorDetails = Object.entries(responseData)
                .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                .join('; ');
            if (errorDetails) errorMessage = errorDetails;
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('Caught error during password reset confirmation:', err);
      setError(err.message || 'Wystąpił nieoczekiwany błąd.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #4a0e6c, #8a2be2)' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px' }}>
        <div style={{ background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', width: '100%', maxWidth: '400px' }}>
          <Spin spinning={loading} tip="Zapisywanie...">
            <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>Ustaw Nowe Hasło</Title>

            {success && (
              <Alert
                message="Hasło zmienione!"
                description="Twoje hasło zostało pomyślnie zaktualizowane. Za chwilę zostaniesz przekierowany do strony logowania."
                type="success"
                showIcon
                style={{ marginBottom: '24px' }}
              />
            )}
            {error && (
              <Alert
                message="Błąd"
                description={error}
                type="error"
                showIcon
                closable
                onClose={() => setError(null)}
                style={{ marginBottom: '24px' }}
              />
            )}

            {!success && ( // Hide form on success
              <Form form={form} name="reset_password_confirm" onFinish={onFinish} layout="vertical">
                <Form.Item
                  label="Nowe hasło"
                  name="password"
                  rules={[{ required: true, message: 'Proszę podać nowe hasło!' }]}
                  hasFeedback
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Nowe hasło" />
                </Form.Item>
                <Form.Item
                  label="Potwierdź nowe hasło"
                  name="confirmPassword"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    { required: true, message: 'Proszę potwierdzić nowe hasło!' },
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
                  <Input.Password prefix={<LockOutlined />} placeholder="Potwierdź nowe hasło" />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button type="primary" htmlType="submit" block loading={loading} size="large">
                    Ustaw nowe hasło
                  </Button>
                </Form.Item>
              </Form>
            )}
             {success && (
                 <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link to="/login">Przejdź do logowania</Link>
                </div>
             )}
          </Spin>
        </div>
      </Content>
    </Layout>
  );
}

export default ResetPasswordConfirm;
