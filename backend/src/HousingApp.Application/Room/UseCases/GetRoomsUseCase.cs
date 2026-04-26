using HousingApp.Application.Repositories;
using HousingApp.Application.Room.DTOs;
using HousingApp.Application.Storage;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Error;

namespace HousingApp.Application.Room.UseCases;

public class GetRoomsUseCase(IRoomRepository roomRepository, IStorageService storageService) : IGetRoomsUseCase
{
    public async Task<Result<List<RoomDto>>> ExecuteAsync(SearchRoomsFiltersDto filters)
    {
        if (filters.MinPrice is < 0 || filters.MaxPrice is < 0)
        {
            return Result<List<RoomDto>>.Failure(RoomError.InvalidFilterValue("price"));
        }

        if (filters.MinPrice.HasValue && filters.MaxPrice.HasValue && filters.MinPrice > filters.MaxPrice)
        {
            return Result<List<RoomDto>>.Failure(RoomError.InvalidPriceRange);
        }

        RoomSearchFilters roomSearchFilters = new(
            filters.Name,
            filters.MinPrice,
            filters.MaxPrice
        );

        List<Domain.Entities.Room> rooms = await roomRepository.GetRoomsAsync(roomSearchFilters);

        List<RoomDto> roomDtos =
        [
            .. rooms.Select(r => new RoomDto
            (
                r.Id,
                r.Name,
                r.Latitude,
                r.Longitude,
                r.Description,
                r.Price,
                r.PersonId,
                r.RoomStatus.ToString(),
                r.Person!.FirstName,
                r.Person!.LastName,
                r.Person!.Email,
                r.Person!.PhoneNumber,
                r.Person!.Nationality,
                r.Person!.Gender,
                r.Person!.ImageUrl ?? "",
                [.. r.ImageUrls.Select(imageKey => storageService.GeneratePresignedDownloadUrl(imageKey))]
            ))
        ];

        return Result<List<RoomDto>>.Success(roomDtos);
    }
}
