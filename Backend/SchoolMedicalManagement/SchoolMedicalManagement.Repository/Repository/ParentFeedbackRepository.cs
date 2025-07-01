using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Repository.Repository
{
    public class ParentFeedbackRepository : GenericRepository<ParentFeedback>
    {
        public ParentFeedbackRepository(SwpEduHealV5Context context) : base(context) { }

        // Lấy tất cả feedback, bao gồm thông tin Parent
        public async Task<List<ParentFeedback>> GetAllFeedbackAsync()
        {
            return await _context.ParentFeedbacks
                .Include(f => f.Parent)
                .ToListAsync();
        }

        // Lấy chi tiết feedback theo ID
        public async Task<ParentFeedback?> GetFeedbackByIdAsync(int id)
        {
            return await _context.ParentFeedbacks
                .Include(f => f.Parent)
                .FirstOrDefaultAsync(f => f.FeedbackId == id);
        }
    }
} 