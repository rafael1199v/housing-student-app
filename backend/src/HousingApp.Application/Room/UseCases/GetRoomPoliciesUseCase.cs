using HousingApp.Application.Repositories;
using HousingApp.Application.Room.DTOs;
using HousingApp.Application.Storage;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Error;

namespace HousingApp.Application.Room.UseCases;

public class GetRoomPoliciesUseCase(IRoomRepository roomRepository) : IGetRoomPoliciesUseCase
{
    public async Task<Result<List<RoomPolicyDto>>> ExecuteAsync()
    {
        List<PolicyRaw> policyRaws = await roomRepository.GetPoliciesAsync();
        List<RoomPolicyDto> policies = policyRaws
            .Select(p => new RoomPolicyDto(p.Id, p.Code))
            .ToList();
        return Result<List<RoomPolicyDto>>.Success(policies);
    }
}