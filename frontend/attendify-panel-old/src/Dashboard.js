import React, { useState, useEffect } from 'react';
import { Layout, Typography, Spin, Alert, Button, message, Table, Space, Popconfirm } from 'antd'; // Added Table, Space, Popconfirm
import { PlusOutlined } from '@ant-design/icons'; // Import PlusOutlined icon

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// Helper function to get the auth token
const getAuthToken = () => localStorage.getItem('access');
const API_BASE_URL = 'http://localhost:8000'; // Define backend base URL

// Helper function for making authenticated API requests
const fetchAuthenticated = async (relativePath, options = {}) => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${relativePath}`; // Construct full URL
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Handle unauthorized access, e.g., redirect to login or refresh token
    console.error("Unauthorized access - Token might be invalid or expired.");
    // For now, just throw an error or trigger logout
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/login'; // Force redirect if unauthorized
    throw new Error("Sesja wygasła lub jest nieprawidłowa. Proszę zalogować się ponownie.");
  }

  return response;
};


function Dashboard({ onLogout }) { // Receive onLogout prop from App.js
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch user data
        const userResponse = await fetchAuthenticated('/api/auth/me/');
        if (!userResponse.ok) {
          const errorData = await userResponse.json().catch(() => ({}));
          throw new Error(errorData.detail || `Błąd pobierania danych użytkownika: ${userResponse.statusText}`);
        }
        const userData = await userResponse.json();
        setUser(userData);
        console.log("User data fetched:", userData);

        // Fetch events data
        const eventsResponse = await fetchAuthenticated('/api/events/');
        if (!eventsResponse.ok) {
           const errorData = await eventsResponse.json().catch(() => ({}));
          throw new Error(errorData.detail ||`Błąd pobierania wydarzeń: ${eventsResponse.statusText}`);
        }
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
        console.log("Events data fetched:", eventsData);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || 'Wystąpił błąd podczas ładowania danych.');
        // Display error message to the user
        message.error(err.message || 'Wystąpił błąd podczas ładowania danych.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" tip="Ładowanie panelu..." />
      </Layout>
    );
  }

  // Don't render the rest if there was a critical error during fetch
  // Error message is shown via message.error
  // A more robust solution might show an error component instead
  if (error && !user) {
     return (
        <Layout style={{ padding: '20px' }}>
            <Alert message="Błąd krytyczny" description={error} type="error" showIcon />
             <Button onClick={() => window.location.reload()} style={{marginTop: '10px'}}>Spróbuj ponownie</Button>
             <Button onClick={onLogout} style={{marginTop: '10px', marginLeft: '10px'}} type="primary" danger>Wyloguj</Button>
        </Layout>
     );
  }

  // Define columns for the events table
  const columns = [
    {
      title: 'Nazwa wydarzenia',
      dataIndex: 'name',
      key: 'name',
      // TODO: Add link to event details page?
    },
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
      render: (text) => text ? new Date(text).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-', // Format date and time
    },
    {
      title: 'Public ID', // For iframe generation etc.
      dataIndex: 'public_id',
      key: 'public_id',
    },
    {
      title: 'Akcje',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {/* TODO: Implement Edit functionality (e.g., open modal or navigate) */}
          <Button type="link" onClick={() => handleEdit(record.id)}>Edytuj</Button>
          {/* TODO: Implement Delete functionality */}
          <Popconfirm
            title="Czy na pewno chcesz usunąć to wydarzenie?"
            onConfirm={() => handleDelete(record.id)}
            okText="Tak, usuń"
            cancelText="Nie"
            placement="topRight"
          >
            <Button type="link" danger>Usuń</Button>
          </Popconfirm>
           {/* TODO: Add button to view/copy iframe code */}
           <Button type="link" onClick={() => handleViewWidget(record.public_id)}>Widget</Button>
        </Space>
      ),
    },
  ];

  // Placeholder for delete handler
  const handleDelete = async (id) => {
    console.log("Attempting to delete event with id:", id);
    // TODO: Implement API call to delete event
    try {
        const response = await fetchAuthenticated(`/api/events/${id}/`, { method: 'DELETE' });
        if (!response.ok) {
             const errorData = await response.text(); // Get text for potential non-JSON errors
             throw new Error(`Błąd usuwania wydarzenia: ${response.statusText} - ${errorData}`);
        }
        message.success('Wydarzenie usunięte pomyślnie!');
        // Refresh events list
        setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    } catch (err) {
        console.error("Error deleting event:", err);
        message.error(err.message || 'Nie udało się usunąć wydarzenia.');
        setError(err.message || 'Nie udało się usunąć wydarzenia.');
    }
  };

  // Placeholder for create handler
  const handleCreate = () => {
    console.log("Create new event button clicked");
    message.info('Funkcja tworzenia wydarzenia nie jest jeszcze zaimplementowana.');
    // TODO: Implement modal or navigation for creating event form
  };

   // Placeholder for edit handler
  const handleEdit = (id) => {
    console.log("Edit event with id:", id);
    message.info('Funkcja edycji nie jest jeszcze zaimplementowana.');
    // TODO: Implement modal or navigation for editing event form
  };

  // Placeholder for view widget handler
  const handleViewWidget = (publicId) => {
    console.log("View widget for publicId:", publicId);
    message.info('Funkcja podglądu widgetu nie jest jeszcze zaimplementowana.');
     // TODO: Implement modal showing iframe code and preview
  };


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>Attendify Dashboard</Title>
        <div>
          <Text style={{ color: 'white', marginRight: '15px' }}>
            Witaj, {user?.email || 'Użytkowniku'}!
          </Text>
          <Button type="primary" danger onClick={onLogout}>
            Wyloguj
          </Button>
        </div>
      </Header>
      <Content style={{ padding: '20px 50px' }}>
         {error && !loading && <Alert message="Błąd pobierania danych" description={error} type="warning" showIcon closable onClose={() => setError(null)} style={{marginBottom: '15px'}} />}

        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>Twoje Wydarzenia</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Utwórz wydarzenie
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={events}
          rowKey="id" // Use event id as the key for each row
          loading={loading && !error} // Show loading state on the table only if no critical error occurred
          pagination={{ pageSize: 10 }} // Optional: Add pagination
          scroll={{ x: 'max-content' }} // Optional: Add horizontal scroll if content overflows
        />
      </Content>
    </Layout>
  );
}

export default Dashboard;
