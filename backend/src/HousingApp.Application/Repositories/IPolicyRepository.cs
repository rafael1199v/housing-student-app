using HousingApp.Application.Policy.DTOs;

namespace HousingApp.Application.Repositories;

public interface IPolicyRepository
{
    Task<List<PolicyDto>> GetAllAsync();
}
