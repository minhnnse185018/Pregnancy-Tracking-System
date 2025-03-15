namespace backend.Dtos.GrowthAlerts
{
    public class GrowthAlertWithWeekDto
    {
        public int Id { get; set; }
        public int MeasurementId { get; set; }
        public string? AlertMessage { get; set; }
        public DateTime CreatedAt { get; set; }
        public int Week { get; set; } // Week information from the FetalMeasurement
    }
}
