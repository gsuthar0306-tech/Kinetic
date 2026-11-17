
using Kinetic.Features.Users;
using Microsoft.AspNetCore.Mvc;
using Kinetic.Features.Auth.Service;

namespace Kinetic.Features.Auth.Controller
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly JwtService _jwtService;
        private readonly RefreshTokenService _refreshTokenService;

        public AuthController(
            AuthService authService,
            JwtService jwtService,
            RefreshTokenService refreshTokenService)
        {
            _authService = authService;
            _jwtService = jwtService;
            _refreshTokenService = refreshTokenService;
        }

        private CookieOptions AccessCookieOptions()
        {
            return new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Lax,
                Path = "/",
                Expires = DateTimeOffset.UtcNow.AddHours(1)
            };
        }

        private CookieOptions RefreshCookieOptions()
        {
            return new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Lax,
                Path = "/",
                Expires = DateTimeOffset.UtcNow.AddDays(30)
            };
        }

        private void SetAuthCookies(
            string accessToken,
            string refreshToken)
        {
            Response.Cookies.Append(
                "kinetic_access_token",
                accessToken,
                AccessCookieOptions());

            Response.Cookies.Append(
                "kinetic_refresh_token",
                refreshToken,
                RefreshCookieOptions());
        }

        private void ClearAuthCookies()
        {
            var options = new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Lax,
                Path = "/"
            };

            Response.Cookies.Delete("kinetic_access_token", options);
            Response.Cookies.Delete("kinetic_refresh_token", options);
        }

        [HttpPost]
        public async Task<IActionResult> Register(
            [FromBody] RegisterUserDto registerDto)
        {
            if (User.Identity?.IsAuthenticated == true)
                return BadRequest("You are already logged in.");

            if (string.IsNullOrWhiteSpace(registerDto.Firstname))
                return BadRequest("Firstname is required.");

            if (string.IsNullOrWhiteSpace(registerDto.Lastname))
                return BadRequest("Lastname is required.");

            if (string.IsNullOrWhiteSpace(registerDto.Number))
                return BadRequest("Number is required.");

            if (string.IsNullOrWhiteSpace(registerDto.Email))
                return BadRequest("Email is required.");

            if (string.IsNullOrWhiteSpace(registerDto.Password))
                return BadRequest("Password is required.");

            try
            {
                var user = await _authService.RegisterAsync(registerDto);

                return Ok(new
                {
                    User = ToDto(user)
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Login(
            [FromBody] LoginUserDto loginDto)
        {
            if (string.IsNullOrWhiteSpace(loginDto.Email))
                return BadRequest("Email is required.");

            if (string.IsNullOrWhiteSpace(loginDto.Password))
                return BadRequest("Password is required.");

            var user = await _authService.LoginAsync(loginDto);

            if (user == null)
                return Unauthorized("Invalid email or password.");

            var accessToken = _jwtService.GenerateToken(user);
            var refreshToken = _refreshTokenService.GenerateRefreshToken();

            await _refreshTokenService.CreateAsync(
                user.Id,
                refreshToken);

            SetAuthCookies(accessToken, refreshToken);

            return Ok(new
            {
                User = ToDto(user)
            });
        }

        [HttpPost]
        public async Task<IActionResult> Refresh()
        {
            var refreshToken = Request.Cookies["kinetic_refresh_token"];

            if (string.IsNullOrWhiteSpace(refreshToken))
                return Unauthorized("Refresh token is missing.");

            var storedToken =
                await _refreshTokenService.GetByTokenAsync(refreshToken);

            if (storedToken == null
                || storedToken.RevokedAt != null
                || storedToken.ExpiresAt <= DateTime.UtcNow)
            {
                ClearAuthCookies();
                return Unauthorized("Invalid or expired refresh token.");
            }

            var user = await _authService.GetUserByIdAsync(
                storedToken.UserId.ToString());

            if (user == null)
            {
                ClearAuthCookies();
                return Unauthorized("Invalid refresh token.");
            }

            await _refreshTokenService.RevokeAsync(storedToken);

            var newAccessToken = _jwtService.GenerateToken(user);
            var newRefreshToken = _refreshTokenService.GenerateRefreshToken();

            await _refreshTokenService.CreateAsync(
                user.Id,
                newRefreshToken);

            SetAuthCookies(newAccessToken, newRefreshToken);

            return Ok(new
            {
                User = ToDto(user)
            });
        }

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["kinetic_refresh_token"];

            if (!string.IsNullOrWhiteSpace(refreshToken))
            {
                var storedToken =
                    await _refreshTokenService.GetByTokenAsync(refreshToken);

                if (storedToken != null && storedToken.RevokedAt == null)
                {
                    await _refreshTokenService.RevokeAsync(storedToken);
                }
            }

            ClearAuthCookies();

            return Ok(new
            {
                Message = "Logged out successfully."
            });
        }

        private static UserDto ToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id.ToString(),
                Firstname = user.Firstname,
                Lastname = user.Lastname,
                Address = user.Address,
                Number = user.Number,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }
    }
}
