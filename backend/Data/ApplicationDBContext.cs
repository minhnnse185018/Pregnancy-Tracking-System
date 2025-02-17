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
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> dbContextOptions)
            : base(dbContextOptions)
        {
        }
        public DbSet<User> Users{get;set;}
        public DbSet<Manager> Managers { get; set; }
        public DbSet<Member> Members { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasKey(u=>u.UserId);
            modelBuilder.Entity<Manager>().HasKey(mng=>mng.ManagerId);
            modelBuilder.Entity<Member>().HasKey(mb=>mb.MemberId);

            modelBuilder.Entity<Manager>()
                .HasOne(m=>m.User)
                .WithOne(u=>u.Manager)
                .HasForeignKey<Manager>(m => m.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Member>()
                .HasOne(m=>m.User)
                .WithOne(u=>u.Member)
                .HasForeignKey<Member>(m => m.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Manager>()
                .Property(m => m.UserId)
                .IsRequired();

            modelBuilder.Entity<Member>()
                .Property(m => m.UserId)
                .IsRequired();

            modelBuilder.Entity<User>().HasData(
                new User 
                { 
                    UserId = 1,
                    Username = "admin",
                    Password = "admin123",
                    RoleId = "ADMIN",
                    Status = "ACTIVE",
                    CreateDate = DateTime.Now
                },
                new User 
                { 
                    UserId = 2,
                    Username = "manager1",
                    Password = "manager123",
                    RoleId = "MANAGER",
                    Status = "ACTIVE",
                    CreateDate = DateTime.Now
                },
                new User 
                { 
                    UserId = 3,
                    Username = "member1",
                    Password = "member123",
                    RoleId = "MEMBER",
                    Status = "ACTIVE",
                    CreateDate = DateTime.Now
                }
            );

            modelBuilder.Entity<Manager>().HasData(
                new Manager
                {
                    ManagerId = 1,
                    FirstName = "John",
                    LastName = "Doe",
                    DateOfBirth = new DateTime(1985, 1, 15),
                    Gender = "Male",
                    Images = "manager1.jpg",
                    UserId = 2,
                    Phone = "1234567890"
                }
            );

            modelBuilder.Entity<Member>().HasData(
                new Member
                {
                    MemberId = 1,
                    FirstName = "Jane",
                    LastName = "Smith",
                    DateOfBirth = new DateTime(1990, 6, 20),
                    Gender = "Female",
                    Images = "member1.jpg",
                    UserId = 3,
                    Phone = "0987654321"
                }
            );
        }
    }
}