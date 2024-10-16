using BusinessInfoApiProject.Data;
using BusinessInfoApiProject.DTOs.BusinessDTO;
using BusinessInfoApiProject.Interfaces;
using BusinessInfoApiProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading;

namespace BusinessInfoApiProject.Repository
{
    public class BusinessRepository : IBusinessRepository
    {
        private readonly BusinessDbContext _context;

public BusinessRepository(BusinessDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Business>> GetAllBusinessesAsync()
        {
           return await _context.Businesses
                .Include(b => b.Address)
                .Include(b => b.BusinessCategory)
                .Include(b=> b.Reviews)
                .Include(b => b.BusinessProducts)
                .ThenInclude(bp => bp.Product)
                .ToListAsync();
        }

        public async Task<IEnumerable<Business>> GetAllActiveBusinessesAsync()
        {
            return await _context.Businesses
                 .Include(b => b.Address)
                 .Include(b => b.BusinessCategory)
                 .Include(b => b.Reviews)
                 .Include(b => b.BusinessProducts)
                 .ThenInclude(bp => bp.Product)
                 .Where(b => b.BusinessStatus == BusinessStatus.Active)
                 .ToListAsync();
        }

        public async Task<IEnumerable<Business>> GetAllNewBusinessesAsync()
        {
            return await _context.Businesses
                 .Include(b => b.Address)
                 .Include(b => b.BusinessCategory)
                 .Include(b => b.Reviews)
                 .Include(b => b.BusinessProducts)
                 .ThenInclude(bp => bp.Product)
                 .Where(b => b.BusinessStatus == BusinessStatus.New || b.BusinessStatus == BusinessStatus.Inactive)
                 .ToListAsync();
        }


        public async Task<Business?> deleteBusinessAsync(string email)
        {
            var business = await _context.Businesses
                .Include(b => b.Reviews) // Include related entities if needed
                .Include(b => b.BusinessProducts) // Include related entities if needed
                .FirstOrDefaultAsync(b => b.Email.Equals(email));

            if (business == null)
            {
                // Return a 404 if the business was not found
                return null;
            }

            // Remove the business from the database
            _context.Businesses.Remove(business);
            await _context.SaveChangesAsync();
            return business;
        }

        public async Task<Business?> GetBusinessByEmailAsync(string email)
        {
            return await _context.Businesses
                .Include(b => b.Address)
                .Include(b => b.BusinessCategory)
                .Include(b => b.Reviews) // Include related Reviews if needed
                .Include(b => b.BusinessProducts)
                    .ThenInclude(bp => bp.Product) // Include related Product details
                .FirstOrDefaultAsync(b => b.Email.Equals(email));
        }

        public async Task<Business?> UpdateAsync(Business updatedBusiness)
        {
            // Load the existing business from the database
            var existingBusiness = await _context.Businesses
                .Include(b => b.Address)
                .Include(b => b.BusinessProducts)
                .FirstOrDefaultAsync(b => b.BusinessId == updatedBusiness.BusinessId);

            if (existingBusiness == null)
            {
                return null;
            }

            // Update properties of the existing business
            _context.Entry(existingBusiness).CurrentValues.SetValues(updatedBusiness);

            // Update Address
            if (updatedBusiness.Address != null)
            {
                if (existingBusiness.Address == null)
                {
                    existingBusiness.Address = updatedBusiness.Address;
                }
                else
                {
                    _context.Entry(existingBusiness.Address).CurrentValues.SetValues(updatedBusiness.Address);
                }
            }
            else
            {
                existingBusiness.Address = null;
            }

            //// Handle BusinessProducts
            //var existingProductIds = existingBusiness.BusinessProducts.Select(bp => bp.ProductId).ToList();
            //var newProductIds = updatedBusiness.BusinessProducts.Select(bp => bp.ProductId).ToList();

            //var productsToRemove = existingBusiness.BusinessProducts
            //    .Where(bp => !newProductIds.Contains(bp.ProductId))
            //    .ToList();

            //_context.BusinessProducts.RemoveRange(productsToRemove);

            //foreach (var productId in newProductIds)
            //{
            //    if (!existingProductIds.Contains(productId))
            //    {
            //        existingBusiness.BusinessProducts.Add(new BusinessProduct
            //        {
            //            ProductId = productId,
            //            BusinessId = existingBusiness.BusinessId
            //        });
            //    }
            //}

            // Save changes
            await _context.SaveChangesAsync();
            return existingBusiness;
        }

        public async Task<IEnumerable<Business?>> GetHighlyRatedBusinessesAsync(int minimumUniqueUserCount)
        {
            return await _context.Businesses
                .Include(b => b.Address)
                .Include(b => b.BusinessCategory)
                .Include(b => b.Reviews)
                .Include(b => b.PaymentDetails)
                .Where(b => b.Reviews
                    //.GroupBy(r => r.SenderEmail)
                    //.Select(g => g.Key)
                    .Count() > minimumUniqueUserCount)
                .ToListAsync();
        }

        public async Task<IEnumerable<LastSixMonthInactiveBusinessesReportDto>> GetInactiveBusinessDetailReport()
        {
            var sixMonthsAgo = DateTime.Now.AddMonths(-6);

            var inactiveBusinessReport = await (from b in _context.Businesses
                                                join bc in _context.BusinessCategories on b.BusinessCategoryId equals bc.Id
                                                where b.BusinessStatus == BusinessStatus.Inactive && b.LastUpdatedDate >= sixMonthsAgo
                                                select new LastSixMonthInactiveBusinessesReportDto
                                                {
                                                    BusinessName = b.BusinessName,
                                                    Email = b.Email,
                                                    GSTNo = b.GSTNo,
                                                    Website = b.Website,
                                                    BusinessCategoryName = bc.CategoryName,
                                                    LastUpdatedDate = b.LastUpdatedDate,
                                                    IsSponsored = b.IsSponsored,
                                                    TransactionNumber = _context.PaymentDetails.Where(pd => pd.BusinessId == b.BusinessId).Select(pd => pd.TransactionNumber).FirstOrDefault(),
                                                    Amount = _context.PaymentDetails.Where(pd => pd.BusinessId == b.BusinessId).Select(pd => pd.Amount).FirstOrDefault(),
                                                    PaymentStatus = _context.PaymentDetails.Where(pd => pd.BusinessId == b.BusinessId).Select(pd => pd.PaymentStatus).FirstOrDefault()
                                                }).ToListAsync();


            return inactiveBusinessReport;
        }

        public async Task<IEnumerable<LastSixMonthInactiveBusinessesReportDto>> GetBusinessesBySponsorStatus(bool? isSponsored)
        {
            try
            {
                if (false == false)
                {
                    Console.WriteLine("in ffdsfdsfd");
                }
                var sixMonthsAgo = DateTime.Now.AddMonths(-6);
                var businesses = await _context.Businesses
                .Where(b => b.IsSponsored == isSponsored && b.BusinessStatus == BusinessStatus.Inactive)
                .Join(_context.BusinessCategories, b => b.BusinessCategoryId, bc => bc.Id, (b, bc) => new { b, bc })
                .Join(_context.PaymentDetails, b_bc => b_bc.b.BusinessId, pd => pd.BusinessId, (b_bc, pd) => new LastSixMonthInactiveBusinessesReportDto
                {
                    BusinessName = b_bc.b.BusinessName,
                    Email = b_bc.b.Email,
                    GSTNo = b_bc.b.GSTNo,
                    Website = b_bc.b.Website,
                    BusinessCategoryName = b_bc.bc.CategoryName,
                    LastUpdatedDate = b_bc.b.LastUpdatedDate,
                    IsSponsored = b_bc.b.IsSponsored,
                    TransactionNumber = pd.TransactionNumber,
                    Amount = pd.Amount,
                    PaymentStatus = pd.PaymentStatus
                })
                .ToListAsync();

                return businesses;
            }
            catch (Exception ex)
            {
                // Log exception
                throw new ApplicationException("An error occurred while retrieving businesses by sponsor status.", ex);
            }
        }


        public async Task<IEnumerable<Business?>> GetSponsoredBusinessesOrMostVisitedOrMostRated(string responseType)
        {
            switch (responseType)
            {
                case "SponsoredBusinesses":
                    return await _context.Businesses
                        .Include(b => b.BusinessCategory)
                        .Include(b => b.PaymentDetails)
                        .Include(b => b.Address)
                        .Where(b => b.IsSponsored == true && b.BusinessStatus == BusinessStatus.Active)
                        .ToListAsync();

                case "MostVisited":
                    return await _context.Businesses
                        .Include(b => b.BusinessCategory)
                        .Include(b => b.Address)
                        .Where(b => b.IsMostVisited == true && b.BusinessStatus == BusinessStatus.Active)
                        .ToListAsync();

                case "MostRated":
                    return await _context.Businesses
                        .Include(b => b.BusinessCategory)
                        .Include(b => b.Address)
                        .Where(b => b.IsMostRated == true && b.BusinessStatus == BusinessStatus.Active)
                        .ToListAsync();

                default:
                    // Handle the case when responseType does not match any of the known cases
                    // Returning an empty list or throw an exception based on the requirement
                    return Enumerable.Empty<Business?>(); // or throw new ArgumentException("Invalid response type.");
            }
        }


        public async Task<IEnumerable<Business?>> GetBusinessesWithLowProfileScoreInLastThreeMonths()
        {
            DateTime threeMonthsAgo = DateTime.Now.AddMonths(-3);

            var businesses = await _context.Businesses
                .Include(b=> b.Address)
                .Include(b => b.BusinessCategory)
                .Where(b => b.ProfileScore < 70 && b.LastUpdatedDate >= threeMonthsAgo)
                .ToListAsync();

            return businesses;
        }

        public async Task<IEnumerable<Business?>> GetBusinessesByCityAndCategory(string city, int categoryId)
        {
            var businesses =await _context.Businesses
                .Include(b => b.Address)
                .Include(b => b.BusinessCategory)
                .Where(b => b.Address.City == city && b.BusinessCategoryId == categoryId)
                .ToListAsync();

            return businesses;
        }

    }
}
