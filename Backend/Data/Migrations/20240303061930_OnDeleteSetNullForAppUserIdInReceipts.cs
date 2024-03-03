using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Data.Migrations
{
    /// <inheritdoc />
    public partial class OnDeleteSetNullForAppUserIdInReceipts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Receipts_Users_AppUserId",
                table: "Receipts");

            migrationBuilder.AddForeignKey(
                name: "FK_Receipts_Users_AppUserId",
                table: "Receipts",
                column: "AppUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Receipts_Users_AppUserId",
                table: "Receipts");

            migrationBuilder.AddForeignKey(
                name: "FK_Receipts_Users_AppUserId",
                table: "Receipts",
                column: "AppUserId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
