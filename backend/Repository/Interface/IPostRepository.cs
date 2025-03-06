using backend.Dtos.Posts;
using backend.Models;

namespace backend.Repository.Interface
{
    public interface IPostRepository
    {
        Task<List<PostDto>> GetAllPostsAsync();
        Task<PostDto?> GetPostByIdAsync(int id);
        Task<List<PostDto>?> GetPostsByUserIdAsync(int userId);
        Task<int> CreatePostAsync( CreatePostDto postDto);
        Task<PostDto?> UpdatePostAsync(int id, UpdatePostDto postDto);
        Task<int> DeletePostAsync(int id);
        Task<List<PostDto>?> SearchPostsAsync(string searchTerm);
    }
} 