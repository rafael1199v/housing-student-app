using HousingApp.Application.Room.DTO;
using HousingApp.Domain.Repositories;

namespace HousingApp.Application.Room.UseCases
{
    public class GetRoomsUseCase(IRoomRepository roomRepository): IGetRoomsUseCase
    {
        public async Task<List<RoomDto>> ExecuteAsync()
        {
            List<Domain.Entities.Room> rooms = await roomRepository.GetRoomsAsync(3);

            return [.. rooms.Select(r => new RoomDto
            (
                Id: r.Id,
                Name: r.Name,
                Latitude: r.Latitude,
                Longitude: r.Latitude,
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
                ImageUrl: r.Person?.ImageUrl ?? "",
                ImageRoomUrls: r.ImageUrls
            ))];
        }
    }
}