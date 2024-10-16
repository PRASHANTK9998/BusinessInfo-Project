using BusinessInfoApiProject.Interfaces;
using BusinessInfoApiProject.Models;
using Microsoft.AspNetCore.Identity;
using System.Diagnostics.Contracts;

namespace BusinessInfoApiProject.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UserRepository(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }
        public Task<ApplicationUser?> GetUserByEmailAsync(string email)
        {
          var user = _userManager.FindByEmailAsync(email);
            if(user == null)
            {
                return null;
            }

            return user;
        }
    }
}
