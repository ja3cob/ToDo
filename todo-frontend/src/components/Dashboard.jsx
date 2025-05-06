import React, { useState, useEffect } from "react";
import api from "../util/api";

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [newTodoDate, setNewTodoDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchTodos = async () => {
    const token = localStorage.getItem("token");
    const response = await api.get("todos", {
      headers: { Authorization: `Bearer ${token}` },
      params: { date: selectedDate }
    });
    setTodos(response.data);
  };

  useEffect(() => {
    fetchTodos();
  }, [selectedDate]);

  const addTodo = async () => {
    const token = localStorage.getItem("token");
    await api.post(
      "todos",
      { text: newTodo, dueDate: newTodoDate },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewTodo("");
    fetchTodos();
  };

  const toggleDone = async (id) => {
    const token = localStorage.getItem("token");
    await api.put(`todos/${id}/done`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    if(confirm('Siur?') != true) {
      return;
    }

    const token = localStorage.getItem("token");
    await api.delete(`todos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTodos();
  }

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-3xl font-bold mb-6">Super To-Do App</h2>
      <div className="mb-6 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="New To-Do"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <input
          type="date"
          value={newTodoDate}
          onChange={e => setNewTodoDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={addTodo} className="bg-green-500 text-white p-2 rounded hover:bg-green-600">Add</button>
      </div>

      <h3 className="text-xl font-semibold mb-2">
        To-Dos for{" "}
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="border p-2 rounded mb-2"
        />
      </h3>
      <ul className="space-y-2 mb-6">
        {todos.filter(todo => !todo.isDone).map(todo => (
          <li key={todo.id} className="flex justify-between items-center border p-2 rounded">
            {todo.text}
            <div>
              <button onClick={() => toggleDone(todo.id)} className="bg-blue-500 text-white p-1 px-3 rounded hover:bg-blue-600 mr-1">Done</button>
              <button onClick={() => deleteTodo(todo.id)} className="bg-red-500 text-white p-1 px-3 rounded hover:bg-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mb-2">Done To-Dos</h3>
      <ul className="space-y-2">
        {todos.filter(todo => todo.isDone).map(todo => (
          <li key={todo.id} className="flex justify-between items-center border p-2 rounded">
            <span className="line-through text-gray-500">{todo.text}</span>
            <div>
              <button onClick={() => toggleDone(todo.id)} className="bg-green-500 text-white p-1 px-3 rounded hover:bg-green-600 mr-1">Undone</button>
              <button onClick={() => deleteTodo(todo.id)} className="bg-red-500 text-white p-1 px-3 rounded hover:bg-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;