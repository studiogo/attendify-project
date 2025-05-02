import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
// Add Tooltip and Pie chart
import { Layout, Typography, Spin, Alert, Button, message, List, Card, Row, Col, Space, Popconfirm, Modal, Form, Input, DatePicker, ColorPicker, Statistic, Tooltip } from 'antd'; // Added Tooltip to antd import
import { PlusOutlined, BarChartOutlined, EditOutlined, DeleteOutlined, CodeOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, Legend } from 'recharts'; // Import Recharts components, removed Tooltip

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input; // Import TextArea

// Helper function to get the auth token
const getAuthToken = () => localStorage.getItem('access');
const API_BASE_URL = 'http://localhost:8001'; // Define backend base URL (PORT CHANGED!)

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isWidgetModalVisible, setIsWidgetModalVisible] = useState(false);
  const [widgetCode, setWidgetCode] = useState('');
  const [isStatsModalVisible, setIsStatsModalVisible] = useState(false); // State for stats modal
  const [eventStats, setEventStats] = useState(null); // State for stats data
  const [statsLoading, setStatsLoading] = useState(false); // State for stats loading
  const [form] = Form.useForm();

  // Function to parse date string into Dayjs object for DatePicker
  const parseDate = (dateString) => {
      if (!dateString) return null;
      const date = dayjs(dateString);
      return date.isValid() ? date : null;
  };


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
        message.error(err.message || 'Wystąpił błąd podczas ładowania danych.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" tip="Ładowanie panelu..." />
      </Layout>
    );
  }

  if (error && !user) {
     return (
        <Layout style={{ padding: '20px' }}>
            <Alert message="Błąd krytyczny" description={error} type="error" showIcon />
             <Button onClick={() => window.location.reload()} style={{marginTop: '10px'}}>Spróbuj ponownie</Button>
             <Button onClick={onLogout} style={{marginTop: '10px', marginLeft: '10px'}} type="primary" danger>Wyloguj</Button>
        </Layout>
     );
  }

  // Delete handler
  const handleDelete = async (id) => {
    console.log("Attempting to delete event with id:", id);
    try {
        const response = await fetchAuthenticated(`/api/events/${id}/`, { method: 'DELETE' });
        if (!response.ok) {
             const errorData = await response.text();
             throw new Error(`Błąd usuwania wydarzenia: ${response.statusText} - ${errorData}`);
        }
        message.success('Wydarzenie usunięte pomyślnie!');
        setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    } catch (err) {
        console.error("Error deleting event:", err);
        message.error(err.message || 'Nie udało się usunąć wydarzenia.');
        setError(err.message || 'Nie udało się usunąć wydarzenia.');
    }
  };

  // --- Modal Logic ---
  const showModal = (eventToEdit = null) => {
    setEditingEvent(eventToEdit);
    if (eventToEdit) {
      form.setFieldsValue({
        title: eventToEdit.title,
        description: eventToEdit.description,
        start_datetime: parseDate(eventToEdit.start_datetime),
        end_datetime: parseDate(eventToEdit.end_datetime),
        widget_bg_color: eventToEdit.customization_settings?.bg_color || '#ffffff',
        widget_text_color: eventToEdit.customization_settings?.text_color || '#000000',
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
          widget_bg_color: '#ffffff',
          widget_text_color: '#000000',
      });
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingEvent(null);
  };

  // Combined handler for Create and Update
  const handleModalOk = async (eventId = null) => {
    console.log("handleModalOk called with eventId:", eventId);

    try {
      setModalLoading(true);
      const values = await form.validateFields();

      const formatDateTime = (dayjsObject) => {
          if (!dayjsObject || !dayjs(dayjsObject).isValid()) return null;
          return dayjs(dayjsObject).toISOString();
      }

      const eventData = {
        title: values.title,
        description: values.description || '',
        start_datetime: formatDateTime(values.start_datetime),
        end_datetime: formatDateTime(values.end_datetime),
        customization_settings: {
            bg_color: typeof values.widget_bg_color === 'string' ? values.widget_bg_color : values.widget_bg_color?.toHexString() || '#ffffff',
            text_color: typeof values.widget_text_color === 'string' ? values.widget_text_color : values.widget_text_color?.toHexString() || '#000000',
        }
      };

      if (eventData.start_datetime && eventData.end_datetime && new Date(eventData.end_datetime) <= new Date(eventData.start_datetime)) {
          throw new Error('Data zakończenia musi być późniejsza niż data rozpoczęcia!');
      }
      if (!eventData.start_datetime || !eventData.end_datetime) {
          throw new Error('Data rozpoczęcia i zakończenia są wymagane!');
      }

      console.log("Submitting event data:", eventData);
      const isEditing = eventId !== null;
      const url = isEditing ? `/api/events/${eventId}/` : '/api/events/';
      const method = isEditing ? 'PUT' : 'POST';
      console.log(`Constructed URL: ${url}, Method: ${method}`);

      const response = await fetchAuthenticated(url, {
        method: method,
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `Błąd serwera: ${response.statusText} (${method})` }));
        let errorMessage = errorData.detail || 'Nieznany błąd.';
        if (typeof errorData === 'object' && errorData !== null) {
            const fieldErrors = Object.entries(errorData).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
            if (fieldErrors) errorMessage = fieldErrors;
        }
        const actionType = isEditing ? 'aktualizacji' : 'tworzenia';
        throw new Error(errorMessage || `Nieznany błąd podczas ${actionType} wydarzenia.`);
      }

      const savedEvent = await response.json();
      const successMessage = isEditing ? 'Wydarzenie zaktualizowane pomyślnie!' : 'Wydarzenie utworzone pomyślnie!';
      message.success(successMessage);

      if (isEditing) {
        setEvents(prevEvents => prevEvents.map(event => event.id === eventId ? savedEvent : event));
      } else {
        setEvents(prevEvents => [...prevEvents, savedEvent]);
      }
      setIsModalVisible(false);
      setEditingEvent(null);

    } catch (err) {
       const actionType = eventId !== null ? 'aktualizacji' : 'tworzenia';
      console.error(`Error during event ${actionType}:`, err);
       if (err.errorFields) {
           message.error('Proszę poprawić błędy w formularzu.');
       } else {
           message.error(err.message || `Nie udało się ${actionType === 'aktualizacji' ? 'zaktualizować' : 'utworzyć'} wydarzenia.`);
       }
    } finally {
      setModalLoading(false);
    }
  };
  // --- End Modal Logic ---

  // Edit handler
  const handleEdit = (id) => {
    const eventToEdit = events.find(event => event.id === id);
    if (eventToEdit) {
      console.log("Editing event:", eventToEdit);
      showModal(eventToEdit);
    } else {
      console.error("Event not found for editing:", id);
      message.error("Nie znaleziono wydarzenia do edycji.");
    }
  };

  // Widget handler
  const handleViewWidget = (publicId) => {
    const widgetUrl = `${API_BASE_URL}/widget/event/${publicId}/`;
    const iframeCode = `<iframe src="${widgetUrl}" width="300" height="150" frameborder="0" title="Attendify Widget"></iframe>`;
    setWidgetCode(iframeCode);
    setIsWidgetModalVisible(true);
    console.log("Showing widget code for publicId:", publicId);
  };

  const handleWidgetModalCancel = () => {
    setIsWidgetModalVisible(false);
    setWidgetCode('');
  };

  const copyWidgetCode = () => {
    navigator.clipboard.writeText(widgetCode)
      .then(() => message.success('Kod widżetu skopiowany do schowka!'))
      .catch(err => {
        console.error('Failed to copy widget code: ', err);
        message.error('Nie udało się skopiować kodu.');
      });
  };

  // Stats handler
  const handleViewStats = async (eventId) => {
    console.log("Fetching stats for event id:", eventId);
    setStatsLoading(true);
    setIsStatsModalVisible(true);
    setEventStats(null);
    try {
      const response = await fetchAuthenticated(`/api/events/${eventId}/stats/`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `Błąd serwera: ${response.statusText}` }));
        throw new Error(errorData.detail || 'Nie udało się pobrać statystyk.');
      }
      const statsData = await response.json();
      console.log("Raw stats data from API:", statsData); // <-- ADDED CONSOLE LOG
      setEventStats(statsData);
      console.log("Stats data fetched (state updated):", statsData);
    } catch (err) {
      console.error("Error fetching stats:", err);
      message.error(err.message || 'Nie udało się pobrać statystyk.');
      setIsStatsModalVisible(false);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleStatsModalCancel = () => {
    setIsStatsModalVisible(false);
    setEventStats(null);
  };
  // --- End Stats Modal Logic ---


  return (
    <Layout style={{ minHeight: 'calc(100vh - 64px)' }}>
      <Content style={{ padding: '40px', background: '#f0f2f5' }}>
         <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', maxWidth: '1200px', margin: '0 auto', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)' }}>
            {error && !loading && <Alert message="Błąd pobierania danych" description={error} type="warning" showIcon closable onClose={() => setError(null)} style={{marginBottom: '15px'}} />}

           <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
             <Title level={3} style={{ margin: 0 }}>Twoje Wydarzenia</Title>
             <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}> {/* Call showModal without args for create */}
               Utwórz wydarzenie
             </Button>
           </div>

           {/* List and Card View */}
           <List
               grid={{
                 gutter: 24,
                 xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4,
               }}
               dataSource={events}
               loading={loading && !error}
               renderItem={event => (
                 <List.Item>
                   <Card
                     title={event.title}
                     hoverable
                     style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                     actions={[
                       <Tooltip title="Edytuj" key="edit">
                         <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(event.id)} />
                       </Tooltip>,
                       <Tooltip title="Usuń" key="delete">
                          <Popconfirm
                              title="Na pewno usunąć?"
                              onConfirm={() => handleDelete(event.id)}
                              okText="Tak" cancelText="Nie" placement="top"
                            >
                             <Button type="text" danger icon={<DeleteOutlined />} />
                          </Popconfirm>
                       </Tooltip>,
                       <Tooltip title="Pokaż kod widżetu" key="widget">
                         <Button type="text" icon={<CodeOutlined />} onClick={() => handleViewWidget(event.public_id)} />
                       </Tooltip>,
                       <Tooltip title="Zobacz statystyki" key="stats">
                         <Button type="text" icon={<BarChartOutlined />} onClick={() => handleViewStats(event.id)} />
                       </Tooltip>,
                     ]}
                   >
                     <p><strong>Start:</strong> {event.start_datetime ? dayjs(event.start_datetime).format('DD.MM.YYYY HH:mm') : '-'}</p>
                     <p><strong>Koniec:</strong> {event.end_datetime ? dayjs(event.end_datetime).format('DD.MM.YYYY HH:mm') : '-'}</p>
                   </Card>
                 </List.Item>
               )}
             />
         </div>

        {/* Modal for Creating/Editing Event */}
        <Modal
          title={editingEvent ? "Edytuj wydarzenie" : "Utwórz nowe wydarzenie"}
          visible={isModalVisible}
          onOk={() => handleModalOk(editingEvent ? editingEvent.id : null)}
          onCancel={handleCancel}
          confirmLoading={modalLoading}
          okText={editingEvent ? "Zapisz zmiany" : "Utwórz"}
          cancelText="Anuluj"
          destroyOnClose
        >
          <Form form={form} layout="vertical" name="event_form">
             <Form.Item
              name="title"
              label="Tytuł wydarzenia"
              rules={[{ required: true, message: 'Proszę podać tytuł wydarzenia!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Opis (opcjonalnie)"
            >
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item
              name="start_datetime"
              label="Data i czas rozpoczęcia"
              rules={[{ required: true, message: 'Proszę podać datę i czas rozpoczęcia!' }]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                style={{ width: '100%' }}
                placeholder="Wybierz datę i czas"
                showNow={true} // Dodajemy przycisk "Teraz"
                // Blokujemy daty wcześniejsze niż dzisiejszy dzień (początek dnia)
                disabledDate={(current) => {
                  return current && current < dayjs().startOf('day');
                }}
              />
            </Form.Item>
             <Form.Item
              name="end_datetime"
              label="Data i czas zakończenia"
              rules={[
                { required: true, message: 'Proszę podać datę i czas zakończenia!' },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        const startDate = getFieldValue('start_datetime');
                        if (!value || !startDate) return Promise.resolve(); // Don't validate if start date is not selected
                        // Ensure end date is after start date (moment comparison)
                        if (dayjs(value).isAfter(dayjs(startDate))) {
                             return Promise.resolve();
                        }
                        return Promise.reject(new Error('Data zakończenia musi być późniejsza niż data rozpoczęcia!'));
                    },
                }),
              ]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                style={{ width: '100%' }}
                placeholder="Wybierz datę i czas"
                showNow={true} // Dodajemy przycisk "Teraz"
                // Blokujemy daty wcześniejsze niż wybrana data rozpoczęcia (lub dzisiejszy dzień, jeśli start nie jest wybrany)
                disabledDate={(current) => {
                    const startDate = form.getFieldValue('start_datetime');
                    if (startDate) {
                        // Disable dates before the start date (start of the day)
                        return current && current < dayjs(startDate).startOf('day');
                    }
                    // If start date is not selected, disable dates before today
                    return current && current < dayjs().startOf('day');
                }}
               />
            </Form.Item>
            <Form.Item name="widget_bg_color" label="Kolor tła widżetu">
              <ColorPicker showText />
            </Form.Item>
             <Form.Item name="widget_text_color" label="Kolor tekstu widżetu">
               <ColorPicker showText />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal for Displaying Widget Code */}
        <Modal
          title="Kod widżetu (iframe)"
          visible={isWidgetModalVisible}
          onCancel={handleWidgetModalCancel}
          footer={[
            <Button key="copy" type="primary" onClick={copyWidgetCode}>Kopiuj kod</Button>,
            <Button key="back" onClick={handleWidgetModalCancel}>Zamknij</Button>,
          ]}
        >
          <p>Umieść poniższy kod HTML na swojej stronie, aby wyświetlić widżet:</p>
          <Input.TextArea readOnly value={widgetCode} rows={4} style={{ fontFamily: 'monospace', marginTop: '10px' }}/>
        </Modal>

         {/* Modal for Displaying Event Stats */}
         <Modal
          title={`Statystyki dla: ${eventStats?.event_title || 'Wydarzenie'}`}
          visible={isStatsModalVisible}
          onCancel={handleStatsModalCancel}
          footer={[ <Button key="back" onClick={handleStatsModalCancel}>Zamknij</Button> ]}
        >
          {statsLoading && <Spin tip="Ładowanie statystyk..." />}
           {!statsLoading && eventStats && (
            <Space direction="vertical" size="large" style={{width: '100%'}}>
               <Statistic title="Łączna liczba kliknięć 'Dodaj do kalendarza'" value={eventStats.total_clicks} />

                {/* Chart Section */}
                {eventStats.total_clicks > 0 ? (
                  <>
                    <Title level={5} style={{ marginTop: '20px', marginBottom: '0px' }}>Podział kliknięć wg typu kalendarza:</Title>
                    {(processedChartData => { // <-- ADDED IIFE FOR LOGGING
                      console.log("Data prepared for PieChart:", processedChartData);
                      return (
                        <PieChart width={400} height={250}> {/* Adjust width/height as needed */}
                          <Pie
                            data={processedChartData}
                       dataKey="value"
                       nameKey="name"
                       cx="50%"
                       cy="50%"
                       outerRadius={80} // Adjust radius as needed
                       fill="#8884d8" // Default fill color
                       labelLine={false} // Hide label lines
                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} // Label format
                     >
                       {/* You can define custom colors for each slice using Cell */}
                       {Object.entries(eventStats.clicks_by_type || {})
                         .filter(([type, value]) => value > 0)
                         .map(([type, value], index) => {
                           // Define colors based on type or index
                           const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Example colors
                           return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                         })}
                     </Pie>
                          <Tooltip formatter={(value, name) => [`${value} kliknięć`, name]} /> {/* Custom tooltip */}
                          <Legend /> {/* Legend */}
                        </PieChart>
                      );
                    })(Object.entries(eventStats.clicks_by_type || {})
                      .map(([type, value]) => ({ name: type.charAt(0).toUpperCase() + type.slice(1), value: value || 0 })) // Format data for Recharts: [{ name: 'Google', value: 5 }, ...]
                      .filter(item => item.value > 0) // Show only types with clicks > 0
                    )}
                  </>
                ) : (
                  <Text type="secondary">Brak zarejestrowanych kliknięć dla tego wydarzenia.</Text>
               )}

               {/* Original Statistics (optional, can be removed if chart is sufficient) */}
               {/*
               <Title level={5}>Kliknięcia wg typu kalendarza (dane):</Title>
               <Space wrap>
                    <Statistic title="Google Calendar" value={eventStats.clicks_by_type?.google || 0} />
                    <Statistic title=".ICS (Outlook/Apple)" value={eventStats.clicks_by_type?.ics || 0} />
                    <Statistic title="Outlook (jeśli oddzielnie)" value={eventStats.clicks_by_type?.outlook || 0} />
               </Space>
               */}
            </Space>
          )}
           {!statsLoading && !eventStats && ( <Alert message="Nie można załadować statystyk." type="error" /> )}
        </Modal>

      </Content>
    </Layout>
  );
}

export default Dashboard;
