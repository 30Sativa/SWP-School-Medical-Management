using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace SchoolMedicalManagement.Repository.Repository
{
    // Repository xử lý các thao tác CRUD với bảng VaccinationCampaign và các bảng liên quan
    public class VaccinationCampaignRepository : GenericRepository<VaccinationCampaign>
    {
        public VaccinationCampaignRepository(SwpEduHealV5Context context) : base(context) { }

        // Lấy danh sách tất cả chiến dịch tiêm chủng đang hoạt động
        public async Task<List<VaccinationCampaign>> GetAllActiveCampaigns()
            => await _context.VaccinationCampaigns
                .Include(c => c.CreatedByNavigation)
                .Include(c => c.Status)
                .Include(c => c.VaccinationConsentRequests)
                .Include(c => c.VaccinationRecords)
                .Where(c => c.StatusId == 1) // 1: Đang hoạt động
                .ToListAsync();

        // Lấy danh sách tất cả chiến dịch tiêm chủng (bao gồm cả đã đóng)
        public async Task<List<VaccinationCampaign>> GetAllCampaigns()
            => await _context.VaccinationCampaigns
                .Include(c => c.CreatedByNavigation)
                .Include(c => c.Status)
                .Include(c => c.VaccinationConsentRequests)
                .Include(c => c.VaccinationRecords)
                .ToListAsync();

        // Lấy thông tin chi tiết một chiến dịch tiêm chủng theo ID
        public async Task<VaccinationCampaign?> GetCampaignById(int id)
            => await _context.VaccinationCampaigns
                .Include(c => c.CreatedByNavigation)
                .Include(c => c.Status)
                .Include(c => c.VaccinationConsentRequests)
                .Include(c => c.VaccinationRecords)
                .FirstOrDefaultAsync(c => c.CampaignId == id);

        // Lấy danh sách chiến dịch theo trạng thái
        public async Task<List<VaccinationCampaign>> GetCampaignsByStatus(int statusId)
            => await _context.VaccinationCampaigns
                .Include(c => c.CreatedByNavigation)
                .Include(c => c.Status)
                .Include(c => c.VaccinationConsentRequests)
                .Include(c => c.VaccinationRecords)
                .Where(c => c.StatusId == statusId)
                .ToListAsync();

        // Lấy danh sách tất cả các yêu cầu xác nhận của một chiến dịch tiêm chủng
        public async Task<List<VaccinationConsentRequest>> GetCampaignConsentRequests(int campaignId)
            => await _context.VaccinationConsentRequests
                .Include(c => c.Student)
                .Include(c => c.Parent)
                .Include(c => c.ConsentStatus)
                .Where(c => c.CampaignId == campaignId)
                .ToListAsync();

        // Lấy thông tin chi tiết một yêu cầu đồng ý theo ID
        public async Task<VaccinationConsentRequest?> GetConsentRequestById(int id)
            => await _context.VaccinationConsentRequests
                .Include(c => c.Student)
                .Include(c => c.Parent)
                .Include(c => c.Campaign)
                .Include(c => c.ConsentStatus)
                .FirstOrDefaultAsync(c => c.RequestId == id);

        // Lấy lịch sử tiêm chủng của một học sinh
        public async Task<List<VaccinationRecord>> GetStudentVaccinationRecords(int studentId)
            => await _context.VaccinationRecords
                .Include(v => v.Campaign)
                .Include(v => v.ConsentStatus)
                .Where(v => v.ConsentStatusId == 2) // Đã đồng ý tiêm rùi mới có trong ls
                .Where(v => v.StudentId == studentId && v.IsActive == true)
                .ToListAsync();

        // Tạo mới một chiến dịch tiêm chủng
        public async Task<VaccinationCampaign?> CreateCampaign(VaccinationCampaign campaign)
        {
            await CreateAsync(campaign);
            return await GetCampaignById(campaign.CampaignId);
        }

        // Tạo mới một yêu cầu đồng ý tiêm chủng
        public async Task<VaccinationConsentRequest?> CreateConsentRequest(VaccinationConsentRequest request)
        {
            await _context.VaccinationConsentRequests.AddAsync(request);
            await _context.SaveChangesAsync();
            return await GetConsentRequestById(request.RequestId);
        }

        // Tạo mới một bản ghi kết quả tiêm chủng
        public async Task<VaccinationRecord?> CreateVaccinationRecord(VaccinationRecord record)
        {
            record.IsActive = true;
            await _context.VaccinationRecords.AddAsync(record);
            await _context.SaveChangesAsync();
            return await _context.VaccinationRecords
                .Include(v => v.Campaign)
                .Include(v => v.ConsentStatus)
                .Where(v => v.IsActive == true)
                .FirstOrDefaultAsync(v => v.RecordId == record.RecordId);
        }

        // Cập nhật thông tin một yêu cầu đồng ý
        public async Task<VaccinationConsentRequest?> UpdateConsentRequest(VaccinationConsentRequest request)
        {
            _context.VaccinationConsentRequests.Update(request);
            await _context.SaveChangesAsync();
            return await GetConsentRequestById(request.RequestId);
        }

        // Get total count of vaccination campaigns
        public async Task<int> GetTotalVaccinationCampaignsCount()
        {
            return await _context.VaccinationCampaigns.CountAsync();
        }

        // Get count of active vaccination campaigns (StatusId = 1)
        public async Task<int> GetActiveVaccinationCampaignsCount()
        {
            return await _context.VaccinationCampaigns.Where(c => c.StatusId == 1).CountAsync();
        }

        // Get count of closed vaccination campaigns (StatusId = 2)
        public async Task<int> GetClosedVaccinationCampaignsCount()
        {
            return await _context.VaccinationCampaigns.Where(c => c.StatusId == 2).CountAsync();
        }

        // Cập nhật chiến dịch tiêm chủng
        public async Task<VaccinationCampaign?> UpdateCampaign(VaccinationCampaign campaign)
        {
            _context.VaccinationCampaigns.Update(campaign);
            var affected = await _context.SaveChangesAsync();
            return affected > 0 ? await GetCampaignById(campaign.CampaignId) : null;
        }

        // Vô hiệu hóa chiến dịch (chuyển StatusId từ 1 sang 2)
        public async Task<VaccinationCampaign?> DeactivateCampaign(int campaignId)
        {
            var campaign = await GetCampaignById(campaignId);
            if (campaign == null || campaign.StatusId != 1)
            {
                return null; // Không tìm thấy hoặc không phải trạng thái đang hoạt động
            }

            campaign.StatusId = 2; // Chuyển sang "Đã kết thúc"
            return await UpdateCampaign(campaign);
        }

        // Kích hoạt lại chiến dịch (chuyển StatusId từ 2 sang 1)
        public async Task<VaccinationCampaign?> ActivateCampaign(int campaignId)
        {
            var campaign = await GetCampaignById(campaignId);
            if (campaign == null || campaign.StatusId != 2)
            {
                return null; // Không tìm thấy hoặc không phải trạng thái đã kết thúc
            }

            campaign.StatusId = 1; // Chuyển sang "Đang hoạt động"
            return await UpdateCampaign(campaign);
        }

        // Kiểm tra trạng thái chiến dịch
        public async Task<bool> IsCampaignActive(int campaignId)
        {
            var campaign = await _context.VaccinationCampaigns
                .Where(c => c.CampaignId == campaignId)
                .Select(c => c.StatusId)
                .FirstOrDefaultAsync();
            
            return campaign == 1; // Trả về true nếu StatusId = 1 (Đang hoạt động)
        }

        // Kiểm tra trạng thái chiến dịch
        public async Task<bool> IsCampaignClosed(int campaignId)
        {
            var campaign = await _context.VaccinationCampaigns
                .Where(c => c.CampaignId == campaignId)
                .Select(c => c.StatusId)
                .FirstOrDefaultAsync();
            
            return campaign == 2; // Trả về true nếu StatusId = 2 (Đã kết thúc)
        }

        // Lấy trạng thái hiện tại của chiến dịch
        public async Task<int?> GetCampaignStatus(int campaignId)
        {
            return await _context.VaccinationCampaigns
                .Where(c => c.CampaignId == campaignId)
                .Select(c => c.StatusId)
                .FirstOrDefaultAsync();
        }

        // Lấy danh sách chiến dịch theo khoảng thời gian
        public async Task<List<VaccinationCampaign>> GetCampaignsByDateRange(DateOnly startDate, DateOnly endDate)
        {
            return await _context.VaccinationCampaigns
                .Include(c => c.CreatedByNavigation)
                .Include(c => c.Status)
                .Include(c => c.VaccinationConsentRequests)
                .Include(c => c.VaccinationRecords)
                .Where(c => c.Date >= startDate && c.Date <= endDate)
                .ToListAsync();
        }

        // Lấy danh sách chiến dịch theo người tạo
        public async Task<List<VaccinationCampaign>> GetCampaignsByCreator(Guid creatorId)
        {
            return await _context.VaccinationCampaigns
                .Include(c => c.CreatedByNavigation)
                .Include(c => c.Status)
                .Include(c => c.VaccinationConsentRequests)
                .Include(c => c.VaccinationRecords)
                .Where(c => c.CreatedBy == creatorId)
                .ToListAsync();
        }

        // Lấy thống kê chiến dịch
        public async Task<object> GetCampaignStatistics()
        {
            var totalCampaigns = await _context.VaccinationCampaigns.CountAsync();
            var activeCampaigns = await _context.VaccinationCampaigns.Where(c => c.StatusId == 1).CountAsync();
            var closedCampaigns = await _context.VaccinationCampaigns.Where(c => c.StatusId == 2).CountAsync();
            var campaignsThisMonth = await _context.VaccinationCampaigns
                .Where(c => c.Date >= DateOnly.FromDateTime(DateTime.Now.AddDays(-30)))
                .CountAsync();

            return new
            {
                TotalCampaigns = totalCampaigns,
                ActiveCampaigns = activeCampaigns,
                ClosedCampaigns = closedCampaigns,
                CampaignsThisMonth = campaignsThisMonth
            };
        }
    }
}
