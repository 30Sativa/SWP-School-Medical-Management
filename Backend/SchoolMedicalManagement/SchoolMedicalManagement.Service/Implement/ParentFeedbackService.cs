using Microsoft.AspNetCore.Http;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Interface;
using System.Linq;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Implement
{
    public class ParentFeedbackService : IParentFeedbackService
    {
        private readonly ParentFeedbackRepository _feedbackRepository;
        private readonly UserRepository _userRepository;

        public ParentFeedbackService(ParentFeedbackRepository feedbackRepository, UserRepository userRepository)
        {
            _feedbackRepository = feedbackRepository;
            _userRepository = userRepository;
        }

        // Lấy tất cả feedback
        public async Task<BaseResponse> GetAllFeedbackAsync()
        {
            // Lấy tất cả feedback, include Parent để lấy ParentName
            var feedbacks = await _feedbackRepository.GetAllFeedbackAsync();
            var data = feedbacks.Select(f => new ParentFeedbackResponse
            {
                FeedbackId = f.FeedbackId,
                ParentId = f.ParentId,
                ParentName = f.Parent?.FullName,
                RelatedType = f.RelatedType,
                RelatedId = f.RelatedId,
                Content = f.Content,
                Rating = f.Rating,
                CreatedAt = f.CreatedAt
            }).ToList();
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Get all feedback successfully.",
                Data = data
            };
        }

        // Lấy chi tiết feedback
        public async Task<BaseResponse> GetFeedbackByIdAsync(int id)
        {
            var f = await _feedbackRepository.GetFeedbackByIdAsync(id);
            if (f == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = "Feedback not found.",
                    Data = null
                };
            }
            var data = new ParentFeedbackResponse
            {
                FeedbackId = f.FeedbackId,
                ParentId = f.ParentId,
                ParentName = f.Parent?.FullName,
                RelatedType = f.RelatedType,
                RelatedId = f.RelatedId,
                Content = f.Content,
                Rating = f.Rating,
                CreatedAt = f.CreatedAt
            };
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Get feedback detail successfully.",
                Data = data
            };
        }

        // Tạo mới feedback
        public async Task<BaseResponse> CreateFeedbackAsync(CreateParentFeedbackRequest request)
        {
            var parent = await _userRepository.GetUserById(request.ParentId);
            if (parent == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Parent not found.",
                    Data = null
                };
            }
            var feedback = new ParentFeedback
            {
                ParentId = request.ParentId,
                RelatedType = request.RelatedType,
                RelatedId = request.RelatedId,
                Content = request.Content,
                Rating = request.Rating,
                CreatedAt = System.DateTime.UtcNow
            };
            await _feedbackRepository.CreateAsync(feedback); // dùng lại GenericRepository
            var data = new ParentFeedbackResponse
            {
                FeedbackId = feedback.FeedbackId,
                ParentId = feedback.ParentId,
                ParentName = parent.FullName,
                RelatedType = feedback.RelatedType,
                RelatedId = feedback.RelatedId,
                Content = feedback.Content,
                Rating = feedback.Rating,
                CreatedAt = feedback.CreatedAt
            };
            return new BaseResponse
            {
                Status = StatusCodes.Status201Created.ToString(),
                Message = "Feedback created successfully.",
                Data = data
            };
        }
    }
} 