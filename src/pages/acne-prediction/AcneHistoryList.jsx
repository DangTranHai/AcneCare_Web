import { Link } from "react-router-dom";
import "./AcneHistoryList.css";
import logoImg from "../../assets/figma/logo.png";

const MOCK_ROWS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  scannedAt: "04/04/2026 - 06:46",
  evaluation: "Nhẹ",
  findings: ["Vết thâm: 2", "Vết thâm: 2", "Vết thâm: 2"],
  notes: "ABCD",
}));

export default function AcneHistoryList() {
  return (
    <div className="acne-page">
      <header className="acne-header">
        <Link to="/" className="acne-header__brand acne-header__brand--link">
          <img
            src={logoImg}
            alt=""
            className="acne-header__logo"
            width={54}
            height={54}
          />
          <span className="acne-header__title">acneCare</span>
        </Link>
        <nav className="acne-header__nav" aria-label="Chính">
          <Link className="acne-header__link" to="/">
            Trang chủ
          </Link>
          <Link className="acne-header__link" to="/lich-su">
            Lịch sử
          </Link>
          <a className="acne-header__link" href="#">
            Đăng nhập
          </a>
          <a className="acne-header__cta" href="#">
            Đăng ký
          </a>
        </nav>
      </header>

      <main className="acne-main">
        <h1 className="acne-main__heading">Lịch sử</h1>

        <div className="history-card">
          <div className="history-patient">
            <p className="history-patient__name">Bệnh nhân: A</p>
            <p className="history-patient__email">Email: a@gmail.com</p>
          </div>
          <div className="history-rule" role="presentation" />

          <div className="history-table-scroll">
            <table className="history-table">
              <thead>
                <tr>
                  <th scope="col">Ngày quét</th>
                  <th scope="col">Đánh giá</th>
                  <th scope="col">Phát hiện</th>
                  <th scope="col">Ghi chú</th>
                  <th scope="col">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ROWS.map((row) => (
                  <tr key={row.id}>
                    <td data-label="Ngày quét">{row.scannedAt}</td>
                    <td data-label="Đánh giá">{row.evaluation}</td>
                    <td data-label="Phát hiện">
                      <span className="history-findings">
                        {row.findings.map((f, j) => (
                          <span
                            key={`${row.id}-${j}`}
                            className="history-findings__item"
                          >
                            {f}
                          </span>
                        ))}
                      </span>
                    </td>
                    <td data-label="Ghi chú">{row.notes}</td>
                    <td
                      className="history-table__actions"
                      data-label="Hành động"
                    >
                      <div className="history-actions">
                        <Link
                          to={`/lich-su/${row.id}`}
                          className="history-action-btn history-action-btn--link"
                        >
                          xem chi tiết
                        </Link>
                        <button type="button" className="history-action-btn">
                          Xem ảnh
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav className="history-pagination" aria-label="Phân trang">
            <button
              type="button"
              className="history-pagination__arrow"
              aria-label="Trang trước"
            >
              ‹
            </button>
            <button
              type="button"
              className="history-pagination__page is-active"
            >
              1
            </button>
            <button type="button" className="history-pagination__page">
              2
            </button>
            <button
              type="button"
              className="history-pagination__arrow"
              aria-label="Trang sau"
            >
              ›
            </button>
          </nav>
        </div>
      </main>

      <footer className="acne-footer">
        <div className="acne-footer__inner">
          <div className="acne-footer__col acne-footer__col--brand">
            <p className="acne-footer__brand">acneCare</p>
            <p className="acne-footer__desc">
              Nền tảng ứng dụng trí tuệ nhân tạo giúp phân tích tình trạng mụn,
              kết nối bác sĩ da liễu và đồng hành cùng bạn trên hành trình chăm
              sóc da.
            </p>
          </div>

          <div className="acne-footer__col">
            <p className="acne-footer__col-title">Về acneCare</p>
            <ul className="acne-footer__links">
              <li>
                <a href="#">Trung tâm trợ giúp</a>
              </li>
              <li>
                <a href="#">Điều khoản sử dụng</a>
              </li>
              <li>
                <a href="#">Chính sách bảo mật</a>
              </li>
            </ul>
          </div>

          <div className="acne-footer__col">
            <p className="acne-footer__col-title">Kết nối chúng tôi</p>
            <ul className="acne-footer__links">
              <li>
                <a href="#">Facebook</a>
              </li>
              <li>
                <a href="#">Instagram</a>
              </li>
              <li>
                <a href="#">Email hỗ trợ</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="acne-footer__newsletter">
          <p className="acne-footer__newsletter-text">
            Đăng ký nhận bản tin của chúng tôi để cập nhật những thông tin mới
            nhất
          </p>
          <div className="acne-footer__form">
            <div className="acne-footer__fake-input">Nhập email của bạn</div>
            <button type="button" className="acne-footer__submit">
              Đăng ký
            </button>
          </div>
        </div>

        <div className="acne-footer__rule" role="presentation" />
        <p className="acne-footer__copy">Bản quyền © acneCare</p>
      </footer>
    </div>
  );
}
