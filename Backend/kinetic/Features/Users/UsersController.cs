
using Kinetic.Features.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Kinetic.Features.Users
{
    [ApiController]
    [Route("api/[controller]/[Action]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _service;
        private readonly JwtService _jwtService;
        private readonly RefreshTokenService _refreshTokenService;

        public UsersController(
            UserService service,
            JwtService jwtService,
            RefreshTokenService refreshTokenService)
        {
            _service = service;
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

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<List<UserDto>>> GetAll()
        {
            var users = await _service.GetAllAsync();

            var dtos = users.Select(static user => new UserDto
            {
                Id = user.Id.ToString(),
                Firstname = user.Firstname,
                Lastname = user.Lastname,
                Age = user.Age,
                Number = user.Number,
                Address = user.Address,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            }).ToList();

            return Ok(dtos);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetById(string id)
        {
            var user = await _service.GetByIdAsync(id);

            if (user == null)
            {
                return NotFound($"User with id '{id}' not found.");
            }

            return Ok(ToDto(user));
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> Create(
            [FromBody] RegisterUserDto registerDto)
        {
            if (User.Identity?.IsAuthenticated == true)
            {
                return BadRequest("You are already logged in.");
            }

            if (string.IsNullOrWhiteSpace(registerDto.Firstname))
            {
                return BadRequest("Firstname is required.");
            }

            if (string.IsNullOrWhiteSpace(registerDto.Lastname))
            {
                return BadRequest("Lastname is required.");
            }

            if (registerDto.Age <= 0)
            {
                return BadRequest("Age must be greater than zero.");
            }

            if (string.IsNullOrWhiteSpace(registerDto.Number))
            {
                return BadRequest("Number is required.");
            }

            if (string.IsNullOrWhiteSpace(registerDto.Email))
            {
                return BadRequest("Email is required.");
            }

            if (string.IsNullOrWhiteSpace(registerDto.Password))
            {
                return BadRequest("Password is required.");
            }

            try
            {
                var user = await _service.RegisterAsync(registerDto);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = user.Id.ToString() },
                    ToDto(user));
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
            {
                return BadRequest("Email is required.");
            }

            if (string.IsNullOrWhiteSpace(loginDto.Password))
            {
                return BadRequest("Password is required.");
            }

            var user = await _service.LoginAsync(loginDto);

            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            var accessToken = _jwtService.GenerateToken(user);
            var refreshToken = _refreshTokenService.GenerateRefreshToken();

            await _refreshTokenService.CreateAsync(user.Id, refreshToken);

            SetAuthCookies(accessToken, refreshToken);

            return Ok(new
            {
                User = ToDto(user)
            });
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Updateuser(
            string id,
            [FromBody] UpdateUserDto updateDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Unauthorized();
            }

            if (userId != id)
            {
                return Forbid();
            }

            var user = await _service.UpdateAsync(id, updateDto);

            if (user == null)
            {
                return NotFound($"User with id '{id}' not found.");
            }

            return Ok(ToDto(user));
        }

        [HttpPost]
        public async Task<IActionResult> Refresh()
        {
            var refreshToken = Request.Cookies["kinetic_refresh_token"];

            if (string.IsNullOrWhiteSpace(refreshToken))
            {
                return Unauthorized("Refresh token is missing.");
            }

            var storedToken =
                await _refreshTokenService.GetByTokenAsync(refreshToken);

            if (storedToken == null
                || storedToken.RevokedAt != null
                || storedToken.ExpiresAt <= DateTime.UtcNow)
            {
                ClearAuthCookies();
                return Unauthorized("Invalid or expired refresh token.");
            }

            var user = await _service.GetByIdAsync(
                storedToken.UserId.ToString());

            if (user == null)
            {
                ClearAuthCookies();
                return Unauthorized("Invalid refresh token.");
            }

            await _refreshTokenService.RevokeAsync(storedToken);

            var newAccessToken = _jwtService.GenerateToken(user);
            var newRefreshToken = _refreshTokenService.GenerateRefreshToken();

            await _refreshTokenService.CreateAsync(user.Id, newRefreshToken);

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
                Age = user.Age,
                Number = user.Number,
                Address = user.Address,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }
    }
}
