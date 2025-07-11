using SchoolMedicalManagement.Models.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SchoolMedicalManagement.Repository.Repository
{
    public class HealthCheckCampaignRepository : GenericRepository<HealthCheckCampaign>
    {
        public HealthCheckCampaignRepository(SwpEduHealV5Context context) : base(context)
        {
        }

        // Lấy tất cả các chiến dịch khám sức khỏe
        public async Task<List<HealthCheckCampaign>> GetAllHealthCheckCampaigns()
        => await _context.HealthCheckCampaigns
            .Include(c => c.CreatedByNavigation)
            .Include(c => c.Status)
            .Include(c => c.HealthCheckSummaries)
            .ThenInclude(s => s.Student)
            .ToListAsync();

        // Lấy chiến dịch khám sức khỏe theo id
        public async Task<HealthCheckCampaign?> GetHealthCheckCampaignById(int id)
        => await _context.HealthCheckCampaigns
            .Include(c => c.CreatedByNavigation)
            .Include(c => c.Status)
            .Include(c => c.HealthCheckSummaries)
            .ThenInclude(s => s.Student)
            .FirstOrDefaultAsync(c => c.CampaignId == id);

        // Tạo mới chiến dịch khám sức khỏe
        public async Task<HealthCheckCampaign?> CreateHealthCheckCampaign(HealthCheckCampaign campaign)
        {
            await CreateAsync(campaign);
            return await GetHealthCheckCampaignById(campaign.CampaignId);
        }

        // Cập nhật chiến dịch khám sức khỏe
        public async Task<HealthCheckCampaign?> UpdateHealthCheckCampaign(HealthCheckCampaign campaign)
        {
            await UpdateAsync(campaign);
            return await GetHealthCheckCampaignById(campaign.CampaignId);
        }

        // Xóa chiến dịch khám sức khỏe
        public async Task<bool> DeleteHealthCheckCampaign(int id)
        {
            var campaign = await GetHealthCheckCampaignById(id);
            if (campaign == null)
            {
                return false;
            }
            return await RemoveAsync(campaign);
        }

        // Get total count of health check campaigns
        public async Task<int> GetTotalHealthCheckCampaignsCount()
        {
            return await _context.HealthCheckCampaigns.CountAsync();
        }

        // Get count of active health check campaigns
        public async Task<int> GetActiveHealthCheckCampaignsCount()
        {
            return await _context.HealthCheckCampaigns.CountAsync();
        }
    }
}
