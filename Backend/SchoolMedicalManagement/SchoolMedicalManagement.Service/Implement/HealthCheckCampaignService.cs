using Microsoft.AspNetCore.Http;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Request;
using SchoolMedicalManagement.Models.Response;
using SchoolMedicalManagement.Repository.Repository;
using SchoolMedicalManagement.Service.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Service.Implement
{
    public class HealthCheckCampaignService : IHealthCheckCampaignService
    {
        private readonly HealthCheckCampaignRepository _campaignRepository;
        private readonly UserRepository _userRepository;
        private readonly SwpEduHealV5Context _context;

        public HealthCheckCampaignService(HealthCheckCampaignRepository campaignRepository, UserRepository userRepository, SwpEduHealV5Context context)
        {
            _campaignRepository = campaignRepository;
            _userRepository = userRepository;
            _context = context;
        }

        public async Task<BaseResponse> GetAllHealthCheckCampaignsAsync()
        {
            var campaigns = await _campaignRepository.GetAllHealthCheckCampaigns();
            var data = campaigns.Select(c => new HealthCheckCampaignManagementResponse
            {
                CampaignId = c.CampaignId,
                Title = c.Title,
                Date = c.Date,
                Description = c.Description,
                CreatedBy = c.CreatedBy,
                CreatedByName = c.CreatedByNavigation?.FullName,
                StatusId = c.StatusId,
                StatusName = c.Status?.StatusName
            }).ToList();
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy danh sách chiến dịch khám sức khỏe thành công.",
                Data = data
            };
        }

        public async Task<BaseResponse?> GetHealthCheckCampaignByIdAsync(int id)
        {
            var c = await _campaignRepository.GetHealthCheckCampaignById(id);
            if (c == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Health check campaign with ID {id} not found.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Health check campaign found successfully.",
                Data = new HealthCheckCampaignManagementResponse
                {
                    CampaignId = c.CampaignId,
                    Title = c.Title,
                    Date = c.Date,
                    Description = c.Description,
                    CreatedBy = c.CreatedBy,
                    CreatedByName = c.CreatedByNavigation?.FullName,
                    StatusId = c.StatusId,
                    StatusName = c.Status?.StatusName
                }
            };
        }

        public async Task<BaseResponse?> CreateHealthCheckCampaignAsync(CreateHealthCheckCampaignRequest request)
        {
            // Kiểm tra StatusId hợp lệ
            int statusId = request.StatusId ?? 1;
            var status = await _context.CampaignStatuses.FindAsync(statusId);
            if (status == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = $"StatusId {statusId} không hợp lệ.",
                    Data = null
                };
            }
            var newCampaign = new HealthCheckCampaign
            {
                Title = request.Title,
                Date = request.Date,
                Description = request.Description,
                CreatedBy = request.CreatedBy,
                StatusId = statusId
            };
            var created = await _campaignRepository.CreateHealthCheckCampaign(newCampaign);
            if (created == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Create health check campaign failed.",
                    Data = null
                };
            }
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Create health check campaign successfully.",
                Data = new HealthCheckCampaignManagementResponse
                {
                    CampaignId = created.CampaignId,
                    Title = created.Title,
                    Date = created.Date,
                    Description = created.Description,
                    CreatedBy = created.CreatedBy,
                    CreatedByName = created.CreatedByNavigation?.FullName,
                    StatusId = created.StatusId,
                    StatusName = created.Status?.StatusName
                }
            };
        }

        public async Task<BaseResponse?> UpdateHealthCheckCampaignAsync(int id, UpdateHealthCheckCampaignRequest request)
        {
            var c = await _campaignRepository.GetHealthCheckCampaignById(id);
            if (c == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"Health check campaign with ID {id} not found.",
                    Data = null
                };
            }
            c.Title = string.IsNullOrEmpty(request.Title) ? c.Title : request.Title;
            c.Date = request.Date ?? c.Date;
            c.Description = string.IsNullOrEmpty(request.Description) ? c.Description : request.Description;
            if (request.StatusId.HasValue)
            {
                var status = await _context.CampaignStatuses.FindAsync(request.StatusId.Value);
                if (status == null)
                {
                    return new BaseResponse
                    {
                        Status = StatusCodes.Status400BadRequest.ToString(),
                        Message = $"StatusId {request.StatusId.Value} không hợp lệ.",
                        Data = null
                    };
                }
                c.StatusId = request.StatusId.Value;
            }
            var updated = await _campaignRepository.UpdateHealthCheckCampaign(c);
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
                Message = "Health check campaign updated successfully.",
                Data = new HealthCheckCampaignManagementResponse
                {
                    CampaignId = updated.CampaignId,
                    Title = updated.Title,
                    Date = updated.Date,
                    Description = updated.Description,
                    CreatedBy = updated.CreatedBy,
                    CreatedByName = updated.CreatedByNavigation?.FullName,
                    StatusId = updated.StatusId,
                    StatusName = updated.Status?.StatusName
                }
            };
        }

        public async Task<bool> DeleteHealthCheckCampaignAsync(int id)
        {
            return await _campaignRepository.DeleteHealthCheckCampaign(id);
        }

        public async Task<BaseResponse> GetHealthCheckCampaignsByStatusAsync(int statusId)
        {
            var campaigns = await _campaignRepository.GetAllHealthCheckCampaigns();
            var filtered = campaigns.Where(c => c.StatusId == statusId).ToList();
            var data = filtered.Select(c => new HealthCheckCampaignManagementResponse
            {
                CampaignId = c.CampaignId,
                Title = c.Title,
                Date = c.Date,
                Description = c.Description,
                CreatedBy = c.CreatedBy,
                CreatedByName = c.CreatedByNavigation?.FullName,
                StatusId = c.StatusId,
                StatusName = c.Status?.StatusName
            }).ToList();
            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = "Lấy danh sách chiến dịch khám sức khỏe theo trạng thái thành công.",
                Data = data
            };
        }
    }
}
