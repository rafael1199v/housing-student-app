using HousingApp.Application.Dashboard.DTOs;

namespace HousingApp.Application.Dashboard.UseCases;

public interface IGetDashboardSummaryUseCase
{
    Task<Result<DashboardSummaryDto>> ExecuteAsync(string userId);
}
