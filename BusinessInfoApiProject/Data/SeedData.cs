using BusinessInfoApiProject.Models;
using Microsoft.AspNetCore.Identity;

namespace BusinessInfoApiProject.Data
{
    public class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider, UserManager<ApplicationUser> userManager)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            try
            {
                // Seed roles
                string[] roleNames = { "Admin", "User", "BusinessAdmin" };
                foreach (var roleName in roleNames)
                {
                    if (!await roleManager.RoleExistsAsync(roleName))
                    {
                        await roleManager.CreateAsync(new IdentityRole(roleName));
                    }
                }

                // Seed an admin user
                var adminUser = new ApplicationUser
                {
                    UserName = "businessInfo@email.com",
                    Email = "businessInfo@email.com",
                    FirstName = "Business",
                    LastName = "Info"
                };

                var user = await userManager.FindByEmailAsync(adminUser.Email);
                if (user == null)
                {
                    var createPowerUser = await userManager.CreateAsync(adminUser, "Admin@123");
                    if (createPowerUser.Succeeded)
                    {
                        await userManager.AddToRoleAsync(adminUser, "Admin");
                    }
                    else
                    {
                        // Log errors
                        foreach (var error in createPowerUser.Errors)
                        {
                            Console.WriteLine($"Error creating user: {error.Description}");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log exception
                Console.WriteLine($"Exception occurred while seeding: {ex.Message}");
            }
        }

    }
}
