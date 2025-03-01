// Program.cs
using Microsoft.EntityFrameworkCore;
using backend.Data;
using Microsoft.AspNetCore.Mvc;
using backend.Repository.Interface;
using backend.Repository.Implementation;
using backend.Services;
<<<<<<< HEAD
using backend.Helpers;
=======
>>>>>>> origin/truong-son

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers()
<<<<<<< HEAD
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.Converters.Add(new DateOnlyConverter());
        options.SerializerSettings.DateFormatString = "yyyy-MM-dd";
    });
=======
    .AddNewtonsoftJson();
>>>>>>> origin/truong-son

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add AutoMapper
builder.Services.AddAutoMapper(typeof(Program).Assembly);

// Configure Database
builder.Services.AddDbContext<ApplicationDBContext>(options => {
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
    options.UseSqlServer(connectionString);
});

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder =>
        {
            builder
                .WithOrigins("http://localhost:3000")
                .AllowAnyMethod()
<<<<<<< HEAD
                .AllowAnyHeader()
                .AllowCredentials();
=======
                .AllowAnyHeader();
>>>>>>> origin/truong-son
        });
});

// Add JWT service for login only
builder.Services.AddScoped<JwtService>();

// Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<IPostRepository, PostRepository>();
builder.Services.AddScoped<IPregnancyProfileRepository, PregnancyProfileRepository>();
builder.Services.AddScoped<IFetalGrowthStandardRepository, FetalGrowthStandardRepository>();
builder.Services.AddScoped<IMembershipRepository, MembershipRepository>();
builder.Services.AddScoped<IMembershipPlanRepository, MembershipPlanRepository>();
<<<<<<< HEAD
builder.Services.AddScoped<IFetalMeasurementRepository, FetalMeasurementRepository>();
=======
>>>>>>> origin/truong-son

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowReactApp");

app.MapControllers();

app.Run();