import { Link } from 'react-router-dom'
import './ViewPostPage.css'

const ASSETS = {
  avatar: '/posts/avatar.png',
  heart: '/posts/icon-heart.png',
  comment: '/posts/icon-comment.png',
  menuDot: '/posts/icon-menu-dot.png',
}

const ARTICLE = {
  author: 'Văn Thanh',
  timeAgo: '2 giờ trước',
  quote: '"Hạnh phúc không phải đích đến, mà là hành trình."',
  body:
    'Mỗi năm, cứ đến rằm tháng Tám, em lại háo hức chờ đón Tết Trung Thu – một trong những ngày hội vui nhất của trẻ em. Vào ngày này, khắp nơi đều rực rỡ với đèn lồng, mâm cỗ đầy ắp bánh nướng, bánh dẻo và những trái cây được cắt tỉa đẹp mắt. Buổi tối, em cùng bạn bè rước đèn, xem múa lân và vui đùa dưới ánh trăng tròn. Không khí rộn ràng với tiếng trống hội, tiếng cười nói vui vẻ của mọi người. Trung Thu không chỉ là ngày vui chơi mà còn là dịp để gia đình quây quần, cùng nhau chia sẻ những khoảnh khắc ấm áp. Đây là ngày hội mang ý nghĩa sum vầy, gắn kết tình thân và gìn giữ nét đẹp văn hóa truyền thống.',
  likes: 202,
  comments: 202,
}

export default function ViewPostPage() {
  return (
    <div className="view-post" data-name="Xem bài viết" data-node-id="1:7">
      <header className="view-post__header" data-node-id="11:107">
        <div className="view-post__header-inner">
          <h1 className="view-post__community" data-node-id="11:57">
            Cộng đồng
          </h1>
          <Link className="view-post__create" to="/posts/create" data-node-id="11:103">
            Tạo bài viết
          </Link>
        </div>
      </header>

      <main className="view-post__main">
        <article className="view-post__card" data-name="Bài viết" data-node-id="11:58">
          <button
            type="button"
            className="view-post__menu"
            aria-label="Tùy chọn bài viết"
            data-node-id="11:68"
          >
            <span className="view-post__menu-dot" aria-hidden>
              <img src={ASSETS.menuDot} alt="" width={7} height={7} />
            </span>
            <span className="view-post__menu-dot" aria-hidden>
              <img src={ASSETS.menuDot} alt="" width={7} height={7} />
            </span>
            <span className="view-post__menu-dot" aria-hidden>
              <img src={ASSETS.menuDot} alt="" width={7} height={7} />
            </span>
          </button>

          <div className="view-post__content" data-name="Nội dung bài viết" data-node-id="11:140">
            <img
              className="view-post__avatar"
              src={ASSETS.avatar}
              alt=""
              width={100}
              height={100}
              data-node-id="11:59"
            />
            <p className="view-post__author" data-node-id="11:60">
              {ARTICLE.author}
            </p>
            <p className="view-post__time" data-node-id="11:61">
              {ARTICLE.timeAgo}
            </p>
            <p className="view-post__quote" data-node-id="11:69">
              {ARTICLE.quote}
            </p>
            <p className="view-post__body" data-node-id="64:33">
              {ARTICLE.body}
            </p>
          </div>

          <footer className="view-post__footer">
            <div className="view-post__stat view-post__stat--like" data-name="Tim" data-node-id="11:100">
              <img
                className="view-post__stat-icon"
                src={ASSETS.heart}
                alt=""
                width={38}
                height={31}
                data-node-id="11:92"
              />
              <span className="view-post__stat-num" data-node-id="11:97">
                {ARTICLE.likes}
              </span>
            </div>
            <div className="view-post__stat view-post__stat--comment" data-name="Bình luận" data-node-id="11:102">
              <img
                className="view-post__stat-icon"
                src={ASSETS.comment}
                alt=""
                width={38}
                height={34}
                data-node-id="11:95"
              />
              <span className="view-post__stat-num" data-node-id="11:98">
                {ARTICLE.comments}
              </span>
            </div>
          </footer>
        </article>
      </main>
    </div>
  )
}
