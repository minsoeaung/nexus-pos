using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSuspendColumnToAspNetUsersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Suspend",
                table: "AspNetRoles");

            migrationBuilder.AddColumn<bool>(
                name: "Suspend",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Suspend",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<bool>(
                name: "Suspend",
                table: "AspNetRoles",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
