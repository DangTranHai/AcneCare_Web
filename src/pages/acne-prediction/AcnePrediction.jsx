import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import "./AcnePrediction.css";
import logoImg from "../../assets/figma/logo.png";
import faceImg from "../../assets/figma/face.png";
import { API_BASE_URL } from "../../config/api";

const WORKSPACE_ID = "nhom14acne";
const WORKFLOW_ID = "custom-workflow-2";
const API_KEY = "huTWEYCuEdWYPAizTiJR";

const classToVietnamese = {
  "dark spot": "Vết thâm",
  blackheads: "Mụn đầu đen",
  whiteheads: "Mụn đầu trắng",
  nodules: "Mụn bọc",
  papules: "Mụn sẩn",
  pustules: "Mụn mủ",
};

const translateToVN = (className) => {
  const lowerClass = className.toLowerCase().trim();
  return classToVietnamese[lowerClass] || className;
};

const toSnakeCase = (str) => str.trim().toLowerCase().replace(/\s+/g, "_");

const getBoxColor = (className) => {
  const c = className.toLowerCase().trim();
  if (c === "nodules" || c === "papules" || c === "pustules") return "#ef4444";
  if (c === "dark spot") return "#3b82f6";
  return "#22c55e";
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// Strip data URL prefix to send raw base64 to roboflow
const stripDataUrlPrefix = (base64) => {
  const idx = base64.indexOf(",");
  return idx !== -1 ? base64.slice(idx + 1) : base64;
};

const generateImageWithBBoxes = (originalBase64, predictions, imgMeta) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const MAX_SIZE = 1200;
      let width = img.width;
      let height = img.height;

      if (width > MAX_SIZE || height > MAX_SIZE) {
        if (width > height) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0, width, height);

      const scaleX = width / imgMeta.width;
      const scaleY = height / imgMeta.height;

      const lineWidth = Math.max(2, width / 400);
      const fontSize = Math.max(12, width / 60);

      predictions.forEach((pred) => {
        const x = (pred.x - pred.width / 2) * scaleX;
        const y = (pred.y - pred.height / 2) * scaleY;
        const w = pred.width * scaleX;
        const h = pred.height * scaleY;

        const boxColor = getBoxColor(pred.class);

        ctx.strokeStyle = boxColor;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(x, y, w, h);

        ctx.fillStyle = boxColor;
        const label = `${toSnakeCase(pred.class)} ${Math.round(pred.confidence * 100)}%`;
        ctx.font = `bold ${fontSize}px Arial`;
        const textWidth = ctx.measureText(label).width;

        ctx.fillRect(
          x - lineWidth / 2,
          y - fontSize - 8,
          textWidth + 16,
          fontSize + 8
        );
        ctx.fillStyle = "#ffffff";
        ctx.fillText(label, x + 8 - lineWidth / 2, y - 6);
      });

      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.src = originalBase64;
  });
};

