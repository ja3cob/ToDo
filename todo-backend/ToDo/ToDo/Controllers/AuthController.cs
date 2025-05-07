using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDo.Data;
using ToDo.Dtos;
using ToDo.Services;

namespace ToDo.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AppDbContext context, JwtService jwt, AuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public IActionResult Register(RegisterDto dto)
    {
        return NotFound();
        if (authService.Register(dto))
        {
            return Ok();
        }

        return BadRequest();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);
        if (user == null)
        {
            return Unauthorized();
        }

        using var hmac = new HMACSHA512(user.PasswordSalt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password));
        if (!computedHash.SequenceEqual(user.PasswordHash))
        {
            return Unauthorized();
        }

        var token = jwt.GenerateToken(user);
        return Ok(new { token });
    }
}