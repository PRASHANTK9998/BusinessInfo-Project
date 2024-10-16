

using AutoMapper;
using BusinessInfoApiProject.DTOs.AddressDTO;
using BusinessInfoApiProject.DTOs.BusinessCategoryDTO;
using BusinessInfoApiProject.DTOs.BusinessDTO;
using BusinessInfoApiProject.DTOs.BusinessProductDTO;
using BusinessInfoApiProject.DTOs.ContactUsDTO;
using BusinessInfoApiProject.DTOs.ProductDTO;
using BusinessInfoApiProject.DTOs.ReviewDTO;
using BusinessInfoApiProject.Models;
using PassportApplicationWebApi.DTOs.PaymentDetails;
using PassportApplicationWebApi.Models;

namespace PassportApplicationWebApi.Mappers
{
    public class AutoMapper : Profile
    {
        public AutoMapper()
        {
            CreateMap<Address, AddressDto>().ReverseMap();
            CreateMap<Address, CreateAddressDto>().ReverseMap();
            CreateMap<PaymentDetails, PaymentDetailsDto>()
            .ForMember(dest => dest.BusinessDto, opt => opt.MapFrom(src => src.Business))
            .ReverseMap();
            CreateMap<PaymentDetails, CreatePaymentDetailsDto>().ReverseMap();
            CreateMap<BusinessCategory, BusinessCategoryDto>().ReverseMap();
            CreateMap<BusinessCategory, CreateBusinessCategoryDto>().ReverseMap();
            CreateMap<Product, ProductDto>()
            //.ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category))
            .ReverseMap();
            CreateMap<Product, CreateProductDto>().ReverseMap();
            CreateMap<Review, ReviewDto>().ReverseMap();
            CreateMap<Review, CreateReviewDto>().ReverseMap();
            CreateMap<BusinessProduct, CreateBusinessProductDto>().ReverseMap();
            CreateMap<CreateBusinessDto, Business>()
           .ForMember(dest => dest.BusinessProducts, opt => opt.Ignore())
           .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.AddressDto));
            //CreateMap<Business, CreateBusinessDto>()
            // .ForMember(dest => dest.AddressDto, opt => opt.MapFrom(src => src.Address))
            // .ReverseMap()
            // .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.AddressDto));

            CreateMap<Business, BusinessDto>()
                .ForMember(dest => dest.AddressDTO, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.BusinessCategoryName, opt => opt.MapFrom(src => src.BusinessCategory.CategoryName))
                .ForMember(dest => dest.Products, opt => opt.MapFrom(src => src.BusinessProducts.Select(bp => bp.Product)));

            CreateMap<Product, ProductDto>();
            CreateMap<Business, SponsoredBusinessDTO>()
            .ForMember(dest => dest.PaymentDetails, opt => opt.MapFrom(src => src.PaymentDetails))
            .ForMember(dest => dest.AddressDTO, opt => opt.MapFrom(src => src.Address))
            .ForMember(dest => dest.BusinessCategoryName, opt => opt.MapFrom(src => src.BusinessCategory.CategoryName));

            CreateMap<Business, UpdateBusinessDto>()
                 .ForMember(dest => dest.AddressDto, opt => opt.MapFrom(src => src.Address))
                 .ReverseMap()
                 .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.AddressDto));
            CreateMap<ContactUs, CreateContactUsDto>().ReverseMap();



        }
    }
}
