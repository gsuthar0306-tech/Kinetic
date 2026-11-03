using System.ComponentModel.DataAnnotations;

namespace Kinetic.Features.Users
{
    public class CreateUserAddressDto
    {
        [Required]
        [StringLength(30, MinimumLength = 2)]
        public string Label { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [Phone]
        [StringLength(20, MinimumLength = 7)]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [StringLength(150, MinimumLength = 3)]
        public string AddressLine1 { get; set; } = string.Empty;

        [StringLength(150)]
        public string? AddressLine2 { get; set; }

        [Required]
        [StringLength(80, MinimumLength = 2)]
        public string City { get; set; } = string.Empty;

        [Required]
        [StringLength(80, MinimumLength = 2)]
        public string State { get; set; } = string.Empty;

        [Required]
        [StringLength(15, MinimumLength = 4)]
        public string PostalCode { get; set; } = string.Empty;

        [Required]
        [StringLength(80, MinimumLength = 2)]
        public string Country { get; set; } = "India";
    }

    public class UpdateUserAddressDto : CreateUserAddressDto
    {
    }
}