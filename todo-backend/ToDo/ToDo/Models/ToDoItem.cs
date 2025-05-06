namespace ToDo.Models;

public class ToDoItem
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public bool IsDone { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
}