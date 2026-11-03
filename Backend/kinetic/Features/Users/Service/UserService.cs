using Kinetic.Features.MongoDB;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Kinetic.Features.Users
{
    public class UserService
    {
        private readonly IMongoCollection<User> _collection;
        private readonly IPasswordService _passwordService;

        public UserService(
            MongoDbConfig dbConfig,
            IPasswordService passwordService)
        {
            _collection = dbConfig.GetCollection<User>("users");
            _passwordService = passwordService;
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _collection
                .Find(static _ => true)
                .ToListAsync();
        }

        public async Task<User?> GetByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out var userId))
            {
                return null;
            }

            return await _collection
                .Find(user => user.Id == userId)
                .FirstOrDefaultAsync();
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _collection
                .Find(user => user.Email == email)
                .FirstOrDefaultAsync();
        }

        public async Task<User> RegisterAsync(RegisterUserDto registerUserDto)
        {
            var existingUser = await GetByEmailAsync(registerUserDto.Email);

            if (existingUser != null)
            {
                throw new InvalidOperationException(
                    "Email is already registered.");
            }

            var user = new User
            {
                Firstname = registerUserDto.Firstname,
                Lastname = registerUserDto.Lastname,
                Number = registerUserDto.Number,
                Email = registerUserDto.Email,

                // New users start with no saved addresses.
                Addresses = new List<UserAddress>(),

                PasswordHash = _passwordService.HashPassword(
                    registerUserDto.Password),

                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _collection.InsertOneAsync(user);

            return user;
        }

        public async Task<User?> LoginAsync(LoginUserDto loginUserDto)
        {
            var user = await GetByEmailAsync(loginUserDto.Email);

            if (user == null)
            {
                return null;
            }

            bool passwordCorrect = _passwordService.VerifyPassword(
                loginUserDto.Password,
                user.PasswordHash);

            if (!passwordCorrect)
            {
                return null;
            }

            return user;
        }

        public async Task<List<UserAddress>?> GetAddressesAsync(string userId)
        {
            var user = await GetByIdAsync(userId);

            if (user == null)
            {
                return null;
            }

            return user.Addresses;
        }

        public async Task<UserAddress?> AddAddressAsync(
            string userId,
            CreateUserAddressDto addressDto)
        {
            var user = await GetByIdAsync(userId);

            if (user == null)
            {
                return null;
            }

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

            await _collection.ReplaceOneAsync(
                existingUser => existingUser.Id == user.Id,
                user);

            return address;
        }

        public async Task<UserAddress?> UpdateAddressAsync(
            string userId,
            string addressId,
            UpdateUserAddressDto addressDto)
        {
            var user = await GetByIdAsync(userId);

            if (user == null)
            {
                return null;
            }

            var address = user.Addresses.FirstOrDefault(
                existingAddress => existingAddress.AddressId == addressId);

            if (address == null)
            {
                return null;
            }

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

            await _collection.ReplaceOneAsync(
                existingUser => existingUser.Id == user.Id,
                user);

            return address;
        }

        public async Task<bool> DeleteAddressAsync(
            string userId,
            string addressId)
        {
            var user = await GetByIdAsync(userId);

            if (user == null)
            {
                return false;
            }

            var address = user.Addresses.FirstOrDefault(
                existingAddress => existingAddress.AddressId == addressId);

            if (address == null)
            {
                return false;
            }

            bool wasDefault = address.IsDefault;

            user.Addresses.Remove(address);

            if (wasDefault && user.Addresses.Count > 0)
            {
                user.Addresses[0].IsDefault = true;
            }

            user.UpdatedAt = DateTime.UtcNow;

            await _collection.ReplaceOneAsync(
                existingUser => existingUser.Id == user.Id,
                user);

            return true;
        }

        public async Task<bool> SetDefaultAddressAsync(
            string userId,
            string addressId)
        {
            var user = await GetByIdAsync(userId);

            if (user == null)
            {
                return false;
            }

            var selectedAddress = user.Addresses.FirstOrDefault(
                address => address.AddressId == addressId);

            if (selectedAddress == null)
            {
                return false;
            }

            foreach (var address in user.Addresses)
            {
                address.IsDefault = address.AddressId == addressId;
            }

            user.UpdatedAt = DateTime.UtcNow;

            await _collection.ReplaceOneAsync(
                existingUser => existingUser.Id == user.Id,
                user);

            return true;
        }

        public async Task<User?> UpdateAsync(
            string id,
            UpdateUserDto updateDto)
        {
            if (!ObjectId.TryParse(id, out var userId))
            {
                return null;
            }

            var user = await _collection
                .Find(user => user.Id == userId)
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return null;
            }

            user.Firstname = updateDto.Firstname;
            user.Lastname = updateDto.Lastname;
            user.Number = updateDto.Number;
            user.UpdatedAt = DateTime.UtcNow;

            await _collection.ReplaceOneAsync(
                user => user.Id == userId,
                user);

            return user;
        }
    }
}