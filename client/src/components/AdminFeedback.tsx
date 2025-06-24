import React, { useState } from 'react';
import './Login.css';

interface Feedback {
  id: number;
  customer: string;
  content: string;
  response?: string;
}

const initialFeedbacks: Feedback[] = [
  { id: 1, customer: 'Nguyễn Văn A', content: 'Dịch vụ rất tốt, nhưng phòng hơi nhỏ.' },
  { id: 2, customer: 'Trần Thị B', content: 'Nhân viên thân thiện, bữa sáng ngon.' },
  { id: 3, customer: 'Lê Văn C', content: 'Cần cải thiện wifi ở tầng 3.' }
];

const AdminFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [response, setResponse] = useState('');

  const handleSelect = (id: number) => {
    setSelectedId(id);
    const fb = feedbacks.find(f => f.id === id);
    setResponse(fb?.response || '');
  };

  const handleResponse = () => {
    setFeedbacks(fbs => fbs.map(fb => fb.id === selectedId ? { ...fb, response } : fb));
    setSelectedId(null);
    setResponse('');
  };

  return (
    <div className="login-container">
      <div className="login-form" style={{ maxWidth: 600 }}>
        <h2>Quản lý đánh giá & góp ý của khách</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {feedbacks.map(fb => (
            <li key={fb.id} style={{ marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
              <strong>{fb.customer}:</strong> {fb.content}
              <div>
                {fb.response ? (
                  <span style={{ color: 'green' }}>Đã phản hồi: {fb.response}</span>
                ) : (
                  <button className="login-button" style={{ width: 'auto', marginTop: 8 }} onClick={() => handleSelect(fb.id)}>
                    Phản hồi
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
        {selectedId && (
          <div style={{ marginTop: 24 }}>
            <h3>Phản hồi cho khách</h3>
            <textarea
              style={{ width: '100%', minHeight: 60, marginBottom: 8, borderRadius: 4, border: '1px solid #ddd', padding: 8 }}
              value={response}
              onChange={e => setResponse(e.target.value)}
              placeholder="Nhập phản hồi của bạn..."
            />
            <button className="login-button" style={{ width: 'auto' }} onClick={handleResponse}>
              Gửi phản hồi
            </button>
            <button style={{ marginLeft: 8 }} onClick={() => setSelectedId(null)}>
              Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedback; 