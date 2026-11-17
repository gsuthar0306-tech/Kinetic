
using Kinetic.Features.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Kinetic.Features.Users
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _service;

        public UsersController(UserService service)
        {
            _service = service;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<List<UserDto>>> GetAll()
        {
            var users = await _service.GetAllAsync();

            var dtos = users.Select(user => new UserDto
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

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserWithOrders(string id)
        {
            var user = await _service.GetUserWithOrdersAsync(id);

            if (user == null)
            {
                return NotFound($"User with id '{id}' not found.");
            }

            return Ok(user);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Updateuser(
            string id,
            [FromBody] UpdateUserDto updateDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
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
