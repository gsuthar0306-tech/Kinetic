
using Kinetic.Features.Users;

namespace Kinetic.Features.Auth.Service
{
    public class AuthService
    {
        private readonly UserService _userService;
        private readonly IPasswordService _passwordService;

        public AuthService(
            UserService userService,
            IPasswordService passwordService)
        {
            _userService = userService;
            _passwordService = passwordService;
        }

        public async Task<User> RegisterAsync(RegisterUserDto registerDto)
        {
            var existingUser = await _userService.GetByEmailAsync(
                registerDto.Email);

            if (existingUser != null)
            {
                throw new InvalidOperationException(
                    "Email is already registered.");
            }

            var user = new User
            {
                Firstname = registerDto.Firstname,
                Lastname = registerDto.Lastname,
                Address = string.Empty,
                Addresses = new List<UserAddress>(),
                Number = registerDto.Number,
                Email = registerDto.Email,
                PasswordHash = _passwordService.HashPassword(
                    registerDto.Password),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            return await _userService.CreateAsync(user);
        }

        public async Task<User?> LoginAsync(LoginUserDto loginDto)
        {
            var user = await _userService.GetByEmailAsync(
                loginDto.Email);

            if (user == null)
                return null;

            bool passwordCorrect = _passwordService.VerifyPassword(
                loginDto.Password,
                user.PasswordHash);

            return passwordCorrect ? user : null;
        }
        public async Task<User?> GetUserByIdAsync(string userId)
        {
            return await _userService.GetByIdAsync(userId);
        }
    }
}
