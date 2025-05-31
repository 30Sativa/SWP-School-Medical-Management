using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Repository.Request;

namespace SchoolMedicalManagement.Repository.Repository
{
    public class UserRepository : GenericRepository<User>
    {
        public async Task<User> Login(UserLoginRequest loginRequest)
        {
            return await _context.Users.Include(u => u.Role)
                                       .FirstOrDefaultAsync(u => u.Username == loginRequest.Username &&
                                                                 u.Password == loginRequest.Password);
        }
    }
}
