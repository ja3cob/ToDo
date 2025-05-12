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

    private void SetUndoneTodosDateToToday(int userId)
    {
        foreach (var todo in context.ToDos.Where(p => p.UserId == userId && p.DueDate.Date < DateTime.Now.Date))
        {
            todo.DueDate = DateTime.Now.Date;
        }

        context.SaveChanges();
    }

    [HttpGet]
    public async Task<IActionResult> GetTodos([FromQuery] DateTime? date)
    {
        int userId = GetUserId();
        SetUndoneTodosDateToToday(userId);

        var query = context.ToDos.Where(t => t.UserId == userId);
        if (date != null)
        {
            var dayStart = date.Value.Date;
            var dayEnd = dayStart.AddDays(1);
            query = query.Where(t => t.DueDate >= dayStart && t.DueDate < dayEnd);
        }

        return Ok(await query.ToListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> AddTodo(ToDoDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Text))
        {
            return BadRequest();
        }

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
    public async Task<IActionResult> ToggleDone(int id)
    {
        var todo = await context.ToDos.FindAsync(id);
        if (todo == null || todo.UserId != GetUserId())
        {
            return NotFound();
        }

        todo.IsDone = !todo.IsDone;
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