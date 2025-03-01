using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.EntityFrameworkCore;
<<<<<<< HEAD
using backend.Helpers;
=======

>>>>>>> origin/truong-son

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
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<FAQ> FAQs { get; set; }
        public DbSet<MembershipPlan> MembershipPlans { get; set; }
        public DbSet<Membership> Memberships { get; set; }
        public DbSet<Payment> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

<<<<<<< HEAD
            // Configure DateOnly properties
            var dateOnlyConverter = new DateOnlyConverterEF();
            
            modelBuilder.Entity<User>()
                .Property(e => e.DateOfBirth)
                .HasColumnType("date")
                .HasConversion(dateOnlyConverter);

            modelBuilder.Entity<PregnancyProfile>()
                .Property(e => e.ConceptionDate)
                .HasColumnType("date")
                .HasConversion(dateOnlyConverter);

            modelBuilder.Entity<PregnancyProfile>()
                .Property(e => e.DueDate)
                .HasColumnType("date")
                .HasConversion(dateOnlyConverter);

            modelBuilder.Entity<FetalMeasurement>()
                .Property(e => e.MeasurementDate)
                .HasColumnType("date")
                .HasConversion(dateOnlyConverter);

=======
>>>>>>> origin/truong-son
            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Password).IsRequired().HasMaxLength(255);
                entity.Property(e => e.UserType).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Status).HasDefaultValue("active");
            });

            // PregnancyProfile configuration
            modelBuilder.Entity<PregnancyProfile>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(p => p.User)
                    .WithMany(u => u.PregnancyProfiles)  // ✅ One user has many pregnancy profiles
                    .HasForeignKey(p => p.UserId)        // ✅ Explicitly define the foreign key
                    .OnDelete(DeleteBehavior.Cascade);   // ✅ Delete all pregnancy profiles if user is deleted
            });

<<<<<<< HEAD
=======


>>>>>>> origin/truong-son
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

            // Question configuration
            modelBuilder.Entity<Question>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(q => q.User)
                    .WithMany(u => u.Questions)
                    .HasForeignKey(q => q.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Answer configuration
            modelBuilder.Entity<Answer>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(a => a.User)
                    .WithMany(u => u.Answers)
                    .HasForeignKey(a => a.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(a => a.Question)
                    .WithMany(q => q.Answers)
                    .HasForeignKey(a => a.QuestionId)
                    .OnDelete(DeleteBehavior.Cascade);
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
                entity.Property(e => e.Status).HasMaxLength(20);
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
                    .WithMany(m => m.Payments)
                    .HasForeignKey(p => p.MembershipId)
                    .OnDelete(DeleteBehavior.Restrict);
                entity.Property(e => e.Amount).HasColumnType("decimal(10,2)");
                entity.Property(e => e.PaymentMethod).IsRequired().HasMaxLength(50);
                entity.Property(e => e.PaymentStatus).HasMaxLength(50);
            });
        }
    }
}