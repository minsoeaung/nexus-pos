using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Data.Migrations
{
    /// <inheritdoc />
    public partial class OnDeleteSetNullToReceiptItemForeignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReceiptItems_Items_ItemId",
                table: "ReceiptItems");

            migrationBuilder.AddForeignKey(
                name: "FK_ReceiptItems_Items_ItemId",
                table: "ReceiptItems",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReceiptItems_Items_ItemId",
                table: "ReceiptItems");

            migrationBuilder.AddForeignKey(
                name: "FK_ReceiptItems_Items_ItemId",
                table: "ReceiptItems",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "Id");
        }
    }
}
