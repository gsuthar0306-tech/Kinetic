using Microsoft.AspNetCore.Identity;

namespace Kinetic.Features.Users
{
    public class PasswordService : IPasswordService
    {
        private readonly PasswordHasher<object> _passwordHasher;

        public PasswordService()
        {
            _passwordHasher = new PasswordHasher<object>();
        }

        public string HashPassword(string password)
        {
            return _passwordHasher.HashPassword(null!, password);
        }

        public bool VerifyPassword(string password, string PasswordHash)
        {
            var result = _passwordHasher.VerifyHashedPassword(
                null!,
                PasswordHash,
                password
            );

            return result == PasswordVerificationResult.Success;
        }

    }
}