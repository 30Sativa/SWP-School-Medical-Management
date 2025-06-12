using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Repository.Repository
{
    public class VaccinationCampaignRepository : GenericRepository<VaccinationCampaign>
    {
        public VaccinationCampaignRepository(SwpEduHealV5Context context) : base(context) { }

        public async Task<VaccinationCampaign?> GetVaccinationCampaignById(int campaignId)
        => await _context.VaccinationCampaigns
            .Include(v => v.CreatedByNavigation)
            .FirstOrDefaultAsync(v => v.CampaignId == campaignId);


        public async Task<VaccinationCampaign?> CreateVaccinationCampaign(VaccinationCampaign vaccinationCampaign)
        {
            await CreateAsync(vaccinationCampaign);
            return await GetVaccinationCampaignById(vaccinationCampaign.CampaignId);
        }

        
    }
}
