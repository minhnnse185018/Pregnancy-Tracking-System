using backend.Services.Interface;

namespace backend.Services.Implementation
{
    public class MembershipCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<MembershipCleanupService> _logger;
        private readonly TimeSpan _interval = TimeSpan.FromHours(24); // Kiểm tra mỗi 24 giờ

        public MembershipCleanupService(IServiceProvider serviceProvider, ILogger<MembershipCleanupService> logger)
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

                await Task.Delay(_interval, stoppingToken);
            }
            _logger.LogInformation("Membership Cleanup Service is stopping.");
        }

        private async Task CleanupExpiredMembershipsAsync()
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var membershipService = scope.ServiceProvider.GetRequiredService<IMembershipService>();
                await membershipService.CleanupExpiredMembershipsAsync();
                _logger.LogInformation("Checked and updated expired memberships.");
            }
        }
    }
}
