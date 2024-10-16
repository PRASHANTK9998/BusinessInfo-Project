using BusinessInfoApiProject.Models;
using Microsoft.AspNetCore.Mvc;

namespace BusinessInfoApiProject.Interfaces
{
    public interface IUserRepository
    {
        Task<ApplicationUser?> GetUserByEmailAsync(string email);
    }
}
