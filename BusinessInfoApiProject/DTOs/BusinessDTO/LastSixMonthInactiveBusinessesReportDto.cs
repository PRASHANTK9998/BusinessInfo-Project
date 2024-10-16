using BusinessInfoApiProject.DTOs.AddressDTO;
using BusinessInfoApiProject.DTOs.ReviewDTO;
using PassportApplicationWebApi.DTOs.PaymentDetails;
using PassportApplicationWebApi.Models;

namespace BusinessInfoApiProject.DTOs.BusinessDTO
{
    public class LastSixMonthInactiveBusinessesReportDto
    {
        public string BusinessName { get; set; }
        public string Email { get; set; }
        public string GSTNo { get; set; }
        public string Website { get; set; }
        public string BusinessCategoryName { get; set; }
        public DateTime LastUpdatedDate { get; set; }
        public bool IsSponsored { get; set; }
        public Guid? TransactionNumber { get; set; }
        public decimal? Amount { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
    }
}
