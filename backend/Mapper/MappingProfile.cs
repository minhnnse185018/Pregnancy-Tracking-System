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
using backend.Dtos.Questions;
using backend.Dtos.Answers;
using backend.Dtos.MembershipPlans;
using backend.Dtos.Memberships;
using backend.Dtos.PregnancyProfiles;
<<<<<<< HEAD
using backend.Dtos.FetalStandard;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
=======
>>>>>>> origin/truong-son

namespace backend.Mapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
<<<<<<< HEAD
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();

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
=======
            CreateMap<User, UserDto>().ReverseMap();
>>>>>>> origin/truong-son

            // Post mappings
            CreateMap<Post, PostDto>()
                .ForMember(dest => dest.UserName, 
<<<<<<< HEAD
                    opt => opt.MapFrom(src => src.User != null 
                        ? $"{src.User.FirstName} {src.User.LastName}"
                        : "Deleted User"))
=======
                    opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"))
>>>>>>> origin/truong-son
                .ForMember(dest => dest.CommentCount, 
                    opt => opt.MapFrom(src => src.Comments.Count))
                .ForMember(dest => dest.Comments,
                    opt => opt.MapFrom(src => src.Comments));

            CreateMap<CreatePostDto, Post>();
            CreateMap<UpdatePostDto, Post>();

            // Comment mappings
            CreateMap<Comment, CommentDto>()
                .ForMember(dest => dest.UserName,
<<<<<<< HEAD
                    opt => opt.MapFrom(src => src.User != null 
                        ? $"{src.User.FirstName} {src.User.LastName}"
                        : "Deleted User"));
=======
                    opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"));
>>>>>>> origin/truong-son
            CreateMap<CreateCommentDto, Comment>();
            CreateMap<UpdateCommentDto, Comment>();

            // Fetal Measurement mappings
            CreateMap<FetalMeasurement, FetalMeasurementDto>();
            CreateMap<CreateFetalMeasurementDto, FetalMeasurement>();
            CreateMap<UpdateFetalMeasurementDto, FetalMeasurement>();

            // FAQ mappings
            CreateMap<FAQ, FAQDto>();
            CreateMap<CreateFAQDto, FAQ>()
                .ForMember(dest => dest.Status, 
                    opt => opt.MapFrom(src => src.IsPublished ? "published" : "draft"));
            CreateMap<UpdateFAQDto, FAQ>()
                .ForMember(dest => dest.Status, 
                    opt => opt.MapFrom(src => src.IsPublished == true ? "published" : 
                        src.IsPublished == false ? "draft" : src.Status));

            // Appointment mappings
            CreateMap<Appointment, AppointmentDto>();
            CreateMap<CreateAppointmentDto, Appointment>();
            CreateMap<UpdateAppointmentDto, Appointment>();

            // Question mappings
            CreateMap<Question, QuestionDto>()
                .ForMember(dest => dest.UserName,
<<<<<<< HEAD
                    opt => opt.MapFrom(src => src.User != null 
                        ? $"{src.User.FirstName} {src.User.LastName}"
                        : "Deleted User"))
=======
                    opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"))
>>>>>>> origin/truong-son
                .ForMember(dest => dest.AnswerCount,
                    opt => opt.MapFrom(src => src.Answers.Count))
                .ForMember(dest => dest.Answers,
                    opt => opt.MapFrom(src => src.Answers));
            CreateMap<CreateQuestionDto, Question>();
            CreateMap<UpdateQuestionDto, Question>();

            // Answer mappings
            CreateMap<Answer, AnswerDto>()
                .ForMember(dest => dest.UserName,
<<<<<<< HEAD
                    opt => opt.MapFrom(src => src.User != null 
                        ? $"{src.User.FirstName} {src.User.LastName}"
                        : "Deleted User"));
=======
                    opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"));
>>>>>>> origin/truong-son
            CreateMap<CreateAnswerDto, Answer>();
            CreateMap<UpdateAnswerDto, Answer>();

            // PregnancyProfile mappings
            CreateMap<PregnancyProfile, PregnancyProfileDto>()
                .ForMember(dest => dest.UserName,
<<<<<<< HEAD
                    opt => opt.MapFrom(src => src.User != null 
                        ? $"{src.User.FirstName} {src.User.LastName}"
                        : "Deleted User"))
=======
                    opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"))
>>>>>>> origin/truong-son
                .ForMember(dest => dest.FetalMeasurements,
                    opt => opt.MapFrom(src => src.FetalMeasurements));
            CreateMap<CreatePregnancyProfileDto, PregnancyProfile>();
            CreateMap<UpdatePregnancyProfileDto, PregnancyProfile>();

            // FetalGrowthStandard mappings
            CreateMap<FetalGrowthStandard, FetalGrowthStandardDto>();
            CreateMap<CreateFetalGrowthStandardDto, FetalGrowthStandard>();
            CreateMap<UpdateFetalGrowthStandardDto, FetalGrowthStandard>();

            // Membership mappings
            CreateMap<Membership, MembershipDto>()
                .ForMember(dest => dest.UserName,
<<<<<<< HEAD
                    opt => opt.MapFrom(src => src.User != null 
                        ? $"{src.User.FirstName} {src.User.LastName}"
                        : "Deleted User"))
                .ForMember(dest => dest.PlanName,
                    opt => opt.MapFrom(src => src.Plan != null 
                        ? src.Plan.PlanName 
                        : "Deleted Plan"));
            CreateMap<CreateMembershipDto, Membership>();

=======
                    opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"))
                .ForMember(dest => dest.PlanName,
                    opt => opt.MapFrom(src => src.Plan.PlanName));
            CreateMap<CreateMembershipDto, Membership>();
            CreateMap<UpdateMembershipDto, Membership>();
>>>>>>> origin/truong-son

            // MembershipPlan mappings
            CreateMap<MembershipPlan, MembershipPlanDto>();
            CreateMap<CreateMembershipPlanDto, MembershipPlan>();
            CreateMap<UpdateMembershipPlanDto, MembershipPlan>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}