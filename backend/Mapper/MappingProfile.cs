using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using backend.Dtos.Posts;
using backend.Dtos.Comments;
using backend.Dtos;
using backend.Models;
using backend.Dtos.FetalGrowth;
using backend.Dtos.FAQs;
using backend.Dtos.Appointments;

using backend.Dtos.MembershipPlans;
using backend.Dtos.Memberships;
using backend.Dtos.PregnancyProfiles;
using backend.Dtos.FetalStandard;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using backend.Dtos.Payment;
using backend.Dtos.GrowthAlerts;
using backend.Dtos.Notifications;

namespace backend.Mapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
            CreateMap<User, UserDtoManager>();
            CreateMap<UserDtoManager, User>();
            CreateMap<AppointmentDto, Appointment>();
            CreateMap<Appointment, AppointmentDto>();

            // For Registration
            CreateMap<RegisterRequest, User>()
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.UserType, opt => opt.Ignore())
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Phone))
                .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth));

            // For Update
            CreateMap<UpdateUserInfoDto, User>()
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Phone))
                .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // Post mappings
            CreateMap<Post, PostDto>()
                .ForMember(dest => dest.UserName,
                    opt => opt.MapFrom(src => src.User != null
                        ? $"{src.User.FirstName} {src.User.LastName}"
                        : "Deleted User"))
                .ForMember(dest => dest.CommentCount,
                    opt => opt.MapFrom(src => src.Comments.Count))
                .ForMember(dest => dest.Comments,
                    opt => opt.MapFrom(src => src.Comments));

            CreateMap<CreatePostDto, Post>();
            CreateMap<UpdatePostDto, Post>();

            // Comment mappings
            CreateMap<Comment, CommentDto>()
                .ForMember(dest => dest.UserName,
                    opt => opt.MapFrom(src => src.User != null
                        ? $"{src.User.FirstName} {src.User.LastName}"
                        : "Deleted User"));
            CreateMap<CreateCommentDto, Comment>();
            CreateMap<UpdateCommentDto, Comment>();

            // Fetal Measurement mappings
            CreateMap<FetalMeasurement, FetalMeasurementDto>();
            CreateMap<CreateFetalMeasurementDto, FetalMeasurement>();
            CreateMap<UpdateFetalMeasurementDto, FetalMeasurement>();

            // FAQ mappings
            CreateMap<FAQ, FAQDto>();
            CreateMap<CreateFAQDto, FAQ>();
            CreateMap<UpdateFAQDto, FAQ>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // Appointment mappings
            CreateMap<Appointment, AppointmentDto>();
            CreateMap<CreateAppointmentDto, Appointment>();
            CreateMap<UpdateAppointmentDto, Appointment>();


            // PregnancyProfile mappings
            CreateMap<PregnancyProfile, PregnancyProfileDto>()
                .ForMember(dest => dest.UserName,
                    opt => opt.MapFrom(src => src.User != null
                        ? $"{src.User.FirstName} {src.User.LastName}"
                        : "Deleted User"));

            CreateMap<CreatePregnancyProfileDto, PregnancyProfile>()
                .ForMember(dest => dest.ConceptionDate, opt => opt.Ignore());
            CreateMap<UpdatePregnancyProfileDto, PregnancyProfile>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            // FetalGrowthStandard mappings
            CreateMap<FetalGrowthStandard, FetalGrowthStandardDto>();
            CreateMap<CreateFetalGrowthStandardDto, FetalGrowthStandard>();
            CreateMap<UpdateFetalGrowthStandardDto, FetalGrowthStandard>();

            // Membership mappings
            CreateMap<Membership, MembershipDto>()
                .ForMember(dest => dest.UserName,
                    opt => opt.MapFrom(src => src.User != null
                        ? $"{src.User.FirstName} {src.User.LastName}"
                        : "Deleted User"))
                .ForMember(dest => dest.PlanName,
                    opt => opt.MapFrom(src => src.Plan != null
                        ? src.Plan.PlanName
                        : "Deleted Plan"));
            CreateMap<CreateMembershipDto, Membership>();


            // MembershipPlan mappings
            CreateMap<MembershipPlan, MembershipPlanDto>();
            CreateMap<CreateMembershipPlanDto, MembershipPlan>();
            CreateMap<UpdateMembershipPlanDto, MembershipPlan>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<Payment,PaymentResponseDto>().ReverseMap();
            CreateMap<GrowthAlert, GrowthAlertDto>().ReverseMap();

            // Add Notification mappings
            CreateMap<Notification, NotificationDto>();
            CreateMap<NotificationDto, Notification>();
        }
    }
}