using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessInfoApiProject.Migrations
{
    /// <inheritdoc />
    public partial class updatedBusinessModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ContactedViaOurApp",
                table: "Businesses",
                newName: "views");

            migrationBuilder.AddColumn<int>(
                name: "BusinessStatus",
                table: "Businesses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsMostRated",
                table: "Businesses",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "message",
                table: "Businesses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BusinessStatus",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "IsMostRated",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "message",
                table: "Businesses");

            migrationBuilder.RenameColumn(
                name: "views",
                table: "Businesses",
                newName: "ContactedViaOurApp");
        }
    }
}
