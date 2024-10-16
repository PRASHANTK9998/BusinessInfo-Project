using AutoMapper;
using BusinessInfoApiProject.DTOs.ReviewDTO;
using BusinessInfoApiProject.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PassportApplicationWebApi.Interfaces;

namespace BusinessInfoApiProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {

        private readonly IRepository<Review> _repository; 
        private readonly IBusinessRepository _businessRepository;
        private readonly IMapper _mapper;

        public ReviewController(IRepository<Review> repository, IMapper mapper, IBusinessRepository businessRepository)
        {
            _repository = repository;
            _mapper = mapper;
            _businessRepository = businessRepository;
        }
        [HttpPost]
        public async Task<IActionResult> Add(CreateReviewDto reviewDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Fetch the business using the email
            var business = await _businessRepository.GetBusinessByEmailAsync(reviewDto.BusinessEmail);
            if (business == null)
            {
                return NotFound("Business not found");
            }

            // Map the reviewDto to the Review entity
            var review = _mapper.Map<Review>(reviewDto);

            // Assign the correct BusinessId
            review.Business = business;

            try
            {
                // Add the review to the repository
                var addedReview = await _repository.AddAsync(review);
                if (addedReview != null)
                {
                    return Ok(_mapper.Map<ReviewDto>(addedReview));
                }
                else
                {
                    return BadRequest("Failed to add review");
                }
            }
            catch (DbUpdateException ex)
            {
                // Handle the DbUpdateException specifically
                return StatusCode(500, $"An error occurred while saving the review: {ex.InnerException?.Message ?? ex.Message}");
            }
        }


        [HttpPost("add-multiple-reviews")]
        public async Task<IActionResult> AddMultiple(IEnumerable<CreateReviewDto> reviewDtos)
        {
            if (reviewDtos == null || !reviewDtos.Any())
            {
                return BadRequest("No reviews provided.");
            }

            List<ReviewDto> addedReviews = new List<ReviewDto>();

            foreach (var reviewDto in reviewDtos)
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Fetch the business using the email
                var business = await _businessRepository.GetBusinessByEmailAsync(reviewDto.BusinessEmail);
                if (business == null)
                {
                    return NotFound($"Business not found for email: {reviewDto.BusinessEmail}");
                }

                // Map the reviewDto to the Review entity
                var review = _mapper.Map<Review>(reviewDto);

                // Assign the correct BusinessId
                review.Business = business;

                try
                {
                    // Add the review to the repository
                    var addedReview = await _repository.AddAsync(review);
                    if (addedReview != null)
                    {
                        addedReviews.Add(_mapper.Map<ReviewDto>(addedReview));
                    }
                    else
                    {
                        return BadRequest($"Failed to add review for business: {reviewDto.BusinessEmail}");
                    }
                }
                catch (DbUpdateException ex)
                {
                    // Handle the DbUpdateException specifically
                    return StatusCode(500, $"An error occurred while saving the review for {reviewDto.BusinessEmail}: {ex.InnerException?.Message ?? ex.Message}");
                }
            }

            return Ok(addedReviews);
        }


    }
}
