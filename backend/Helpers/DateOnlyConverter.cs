using System.Text.Json;
using System.Text.Json.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using JsonSerializer = Newtonsoft.Json.JsonSerializer;

namespace backend.Helpers
{
    public class DateOnlyConverter : Newtonsoft.Json.JsonConverter<DateOnly?>
    {
        private const string DateFormat = "yyyy-MM-dd";

        public override DateOnly? ReadJson(JsonReader reader, Type objectType, DateOnly? existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.Null)
                return null;

            // Handle string format
            if (reader.TokenType == JsonToken.String)
            {
                string? dateStr = reader.Value?.ToString();
                return string.IsNullOrEmpty(dateStr) ? null : DateOnly.ParseExact(dateStr, DateFormat);
            }

            // Handle object format with year, month, day properties
            if (reader.TokenType == JsonToken.StartObject)
            {
                JObject dateObj = JObject.Load(reader);
                if (dateObj.TryGetValue("year", out JToken? yearToken) &&
                    dateObj.TryGetValue("month", out JToken? monthToken) &&
                    dateObj.TryGetValue("day", out JToken? dayToken))
                {
                    int year = yearToken.Value<int>();
                    int month = monthToken.Value<int>();
                    int day = dayToken.Value<int>();
                    return new DateOnly(year, month, day);
                }
            }

            return null;
        }

        public override void WriteJson(JsonWriter writer, DateOnly? value, JsonSerializer serializer)
        {
            if (value.HasValue)
                writer.WriteValue(value.Value.ToString(DateFormat));
            else
                writer.WriteNull();
        }
    }
} 