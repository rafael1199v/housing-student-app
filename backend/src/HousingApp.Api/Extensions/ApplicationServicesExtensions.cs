using HousingApp.Application.Auth.UseCases;
using HousingApp.Application.Booking.UseCases;
using HousingApp.Application.Repositories;
using HousingApp.Application.Room.UseCases;
using HousingApp.Application.UnitOfWork;
using HousingApp.Infrastructure.Persistence.Repositories;
using HousingApp.Infrastructure.Persistence.UnitOfWork;

namespace HousingApp.Api.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IPersonRepository, PersonRepository>();
            services.AddScoped<IBookingRepository, BookingRepository>();
            services.AddScoped<IRoomRepository, RoomRepository>();

            services.AddScoped<IAuthUnitOfWork, AuthUnitOfWork>();
            services.AddScoped<IBookingUnitOfWork, BookingUnitOfWork>();
            services.AddScoped<IRoomUnitOfWork, RoomUnitOfWork>();

            services.AddScoped<ILoginUseCase, LoginUseCase>();
            services.AddScoped<IRegisterUseCase, RegisterUseCase>();
            services.AddScoped<IGetRoomsUseCase, GetRoomsUseCase>();
            services.AddScoped<IGetRoomDetailUseCase, GetRoomDetailUseCase>();
            services.AddScoped<ICreateBookingUseCase, CreateBookingUseCase>();
            services.AddScoped<IGetHouseholderRoomsUseCase, GetHouseholderRoomsUseCase>();
            services.AddScoped<ICreateRoomUseCase, CreateRoomUseCase>();
            services.AddScoped<IGetHouseholderRoomDetailUseCase, GetHouseholderRoomDetailUseCase>();
            services.AddScoped<IApproveBookingUseCase, ApproveBookingUseCase>();
            services.AddScoped<IRejectBookingUseCase, RejectBookingUseCase>();
            services.AddScoped<IRoomAlreadyBookedUseCase, RoomAlreadyBookedUseCase>();
            services.AddScoped<IDeleteBookingUseCase, DeleteBookingUseCase>();
            services.AddScoped<IGetStudentBookingsUseCase, GetStudentBookingsUseCase>();

            return services;
        }
    }
}