export default function AcnePrediction() {
  const [base64Image, setBase64Image] = useState(null);
  const [apiResult, setApiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [severityLevel, setSeverityLevel] = useState("Da khỏe");
  const [note, setNote] = useState("");

  // imgRenderedSize: actual pixel size of the <img> element as rendered in the DOM
  const [imgRenderedSize, setImgRenderedSize] = useState(null);

  const fileInputRef = useRef(null);
  const resultImgRef = useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      alert("Chỉ hỗ trợ JPG/PNG.");
      return;
    }
    try {
      const base64 = await getBase64(file);
      setBase64Image(base64);
      setApiResult(null);
      setImgRenderedSize(null);
    } catch {
      alert("Không thể xử lý ảnh.");
    }
  };

  // Called when the result img finishes loading — capture its rendered size
  const handleResultImgLoad = useCallback(() => {
    if (resultImgRef.current) {
      const { offsetWidth, offsetHeight } = resultImgRef.current;
      setImgRenderedSize({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  const onFinish = async () => {
    if (!base64Image) return alert("Vui lòng tải ảnh lên trước.");
    setIsLoading(true);
    setApiResult(null);
    setImgRenderedSize(null);

    const endpointUrl = `https://serverless.roboflow.com/${WORKSPACE_ID}/workflows/${WORKFLOW_ID}`;
    // Roboflow expects raw base64 (no data:... prefix)
    const rawBase64 = stripDataUrlPrefix(base64Image);

    const requestBody = {
      api_key: API_KEY,
      inputs: { image: { type: "base64", value: rawBase64 } },
    };

    try {
      const response = await fetch(endpointUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("API Request Failed");
      }

      const data = await response.json();
      setApiResult(data);
    } catch (error) {
      console.error(error);
      setApiResult({ error: "Lỗi kết nối.", details: error.message });
      alert("Lỗi gọi API AI.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSaveModal = () => {
    if (!apiResult || !base64Image) {
      alert("Vui lòng phân tích ảnh trước.");
      return;
    }
    setSeverityLevel("Da khỏe");
    setNote("");
    setIsModalOpen(true);
  };

  const handleSaveResult = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const basePredictionsForSaving = rawPredictions.filter(
        (pred) => Math.round(pred.confidence * 100) >= 10
      );

      const baseSummaryCount = basePredictionsForSaving.reduce((acc, curr) => {
        acc[curr.class] = (acc[curr.class] || 0) + 1;
        return acc;
      }, {});

      const finalImageBase64 = await generateImageWithBBoxes(
        base64Image,
        basePredictionsForSaving,
        imgMeta
      );

      const detailsArray = Object.entries(baseSummaryCount).map(
        ([className, count]) => ({
          className,
          count,
        })
      );

      const payload = {
        severityLevel,
        note,
        imageBase64: finalImageBase64,
        details: detailsArray,
      };

      // Use relative URL (/api/v1) so Vite proxy forwards it — cookies (HttpOnly) are sent automatically
      const response = await fetch(`${API_BASE_URL}/acne-predictions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // <-- send HttpOnly cookie (access_token)
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP ${response.status}`);
      }

      alert("Lưu kết quả phân tích thành công!");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert(error.message || "Lỗi Server xử lý thất bại!");
    } finally {
      setIsSaving(false);
    }
  };

  // ── parse API response ─────────────────────────────────────────────────────
  let rawPredictions = [];
  let imgMeta = { width: 1, height: 1 };

  if (apiResult?.outputs?.[0]?.predictions?.predictions) {
    rawPredictions = apiResult.outputs[0].predictions.predictions;
    imgMeta = apiResult.outputs[0].predictions.image;
  } else if (Array.isArray(apiResult?.predictions)) {
    rawPredictions = apiResult.predictions;
    imgMeta = apiResult.image || { width: 100, height: 100 };
  }

  const filteredPredictions = rawPredictions.filter(
    (pred) => Math.round(pred.confidence * 100) >= confidenceThreshold
  );

  const summaryCount = filteredPredictions.reduce((acc, curr) => {
    acc[curr.class] = (acc[curr.class] || 0) + 1;
    return acc;
  }, {});

  const sortedPredictions = [...filteredPredictions].sort(
    (a, b) => b.confidence - a.confidence
  );

  // ── BBox overlay: scale from imgMeta (original AI coords) to rendered size ──
  // imgMeta is the image size that roboflow used for its coordinate system.
  // We scale bbox coords to match the actual pixel size of the img element.
  const renderBBoxes = () => {
    if (!apiResult || !imgRenderedSize || filteredPredictions.length === 0) return null;

    const { width: rendW, height: rendH } = imgRenderedSize;

    // object-fit: contain → the image is letterboxed inside the container.
    // We need the actual displayed image rect inside the container.
    const imgNaturalRatio = imgMeta.width / imgMeta.height;
    const containerRatio = rendW / rendH;

    let displayW, displayH, offsetX, offsetY;
    if (imgNaturalRatio > containerRatio) {
      // image is wider → pillarbox top/bottom
      displayW = rendW;
      displayH = rendW / imgNaturalRatio;
      offsetX = 0;
      offsetY = (rendH - displayH) / 2;
    } else {
      // image is taller → letterbox left/right
      displayH = rendH;
      displayW = rendH * imgNaturalRatio;
      offsetX = (rendW - displayW) / 2;
      offsetY = 0;
    }

    const scaleX = displayW / imgMeta.width;
    const scaleY = displayH / imgMeta.height;

    return filteredPredictions.map((pred, index) => {
      const left = offsetX + (pred.x - pred.width / 2) * scaleX;
      const top = offsetY + (pred.y - pred.height / 2) * scaleY;
      const width = pred.width * scaleX;
      const height = pred.height * scaleY;
      const boxColor = getBoxColor(pred.class);

      return (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `${left}px`,
            top: `${top}px`,
            width: `${width}px`,
            height: `${height}px`,
            border: `2px solid ${boxColor}`,
            backgroundColor: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
            zIndex: 10,
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "-20px",
              left: "-2px",
              fontSize: "10px",
              color: "#fff",
              fontWeight: "bold",
              padding: "2px 5px",
              whiteSpace: "nowrap",
              backgroundColor: boxColor,
              borderTopLeftRadius: "3px",
              borderTopRightRadius: "3px",
              lineHeight: "16px",
            }}
          >
            {toSnakeCase(pred.class)} {Math.round(pred.confidence * 100)}%
          </span>
        </div>
      );
    });
  };

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
        <h1 className="acne-main__heading">Phân tích da</h1>

        <div className="acne-columns">
          {/* ─── Left panel ─────────────────────────────── */}
          <section
            className="acne-card acne-card--config"
            aria-labelledby="config-title"
          >
            <h2 id="config-title" className="acne-card__step-title">
              <span className="acne-card__step-num">1.</span> Cấu hình và tải ảnh
            </h2>
            <div className="acne-rule" role="presentation" />

            <div className="acne-sensitivity">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p className="acne-sensitivity__label" style={{ margin: 0 }}>
                  Độ nhạy hiển thị
                </p>
                <p style={{ fontWeight: "bold", margin: 0, color: "#8c52ff" }}>
                  {confidenceThreshold}%
                </p>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                style={{ width: "100%", cursor: "pointer", marginTop: "0.75rem", accentColor: "#8c52ff" }}
              />
            </div>

            <p className="acne-upload__caption">Chọn hình ảnh</p>
            <div
              className="acne-upload"
              onClick={handleUploadClick}
              style={{ cursor: "pointer", overflow: "hidden" }}
            >
              <input
                type="file"
                accept="image/png, image/jpeg"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              {base64Image ? (
                <img
                  src={base64Image}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ) : (
                <p className="acne-upload__hint">Click tải ảnh</p>
              )}
            </div>

            <button
              type="button"
              className="acne-btn acne-btn--primary acne-btn--block"
              onClick={onFinish}
              disabled={!base64Image || isLoading}
              style={{ cursor: !base64Image || isLoading ? "not-allowed" : "pointer", opacity: !base64Image || isLoading ? 0.7 : 1 }}
            >
              {isLoading ? "Đang phân tích..." : "Bắt đầu phân tích"}
            </button>
          </section>

          {/* ─── Right panel ────────────────────────────── */}
          <section
            className="acne-card acne-card--results"
            aria-labelledby="results-title"
          >
            <h2 id="results-title" className="acne-card__step-title">
              <span className="acne-card__step-num">2.</span> Kết quả
            </h2>

            {/* Result visual — bbox overlay needs position:relative on container */}
            <div
              className="acne-result-visual"
              style={{ position: "relative", overflow: "hidden" }}
            >
              <img
                ref={resultImgRef}
                src={base64Image || faceImg}
                alt="Kết quả phân tích mẫu"
                className="acne-result-visual__img"
                onLoad={handleResultImgLoad}
                style={{
                  width: "100%",
                  display: "block",
                  opacity: isLoading ? 0.5 : 1,
                  objectFit: "contain",
                }}
              />
              {renderBBoxes()}
            </div>

            <div className="acne-overview">
              <p className="acne-overview__title">
                Tổng quan ({filteredPredictions.length} tổn thương)
              </p>
              <ul
                className="acne-overview__stats"
                style={{ display: "flex", flexWrap: "wrap", gap: "8px", listStyle: "none", padding: 0, margin: 0 }}
              >
                {Object.keys(summaryCount).length === 0 ? (
                  <li>Không có dữ liệu</li>
                ) : (
                  Object.entries(summaryCount).map(([className, count]) => (
                    <li
                      key={className}
                      style={{
                        background: "#dbeafe",
                        color: "#1d4ed8",
                        padding: "3px 10px",
                        borderRadius: "4px",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      {translateToVN(className)}: {count}
                    </li>
                  ))
                )}
              </ul>
            </div>

            <ul className="acne-detail-list">
              {sortedPredictions.length === 0 ? (
                <li style={{ fontSize: "14px", color: "#666", padding: "8px 0" }}>
                  Chưa có chi tiết
                </li>
              ) : (
                sortedPredictions.slice(0, 5).map((item, index) => {
                  const percent = Math.round(item.confidence * 100);
                  const color =
                    percent > 80 ? "#16a34a" : percent > 50 ? "#d97706" : "#dc2626";

                  return (
                    <li key={index} className="acne-detail">
                      <div className="acne-detail__row">
                        <span
                          className="acne-detail__label"
                          style={{ textTransform: "capitalize" }}
                        >
                          {index + 1}. {translateToVN(item.class)}
                        </span>
                        <span className="acne-detail__accuracy">
                          Chính xác {percent}%
                        </span>
                      </div>
                      <div className="acne-progress">
                        <div
                          className="acne-progress__fill"
                          style={{ width: `${percent}%`, backgroundColor: color }}
                        />
                      </div>
                    </li>
                  );
                })
              )}
            </ul>

            <button
              type="button"
              className="acne-btn acne-btn--primary acne-btn--block acne-btn--save"
              onClick={handleOpenSaveModal}
              disabled={!apiResult || isLoading}
              style={{ cursor: !apiResult || isLoading ? "not-allowed" : "pointer", opacity: !apiResult || isLoading ? 0.6 : 1 }}
            >
              Lưu kết quả phân tích
            </button>
          </section>
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
              <li><a href="#">Trung tâm trợ giúp</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
            </ul>
          </div>

          <div className="acne-footer__col">
            <p className="acne-footer__col-title">Kết nối chúng tôi</p>
            <ul className="acne-footer__links">
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Email hỗ trợ</a></li>
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

      {/* ─── Save Modal ─────────────────────────────────────── */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div
            style={{
              background: "#fff",
              padding: "28px",
              borderRadius: "14px",
              width: "440px",
              maxWidth: "92%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ margin: "0 0 20px", fontSize: "20px", fontWeight: 800 }}>
              Lưu Hồ Sơ Phân Tích
            </h2>
            <form onSubmit={handleSaveResult}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", fontSize: "14px" }}>
                  Đánh giá mức độ tổn thương *
                </label>
                <select
                  required
                  value={severityLevel}
                  onChange={(e) => setSeverityLevel(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "7px", border: "1px solid #ccc", fontSize: "14px" }}
                >
                  <option value="Da khỏe">Da khỏe</option>
                  <option value="Nhẹ">Nhẹ</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Nặng">Nặng</option>
                </select>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", fontSize: "14px" }}>
                  Ghi chú thêm
                </label>
                <textarea
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "7px", border: "1px solid #ccc", fontSize: "14px", resize: "vertical", boxSizing: "border-box" }}
                />
              </div>

              <div
                style={{
                  padding: "12px 14px",
                  background: "#eff6ff",
                  color: "#1e40af",
                  borderRadius: "7px",
                  fontSize: "13px",
                  marginBottom: "20px",
                  border: "1px solid #bfdbfe",
                }}
              >
                * <b>Lưu ý y khoa:</b> Dù bạn đang kéo thanh trượt ở mức nào, hệ
                thống vẫn sẽ tự động lưu lại{" "}
                <b>toàn bộ dữ liệu (từ mức 10% trở lên)</b> để đảm bảo không bỏ
                sót bất kỳ chi tiết nhỏ nào trong hồ sơ của bệnh nhân.
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "9px 20px",
                    border: "1px solid #d1d5db",
                    background: "#fff",
                    borderRadius: "7px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    padding: "9px 20px",
                    border: "none",
                    background: "#8c52ff",
                    color: "#fff",
                    fontWeight: "bold",
                    borderRadius: "7px",
                    cursor: isSaving ? "not-allowed" : "pointer",
                    opacity: isSaving ? 0.7 : 1,
                    fontSize: "14px",
                  }}
                >
                  {isSaving ? "Đang lưu..." : "Xác Nhận Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
