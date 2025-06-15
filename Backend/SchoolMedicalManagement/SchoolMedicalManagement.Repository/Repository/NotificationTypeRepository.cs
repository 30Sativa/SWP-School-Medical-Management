using Microsoft.EntityFrameworkCore;
using SchoolMedicalManagement.Models.Entity;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace SchoolMedicalManagement.Repository.Repository
{
    public class NotificationTypeRepository : GenericRepository<NotificationType>
    {
        public NotificationTypeRepository(SwpEduHealV5Context context) : base(context) { }

        public async Task<List<NotificationType>> GetAllNotificationTypes()
            => await _context.NotificationTypes
                .Include(t => t.Notifications)
                .ToListAsync();

        public async Task<NotificationType?> GetNotificationTypeById(int id)
            => await _context.NotificationTypes
                .Include(t => t.Notifications)
                .FirstOrDefaultAsync(t => t.TypeId == id);

        public async Task<NotificationType?> CreateNotificationType(NotificationType notificationType)
        {
            await CreateAsync(notificationType);
            return await GetNotificationTypeById(notificationType.TypeId);
        }

        public async Task<NotificationType?> UpdateNotificationType(NotificationType notificationType)
        {
            await UpdateAsync(notificationType);
            return await GetNotificationTypeById(notificationType.TypeId);
        }

        public async Task<bool> DeleteNotificationType(int id)
        {
            var isExist = await GetNotificationTypeById(id);
            if (isExist == null) return false;
            
            return await RemoveAsync(isExist);
        }
    }
} 