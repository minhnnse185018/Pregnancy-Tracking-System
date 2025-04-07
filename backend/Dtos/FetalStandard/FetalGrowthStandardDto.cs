using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.FetalStandard
{
    /// <summary>
    /// Data transfer object representing fetal growth standards by week
    /// </summary>
    public class FetalGrowthStandardDto
    {
  
        public int Id { get; set; }

         [Range(0, 42)]
        public int WeekNumber { get; set; }
        public decimal WeightGrams { get; set; }
        public decimal HeightCm { get; set; }
        public decimal BiparietalDiameterCm { get; set; }
        public decimal FemoralLengthCm { get; set; }
        public decimal HeadCircumferenceCm { get; set; }
        public decimal AbdominalCircumferenceCm { get; set; }
    }
}