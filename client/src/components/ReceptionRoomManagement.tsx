import React, { useState } from 'react';
import './Login.css';

interface Room {
  id: number;
  number: string;
  type: string;
  status: 'ready' | 'cleaning' | 'occupied';
  lastUpdated: string;
  notes?: string;
}

const initialRooms: Room[] = [
  { id: 1, number: '101', type: 'Phòng đơn', status: 'ready', lastUpdated: '2024-01-20 10:30', notes: 'Sẵn sàng đón khách' },
  { id: 2, number: '102', type: 'Phòng đôi', status: 'cleaning', lastUpdated: '2024-01-20 11:15', notes: 'Đang vệ sinh' },
  { id: 3, number: '103', type: 'Phòng đơn', status: 'occupied', lastUpdated: '2024-01-20 09:00', notes: 'Khách check-in lúc 9:00' },
  { id: 4, number: '201', type: 'Phòng đôi', status: 'ready', lastUpdated: '2024-01-20 08:45', notes: 'Đã vệ sinh xong' },
  { id: 5, number: '202', type: 'Phòng đơn', status: 'cleaning', lastUpdated: '2024-01-20 12:00', notes: 'Khách check-out, đang vệ sinh' },
  { id: 6, number: '203', type: 'Phòng đôi', status: 'occupied', lastUpdated: '2024-01-20 10:00', notes: 'Khách đang ở' }
];

const ReceptionRoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [newStatus, setNewStatus] = useState<'ready' | 'cleaning' | 'occupied'>('ready');
  const [notes, setNotes] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return '#4caf50';
      case 'cleaning': return '#ff9800';
      case 'occupied': return '#f44336';
      default: return '#757575';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Sẵn sàng';
      case 'cleaning': return 'Đang vệ sinh';
      case 'occupied': return 'Đã có khách';
      default: return 'Không xác định';
    }
  };

  const handleUpdateStatus = () => {
    if (!selectedRoom) return;

    const updatedRooms = rooms.map(room => 
      room.id === selectedRoom.id 
        ? { 
            ...room, 
            status: newStatus, 
            notes: notes || room.notes,
            lastUpdated: new Date().toLocaleString('vi-VN')
          }
        : room
    );

    setRooms(updatedRooms);
    setSelectedRoom(null);
    setNewStatus('ready');
    setNotes('');
  };

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setNewStatus(room.status);
    setNotes(room.notes || '');
  };

  const getStatusCount = (status: string) => {
    return rooms.filter(room => room.status === status).length;
  };

  return (
    <div className="login-container">
      <div className="login-form" style={{ maxWidth: 900 }}>
        <h2>Quản lý tình trạng phòng - Lễ tân</h2>
        
        {/* Thống kê tổng quan */}
        <div style={{ display: 'flex', gap: 15, marginBottom: 30 }}>
          <div style={{ flex: 1, padding: 15, backgroundColor: '#e8f5e8', borderRadius: 8, textAlign: 'center' }}>
            <h3 style={{ color: '#4caf50', margin: 0 }}>Sẵn sàng</h3>
            <p style={{ fontSize: 24, fontWeight: 'bold', margin: '10px 0' }}>{getStatusCount('ready')}</p>
          </div>
          <div style={{ flex: 1, padding: 15, backgroundColor: '#fff3e0', borderRadius: 8, textAlign: 'center' }}>
            <h3 style={{ color: '#ff9800', margin: 0 }}>Đang vệ sinh</h3>
            <p style={{ fontSize: 24, fontWeight: 'bold', margin: '10px 0' }}>{getStatusCount('cleaning')}</p>
          </div>
          <div style={{ flex: 1, padding: 15, backgroundColor: '#ffebee', borderRadius: 8, textAlign: 'center' }}>
            <h3 style={{ color: '#f44336', margin: 0 }}>Đã có khách</h3>
            <p style={{ fontSize: 24, fontWeight: 'bold', margin: '10px 0' }}>{getStatusCount('occupied')}</p>
          </div>
        </div>

        {/* Danh sách phòng */}
        <div style={{ marginBottom: 30 }}>
          <h3>Danh sách phòng</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 15 }}>
            {rooms.map(room => (
              <div 
                key={room.id} 
                style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: 8, 
                  padding: 15,
                  cursor: 'pointer',
                  backgroundColor: selectedRoom?.id === room.id ? '#f5f5f5' : 'white'
                }}
                onClick={() => handleSelectRoom(room)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <h4 style={{ margin: 0 }}>Phòng {room.number}</h4>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: 4, 
                    fontSize: 12,
                    backgroundColor: getStatusColor(room.status) + '20',
                    color: getStatusColor(room.status)
                  }}>
                    {getStatusText(room.status)}
                  </span>
                </div>
                <p style={{ margin: '5px 0', color: '#666' }}>{room.type}</p>
                <p style={{ margin: '5px 0', fontSize: 12, color: '#999' }}>
                  Cập nhật: {room.lastUpdated}
                </p>
                {room.notes && (
                  <p style={{ margin: '5px 0', fontSize: 12, fontStyle: 'italic', color: '#666' }}>
                    Ghi chú: {room.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form cập nhật trạng thái */}
        {selectedRoom && (
          <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 20, backgroundColor: '#f9f9f9' }}>
            <h3>Cập nhật trạng thái - Phòng {selectedRoom.number}</h3>
            <div style={{ marginBottom: 15 }}>
              <label>Trạng thái mới: </label>
              <select 
                value={newStatus} 
                onChange={(e) => setNewStatus(e.target.value as 'ready' | 'cleaning' | 'occupied')}
                style={{ marginLeft: 10, padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
              >
                <option value="ready">Sẵn sàng</option>
                <option value="cleaning">Đang vệ sinh</option>
                <option value="occupied">Đã có khách</option>
              </select>
            </div>
            <div style={{ marginBottom: 15 }}>
              <label>Ghi chú: </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú (tùy chọn)..."
                style={{ 
                  width: '100%', 
                  minHeight: 60, 
                  marginTop: 5, 
                  padding: 8, 
                  borderRadius: 4, 
                  border: '1px solid #ddd' 
                }}
              />
            </div>
            <div>
              <button 
                className="login-button" 
                style={{ width: 'auto', marginRight: 10 }}
                onClick={handleUpdateStatus}
              >
                Cập nhật
              </button>
              <button 
                style={{ padding: '8px 16px', borderRadius: 4, border: '1px solid #ddd', backgroundColor: 'white' }}
                onClick={() => setSelectedRoom(null)}
              >
                Hủy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceptionRoomManagement; 