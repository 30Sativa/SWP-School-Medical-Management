using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IBlogPostService
    {
        Task<BaseResponse> GetAllBlogPostsAsync();
        Task<BaseResponse?> GetBlogPostByIdAsync(int id);
        Task<BaseResponse?> CreateBlogPostAsync(CreateBlogPostRequest request);
        Task<BaseResponse?> UpdateBlogPostAsync(int id, UpdateBlogPostRequest request);
        Task<BaseResponse> DeleteBlogPostAsync(int id);
    }
} 