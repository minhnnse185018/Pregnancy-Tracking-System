using AutoMapper;
using backend.Data;
using backend.Dtos;
using backend.Dtos.Comments;
using backend.Models;
using backend.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository.Implementation
{
    public class CommentRepository : ICommentRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public CommentRepository(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<CommentDto>> GetCommentsByPostIdAsync(int postId)
        {
            var comments = await _context.Comments
                .Include(c => c.User)
                .Where(c => c.PostId == postId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return _mapper.Map<List<CommentDto>>(comments);
        }

        public async Task<CommentDto?> GetCommentByIdAsync(int id)
        {
            var comment = await _context.Comments
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == id);

            return comment == null ? null : _mapper.Map<CommentDto>(comment);
        }

        public async Task<int> CreateCommentAsync(CreateCommentDto commentDto)
        {
            var comment = _mapper.Map<Comment>(commentDto);
            
            comment.CreatedAt = DateTime.Now;
            

            _context.Comments.Add(comment);
            

            return await _context.SaveChangesAsync();
        }

        public async Task<CommentDto?> UpdateCommentAsync(int id, UpdateCommentDto commentDto)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return null;

            _mapper.Map(commentDto, comment);
            

            await _context.SaveChangesAsync();
            return await GetCommentByIdAsync(id);
        }

        public async Task<int> DeleteCommentAsync(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return -1;

            _context.Comments.Remove(comment);
            
            return await _context.SaveChangesAsync();;
        }
    }
} 