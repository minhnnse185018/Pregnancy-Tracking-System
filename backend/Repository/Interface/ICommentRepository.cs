using backend.Dtos;
using backend.Dtos.Comments;

namespace backend.Repository.Interface
{
    public interface ICommentRepository
    {
        Task<List<CommentDto>> GetCommentsByPostIdAsync(int postId);
        Task<CommentDto?> GetCommentByIdAsync(int id);
        Task<CommentDto> CreateCommentAsync(int userId, int postId, CreateCommentDto commentDto);
        Task<CommentDto?> UpdateCommentAsync(int id, UpdateCommentDto commentDto);
        Task<bool> DeleteCommentAsync(int id);
    }
} 