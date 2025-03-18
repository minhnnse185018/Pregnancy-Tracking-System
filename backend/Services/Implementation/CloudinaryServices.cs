using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using backend.Services.Interface;

namespace backend.Services.Implementation
{
    public class CloudinaryServices : ICloudinaryServices
    {
        private readonly Cloudinary _cloudinary;
        public CloudinaryServices(IConfiguration config)
        {
            var account = new Account(
                config["Cloudinary:CloudName"],
                config["Cloudinary:ApiKey"],
                config["Cloudinary:ApiSecret"]
            );
            _cloudinary = new Cloudinary(account);
        }
        public async Task<string> UploadImageAsync(IFormFile file)
        {
            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(file.FileName, stream),
                PublicId = $"uploads/{Guid.NewGuid()}",
                Overwrite = true,
                Folder = "preg_track_system_imgs"
            };
            var result = await _cloudinary.UploadAsync(uploadParams);
            return result.SecureUri.AbsoluteUri;
        }
    }
}
