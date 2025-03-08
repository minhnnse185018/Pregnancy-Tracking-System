import React, { useEffect, useState } from 'react';

const HealthTipComponent = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm fetch FAQs
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      setError(null); // Xóa lỗi cũ khi thử lại
      const response = await fetch('http://localhost:5254/api/FAQ/GetAllFAQs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Không thể tải FAQs: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      // Kiểm tra dữ liệu trả về có hợp lệ không
      if (!Array.isArray(data)) {
        throw new Error('Dữ liệu trả về không đúng định dạng');
      }
      const sortedFaqs = data.sort((a, b) => a.displayOrder - b.displayOrder);
      setFaqs(sortedFaqs);
      setLoading(false);
    } catch (err) {
      console.error('Lỗi khi tải FAQs:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
      setLoading(false);
    }
  };

  // Gọi fetch khi component mount
  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const styles = `
    .health-tip-container {
      font-family: 'Arial', sans-serif;
      max-width: 900px;
      margin: 100px auto 0;
      padding: 30px;
      background: linear-gradient(135deg, #fce4ec 0%, #e8eaf6 100%);
      color: #333;
      border-radius: 15px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .main-title {
      text-align: center;
      color: #ad1457;
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 40px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    header {
      text-align: center;
      margin-bottom: 30px;
    }

    header h1 {
      color: #6a1b9a;
      font-size: 28px;
      font-weight: 600;
      margin: 0;
      padding-bottom: 10px;
      border-bottom: 2px solid #d81b60;
      display: inline-block;
    }

    .faq-section {
      margin-top: 20px;
    }

    .faq-item {
      background-color: #fff;
      border-radius: 12px;
      margin-bottom: 15px;
      overflow: hidden;
      transition: all 0.3s ease-in-out;
    }

    .faq-question {
      padding: 18px 25px;
      font-size: 17px;
      font-weight: 500;
      color: #444;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(90deg, #fce4ec 0%, #f8bbd0 100%);
      transition: background 0.3s ease;
    }

    .faq-question:hover {
      background: linear-gradient(90deg, #f8bbd0 0%, #e1bee7 100%);
    }

    .faq-answer {
      padding: 20px 25px;
      color: #555;
      background-color: #fafafa;
      line-height: 1.7;
      animation: slideDown 0.3s ease-out;
    }

    .faq-category {
      font-size: 14px;
      color: #888;
      padding: 5px 25px 0;
    }

    .toggle-btn {
      font-size: 20px;
      font-weight: bold;
      color: #ad1457;
      border: none;
      background: none;
      cursor: pointer;
      padding: 0;
      width: 25px;
      height: 25px;
      text-align: center;
      transition: transform 0.3s ease;
    }

    .toggle-btn.active {
      transform: rotate(45deg);
    }

    @keyframes slideDown {
      from { max-height: 0; opacity: 0; }
      to { max-height: 200px; opacity: 1; }
    }

    .loading {
      text-align: center;
      padding: 20px;
      color: #ad1457;
    }

    .error {
      text-align: center;
      padding: 20px;
      color: #d81b60;
    }

    .retry-btn {
      margin-top: 10px;
      padding: 8px 16px;
      background-color: #ad1457;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .retry-btn:hover {
      background-color: #d81b60;
    }
  `;

  return (
    <div className="health-tip-container">
      <style>{styles}</style>

      <h1 className="main-title">Hỗ Trợ Sức Khỏe Thai Kỳ</h1>
      <header>
        <h1>Câu Hỏi Thường Gặp Về Thai Kỳ</h1>
      </header>

      <section className="faq-section">
        {loading ? (
          <div className="loading">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="error">
            {error}
            <button className="retry-btn" onClick={fetchFaqs}>
              Thử lại
            </button>
          </div>
        ) : faqs.length === 0 ? (
          <div className="error">Không có dữ liệu để hiển thị</div>
        ) : (
          faqs.map((faq, index) => (
            <div className="faq-item" key={faq.id}>
              <div className="faq-question" onClick={() => handleToggle(index)}>
                <span>{faq.question}</span>
                <button className={`toggle-btn ${openIndex === index ? 'active' : ''}`}>
                  {openIndex === index ? '-' : '+'}
                </button>
              </div>
              <div
                className="faq-answer"
                style={{ display: openIndex === index ? 'block' : 'none' }}
              >
                {faq.category && <div className="faq-category">Danh mục: {faq.category}</div>}
                {faq.answer}
                <div className="faq-timestamp">
                  <small>
                    Tạo: {new Date(faq.createdAt).toLocaleDateString('vi-VN')}{' '}
                    {faq.updatedAt &&
                      ` | Cập nhật: ${new Date(faq.updatedAt).toLocaleDateString('vi-VN')}`}
                  </small>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default HealthTipComponent;