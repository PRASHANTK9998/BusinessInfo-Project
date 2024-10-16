using System.ComponentModel.DataAnnotations;

namespace BusinessInfoApiProject.DTOs.AddressDTO
{
    public class CreateAddressDto
    {
        [Required(ErrorMessage = "Street is required.")]
        [StringLength(100, ErrorMessage = "Street cannot exceed 100 characters.")]
        public string AddressLine1 { get; set; } = string.Empty;

        [StringLength(100, ErrorMessage = "Street cannot exceed 100 characters.")]
        public string AddressLine2 { get; set; } = string.Empty;

        [Required(ErrorMessage = "City is required.")]
        [StringLength(50, ErrorMessage = "City cannot exceed 50 characters.")]
        [RegularExpression(@"^[a-zA-Z]+$", ErrorMessage = "City can only contain letters.")]
        public string City { get; set; } = string.Empty;

        [Required(ErrorMessage = "State is required.")]
        [StringLength(50, ErrorMessage = "State cannot exceed 50 characters.")]
        [RegularExpression(@"^[a-zA-Z]+$", ErrorMessage = "State can only contain letters.")]
        public string State { get; set; } = string.Empty;

        [Required(ErrorMessage = "Country is required.")]
        [StringLength(50, ErrorMessage = "Country cannot exceed 50 characters.")]
        [RegularExpression(@"^[a-zA-Z]+$", ErrorMessage = "Country can only contain letters.")]
        public string Country { get; set; } = string.Empty;

        [Required(ErrorMessage = "ZipCode is required.")]
        [Range(100000, 999999, ErrorMessage = "ZipCode must be a valid 6-digit number.")]
        public int ZipCode { get; set; }


    }
}
