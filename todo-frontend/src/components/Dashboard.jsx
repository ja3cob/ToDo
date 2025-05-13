import React, { useState, useEffect } from "react";
import api from "../util/api";
import { useNavigate } from "react-router-dom";
import ToDoItem from "./ToDoItem";

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

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-md rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">To-Do lista</h2>
        <i
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="bg-red-500 text-white p-3 rounded hover:bg-red-600 fa-solid fa-arrow-right-from-bracket">
        </i>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Nowe zadanie"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button onClick={addTodo} className="bg-green-500 text-white p-2 rounded hover:bg-green-600">Dodaj</button>
      </div>

      <h3 className="text-xl font-semibold mb-2">
        Zadania na dzień{" "}
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="border p-2 rounded mb-2"
        />
      </h3>
      <ul className="space-y-2 mb-6">
        {todos.filter(todo => !todo.isDone).map(todo => <ToDoItem todo={todo} fetchTodos={fetchTodos}/>)}
      </ul>

      <h3 className="text-xl font-semibold mb-2">Zrobione</h3>
      <ul className="space-y-2">
        {todos.filter(todo => todo.isDone).map(todo => <ToDoItem todo={todo} fetchTodos={fetchTodos}/>)}
      </ul>
    </div>
  );
};

export default Dashboard;