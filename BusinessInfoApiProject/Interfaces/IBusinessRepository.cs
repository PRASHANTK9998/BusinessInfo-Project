using BusinessInfoApiProject.DTOs.BusinessDTO;
using BusinessInfoApiProject.Models;

namespace BusinessInfoApiProject.Interfaces
{
    public interface IBusinessRepository
    {
        Task<IEnumerable<Business>> GetAllBusinessesAsync();
        Task<IEnumerable<Business>> GetAllActiveBusinessesAsync();
        Task<IEnumerable<Business>> GetAllNewBusinessesAsync();
        Task<Business?> deleteBusinessAsync(string email);

        Task<Business?> GetBusinessByEmailAsync(string email);

        Task<Business?> UpdateAsync(Business updatedBusiness);
        Task<IEnumerable<Business?>> GetSponsoredBusinessesOrMostVisitedOrMostRated(string responseType);
        Task<IEnumerable<Business?>> GetBusinessesWithLowProfileScoreInLastThreeMonths();
        Task<IEnumerable<Business?>> GetBusinessesByCityAndCategory(string city, int categoryId);
        Task<IEnumerable<Business?>> GetHighlyRatedBusinessesAsync(int minimumReviewCount);
        Task<IEnumerable<LastSixMonthInactiveBusinessesReportDto>> GetInactiveBusinessDetailReport();
        Task<IEnumerable<LastSixMonthInactiveBusinessesReportDto>> GetBusinessesBySponsorStatus(bool? isSponsored);
    }
}
