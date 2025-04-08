using AutoMapper;
using backend.Data;
using backend.Dtos.Posts;
using backend.Models;
using backend.Repository.Interface;
using backend.Services;
using backend.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository.Implementation
{
    public class PostRepository : IPostRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;
        private readonly ICloudinaryServices _imageService;

        public PostRepository(ApplicationDBContext context, IMapper mapper, ICloudinaryServices imageService)
        {
            _context = context;
            _mapper = mapper;
            _imageService = imageService;
        }

        public async Task<List<PostDto>> GetAllPostsAsync()
        {
            var posts = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Comments)
                    .ThenInclude(c => c.User)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return _mapper.Map<List<PostDto>>(posts);
        }

        public async Task<PostDto?> GetPostByIdAsync(int id)
        {
            var post = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Comments)
                    .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(p => p.Id == id);

            return post == null ? null : _mapper.Map<PostDto>(post);
        }

        public async Task<List<PostDto>?> GetPostsByUserIdAsync(int userId)
        {
            var posts = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Comments)
                    .ThenInclude(c => c.User)
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
            if(posts==null)
            {
                return null;
            }
            return _mapper.Map<List<PostDto>>(posts);
        }

        public async Task<int> CreatePostAsync( CreatePostDto postDto)
        {
            string img= null;
            if(postDto.Image != null && postDto.Image.Length > 0)
            {
                using (var stream = postDto.Image.OpenReadStream())
                {
                    img= await _imageService.UploadImageAsync(postDto.Image);
                }
            }
            var post = new Post
            {
                Title = postDto.Title,
                Content = postDto.Content,
                Image = img,
                UserId = postDto.UserId,
                Status = "Active",
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };
            

            await _context.Posts.AddAsync(post);
            

            return await _context.SaveChangesAsync() ;
        }

        public async Task<PostDto?> UpdatePostAsync(int id, UpdatePostDto postDto)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return null;

            string img= null;
            if(postDto.Image != null && postDto.Image.Length > 0)
            {
                using (var stream = postDto.Image.OpenReadStream())
                {
                    img= await _imageService.UploadImageAsync(postDto.Image);
                }
            }
            post.Title = postDto.Title;
            post.Content = postDto.Content;
            post.Image = img;
            post.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return await GetPostByIdAsync(id);
        }

        public async Task<int> DeletePostAsync(int id)
        {
            var post = await _context.Posts
                .Include(p => p.Comments)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null) return -1;

            if (post.Comments != null && post.Comments.Any())
            {
                _context.Comments.RemoveRange(post.Comments);
            }

            _context.Posts.Remove(post);
            
            return await _context.SaveChangesAsync();
        }

        public async Task<List<PostDto>?> SearchPostsAsync(string searchTerm)
        {
            var posts = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Comments)
                    .ThenInclude(c => c.User)
                .Where(p => p.Title.Contains(searchTerm) || p.Content.Contains(searchTerm))
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return _mapper.Map<List<PostDto>>(posts);
        }

        
    }
} 