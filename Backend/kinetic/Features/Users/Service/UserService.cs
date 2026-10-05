
using Kinetic.Features.MongoDB;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Kinetic.Features.Users
{
    public class UserService
    {
        private readonly IMongoCollection<User> _collection;
        private readonly IPasswordService _passwordService;

        public UserService(MongoDbConfig dbConfig, IPasswordService passwordService)
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
                return null;

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
                throw new InvalidOperationException("Email is already registered.");

            var user = new User
            {
                Firstname = registerUserDto.Firstname,
                Lastname = registerUserDto.Lastname,
                Age = registerUserDto.Age,
                Number = registerUserDto.Number,
                Email = registerUserDto.Email,

                PasswordHash = _passwordService.HashPassword(registerUserDto.Password),

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

            bool passwordCorrect = _passwordService.VerifyPassword(loginUserDto.Password, user.PasswordHash);

            if (!passwordCorrect)
                return null;

            return user;
        }

        public async Task<User?> UpdateAsync(string id, UpdateUserDto updateDto)
        {
            if (!ObjectId.TryParse(id, out var userId))
                return null;

            var user = await _collection
                .Find(user => user.Id == userId)
                .FirstOrDefaultAsync();

            if (user == null)
                return null;

            user.Firstname = updateDto.Firstname;
            user.Lastname = updateDto.Lastname;
            user.Age = updateDto.Age;
            user.Number = updateDto.Number;
            user.Address = updateDto.Address;
            user.UpdatedAt = DateTime.UtcNow;

            await _collection.ReplaceOneAsync(user => user.Id == userId, user);

            return user;
        }
    }
}