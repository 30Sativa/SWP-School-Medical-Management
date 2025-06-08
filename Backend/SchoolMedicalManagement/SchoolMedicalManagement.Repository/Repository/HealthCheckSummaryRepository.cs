using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Repository.Repository
{
    public class HealthCheckSummaryRepository : GenericRepository<HealthCheckSummary>
    {
        public HealthCheckSummaryRepository(SwpEduHealV1Context context) : base(context) { }

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

        public async Task<HealthCheckSummary?> CreateHealthCheckSummary(HealthCheckSummary summary)
        {
            await CreateAsync(summary);
            return await GetHealthCheckSummaryById(summary.RecordId);
        }

        public async Task<HealthCheckSummary?> UpdateHealthCheckSummary(HealthCheckSummary summary)
        {
            await UpdateAsync(summary);
            return await GetHealthCheckSummaryById(summary.RecordId);
        }

        public async Task<bool> DeleteHealthCheckSummary(int id)
        {
            var summary = await GetHealthCheckSummaryById(id);
            if (summary == null) return false;
            _context.HealthCheckSummaries.Remove(summary);
            await _context.SaveChangesAsync();
            return true;
        }
    }
} 