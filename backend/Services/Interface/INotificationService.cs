using backend.Dtos.Notifications;

namespace backend.Services.Interface
{
    public interface INotificationService
    {
        Task<NotificationDto> CreateNotificationAsync(int userId, string message, int? relatedEntityId = null);
        Task<IEnumerable<NotificationDto>> GetUserNotificationsAsync(int userId);
        Task<bool> MarkAsReadAsync(int notificationId);
    }
} 