﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;

namespace SchoolMedicalManagement.Repository.Repository
{
    public class MedicalHistoryRepository : GenericRepository<MedicalHistory>
    {
        public MedicalHistoryRepository(SwpEduHealV5Context context) : base(context) { }

        // 🔍 Lấy toàn bộ tiền sử bệnh của một học sinh
        public async Task<List<MedicalHistory>> GetAllByStudentIdMedicalHistory(int studentId) =>
            await _context.MedicalHistories
                          .Where(h => h.StudentId == studentId)
                          .Include(h => h.Student)
                          .ToListAsync();

        // 🔍 Lấy chi tiết 1 record tiền sử bệnh theo ID
        public async Task<MedicalHistory?> GetByIdMedicalHistory(int id) =>
            await _context.MedicalHistories
                          .Include(h => h.Student)
                          .FirstOrDefaultAsync(h => h.HistoryId == id);

        // ➕ Tạo mới
        public async Task<MedicalHistory?> CreateMedicalHistory(MedicalHistory history)
        {
            await _context.MedicalHistories.AddAsync(history);
            var affected = await _context.SaveChangesAsync();
            return affected > 0 ? history : null;
        }

        // ✏️ Cập nhật
        public async Task<MedicalHistory?> UpdateMedicalHistory(MedicalHistory history)
        {
            _context.MedicalHistories.Update(history);
            var affected = await _context.SaveChangesAsync();
            return affected > 0 ? history : null;
        }

        // ❌ Xoá cứng (vì không có IsActive)
        public async Task<int> DeleteMedicalHistory(int id)
        {
            var history = await _context.MedicalHistories.FindAsync(id);
            if (history == null) return 0;
            _context.MedicalHistories.Remove(history);
            return await _context.SaveChangesAsync();
        }

        // 📋 Lấy tất cả tiền sử (toàn hệ thống) nếu cần quản trị viên dùng
        public async Task<List<MedicalHistory>> GetAllMedicalHistory()
        {
            return await _context.MedicalHistories
                                 .Include(h => h.Student)
                                 .ToListAsync();
        }
    }
}
