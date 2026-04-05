import './postManagement.css'

const POST_BODY = `Mỗi mùa Trung thu về, tôi lại nhớ những đêm rước đèn cùng bạn bè dưới ánh trăng
rằm, tiếng cười vọng qua ngõ nhỏ và hương bưởi thoang thoảng trên sân. Không khí ấy
gợi nhớ về sự ấm áp của gia đình, dù sau này ai cũng bận rộn với công việc riêng.
Tôi vẫn giữ thói quen pha ấm trà, nhìn mây trôi và cảm ơn những khoảnh khắc bình yên
giữa nhịp sống thường nhật.`

export default function PostManagement() {
  return (
    <>
      <h1 className="admin-page-title">Quản lý Bài đăng</h1>
      <article className="pm-card">
        <header className="pm-card__head">
          <div className="pm-card__author">
            <span className="pm-card__avatar" aria-hidden="true" />
            <div>
              <div className="pm-card__name">Vân Thanh</div>
              <div className="pm-card__time">2 giờ trước</div>
            </div>
          </div>
          <button type="button" className="pm-card__more" aria-label="Tùy chọn">
            ⋯
          </button>
        </header>
        <blockquote className="pm-card__quote">
          Hạnh phúc không phải đích đến, mà là hành trình.
        </blockquote>
        <p className="pm-card__body">{POST_BODY}</p>
        <div className="pm-card__actions">
          <button type="button" className="pm-btn pm-btn--approve">
            Duyệt
          </button>
          <button type="button" className="pm-btn pm-btn--delete">
            Xóa
          </button>
        </div>
      </article>
    </>
  )
}
