using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace SchoolMedicalManagement.Repository.Repository
{
    public class NotificationRepository : GenericRepository<Notification>
    {
        public NotificationRepository(SwpEduHealV5Context context) : base(context) { }

        public async Task<List<Notification>> GetAllNotifications()
            => await _context.Notifications
                .Include(n => n.Receiver)
                .Include(n => n.Type)
                .ToListAsync();

        public async Task<List<Notification>> GetNotificationsByUserId(Guid userId)
            => await _context.Notifications
                .Include(n => n.Receiver)
                .Include(n => n.Type)
                .Where(n => n.ReceiverId == userId)
                .ToListAsync();

        public async Task<Notification?> GetNotificationById(int id)
            => await _context.Notifications
                .Include(n => n.Receiver)
                .Include(n => n.Type)
                .FirstOrDefaultAsync(n => n.NotificationId == id);

        public async Task<Notification?> CreateNotification(Notification notification)
        {
            await CreateAsync(notification);
            return await GetNotificationById(notification.NotificationId);
        }

        public async Task<Notification?> UpdateNotification(Notification notification)
        {
            await UpdateAsync(notification);
            return await GetNotificationById(notification.NotificationId);
        }

        public async Task<bool> DeleteNotification(int id)
        {
            var isExist = await GetNotificationById(id);
            if (isExist == null) return false;
            
            return await RemoveAsync(isExist);
        }
    }
} 