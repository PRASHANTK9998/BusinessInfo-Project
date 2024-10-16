using System.ComponentModel.DataAnnotations;

namespace BusinessInfoApiProject.DTOs.ReviewDTO
{
    public class ReviewDto
    {
        
        public int Rating { get; set; }

        public string Comment { get; set; } = string.Empty;
        public string SenderEmail { get; set; } = string.Empty;

    }
}
