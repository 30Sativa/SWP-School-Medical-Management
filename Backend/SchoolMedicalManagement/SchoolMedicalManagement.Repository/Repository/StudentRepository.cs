using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedicalManagement.Repository.Repository
{
    public class StudentRepository : GenericRepository<Student>
    {
        public StudentRepository(SwpEduHealV1Context context) : base(context)
        {
        }

        //Get Student by id
        public async Task<Student?> GetStudentById(int id) =>
            await _context.Students
            .Include(s => s.Parent)
            .FirstOrDefaultAsync(s => s.StudentId == id);


        //Get list Student
        public async Task<List<Student>> GetAllStudent() =>
            await _context.Students
            .Include(s => s.Parent)
            .ToListAsync();


        //Create Student
        public async Task<Student?> CreateStudent(Student student)
        {
            await _context.Students.AddAsync(student);
            await _context.SaveChangesAsync();
            return await GetStudentById(student.StudentId);
        }

        //Update Student
        //public async Task<bool> UpdateStudent(Student student)
        //{
        //    // Tìm coi hs cần update có trong db không
        //    var existingStudent = await GetStudentById(student.StudentId);

        //    if (existingStudent == null) return false; //Ko có thì xủi

        //    //Cóa thì entry zô rùi set lại giá trị của nó thui
        //    _context.Entry(existingStudent).CurrentValues.SetValues(student);
        //    await _context.SaveChangesAsync();
        //    return true;
        //}

        // Bổ trợ hàm update trên tầng service
        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        //Delete Student
        public async Task<bool> DeleteStudent(int id)
        {
            // Tìm xem học sinh cần xóa có trong db không
            var student = await GetStudentById(id);
            if (student == null)
            {
                return false; // ko có thì xủi
            }
            //Cóa thì remove 
            //Hello Văn Thành t nghĩ nên chuyển lại xóa mềm
            //thêm trường active trong db thui
            _context.Students.Remove(student);
            await _context.SaveChangesAsync();
            return true;

        }
    }
}