using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using ToDo.Data;
using ToDo.Dtos;
using ToDo.Models;

namespace ToDo.Controllers;

[Authorize]
[ApiController]
[Route("api/todos")]
public class ToDosController(AppDbContext context) : ControllerBase
{
    private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

    [HttpGet]
    public async Task<IActionResult> GetTodos()
    {
        var userId = GetUserId();
        var todos = await context.ToDos.Where(t => t.UserId == userId).ToListAsync();
        return Ok(todos);
    }

    [HttpPost]
    public async Task<IActionResult> AddTodo(ToDoDto dto)
    {
        var userId = GetUserId();
        var todo = new ToDoItem
        {
            Text = dto.Text,
            DueDate = dto.DueDate,
            IsDone = false,
            UserId = userId
        };
        context.ToDos.Add(todo);
        await context.SaveChangesAsync();
        return Ok();
    }

    [HttpPut("{id:int}/done")]
    public async Task<IActionResult> MarkDone(int id)
    {
        var todo = await context.ToDos.FindAsync(id);
        if (todo == null || todo.UserId != GetUserId())
        {
            return NotFound();
        }

        todo.IsDone = true;
        await context.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var todo = await context.ToDos.FindAsync(id);
        if (todo == null || todo.UserId != GetUserId())
        {
            return NotFound();
        }

        context.ToDos.Remove(todo);
        await context.SaveChangesAsync();
        return Ok();
    }
}