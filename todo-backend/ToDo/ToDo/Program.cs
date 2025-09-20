using Microsoft.AspNetCore.Builder;
using ConsoleCommands;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ToDo.Data;
using ToDo.Services;

namespace ToDo;

internal class Program
{
    public static void Main(string[] args)
    {
        Directory.CreateDirectory("db");

        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();
        builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
        builder.Services.AddScoped<AuthService>();

        builder.Services.AddAuthentication(Cookies.Identity)
            .AddCookie(Cookies.Identity, options =>
            {
                options.Cookie.Name = Cookies.Identity;
                options.ExpireTimeSpan = TimeSpan.FromDays(7);
                options.SlidingExpiration = true;
            });
        builder.Services.AddAuthorization();

        builder.Services.AddCors();

        var app = builder.Build();

        app.UseCors(x => x
            .AllowAnyMethod()
            .AllowAnyHeader()
            .SetIsOriginAllowed(_ => true)
            .AllowCredentials());
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers().RequireAuthorization();

        using (var scope = app.Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            context.Database.Migrate();
        }

        CC.ReadCommands(app.Services);

        app.Run();
    }
}