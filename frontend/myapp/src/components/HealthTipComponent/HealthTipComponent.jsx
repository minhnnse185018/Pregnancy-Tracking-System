import React, { useEffect, useState } from 'react';

const HealthTipComponent = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      setError(null);
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
      if (!Array.isArray(data)) {
        throw new Error('Dữ liệu trả về không đúng định dạng');
      }
      const sortedFaqs = data.sort((a, b) => a.displayOrder - b.displayOrder);
      setFaqs(sortedFaqs);
      setFilteredFaqs(sortedFaqs);
      setLoading(false);
    } catch (err) {
      console.error('Lỗi khi tải FAQs:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = faqs.filter(faq => 
      faq.question.toLowerCase().includes(term) ||
      faq.answer.toLowerCase().includes(term) ||
      (faq.category && faq.category.toLowerCase().includes(term))
    );
    setFilteredFaqs(filtered);
  };

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
      margin-bottom: 50px;
      margin-top: 150px;
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

    /* CSS cho thanh tìm kiếm từ phiên bản đầu tiên */
    .search-container {
      margin: 20px 0;
      text-align: center;
    }

    .search-input {
      width: 60%;
      padding: 12px 20px;
      font-size: 16px;
      border: 2px solid #ad1457;
      border-radius: 25px;
      outline: none;
      transition: all 0.3s ease;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .search-input:focus {
      border-color: #d81b60;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    }

    .search-input::placeholder {
      color: #888;
      font-style: italic;
    }
  `;

  return (
    <div className="health-tip-container">
      <style>{styles}</style>

      <h1 className="main-title">Hỗ Trợ Sức Khỏe Thai Kỳ</h1>
      <header>
        <h1>Câu Hỏi Thường Gặp Về Thai Kỳ</h1>
      </header>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm câu hỏi hoặc câu trả lời..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

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
        ) : filteredFaqs.length === 0 ? (
          <div className="error">
            {searchTerm ? 'Không tìm thấy kết quả phù hợp' : 'Không có dữ liệu để hiển thị'}
          </div>
        ) : (
          filteredFaqs.map((faq, index) => (
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