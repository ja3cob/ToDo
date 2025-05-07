using ConsoleCommands;
using Microsoft.Extensions.DependencyInjection;
using ToDo.Dtos;
using ToDo.Services;

namespace ToDo.Commands;

internal class AddUser : CommandBase
{
    public override string Syntax => base.Syntax + " <username> <password>";
    public override string Description => "add a new user";

    public override string Execute(IServiceProvider provider, string[] args)
    {
        if (args.Length != 2)
        {
            return Usage;
        }

        using var scope = provider.CreateScope();
        var service = scope.ServiceProvider.GetService<AuthService>();
        if (service == null)
        {
            return "error";
        }

        return service.Register(new RegisterDto
        {
            Username = args[0],
            Password = args[1],
        })
            ? "success"
            : "error";
    }
}