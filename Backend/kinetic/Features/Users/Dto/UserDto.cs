using System.ComponentModel.DataAnnotations;

namespace Kinetic.Features.Users
{
    public class UserDto
    {
        public string? Id { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 2)]
        [RegularExpression(@"^[\p{L}][\p{L}\s'-]*$", ErrorMessage = "Firstname can contain only letters, spaces, hyphens, and apostrophes.")]
        public string Firstname { get; set; } = string.Empty;

        [Required]
        [StringLength(50, MinimumLength = 2)]
        [RegularExpression(@"^[\p{L}][\p{L}\s'-]*$", ErrorMessage = "Lastname can contain only letters, spaces, hyphens, and apostrophes.")]
        public string Lastname { get; set; } = string.Empty;

        [Range(13, 120, ErrorMessage = "Age must be between 13 and 120.")]
        public int Age { get; set; }

        [Required]
        [Phone(ErrorMessage = "Please enter a valid phone number.")]
        [StringLength(20, MinimumLength = 7)]
        public string Number { get; set; } = string.Empty;

        [StringLength(250, ErrorMessage = "Address cannot exceed 250 characters.")]
        public string Address { get; set; } = string.Empty;

        [Required]
        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        [StringLength(254)]
        public string Email { get; set; } = string.Empty;

        public UserRole Role { get; set; } = UserRole.User;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }

    public class RegisterUserDto
    {
        [Required]
        [StringLength(50, MinimumLength = 2)]
        [RegularExpression(@"^[\p{L}][\p{L}\s'-]*$", ErrorMessage = "Firstname can contain only letters, spaces, hyphens, and apostrophes.")]
        public string Firstname { get; set; } = string.Empty;

        [Required]
        [StringLength(50, MinimumLength = 2)]
        [RegularExpression(@"^[\p{L}][\p{L}\s'-]*$", ErrorMessage = "Lastname can contain only letters, spaces, hyphens, and apostrophes.")]
        public string Lastname { get; set; } = string.Empty;

        [Range(13, 120, ErrorMessage = "Age must be between 13 and 120.")]
        public int Age { get; set; }

        [Required]
        [Phone(ErrorMessage = "Please enter a valid phone number.")]
        [StringLength(20, MinimumLength = 7)]
        public string Number { get; set; } = string.Empty;

        [Required]
        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        [StringLength(254)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(128, MinimumLength = 8, ErrorMessage = "Password must be between 8 and 128 characters.")]
        [RegularExpression(
            @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s])\S+$",
            ErrorMessage = "Password must contain an uppercase letter, a lowercase letter, a number, and a special character. Spaces are not allowed."
        )]
        public string Password { get; set; } = string.Empty;
    }

    public class LoginUserDto
    {
        [Required]
        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        [StringLength(254)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(128, MinimumLength = 8, ErrorMessage = "Password must be between 8 and 128 characters.")]
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;

        public string RefreshToken { get; set; } = string.Empty;

        public UserDto User { get; set; } = default!;
    }

    public class UpdateUserDto
    {
        [Required]
        [StringLength(50, MinimumLength = 2)]
        [RegularExpression(@"^[\p{L}][\p{L}\s'-]*$", ErrorMessage = "Firstname can contain only letters, spaces, hyphens, and apostrophes.")]
        public string Firstname { get; set; } = string.Empty;

        [Required]
        [StringLength(50, MinimumLength = 2)]
        [RegularExpression(@"^[\p{L}][\p{L}\s'-]*$", ErrorMessage = "Lastname can contain only letters, spaces, hyphens, and apostrophes.")]
        public string Lastname { get; set; } = string.Empty;

        [Range(13, 120, ErrorMessage = "Age must be between 13 and 120.")]
        public int Age { get; set; }

        [Required]
        [Phone(ErrorMessage = "Please enter a valid phone number.")]
        [StringLength(20, MinimumLength = 7)]
        public string Number { get; set; } = string.Empty;

        [Required]
        [StringLength(250, ErrorMessage = "Address cannot exceed 250 characters.")]
        public string Address { get; set; } = string.Empty;
    }
}