using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace backend.Services.Interface
{
    public interface ICloudinaryServices
    {
        Task<string> UploadImageAsync(IFormFile file);
    }
}
