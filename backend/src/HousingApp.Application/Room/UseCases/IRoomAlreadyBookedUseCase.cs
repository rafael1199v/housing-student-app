namespace HousingApp.Application.Room.UseCases
{
    public interface IRoomAlreadyBookedUseCase
    {
        Task<bool> ExecuteAsync(int roomId, string studentId);
    }
}