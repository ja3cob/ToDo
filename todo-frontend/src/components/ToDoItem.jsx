import api from "../util/api";

const ToDoItem = ({ todo, fetchTodos }) => {
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

    let buttonColor = "blue";
    if(todo.isDone) {
        buttonColor = "green";
    }

    return (
        <li key={todo.id} className="flex justify-between items-center border p-2 rounded">
          <span className={todo.isDone ? "line-through text-gray-500" : ""}>{todo.text}</span>
          <div>
            <button onClick={() => toggleDone(todo.id)} className={`bg-${buttonColor}-500 text-white p-1 px-3 rounded hover:bg-${buttonColor}-600 mr-1`}>{todo.isDone ? "Undone" : "Done"}</button>
            <button onClick={() => deleteTodo(todo.id)} className="bg-red-500 text-white p-1 px-3 rounded hover:bg-red-600">Delete</button>
          </div>
        </li>
    );
}

export default ToDoItem;