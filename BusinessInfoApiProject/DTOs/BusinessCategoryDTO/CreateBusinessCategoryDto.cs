using System.ComponentModel.DataAnnotations;

namespace BusinessInfoApiProject.DTOs.BusinessCategoryDTO
{
    public class CreateBusinessCategoryDto
    {

        [Required(ErrorMessage = "Category name is required.")]
        [StringLength(100, ErrorMessage = "Category name cannot exceed 100 characters.")]
        public string CategoryName { get; set; } = string.Empty;
    }
}
