namespace HousingApp.Application.Booking.DTO;

public record BookingStudentDto(
    int Id,
    int RoomId,
    string BookingStatus,
    int BookingStatusId,
    string BookingRoomName
);
