import './userManagement.css'

const USERS = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@email.com', status: 'Active' },
  { id: 2, name: 'Nguyễn Văn A', email: 'a@email.com', status: 'Active' },
  { id: 3, name: 'Nguyễn Văn A', email: 'a@email.com', status: 'Active' },
]

export default function UserManagement() {
  return (
    <>
      <h1 className="admin-page-title">Quản lý người dùng</h1>
      <div className="um-table-wrap">
        <table className="um-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th className="um-col-actions">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>
                  <a className="um-email" href={`mailto:${u.email}`}>
                    {u.email}
                  </a>
                </td>
                <td>
                  <span className="um-status">{u.status}</span>
                </td>
                <td className="um-col-actions">
                  <div className="um-actions">
                    <button type="button" className="um-view">
                      Xem
                    </button>
                    <button type="button" className="um-lock">
                      Khóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
