using BusinessInfoApiProject.Data;
using Microsoft.EntityFrameworkCore;
using PassportApplicationWebApi.Interfaces;

namespace PassportApplicationWebApi.Repositories
{
    public class ProductRepository : IProductRepository
    {
        public readonly BusinessDbContext _context;

        public ProductRepository(BusinessDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return await _context.Products.Include(p => p.Category).ToListAsync();
        }

        public async Task<Product?> GetProductByIdAsync(int productId)
        {
           return await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.ProductId == productId);
        }

        //public async Task<User?> GetByEmailAsync(string email)
        //{
        //    return await _context.Users.FirstOrDefaultAsync(user => user.Email.Equals(email));
        //}
    }
}
