using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using SharpCompress.Compressors.ZStandard.Unsafe;
using Kinetic.Features.Users;

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

        [Authorize]
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

            Console.WriteLine("Done");
            return Ok(dtos);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetById(string id)
        {
            var user = await _service.GetByIdAsync(id);

            if (user == null)
                return NotFound($"User with id '{id}' not found.");

            return Ok(ToDto(user));
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> Create(
            [FromBody] RegisterUserDto registerDto)
        {
            if (User.Identity?.IsAuthenticated == true)
                return BadRequest("You are already logged in.");

            if (string.IsNullOrWhiteSpace(registerDto.Firstname))
                return BadRequest("Firstname is required.");

            if (string.IsNullOrWhiteSpace(registerDto.Lastname))
                return BadRequest("Lastname is required.");

            if (registerDto.Age <= 0)
                return BadRequest("Age must be greater than zero.");

            if (string.IsNullOrWhiteSpace(registerDto.Number))
                return BadRequest("Number is required.");

            if (string.IsNullOrWhiteSpace(registerDto.Email))
                return BadRequest("Email is required.");

            if (string.IsNullOrWhiteSpace(registerDto.Password))
                return BadRequest("Password is required.");

            try
            {
                var user = await _service.RegisterAsync(registerDto);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = user.Id.ToString() },
                    ToDto(user)
                );
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        // POST: api/Users/Login
        [HttpPost]
        public async Task<ActionResult<LoginResponseDto>> Login(
            [FromBody] LoginUserDto loginDto)
        {
            if (string.IsNullOrWhiteSpace(loginDto.Email))
                return BadRequest("Email is required.");

            if (string.IsNullOrWhiteSpace(loginDto.Password))
                return BadRequest("Password is required.");

            var user = await _service.LoginAsync(loginDto);

            if (user == null)
                return Unauthorized("Invalid email or password.");

            var token = _jwtService.GenerateToken(user);
            var refreshToken = _refreshTokenService.GenerateRefreshToken();
            await _refreshTokenService.CreateAsync(user.Id, refreshToken);

            return Ok(new LoginResponseDto
            {
                Token = token,
                RefreshToken = refreshToken,
                User = ToDto(user)
            });
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Updateuser(
            string id,
            [FromBody] UpdateUserDto updateDto
        )
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            if (userId != id)
                return Forbid();

            var user = await _service.UpdateAsync(id, updateDto);

            if (user == null)
                return NotFound($"User with id '{id}' not found.");

            return Ok(ToDto(user));
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenDto request)
        {
            if (string.IsNullOrWhiteSpace(request.RefreshToken))
                return BadRequest("Refresh token is required.");

            var storedToken = await _refreshTokenService.GetByTokenAsync(request.RefreshToken);

            if (storedToken == null
                || storedToken.RevokedAt != null
                || storedToken.ExpiresAt <= DateTime.UtcNow)
            {
                return Unauthorized("Invalid or expired refresh token.");
            }

            var user = await _service.GetByIdAsync(storedToken.UserId.ToString());

            if (user == null)
                return Unauthorized("Invalid refresh token.");

            await _refreshTokenService.RevokeAsync(storedToken);

            var newRefreshToken = _refreshTokenService.GenerateRefreshToken();
            await _refreshTokenService.CreateAsync(user.Id, newRefreshToken);

            return Ok(new LoginResponseDto
            {
                Token = _jwtService.GenerateToken(user),
                RefreshToken = newRefreshToken,
                User = ToDto(user)
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