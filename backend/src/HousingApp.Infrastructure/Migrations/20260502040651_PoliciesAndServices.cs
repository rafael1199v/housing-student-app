using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HousingApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class PoliciesAndServices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "policy_model_room_model",
                columns: table => new
                {
                    policies_id = table.Column<int>(type: "integer", nullable: false),
                    rooms_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_policy_model_room_model", x => new { x.policies_id, x.rooms_id });
                    table.ForeignKey(
                        name: "fk_policy_model_room_model_policies_policies_id",
                        column: x => x.policies_id,
                        principalTable: "policies",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_policy_model_room_model_rooms_rooms_id",
                        column: x => x.rooms_id,
                        principalTable: "rooms",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "room_model_service_model",
                columns: table => new
                {
                    rooms_id = table.Column<int>(type: "integer", nullable: false),
                    services_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_room_model_service_model", x => new { x.rooms_id, x.services_id });
                    table.ForeignKey(
                        name: "fk_room_model_service_model_rooms_rooms_id",
                        column: x => x.rooms_id,
                        principalTable: "rooms",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_room_model_service_model_services_services_id",
                        column: x => x.services_id,
                        principalTable: "services",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_policy_model_room_model_rooms_id",
                table: "policy_model_room_model",
                column: "rooms_id");

            migrationBuilder.CreateIndex(
                name: "ix_room_model_service_model_services_id",
                table: "room_model_service_model",
                column: "services_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "policy_model_room_model");

            migrationBuilder.DropTable(
                name: "room_model_service_model");
        }
    }
}
