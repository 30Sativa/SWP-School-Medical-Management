using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;
using SchoolMedicalManagement.Models.Utils;
using SchoolMedicalManagement.Models.Request;

namespace SchoolMedicalManagement.Repository.Repository
{
    // Repository xử lý dữ liệu liên quan đến User
    public class UserRepository : GenericRepository<User>
    {
        public UserRepository(SwpEduHealV5Context context) : base(context)
        {
        }

        // Đăng nhập: kiểm tra username và mật khẩu đã hash
        public async Task<User?> GetLoginUser(LoginUserRequest loginRequest)
        {
            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u =>
                    u.Username == loginRequest.Username &&
                    u.Password == HashPassword.HashPasswordd(loginRequest.Password));
        }

        // Lấy danh sách tất cả người dùng (kèm Role)
        public async Task<List<User>> GetAllUser()
        {
            return await _context.Users
                .Include(u => u.Role)
                .ToListAsync();
        }

        // Lấy thông tin chi tiết 1 người dùng theo ID (kèm Role)
        public async Task<User?> GetUserById(Guid id)
        {
            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == id);
        }

        // Lấy người dùng theo Username (dùng để kiểm tra trùng)
        public async Task<User?> GetUserByUsername(string username)
        {
            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Username == username);
        }

        // Tạo người dùng mới → lấy lại thông tin đầy đủ (gồm Role)
        public async Task<User?> CreateUser(User user)
        {
            await CreateAsync(user);
            return await GetUserById(user.UserId); // đảm bảo có Include Role
        }

        // Xóa người dùng nếu tồn tại
        public async Task<bool> HardDeleteUser(Guid id)
        {
            var user = await GetUserById(id);
            if (user == null)
            {
                return false;
            }
            return await RemoveAsync(user);
        }

        // Cập nhật thông tin người dùng
        public async Task<User?> UpdateUser(User user)
        {
            await UpdateAsync(user);
            return await GetUserById(user.UserId); // trả lại thông tin mới (gồm Role)
        }

        // Lấy user đơn giản theo ID (không Include Role), dùng khi đổi mật khẩu
        public Task<User?> GetUserById(Guid id, ChangePasswordUserRequest request)
        {
            return _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
        }

        public async Task<bool> SoftDeleteUser(Guid id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null)
            {
                return false;
            }
           user.IsActive = false;
            UpdateAsync(user);
            return true;

        }

        // Lấy người dùng theo Email (dùng cho quên mật khẩu, xác thực OTP)
        public async Task<User?> GetUserByEmail(string email)
        {
            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        // Lấy danh sách VaccinationConsentRequest theo danh sách StudentId
        public async Task<List<VaccinationConsentRequest>> GetConsentRequestsByStudentIds(List<int> studentIds)
        {
            return await _context.VaccinationConsentRequests
                .Include(v => v.Campaign)
                .Include(v => v.ConsentStatus)
                .Include(v => v.Student)
                .Where(v => studentIds.Contains(v.StudentId))
                .ToListAsync();
        }
    }
}
