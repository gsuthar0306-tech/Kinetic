using Kinetic.Features.Users;
using Kinetic.Features.Addresses;
using Kinetic.Features.Addresses.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Kinetic.Features.Addresses.Controller
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class AddressesController : ControllerBase
    {
        private readonly AddressService _addressService;

        public AddressesController(AddressService addressService)
        {
            _addressService = addressService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetMyAddresses()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            var addresses = await _addressService.GetAddressesAsync(userId);

            if (addresses == null)
                return NotFound("User not found.");

            return Ok(addresses);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddAddress(
            [FromBody] CreateUserAddressDto addressDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            try
            {
                var address = await _addressService.AddAddressAsync(
                    userId,
                    addressDto);

                if (address == null)
                    return NotFound("User not found.");

                return Ok(address);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        [Authorize]
        [HttpPut("{addressId}")]
        public async Task<IActionResult> UpdateAddress(
            string addressId,
            [FromBody] UpdateUserAddressDto addressDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            var address = await _addressService.UpdateAddressAsync(
                userId,
                addressId,
                addressDto);

            if (address == null)
                return NotFound("Address not found.");

            return Ok(address);
        }

        [Authorize]
        [HttpDelete("{addressId}")]
        public async Task<IActionResult> DeleteAddress(string addressId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            var deleted = await _addressService.DeleteAddressAsync(
                userId,
                addressId);

            if (!deleted)
                return NotFound("Address not found.");

            return Ok(new
            {
                Message = "Address deleted successfully."
            });
        }

        [Authorize]
        [HttpPatch("{addressId}")]
        public async Task<IActionResult> SetDefaultAddress(string addressId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            var updated = await _addressService.SetDefaultAddressAsync(
                userId,
                addressId);

            if (!updated)
                return NotFound("Address not found.");

            return Ok(new
            {
                Message = "Default address updated successfully."
            });
        }
    }
}
