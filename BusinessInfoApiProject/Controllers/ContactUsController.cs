using AutoMapper;
using BusinessInfoApiProject.DTOs.ContactUsDTO;
using BusinessInfoApiProject.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PassportApplicationWebApi.Interfaces;

namespace BusinessInfoApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactUsController : ControllerBase
    {
        public readonly IRepository<ContactUs> _repository;
        private readonly IMapper _mapper;
        public ContactUsController(IRepository<ContactUs> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        [HttpPost]
        public async Task<IActionResult> Add(CreateContactUsDto contactUsDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var contactUs = _mapper.Map<ContactUs>(contactUsDto);

            var addedContactUs = await _repository.AddAsync(contactUs);

            if (addedContactUs != null)
            {
                return CreatedAtAction(nameof(Add), new { id = addedContactUs.ContactUsId }, addedContactUs);
            }

            return BadRequest("Unable to add contact");
        }


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var contactUsList = await _repository.GetAllAsync();
            var contactUsDtos = _mapper.Map<IEnumerable<CreateContactUsDto>>(contactUsList);
            return Ok(contactUsDtos);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var contactUs = await _repository.GetByIdAsync(id);
            if (contactUs == null)
            {
                return NotFound();
            }
           await _repository.DeleteAsync(contactUs);
            return NoContent();
        }
    }
    
}
