using System.ComponentModel.DataAnnotations;

namespace BusinessInfoApiProject.Models
{
    public class BusinessCategory
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Category name is required.")]
        [StringLength(100, ErrorMessage = "Category name cannot exceed 100 characters.")]
        public string CategoryName { get; set; } = string.Empty;

        public ICollection<Business> Businesses { get; set; } =  new List<Business>();

        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
