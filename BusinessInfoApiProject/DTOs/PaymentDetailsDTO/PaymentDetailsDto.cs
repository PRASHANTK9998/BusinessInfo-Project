using PassportApplicationWebApi.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using BusinessInfoApiProject.DTOs.BusinessDTO;

namespace PassportApplicationWebApi.DTOs.PaymentDetails
{
    public class PaymentDetailsDto
    {
        public int Id { get; set; }
        public string Email { get; set; }  = string.Empty;
        public Guid TransactionNumber { get; set; }
        public decimal Amount { get; set; }
        public string ApplicationNumber { get; set; } = string.Empty;
        public DateTime PaymentDate { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string PaymentDetail { get; set; } = string.Empty;
        public PaymentStatus PaymentStatus { get; set; }

        public BusinessDto? BusinessDto { get; set; }
    }
}
