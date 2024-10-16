using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessInfoApiProject.Models
{
    public class BusinessProduct
    {
        [Key]
        public int BusinessProductId { get; set; }
      
        public int? ProductId { get; set; }
        [ForeignKey("ProductId")]
        public Product? Product { get; set; }

        public string? BusinessId { get; set; } = string.Empty;
        [ForeignKey("BusinessId")]
        public Business? Business { get; set; }
    }
}
