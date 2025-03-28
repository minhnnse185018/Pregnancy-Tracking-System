namespace backend.Dtos.GrowthAlerts
{
    public class GrowthAlertDto
    {
        public int Id { get; set; }
        public int MeasurementId { get; set; }
        public string? AlertMessage { get; set; }
        public DateTime CreatedAt { get; set; }
        public int Week { get; set; } // Week information from the FetalMeasurement
        
        // Add profile information
        public int ProfileId { get; set; }
        public string ProfileName { get; set; } // Name of the pregnancy profile
    }
}
