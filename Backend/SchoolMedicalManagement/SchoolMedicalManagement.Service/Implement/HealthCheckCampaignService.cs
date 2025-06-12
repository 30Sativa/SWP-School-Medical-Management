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

        public HealthCheckCampaignService(HealthCheckCampaignRepository campaignRepository, UserRepository userRepository)
        {
            _campaignRepository = campaignRepository;
            _userRepository = userRepository;
        }

        public async Task<List<HealthCheckCampaignManagementResponse>> GetAllHealthCheckCampaignsAsync()
        {
            var campaigns = await _campaignRepository.GetAllHealthCheckCampaigns();
            var result = new List<HealthCheckCampaignManagementResponse>();
            foreach (var c in campaigns)
            {
                result.Add(new HealthCheckCampaignManagementResponse
                {
                    CampaignId = c.CampaignId,
                    Title = c.Title,
                    Date = c.Date,
                    Description = c.Description,
                    CreatedBy = c.CreatedBy,
                    CreatedByName = c.CreatedByNavigation?.FullName
                });
            }
            return result;
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
                    CreatedByName = c.CreatedByNavigation?.FullName
                }
            };
        }

        public async Task<BaseResponse?> CreateHealthCheckCampaignAsync(CreateHealthCheckCampaignRequest request)
        {
            var newCampaign = new HealthCheckCampaign
            {
                Title = request.Title,
                Date = request.Date,
                Description = request.Description,
                CreatedBy = request.CreatedBy
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
                    CreatedByName = created.CreatedByNavigation?.FullName
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
                    CreatedByName = updated.CreatedByNavigation?.FullName
                }
            };
        }

        public async Task<bool> DeleteHealthCheckCampaignAsync(int id)
        {
            return await _campaignRepository.DeleteHealthCheckCampaign(id);
        }
    }
}
