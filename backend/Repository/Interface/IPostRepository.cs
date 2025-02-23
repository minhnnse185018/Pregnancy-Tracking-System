using backend.Dtos.Posts;

namespace backend.Repository.Interface
{
    public interface IPostRepository
    {
        Task<List<PostDto>> GetAllPostsAsync();
        Task<PostDto?> GetPostByIdAsync(int id);
        Task<List<PostDto>> GetPostsByUserIdAsync(int userId);
        Task<PostDto> CreatePostAsync(int userId, CreatePostDto postDto);
        Task<PostDto?> UpdatePostAsync(int id, UpdatePostDto postDto);
        Task<bool> DeletePostAsync(int id);
        Task<List<PostDto>> SearchPostsAsync(string searchTerm);
    }
} 