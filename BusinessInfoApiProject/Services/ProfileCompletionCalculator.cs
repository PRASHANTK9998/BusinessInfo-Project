using BusinessInfoApiProject.Models;

namespace BusinessInfoApiProject.Services
{
   
        public class ProfileCompletionCalculator
        {
            public static int CalculateProfileCompletionPercentage(Business business)
            {
                // Define the total number of fields to check
                int totalFields = 11; // Number of fields to check for completion
                int filledFields = 0;

                // Check each field to see if it's filled
                if (!string.IsNullOrWhiteSpace(business.BusinessName)) filledFields++;
                if (!string.IsNullOrWhiteSpace(business.MobileNumber)) filledFields++;
                if (!string.IsNullOrWhiteSpace(business.Email)) filledFields++;
                if (!string.IsNullOrWhiteSpace(business.Website)) filledFields++;
                if (!string.IsNullOrWhiteSpace(business.ContactPersonName)) filledFields++;
                if (!string.IsNullOrWhiteSpace(business.ContactPersonPosition)) filledFields++;
                if (!string.IsNullOrWhiteSpace(business.BusinessDetails)) filledFields++;
                if (business.Address != null && !string.IsNullOrWhiteSpace(business.Address.AddressLine1)) filledFields++;
                if (business.BusinessCategoryId > 0) filledFields++;
                if (business.PaymentDetails != null) filledFields++;
                if (business.ProfileScore >= 0) filledFields++;

                // Calculate the percentage of completion
                int percentage = (filledFields * 100) / totalFields;

                return percentage;
            }
        }
}
