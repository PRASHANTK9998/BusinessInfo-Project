using System.ComponentModel.DataAnnotations;

namespace BusinessInfoApiProject.DTOs.AddressDTO
{
    public class AddressDto
    {

        public int AddressId { get; set; }

        public string AddressLine1 { get; set; } = string.Empty;


        public string AddressLine2 { get; set; } = string.Empty;

 
        public string City { get; set; } = string.Empty;

        public string State { get; set; } = string.Empty;

        public string Country { get; set; } = string.Empty;


        public int  ZipCode { get; set; }


    }
}
