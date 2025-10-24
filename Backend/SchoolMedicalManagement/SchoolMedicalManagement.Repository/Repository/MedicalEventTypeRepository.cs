using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace SchoolMedicalManagement.Repository.Repository
{
    public class MedicalEventTypeRepository : GenericRepository<MedicalEventType>
    {
        public MedicalEventTypeRepository(SwpEduHealV5Context context) : base(context) { }

        public async Task<List<MedicalEventType>> GetAllMedicalEventTypes()
            => await _context.MedicalEventTypes
                .Include(t => t.MedicalEvents)
                .ToListAsync();

        public async Task<MedicalEventType?> GetMedicalEventTypeById(int id)
            => await _context.MedicalEventTypes
                .Include(t => t.MedicalEvents)
                .FirstOrDefaultAsync(t => t.EventTypeId == id);

        public async Task<MedicalEventType?> CreateMedicalEventType(MedicalEventType medicalEventType)
        {
            await CreateAsync(medicalEventType);
            return await GetMedicalEventTypeById(medicalEventType.EventTypeId);
        }

        public async Task<MedicalEventType?> UpdateMedicalEventType(MedicalEventType medicalEventType)
        {
            await UpdateAsync(medicalEventType);
            return await GetMedicalEventTypeById(medicalEventType.EventTypeId);
        }

        public async Task<bool> DeleteMedicalEventType(int id)
        {
            var isExist = await GetMedicalEventTypeById(id);
            if (isExist == null) return false;
            
            return await RemoveAsync(isExist);
        }
    }
}