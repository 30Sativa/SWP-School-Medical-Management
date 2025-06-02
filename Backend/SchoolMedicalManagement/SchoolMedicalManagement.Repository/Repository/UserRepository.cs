using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Utils;
using SchoolMedicalManagement.Models.Request;

namespace SchoolMedicalManagement.Repository.Repository
{
    public class UserRepository : GenericRepository<User>
    {
        public async Task<User?> GetLogin(UserLoginRequest loginRequest)
        {
            return await _context.Users.Include(u => u.Role)
                                       .FirstOrDefaultAsync(u => u.Username == loginRequest.Username &&
                                                                 u.Password == HashPassword.HashPasswordd(loginRequest.Password));
        }

        // Get list ds người dùng từ db ra
        public async Task<List<User>> GetAll()
        {
            return await _context.Users.Include(u => u.Role).ToListAsync();
        }

        //Get user by id
        public async Task<User?> GetUserById(int id)
        {
            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == id);
        }

        //Get user by username
        public async Task<User?> GetUserByUsername(string username)
        {
            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Username == username);
        }

        //Create a new user
        public async Task<User?> CreateUser(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == user.UserId);
        }

        //Delete a user
        public async Task<bool> DeleteUser(int id)
        {
            var user = await GetUserById(id);
            if (user == null)
            {
                return false; // User not found
            }
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true; 
        }   

        //Update a user
        public async Task<User?> UpdateUser(User user)
        {

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            //Trả về info user sau khi update
            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == user.UserId);
        }
         
        //Get user by id for change password
        public Task<User?> GetUserById(int id, UserChangePasswordRequest request)
        {
            return _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
        }




    }
}
