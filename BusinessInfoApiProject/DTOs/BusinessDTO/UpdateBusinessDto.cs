using BusinessInfoApiProject.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using BusinessInfoApiProject.DTOs.BusinessProductDTO;
using BusinessInfoApiProject.DTOs.AddressDTO;

namespace BusinessInfoApiProject.DTOs.BusinessDTO
{
    public class UpdateBusinessDto
    {
        [Required(ErrorMessage = "Business name is required.")]
        [StringLength(100, ErrorMessage = "Business name cannot exceed 100 characters.")]
        public string BusinessName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mobile number is required.")]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Mobile number must be a valid 10-digit number.")]
        public string MobileNumber { get; set; } = string.Empty;

        [Required]
        public string GSTNo { get; set; } = string.Empty;

        [Url(ErrorMessage = "Website must be a valid URL.")]
        public string Website { get; set; } = string.Empty;

        [StringLength(100, ErrorMessage = "Contact person name cannot exceed 100 characters.")]
        public string ContactPersonName { get; set; } = string.Empty;

        [StringLength(100, ErrorMessage = "Contact person position cannot exceed 100 characters.")]
        public string ContactPersonPosition { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Business details cannot exceed 500 characters.")]
        public string BusinessDetails { get; set; } = string.Empty;

        [Required]
        public CreateAddressDto? AddressDto { get; set; }

        //[Required(ErrorMessage = "Business category is required.")]
        //public int BusinessCategoryId { get; set; }

        //public ICollection<int> BusinessProducts { get; set; } = new List<int>();

    }
}

