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

namespace backend.Mapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>().ReverseMap();

            // Post mappings
            CreateMap<Post, PostDto>()
                .ForMember(dest => dest.UserName, 
                    opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"))
                .ForMember(dest => dest.CommentCount, 
                    opt => opt.MapFrom(src => src.Comments.Count))
                .ForMember(dest => dest.Comments,
                    opt => opt.MapFrom(src => src.Comments));

            CreateMap<CreatePostDto, Post>();
            CreateMap<UpdatePostDto, Post>();

            // Comment mappings
            CreateMap<Comment, CommentDto>()
                .ForMember(dest => dest.UserName,
                    opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"));
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
            CreateMap<Appointment, AppointmentDto>()
                .ForMember(dest => dest.UserName,
                    opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"));
            CreateMap<CreateAppointmentDto, Appointment>();
            CreateMap<UpdateAppointmentDto, Appointment>();

            // Question mappings
            CreateMap<Question, QuestionDto>()
                .ForMember(dest => dest.UserName,
                    opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"))
                .ForMember(dest => dest.AnswerCount,
                    opt => opt.MapFrom(src => src.Answers.Count))
                .ForMember(dest => dest.Answers,
                    opt => opt.MapFrom(src => src.Answers));
            CreateMap<CreateQuestionDto, Question>();
            CreateMap<UpdateQuestionDto, Question>();

            // Answer mappings
            CreateMap<Answer, AnswerDto>()
                .ForMember(dest => dest.UserName,
                    opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"));
            CreateMap<CreateAnswerDto, Answer>();
            CreateMap<UpdateAnswerDto, Answer>();
        }
    }
}