using BusinessInfoApiProject.Data;
using BusinessInfoApiProject.DTOs.ContactUsDTO;
using BusinessInfoApiProject.Interfaces;
using Microsoft.EntityFrameworkCore;
using PassportApplicationWebApi.Models;

namespace BusinessInfoApiProject.Repository
{
    public class PaymentDetailsRepository : IPaymentDetailsRepository
    {
        private readonly BusinessDbContext _context;

        public PaymentDetailsRepository(BusinessDbContext context)
        {
            _context = context;
        }


        public async Task<IEnumerable<PaymentDetails?>> GetAllPaymentDetailsAsync()
        {
           return await _context.PaymentDetails
                .Include(p => p.Business)
                .ToListAsync();
        }

        public async Task<IEnumerable<PaymentDetailsOfLastMonthDtos>> GetPaymentDetailsWithBusinessInfo()
        {
            var lastMonth = DateTime.Now.AddMonths(-1);

            var paymentDetails = await (from pd in _context.PaymentDetails
                                        join b in _context.Businesses on pd.BusinessId equals b.BusinessId
                                        where pd.PaymentDate >= lastMonth
                                        select new PaymentDetailsOfLastMonthDtos
                                        {
                                            Id = pd.Id,
                                            Email = pd.Email,
                                            TransactionNumber = pd.TransactionNumber,
                                            Amount = pd.Amount,
                                            PaymentDate = pd.PaymentDate,
                                            PaymentMethod = pd.PaymentMethod,
                                            PaymentDetails = pd.PaymentDetail,
                                            ApplicationNumber = pd.ApplicationNumber,
                                          
                                            BusinessName = b.BusinessName,
                                            GSTNo = b.GSTNo,
                                            BusinessEmail = b.Email
                                        }).ToListAsync();

            return paymentDetails;
        }

    }
}
