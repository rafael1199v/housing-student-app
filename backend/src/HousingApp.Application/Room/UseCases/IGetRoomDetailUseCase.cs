using HousingApp.Application.Room.DTO;
using System;

namespace HousingApp.Application.Room.UseCases;

public interface IGetRoomDetailUseCase
{
    Task<Result<RoomDto>> ExecuteAsync(int roomId);
}
