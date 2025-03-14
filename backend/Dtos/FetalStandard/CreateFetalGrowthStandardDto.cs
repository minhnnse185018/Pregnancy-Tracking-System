using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.FetalStandard
{
    public class CreateFetalGrowthStandardDto
    {
        [Range(0, 42)]
        public int WeekNumber { get; set; }
        public decimal WeightGrams { get; set; }
        public decimal HeightCm { get; set; }
    }
}