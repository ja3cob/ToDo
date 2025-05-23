import { useState } from "react";
import api from "../util/api";

const ToDoItem = ({ todo, fetchTodos }) => {
    const toggleDone = async (id) => {
        const token = localStorage.getItem("token");
        await api.put(`todos/${id}/done`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchTodos();
    };

    const updateTodo = async (id, text, dueDate) => {
        const token = localStorage.getItem("token");
        await api.patch(`todos/${id}`,
            {
                Text: text,
                DueDate: dueDate
            }, 
            { headers: { Authorization: `Bearer ${token}` } });
        fetchTodos();
    }

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

    const [editMode, setEditMode] = useState(false);
    const [editedText, setEditedText] = useState(todo.text);
    const [editedDueDate, setEditedDueDate] = useState(todo.dueDate.split('T')[0]);
    const toggleEditMode = () => {
        if(editMode) {
            updateTodo(todo.id, editedText, editedDueDate);
        }

        setEditMode(prev => !prev);
    }

    return (
        <li className="flex justify-between items-center border p-2 rounded">
          {editMode
            ? (<>
               <textarea className="flex-1 resize-none border p-1 mr-2" value={editedText} onChange={e => setEditedText(e.target.value)} />
               <input
                type="date"
                value={editedDueDate}
                onChange={e => setEditedDueDate(e.target.value)}
                className="border p-2 rounded mb-2"
                />
               </>)
            : <span className={`wrap-anywhere ${todo.isDone ? " line-through text-gray-500" : ""}`}>{todo.text}</span>
          }
          <div className="whitespace-nowrap">
            {!todo.isDone &&
                <i onClick={toggleEditMode} className={`text-2xl text-${editMode ? "green" : "yellow"}-500 cursor-pointer ml-3 fa fa-${editMode ? "check" : "pen-to-square"}`}/>
            }
            {!editMode && (
                <>
                <i onClick={() => toggleDone(todo.id)} className={`text-2xl text-green-500 cursor-pointer mx-3 fa-regular fa-square${todo.isDone ? "-check" : ""}`}/>
                <i onClick={() => deleteTodo(todo.id)} className="text-2xl text-red-500 cursor-pointer fa-solid fa-trash-can"/>
                </>
            )}
          </div>
        </li>
    );
}

export default ToDoItem;