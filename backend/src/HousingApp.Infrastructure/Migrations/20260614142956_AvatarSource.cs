using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HousingApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AvatarSource : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "image_source",
                table: "persons",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "image_source",
                table: "persons");
        }
    }
}
