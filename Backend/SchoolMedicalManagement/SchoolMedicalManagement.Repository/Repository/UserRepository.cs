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

        // Get list ds người dùng từ db ra
        public async Task<List<User>> GetAll()
        {
            return await _context.Users.Include(u => u.Role).ToListAsync();
        }

        //Get user by id
        public async Task<User> GetUserById(int id)
        {
            return await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserId == id);
        }

        //Get user by id for change password
        public Task<User> GetUserById(UserChangePasswordRequest request)
        {
            return _context.Users.FirstOrDefaultAsync(u => u.UserId == request.UserId);
        }




    }
}
