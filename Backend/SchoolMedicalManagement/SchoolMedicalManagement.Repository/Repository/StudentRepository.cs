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
        //Get Student by id
        public async Task<Student?> GetStudentById(int id)
        {
            return await _context.Students
                .Include(s => s.Parent)
                .FirstOrDefaultAsync(s => s.StudentId == id); 
        }

        //Get list Student
        public async Task<List<Student>> GetAllStudent()
        {
            return await _context.Students
                .Include(s => s.Parent)
                .ToListAsync();
        }

        //Create Student

    }
}
