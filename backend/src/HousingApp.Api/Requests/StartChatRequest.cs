namespace HousingApp.Api.Requests;

public class StartChatRequest
{
    public required int RoomId { get; set; }

    // Required only when the caller is the room owner (householder) and must name the target student.
    public string? ParticipantUserId { get; set; }
}
