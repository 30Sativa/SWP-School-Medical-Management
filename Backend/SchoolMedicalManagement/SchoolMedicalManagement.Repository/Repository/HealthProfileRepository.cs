using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Repository.Repository
{
    public class HealthProfileRepository : GenericRepository<HealthProfile>
    {
        public HealthProfileRepository(SwpEduHealV5Context context) : base(context)
        {
        }

        // ✅ Lấy tất cả hồ sơ sức khỏe (đang hoạt động)
        public async Task<List<HealthProfile>> GetAllHealthProfile()
            => await _context.HealthProfiles
                .Include(hp => hp.Student)
                .Where(hp => hp.IsActive == true) // ✅ Thêm điều kiện lọc nếu dùng soft delete
                .ToListAsync();

        // ✅ Lấy 1 hồ sơ theo ID
        public async Task<HealthProfile?> GetHealthProfileById(int id)
            => await _context.HealthProfiles
                .Include(hp => hp.Student)
                .FirstOrDefaultAsync(hp => hp.ProfileId == id && hp.IsActive == true);

        // ✅ Tạo mới hồ sơ
        public async Task<HealthProfile?> CreateHealthProfile(HealthProfile healthProfile)
        {
            healthProfile.IsActive = true; // đảm bảo trạng thái khi tạo mới
            await CreateAsync(healthProfile);
            return await GetHealthProfileById(healthProfile.ProfileId);
        }

        // ✅ Cập nhật hồ sơ
        public async Task<HealthProfile?> UpdateHealthProfile(HealthProfile healthProfile)
        {
            await UpdateAsync(healthProfile);
            return await GetHealthProfileById(healthProfile.ProfileId);
        }

        // ✅ Xoá mềm hồ sơ
        public async Task<bool> DeleteHealthProfile(int id)
        {
            var healthProfile = await GetHealthProfileById(id);
            if (healthProfile == null)
                return false;

            healthProfile.IsActive = false;
            await UpdateAsync(healthProfile);
            return true;
        }

        // ✅ Lấy hồ sơ sức khỏe theo StudentId
        public async Task<HealthProfile?> GetHealthProfileByStudentId(int studentId)
            => await _context.HealthProfiles
                .Include(hp => hp.Student)
                .FirstOrDefaultAsync(hp => hp.StudentId == studentId && hp.IsActive == true);
    }
}
