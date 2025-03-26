using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class FetalGrowthStandard
    {
        public int Id { get; set; }
        
        [Range(0, 42)]
        public int WeekNumber { get; set; }
        public decimal WeightGrams { get; set; }
        public decimal HeightCm { get; set; }
    }
}