import { Link, useParams } from 'react-router-dom'
import './AcneHistoryDetail.css'
import logoImg from '../../assets/figma/logo.png'
import faceImg from '../../assets/figma/face.png'

const PROGRESS_PCT = (996 / 1413) * 100

export default function AcneHistoryDetail() {
  const { id } = useParams()

  return (
    <div className="acne-page">
      <header className="acne-header">
        <Link to="/" className="acne-header__brand acne-header__brand--link">
          <img src={logoImg} alt="" className="acne-header__logo" width={54} height={54} />
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
        <Link to="/lich-su" className="detail-back">
          ← Lịch sử
        </Link>
        <h1 className="acne-main__heading">Chi tiết</h1>

        <div className="detail-card" data-scan-id={id}>
          <div className="detail-patient">
            <p className="detail-patient__name">Bệnh nhân: A</p>
            <p className="detail-patient__email">Email: a@gmail.com</p>
          </div>

          <div className="detail-result-wrap">
            <div className="acne-result-visual">
              <img src={faceImg} alt="Kết quả phân tích" className="acne-result-visual__img" />
            </div>
          </div>

          <div className="acne-overview">
            <p className="acne-overview__title">Tổng quan</p>
            <ul className="acne-overview__stats">
              <li>Vết thâm: 4</li>
              <li>Mụn đầu trắng: 3</li>
              <li>Mụn đầu đen: 2</li>
            </ul>
          </div>

          <ul className="acne-detail-list">
            {[1, 2, 3].map((i) => (
              <li key={i} className="acne-detail">
                <div className="acne-detail__row">
                  <span className="acne-detail__label">1. Vết thâm</span>
                  <span className="acne-detail__accuracy">Chính xác 60%</span>
                </div>
                <div className="acne-progress">
                  <div className="acne-progress__fill" style={{ width: `${PROGRESS_PCT}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer className="acne-footer">
        <div className="acne-footer__inner">
          <div className="acne-footer__col acne-footer__col--brand">
            <p className="acne-footer__brand">acneCare</p>
            <p className="acne-footer__desc">
              Nền tảng ứng dụng trí tuệ nhân tạo giúp phân tích tình trạng mụn, kết nối bác sĩ da liễu và đồng hành
              cùng bạn trên hành trình chăm sóc da.
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
            Đăng ký nhận bản tin của chúng tôi để cập nhật những thông tin mới nhất
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
  )
}
