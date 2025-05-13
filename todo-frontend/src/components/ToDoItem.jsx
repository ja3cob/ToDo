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

    return (
        <li key={todo.id} className="flex justify-between items-center border p-2 rounded">
          <span className={`wrap-anywhere ${todo.isDone ? " line-through text-gray-500" : ""}`}>{todo.text}</span>
          <div className="whitespace-nowrap">
            <i onClick={() => toggleDone(todo.id)} className={`text-3xl text-green-500 cursor-pointer m-3 fa-regular fa-square${todo.isDone ? "-check" : ""}`}/>
            <i onClick={() => deleteTodo(todo.id)} className="text-3xl text-red-500 cursor-pointer fa-solid fa-trash-can"/>
          </div>
        </li>
    );
}

export default ToDoItem;