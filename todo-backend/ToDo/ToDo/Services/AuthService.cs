using System.Security.Cryptography;
using System.Text;
using ToDo.Data;
using ToDo.Dtos;
using ToDo.Models;

namespace ToDo.Services;

public class AuthService(AppDbContext context)
{
    public bool Register(RegisterDto dto)
    {
        if (context.Users.Any(u => u.Username == dto.Username))
        {
            return false;
        }

        using var hmac = new HMACSHA512();
        var user = new User
        {
            Username = dto.Username,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password)),
            PasswordSalt = hmac.Key
        };

        context.Users.Add(user);
        context.SaveChanges();
        return true;
    }
}