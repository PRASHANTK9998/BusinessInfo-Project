using BusinessInfoApiProject.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using BusinessInfoApiProject.DTOs.BusinessCategoryDTO;


namespace BusinessInfoApiProject.DTOs.ProductDTO
{
    public class ProductDto
    {

        public int ProductId { get; set; }

        public string ProductName { get; set; } = string.Empty;

    }
}
