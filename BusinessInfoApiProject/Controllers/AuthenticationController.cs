using BusinessInfoApiProject.Data;
using BusinessInfoApiProject.DTOs.AuthDTO;
using BusinessInfoApiProject.HelperClass;
using BusinessInfoApiProject.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace PassportApplicationWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly JwtTokenHelper _jwtTokenHelper;
        private readonly BusinessDbContext _passportContext;

        public AuthenticationController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, JwtTokenHelper jwtTokenHelper, BusinessDbContext passportContext)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtTokenHelper = jwtTokenHelper;
            _passportContext = passportContext;
        }

        [HttpGet("checkUserNameExists")]
        public async Task<IActionResult> CheckUserNameExists([FromQuery]string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user != null)
            {
                return Ok(new { Message = "User already exists" });
            }

            return NotFound(new { Message = "User does not exist" });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new ApplicationUser
            {
                UserName = registerDto.Email,
                Email = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                PhoneNumber = registerDto.MobileNumber,
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                // Assign Role according to selection of Role
                if (registerDto.IsBusinessAdmin)
                {
                    await _userManager.AddToRoleAsync(user, "BusinessAdmin");
                }
                else
                {
                    await _userManager.AddToRoleAsync(user, "User");
                }
               


                return Ok(new { Message = "User registered successfully" });
            }

            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null)
            {
                return Unauthorized("User does not exist !");
            }

            var result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, false, lockoutOnFailure:true);

            if (result.Succeeded)
            {
                var token = await _jwtTokenHelper.GenerateToken(user);
                return Ok(new { Token = token });
            }
            else if(result.IsLockedOut)
            {
                return StatusCode(StatusCodes.Status403Forbidden, "Account is Locked. Please try again later");
            }
            else {
                return Unauthorized("Invalid login Attempt");
            }
           
        }
    }

}

