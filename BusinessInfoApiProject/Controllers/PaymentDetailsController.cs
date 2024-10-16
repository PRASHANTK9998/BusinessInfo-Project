using AutoMapper;
using BusinessInfoApiProject.DTOs.ContactUsDTO;
using BusinessInfoApiProject.Interfaces;
using BusinessInfoApiProject.Models;
using Microsoft.AspNetCore.Mvc;
using PassportApplicationWebApi.DTOs.PaymentDetails;
using PassportApplicationWebApi.Interfaces;
using PassportApplicationWebApi.Models;


namespace PassportApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentDetailsController : ControllerBase
    {
        private readonly IRepository<PaymentDetails> _repository;
        private readonly IPaymentDetailsRepository _paymentDetailsRepository;
        private readonly IBusinessRepository _businessRepository;
        //private readonly ITransactionNumberGenerator _transactionNumberGenerator;
        private readonly IMapper _mapper;

        public PaymentDetailsController(IPaymentDetailsRepository paymentDetailsRepository,
            IRepository<PaymentDetails> repository,
            IBusinessRepository    businessRepository,
            IMapper mapper
            )
        {
            _repository = repository;
            _businessRepository = businessRepository;
            _mapper = mapper;
            _paymentDetailsRepository = paymentDetailsRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePaymentDetails([FromBody] CreatePaymentDetailsDto createPaymentDetailsDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Find the user by email
            var business
                = await _businessRepository.GetBusinessByEmailAsync(createPaymentDetailsDto.Email);
            if (business == null)
                return NotFound("User not found");


            // Map the DTO to the PaymentDetails entity
            var paymentDetails = _mapper.Map<PaymentDetails>(createPaymentDetailsDto);
            paymentDetails.BusinessId = business.BusinessId;
            paymentDetails.PaymentStatus = PaymentStatus.Completed;
            paymentDetails.TransactionNumber = Guid.NewGuid();

            // Add the PaymentDetails record to the database
            var paymentDetailsRecord = await _repository.AddAsync(paymentDetails);

            if(paymentDetailsRecord!= null)
                business.IsSponsored = true;

            await _businessRepository.UpdateAsync(business);

            return Ok("Payment details created successfully");
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPaymentDetails(int id)
        {
            var paymentDetails = await _repository.GetByIdAsync(id);
            if (paymentDetails == null)
                return NotFound();

            var paymentDetailsDto = _mapper.Map<PaymentDetailsDto>(paymentDetails);
            return Ok(paymentDetailsDto);
        }

        [HttpGet]
        public async Task<IActionResult> GetPaymentDetails()
        {
            var paymentDetails = await _paymentDetailsRepository.GetAllPaymentDetailsAsync();
            if(paymentDetails == null)
            {
                return NotFound("No payment details found");
            }


            return Ok(_mapper.Map<IEnumerable<PaymentDetailsDto>>(paymentDetails));
        }

        [HttpGet("GetPaymentDetailsOfLastMonth")]
        public async Task<ActionResult<IEnumerable<PaymentDetailsOfLastMonthDtos>>> GetPaymentDetailsWithBusinessInfo()
        {
            var result = await _paymentDetailsRepository.GetPaymentDetailsWithBusinessInfo();
            return Ok(result);
        }


    }

}
