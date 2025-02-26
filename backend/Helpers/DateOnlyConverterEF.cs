using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace backend.Helpers
{
    public class DateOnlyConverterEF : ValueConverter<DateOnly, DateTime>
    {
        public DateOnlyConverterEF() : base(
            dateOnly => dateOnly.ToDateTime(TimeOnly.MinValue).Date,
            dateTime => DateOnly.FromDateTime(dateTime))
        { }
    }
} 