using AutoMapper;
using backend.Data;
using backend.Dtos.Notifications;
using backend.Models;
using backend.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementation
{
    public class NotificationService : INotificationService
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public NotificationService(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<NotificationDto> CreateNotificationAsync(int userId, string message, int? relatedEntityId = null)
        {
            var notification = new Notification
            {
                UserId = userId,
                Message = message,
                RelatedEntityId = relatedEntityId,
                CreatedAt = DateTime.Now,
                IsRead = false
            };

            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            return _mapper.Map<NotificationDto>(notification);
        }

        public async Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(int userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return _mapper.Map<IEnumerable<NotificationDto>>(notifications);
        }

        public async Task<bool> MarkAsReadAsync(int notificationId)
        {
            var notification = await _context.Notifications.FindAsync(notificationId);
            if (notification == null) return false;

            notification.IsRead = true;
            await _context.SaveChangesAsync();
            return true;
        }
    }
} 