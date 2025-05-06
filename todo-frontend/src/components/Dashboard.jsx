import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [date, setDate] = useState("");

  const fetchTodos = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:5000/api/todos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTodos(response.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:5000/api/todos",
      { text: newTodo, dueDate: date },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewTodo("");
    setDate("");
    fetchTodos();
  };

  const markDone = async (id) => {
    const token = localStorage.getItem("token");
    await axios.put(`http://localhost:5000/api/todos/${id}/done`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTodos();
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
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
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={addTodo} className="bg-green-500 text-white p-2 rounded hover:bg-green-600">Add</button>
      </div>

      <h3 className="text-xl font-semibold mb-2">Planned To-Dos</h3>
      <ul className="space-y-2 mb-6">
        {todos.filter(todo => !todo.isDone).map(todo => (
          <li key={todo.id} className="flex justify-between items-center border p-2 rounded">
            <span>{todo.text} <span className="text-sm text-gray-500">(Due: {new Date(todo.dueDate).toLocaleDateString()})</span></span>
            <button onClick={() => markDone(todo.id)} className="bg-blue-500 text-white p-1 px-3 rounded hover:bg-blue-600">Done</button>
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mb-2">Done To-Dos</h3>
      <ul className="space-y-2">
        {todos.filter(todo => todo.isDone).map(todo => (
          <li key={todo.id} className="border p-2 rounded line-through text-gray-500">
            {todo.text} (Done)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;