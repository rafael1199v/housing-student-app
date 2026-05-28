using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HousingApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EmailUnique : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "ix_persons_email",
                table: "persons",
                column: "email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_persons_email",
                table: "persons");
        }
    }
}
