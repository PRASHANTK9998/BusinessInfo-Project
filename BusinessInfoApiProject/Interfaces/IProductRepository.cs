

namespace PassportApplicationWebApi.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product?>> GetAllProductsAsync();
        Task<Product?> GetProductByIdAsync(int productId);

    }
}
