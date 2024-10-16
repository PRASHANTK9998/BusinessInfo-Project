using System.ComponentModel.DataAnnotations;

namespace BusinessInfoApiProject.DTOs.BusinessCategoryDTO
{
    public class BusinessCategoryDto
    {

        public int Id { get; set; }
        public string CategoryName { get; set; } = string.Empty;
    }
}
