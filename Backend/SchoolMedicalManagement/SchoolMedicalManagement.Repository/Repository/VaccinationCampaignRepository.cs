using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace SchoolMedicalManagement.Repository.Repository
{
    // Repository xử lý các thao tác CRUD với bảng VaccinationCampaign và các bảng liên quan
    public class VaccinationCampaignRepository : GenericRepository<VaccinationCampaign>
    {
        public VaccinationCampaignRepository(SwpEduHealV5Context context) : base(context) { }

        // Lấy danh sách tất cả chiến dịch tiêm chủng kèm thông tin người tạo và các bản ghi liên quan
        public async Task<List<VaccinationCampaign>> GetAllCampaigns()
            => await _context.VaccinationCampaigns
                .Include(c => c.CreatedByNavigation)
                .Include(c => c.VaccinationConsentRequests)
                .Include(c => c.VaccinationRecords)
                .ToListAsync();

        // Lấy thông tin chi tiết một chiến dịch tiêm chủng theo ID
        public async Task<VaccinationCampaign?> GetCampaignById(int id)
            => await _context.VaccinationCampaigns
                .Include(c => c.CreatedByNavigation)
                .Include(c => c.VaccinationConsentRequests)
                .Include(c => c.VaccinationRecords)
                .FirstOrDefaultAsync(c => c.CampaignId == id);

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
                .Include(c => c.ConsentStatus)
                .FirstOrDefaultAsync(c => c.RequestId == id);

        // Lấy lịch sử tiêm chủng của một học sinh
        public async Task<List<VaccinationRecord>> GetStudentVaccinationRecords(int studentId)
            => await _context.VaccinationRecords
                .Include(v => v.Campaign)
                .Include(v => v.ConsentStatus)
                .Where(v => v.ConsentStatusId == 2) // Đã đồng ý tiêm rùi mới có trong ls
                .Where(v => v.StudentId == studentId)
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
            await _context.VaccinationRecords.AddAsync(record);
            await _context.SaveChangesAsync();
            return await _context.VaccinationRecords
                .Include(v => v.Campaign)
                .Include(v => v.ConsentStatus)
                .FirstOrDefaultAsync(v => v.RecordId == record.RecordId);
        }

        // Cập nhật thông tin một yêu cầu đồng ý
        public async Task<VaccinationConsentRequest?> UpdateConsentRequest(VaccinationConsentRequest request)
        {
            _context.VaccinationConsentRequests.Update(request);
            await _context.SaveChangesAsync();
            return await GetConsentRequestById(request.RequestId);
        }
    }
}
