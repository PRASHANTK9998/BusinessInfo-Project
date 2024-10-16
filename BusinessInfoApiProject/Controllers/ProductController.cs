using AutoMapper;
using BusinessInfoApiProject.DTOs.ProductDTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PassportApplicationWebApi.Interfaces;

namespace BusinessInfoApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        public readonly IRepository<Product> _repository;
        public readonly IProductRepository _productRepo;
        public readonly IMapper _mapper;
        public ProductController(IRepository<Product> repository, IMapper mapper, IProductRepository productRepo)
        {
            _repository = repository;
            _mapper = mapper;
            _productRepo = productRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productRepo.GetAllProductsAsync();
            if (products == null)
            {
                return NotFound();
            };

            return Ok(_mapper.Map<IEnumerable<ProductDto>>(products));
        }

        [HttpPost]
        public async Task<IActionResult> Add(CreateProductDto product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var addedProduct = await _repository.AddAsync(_mapper.Map<Product>(product));

            if (addedProduct == null)
            {
                return BadRequest();
            }

            return Ok(_mapper.Map<ProductDto>(addedProduct));
        }

        [HttpGet("{productId}")]
        public async Task<IActionResult> GetById(int productId)
        {
            var product = await _productRepo.GetProductByIdAsync(productId);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<ProductDto>(product));
        }

        [HttpPut("{productId}")]
        public async Task<IActionResult> Update(int productId, CreateProductDto product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var productToUpdate = await _repository.GetByIdAsync(productId);
            if (productToUpdate == null)
            {
                return NotFound();
            }

            return Ok(await _repository.UpdateAsync(_mapper.Map<Product>(product)));
        }

        [HttpDelete("{productId}")]
        public async Task<IActionResult> Delete(int productId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var productToDelete = await _repository.GetByIdAsync(productId);
            if (productToDelete == null)
            {
                return NotFound();
            }
            await _repository.DeleteAsync(productToDelete);
            return NoContent();
        }

    }
}
