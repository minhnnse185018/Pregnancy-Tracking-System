<<<<<<< HEAD
using Newtonsoft.Json;
using backend.Helpers;

=======
>>>>>>> origin/truong-son
namespace backend.Dtos.FetalGrowth
{
    public class CreateFetalMeasurementDto
    {
        public int ProfileId { get; set; }
        public decimal WeightGrams { get; set; }
        public decimal HeightCm { get; set; }
<<<<<<< HEAD
        
        [JsonConverter(typeof(DateOnlyConverter))]
        public DateOnly MeasurementDate { get; set; }
        
=======
        public DateOnly MeasurementDate { get; set; }
>>>>>>> origin/truong-son
        public string? Notes { get; set; }
    }
} 