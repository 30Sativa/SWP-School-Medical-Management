using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace SchoolMedicalManagement.Repository.Repository
{
    public class HealthCheckSummaryRepository : GenericRepository<HealthCheckSummary>
    {
        public HealthCheckSummaryRepository(SwpEduHealV5Context context) : base(context) { }

        public async Task<List<HealthCheckSummary>> GetAllHealthCheckSummaries()
            => await _context.HealthCheckSummaries
                .Include(s => s.Student)
                .Include(s => s.Campaign)
                .ToListAsync();

        public async Task<HealthCheckSummary?> GetHealthCheckSummaryById(int id)
            => await _context.HealthCheckSummaries
                .Include(s => s.Student)
                .Include(s => s.Campaign)
                .FirstOrDefaultAsync(s => s.RecordId == id);

        public async Task<HealthCheckSummary?> CreateHealthCheckSummary(HealthCheckSummary healthCheckRecord)
        {
            await CreateAsync(healthCheckRecord);
            return await GetHealthCheckSummaryById(healthCheckRecord.RecordId);
        }

        public async Task<HealthCheckSummary?> UpdateHealthCheckSummary(HealthCheckSummary healthCheckRecord)
        {
            await UpdateAsync(healthCheckRecord);
            return await GetHealthCheckSummaryById(healthCheckRecord.RecordId);
        }

        public async Task<bool> DeleteHealthCheckSummary(int id)
        {
            var isExist = await GetHealthCheckSummaryById(id);
            if (isExist == null) return false;
            
            return await RemoveAsync(isExist);
        }
    }
} 