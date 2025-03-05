import React, { useState } from 'react';

const HealthTipComponent = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Thời gian mang thai là bao lâu?",
      answer: "Thời gian mang thai trung bình là 40 tuần (khoảng 9 tháng) tính từ ngày đầu tiên của kỳ kinh cuối cùng. Hãy tham khảo ý kiến bác sĩ để theo dõi sát sao."
    },
    {
      question: "Tôi nên ăn gì để khỏe mạnh khi mang thai?",
      answer: "Bổ sung trái cây, rau xanh (như bông cải xanh, táo), protein nạc (gà, cá hồi), và sữa bầu giàu canxi. Tránh đồ ăn nhanh và caffeine quá mức."
    },
    {
      question: "Có nên tập thể dục không?",
      answer: "Có, bạn có thể tập yoga cho bà bầu hoặc đi bộ 20-30 phút mỗi ngày. Tuy nhiên, hãy hỏi ý kiến bác sĩ trước khi bắt đầu."
    },
    {
      question: "Làm thế nào để giảm căng thẳng?",
      answer: "Nghe nhạc nhẹ, thiền định, hoặc trò chuyện với người thân. Tham gia nhóm hỗ trợ bà bầu cũng là một ý tưởng tốt."
    },
    {
      question: "Khi nào cần đi khám thai?",
      answer: "Nên đi khám hàng tháng trong 3 tháng đầu và 3 tháng giữa, sau đó tăng lên 2 tuần/lần vào 3 tháng cuối. Ghi chú các triệu chứng bất thường."
    }
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="health-tip-container">
      <style>
        {`
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
        `}
      </style>

      <h1 className="main-title">Hỗ Trợ Sức Khỏe Thai Kỳ</h1>
      <header>
        <h1>Câu Hỏi Thường Gặp Về Thai Kỳ</h1>
      </header>

      <section className="faq-section">
        {faqs.map((faq, index) => (
          <div className="faq-item" key={index}>
            <div className="faq-question" onClick={() => handleToggle(index)}>
              <span>{faq.question}</span>
              <button className={`toggle-btn ${openIndex === index ? 'active' : ''}`}>
                {openIndex === index ? '-' : '+'}
              </button>
            </div>
            <div className="faq-answer" style={{ display: openIndex === index ? 'block' : 'none' }}>
              {faq.answer}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default HealthTipComponent;