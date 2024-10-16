using PassportApplicationWebApi.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessInfoApiProject.Models
{
    public class Business
    {
        [Key]
        public string BusinessId { get; set; } = string.Empty;

        [Required(ErrorMessage = "Business name is required.")]
        [StringLength(100, ErrorMessage = "Business name cannot exceed 100 characters.")]
        public string BusinessName { get; set; } = string.Empty;


        [Required(ErrorMessage = "Mobile number is required.")]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Mobile number must be a valid 10-digit number.")]
        public string MobileNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string GSTNo { get; set; } = string.Empty;

        [Url(ErrorMessage = "Website must be a valid URL.")]
        public string? Website { get; set; } = string.Empty;


        [StringLength(100, ErrorMessage = "Contact person name cannot exceed 100 characters.")]
        public string? ContactPersonName { get; set; } = string.Empty;

        [StringLength(100, ErrorMessage = "Contact person position cannot exceed 100 characters.")]
        public string? ContactPersonPosition { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Business details cannot exceed 500 characters.")]
        public string? BusinessDetails { get; set; } = string.Empty;

        public Address? Address { get; set; }

        [Required(ErrorMessage = "Business category is required.")]
        public int BusinessCategoryId { get; set; }

        [ForeignKey("BusinessCategoryId")]
        public BusinessCategory? BusinessCategory { get; set; }

        public PaymentDetails? PaymentDetails { get; set; }

        public ApplicationUser? ApplicationUser { get; set; }

        public ICollection<Review> Reviews { get; set; } = new List<Review>();

        public ICollection<BusinessProduct?> BusinessProducts { get; set; } = new List<BusinessProduct>();

        public bool IsMostVisited { get; set; }

        public bool IsMostRated { get; set; }

        public long views { get; set; }

        public BusinessStatus BusinessStatus { get; set; }

        public string? message { get; set; } = string.Empty;

        [Required]
        public bool IsSponsored { get; set; }

        [Required]
        [Range(0, 100, ErrorMessage = "Profile score must be between 0 and 100.")]
        public int ProfileScore { get; set; }

        [Required]
        public DateTime LastUpdatedDate { get; set; }

    }

    public enum BusinessStatus
    {
        New,
        Active,
        TemporaryClosed,
        PermanentClosed,
        Rejected,
        Inactive
    }
}
