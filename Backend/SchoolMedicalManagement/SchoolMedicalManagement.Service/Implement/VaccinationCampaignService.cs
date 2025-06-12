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
    public class VaccinationCampaignService : IVaccinationCampaignService
    {
        private readonly VaccinationCampaignRepository _vaccinationCampaignRepository;

        public VaccinationCampaignService(VaccinationCampaignRepository vaccinationCampaignRepository)
        {
            _vaccinationCampaignRepository = vaccinationCampaignRepository;
        }

        public async Task<BaseResponse> CreateVaccinaCampaignAsync(CreateVaccinationCampaignRequest vaccinationCampaign)
        {
            var vaccinationCampaignToCreate = new VaccinationCampaign
            {
                VaccineName = vaccinationCampaign.VaccineName,
                Date = vaccinationCampaign.Date,
                Description = vaccinationCampaign.Description,
                CreatedBy = vaccinationCampaign.CreatedBy,
            };

            var createdVaccinationCampaign = await _vaccinationCampaignRepository.CreateVaccinationCampaign(vaccinationCampaignToCreate);

            if (createdVaccinationCampaign == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status400BadRequest.ToString(),
                    Message = "Failed to create Vaccination Campaign. Please check the request data.",
                    Data = null
                };
            }

            return new BaseResponse
            {

                Status = StatusCodes.Status201Created.ToString(),
                Message = $"VaccinationCompaign with ID {createdVaccinationCampaign.CampaignId} created successfully.",
                Data = new CreateVaccinationCampaignResponse
                {
                    CampaignId = createdVaccinationCampaign.CampaignId,
                    VaccineName = createdVaccinationCampaign.VaccineName,
                    Date = createdVaccinationCampaign.Date,
                    Description = createdVaccinationCampaign.Description,
                    CreatedBy = createdVaccinationCampaign.CreatedBy,
                    CreateByName = createdVaccinationCampaign.CreatedByNavigation?.FullName
                }
            };

        }

        public async Task<BaseResponse> GetVaccinationCampaignAsync(int compaignId)
        {
            var vaccinationCompaign = await _vaccinationCampaignRepository.GetVaccinationCampaignById(compaignId);

            if (vaccinationCompaign == null)
            {
                return new BaseResponse
                {
                    Status = StatusCodes.Status404NotFound.ToString(),
                    Message = $"VaccinationCompaign with ID {compaignId} not found.",
                    Data = null
                };
            }

            return new BaseResponse
            {
                Status = StatusCodes.Status200OK.ToString(),
                Message = $"VaccinationCompaign with ID {compaignId} found successfully.",
                Data = new CreateVaccinationCampaignResponse
                {
                    CampaignId = vaccinationCompaign.CampaignId,
                    VaccineName = vaccinationCompaign.VaccineName,
                    Date = vaccinationCompaign.Date,
                    Description = vaccinationCompaign.Description,
                    CreatedBy = vaccinationCompaign.CreatedBy,
                    CreateByName = vaccinationCompaign.CreatedByNavigation?.FullName
                }
            };

        }
    }
}
