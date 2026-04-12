using Microsoft.EntityFrameworkCore.Migrations;
using System;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HousingApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "booking_statuses",
                columns: new[] { "id", "created_at", "deleted_at", "is_deleted", "name", "updated_at" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), null, false, "Pending", null },
                    { 2, new DateTime(2026, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), null, false, "Confirmed", null },
                    { 3, new DateTime(2026, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), null, false, "Cancelled", null },
                    { 4, new DateTime(2026, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), null, false, "Completed", null }
                });

            migrationBuilder.InsertData(
                table: "rooms_statuses",
                columns: new[] { "id", "created_at", "deleted_at", "is_deleted", "name", "updated_at" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), null, false, "Available", null },
                    { 2, new DateTime(2026, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), null, false, "Unavailable", null },
                    { 3, new DateTime(2026, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), null, false, "Booked", null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "booking_statuses",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "booking_statuses",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "booking_statuses",
                keyColumn: "id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "booking_statuses",
                keyColumn: "id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "rooms_statuses",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "rooms_statuses",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "rooms_statuses",
                keyColumn: "id",
                keyValue: 3);
        }
    }
}
