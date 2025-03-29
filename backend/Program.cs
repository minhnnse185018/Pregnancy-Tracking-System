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
        options.SerializerSettings.DateFormatString = "yyyy-MM-dd'T'HH:mm:ss";
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Improve AutoMapper registration
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingProfile>();
}, typeof(Program).Assembly);

// Configure Database
builder.Services.AddDbContext<ApplicationDBContext>(options =>
{
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
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

// Add logging
builder.Services.AddLogging(logging => logging.AddConsole());

// Register repositories and services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<IPostRepository, PostRepository>();
builder.Services.AddScoped<IPregnancyProfileRepository, PregnancyProfileRepository>();
builder.Services.AddScoped<IFetalGrowthStandardRepository, FetalGrowthStandardRepository>();
builder.Services.AddScoped<IMembershipRepository, MembershipRepository>();
builder.Services.AddScoped<IMembershipService, MembershipService>();
builder.Services.AddScoped<IMembershipPlanRepository, MembershipPlanRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>(); // Th�m d�ng n�y ?? kh?c ph?c l?i
builder.Services.AddScoped<IFetalMeasurementRepository, FetalMeasurementRepository>();
builder.Services.AddScoped<IVnPayService, VnPayService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<AppointmentReminderService>();
builder.Services.AddHostedService<ScheduledEmailService>();
builder.Services.AddScoped<IFAQRepository, FAQRepository>();
builder.Services.AddScoped<IReminderRepository, ReminderRepository>();
builder.Services.AddScoped<IReminderServices, ReminderServices>();
builder.Services.AddScoped<RemiderServicesJob>();
builder.Services.AddHostedService<MembershipCleanupService>();


// Register GrowthAlert services
builder.Services.AddScoped<IGrowthAlertRepository, GrowthAlertRepository>();
builder.Services.AddScoped<IGrowthAlertService, GrowthAlertService>();

// Add Revenue tracking services
builder.Services.AddScoped<IRevenueRepository, RevenueRepository>();
builder.Services.AddScoped<IRevenueService, RevenueService>();

builder.Services.AddScoped<ICloudinaryServices, CloudinaryServices>();
builder.Services.AddScoped<INotificationService, NotificationService>();

// Configure Quartz for scheduled jobs
builder.Services.AddQuartz(q =>
{
    var jobKey = new JobKey("ReminderServicesJob");
    q.AddJob<RemiderServicesJob>(opts => opts.WithIdentity(jobKey));
    q.AddTrigger(opts => opts
        .ForJob(jobKey)
        .WithIdentity("ReminderServicesJob-trigger")
        .WithCronSchedule(CronScheduleBuilder.DailyAtHourAndMinute(6, 0))); // Fire at 6:00 AM every day
});
builder.Services.AddQuartzHostedService(options =>
{
    options.WaitForJobsToComplete = true;
});

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

app.UseRouting();
app.UseAuthorization();

app.MapControllers();

app.Run();