using HousingApp.Application.Policy.DTOs;
using HousingApp.Application.Repositories;
using HousingApp.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace HousingApp.Infrastructure.Persistence.Repositories;

public class PolicyRepository(HousingApplicationDbContext context) : IPolicyRepository
{
    public Task<List<PolicyDto>> GetAllAsync()
    {
        return context.Policies.Select(policy => new PolicyDto(
            Id: policy.Id, Code: policy.Code, Name: policy.Name)).ToListAsync();
    }
}
