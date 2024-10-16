using AutoMapper;
using BusinessInfoApiProject.DTOs.BusinessCategoryDTO;
using BusinessInfoApiProject.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PassportApplicationWebApi.Interfaces;

namespace BusinessInfoApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessCategoryController : ControllerBase
    {
        public readonly IRepository<BusinessCategory> _repository;
        private readonly IMapper _mapper;
        public BusinessCategoryController(IRepository<BusinessCategory> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _repository.GetAllAsync();
            if(categories == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<IEnumerable<BusinessCategoryDto>>(categories));
        }

        [HttpPost]
        public async Task<IActionResult> Add(CreateBusinessCategoryDto businessCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var addedCategory = await _repository.AddAsync(_mapper.Map<BusinessCategory>(businessCategory));

            if(addedCategory == null)
            {
                return BadRequest();
            }

            return Ok(_mapper.Map<BusinessCategoryDto>(addedCategory));
        }

        [HttpPut("{categoryId}")]
        public async Task<IActionResult> Update(int categoryId, CreateBusinessCategoryDto businessCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var businessCategoryToUpdate = await _repository.GetByIdAsync(categoryId);

            if (businessCategoryToUpdate == null)
            {
                return NotFound();
            }

            return Ok(await _repository.UpdateAsync(_mapper.Map<BusinessCategory>(businessCategory)));

        }

        [HttpDelete("{categoryId}")]
        public async Task<IActionResult> Delete(int categoryId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var businessCategoryToDelete = await _repository.GetByIdAsync(categoryId);

            if (businessCategoryToDelete == null)
            {
                return NotFound();
            }
            await _repository.DeleteAsync(businessCategoryToDelete);

            return NoContent();
        }
    }
}

