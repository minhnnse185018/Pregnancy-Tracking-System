using backend.Dtos.Revenue;
using backend.Repository.Interface;
using backend.Services.Interface;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services.Implementation
{
    public class RevenueService : IRevenueService
    {
        private readonly IRevenueRepository _revenueRepository;

        public RevenueService(IRevenueRepository revenueRepository)
        {
            _revenueRepository = revenueRepository;
        }

        public async Task<RevenueSummaryDto> GetRevenueSummaryAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            var effectiveStartDate = startDate ?? DateTime.MinValue;
            var effectiveEndDate = endDate ?? DateTime.UtcNow;
            
            var totalRevenue = await _revenueRepository.GetTotalRevenueAsync(effectiveStartDate, effectiveEndDate);
            var totalTransactions = await _revenueRepository.GetTotalTransactionsAsync(effectiveStartDate, effectiveEndDate);
            
            return new RevenueSummaryDto
            {
                TotalRevenue = totalRevenue,
                TotalTransactions = totalTransactions,
                FromDate = effectiveStartDate,
                ToDate = effectiveEndDate
            };
        }

        public async Task<IEnumerable<DailyRevenueDto>> GetDailyRevenueAsync(DateTime startDate, DateTime endDate)
        {
            return await _revenueRepository.GetDailyRevenueAsync(startDate, endDate);
        }

        public async Task<IEnumerable<MonthlyRevenueDto>> GetMonthlyRevenueAsync(int year)
        {
            return await _revenueRepository.GetMonthlyRevenueAsync(year);
        }

        public async Task<IEnumerable<PlanRevenueDto>> GetRevenueByPlanAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            return await _revenueRepository.GetRevenueByPlanAsync(startDate, endDate);
        }
    }
}
