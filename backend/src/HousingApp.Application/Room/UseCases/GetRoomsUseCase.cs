using HousingApp.Application.Repositories;
using HousingApp.Application.Room.DTO;
using HousingApp.Application.Storage;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Error;

namespace HousingApp.Application.Room.UseCases
{
    public class GetRoomsUseCase(IRoomRepository roomRepository, IStorageService storageService) : IGetRoomsUseCase
    {
        public async Task<Result<List<RoomDto>>> ExecuteAsync(SearchRoomsFiltersDto filters)
        {
            if (filters.MinPrice is < 0 || filters.MaxPrice is < 0)
                return Result<List<RoomDto>>.Failure(RoomError.InvalidFilterValue("price"));

            if (filters.MinPrice.HasValue && filters.MaxPrice.HasValue && filters.MinPrice > filters.MaxPrice)
                return Result<List<RoomDto>>.Failure(RoomError.InvalidPriceRange);

            RoomSearchFilters roomSearchFilters = new(
                Name: filters.Name,
                MinPrice: filters.MinPrice,
                MaxPrice: filters.MaxPrice
            );

            List<Domain.Entities.Room> rooms = await roomRepository.GetRoomsAsync(roomSearchFilters);

            List<RoomDto> roomDtos = [.. rooms.Select(r => new RoomDto
            (
                Id: r.Id,
                Name: r.Name,
                Latitude: r.Latitude,
                Longitude: r.Longitude,
                Description: r.Description,
                Price: r.Price,
                PersonId: r.PersonId,
                RoomStatus: r.RoomStatus.ToString(),
                FirstName: r.Person!.FirstName,
                LastName: r.Person!.LastName,
                Email: r.Person!.Email,
                PhoneNumber: r.Person!.PhoneNumber,
                Nationality: r.Person!.Nationality,
                Age: r.Person!.Age,
                Gender: r.Person!.Gender,
                ImageUrl: r.Person!.ImageUrl ?? "",
                ImageRoomUrls: [.. r.ImageUrls.Select(imageKey => storageService.GeneratePresignedDownloadUrl(imageKey))]
            ))];

            return Result<List<RoomDto>>.Success(roomDtos);
        }
    }
}