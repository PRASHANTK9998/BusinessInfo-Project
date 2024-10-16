using BusinessInfoApiProject.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class Product
{
    [Key]
    public int ProductId { get; set; }

    [Required(ErrorMessage = "Product name is required.")]
    [StringLength(100, ErrorMessage = "Product name cannot exceed 100 characters.")]
    public string ProductName { get; set; } = string.Empty;

    [Required]
    public int CategoryId { get; set; }
    [ForeignKey("CategoryId")]
    public BusinessCategory? Category { get; set; }

    public ICollection<BusinessProduct?> BusinessProducts { get; set; } = new List<BusinessProduct>();
}