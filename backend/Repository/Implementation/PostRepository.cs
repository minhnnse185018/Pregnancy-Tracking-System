using AutoMapper;
using backend.Data;
using backend.Dtos.Posts;
using backend.Models;
using backend.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository.Implementation
{
    public class PostRepository : IPostRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public PostRepository(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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

<<<<<<< HEAD
        public async Task<List<PostDto>?> GetPostsByUserIdAsync(int userId)
=======
        public async Task<List<PostDto>> GetPostsByUserIdAsync(int userId)
>>>>>>> origin/truong-son
        {
            var posts = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Comments)
                    .ThenInclude(c => c.User)
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
<<<<<<< HEAD
            if(posts==null)
            {
                return null;
            }
            return _mapper.Map<List<PostDto>>(posts);
        }

        public async Task<int> CreatePostAsync( CreatePostDto postDto)
        {
            var post = _mapper.Map<Post>(postDto);
=======

            return _mapper.Map<List<PostDto>>(posts);
        }

        public async Task<PostDto> CreatePostAsync(int userId, CreatePostDto postDto)
        {
            var post = _mapper.Map<Post>(postDto);
            post.UserId = userId;
>>>>>>> origin/truong-son
            post.CreatedAt = DateTime.Now;
            post.UpdatedAt = DateTime.Now;
            post.Status = "active";

<<<<<<< HEAD
            await _context.Posts.AddAsync(post);
            

            return await _context.SaveChangesAsync() ;
=======
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return await GetPostByIdAsync(post.Id);
>>>>>>> origin/truong-son
        }

        public async Task<PostDto?> UpdatePostAsync(int id, UpdatePostDto postDto)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return null;

            _mapper.Map(postDto, post);
            post.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return await GetPostByIdAsync(id);
        }

<<<<<<< HEAD
        public async Task<int> DeletePostAsync(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return -1;

            _context.Posts.Remove(post);
            
            return await _context.SaveChangesAsync();;
        }

        public async Task<List<PostDto>?> SearchPostsAsync(string searchTerm)
=======
        public async Task<bool> DeletePostAsync(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return false;

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<PostDto>> SearchPostsAsync(string searchTerm)
>>>>>>> origin/truong-son
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
<<<<<<< HEAD

        
=======
>>>>>>> origin/truong-son
    }
} 