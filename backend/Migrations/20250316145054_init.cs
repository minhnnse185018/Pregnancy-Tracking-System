using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FAQs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Question = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Answer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Category = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FAQs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FetalGrowthStandards",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WeekNumber = table.Column<int>(type: "int", nullable: false),
                    WeightGrams = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    HeightCm = table.Column<decimal>(type: "decimal(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FetalGrowthStandards", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MembershipPlans",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlanName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Duration = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MembershipPlans", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Reminders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Week = table.Column<int>(type: "int", nullable: false),
                    Subject = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Body = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reminders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ResetToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ResetTokenExpired = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AppointmentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReminderSent = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Appointments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Memberships",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PlanId = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Memberships", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Memberships_MembershipPlans_PlanId",
                        column: x => x.PlanId,
                        principalTable: "MembershipPlans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Memberships_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MemberId = table.Column<int>(type: "int", nullable: false),
                    DoctorId = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Sender = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Messages_Users_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Messages_Users_MemberId",
                        column: x => x.MemberId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Posts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Posts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Posts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PregnancyProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ConceptionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PregnancyStatus = table.Column<string>(type: "nvarchar(20)", nullable: false, computedColumnSql: "CAST(CASE WHEN GETDATE() < DueDate THEN 'On Going' ELSE 'Completed' END AS nvarchar(20))", stored: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PregnancyProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PregnancyProfiles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ScheduledEmails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AppointmentId = table.Column<int>(type: "int", nullable: false),
                    RecipientEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Subject = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Body = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ScheduledTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsSent = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScheduledEmails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ScheduledEmails_Appointments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Appointments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MembershipId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    PaymentDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    VnpayToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VnpayTransactionNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VnpayResponseCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PaymentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PaymentStatus = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Payments_Memberships_MembershipId",
                        column: x => x.MembershipId,
                        principalTable: "Memberships",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PostId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Comments_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Comments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FetalMeasurements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProfileId = table.Column<int>(type: "int", nullable: false),
                    WeightGrams = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    HeightCm = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Week = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FetalMeasurements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FetalMeasurements_PregnancyProfiles_ProfileId",
                        column: x => x.ProfileId,
                        principalTable: "PregnancyProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GrowthAlerts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MeasurementId = table.Column<int>(type: "int", nullable: false),
                    AlertMessage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GrowthAlerts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GrowthAlerts_FetalMeasurements_MeasurementId",
                        column: x => x.MeasurementId,
                        principalTable: "FetalMeasurements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "FAQs",
                columns: new[] { "Id", "Answer", "Category", "CreatedAt", "DisplayOrder", "Question", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "It’s a software that helps pregnant women track their baby’s development, manage appointments, receive alerts, and share experiences.", "System Introduction", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8434), 1, "What is the pregnancy tracking system?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8433) },
                    { 2, "Pregnant women, family members, or anyone interested in pregnancy can sign up and use it.", "System Introduction", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8436), 2, "Who can use this system?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8435) },
                    { 3, "Register as a member, choose a membership plan, and make a payment to activate features.", "System Introduction", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8438), 3, "How do I start using the system?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8437) },
                    { 4, "Currently, there’s a web version; a mobile app is under development and will launch soon.", "System Introduction", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8440), 4, "Is there a mobile app for the system?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8439) },
                    { 5, "It currently supports Vietnamese; English will be added in the future.", "System Introduction", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8441), 5, "Does the system support multiple languages?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8441) },
                    { 6, "Yes, you get a 7-day free trial with the Basic plan before purchasing.", "System Introduction", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8443), 6, "Can I try it for free?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8442) },
                    { 7, "Yes, we use data encryption to protect your personal information.", "System Introduction", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8445), 7, "Is the system secure?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8444) },
                    { 8, "Not directly yet, but you can schedule appointments with doctors through it.", "System Introduction", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8447), 8, "Does the system connect with doctors?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8446) },
                    { 9, "A team of pregnancy experts and technology professionals created this software.", "System Introduction", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8449), 9, "Who developed this system?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8448) },
                    { 10, "Yes, we periodically update features and information.", "System Introduction", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8451), 10, "Is the system updated regularly?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8450) },
                    { 11, "Basic, Advanced, and Premium plans with different pricing and features. Check details on the 'Plans' page.", "Membership Plans", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8453), 1, "What membership plans are available?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8452) },
                    { 12, "Log in, go to 'Account Management,' select a new plan, and complete the payment.", "Membership Plans", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8454), 2, "How do I upgrade my membership plan?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8454) },
                    { 13, "Yes, you can get a refund within 7 days if no features have been used.", "Membership Plans", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8456), 3, "Can I get a refund if I’m not satisfied?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8455) },
                    { 14, "Basic tracking, appointment scheduling, and key milestone reminders.", "Membership Plans", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8458), 4, "What features does the Basic plan include?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8457) },
                    { 15, "The Premium plan includes detailed charts, community sharing, and 24/7 support.", "Membership Plans", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8459), 5, "How does the Premium plan differ from the Advanced plan?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8459) },
                    { 16, "Yes, you can upgrade or downgrade anytime; fees are adjusted based on remaining time.", "Membership Plans", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8461), 6, "Can I switch plans mid-term?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8460) },
                    { 17, "Yes, periodic discounts are available—check the 'Promotions' page.", "Membership Plans", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8463), 7, "Are there discounts on membership plans?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8462) },
                    { 18, "Payments are monthly or yearly, depending on your chosen plan.", "Membership Plans", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8465), 8, "How often do I need to pay for the plan?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8464) },
                    { 19, "Not yet, but we’re working on adding this to the Premium plan.", "Membership Plans", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8467), 9, "Do membership plans include doctor consultations?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8466) },
                    { 20, "Go to 'Account Management' to view your active plan details.", "Membership Plans", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8469), 10, "How do I check my current membership plan?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8468) },
                    { 21, "Visit the homepage, click 'Register,' fill in your details, and confirm via email.", "Registration and Payment", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8470), 1, "How do I register as a member?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8470) },
                    { 22, "Bank cards, e-wallets (Momo, ZaloPay), and bank transfers.", "Registration and Payment", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8472), 2, "What payment methods are accepted?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8471) },
                    { 23, "Your account is activated immediately after successful payment.", "Registration and Payment", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8474), 3, "How long after payment is my account activated?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8473) },
                    { 24, "Click 'Forgot Password' on the login page and receive a reset link via email.", "Registration and Payment", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8476), 4, "What if I forget my password?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8475) },
                    { 25, "Yes, we use SSL encryption to protect payment information.", "Registration and Payment", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8478), 5, "Is payment secure?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8477) },
                    { 26, "Yes, enter their email when making the payment for the plan.", "Registration and Payment", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8480), 6, "Can I pay for someone else’s account?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8479) },
                    { 27, "It’s not mandatory but recommended for notifications.", "Registration and Payment", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8482), 7, "Is a phone number required for registration?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8481) },
                    { 28, "Check your Spam folder or contact support.", "Registration and Payment", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8483), 8, "What if I don’t receive a confirmation email?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8482) },
                    { 29, "No, each email is linked to a single account.", "Registration and Payment", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8485), 9, "Can I use one email for multiple accounts?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8484) },
                    { 30, "Check your internet connection or contact your bank, then try again.", "Registration and Payment", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8487), 10, "What if my payment fails?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8486) },
                    { 31, "Go to 'Pregnancy Tracking,' enter data from ultrasounds or measurements.", "Tracking Baby’s Growth", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8489), 1, "How do I update my baby’s weight and height?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8488) },
                    { 32, "The system automatically creates a chart based on the data you input by week.", "Tracking Baby’s Growth", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8491), 2, "How is the growth chart generated?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8490) },
                    { 33, "Yes, charts and history are available in 'Pregnancy Tracking.'", "Tracking Baby’s Growth", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8493), 3, "Can I view past growth records?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8492) },
                    { 34, "Based on WHO standards for weight and height by pregnancy week.", "Tracking Baby’s Growth", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8494), 4, "What measurements are considered normal?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8494) },
                    { 35, "You can edit or delete entries in the input history section.", "Tracking Baby’s Growth", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8496), 5, "What if I enter incorrect data?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8495) },
                    { 36, "Currently, only one baby is supported; multi-baby tracking is coming soon.", "Tracking Baby’s Growth", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8498), 6, "Can I track multiple babies at once?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8497) },
                    { 37, "Yes, download it as a PDF or image from the 'Chart' section.", "Tracking Baby’s Growth", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8500), 7, "Can I download the growth chart?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8499) },
                    { 38, "You can input manual measurements or skip if unavailable.", "Tracking Baby’s Growth", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8502), 8, "What if I don’t have ultrasound data?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8501) },
                    { 39, "Not yet, but we’re developing this feature.", "Tracking Baby’s Growth", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8504), 9, "Does the system predict growth?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8503) },
                    { 40, "Yes, you can add notes when entering data for detailed tracking.", "Tracking Baby’s Growth", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8505), 10, "Can I add notes to growth data?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8505) },
                    { 41, "If measurements fall below standards, you’ll get an email or app notification.", "Alerts and Reminders", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8507), 1, "How does the system alert me about abnormalities?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8506) },
                    { 42, "Prenatal checkups, tests, vaccinations, and key milestones 7 hours in advance.", "Alerts and Reminders", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8509), 2, "What reminders will I receive?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8508) },
                    { 43, "Yes, customize or disable them in 'Settings.'", "Alerts and Reminders", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8511), 3, "Can I turn off alerts?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8510) },
                    { 44, "Currently only via email; SMS will be added to the Premium plan later.", "Alerts and Reminders", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8513), 4, "Are reminders sent via SMS?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8512) },
                    { 45, "Check your Spam folder or contact support to verify settings.", "Alerts and Reminders", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8514), 5, "What if I don’t receive reminders?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8514) },
                    { 46, "Yes, create them in the 'Appointments' section.", "Alerts and Reminders", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8516), 6, "Can I add custom reminders?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8515) },
                    { 47, "Yes, they specify which measurement is abnormal and suggest actions.", "Alerts and Reminders", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8518), 7, "Are alerts detailed?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8517) },
                    { 48, "Default is 7 hours; you can adjust this in settings.", "Alerts and Reminders", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8542), 8, "How far in advance are reminders sent?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8541) },
                    { 49, "Currently only via email; app support will come after launch.", "Alerts and Reminders", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8543), 9, "Can I get reminders through the app?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8543) },
                    { 50, "Yes, view alert history in the 'Notifications' section.", "Alerts and Reminders", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8545), 10, "Are alerts saved?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8544) },
                    { 51, "Go to 'Appointments,' pick a date and time, enter doctor details, and confirm.", "Appointment Management", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8547), 1, "How do I schedule an appointment with a doctor?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8546) },
                    { 52, "Yes, go to the appointment list, select it, and update the details.", "Appointment Management", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8549), 2, "Can I edit an appointment?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8548) },
                    { 53, "You’ll receive a cancellation email, and it’s removed from the system.", "Appointment Management", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8551), 3, "What happens if I cancel an appointment?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8550) },
                    { 54, "Yes, enter their details when creating the appointment.", "Appointment Management", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8553), 4, "Can I book an appointment for someone else?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8552) },
                    { 55, "Not yet, but this feature will be added soon.", "Appointment Management", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8555), 5, "Does it sync with Google Calendar?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8554) },
                    { 56, "The system sends a reminder 7 hours beforehand so you won’t miss it.", "Appointment Management", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8556), 6, "What if I forget an appointment?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8555) },
                    { 57, "Yes, old appointments are listed in the 'Appointments' section.", "Appointment Management", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8558), 7, "Can I view past appointments?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8557) },
                    { 58, "Yes, as long as the times don’t overlap to avoid conflicts.", "Appointment Management", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8560), 8, "Can I book multiple appointments at once?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8559) },
                    { 59, "Yes, you’ll get an email confirmation right after booking.", "Appointment Management", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8562), 9, "Do appointments come with a confirmation?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8561) },
                    { 60, "Yes, add notes when creating or editing an appointment.", "Appointment Management", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8564), 10, "Can I add notes to appointments?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8563) },
                    { 61, "Go to 'Share,' select the chart, add a note, and post it to the community.", "Sharing Experiences", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8565), 1, "How do I share my baby’s growth chart?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8565) },
                    { 62, "Yes, comment directly under other members’ posts.", "Sharing Experiences", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8567), 2, "Can I comment on others’ experiences?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8566) },
                    { 63, "Visit the 'Blog' section on the homepage to read posts.", "Sharing Experiences", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8569), 3, "How do I view the experience-sharing blog?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8568) },
                    { 64, "Yes, go to your post list and choose to delete.", "Sharing Experiences", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8571), 4, "Can I delete my shared posts?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8570) },
                    { 65, "Yes, but you can set them visible only to system members.", "Sharing Experiences", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8573), 5, "Are shared posts public?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8572) },
                    { 66, "Currently only charts and text are supported; photos will be added later.", "Sharing Experiences", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8575), 6, "Can I upload photos to the community?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8574) },
                    { 67, "Yes, new posts are added weekly by the community and experts.", "Sharing Experiences", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8576), 7, "Is the blog updated regularly?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8575) },
                    { 68, "Yes, the blog has filters for topics like nutrition and health.", "Sharing Experiences", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8578), 8, "Can I search posts by topic?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8577) },
                    { 69, "Yes, inappropriate content is removed by administrators.", "Sharing Experiences", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8580), 9, "Are shared posts moderated?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8579) },
                    { 70, "Not yet, but this feature is in development.", "Sharing Experiences", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8582), 10, "Can I follow other members?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8581) },
                    { 71, "Call the hotline at 123-456-789 or email support@pregnancytrack.com.", "Support and Management", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8584), 1, "Where can I contact support?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8583) },
                    { 72, "Log in, go to 'Account Management' to view and edit your info.", "Support and Management", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8585), 2, "How do I view my member profile?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8585) },
                    { 73, "They provide an overview of your pregnancy, appointments, and growth reports.", "Support and Management", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8587), 3, "What are the dashboard and reports for?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8586) },
                    { 74, "Yes, contact support to request permanent account deletion.", "Support and Management", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8589), 4, "Can I delete my account?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8588) },
                    { 75, "Yes, your data is encrypted and accessible only to you.", "Support and Management", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8591), 5, "Is my profile secure?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8590) },
                    { 76, "Yes for Premium members; other plans get support during business hours.", "Support and Management", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8593), 6, "Is support available 24/7?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8592) },
                    { 77, "Yes, update it in 'Account Management.'", "Support and Management", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8595), 7, "Can I change my account email?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8594) },
                    { 78, "Yes, export them as PDFs from the 'Dashboard' section.", "Support and Management", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8596), 8, "Can I export reports?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8596) },
                    { 79, "Data is kept for up to 5 years after your account expires.", "Support and Management", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8598), 9, "How long is my data stored?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8597) },
                    { 80, "Not yet, but you can schedule appointments with doctors.", "Support and Management", new DateTime(2025, 3, 16, 14, 50, 53, 492, DateTimeKind.Utc).AddTicks(8600), 10, "Can I contact a doctor through the system?", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8599) }
                });

            migrationBuilder.InsertData(
                table: "FetalGrowthStandards",
                columns: new[] { "Id", "HeightCm", "WeekNumber", "WeightGrams" },
                values: new object[,]
                {
                    { 1, 1.6m, 8, 1m },
                    { 2, 2.3m, 9, 2m },
                    { 3, 3.1m, 10, 4m },
                    { 4, 4.1m, 11, 7m },
                    { 5, 5.4m, 12, 14m },
                    { 6, 7.4m, 13, 23m },
                    { 7, 8.7m, 14, 43m },
                    { 8, 10.1m, 15, 70m },
                    { 9, 11.6m, 16, 100m },
                    { 10, 13.0m, 17, 140m },
                    { 11, 14.2m, 18, 190m },
                    { 12, 15.3m, 19, 240m },
                    { 13, 16.4m, 20, 300m },
                    { 14, 25.6m, 21, 360m },
                    { 15, 27.8m, 22, 430m },
                    { 16, 28.9m, 23, 501m },
                    { 17, 30.0m, 24, 600m },
                    { 18, 34.6m, 25, 660m },
                    { 19, 35.6m, 26, 760m },
                    { 20, 36.6m, 27, 875m },
                    { 21, 37.6m, 28, 1005m },
                    { 22, 38.6m, 29, 1153m },
                    { 23, 39.9m, 30, 1319m },
                    { 24, 41.1m, 31, 1502m },
                    { 25, 42.4m, 32, 1702m },
                    { 26, 43.7m, 33, 1918m },
                    { 27, 45.0m, 34, 2146m },
                    { 28, 46.2m, 35, 2383m },
                    { 29, 47.4m, 36, 2622m },
                    { 30, 48.6m, 37, 2859m },
                    { 31, 49.8m, 38, 3083m },
                    { 32, 50.7m, 39, 3288m },
                    { 33, 51.2m, 40, 3462m }
                });

            migrationBuilder.InsertData(
                table: "Reminders",
                columns: new[] { "Id", "Body", "Subject", "Week" },
                values: new object[,]
                {
                    { 1, "It's time for your prenatal check-up! At this stage, the goal is to confirm the presence of a fetal heartbeat, measure the embryo's length, and check the size of the amniotic sac. Make sure to complete the blood and urine tests to assess your health, including iron and calcium levels, and screen for gestational diabetes or thyroid disorders.", "Reminder: Prenatal Check-up at Week 7 or 8", 7 },
                    { 2, "Don't miss your important prenatal screening! This check-up screens for fetal abnormalities, especially Down syndrome. If you haven't had basic blood tests done earlier, now is the time to complete them.", "Reminder: Prenatal Screening at Week 11 to 13", 11 },
                    { 3, "It’s time for your anomaly scan! At this check-up, the doctor will detect any structural abnormalities in the fetus, such as cleft palate or cleft lip. Schedule your appointment to ensure all is progressing well.", "Reminder: Anomaly Scan at Week 16 to 18", 16 },
                    { 4, "Your detailed ultrasound is due! The doctor will check for abnormalities in the lungs, heart, and other organs. They will check your baby’s weight, umbilical cord, and amniotic fluid levels. Weekly ultrasounds or check-ups are recommended from now until delivery.", "Reminder: Detailed Ultrasound at Week 20 to 22", 20 },
                    { 5, "At this point, it is crucial to undergo tests for gestational diabetes and preeclampsia, including urine tests and liver and kidney function assessments. You will also receive a tetanus vaccination at this time. Consult with your doctor for a suitable dietary plan based on your results.", "Reminder: Glucose Test and Screening at Week 24 to 28", 24 },
                    { 6, "It's time for your 4D ultrasound! This scan can help detect any late-developing abnormalities in the baby. The doctor will also monitor your overall health and the baby's position, along with blood flow in the uterine and umbilical arteries. You will receive your second tetanus shot around this time.", "Reminder: 4D Ultrasound at Week 32", 32 },
                    { 7, "Now it's time for fetal monitoring (cardiotocography) to assess uterine contractions and the fetal heart rate. The doctor will estimate the baby's weight, and check the umbilical cord and amniotic fluid levels. Weekly ultrasounds or check-ups are recommended from this point onward. Make sure to complete all required tests, including beta-strep screening.", "Reminder: Prenatal Monitoring at Week 35 or 36", 35 }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "DateOfBirth", "Email", "FirstName", "Gender", "LastName", "Password", "Phone", "ResetToken", "ResetTokenExpired", "Status", "UserType" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(7809), null, "1@gmail.com", null, null, null, "111111", null, null, null, "active", "1" },
                    { 2, new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(7811), null, "2@gmail.com", null, null, null, "222222", null, null, null, "active", "5" }
                });

            migrationBuilder.InsertData(
                table: "Posts",
                columns: new[] { "Id", "Content", "CreatedAt", "Image", "Status", "Title", "UpdatedAt", "UserId" },
                values: new object[] { 1, "I'm excited to share my journey through the first trimester...", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8248), null, "published", "My First Pregnancy Experience", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8247), 1 });

            migrationBuilder.InsertData(
                table: "PregnancyProfiles",
                columns: new[] { "Id", "ConceptionDate", "CreatedAt", "DueDate", "UserId" },
                values: new object[] { 1, new DateTime(2024, 12, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8169), new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8174), new DateTime(2025, 9, 12, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8173), 1 });

            migrationBuilder.InsertData(
                table: "Comments",
                columns: new[] { "Id", "Content", "CreatedAt", "PostId", "UserId" },
                values: new object[,]
                {
                    { 1, "Thank you for sharing your experience! It's very helpful.", new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8274), 1, 2 },
                    { 2, "I'm glad you found it helpful! Feel free to ask any questions.", new DateTime(2025, 3, 16, 22, 50, 53, 492, DateTimeKind.Local).AddTicks(8319), 1, 1 }
                });

            migrationBuilder.InsertData(
                table: "FetalMeasurements",
                columns: new[] { "Id", "CreatedAt", "HeightCm", "Notes", "ProfileId", "Week", "WeightGrams" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8215), 25.5m, null, 1, 12, 500.00m },
                    { 2, new DateTime(2025, 3, 16, 21, 50, 53, 492, DateTimeKind.Local).AddTicks(8219), 28.5m, null, 1, 16, 650.00m }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_UserId",
                table: "Appointments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_PostId",
                table: "Comments",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_UserId",
                table: "Comments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_FetalMeasurements_ProfileId",
                table: "FetalMeasurements",
                column: "ProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_GrowthAlerts_MeasurementId",
                table: "GrowthAlerts",
                column: "MeasurementId");

            migrationBuilder.CreateIndex(
                name: "IX_Memberships_PlanId",
                table: "Memberships",
                column: "PlanId");

            migrationBuilder.CreateIndex(
                name: "IX_Memberships_UserId",
                table: "Memberships",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_DoctorId",
                table: "Messages",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_MemberId",
                table: "Messages",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_MembershipId",
                table: "Payments",
                column: "MembershipId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Posts_UserId",
                table: "Posts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PregnancyProfiles_UserId",
                table: "PregnancyProfiles",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduledEmails_AppointmentId",
                table: "ScheduledEmails",
                column: "AppointmentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "FAQs");

            migrationBuilder.DropTable(
                name: "FetalGrowthStandards");

            migrationBuilder.DropTable(
                name: "GrowthAlerts");

            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "Reminders");

            migrationBuilder.DropTable(
                name: "ScheduledEmails");

            migrationBuilder.DropTable(
                name: "Posts");

            migrationBuilder.DropTable(
                name: "FetalMeasurements");

            migrationBuilder.DropTable(
                name: "Memberships");

            migrationBuilder.DropTable(
                name: "Appointments");

            migrationBuilder.DropTable(
                name: "PregnancyProfiles");

            migrationBuilder.DropTable(
                name: "MembershipPlans");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
