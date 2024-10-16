using BusinessInfoApiProject.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class Review
{
    [Key]
    public int ReviewId { get; set; }

    [Required]
    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
    public int Rating { get; set; }

    [StringLength(1000, ErrorMessage = "Comment cannot exceed 1000 characters.")]
    public string Comment { get; set; } = string.Empty;

    [Required]
    public string BusinessId { get; set; } = string.Empty;

    [ForeignKey("BusinessId")]
    public Business? Business { get; set; }

    [Required(ErrorMessage = "Sender email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email address.")]
    public string SenderEmail { get; set; } = string.Empty;
}