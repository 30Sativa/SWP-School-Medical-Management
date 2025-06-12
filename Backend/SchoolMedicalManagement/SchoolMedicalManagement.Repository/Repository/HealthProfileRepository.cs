using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Repository.Repository
{
    public class HealthProfileRepository : GenericRepository<HealthProfile>
    {
        public HealthProfileRepository(SwpEduHealV5Context context) : base(context)
        {
        }

        // Get all health profiles
        public async Task<List<HealthProfile>> GetAllHealthProfile()
        => await _context.HealthProfiles
            .Include(hp => hp.Student)
            .ToListAsync();

        // Get health profile by id
        public async Task<HealthProfile?> GetHealthProfileById(int id)
        => await _context.HealthProfiles
            .Include(hp => hp.Student)
            .FirstOrDefaultAsync(hp => hp.ProfileId == id);
        

        // Create a new health profile
        public async Task<HealthProfile?> CreateHealthProfile(HealthProfile healthProfile)
        {
            await CreateAsync(healthProfile);
            return await GetHealthProfileById(healthProfile.ProfileId);
        }

        // Update a health profile
        public async Task<HealthProfile?> UpdateHealthProfile(HealthProfile healthProfile)
        {
            await UpdateAsync(healthProfile);
            return await GetHealthProfileById(healthProfile.ProfileId);
        }

        // Soft delete a health profile
        public async Task<bool> DeleteHealthProfile(int id)
        {
            var healthProfile = await GetHealthProfileById(id);
            if (healthProfile == null)
            {
                return false;
            }
            await UpdateAsync(healthProfile);
            return true;
        }
    }
}
