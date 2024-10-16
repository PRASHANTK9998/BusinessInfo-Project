using BusinessInfoApiProject.Data;
using BusinessInfoApiProject.Interfaces;
using BusinessInfoApiProject.Models;
using Microsoft.EntityFrameworkCore;

namespace BusinessInfoApiProject.Repository
{
    public class BusinessProductRepository : IBusinessProductRepository
    {
        
        private readonly BusinessDbContext _context;
        public BusinessProductRepository(BusinessDbContext context)
        {
            _context = context;
        }
        public async Task<BusinessProduct> AddBusinessProductAsync(BusinessProduct businessProduct)
        {
            await _context.BusinessProducts.AddAsync(businessProduct);
            await _context.SaveChangesAsync();
            return businessProduct;
        }

        public async Task<BusinessProduct?> GetBusinessProductById(int id)
        {
          return  await _context.BusinessProducts.FirstOrDefaultAsync(b => b.BusinessProductId == id);
        }
    }
}
