namespace Kinetic.Features.Users
{
    public interface IPasswordService
    {
        string HashPassword(string Password);
        bool VerifyPassword(string Password, string PasswordHash);
    }
}