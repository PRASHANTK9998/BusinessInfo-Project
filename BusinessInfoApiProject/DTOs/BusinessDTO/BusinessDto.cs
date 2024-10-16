using BusinessInfoApiProject.DTOs.AddressDTO;
using BusinessInfoApiProject.DTOs.ProductDTO;
using BusinessInfoApiProject.DTOs.ReviewDTO;
using BusinessInfoApiProject.Models;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using System.ComponentModel.DataAnnotations;

namespace BusinessInfoApiProject.DTOs.BusinessDTO
{
    public class BusinessDto
    {
        public string BusinessName { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public string GSTNo { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string ContactPersonPosition { get; set; } = string.Empty;
        public string BusinessDetails { get; set; } = string.Empty;
        public AddressDto? AddressDTO { get; set; }
        public string BusinessCategoryName { get; set; } = string.Empty;
        public List<ProductDto> Products { get; set; } = new List<ProductDto>();

        public List<ReviewDto> Reviews { get; set; } = new List<ReviewDto>();

        public BusinessStatus BusinessStatus { get; set; }

        public string message { get; set; } = string.Empty;

        public long views  { get; set; }

        public bool IsMostVisited { get; set; }

        public bool IsMostRated { get; set; }

        [Required]
        public bool IsSponsored { get; set; }

        [Required]
        [Range(0, 100, ErrorMessage = "Profile score must be between 0 and 100.")]
        public int ProfileScore { get; set; }

        [Required]
        public DateTime LastUpdatedDate { get; set; }

    }
}
