using AutoMapper;
using backend.Dtos.Appointments;
using backend.Models;
using backend.Repository.Interface;
using backend.Services.Interface;

namespace backend.Services.Implementation
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IMapper _mapper;

        public AppointmentService(IAppointmentRepository appointmentRepository, IMapper mapper)
        {
            _appointmentRepository = appointmentRepository;
            _mapper = mapper;
        }

        public async Task<AppointmentDto> GetAppointmentByIdAsync(int id)
        {
            var appointment = await _appointmentRepository.GetAppointmentByIdAsync(id);
            return _mapper.Map<AppointmentDto>(appointment);
        }

        public async Task<IEnumerable<AppointmentDto>> GetAllAppointmentsAsync()
        {
            var appointments = await _appointmentRepository.GetAllAppointmentsAsync();
            return _mapper.Map<IEnumerable<AppointmentDto>>(appointments);
        }

        public async Task CreateAppointmentAsync(AppointmentDto appointmentDto)
        {
            var appointment = _mapper.Map<Appointment>(appointmentDto);
            await _appointmentRepository.CreateAppointmentAsync(appointment);
        }

        public async Task UpdateAppointmentAsync(AppointmentDto appointmentDto)
        {
            var appointment = _mapper.Map<Appointment>(appointmentDto);
            await _appointmentRepository.UpdateAppointmentAsync(appointment);
        }

        public async Task DeleteAppointmentAsync(int id)
        {
            await _appointmentRepository.DeleteAppointmentAsync(id);
        }
    }
}
