using BusinessInfoApiProject.DTOs.AddressDTO;
using BusinessInfoApiProject.DTOs.ReviewDTO;
using PassportApplicationWebApi.DTOs.PaymentDetails;

namespace BusinessInfoApiProject.DTOs.BusinessDTO
{
    public class SponsoredBusinessDTO
    {
        public string BusinessId { get; set; } = string.Empty;
        public string BusinessName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string GSTNo { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string ContactPersonName { get; set; } = string.Empty;
        public string ContactPersonPosition { get; set; } = string.Empty;
        public string BusinessCategoryName { get; set; } = string.Empty;
        public string BusinessDetails { get; set; } = string.Empty;
        public DateTime LastUpdatedDate { get; set; }
        public bool IsSponsored { get; set; }

        public AddressDto AddressDTO { get; set; } = new AddressDto();

        public ReviewDto ReviewsDTO { get; set; } = new ReviewDto();

        public PaymentDetailsDto PaymentDetails { get; set; } = new PaymentDetailsDto();
    }
}
