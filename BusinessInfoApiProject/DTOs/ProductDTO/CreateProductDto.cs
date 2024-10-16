using System.ComponentModel.DataAnnotations;

namespace BusinessInfoApiProject.DTOs.ProductDTO
{
    public class CreateProductDto
    {
        [Required(ErrorMessage = "Product name is required.")]
        [StringLength(100, ErrorMessage = "Product name cannot exceed 100 characters.")]
        public string ProductName { get; set; } = string.Empty;

        [Required]
        public int CategoryId { get; set; }
    }
}
