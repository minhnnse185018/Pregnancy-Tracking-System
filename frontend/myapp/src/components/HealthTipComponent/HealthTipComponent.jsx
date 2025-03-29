import React, { useEffect, useState } from "react";
import "./HealthTipComponent.css";
const HealthTipComponent = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [faqsPerPage] = useState(5);

  // Fetch all FAQs
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:5254/api/FAQ/GetAllFAQs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch FAQs: ${response.status} - ${response.statusText}`
        );
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Data returned is not in the correct format");
      }
      const sortedFaqs = data.sort((a, b) => a.displayOrder - b.displayOrder);
      setFaqs(sortedFaqs);
      setFilteredFaqs(sortedFaqs);

      // Extract unique categories from FAQs
      const uniqueCategories = [
        ...new Set(sortedFaqs.map((faq) => faq.category).filter((cat) => cat)),
      ];
      setCategories(["All", ...uniqueCategories]);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching FAQs:", err);
      setError(err.message || "An error occurred while fetching data");
      setLoading(false);
    }
  };

  // Fetch FAQs by category
  const fetchFaqsByCategory = async (category) => {
    try {
      setLoading(true);
      setError(null);
      if (category === "All") {
        await fetchFaqs(); // Fetch all FAQs if "All" is selected
        return;
      }
      const response = await fetch(
        `http://localhost:5254/api/FAQ/GetFAQsByCategory/${category}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch FAQs for category ${category}: ${response.status} - ${response.statusText}`
        );
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Data returned is not in the correct format");
      }
      const sortedFaqs = data.sort((a, b) => a.displayOrder - b.displayOrder);
      setFilteredFaqs(sortedFaqs);
      setLoading(false);
    } catch (err) {
      console.error(`Error fetching FAQs for category ${category}:`, err);
      setError(err.message || "An error occurred while fetching data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term) ||
        (faq.category && faq.category.toLowerCase().includes(term))
    );
    setFilteredFaqs(filtered);
    setCurrentPage(1);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    fetchFaqsByCategory(category);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Pagination logic
  const indexOfLastFaq = currentPage * faqsPerPage;
  const indexOfFirstFaq = indexOfLastFaq - faqsPerPage;
  const currentFaqs = filteredFaqs.slice(indexOfFirstFaq, indexOfLastFaq);
  const totalPages = Math.ceil(filteredFaqs.length / faqsPerPage);

  // Calculate the range of pages to display (5 nearest pages)
  const getPageRange = () => {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setOpenIndex(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="outer-background">
      <div className="health-tip-container">
        <h1 className="main-title">Pregnancy Health Support</h1>
        <header>
          <h1>Frequently Asked Questions About Pregnancy</h1>
        </header>

        <div className="search-container">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search questions or answers..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <select
              className="category-dropdown"
              value={selectedCategory}
              onChange={(e) => handleCategorySelect(e.target.value)}
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <section className="faq-section">
          {loading ? (
            <div className="loading">Loading data...</div>
          ) : error ? (
            <div className="error">
              {error}
              <button className="retry-btn" onClick={fetchFaqs}>
                Retry
              </button>
            </div>
          ) : currentFaqs.length === 0 ? (
            <div className="error">
              {searchTerm ? "No matching results found" : "No data to display"}
            </div>
          ) : (
            currentFaqs.map((faq, index) => (
              <div className="faq-item" key={faq.id}>
                <div
                  className="faq-question"
                  onClick={() => handleToggle(index)}
                >
                  <span>{faq.question}</span>
                  <span
                    className={`chevron ${openIndex === index ? "active" : ""}`}
                  >
                    ▼
                  </span>
                </div>
                <div
                  className="faq-answer"
                  style={{ display: openIndex === index ? "block" : "none" }}
                >
                  {faq.category && (
                    <div className="faq-category">Category: {faq.category}</div>
                  )}
                  {faq.answer}
                  <div className="faq-timestamp">
                    <small>
                      Created:{" "}
                      {new Date(faq.createdAt).toLocaleDateString("en-US")}{" "}
                      {faq.updatedAt &&
                        ` | Updated: ${new Date(
                          faq.updatedAt
                        ).toLocaleDateString("en-US")}`}
                    </small>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {getPageRange().map((page) => (
              <button
                key={page}
                className={`pagination-btn ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthTipComponent;
