using HousingApp.Application.Repositories;
using HousingApp.Application.RoomService.DTOs;
using HousingApp.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace HousingApp.Infrastructure.Persistence.Repositories;

public class ServiceRepository(HousingApplicationDbContext context) : IServiceRepository
{
    public Task<List<ServiceDto>> GetAllAsync()
    {
        return context.Services.Select(service => new ServiceDto(Id: service.Id)).ToListAsync();
    }
}
