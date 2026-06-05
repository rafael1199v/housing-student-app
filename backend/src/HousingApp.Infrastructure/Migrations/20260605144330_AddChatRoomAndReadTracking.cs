using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HousingApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddChatRoomAndReadTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_chat_messages_chat_id",
                table: "chat_messages");

            migrationBuilder.AddColumn<int>(
                name: "room_id",
                table: "chats",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "last_read_message_id",
                table: "chat_participants",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_chats_room_id",
                table: "chats",
                column: "room_id");

            migrationBuilder.CreateIndex(
                name: "ix_chat_messages_chat_id_id",
                table: "chat_messages",
                columns: new[] { "chat_id", "id" });

            migrationBuilder.AddForeignKey(
                name: "fk_chats_rooms_room_id",
                table: "chats",
                column: "room_id",
                principalTable: "rooms",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_chats_rooms_room_id",
                table: "chats");

            migrationBuilder.DropIndex(
                name: "ix_chats_room_id",
                table: "chats");

            migrationBuilder.DropIndex(
                name: "ix_chat_messages_chat_id_id",
                table: "chat_messages");

            migrationBuilder.DropColumn(
                name: "room_id",
                table: "chats");

            migrationBuilder.DropColumn(
                name: "last_read_message_id",
                table: "chat_participants");

            migrationBuilder.CreateIndex(
                name: "ix_chat_messages_chat_id",
                table: "chat_messages",
                column: "chat_id");
        }
    }
}
