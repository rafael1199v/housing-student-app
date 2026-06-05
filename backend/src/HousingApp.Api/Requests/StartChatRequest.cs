namespace HousingApp.Api.Requests;

public class StartChatRequest
{
    public int? RoomId { get; set; }

    public string? ParticipantUserId { get; set; }
}
