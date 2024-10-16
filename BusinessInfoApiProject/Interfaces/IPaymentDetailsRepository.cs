using BusinessInfoApiProject.DTOs.ContactUsDTO;
using PassportApplicationWebApi.Models;

namespace BusinessInfoApiProject.Interfaces
{
    public interface IPaymentDetailsRepository
    {
        Task<IEnumerable<PaymentDetails?>> GetAllPaymentDetailsAsync();
        Task<IEnumerable<PaymentDetailsOfLastMonthDtos>> GetPaymentDetailsWithBusinessInfo();
    }

  

}
