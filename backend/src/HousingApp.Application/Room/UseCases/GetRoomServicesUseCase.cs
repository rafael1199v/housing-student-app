using HousingApp.Application.Repositories;
using HousingApp.Application.Room.DTOs;
using HousingApp.Application.Storage;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Error;

namespace HousingApp.Application.Room.UseCases;

public class GetRoomServicesUseCase(IRoomRepository roomRepository) : IGetRoomServicesUseCase
{
    public async Task<Result<List<RoomServiceDto>>> ExecuteAsync()
    {
        List<ServiceRaw> serviceRaws = await roomRepository.GetServicesAsync();
        List<RoomServiceDto> services = serviceRaws
            .Select(s => new RoomServiceDto(s.Id, s.Code))
            .ToList();
        return Result<List<RoomServiceDto>>.Success(services);
    }
}