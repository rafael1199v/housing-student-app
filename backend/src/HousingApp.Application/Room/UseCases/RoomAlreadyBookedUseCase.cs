using HousingApp.Application.Repositories;

namespace HousingApp.Application.Room.UseCases
{
    public class RoomAlreadyBookedUseCase(IBookingRepository bookingRepository) : IRoomAlreadyBookedUseCase
    {
        public async Task<bool> ExecuteAsync(int roomId, string studentId)
        {
            return await bookingRepository.UserHasAlreadyBooked(studentId, roomId);
        }
    }
}