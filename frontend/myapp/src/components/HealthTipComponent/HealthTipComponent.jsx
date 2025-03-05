import React, { useEffect, useState } from 'react';

const HealthTipComponent = () => {
  // State for health tips (mock data with more details)
  const [healthTips, setHealthTips] = useState([]);

  // Mock data with detailed health tips for pregnant women
  useEffect(() => {
    const mockTips = [
      {
        id: 1,
        category: "Dinh dưỡng",
        title: "Ăn uống cân bằng",
        description: "Bổ sung trái cây, rau củ (như bông cải xanh, cam), và protein nạc (gà, cá hồi). Tránh đồ ăn nhanh và đường tinh luyện.",
        tip: "Uống sữa bầu giàu canxi mỗi ngày để hỗ trợ xương cho mẹ và bé."
      },
      {
        id: 2,
        category: "Sức khỏe",
        title: "Uống đủ nước",
        description: "Uống 8-10 ly nước mỗi ngày để tránh mất nước, đặc biệt trong 3 tháng đầu.",
        tip: "Thêm nước dừa hoặc nước ép trái cây để tăng hương vị và dinh dưỡng."
      },
      {
        id: 3,
        category: "Tập luyện",
        title: "Bài tập nhẹ nhàng",
        description: "Thử yoga cho bà bầu hoặc đi bộ 20-30 phút mỗi ngày để cải thiện tuần hoàn.",
        tip: "Tham khảo ý kiến bác sĩ trước khi bắt đầu bất kỳ bài tập nào."
      },
      {
        id: 4,
        category: "Chăm sóc",
        title: "Khám thai định kỳ",
        description: "Thăm khám bác sĩ hàng tháng để theo dõi sự phát triển của thai nhi.",
        tip: "Ghi chú các triệu chứng bất thường như đau bụng hoặc chóng mặt để báo cáo."
      },
      {
        id: 5,
        category: "Tâm lý",
        title: "Giữ tinh thần thoải mái",
        description: "Nghe nhạc nhẹ, thiền định, hoặc trò chuyện với người thân để giảm căng thẳng.",
        tip: "Tham gia các nhóm hỗ trợ bà bầu để chia sẻ kinh nghiệm."
      }
    ];
    setHealthTips(mockTips);
  }, []);

  return (
    <div className="health-tip-container">
      <style>
        {`
          .health-tip-container {
            font-family: 'Arial', sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #f9ebeb 0%, #e6e6fa 100%); /* Gradient nhẹ nhàng */
            color: #333;
            min-height: 100vh;
          }

          header {
            display: flex;
            align-items: center;
            background: rgba(255, 182, 193, 0.2); /* Hồng nhạt trong suốt */
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 30px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          header h1 {
            margin: 0;
            color: #d81b60;
            font-size: 28px;
            font-weight: 700;
            text-transform: uppercase;
          }

          .health-tips-section {
            margin-top: 30px;
          }

          .section-title {
            text-align: center;
            color: #6a1b9a;
            font-size: 26px;
            margin-bottom: 30px;
            font-weight: 600;
            text-decoration: underline;
            text-underline-offset: 5px;
          }

          .tip-card {
            background: #ffffff;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .tip-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          }

          .tip-card h3 {
            color: #6a1b9a;
            margin: 0 0 10px 0;
            font-size: 20px;
            font-weight: 600;
          }

          .tip-card .category {
            font-size: 14px;
            color: #d81b9a;
            margin-bottom: 5px;
            font-style: italic;
          }

          .tip-card p {
            margin: 5px 0;
            color: #555;
            line-height: 1.6;
          }

          .tip-card .extra-tip {
            margin-top: 10px;
            padding: 10px;
            background: #f0f0ff;
            border-left: 4px solid #d81b60;
            border-radius: 5px;
            color: #444;
            font-style: italic;
          }

          .image-placeholder {
            width: 100%;
            height: 200px;
            background: url('https://via.placeholder.com/1200x200?text=Pregnancy+Image') no-repeat center;
            background-size: cover;
            border-radius: 10px;
            margin-bottom: 20px;
          }
        `}
      </style>

      <header>
        <h1>Mẹo Sức Khỏe Cho Phụ Nữ Mang Thai</h1>
      </header>

      <div className="image-placeholder" /> {/* Placeholder cho hình ảnh minh họa */}

      <section className="health-tips-section">
        <h2 className="section-title">Mẹo Quan Trọng Cho Thai Kỳ Khỏe Mạnh</h2>
        {healthTips.length > 0 ? (
          healthTips.map((tip) => (
            <div className="tip-card" key={tip.id}>
              <span className="category">{tip.category}</span>
              <h3>{tip.title}</h3>
              <p>{tip.description}</p>
              <div className="extra-tip">Mẹo nhỏ: {tip.tip}</div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#666', fontSize: '18px' }}>Đang tải mẹo sức khỏe...</p>
        )}
      </section>
    </div>
  );
};

export default HealthTipComponent;