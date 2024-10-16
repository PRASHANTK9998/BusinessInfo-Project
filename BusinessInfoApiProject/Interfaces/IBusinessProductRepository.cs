using BusinessInfoApiProject.Models;

namespace BusinessInfoApiProject.Interfaces
{
    public interface IBusinessProductRepository
    {
        Task<BusinessProduct?> GetBusinessProductById(int id);
        Task<BusinessProduct>AddBusinessProductAsync(BusinessProduct businessProduct);
    }
}
