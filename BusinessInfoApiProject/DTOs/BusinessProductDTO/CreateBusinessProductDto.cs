using System.ComponentModel.DataAnnotations;

namespace BusinessInfoApiProject.DTOs.BusinessProductDTO
{
    public class CreateBusinessProductDto
    {
        public int BusinessProductId { get; set; }
        [Required]
        public int ProductId { get; set; }
        [Required]
        public string BusinessId { get; set; } = string.Empty;
    }
}
