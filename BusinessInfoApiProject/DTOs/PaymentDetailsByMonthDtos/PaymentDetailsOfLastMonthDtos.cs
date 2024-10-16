
namespace BusinessInfoApiProject.DTOs.ContactUsDTO
{
    public class PaymentDetailsOfLastMonthDtos
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public Guid TransactionNumber { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentDetails { get; set; }
        public string ApplicationNumber { get; set; }
        public int PaymentStatus { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string BusinessName { get; set; }
        public string GSTNo { get; set; }
        public string BusinessEmail { get; set; }
    }
}
