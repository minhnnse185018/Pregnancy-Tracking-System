using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<PregnancyProfile> PregnancyProfiles { get; set; }
        public DbSet<FetalMeasurement> FetalMeasurements { get; set; }
        public DbSet<FetalGrowthStandard> FetalGrowthStandards { get; set; }
        public DbSet<GrowthAlert> GrowthAlerts { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<FAQ> FAQs { get; set; }
        public DbSet<MembershipPlan> MembershipPlans { get; set; }
        public DbSet<Membership> Memberships { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<ScheduledEmail> ScheduledEmails { get; set; }
        public DbSet<Reminder> Reminders { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // PregnancyProfile configuration
            modelBuilder.Entity<PregnancyProfile>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(p => p.User)
                    .WithMany(u => u.PregnancyProfiles)
                    .HasForeignKey(p => p.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Add computed column for PregnancyStatus without persisting
                entity.Property(e => e.PregnancyStatus)
                    .HasColumnType("nvarchar(20)")
                    .HasComputedColumnSql("CAST(CASE WHEN GETDATE() < DueDate THEN 'On Going' ELSE 'Completed' END AS nvarchar(20))", stored: false);
            });

            // FetalMeasurement configuration
            modelBuilder.Entity<FetalMeasurement>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.WeightGrams).HasColumnType("decimal(10,2)");
                entity.Property(e => e.HeightCm).HasColumnType("decimal(10,2)");
                
                // Add column type for new properties
                entity.Property(e => e.BiparietalDiameterCm).HasColumnType("decimal(10,2)");
                entity.Property(e => e.FemoralLengthCm).HasColumnType("decimal(10,2)");
                entity.Property(e => e.HeadCircumferenceCm).HasColumnType("decimal(10,2)");
                entity.Property(e => e.AbdominalCircumferenceCm).HasColumnType("decimal(10,2)");

                entity.HasOne(f => f.Profile)
                    .WithMany(p => p.FetalMeasurements)
                    .HasForeignKey(f => f.ProfileId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Post configuration
            modelBuilder.Entity<Post>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(p => p.User)
                    .WithMany(u => u.Posts)
                    .HasForeignKey(p => p.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Comment configuration
            modelBuilder.Entity<Comment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(c => c.User)
                    .WithMany(u => u.Comments)
                    .HasForeignKey(c => c.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
                
                entity.HasOne(c => c.Post)
                    .WithMany(p => p.Comments)
                    .HasForeignKey(c => c.PostId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Message>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(m => m.Member)
                    .WithMany(u => u.SentMessages)
                    .HasForeignKey(m => m.MemberId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(m => m.Doctor)
                    .WithMany(u => u.ReceivedMessages)
                    .HasForeignKey(m => m.DoctorId)
                    .OnDelete(DeleteBehavior.Restrict);
            });



            

            // FetalGrowthStandard configuration
            modelBuilder.Entity<FetalGrowthStandard>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.WeekNumber).IsRequired();
                
                // Add decimal precision for the simplified model
                entity.Property(e => e.WeightGrams)
                    .HasColumnType("decimal(10,2)");
                entity.Property(e => e.HeightCm)
                    .HasColumnType("decimal(10,2)");
                entity.Property(e => e.BiparietalDiameterCm)
                    .HasColumnType("decimal(10,2)");
                entity.Property(e => e.FemoralLengthCm)
                    .HasColumnType("decimal(10,2)");
                entity.Property(e => e.HeadCircumferenceCm)
                    .HasColumnType("decimal(10,2)");
                entity.Property(e => e.AbdominalCircumferenceCm)
                    .HasColumnType("decimal(10,2)");
                    
            });

            // GrowthAlert configuration
            modelBuilder.Entity<GrowthAlert>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(g => g.FetalMeasurement)
                    .WithMany(f => f.GrowthAlerts)
                    .HasForeignKey(g => g.MeasurementId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Appointment configuration
            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(a => a.User)
                    .WithMany(u => u.Appointments)
                    .HasForeignKey(a => a.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // FAQ configuration
            modelBuilder.Entity<FAQ>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Category).HasMaxLength(50);
            });

            // MembershipPlan configuration
            modelBuilder.Entity<MembershipPlan>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.PlanName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            });

            // Membership configuration
            modelBuilder.Entity<Membership>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(m => m.User)
                    .WithMany(u => u.Memberships)
                    .HasForeignKey(m => m.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(m => m.Plan)
                    .WithMany(p => p.Memberships)
                    .HasForeignKey(m => m.PlanId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Payment configuration
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(p => p.Membership)
                    .WithOne(m => m.Payment)
                    .HasForeignKey<Payment>(p => p.MembershipId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.Property(e => e.Amount).HasColumnType("decimal(10,2)");
                entity.Property(e => e.PaymentMethod).IsRequired().HasMaxLength(50);
            });
            modelBuilder.Entity<Reminder>(entity =>
            {
                entity.HasKey(e => e.Id);
            });
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Message)
                    .IsRequired()
                    .HasMaxLength(500);
                    
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.IsRead)
                    .HasDefaultValue(false);
                    
                entity.HasOne(n => n.User)
                    .WithMany(u => u.Notifications) // Add a collection property to User if you want bidirectional navigation
                    .HasForeignKey(n => n.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
            // Seed Data
            // 1. Users
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Email = "hongngaxg1602@gmail.com", Password = "111111", UserType = "1", FirstName = "Hong", LastName = "Nga", Phone = "0817206673", Status = "active",Gender = "Female", CreatedAt = DateTime.Now },
                new User { Id = 2, Email = "de180704ungmaithihongnga@gmail.com", Password = "111111", UserType = "3", FirstName = "Minh", LastName = "Hang", Phone = "0355391605", Status = "active", Gender = "Female", CreatedAt = DateTime.Now },
                new User { Id = 3, Email = "maikha3035@gmail.com", Password = "111111", UserType = "1", FirstName = "Mai", LastName = "Kha", Phone = "0788696006", Status = "active", Gender = "Female", CreatedAt = DateTime.Now },
                new User { Id = 4, Email = "mkha39784@gmail.com", Password = "111111", UserType = "1", FirstName = "Trong", LastName = "Khoi", Phone = "0817206673", Status = "active", Gender = "Female", CreatedAt = DateTime.Now },
                new User { Id = 5, Email = "maikha3003@gmail.com", Password = "111111", UserType = "1", FirstName = "Duc", LastName = "Huy", Phone = "0355391605", Status = "active", Gender = "Female", CreatedAt = DateTime.Now },
                new User { Id = 6, Email = "khaho1930@gmail.com", Password = "111111", UserType = "1", FirstName = "Khanh", LastName = "Ly", Phone = "0788696006", Status = "active", Gender = "Female", CreatedAt = DateTime.Now },
                new User { Id = 7, Email = "khaho.300305@gmail.com", Password = "111111", UserType = "1", FirstName = "Minh", LastName = "Quoc", Phone = "0817206673", Status = "active", Gender = "Male", CreatedAt = DateTime.Now },
                new User { Id = 8, Email = "nbkqua.k19.si.08@gmail.com", Password = "111111", UserType = "1", FirstName = "Ty", LastName = "Na", Phone = "0355391605", Status = "active", Gender = "Female", CreatedAt = DateTime.Now },
                new User { Id = 9, Email = "mkdepgai@gmail.com", Password = "111111", UserType = "1", FirstName = "Duy", LastName = "Khang", Phone = "0788696006", Status = "active", Gender = "Female", CreatedAt = DateTime.Now },
                new User { Id = 10, Email = "ngaxd0301@gmail.com", Password = "111111", UserType = "1", FirstName = "Thanh", LastName = "Trung", Phone = "0817206673", Status = "active", Gender = "Female", CreatedAt = DateTime.Now },
                new User { Id = 11, Email = "tranthingoctram142@gmail.com", Password = "111111", UserType = "1", FirstName = "Chi", LastName = "Vy", Phone = "0355391605", Status = "active", Gender = "Male", CreatedAt = DateTime.Now },
                new User { Id = 12, Email = "nguyenphamminhanh@gmail.com", Password = "111111", UserType = "1", FirstName = "Duc", LastName = "Nhat", Phone = "0788696006", Status = "active", Gender = "Male", CreatedAt = DateTime.Now },
                new User { Id = 13, Email = "giabaongo1@gmail.com", Password = "111111", UserType = "1", FirstName = "Ngo", LastName = "Gia Bao", Phone = "0915900915", Status = "active", Gender = "Male", CreatedAt = DateTime.Now },
                new User { Id = 14, Email = "ngaumthde1807042fpt.edu.vn", Password = "111111", UserType = "4", FirstName = "Fregnancy", LastName = "System", Phone = "0915900915", Status = "active", Gender = "Male", CreatedAt = DateTime.Now }

            );

            // 2. Pregnancy Profiles
            modelBuilder.Entity<PregnancyProfile>().HasData(
                new PregnancyProfile
                {
                    Id = 1,
                    UserId = 1,
                    Name = "Default Pregnancy", // Add this missing required field
                    ConceptionDate = DateTime.Parse("2024-12-18"),
                    DueDate = DateTime.Parse("2025-09-14"),
                    CreatedAt = DateTime.Parse("2025-03-18"),
                    PregnancyStatus = "Active"
                }
            );

            // 3. Fetal Measurements
            modelBuilder.Entity<FetalMeasurement>().HasData(
                new FetalMeasurement
                {
                    Id = 1,
                    ProfileId = 1,
                    WeightGrams = 500.00M,
                    HeightCm = 25.5M,
                    Week = 12,
                    CreatedAt = DateTime.Now
                },
                new FetalMeasurement
                {
                    Id = 2,
                    ProfileId = 1,
                    WeightGrams = 650.00M,
                    HeightCm = 28.5M,
                    Week = 16,
                    CreatedAt = DateTime.Now
                }
            );

            // 4. FAQs
            

            // 5. Posts
            modelBuilder.Entity<Post>().HasData(
                new Post
                {
                    Id = 1,
                    UserId = 1,
                    Title = "My First Pregnancy Experience",
                    Content = "I'm excited to share my journey through the first trimester...",
                    CreatedAt = DateTime.Now,
                    Status = "published"
                }
            );

            // 6. Comments
            modelBuilder.Entity<Comment>().HasData(
                new Comment
                {
                    Id = 1,
                    UserId = 2,
                    PostId = 1,
                    Content = "Thank you for sharing your experience! It's very helpful.",
                    CreatedAt = DateTime.Now
                },
                new Comment
                {
                    Id = 2,
                    UserId = 1,
                    PostId = 1,
                    Content = "I'm glad you found it helpful! Feel free to ask any questions.",
                    CreatedAt = DateTime.Now.AddHours(1)
                }
            );

            // Seed data cho MembershipPlan
            modelBuilder.Entity<MembershipPlan>().HasData(
                 new MembershipPlan
                 {
                     Id = 1,
                     PlanName = "3 Months",
                     Description = "Full access to system features for 3 months",
                     Price = 399000m, // 399,000 VND
                     Duration = 3 // 3 tháng
                 },
                 new MembershipPlan
                 {
                     Id = 2,
                     PlanName = "6 Months",
                     Description = "Full access to system features for 6 months",
                     Price = 599000m, // 599,000 VND
                     Duration = 6 // 6 tháng
                 },
                 new MembershipPlan
                 {
                     Id = 3,
                     PlanName = "12 Months",
                     Description = "Full access to system features for 12 months",
                     Price = 799000m, // 799,000 VND
                     Duration = 12 // 12 tháng
                 }
             );

            // Seed Fetal Growth Standards Data
            modelBuilder.Entity<FetalGrowthStandard>().HasData(
                // Tuần 1-7 không có dữ liệu BPD, FL, HC, AC trong bảng
                new FetalGrowthStandard { Id = 1, WeekNumber = 8, HeightCm = 1.6m, WeightGrams = 1m, BiparietalDiameterCm = 0m, FemoralLengthCm = 0m, HeadCircumferenceCm = 0m, AbdominalCircumferenceCm = 0m },
                new FetalGrowthStandard { Id = 2, WeekNumber = 9, HeightCm = 2.3m, WeightGrams = 2m, BiparietalDiameterCm = 0m, FemoralLengthCm = 0m, HeadCircumferenceCm = 0m, AbdominalCircumferenceCm = 0m },
                new FetalGrowthStandard { Id = 3, WeekNumber = 10, HeightCm = 3.1m, WeightGrams = 4m, BiparietalDiameterCm = 0m, FemoralLengthCm = 0m, HeadCircumferenceCm = 0m, AbdominalCircumferenceCm = 0m },
                new FetalGrowthStandard { Id = 4, WeekNumber = 11, HeightCm = 4.1m, WeightGrams = 7m, BiparietalDiameterCm = 0m, FemoralLengthCm = 0m, HeadCircumferenceCm = 0m, AbdominalCircumferenceCm = 0m },
                // Từ tuần 12 có dữ liệu đầy đủ
                new FetalGrowthStandard { Id = 5, WeekNumber = 12, HeightCm = 5.4m, WeightGrams = 14m, BiparietalDiameterCm = 2.1m, FemoralLengthCm = 0.8m, HeadCircumferenceCm = 7.0m, AbdominalCircumferenceCm = 5.6m },
                new FetalGrowthStandard { Id = 6, WeekNumber = 13, HeightCm = 7.4m, WeightGrams = 23m, BiparietalDiameterCm = 2.5m, FemoralLengthCm = 1.1m, HeadCircumferenceCm = 8.4m, AbdominalCircumferenceCm = 6.9m },
                new FetalGrowthStandard { Id = 7, WeekNumber = 14, HeightCm = 8.7m, WeightGrams = 43m, BiparietalDiameterCm = 2.8m, FemoralLengthCm = 1.5m, HeadCircumferenceCm = 9.8m, AbdominalCircumferenceCm = 8.1m },
                new FetalGrowthStandard { Id = 8, WeekNumber = 15, HeightCm = 10.1m, WeightGrams = 70m, BiparietalDiameterCm = 3.2m, FemoralLengthCm = 1.8m, HeadCircumferenceCm = 11.1m, AbdominalCircumferenceCm = 9.3m },
                new FetalGrowthStandard { Id = 9, WeekNumber = 16, HeightCm = 11.6m, WeightGrams = 100m, BiparietalDiameterCm = 3.5m, FemoralLengthCm = 2.1m, HeadCircumferenceCm = 12.4m, AbdominalCircumferenceCm = 10.5m },
                new FetalGrowthStandard { Id = 10, WeekNumber = 17, HeightCm = 13.0m, WeightGrams = 140m, BiparietalDiameterCm = 3.9m, FemoralLengthCm = 2.4m, HeadCircumferenceCm = 13.7m, AbdominalCircumferenceCm = 11.7m },
                new FetalGrowthStandard { Id = 11, WeekNumber = 18, HeightCm = 14.2m, WeightGrams = 190m, BiparietalDiameterCm = 4.2m, FemoralLengthCm = 2.7m, HeadCircumferenceCm = 15.0m, AbdominalCircumferenceCm = 12.9m },
                new FetalGrowthStandard { Id = 12, WeekNumber = 19, HeightCm = 15.3m, WeightGrams = 240m, BiparietalDiameterCm = 4.6m, FemoralLengthCm = 3.0m, HeadCircumferenceCm = 16.2m, AbdominalCircumferenceCm = 14.1m },
                new FetalGrowthStandard { Id = 13, WeekNumber = 20, HeightCm = 16.4m, WeightGrams = 300m, BiparietalDiameterCm = 4.9m, FemoralLengthCm = 3.3m, HeadCircumferenceCm = 17.5m, AbdominalCircumferenceCm = 15.2m },
                new FetalGrowthStandard { Id = 14, WeekNumber = 21, HeightCm = 25.6m, WeightGrams = 360m, BiparietalDiameterCm = 5.2m, FemoralLengthCm = 3.6m, HeadCircumferenceCm = 18.7m, AbdominalCircumferenceCm = 16.4m },
                new FetalGrowthStandard { Id = 15, WeekNumber = 22, HeightCm = 27.8m, WeightGrams = 430m, BiparietalDiameterCm = 5.5m, FemoralLengthCm = 3.9m, HeadCircumferenceCm = 19.8m, AbdominalCircumferenceCm = 17.5m },
                new FetalGrowthStandard { Id = 16, WeekNumber = 23, HeightCm = 28.9m, WeightGrams = 501m, BiparietalDiameterCm = 5.8m, FemoralLengthCm = 4.2m, HeadCircumferenceCm = 21.0m, AbdominalCircumferenceCm = 18.6m },
                new FetalGrowthStandard { Id = 17, WeekNumber = 24, HeightCm = 30.0m, WeightGrams = 600m, BiparietalDiameterCm = 6.1m, FemoralLengthCm = 4.4m, HeadCircumferenceCm = 22.1m, AbdominalCircumferenceCm = 19.7m },
                new FetalGrowthStandard { Id = 18, WeekNumber = 25, HeightCm = 34.6m, WeightGrams = 660m, BiparietalDiameterCm = 6.4m, FemoralLengthCm = 4.7m, HeadCircumferenceCm = 23.2m, AbdominalCircumferenceCm = 20.8m },
                new FetalGrowthStandard { Id = 19, WeekNumber = 26, HeightCm = 35.6m, WeightGrams = 760m, BiparietalDiameterCm = 6.7m, FemoralLengthCm = 4.9m, HeadCircumferenceCm = 24.2m, AbdominalCircumferenceCm = 21.9m },
                new FetalGrowthStandard { Id = 20, WeekNumber = 27, HeightCm = 36.6m, WeightGrams = 875m, BiparietalDiameterCm = 6.9m, FemoralLengthCm = 5.2m, HeadCircumferenceCm = 25.2m, AbdominalCircumferenceCm = 22.9m },
                new FetalGrowthStandard { Id = 21, WeekNumber = 28, HeightCm = 37.6m, WeightGrams = 1005m, BiparietalDiameterCm = 7.2m, FemoralLengthCm = 5.4m, HeadCircumferenceCm = 26.2m, AbdominalCircumferenceCm = 24.0m },
                new FetalGrowthStandard { Id = 22, WeekNumber = 29, HeightCm = 38.6m, WeightGrams = 1153m, BiparietalDiameterCm = 7.4m, FemoralLengthCm = 5.6m, HeadCircumferenceCm = 27.1m, AbdominalCircumferenceCm = 25.0m },
                new FetalGrowthStandard { Id = 23, WeekNumber = 30, HeightCm = 39.9m, WeightGrams = 1319m, BiparietalDiameterCm = 7.7m, FemoralLengthCm = 5.9m, HeadCircumferenceCm = 28.0m, AbdominalCircumferenceCm = 26.0m },
                new FetalGrowthStandard { Id = 24, WeekNumber = 31, HeightCm = 41.1m, WeightGrams = 1502m, BiparietalDiameterCm = 7.9m, FemoralLengthCm = 6.1m, HeadCircumferenceCm = 28.8m, AbdominalCircumferenceCm = 27.0m },
                new FetalGrowthStandard { Id = 25, WeekNumber = 32, HeightCm = 42.4m, WeightGrams = 1702m, BiparietalDiameterCm = 8.2m, FemoralLengthCm = 6.3m, HeadCircumferenceCm = 29.6m, AbdominalCircumferenceCm = 28.0m },
                new FetalGrowthStandard { Id = 26, WeekNumber = 33, HeightCm = 43.7m, WeightGrams = 1918m, BiparietalDiameterCm = 8.4m, FemoralLengthCm = 6.5m, HeadCircumferenceCm = 30.4m, AbdominalCircumferenceCm = 29.0m },
                new FetalGrowthStandard { Id = 27, WeekNumber = 34, HeightCm = 45.0m, WeightGrams = 2146m, BiparietalDiameterCm = 8.6m, FemoralLengthCm = 6.7m, HeadCircumferenceCm = 31.1m, AbdominalCircumferenceCm = 29.9m },
                new FetalGrowthStandard { Id = 28, WeekNumber = 35, HeightCm = 46.2m, WeightGrams = 2383m, BiparietalDiameterCm = 8.8m, FemoralLengthCm = 6.8m, HeadCircumferenceCm = 31.8m, AbdominalCircumferenceCm = 30.9m },
                new FetalGrowthStandard { Id = 29, WeekNumber = 36, HeightCm = 47.4m, WeightGrams = 2622m, BiparietalDiameterCm = 9.0m, FemoralLengthCm = 7.0m, HeadCircumferenceCm = 32.4m, AbdominalCircumferenceCm = 31.8m },
                new FetalGrowthStandard { Id = 30, WeekNumber = 37, HeightCm = 48.6m, WeightGrams = 2859m, BiparietalDiameterCm = 9.2m, FemoralLengthCm = 7.2m, HeadCircumferenceCm = 33.0m, AbdominalCircumferenceCm = 32.7m },
                new FetalGrowthStandard { Id = 31, WeekNumber = 38, HeightCm = 49.8m, WeightGrams = 3083m, BiparietalDiameterCm = 9.4m, FemoralLengthCm = 7.3m, HeadCircumferenceCm = 33.5m, AbdominalCircumferenceCm = 33.6m },
                new FetalGrowthStandard { Id = 32, WeekNumber = 39, HeightCm = 50.7m, WeightGrams = 3288m, BiparietalDiameterCm = 9.5m, FemoralLengthCm = 7.5m, HeadCircumferenceCm = 34.0m, AbdominalCircumferenceCm = 34.5m },
                new FetalGrowthStandard { Id = 33, WeekNumber = 40, HeightCm = 51.2m, WeightGrams = 3462m, BiparietalDiameterCm = 9.7m, FemoralLengthCm = 7.6m, HeadCircumferenceCm = 34.4m, AbdominalCircumferenceCm = 35.4m }
            );
        modelBuilder.Entity<Reminder>().HasData(
                new Reminder
                {
                    Id = 1,
                    Week = 7,
                    Subject = "Reminder: Prenatal Check-up at Week 7 or 8",
                    Body = "It's time for your prenatal check-up! At this stage, the goal is to confirm the presence of a fetal heartbeat, measure the embryo's length, and check the size of the amniotic sac. Make sure to complete the blood and urine tests to assess your health, including iron and calcium levels, and screen for gestational diabetes or thyroid disorders."
                },
                new Reminder
                {
                    Id = 2,
                    Week = 11,
                    Subject = "Reminder: Prenatal Screening at Week 11 to 13",
                    Body = "Don't miss your important prenatal screening! This check-up screens for fetal abnormalities, especially Down syndrome. If you haven't had basic blood tests done earlier, now is the time to complete them."
                },
                new Reminder
                {
                    Id = 3,
                    Week = 16,
                    Subject = "Reminder: Anomaly Scan at Week 16 to 18",
                    Body = "It's time for your anomaly scan! At this check-up, the doctor will detect any structural abnormalities in the fetus, such as cleft palate or cleft lip. Schedule your appointment to ensure all is progressing well."
                },
                new Reminder
                {
                    Id = 4,
                    Week = 20,
                    Subject = "Reminder: Detailed Ultrasound at Week 20 to 22",
                    Body = "Your detailed ultrasound is due! The doctor will check for abnormalities in the lungs, heart, and other organs. They will check your baby's weight, umbilical cord, and amniotic fluid levels. Weekly ultrasounds or check-ups are recommended from now until delivery."
                },
                new Reminder
                {
                    Id = 5,
                    Week = 24,
                    Subject = "Reminder: Glucose Test and Screening at Week 24 to 28",
                    Body = "At this point, it is crucial to undergo tests for gestational diabetes and preeclampsia, including urine tests and liver and kidney function assessments. You will also receive a tetanus vaccination at this time. Consult with your doctor for a suitable dietary plan based on your results."
                },
                new Reminder
                {
                    Id = 6,
                    Week = 32,
                    Subject = "Reminder: 4D Ultrasound at Week 32",
                    Body = "It's time for your 4D ultrasound! This scan can help detect any late-developing abnormalities in the baby. The doctor will also monitor your overall health and the baby's position, along with blood flow in the uterine and umbilical arteries. You will receive your second tetanus shot around this time."
                },
                new Reminder
                {
                    Id = 7,
                    Week = 35,
                    Subject = "Reminder: Prenatal Monitoring at Week 35 or 36",
                    Body = "Now it's time for fetal monitoring (cardiotocography) to assess uterine contractions and the fetal heart rate. The doctor will estimate the baby's weight, and check the umbilical cord and amniotic fluid levels. Weekly ultrasounds or check-ups are recommended from this point onward. Make sure to complete all required tests, including beta-strep screening."
                }
            );

            //FAQs
            modelBuilder.Entity<FAQ>().HasData(
        new FAQ { Id = 1, Category = "System Introduction", Question = "What is the pregnancy tracking system?", Answer = "It's a software that helps pregnant women track their baby's development, manage appointments, receive alerts, and share experiences.", DisplayOrder = 1, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 2, Category = "System Introduction", Question = "Who can use this system?", Answer = "Pregnant women, family members, or anyone interested in pregnancy can sign up and use it.", DisplayOrder = 2, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 3, Category = "System Introduction", Question = "How do I start using the system?", Answer = "Register as a member, choose a membership plan, and make a payment to activate features.", DisplayOrder = 3, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 4, Category = "System Introduction", Question = "Is there a mobile app for the system?", Answer = "Currently, there's a web version; a mobile app is under development and will launch soon.", DisplayOrder = 4, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 5, Category = "System Introduction", Question = "Does the system support multiple languages?", Answer = "It currently supports Vietnamese; English will be added in the future.", DisplayOrder = 5, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 6, Category = "System Introduction", Question = "Can I try it for free?", Answer = "Yes, you get a 7-day free trial with the Basic plan before purchasing.", DisplayOrder = 6, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 7, Category = "System Introduction", Question = "Is the system secure?", Answer = "Yes, we use data encryption to protect your personal information.", DisplayOrder = 7, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 8, Category = "System Introduction", Question = "Does the system connect with doctors?", Answer = "Not directly yet, but you can schedule appointments with doctors through it.", DisplayOrder = 8, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 9, Category = "System Introduction", Question = "Who developed this system?", Answer = "A team of pregnancy experts and technology professionals created this software.", DisplayOrder = 9, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 10, Category = "System Introduction", Question = "Is the system updated regularly?", Answer = "Yes, we periodically update features and information.", DisplayOrder = 10, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 11, Category = "Membership Plans", Question = "What membership plans are available?", Answer = "Basic, Advanced, and Premium plans with different pricing and features. Check details on the 'Plans' page.", DisplayOrder = 1, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 12, Category = "Membership Plans", Question = "How do I upgrade my membership plan?", Answer = "Log in, go to 'Account Management,' select a new plan, and complete the payment.", DisplayOrder = 2, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 13, Category = "Membership Plans", Question = "Can I get a refund if I'm not satisfied?", Answer = "Yes, you can get a refund within 7 days if no features have been used.", DisplayOrder = 3, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 14, Category = "Membership Plans", Question = "What features does the Basic plan include?", Answer = "Basic tracking, appointment scheduling, and key milestone reminders.", DisplayOrder = 4, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 15, Category = "Membership Plans", Question = "How does the Premium plan differ from the Advanced plan?", Answer = "The Premium plan includes detailed charts, community sharing, and 24/7 support.", DisplayOrder = 5 },
        new FAQ { Id = 16, Category = "Membership Plans", Question = "Can I switch plans mid-term?", Answer = "Yes, you can upgrade or downgrade anytime; fees are adjusted based on remaining time.", DisplayOrder = 6, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 17, Category = "Membership Plans", Question = "Are there discounts on membership plans?", Answer = "Yes, periodic discounts are available—check the 'Promotions' page.", DisplayOrder = 7, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 18, Category = "Membership Plans", Question = "How often do I need to pay for the plan?", Answer = "Payments are monthly or yearly, depending on your chosen plan.", DisplayOrder = 8, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 19, Category = "Membership Plans", Question = "Do membership plans include doctor consultations?", Answer = "Not yet, but we're working on adding this to the Premium plan.", DisplayOrder = 9, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 20, Category = "Membership Plans", Question = "How do I check my current membership plan?", Answer = "Go to 'Account Management' to view your active plan details.", DisplayOrder = 10, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 21, Category = "Registration and Payment", Question = "How do I register as a member?", Answer = "Visit the homepage, click 'Register,' fill in your details, and confirm via email.", DisplayOrder = 1, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 22, Category = "Registration and Payment", Question = "What payment methods are accepted?", Answer = "Bank cards, e-wallets (Momo, ZaloPay), and bank transfers.", DisplayOrder = 2, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 23, Category = "Registration and Payment", Question = "How long after payment is my account activated?", Answer = "Your account is activated immediately after successful payment.", DisplayOrder = 3, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 24, Category = "Registration and Payment", Question = "What if I forget my password?", Answer = "Click 'Forgot Password' on the login page and receive a reset link via email.", DisplayOrder = 4, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 25, Category = "Registration and Payment", Question = "Is payment secure?", Answer = "Yes, we use SSL encryption to protect payment information.", DisplayOrder = 5, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 26, Category = "Registration and Payment", Question = "Can I pay for someone else's account?", Answer = "Yes, enter their email when making the payment for the plan.", DisplayOrder = 6, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 27, Category = "Registration and Payment", Question = "Is a phone number required for registration?", Answer = "It's not mandatory but recommended for notifications.", DisplayOrder = 7, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 28, Category = "Registration and Payment", Question = "What if I don't receive a confirmation email?", Answer = "Check your Spam folder or contact support.", DisplayOrder = 8, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 29, Category = "Registration and Payment", Question = "Can I use one email for multiple accounts?", Answer = "No, each email is linked to a single account.", DisplayOrder = 9, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 30, Category = "Registration and Payment", Question = "What if my payment fails?", Answer = "Check your internet connection or contact your bank, then try again.", DisplayOrder = 10, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 31, Category = "Tracking Baby's Growth", Question = "How do I update my baby's weight and height?", Answer = "Go to 'Pregnancy Tracking,' enter data from ultrasounds or measurements.", DisplayOrder = 1, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 32, Category = "Tracking Baby's Growth", Question = "How is the growth chart generated?", Answer = "The system automatically creates a chart based on the data you input by week.", DisplayOrder = 2, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 33, Category = "Tracking Baby's Growth", Question = "Can I view past growth records?", Answer = "Yes, charts and history are available in 'Pregnancy Tracking.'", DisplayOrder = 3, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 34, Category = "Tracking Baby's Growth", Question = "What measurements are considered normal?", Answer = "Based on WHO standards for weight and height by pregnancy week.", DisplayOrder = 4, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 35, Category = "Tracking Baby's Growth", Question = "What if I enter incorrect data?", Answer = "You can edit or delete entries in the input history section.", DisplayOrder = 5, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 36, Category = "Tracking Baby's Growth", Question = "Can I track multiple babies at once?", Answer = "Currently, only one baby is supported; multi-baby tracking is coming soon.", DisplayOrder = 6, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 37, Category = "Tracking Baby's Growth", Question = "Can I download the growth chart?", Answer = "Yes, download it as a PDF or image from the 'Chart' section.", DisplayOrder = 7, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 38, Category = "Tracking Baby's Growth", Question = "What if I don't have ultrasound data?", Answer = "You can input manual measurements or skip if unavailable.", DisplayOrder = 8, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 39, Category = "Tracking Baby's Growth", Question = "Does the system predict growth?", Answer = "Not yet, but we're developing this feature.", DisplayOrder = 9, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 40, Category = "Tracking Baby's Growth", Question = "Can I add notes to growth data?", Answer = "Yes, you can add notes when entering data for detailed tracking.", DisplayOrder = 10, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 41, Category = "Alerts and Reminders", Question = "How does the system alert me about abnormalities?", Answer = "If measurements fall below standards, you'll get an email or app notification.", DisplayOrder = 1, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 42, Category = "Alerts and Reminders", Question = "What reminders will I receive?", Answer = "Prenatal checkups, tests, vaccinations, and key milestones 7 hours in advance.", DisplayOrder = 2, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 43, Category = "Alerts and Reminders", Question = "Can I turn off alerts?", Answer = "Yes, customize or disable them in 'Settings.'", DisplayOrder = 3, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 44, Category = "Alerts and Reminders", Question = "Are reminders sent via SMS?", Answer = "Currently only via email; SMS will be added to the Premium plan later.", DisplayOrder = 4, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 45, Category = "Alerts and Reminders", Question = "What if I don't receive reminders?", Answer = "Check your Spam folder or contact support to verify settings.", DisplayOrder = 5, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 46, Category = "Alerts and Reminders", Question = "Can I add custom reminders?", Answer = "Yes, create them in the 'Appointments' section.", DisplayOrder = 6, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 47, Category = "Alerts and Reminders", Question = "Are alerts detailed?", Answer = "Yes, they specify which measurement is abnormal and suggest actions.", DisplayOrder = 7, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 48, Category = "Alerts and Reminders", Question = "How far in advance are reminders sent?", Answer = "Default is 7 hours; you can adjust this in settings.", DisplayOrder = 8, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 49, Category = "Alerts and Reminders", Question = "Can I get reminders through the app?", Answer = "Currently only via email; app support will come after launch.", DisplayOrder = 9, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 50, Category = "Alerts and Reminders", Question = "Are alerts saved?", Answer = "Yes, view alert history in the 'Notifications' section.", DisplayOrder = 10, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 51, Category = "Appointment Management", Question = "How do I schedule an appointment with a doctor?", Answer = "Go to 'Appointments,' pick a date and time, enter doctor details, and confirm.", DisplayOrder = 1, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 52, Category = "Appointment Management", Question = "Can I edit an appointment?", Answer = "Yes, go to the appointment list, select it, and update the details.", DisplayOrder = 2, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 53, Category = "Appointment Management", Question = "What happens if I cancel an appointment?", Answer = "You'll receive a cancellation email, and it's removed from the system.", DisplayOrder = 3, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 54, Category = "Appointment Management", Question = "Can I book an appointment for someone else?", Answer = "Yes, enter their details when creating the appointment.", DisplayOrder = 4, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 55, Category = "Appointment Management", Question = "Does it sync with Google Calendar?", Answer = "Not yet, but this feature will be added soon.", DisplayOrder = 5, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 56, Category = "Appointment Management", Question = "What if I forget an appointment?", Answer = "The system sends a reminder 7 hours beforehand so you won't miss it.", DisplayOrder = 6, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 57, Category = "Appointment Management", Question = "Can I view past appointments?", Answer = "Yes, old appointments are listed in the 'Appointments' section.", DisplayOrder = 7, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 58, Category = "Appointment Management", Question = "Can I book multiple appointments at once?", Answer = "Yes, as long as the times don't overlap to avoid conflicts.", DisplayOrder = 8, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 59, Category = "Appointment Management", Question = "Do appointments come with a confirmation?", Answer = "Yes, you'll get an email confirmation right after booking.", DisplayOrder = 9, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 60, Category = "Appointment Management", Question = "Can I add notes to appointments?", Answer = "Yes, add notes when creating or editing an appointment.", DisplayOrder = 10, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 61, Category = "Sharing Experiences", Question = "How do I share my baby's growth chart?", Answer = "Go to 'Share,' select the chart, add a note, and post it to the community.", DisplayOrder = 1, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 62, Category = "Sharing Experiences", Question = "Can I comment on others' experiences?", Answer = "Yes, comment directly under other members' posts.", DisplayOrder = 2, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 63, Category = "Sharing Experiences", Question = "How do I view the experience-sharing blog?", Answer = "Visit the 'Blog' section on the homepage to read posts.", DisplayOrder = 3, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 64, Category = "Sharing Experiences", Question = "Can I delete my shared posts?", Answer = "Yes, go to your post list and choose to delete.", DisplayOrder = 4, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 65, Category = "Sharing Experiences", Question = "Are shared posts public?", Answer = "Yes, but you can set them visible only to system members.", DisplayOrder = 5, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 66, Category = "Sharing Experiences", Question = "Can I upload photos to the community?", Answer = "Currently only charts and text are supported; photos will be added later.", DisplayOrder = 6, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 67, Category = "Sharing Experiences", Question = "Is the blog updated regularly?", Answer = "Yes, new posts are added weekly by the community and experts.", DisplayOrder = 7, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 68, Category = "Sharing Experiences", Question = "Can I search posts by topic?", Answer = "Yes, the blog has filters for topics like nutrition and health.", DisplayOrder = 8, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 69, Category = "Sharing Experiences", Question = "Are shared posts moderated?", Answer = "Yes, inappropriate content is removed by administrators.", DisplayOrder = 9, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 70, Category = "Sharing Experiences", Question = "Can I follow other members?", Answer = "Not yet, but this feature is in development.", DisplayOrder = 10, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 71, Category = "Support and Management", Question = "Where can I contact support?", Answer = "Call the hotline at 123-456-789 or email support@pregnancytrack.com.", DisplayOrder = 1, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 72, Category = "Support and Management", Question = "How do I view my member profile?", Answer = "Log in, go to 'Account Management' to view and edit your info.", DisplayOrder = 2, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 73, Category = "Support and Management", Question = "What are the dashboard and reports for?", Answer = "They provide an overview of your pregnancy, appointments, and growth reports.", DisplayOrder = 3, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 74, Category = "Support and Management", Question = "Can I delete my account?", Answer = "Yes, contact support to request permanent account deletion.", DisplayOrder = 4, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 75, Category = "Support and Management", Question = "Is my profile secure?", Answer = "Yes, your data is encrypted and accessible only to you.", DisplayOrder = 5, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 76, Category = "Support and Management", Question = "Is support available 24/7?", Answer = "Yes for Premium members; other plans get support during business hours.", DisplayOrder = 6, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 77, Category = "Support and Management", Question = "Can I change my account email?", Answer = "Yes, update it in 'Account Management.'", DisplayOrder = 7, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 78, Category = "Support and Management", Question = "Can I export reports?", Answer = "Yes, export them as PDFs from the 'Dashboard' section.", DisplayOrder = 8, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 79, Category = "Support and Management", Question = "How long is my data stored?", Answer = "Data is kept for up to 5 years after your account expires.", DisplayOrder = 9, CreatedAt = DateTime.UtcNow },
        new FAQ { Id = 80, Category = "Support and Management", Question = "Can I contact a doctor through the system?", Answer = "Not yet, but you can schedule appointments with doctors.", DisplayOrder = 10, CreatedAt = DateTime.UtcNow }
    );
        }
    }
}