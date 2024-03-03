using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Data.Migrations
{
    /// <inheritdoc />
    public partial class TableNameChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Items_Categories_CategoryId",
                table: "Items");

            migrationBuilder.DropForeignKey(
                name: "FK_Items_Users_AppUserId",
                table: "Items");

            migrationBuilder.DropForeignKey(
                name: "FK_Items_Vendors_VendorId",
                table: "Items");

            migrationBuilder.DropForeignKey(
                name: "FK_ReceiptItems_Items_ItemId",
                table: "ReceiptItems");

            migrationBuilder.DropForeignKey(
                name: "FK_ReceiptItems_Receipts_ReceiptId",
                table: "ReceiptItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Receipts_Customers_CustomerId",
                table: "Receipts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Receipts",
                table: "Receipts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ReceiptItems",
                table: "ReceiptItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Items",
                table: "Items");

            migrationBuilder.RenameTable(
                name: "Receipts",
                newName: "Orders");

            migrationBuilder.RenameTable(
                name: "ReceiptItems",
                newName: "OrderItems");

            migrationBuilder.RenameTable(
                name: "Items",
                newName: "Products");

            migrationBuilder.RenameIndex(
                name: "IX_Receipts_CustomerId",
                table: "Orders",
                newName: "IX_Orders_CustomerId");

            migrationBuilder.RenameIndex(
                name: "IX_ReceiptItems_ReceiptId",
                table: "OrderItems",
                newName: "IX_OrderItems_ReceiptId");

            migrationBuilder.RenameIndex(
                name: "IX_ReceiptItems_ItemId",
                table: "OrderItems",
                newName: "IX_OrderItems_ItemId");

            migrationBuilder.RenameIndex(
                name: "IX_Items_VendorId",
                table: "Products",
                newName: "IX_Products_VendorId");

            migrationBuilder.RenameIndex(
                name: "IX_Items_CategoryId",
                table: "Products",
                newName: "IX_Products_CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Items_AppUserId",
                table: "Products",
                newName: "IX_Products_AppUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Orders",
                table: "Orders",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderItems",
                table: "OrderItems",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Products",
                table: "Products",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Orders_ReceiptId",
                table: "OrderItems",
                column: "ReceiptId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Products_ItemId",
                table: "OrderItems",
                column: "ItemId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Customers_CustomerId",
                table: "Orders",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Categories_CategoryId",
                table: "Products",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Users_AppUserId",
                table: "Products",
                column: "AppUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Vendors_VendorId",
                table: "Products",
                column: "VendorId",
                principalTable: "Vendors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Orders_ReceiptId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Products_ItemId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Customers_CustomerId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Categories_CategoryId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Users_AppUserId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Vendors_VendorId",
                table: "Products");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Products",
                table: "Products");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Orders",
                table: "Orders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderItems",
                table: "OrderItems");

            migrationBuilder.RenameTable(
                name: "Products",
                newName: "Items");

            migrationBuilder.RenameTable(
                name: "Orders",
                newName: "Receipts");

            migrationBuilder.RenameTable(
                name: "OrderItems",
                newName: "ReceiptItems");

            migrationBuilder.RenameIndex(
                name: "IX_Products_VendorId",
                table: "Items",
                newName: "IX_Items_VendorId");

            migrationBuilder.RenameIndex(
                name: "IX_Products_CategoryId",
                table: "Items",
                newName: "IX_Items_CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Products_AppUserId",
                table: "Items",
                newName: "IX_Items_AppUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Orders_CustomerId",
                table: "Receipts",
                newName: "IX_Receipts_CustomerId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderItems_ReceiptId",
                table: "ReceiptItems",
                newName: "IX_ReceiptItems_ReceiptId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderItems_ItemId",
                table: "ReceiptItems",
                newName: "IX_ReceiptItems_ItemId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Items",
                table: "Items",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Receipts",
                table: "Receipts",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ReceiptItems",
                table: "ReceiptItems",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Items_Categories_CategoryId",
                table: "Items",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Items_Users_AppUserId",
                table: "Items",
                column: "AppUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Items_Vendors_VendorId",
                table: "Items",
                column: "VendorId",
                principalTable: "Vendors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ReceiptItems_Items_ItemId",
                table: "ReceiptItems",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_ReceiptItems_Receipts_ReceiptId",
                table: "ReceiptItems",
                column: "ReceiptId",
                principalTable: "Receipts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Receipts_Customers_CustomerId",
                table: "Receipts",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id");
        }
    }
}
