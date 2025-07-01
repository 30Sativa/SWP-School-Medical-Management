using Microsoft.AspNetCore.Http;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace SchoolMedicalManagement.Service.Implement
{
    public class BlogPostService : IBlogPostService
    {
        private readonly BlogPostRepository _blogPostRepository;
        private readonly UserRepository _userRepository;

        public BlogPostService(BlogPostRepository blogPostRepository, UserRepository userRepository)
        {
            _blogPostRepository = blogPostRepository;
            _userRepository = userRepository;
        }

        public async Task<BaseResponse> GetAllBlogPostsAsync()
        {
            var posts = await _blogPostRepository.GetAllBlogPosts();
            var data = posts.Select(p => new BlogPostManagementResponse
            {
                PostId = p.PostId,
                Title = p.Title,
                Content = p.Content,
                AuthorId = p.AuthorId,
                AuthorName = p.Author?.FullName,
                PostedDate = p.PostedDate,
                IsActive = p.IsActive
            }).ToList();
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy danh sách bài viết thành công.",
                Data = data
            };
        }

        public async Task<BaseResponse?> GetBlogPostByIdAsync(int id)
        {
            var p = await _blogPostRepository.GetBlogPostById(id);
            if (p == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Blog post with ID {id} not found.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Blog post found successfully.",
                Data = new BlogPostManagementResponse
                {
                    PostId = p.PostId,
                    Title = p.Title,
                    Content = p.Content,
                    AuthorId = p.AuthorId,
                    AuthorName = p.Author?.FullName,
                    PostedDate = p.PostedDate,
                    IsActive = p.IsActive
                }
            };
        }

        public async Task<BaseResponse?> CreateBlogPostAsync(CreateBlogPostRequest request)
        {
            var newPost = new BlogPost
            {
                Title = request.Title,
                Content = request.Content,
                AuthorId = request.AuthorId,
                PostedDate = request.PostedDate ?? DateOnly.FromDateTime(System.DateTime.Now),
                IsActive = request.IsActive ?? true
            };

            if (request.AuthorId.HasValue)
            {
                var existingUser = await _userRepository.GetUserById(request.AuthorId.Value);
                if (existingUser == null)
                {
                    return new BaseResponse
                    {
                        Status = StatusCodes.Status400BadRequest.ToString(),
                        Message = $"User with ID {request.AuthorId.Value} not found.",
                        Data = null
                    };
                }
            }

            var created = await _blogPostRepository.CreateBlogPost(newPost);
            if (created == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Create blog post failed.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Create blog post successfully.",
                Data = new BlogPostManagementResponse
                {
                    PostId = created.PostId,
                    Title = created.Title,
                    Content = created.Content,
                    AuthorId = created.AuthorId,
                    AuthorName = created.Author?.FullName,
                    PostedDate = created.PostedDate,
                    IsActive = created.IsActive
                }
            };
        }

        public async Task<BaseResponse?> UpdateBlogPostAsync(int id, UpdateBlogPostRequest request)
        {
            var p = await _blogPostRepository.GetBlogPostById(id);
            if (p == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Blog post with ID {id} not found.",
                    Data = null
                };
            }

            p.Title = string.IsNullOrEmpty(request.Title) ? p.Title : request.Title;
            p.Content = string.IsNullOrEmpty(request.Content) ? p.Content : request.Content;
            p.IsActive = request.IsActive ?? p.IsActive;

            var updated = await _blogPostRepository.UpdateBlogPost(p);
            if (updated == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Update failed. Please check the request data.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Blog post updated successfully.",
                Data = new BlogPostManagementResponse
                {
                    PostId = updated.PostId,
                    Title = updated.Title,
                    Content = updated.Content,
                    AuthorId = updated.AuthorId,
                    AuthorName = updated.Author?.FullName,
                    PostedDate = updated.PostedDate,
                    IsActive = updated.IsActive
                }
            };
        }

        public async Task<bool> DeleteBlogPostAsync(int id)
        {
            return await _blogPostRepository.DeleteBlogPost(id);
        }
    }
} 