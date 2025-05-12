import React, { useState, useEffect } from "react";
import api from "../util/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  const fetchTodos = async () => {
    const token = localStorage.getItem("token");
    try {
      if(!token) {
        throw Error;
      }
      
      const response = await api.get("todos", {
        headers: { Authorization: `Bearer ${token}` },
        params: { date: selectedDate }
      });

      setTodos(response.data);
    }
    catch {
      navigate("/");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [selectedDate]);

  const addTodo = async () => {
    const token = localStorage.getItem("token");
    await api.post(
      "todos",
      { text: newTodo, dueDate: selectedDate },
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Super To-Do App</h2>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="New To-Do"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          className="flex-1 border p-2 rounded"
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
            <div className="whitespace-nowrap">
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