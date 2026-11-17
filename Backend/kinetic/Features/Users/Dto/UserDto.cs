using System.ComponentModel.DataAnnotations;

namespace Kinetic.Features.Users
{
    public class UserDto
    {
        public string? Id { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 2)]
        [RegularExpression(
            @"^[\p{L}][\p{L}\s'-]*$",
            ErrorMessage = "Firstname can contain only letters, spaces, hyphens, and apostrophes.")]
        public string Firstname { get; set; } = string.Empty;

        [Required]
        [StringLength(50, MinimumLength = 2)]
        [RegularExpression(
            @"^[\p{L}][\p{L}\s'-]*$",
            ErrorMessage = "Lastname can contain only letters, spaces, hyphens, and apostrophes.")]
        public string Lastname { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        [Required]
        [Phone(ErrorMessage = "Please enter a valid phone number.")]
        [StringLength(20, MinimumLength = 7)]
        public string Number { get; set; } = string.Empty;

        [Required]
        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        [StringLength(254)]
        public string Email { get; set; } = string.Empty;

        public UserRole Role { get; set; } = UserRole.User;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }




    public class UpdateUserDto
    {
        [Required]
        [StringLength(50, MinimumLength = 2)]
        [RegularExpression(
            @"^[\p{L}][\p{L}\s'-]*$",
            ErrorMessage = "Firstname can contain only letters, spaces, hyphens, and apostrophes.")]
        public string Firstname { get; set; } = string.Empty;

        [Required]
        [StringLength(50, MinimumLength = 2)]
        [RegularExpression(
            @"^[\p{L}][\p{L}\s'-]*$",
            ErrorMessage = "Lastname can contain only letters, spaces, hyphens, and apostrophes.")]
        public string Lastname { get; set; } = string.Empty;

        [Required]
        [RegularExpression(
            @"^[6-9][0-9]{9}$",
            ErrorMessage = "Please enter a valid 10-digit Indian mobile number.")]
        [StringLength(10, MinimumLength = 10)]
        public string Number { get; set; } = string.Empty;
    }
}
