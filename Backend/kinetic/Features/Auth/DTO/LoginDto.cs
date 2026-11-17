using System.ComponentModel.DataAnnotations;

namespace Kinetic.Features.Users
{
    public class LoginUserDto
    {
        [Required]
        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        [StringLength(254)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(
            128,
            MinimumLength = 8,
            ErrorMessage = "Password must be between 8 and 128 characters.")]
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;

        public string RefreshToken { get; set; } = string.Empty;

        public UserDto User { get; set; } = default!;
    }
}