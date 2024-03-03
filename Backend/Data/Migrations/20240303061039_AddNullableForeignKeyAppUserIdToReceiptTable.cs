using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddNullableForeignKeyAppUserIdToReceiptTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AppUserId",
                table: "Receipts",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Receipts_AppUserId",
                table: "Receipts",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Receipts_Users_AppUserId",
                table: "Receipts",
                column: "AppUserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Receipts_Users_AppUserId",
                table: "Receipts");

            migrationBuilder.DropIndex(
                name: "IX_Receipts_AppUserId",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Receipts");
        }
    }
}
