using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Repository.Repository
{
    public class StudentRepository : GenericRepository<Student>
    {
        private readonly SwpEduHealV5Context _context;

        public StudentRepository(SwpEduHealV5Context context) : base(context)
        {
            _context = context;
        }

        // ✅ Lấy tất cả học sinh còn hoạt động
        public async Task<List<Student>> GetAllStudents()
        {
            return await _context.Students
                .Include(s => s.Parent)
                .Where(s => s.IsActive.GetValueOrDefault()) // chỉ lấy học sinh đang hoạt động
                .ToListAsync();
        }

        // ✅ Lấy học sinh theo ID
        public async Task<Student?> GetStudentById(int studentId)
        {
            return await _context.Students
                .Include(s => s.Parent)
                .FirstOrDefaultAsync(s => s.StudentId == studentId && s.IsActive.GetValueOrDefault());
        }

        // ✅ Lấy học sinh theo phụ huynh
        public async Task<List<Student>> GetStudentsByParentId(Guid parentId)
        {
            return await _context.Students
                .Include(s => s.Parent)
                .Where(s => s.ParentId == parentId && s.IsActive.GetValueOrDefault())
                .ToListAsync();
        }

        // ✅ Tạo mới học sinh
        public async Task<Student?> CreateStudent(Student student)
        {
            await CreateAsync(student);
            return await GetStudentById(student.StudentId);
        }

        // ✅ Xoá mềm học sinh
        public async Task<bool> SoftDeleteStudent(int studentId)
        {
            var student = await GetStudentById(studentId);
            if (student == null) return false;

            student.IsActive = false;
            await UpdateAsync(student);
            return true;
        }

        // ✅ Lưu thay đổi
        public async Task<bool> SaveChanges()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        // ✅ Lấy hồ sơ sức khỏe
        public async Task<HealthProfile?> GetHealthProfileByStudentId(int studentId)
        {
            return await _context.HealthProfiles
                .FirstOrDefaultAsync(hp => hp.StudentId == studentId);
        }
    }
}
