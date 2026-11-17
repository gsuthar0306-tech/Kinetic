
using Kinetic.Features.MongoDB;
using Kinetic.Features.Users;
using Kinetic.Features.Addresses;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Kinetic.Features.Addresses.Service
{
    public class AddressService
    {
        private readonly IMongoCollection<User> _collection;

        public AddressService(MongoDbConfig dbConfig)
        {
            _collection = dbConfig.GetCollection<User>("users");
        }

        public async Task<List<UserAddress>?> GetAddressesAsync(
            string userId)
        {
            var user = await GetUserAsync(userId);

            return user == null ? null : user.Addresses;
        }

        public async Task<UserAddress?> AddAddressAsync(
            string userId,
            CreateUserAddressDto addressDto)
        {
            var user = await GetUserAsync(userId);

            if (user == null)
                return null;

            if (user.Addresses.Count >= 2)
            {
                throw new InvalidOperationException(
                    "You can save a maximum of two addresses.");
            }

            var address = new UserAddress
            {
                AddressId = Guid.NewGuid().ToString("N"),
                Label = addressDto.Label.Trim(),
                FullName = addressDto.FullName.Trim(),
                Phone = addressDto.Phone.Trim(),
                AddressLine1 = addressDto.AddressLine1.Trim(),
                AddressLine2 = addressDto.AddressLine2?.Trim(),
                City = addressDto.City.Trim(),
                State = addressDto.State.Trim(),
                PostalCode = addressDto.PostalCode.Trim(),
                Country = addressDto.Country.Trim(),
                IsDefault = user.Addresses.Count == 0
            };

            user.Addresses.Add(address);
            user.UpdatedAt = DateTime.UtcNow;

            await SaveUserAsync(user);

            return address;
        }

        public async Task<UserAddress?> UpdateAddressAsync(
            string userId,
            string addressId,
            UpdateUserAddressDto addressDto)
        {
            var user = await GetUserAsync(userId);

            if (user == null)
                return null;

            var address = user.Addresses.FirstOrDefault(
                existing => existing.AddressId == addressId);

            if (address == null)
                return null;

            address.Label = addressDto.Label.Trim();
            address.FullName = addressDto.FullName.Trim();
            address.Phone = addressDto.Phone.Trim();
            address.AddressLine1 = addressDto.AddressLine1.Trim();
            address.AddressLine2 = addressDto.AddressLine2?.Trim();
            address.City = addressDto.City.Trim();
            address.State = addressDto.State.Trim();
            address.PostalCode = addressDto.PostalCode.Trim();
            address.Country = addressDto.Country.Trim();

            user.UpdatedAt = DateTime.UtcNow;

            await SaveUserAsync(user);

            return address;
        }

        public async Task<bool> DeleteAddressAsync(
            string userId,
            string addressId)
        {
            var user = await GetUserAsync(userId);

            if (user == null)
                return false;

            var address = user.Addresses.FirstOrDefault(
                existing => existing.AddressId == addressId);

            if (address == null)
                return false;

            bool wasDefault = address.IsDefault;

            user.Addresses.Remove(address);

            if (wasDefault && user.Addresses.Count > 0)
            {
                user.Addresses[0].IsDefault = true;
            }

            user.UpdatedAt = DateTime.UtcNow;

            await SaveUserAsync(user);

            return true;
        }

        public async Task<bool> SetDefaultAddressAsync(
    string userId,
    string addressId)
        {
            var user = await GetUserAsync(userId);

            if (user == null)
                return false;

            var selectedAddress = user.Addresses.FirstOrDefault(
                address => address.AddressId == addressId);

            if (selectedAddress == null)
                return false;

            foreach (var address in user.Addresses)
            {
                address.IsDefault = address.AddressId == addressId;
            }

            user.UpdatedAt = DateTime.UtcNow;

            await SaveUserAsync(user);

            return true;
        }
        private async Task<User?> GetUserAsync(string userId)
        {
            if (!ObjectId.TryParse(userId, out var objectId))
                return null;

            return await _collection
                .Find(user => user.Id == objectId)
                .FirstOrDefaultAsync();
        }

        private async Task SaveUserAsync(User user)
        {
            await _collection.ReplaceOneAsync(
                existing => existing.Id == user.Id,
                user);
        }


    }
}
