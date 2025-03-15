import { useRef, useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todo, setTodo] = useState([]);
  const [filter, setFilter] = useState("all");
  const inputRef = useRef();

  // Load saved todos from localStorage when the app starts
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todoList"));
    if (savedTodos) {
      setTodo(savedTodos);
    }
  }, []);

  // Save todos to localStorage whenever the todo list changes
  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(todo));
  }, [todo]);

  const handleAddTodo = () => {
    const text = inputRef.current.value.trim();
    if (!text) return;

    const newItem = { id: Date.now(), completed: false, text };
    setTodo((prevTodo) => [...prevTodo, newItem]);
    inputRef.current.value = "";
  };

  const handleItemDone = (id) => {
    setTodo((prevTodo) =>
      prevTodo.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDeleteTodo = (id) => {
    setTodo((prevTodo) => prevTodo.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setTodo([]);
    localStorage.removeItem("todoList"); // Remove from localStorage as well
  };

  const filteredTodos = todo.filter((item) => {
    if (filter === "completed") return item.completed;
    if (filter === "pending") return !item.completed;
    return true;
  });

  return (
    <div className="container">
      <h2 className="header">To-Do List</h2>
      <div className="input-container">
        <input type="text" ref={inputRef} placeholder="Add todo" className="input" />
        <button onClick={handleAddTodo} className="add-button">Add</button>
        <button onClick={handleClearAll} className="clear-button">Clear All</button>
      </div>
      <div className="filter-container">
        <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>All</button>
        <button onClick={() => setFilter("completed")} className={filter === "completed" ? "active" : ""}>Completed</button>
        <button onClick={() => setFilter("pending")} className={filter === "pending" ? "active" : ""}>Pending</button>
      </div>
      <ul className="list">
        {filteredTodos.map(({ id, text, completed }) => (
          <div key={id} className="todo-item">
            <li
              onClick={() => handleItemDone(id)}
              className={`list-item ${completed ? "completed" : ""}`}
            >
              {text}
            </li>
            <span className="delete-button" onClick={() => handleDeleteTodo(id)}>❌</span>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default App;
