using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace SchoolMedicalManagement.Repository.Repository
{
    public class BlogPostRepository : GenericRepository<BlogPost>
    {
        public BlogPostRepository(SwpEduHealV5Context context) : base(context) { }

        public async Task<List<BlogPost>> GetAllBlogPosts()
            => await _context.BlogPosts
                .Include(b => b.Author)
                .ToListAsync();

        public async Task<BlogPost?> GetBlogPostById(int id)
            => await _context.BlogPosts
                .Include(b => b.Author)
                .FirstOrDefaultAsync(b => b.PostId == id);

        public async Task<BlogPost?> CreateBlogPost(BlogPost blogPost)
        {
            await CreateAsync(blogPost);
            return await GetBlogPostById(blogPost.PostId);
        }

        public async Task<BlogPost?> UpdateBlogPost(BlogPost blogPost)
        {
            await UpdateAsync(blogPost);
            return await GetBlogPostById(blogPost.PostId);
        }

        public async Task<bool> DeleteBlogPost(int id)
        {
            var isExist = await GetBlogPostById(id);
            if (isExist == null) return false;
            
            return await RemoveAsync(isExist);
        }
    }
} 