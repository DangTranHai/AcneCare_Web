import { useId, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './EditPostPage.css'

const FORM_ID = 'edit-post-form'

/** Nội dung mẫu — khớp bài demo trang "Xem bài viết" (Figma 1:7) */
const SAMPLE_DRAFT = {
  title: '"Hạnh phúc không phải đích đến, mà là hành trình."',
  body:
    'Mỗi năm, cứ đến rằm tháng Tám, em lại háo hức chờ đón Tết Trung Thu – một trong những ngày hội vui nhất của trẻ em. Vào ngày này, khắp nơi đều rực rỡ với đèn lồng, mâm cỗ đầy ắp bánh nướng, bánh dẻo và những trái cây được cắt tỉa đẹp mắt. Buổi tối, em cùng bạn bè rước đèn, xem múa lân và vui đùa dưới ánh trăng tròn. Không khí rộn ràng với tiếng trống hội, tiếng cười nói vui vẻ của mọi người. Trung Thu không chỉ là ngày vui chơi mà còn là dịp để gia đình quây quần, cùng nhau chia sẻ những khoảnh khắc ấm áp. Đây là ngày hội mang ý nghĩa sum vầy, gắn kết tình thân và gìn giữ nét đẹp văn hóa truyền thống.',
}

function countWords(text) {
  const t = text.trim()
  if (!t) return 0
  return t.split(/\s+/).filter(Boolean).length
}

export default function EditPostPage() {
  const { postId } = useParams()
  return <EditPostForm key={postId} postId={postId} />
}

function EditPostForm({ postId }) {
  const navigate = useNavigate()
  const titleId = useId()
  const bodyId = useId()
  const [title, setTitle] = useState(SAMPLE_DRAFT.title)
  const [body, setBody] = useState(SAMPLE_DRAFT.body)
  const [submitError, setSubmitError] = useState('')

  const wordCount = useMemo(() => countWords(body), [body])
  const overLimit = wordCount > 1000

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitError('')
    if (!title.trim()) {
      setSubmitError('Vui lòng nhập tiêu đề.')
      return
    }
    if (!body.trim()) {
      setSubmitError('Vui lòng nhập nội dung bài viết.')
      return
    }
    if (overLimit) {
      setSubmitError('Nội dung vượt quá 1000 từ.')
      return
    }
    const back = postId ? `/posts/${postId}` : '/posts'
    navigate(back)
  }

  return (
    <div className="edit-post" data-name="Chỉnh sửa bài viết" data-node-id="28:31">
      <header className="edit-post__header" data-node-id="28:32">
        <div className="edit-post__header-inner">
          <h1 className="edit-post__community" data-node-id="I28:32;11:57">
            Cộng đồng
          </h1>
          <button
            type="submit"
            form={FORM_ID}
            className="edit-post__submit-header"
            data-node-id="I28:32;11:106;11:103"
          >
            Lưu bài viết
          </button>
        </div>
      </header>

      <main className="edit-post__main">
        <form id={FORM_ID} className="edit-post__form" onSubmit={handleSubmit} noValidate>
          <div className="edit-post__card" data-node-id="28:71">
            {submitError ? (
              <p className="edit-post__form-error" role="alert">
                {submitError}
              </p>
            ) : null}

            <div className="edit-post__title-zone" data-name="Component 9" data-node-id="48:33">
              <label className="edit-post__title-label" htmlFor={titleId}>
                Chỉnh sửa bài viết của bạn ngay
              </label>
              <input
                id={titleId}
                name="title"
                className="edit-post__title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhâp tiêu đề ấn tượng của bạn..."
                autoComplete="off"
              />
            </div>

            <div className="edit-post__body-zone" data-name="Component 10" data-node-id="48:34">
              <div className="edit-post__divider" aria-hidden>
                <img src="/posts/editor-line.png" alt="" />
              </div>
              <label className="edit-post__visually-hidden" htmlFor={bodyId}>
                Nội dung bài viết
              </label>
              <textarea
                id={bodyId}
                name="body"
                className="edit-post__body-input"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Bắt đầu viết nội dung bài viết của bạn..."
                rows={14}
              />
              <p className={`edit-post__notice ${overLimit ? 'edit-post__notice--warn' : ''}`}>
                {'Chú ý:  Nội dung bài viết giới hạn 1000 từ.'}
                {body.trim() ? (
                  <span className="edit-post__word-count"> ({wordCount}/1000)</span>
                ) : null}
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
