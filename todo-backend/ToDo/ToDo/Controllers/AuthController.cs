using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDo.Data;
using ToDo.Dtos;
using ToDo.Services;

namespace ToDo.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/auth")]
public class AuthController(AppDbContext context, AuthService authService) : ControllerBase
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

        await HttpContext.SignInAsync(new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())], Cookies.Identity)));
        return Ok();
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync();
        return Ok();
    }
}