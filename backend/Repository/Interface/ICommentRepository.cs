using backend.Dtos;
using backend.Dtos.Comments;

namespace backend.Repository.Interface
{
    public interface ICommentRepository
    {
        Task<List<CommentDto>> GetCommentsByPostIdAsync(int postId);
        Task<CommentDto?> GetCommentByIdAsync(int id);
        Task<int> CreateCommentAsync(CreateCommentDto commentDto);
        Task<CommentDto?> UpdateCommentAsync(int id, UpdateCommentDto commentDto);
        Task<int> DeleteCommentAsync(int id);
    }
} 