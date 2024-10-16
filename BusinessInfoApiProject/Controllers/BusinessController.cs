using AutoMapper;
using BusinessInfoApiProject.DTOs.BusinessDTO;
using BusinessInfoApiProject.Interfaces;
using BusinessInfoApiProject.Models;
using BusinessInfoApiProject.Services;
using Microsoft.AspNetCore.Mvc;
using PassportApplicationWebApi.Interfaces;

namespace BusinessInfoApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessController : ControllerBase
    {
        public readonly IRepository<Business> _repository;
        private readonly IBusinessProductRepository _businessProductRepository;
        private readonly IBusinessRepository _businessRepository;
        public readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;

        public BusinessController(IRepository<Business> repository, IMapper mapper, IBusinessRepository businessRepository, IBusinessProductRepository businessProductRepository, IUserRepository userRepository)
        {
            _repository = repository;
            _mapper = mapper;
            _businessRepository = businessRepository;
            _businessProductRepository = businessProductRepository;
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var businesses = await _businessRepository.GetAllBusinessesAsync();
            if (businesses == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<IEnumerable<BusinessDto>>(businesses));
        }

        [HttpGet("activebusinesses")]
        public async Task<IActionResult> GetAllActiveBusinesses()
        {
            var businesses = await _businessRepository.GetAllActiveBusinessesAsync();
            if (businesses == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<IEnumerable<BusinessDto>>(businesses));
        }

        [HttpGet("newbusinesses")]
        public async Task<IActionResult> GetAllNewBusinesses()
        {
            var businesses = await _businessRepository.GetAllNewBusinessesAsync();

            if (businesses == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<IEnumerable<BusinessDto>>(businesses));
        }

        [HttpDelete("{email}")]
        public async Task<IActionResult> DeleteBusiness(string email)
        {

            var deletedBusiness = await _businessRepository.deleteBusinessAsync(email);

            if (deletedBusiness == null)
            {
                return NotFound();
            }

            return NoContent();
        }




        [HttpPost("{email}")]
        public async Task<IActionResult> Add(string email, CreateBusinessDto businessDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userRepository.GetUserByEmailAsync(email);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var businessEntity = _mapper.Map<Business>(businessDto);
            businessEntity.BusinessId = user.Id;

            if (businessDto.BusinessProducts != null)
            {
                // Adding BusinessProducts
                foreach (var productId in businessDto.BusinessProducts)
                {
                    businessEntity.BusinessProducts.Add(new BusinessProduct
                    {
                        ProductId = productId,
                        BusinessId = businessEntity.BusinessId
                    });
                }
            }

            businessEntity.ProfileScore = ProfileCompletionCalculator.CalculateProfileCompletionPercentage(businessEntity);
            businessEntity.LastUpdatedDate = DateTime.Now;
            businessEntity.BusinessStatus = BusinessStatus.New;
            businessEntity.views = 0;
            businessEntity.IsSponsored = false;
            var addedBusiness = await _repository.AddAsync(businessEntity);
            return Ok(_mapper.Map<BusinessDto>(addedBusiness)); // Return the addedBusiness);
        }

        [HttpGet("{email}")]
        public async Task<IActionResult> GetBusinessByEmail(string email)
        {
            // Retrieve the business by email
            var business = await _businessRepository.GetBusinessByEmailAsync(email);
            if (business == null)
            {
                return NotFound("Business not found");
            }

            // Map the business entity to the BusinessDto
            var businessDto = _mapper.Map<BusinessDto>(business);

            return Ok(businessDto);
        }


        [HttpGet("GetInactiveBusinessDetailReport")]
        public async Task<ActionResult<IEnumerable<LastSixMonthInactiveBusinessesReportDto>>> GetInactiveBusinessDetailReport(CancellationToken cancellationToken)
        {
            if (cancellationToken == null)
                return BadRequest("CancellationToken is required.");

            try
            {
                var result = await _businessRepository.GetInactiveBusinessDetailReport();
                return Ok(result);
            }
            catch (Exception ex)
            {
                // Log exception here
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("GetInactiveBusinessesBySponsershipStatus")]
        public async Task<ActionResult<IEnumerable<LastSixMonthInactiveBusinessesReportDto>>> GetBusinessesBySponsorStatus([FromQuery] bool? isSponsored, CancellationToken cancellationToken)
        {
            if (cancellationToken == null)
            {
                throw new ArgumentNullException(nameof(cancellationToken));
            }

            

            var result = await _businessRepository.GetBusinessesBySponsorStatus(isSponsored);
            return Ok(result);
        }

        [HttpPut("{email}")]
        public async Task<IActionResult> Update(string email, UpdateBusinessDto businessDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userRepository.GetUserByEmailAsync(email);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var existingBusiness = await _businessRepository.GetBusinessByEmailAsync(email);
            if (existingBusiness == null)
            {
                return NotFound("Business not found");
            }

            if(user.Email != existingBusiness.Email)
            {
                return BadRequest("Business email and register email should be same");
            }

            // Map the DTO to the existing Business entity
            _mapper.Map(businessDto, existingBusiness);
            existingBusiness.ProfileScore = ProfileCompletionCalculator.CalculateProfileCompletionPercentage(existingBusiness);
            existingBusiness.LastUpdatedDate = DateTime.Now;

            var updatedBusiness = await _businessRepository.UpdateAsync(existingBusiness);
            return Ok(updatedBusiness);

        }

        [HttpPut("updateStatus/{email}")]
        public async Task<IActionResult> UpdateBusinessStatus(string email, [FromQuery] BusinessStatus updatedBusinessStatus, [FromQuery] string? message)
        {

            var existingBusiness = await _businessRepository.GetBusinessByEmailAsync(email);
            if (existingBusiness == null)
            {
                return NotFound("Business not found");
            }
            existingBusiness.BusinessStatus = updatedBusinessStatus;
            existingBusiness.message = message;
            existingBusiness.LastUpdatedDate = DateTime.Now;

            var updatedBusiness = await _businessRepository.UpdateAsync(existingBusiness);
            return Ok(updatedBusiness);
        }


        [HttpGet("businessesbyresponsetype/{responseType}")]
        public async Task<IActionResult> GetSponsoredBusinessesOrMostVisitedOrMostRated(string responseType)
        {
            var businesses = await _businessRepository.GetSponsoredBusinessesOrMostVisitedOrMostRated(responseType);
            if (businesses == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<List<SponsoredBusinessDTO>>(businesses));
        }

        [HttpGet("highlyrated")]
        public async Task<ActionResult<IEnumerable<Business>>> GetHighlyRatedBusinesses()
        {
                var businesses = await _businessRepository.GetHighlyRatedBusinessesAsync(35);
                if (businesses == null || !businesses.Any())
                {
                    return NotFound("No businesses found with more than 35 ratings.");
                }

                return Ok(_mapper.Map<IEnumerable<BusinessDto>>(businesses));   
        }

        [HttpGet("increasecount/{email}")]
        public async Task<IActionResult> IncreaseCount(string email)
        {
            var business
                = await _businessRepository.GetBusinessByEmailAsync(email);
            if (business == null)
            {
                return NotFound("User not found");
            }
            business.views = business.views + 1;
            await _businessRepository.UpdateAsync(business);
            return Ok(_mapper.Map<BusinessDto>(business));
        }

        [HttpGet("markorunmarkasmostvisited/{email}")]
        public async Task<IActionResult> MarkOrUnmarkAsMostVisited(string email)
        {
            var business
                = await _businessRepository.GetBusinessByEmailAsync(email);
            if (business == null)
            {
                return NotFound("User not found");
            }

            if (business.IsMostVisited == true)
            {
                business.IsMostVisited = false;

            }
            else
            {
                business.IsMostVisited = true;
            }
            await _businessRepository.UpdateAsync(business);
            return Ok(_mapper.Map<BusinessDto>(business));
        }

        [HttpGet("markorunmarkasmostrated/{email}")]
        public async Task<IActionResult> MarkOrUnmarkAsMostRated(string email)
        {
            var business
                = await _businessRepository.GetBusinessByEmailAsync(email);
            if (business == null)
            {
                return NotFound("User not found");
            }

            if (business.IsMostRated == true)
            {
                business.IsMostRated = false;

            }
            else
            {
                business.IsMostRated = true;
            }
            await _businessRepository.UpdateAsync(business);
            return Ok(_mapper.Map<BusinessDto>(business));
        }


        [HttpGet("lowProfileScore")]
        public async Task<IActionResult> GetBusinessesWithLowProfileScoreInLastThreeMonths()
        {
            var businesses = await _businessRepository.GetBusinessesWithLowProfileScoreInLastThreeMonths();

            if (businesses == null || businesses.Count() == 0)
            {
                return NotFound("No businesses found with a profile score less than 70% in the last 3 months.");
            }

            return Ok(_mapper.Map<IEnumerable<BusinessDto>>(businesses)); // Return the list of businesses with a profile score less than 70% in the last 3 months.businesses);
        }

        [HttpGet("businessesPerCityPerCategory")]
        public async Task<IActionResult> GetBusinessesByCityAndCategory([FromQuery] string city, [FromQuery] int categoryId)
        {
            var businesses = await _businessRepository.GetBusinessesByCityAndCategory(city, categoryId);

            if (businesses == null || businesses.Count() == 0)
            {
                return NotFound("No businesses found for the given city and category.");
            }

            return Ok(_mapper.Map<IEnumerable<BusinessDto>>(businesses));
        }

    }
}

