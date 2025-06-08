using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;

namespace SchoolMedicalManagement.Repository.Repository
{
    public class MedicalEventRepository : GenericRepository<MedicalEvent>
    {
        public MedicalEventRepository(SwpEduHealV1Context context) : base(context)
        {
        }


        // Get a medical event by its ID
        public async Task<MedicalEvent?> GetMedicalEventById(int id) =>
            await _context.MedicalEvents
                .Include(e => e.Student)
                    .ThenInclude(pr => pr.Parent)
                .Include(e => e.HandledByNavigation)
                .FirstOrDefaultAsync(e => e.EventId == id);


        //Get All List
        public async Task<List<MedicalEvent>> GetAllMedicalEvents() =>
            await _context.MedicalEvents
                .Include(e => e.Student)
                    .ThenInclude(pr => pr.Parent)
                .Include(e => e.HandledByNavigation)
                .ToListAsync();

        // Create a new medical event
        public async Task<MedicalEvent?> CreateMedicalEvent(MedicalEvent medicalEvent)
        {
            await CreateAsync(medicalEvent);
            return await GetMedicalEventById(medicalEvent.EventId);
        }


        // Update an existing medical event
        public async Task<MedicalEvent?> UpdateMedicalEvent(MedicalEvent medicalEvent)
        {
            await UpdateAsync(medicalEvent);
            return await GetMedicalEventById(medicalEvent.EventId);
        }

        // Delete a medical event
        public async Task<bool?> DeleteMedicalEvent(int id)
        {
            var IsExist = await GetMedicalEventById(id);
            if (IsExist == null)
            {
                return null; // Event not found
            }
            return await RemoveAsync(IsExist);
        }
    }

}
