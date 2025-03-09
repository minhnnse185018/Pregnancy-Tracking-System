using Microsoft.EntityFrameworkCore;
using backend.Data;
using Microsoft.AspNetCore.Mvc;
using backend.Repository.Interface;
using backend.Repository.Implementation;
using backend.Services;
using backend.Services.Implementation;
using backend.Services.Interface;
using backend.Mapper;
using backend.Helper;
using Quartz;
using Hangfire;
using Hangfire.SqlServer;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.DateFormatString = "yyyy-MM-dd";
    });

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
                .AllowAnyHeader()
                .AllowCredentials();
        });
});

// Add JWT service for login only
builder.Services.AddScoped<JwtService>();

// Email
builder.Services.Configure<EmailSetting>(builder.Configuration.GetSection("EmailSetting"));

// Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<IPostRepository, PostRepository>();
builder.Services.AddScoped<IPregnancyProfileRepository, PregnancyProfileRepository>();
builder.Services.AddScoped<IFetalGrowthStandardRepository, FetalGrowthStandardRepository>();
builder.Services.AddScoped<IMembershipRepository, MembershipRepository>();
builder.Services.AddScoped<IMembershipPlanRepository, MembershipPlanRepository>();
builder.Services.AddScoped<IFetalMeasurementRepository, FetalMeasurementRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAppointmentReminderService, AppointmentReminderService>();

// C?u hình Hangfire
builder.Services.AddHangfire(config => config
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection"))
);
builder.Services.AddHangfireServer();

// Add Quartz job
QuartzConfig.AddQuartzJobs(builder.Services);

var app = builder.Build();

// Middleware Hangfire Dashboard
app.UseHangfireDashboard("/hangfire");

// Thêm vào pipeline
app.UseAuthentication();
app.UseAuthorization();

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

// ??ng ký job g?i email nh?c l?ch m?i 10 phút
RecurringJob.AddOrUpdate<IAppointmentReminderService>(
    "send-appointment-reminders",
    service => service.SendAppointmentReminders(),
    "*/1 * * * *"
);

// Quartz Configuration
public static class QuartzConfig
{
    public static void AddQuartzJobs(this IServiceCollection services)
    {
        services.AddQuartz(q =>
        {
            var jobKey = new JobKey("AppointmentReminderJob");
            q.AddJob<AppointmentReminderJob>(opts => opts.WithIdentity(jobKey));
            q.AddTrigger(t => t
                .ForJob(jobKey)
                .WithIdentity("AppointmentReminderTrigger")
                .WithSimpleSchedule(s => s
                    .WithIntervalInMinutes(1) // Ki?m tra m?i phút ?? test nhanh
                    .RepeatForever()));
        });
        services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);
    }
}
