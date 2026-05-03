using HousingApp.Application.Room.DTOs;

namespace HousingApp.Application.Room.UseCases;

public interface IGetRoomPoliciesUseCase
{
    Task<Result<List<RoomPolicyDto>>> ExecuteAsync();
}