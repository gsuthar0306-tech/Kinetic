using System.ComponentModel.DataAnnotations;

namespace Kinetic.Features.Users
{
    public class RegisterUserDto
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

        public string Address { get; set; } = string.Empty;

        [Required]
        [RegularExpression(
            @"^[6-9][0-9]{9}$",
            ErrorMessage = "Please enter a valid 10-digit Indian mobile number.")]
        [StringLength(10, MinimumLength = 10)]
        public string Number { get; set; } = string.Empty;

        [Required]
        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        [StringLength(254)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(
            128,
            MinimumLength = 8,
            ErrorMessage = "Password must be between 8 and 128 characters.")]
        [RegularExpression(
            @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s])\S+$",
            ErrorMessage = "Password must contain an uppercase letter, a lowercase letter, a number, and a special character. Spaces are not allowed.")]
        public string Password { get; set; } = string.Empty;
    }
}