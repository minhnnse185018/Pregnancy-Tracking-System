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
                entity.Property(e => e.MeasurementType).HasMaxLength(20);

                // Add decimal precision
                entity.Property(e => e.MinValue)
                    .HasColumnType("decimal(10,2)");
                entity.Property(e => e.MedianValue)
                    .HasColumnType("decimal(10,2)");
                entity.Property(e => e.MaxValue)
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
                entity.HasOne(p => p.User)
                    .WithMany(u => u.Payments)
                    .HasForeignKey(p => p.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(p => p.Membership)
                    .WithOne(m => m.Payment)
                    .HasForeignKey<Payment>(p => p.MembershipId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.Property(e => e.Amount).HasColumnType("decimal(10,2)");
                entity.Property(e => e.PaymentMethod).IsRequired().HasMaxLength(50);
            });

            // Seed Data
            // 1. Users
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Email = "1@gmail.com",
                    Password = "111111",
                    UserType = "1",
                    Status = "active",
                    CreatedAt = DateTime.Now
                },
                new User
                {
                    Id = 2,
                    Email = "2@gmail.com",
                    Password = "222222",
                    UserType = "5",
                    Status = "active",
                    CreatedAt = DateTime.Now
                }
            );

            // 2. Pregnancy Profiles
            modelBuilder.Entity<PregnancyProfile>().HasData(
                new PregnancyProfile
                {
                    Id = 1,
                    UserId = 1,
                    ConceptionDate = DateTime.Now.AddDays(-90),
                    DueDate = DateTime.Now.AddDays(180),
                    CreatedAt = DateTime.Now
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
                    MeasurementDate = DateTime.Now.AddDays(-7),
                    CreatedAt = DateTime.Now
                },
                new FetalMeasurement
                {
                    Id = 2,
                    ProfileId = 1,
                    WeightGrams = 650.00M,
                    HeightCm = 28.5M,
                    MeasurementDate = DateTime.Now,
                    CreatedAt = DateTime.Now
                }
            );

            // 4. FAQs
            modelBuilder.Entity<FAQ>().HasData(
                new FAQ
                {
                    Id = 1,
                    Question = "What is the normal fetal weight at 12 weeks?",
                    Answer = "At 12 weeks, the average fetal weight is between 14 and 20 grams.",
                    Category = "Fetal Development",
                    DisplayOrder = 1,
                    CreatedAt = DateTime.Now
                },
                new FAQ
                {
                    Id = 2,
                    Question = "How often should I have prenatal check-ups?",
                    Answer = "During the first 28 weeks, visits are typically scheduled every 4 weeks. Between 28-36 weeks, every 2-3 weeks. After 36 weeks, weekly visits are recommended.",
                    Category = "Prenatal Care",
                    DisplayOrder = 2,
                    CreatedAt = DateTime.Now
                }
            );

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
        }
    }
}