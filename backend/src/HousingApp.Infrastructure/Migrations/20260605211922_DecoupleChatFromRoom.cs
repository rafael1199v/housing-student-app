using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HousingApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DecoupleChatFromRoom : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_chats_rooms_room_id",
                table: "chats");

            migrationBuilder.DropIndex(
                name: "ix_chats_room_id",
                table: "chats");

            migrationBuilder.DropColumn(
                name: "room_id",
                table: "chats");

            migrationBuilder.AddColumn<int>(
                name: "chat_type",
                table: "chats",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "direct_key",
                table: "chats",
                type: "character varying(911)",
                maxLength: 911,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_chats_direct_key",
                table: "chats",
                column: "direct_key",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_chats_direct_key",
                table: "chats");

            migrationBuilder.DropColumn(
                name: "chat_type",
                table: "chats");

            migrationBuilder.DropColumn(
                name: "direct_key",
                table: "chats");

            migrationBuilder.AddColumn<int>(
                name: "room_id",
                table: "chats",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_chats_room_id",
                table: "chats",
                column: "room_id");

            migrationBuilder.AddForeignKey(
                name: "fk_chats_rooms_room_id",
                table: "chats",
                column: "room_id",
                principalTable: "rooms",
                principalColumn: "id");
        }
    }
}
