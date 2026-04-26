using HousingApp.Application.Auth.UseCases;
using HousingApp.Application.Booking.UseCases;
using HousingApp.Application.Repositories;
using HousingApp.Application.Room.UseCases;
using HousingApp.Application.Services;
using HousingApp.Application.UnitOfWork;
using HousingApp.Infrastructure.Persistence.Repositories;
using HousingApp.Infrastructure.Persistence.UnitOfWork;
using HousingApp.Infrastructure.Seeders;
using HousingApp.Infrastructure.Services;

namespace HousingApp.Api.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        //Repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IPersonRepository, PersonRepository>();
        services.AddScoped<IBookingRepository, BookingRepository>();
        services.AddScoped<IRoomRepository, RoomRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();

        //Unit of work
        services.AddScoped<IAuthUnitOfWork, AuthUnitOfWork>();
        services.AddScoped<IBookingUnitOfWork, BookingUnitOfWork>();
        services.AddScoped<IRoomUnitOfWork, RoomUnitOfWork>();

        //Use cases
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
        services.AddScoped<IGenerateRefreshTokenUseCase, GenerateRefreshTokenUseCase>();
        services.AddScoped<ILoginWithRefreshTokenUseCase, LoginWithRefreshTokenUseCase>();
        services.AddScoped<IGoogleLoginUseCase, GoogleLoginUseCase>();
        services.AddScoped<IGoogleRegistrationUseCase, GoogleRegistrationUseCase>();

        //Seeders
        services.AddScoped<IHousingAppSeeder, HousingAppSeeder>();

        //Services
        services.AddScoped<IGoogleAuthService, GoogleAuthService>();
        services.AddScoped<IEmailService, EmailService>();

        return services;
    }
}
