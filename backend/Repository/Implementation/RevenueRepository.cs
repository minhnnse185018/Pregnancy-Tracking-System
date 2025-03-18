using backend.Data;
using backend.Dtos.Revenue;
using backend.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Repository.Implementation
{
    public class RevenueRepository : IRevenueRepository
    {
        private readonly ApplicationDBContext _context;

        public RevenueRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<decimal> GetTotalRevenueAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.Payments.Where(p => p.PaymentStatus == "Success");
            
            if (startDate.HasValue)
                query = query.Where(p => p.PaymentDate >= startDate.Value);
            
            if (endDate.HasValue)
                query = query.Where(p => p.PaymentDate <= endDate.Value);
            
            return await query.SumAsync(p => p.Amount);
        }

        public async Task<IEnumerable<DailyRevenueDto>> GetDailyRevenueAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.Payments
                .Where(p => p.PaymentStatus == "Success" && p.PaymentDate >= startDate && p.PaymentDate <= endDate)
                .GroupBy(p => p.PaymentDate.Date)
                .Select(g => new DailyRevenueDto
                {
                    Date = g.Key,
                    Amount = g.Sum(p => p.Amount),
                    TransactionCount = g.Count()
                })
                .OrderBy(d => d.Date)
                .ToListAsync();
        }

        public async Task<IEnumerable<MonthlyRevenueDto>> GetMonthlyRevenueAsync(int year)
        {
            return await _context.Payments
                .Where(p => p.PaymentStatus == "Success" && p.PaymentDate.Year == year)
                .GroupBy(p => new { p.PaymentDate.Year, p.PaymentDate.Month })
                .Select(g => new MonthlyRevenueDto
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Amount = g.Sum(p => p.Amount),
                    TransactionCount = g.Count()
                })
                .OrderBy(m => m.Month)
                .ToListAsync();
        }

        public async Task<IEnumerable<PlanRevenueDto>> GetRevenueByPlanAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.Payments
                .Where(p => p.PaymentStatus == "Success")
                .Join(_context.Memberships, 
                    p => p.MembershipId, 
                    m => m.Id, 
                    (p, m) => new { Payment = p, Membership = m })
                .Join(_context.MembershipPlans,
                    pm => pm.Membership.PlanId,
                    plan => plan.Id,
                    (pm, plan) => new { pm.Payment, pm.Membership, Plan = plan });
            
            if (startDate.HasValue)
                query = query.Where(x => x.Payment.PaymentDate >= startDate.Value);
            
            if (endDate.HasValue)
                query = query.Where(x => x.Payment.PaymentDate <= endDate.Value);
            
            return await query
                .GroupBy(x => new { x.Plan.Id, x.Plan.PlanName })
                .Select(g => new PlanRevenueDto
                {
                    PlanId = g.Key.Id,
                    PlanName = g.Key.PlanName,
                    Amount = g.Sum(x => x.Payment.Amount),
                    SubscriptionCount = g.Count()
                })
                .OrderByDescending(p => p.Amount)
                .ToListAsync();
        }

        public async Task<int> GetTotalTransactionsAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.Payments.Where(p => p.PaymentStatus == "Success");
            
            if (startDate.HasValue)
                query = query.Where(p => p.PaymentDate >= startDate.Value);
            
            if (endDate.HasValue)
                query = query.Where(p => p.PaymentDate <= endDate.Value);
            
            return await query.CountAsync();
        }
    }
}
