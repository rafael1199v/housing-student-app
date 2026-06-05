namespace HousingApp.Domain.Error;

public static class ChatError
{
    public static readonly Error ChatNotFound = new("chat.not.found", "El chat no fue encontrado");

    public static readonly Error NotAParticipant =
        new("chat.not.participant", "No eres participante de este chat");

    public static readonly Error RoomNotFound = new("chat.room.not.found", "El alojamiento no fue encontrado");

    public static readonly Error EmptyMessage = new("chat.message.empty", "El mensaje no puede estar vacío");

    public static readonly Error CannotChatWithSelf =
        new("chat.self", "No puedes iniciar un chat contigo mismo");

    public static readonly Error RecipientNotFound =
        new("chat.recipient.not.found", "El destinatario no fue encontrado");

    public static readonly Error RecipientRequired =
        new("chat.recipient.required", "Debes especificar el destinatario del chat");

    public static Error MessageTooLong(int maxLength)
    {
        return new Error("chat.message.too.long", $"El mensaje supera el máximo de {maxLength} caracteres");
    }
}
