using backend.Data;
using backend.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Implementation
{
    public class DeleteMembershipService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<DeleteMembershipService> _logger;
        private readonly TimeSpan _interval = TimeSpan.FromHours(24); // Kiểm tra mỗi 24 giờ

        public DeleteMembershipService(IServiceProvider serviceProvider, ILogger<DeleteMembershipService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Membership Cleanup Service is starting.");
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CleanupExpiredMembershipsAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while cleaning up expired memberships.");
                }

                // Chờ đến lần kiểm tra tiếp theo
                await Task.Delay(_interval, stoppingToken);
            }
            _logger.LogInformation("Membership Cleanup Service is stopping.");
        }

        private async Task CleanupExpiredMembershipsAsync()
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();
                var membershipRepository = scope.ServiceProvider.GetRequiredService<IMembershipRepository>();

                // Lấy các membership đã hết hạn
                var expiredMemberships = await context.Memberships
                    .Where(m => m.Status == "Active" && m.EndDate <= DateTime.UtcNow)
                    .ToListAsync();

                if (expiredMemberships.Any())
                {
                    foreach (var membership in expiredMemberships)
                    {
                        var result = await membershipRepository.DeleteMembershipAsync(membership.Id);
                        if (result > 0)
                        {
                            _logger.LogInformation("Deleted expired membership with Id {Id}.", membership.Id);
                        }
                        else
                        {
                            _logger.LogWarning("Failed to delete membership with Id {Id}.", membership.Id);
                        }
                    }
                }
                else
                {
                    _logger.LogInformation("No expired memberships found.");
                }
            }
        }
    }
}
