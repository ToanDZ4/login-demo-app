import React, { useState } from 'react';
import './Login.css';

interface Customer {
  id: number;
  name: string;
  email: string;
  registrationDate: string;
  lastVisit: string;
  visitCount: number;
  status: 'new' | 'returning';
}

const mockCustomers: Customer[] = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', registrationDate: '2024-01-15', lastVisit: '2024-01-20', visitCount: 3, status: 'returning' },
  { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', registrationDate: '2024-01-18', lastVisit: '2024-01-18', visitCount: 1, status: 'new' },
  { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', registrationDate: '2024-01-10', lastVisit: '2024-01-19', visitCount: 5, status: 'returning' },
  { id: 4, name: 'Phạm Thị D', email: 'phamthid@email.com', registrationDate: '2024-01-20', lastVisit: '2024-01-20', visitCount: 1, status: 'new' }
];

const AdminDashboard: React.FC = () => {
  const [customers] = useState<Customer[]>(mockCustomers);
  const [filter, setFilter] = useState<'all' | 'new' | 'returning'>('all');

  const newCustomers = customers.filter(c => c.status === 'new');
  const returningCustomers = customers.filter(c => c.status === 'returning');

  const filteredCustomers = filter === 'all' ? customers : customers.filter(c => c.status === filter);

  return (
    <div className="login-container">
      <div className="login-form" style={{ maxWidth: 800 }}>
        <h2>Dashboard - Theo dõi khách hàng</h2>
        
        {/* Thống kê tổng quan */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 30 }}>
          <div style={{ flex: 1, padding: 20, backgroundColor: '#e3f2fd', borderRadius: 8 }}>
            <h3>Khách mới</h3>
            <p style={{ fontSize: 24, fontWeight: 'bold', color: '#1976d2' }}>{newCustomers.length}</p>
            <p>Đăng ký trong tháng này</p>
          </div>
          <div style={{ flex: 1, padding: 20, backgroundColor: '#f3e5f5', borderRadius: 8 }}>
            <h3>Khách quay lại</h3>
            <p style={{ fontSize: 24, fontWeight: 'bold', color: '#7b1fa2' }}>{returningCustomers.length}</p>
            <p>Đã sử dụng dịch vụ</p>
          </div>
          <div style={{ flex: 1, padding: 20, backgroundColor: '#e8f5e8', borderRadius: 8 }}>
            <h3>Tổng khách hàng</h3>
            <p style={{ fontSize: 24, fontWeight: 'bold', color: '#388e3c' }}>{customers.length}</p>
            <p>Tất cả khách hàng</p>
          </div>
        </div>

        {/* Bộ lọc */}
        <div style={{ marginBottom: 20 }}>
          <label>Lọc theo: </label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as 'all' | 'new' | 'returning')}
            style={{ marginLeft: 10, padding: 5, borderRadius: 4 }}
          >
            <option value="all">Tất cả</option>
            <option value="new">Khách mới</option>
            <option value="returning">Khách quay lại</option>
          </select>
        </div>

        {/* Danh sách khách hàng */}
        <div>
          <h3>Danh sách khách hàng</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: 10, textAlign: 'left', borderBottom: '1px solid #ddd' }}>Tên</th>
                <th style={{ padding: 10, textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: 10, textAlign: 'left', borderBottom: '1px solid #ddd' }}>Ngày đăng ký</th>
                <th style={{ padding: 10, textAlign: 'left', borderBottom: '1px solid #ddd' }}>Lần cuối</th>
                <th style={{ padding: 10, textAlign: 'left', borderBottom: '1px solid #ddd' }}>Số lần ghé</th>
                <th style={{ padding: 10, textAlign: 'left', borderBottom: '1px solid #ddd' }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{customer.name}</td>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{customer.email}</td>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{customer.registrationDate}</td>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{customer.lastVisit}</td>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>{customer.visitCount}</td>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: 4, 
                      fontSize: 12,
                      backgroundColor: customer.status === 'new' ? '#e3f2fd' : '#f3e5f5',
                      color: customer.status === 'new' ? '#1976d2' : '#7b1fa2'
                    }}>
                      {customer.status === 'new' ? 'Khách mới' : 'Khách quay lại'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Gợi ý chăm sóc khách hàng */}
        <div style={{ marginTop: 30, padding: 20, backgroundColor: '#fff3e0', borderRadius: 8 }}>
          <h3>Gợi ý chăm sóc khách hàng</h3>
          <ul>
            <li>Gửi email chào mừng cho {newCustomers.length} khách mới</li>
            <li>Ưu đãi đặc biệt cho {returningCustomers.length} khách quay lại</li>
            <li>Khảo sát mức độ hài lòng của khách hàng</li>
            <li>Chương trình khách hàng thân thiết</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 