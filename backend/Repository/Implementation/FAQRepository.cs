using AutoMapper;
using backend.Data;
using backend.Dtos.FAQs;
using backend.Models;
using backend.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository.Implementation
{
    public class FAQRepository : IFAQRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public FAQRepository(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<FAQDto>> GetAllFAQsAsync()
        {
            var faqs = await _context.FAQs
                .OrderBy(f => f.Category)
                .ThenBy(f => f.DisplayOrder)
                .ToListAsync();

            return _mapper.Map<List<FAQDto>>(faqs);
        }

        public async Task<FAQDto?> GetFAQByIdAsync(int id)
        {
            var faq = await _context.FAQs
                .FirstOrDefaultAsync(f => f.Id == id);

            return faq == null ? null : _mapper.Map<FAQDto>(faq);
        }

        public async Task<List<FAQDto>> GetFAQsByCategoryAsync(string category)
        {
            var faqs = await _context.FAQs
                .Where(f => f.Category == category)
                .OrderBy(f => f.DisplayOrder)
                .ToListAsync();

            return _mapper.Map<List<FAQDto>>(faqs);
        }

        public async Task<int> CreateFAQAsync(CreateFAQDto faqDto)
        {
            var faq = _mapper.Map<FAQ>(faqDto);
            faq.CreatedAt = DateTime.Now;
            faq.UpdatedAt = DateTime.Now;

            _context.FAQs.Add(faq);
            return await _context.SaveChangesAsync();
        }

        public async Task<FAQDto?> UpdateFAQAsync(int id, UpdateFAQDto faqDto)
        {
            var faq = await _context.FAQs.FindAsync(id);
            if (faq == null) return null;

            _mapper.Map(faqDto, faq);
            faq.UpdatedAt = DateTime.Now;
            
            await _context.SaveChangesAsync();
            return _mapper.Map<FAQDto>(await _context.FAQs.FindAsync(id));
        }

        public async Task<int> DeleteFAQAsync(int id)
        {
            var faq = await _context.FAQs.FindAsync(id);
            if (faq == null) return -1;

            _context.FAQs.Remove(faq);
            return await _context.SaveChangesAsync();
        }
    }
} 