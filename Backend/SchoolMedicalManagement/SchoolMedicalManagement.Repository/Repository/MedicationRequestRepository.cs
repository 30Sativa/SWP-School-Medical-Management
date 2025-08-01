﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;

namespace SchoolMedicalManagement.Repository.Repository
{
    public class MedicationRequestRepository : GenericRepository<MedicationRequest>
    {
        public MedicationRequestRepository(SwpEduHealV5Context context) : base(context)
        {
        }


        // ✅ Lấy danh sách đơn thuốc đang chờ duyệt
        public async Task<List<MedicationRequest>> GetPendingRequestsAsync()
        {
            return await _context.MedicationRequests
                .Where(r => r.StatusId == 1 && r.IsActive == true)
                .Include(r => r.Student)  // nếu bạn cần thông tin học sinh
                .Include(r => r.Status) // nếu bạn cần thông tin trạng thái
                .Include(r => r.ReceivedByNavigation)
                .Include(r => r.Parent) // thêm thông tin phụ huynh
                .ToListAsync();
        }

        // ✅ Tìm đơn thuốc theo ID
        public async Task<MedicationRequest?> GetByIdMedical(int id)
        {
            return await _context.MedicationRequests
                .Include(r => r.Student)
                .Include(r => r.Status)
                .Include(r => r.Parent)
                .Include(r => r.ReceivedByNavigation)
                .FirstOrDefaultAsync(r => r.RequestId == id && r.IsActive == true);
        }

        // ✅ Cập nhật trạng thái đơn thuốc
        public async Task<bool> UpdateStatusAsync(MedicationRequest request)
        {
            _context.MedicationRequests.Update(request);
            return await _context.SaveChangesAsync() > 0;
        }


        // ✅ Lấy danh sách đơn thuốc đã duyệt
        public async Task<List<MedicationRequest>> GetApprovedRequestsAsync()
        {
            return await _context.MedicationRequests
                .Where(r => r.StatusId == 2 && r.IsActive == true)
                .Include(r => r.Student)  // nếu bạn cần thông tin học sinh
                .Include(r => r.ReceivedByNavigation) // nếu bạn cần thông tin y tá đã duyệt
                .ToListAsync();
        }
        // ✅ Lấy danh sách đơn thuốc đã từ chối
        public async Task<List<MedicationRequest>> GetRejectedRequestsAsync()
        {
            return await _context.MedicationRequests
                .Where(r => r.StatusId == 3 && r.IsActive == true)
                .Include(r => r.Student)  // nếu bạn cần thông tin học sinh
                .ToListAsync();
        }
        // ✅ Lấy danh sách đơn thuốc của phụ huynh
        public async Task<List<MedicationRequest>> GetRequestsByParentIdAsync(Guid parentId)
        {
            return await _context.MedicationRequests
                .Where(r => r.ParentId == parentId && r.IsActive == true)
                .Include(r => r.Student)  // nếu bạn cần thông tin học sinh
                .Include(r => r.Status)
                .Include(r => r.Parent)
                .Include(r => r.ReceivedByNavigation)
                .ToListAsync();
        }

        // ✅ Tạo đơn thuốc mới
        public async Task<int> CreateMedicalRequestAsync(MedicationRequest request)
        {
            _context.MedicationRequests.Add(request);
             await _context.SaveChangesAsync();
            return request.RequestId; // Trả về ID của đơn thuốc mới tạo
        }


        // ✅ Lấy tất cả danh sách 

        public Task<List<MedicationRequest>> GetAllRequestsAsync()
        {
            return _context.MedicationRequests
                .Include(r => r.Student)
                .Include(r => r.Status)
                .Include(r => r.Parent)
                .Include(r => r.ReceivedByNavigation)
                .Where(r => r.IsActive == true)
                .ToListAsync();
        }


        // ✅ lấy theo studentid

        public Task<MedicationRequest?> GetRequestByStudentIdAsync(string studentId)
        {
            int studentIdInt;
            if (int.TryParse(studentId, out studentIdInt))
            {
                return _context.MedicationRequests
                    .Include(e => e.Student)
                    .Include(e => e.Status)
                    .Include(e => e.Parent)
                    .Include(e => e.ReceivedByNavigation)
                    .Where(e => e.IsActive == true)
                    .FirstOrDefaultAsync(e => e.StudentId == studentIdInt);
            }
            return Task.FromResult<MedicationRequest?>(null);
        }

        // ✅ Lấy danh sách đơn thuốc theo Id trạng thái
        public async Task<List<MedicationRequest>> GetRequestsByStatusIdAsync(int statusId)
        {
            return await _context.MedicationRequests
                .Where(r => r.StatusId == statusId && r.IsActive == true)
                .Include(r => r.Student)  // nếu bạn cần thông tin học sinh
                .Include(r => r.Status)   // nếu bạn cần thông tin trạng thái
                .Include(r => r.Parent)   // thêm thông tin phụ huynh
                .Include(r => r.ReceivedByNavigation)
                .ToListAsync();
        }

    }
}
