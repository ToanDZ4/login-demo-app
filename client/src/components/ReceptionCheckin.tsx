import React, { useState } from 'react';
import './Login.css';

interface Room {
  id: number;
  number: string;
  type: string;
  status: 'ready' | 'cleaning' | 'occupied';
}

interface Guest {
  name: string;
  phone: string;
  email: string;
  idCard: string;
  checkInDate: string;
  checkOutDate: string;
  roomNumber: string;
  keyNumber: string;
}

const availableRooms: Room[] = [
  { id: 1, number: '101', type: 'Phòng đơn', status: 'ready' },
  { id: 2, number: '201', type: 'Phòng đôi', status: 'ready' },
  { id: 3, number: '301', type: 'Phòng VIP', status: 'ready' },
  { id: 4, number: '401', type: 'Suite', status: 'ready' }
];

const ReceptionCheckin: React.FC = () => {
  const [guest, setGuest] = useState<Guest>({
    name: '',
    phone: '',
    email: '',
    idCard: '',
    checkInDate: '',
    checkOutDate: '',
    roomNumber: '',
    keyNumber: ''
  });
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checkinHistory, setCheckinHistory] = useState<Guest[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuest(prev => ({ ...prev, [name]: value }));
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setGuest(prev => ({ 
      ...prev, 
      roomNumber: room.number,
      keyNumber: `K${room.number}` // Tạo số chìa khóa từ số phòng
    }));
  };

  const handleCheckin = () => {
    if (!selectedRoom || !guest.name || !guest.phone || !guest.idCard) {
      alert('Vui lòng nhập đầy đủ thông tin khách và chọn phòng');
      return;
    }

    const newCheckin = {
      ...guest,
      checkInDate: guest.checkInDate || new Date().toISOString().split('T')[0]
    };

    setCheckinHistory(prev => [newCheckin, ...prev]);
    
    // Reset form
    setGuest({
      name: '',
      phone: '',
      email: '',
      idCard: '',
      checkInDate: '',
      checkOutDate: '',
      roomNumber: '',
      keyNumber: ''
    });
    setSelectedRoom(null);

    alert(`Check-in thành công!\nKhách: ${newCheckin.name}\nPhòng: ${newCheckin.roomNumber}\nChìa khóa: ${newCheckin.keyNumber}`);
  };

  return (
    <div className="login-container">
      <div className="login-form" style={{ maxWidth: 1000 }}>
        <h2>Check-in Khách - Lễ tân</h2>
        
        <div style={{ display: 'flex', gap: 20 }}>
          {/* Form nhập thông tin khách */}
          <div style={{ flex: 1 }}>
            <h3>Thông tin khách</h3>
            <div className="form-group">
              <label>Họ tên khách *</label>
              <input
                type="text"
                name="name"
                value={guest.name}
                onChange={handleInputChange}
                placeholder="Nhập họ tên khách"
                required
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại *</label>
              <input
                type="tel"
                name="phone"
                value={guest.phone}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={guest.email}
                onChange={handleInputChange}
                placeholder="Nhập email (tùy chọn)"
              />
            </div>
            <div className="form-group">
              <label>CMND/CCCD *</label>
              <input
                type="text"
                name="idCard"
                value={guest.idCard}
                onChange={handleInputChange}
                placeholder="Nhập số CMND/CCCD"
                required
              />
            </div>
            <div className="form-group">
              <label>Ngày check-in</label>
              <input
                type="date"
                name="checkInDate"
                value={guest.checkInDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Ngày check-out</label>
              <input
                type="date"
                name="checkOutDate"
                value={guest.checkOutDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Danh sách phòng sẵn sàng */}
          <div style={{ flex: 1 }}>
            <h3>Chọn phòng</h3>
            <div style={{ marginBottom: 15 }}>
              <p style={{ color: '#666', fontSize: 14 }}>Phòng sẵn sàng ({availableRooms.length})</p>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {availableRooms.map(room => (
                <div
                  key={room.id}
                  style={{
                    border: selectedRoom?.id === room.id ? '2px solid #007bff' : '1px solid #ddd',
                    borderRadius: 8,
                    padding: 15,
                    cursor: 'pointer',
                    backgroundColor: selectedRoom?.id === room.id ? '#f0f8ff' : 'white'
                  }}
                  onClick={() => handleRoomSelect(room)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0' }}>Phòng {room.number}</h4>
                      <p style={{ margin: 0, color: '#666' }}>{room.type}</p>
                    </div>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      backgroundColor: '#e8f5e8',
                      color: '#4caf50'
                    }}>
                      Sẵn sàng
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Thông tin phòng đã chọn */}
            {selectedRoom && (
              <div style={{ 
                marginTop: 20, 
                padding: 15, 
                backgroundColor: '#f9f9f9', 
                borderRadius: 8,
                border: '1px solid #ddd'
              }}>
                <h4>Phòng đã chọn</h4>
                <p><strong>Phòng:</strong> {selectedRoom.number}</p>
                <p><strong>Loại:</strong> {selectedRoom.type}</p>
                <p><strong>Chìa khóa:</strong> {guest.keyNumber}</p>
              </div>
            )}
          </div>
        </div>

        {/* Nút check-in */}
        <div style={{ marginTop: 30, textAlign: 'center' }}>
          <button 
            className="login-button" 
            style={{ width: 'auto', padding: '12px 30px', fontSize: 16 }}
            onClick={handleCheckin}
          >
            Tiến hành Check-in
          </button>
        </div>

        {/* Lịch sử check-in */}
        <div style={{ marginTop: 30 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h3>Lịch sử check-in hôm nay</h3>
            <button 
              style={{ padding: '8px 16px', borderRadius: 4, border: '1px solid #ddd', backgroundColor: 'white' }}
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Ẩn' : 'Hiện'} lịch sử
            </button>
          </div>
          
          {showHistory && (
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              {checkinHistory.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666' }}>Chưa có check-in nào hôm nay</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: 10, textAlign: 'left', borderBottom: '1px solid #ddd' }}>Khách</th>
                      <th style={{ padding: 10, textAlign: 'left', borderBottom: '1px solid #ddd' }}>Phòng</th>
                      <th style={{ padding: 10, textAlign: 'left', borderBottom: '1px solid #ddd' }}>Chìa khóa</th>
                      <th style={{ padding: 10, textAlign: 'left', borderBottom: '1px solid #ddd' }}>Thời gian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkinHistory.map((checkin, index) => (
                      <tr key={index}>
                        <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{checkin.name}</td>
                        <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{checkin.roomNumber}</td>
                        <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{checkin.keyNumber}</td>
                        <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{checkin.checkInDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceptionCheckin; 