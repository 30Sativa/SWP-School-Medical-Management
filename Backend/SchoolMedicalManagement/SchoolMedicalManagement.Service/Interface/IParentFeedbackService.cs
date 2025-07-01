using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Interface
{
    public interface IParentFeedbackService
    {
        // Lấy tất cả feedback
        Task<BaseResponse> GetAllFeedbackAsync();
        // Lấy chi tiết feedback
        Task<BaseResponse> GetFeedbackByIdAsync(int id);
        // Tạo mới feedback
        Task<BaseResponse> CreateFeedbackAsync(CreateParentFeedbackRequest request);
    }
} 