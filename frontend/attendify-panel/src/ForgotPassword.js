import React, { useState } from 'react';
import { Form, Input, Button, Alert, Spin, Typography, Layout, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'; // Import Link

const { Title } = Typography;
const { Content } = Layout;
const API_BASE_URL = 'http://localhost:8001'; // Consider moving to config

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // To show success message
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    console.log('Requesting password reset for:', values.email);

    try {
      // Note: We are calling Django's built-in view URL directly here.
      // This view expects form-encoded data, not JSON by default.
      // For simplicity, we'll try sending JSON first. If it fails, we might need
      // to adjust the request or create a custom DRF endpoint.
      const response = await fetch(`${API_BASE_URL}/api/auth/password/reset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      });

      // Django's PasswordResetView redirects on success (302) or shows a form on GET/error.
      // It doesn't typically return JSON unless customized heavily.
      // We'll check for a successful status range (2xx) or redirect (3xx) as success indication.
      // A 400 might indicate the email doesn't exist (though Django's default doesn't reveal this).
      if (response.ok || (response.status >= 300 && response.status < 400)) {
        console.log('Password reset email request successful (check console for email).');
        setSuccess(true);
        form.resetFields();
      } else {
        // Try to get error message if possible (might be HTML)
        const errorText = await response.text();
        console.error('Password reset request failed:', response.status, errorText);
        // Try parsing as JSON in case a custom error is returned
        let detail = 'Nie udało się wysłać linku resetującego. Spróbuj ponownie.';
        try {
            const errorData = JSON.parse(errorText);
            detail = errorData.detail || errorData.email || detail;
        } catch (e) { /* Ignore JSON parse error if response is not JSON */ }
        throw new Error(detail);
      }
    } catch (err) {
      console.error('Caught error during password reset request:', err);
      setError(err.message || 'Wystąpił nieoczekiwany błąd.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #4a0e6c, #8a2be2)' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px' }}>
        <div style={{ background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', width: '100%', maxWidth: '400px' }}>
          <Spin spinning={loading} tip="Wysyłanie...">
            <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>Resetowanie Hasła</Title>

            {success && (
              <Alert
                message="Link wysłany!"
                description="Jeśli konto istnieje, link do zresetowania hasła został wysłany na podany adres email (sprawdź konsolę serwera deweloperskiego)."
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
              <Form form={form} name="forgot_password" onFinish={onFinish} layout="vertical">
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
                <Form.Item style={{ marginBottom: '10px' }}>
                  <Button type="primary" htmlType="submit" block loading={loading} size="large">
                    Wyślij link resetujący
                  </Button>
                </Form.Item>
              </Form>
            )}
             <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/login">Wróć do logowania</Link>
            </div>
          </Spin>
        </div>
      </Content>
    </Layout>
  );
}

export default ForgotPassword;
