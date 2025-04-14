import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { generateQuestByLevel } from './data';

const Home = () => {
  const [level, setLevel] = useState(() => {
    const savedLevel = localStorage.getItem("level");
    return savedLevel ? parseInt(savedLevel) : 1;
  });

  const [xp, setXp] = useState(() => {
    const savedXp = localStorage.getItem("xp");
    return savedXp ? parseInt(savedXp) : 0;
  });

  const [xpRequired, setXpRequired] = useState(100);
  const [showPopup, setShowPopup] = useState(false);

  const [taskList, setTaskList] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : generateQuestByLevel(level);
  });

  useEffect(() => {
    if (xp >= xpRequired) {
      const newLevel = level + 1;
      setLevel(newLevel);
      setXp(0);
      setXpRequired(xpRequired * 1.2);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }
  }, [xp]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("level", level);
    localStorage.setItem("xp", xp);
  }, [taskList, level, xp]);

  const toggleTask = (id) => {
    const updatedTasks = taskList.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTaskList(updatedTasks);

    const task = taskList.find(t => t.id === id);
    if (!task.completed) {
      setXp(prev => prev + task.xpReward);
    }
  };

  const refreshTasks = () => {
    const allCompleted = taskList.every(task => task.completed);
    if (allCompleted) {
      const newTasks = generateQuestByLevel(level);
      setTaskList(newTasks);
      localStorage.setItem("tasks", JSON.stringify(newTasks));
    }
  };

  return (
    <div className="App">
      <div className={`stats-card ${showPopup ? 'popup-visible' : ''}`}>
        <h2>المستوى: {level}</h2>
        <div className="xp-bar">
          <div className="xp-fill" style={{ width: `${(xp / xpRequired) * 100}%` }}>
            XP: {xp} / {Math.floor(xpRequired)}
          </div>
        </div>
        {showPopup && <div className="popup-message">مبروك! لقد وصلت إلى مستوى {level}</div>}
      </div>

      <div className="quests-list">
        {taskList.map((task) => (
          <div
            key={task.id}
            className={`quest-card ${task.completed ? 'completed' : ''}`}
            onClick={() => toggleTask(task.id)}
          >
            <h5>{task.title}</h5>
            <p>{task.completed ? "تم إتمام المهمة" : "لم تكتمل بعد"}</p>
          </div>
        ))}
      </div>

      <button
        className="refresh-btn"
        onClick={refreshTasks}
        disabled={!taskList.every(task => task.completed)}
      >
        تحديث المهام
      </button>

      <Link to="/stats">
        <button className="go-to-stats-btn">عرض الإحصائيات</button>
      </Link>
    </div>
  );
};

const Stats = () => {
  const level = parseInt(localStorage.getItem("level") || 1);
  const xp = parseInt(localStorage.getItem("xp") || 0);
  const taskList = JSON.parse(localStorage.getItem("tasks") || "[]");
  const completedTasks = taskList.filter(task => task.completed).length;

  return (
    <div className="stats-page">
      <h2>إحصائياتك الشخصية</h2>
      <div className="stat-card">
        <p>المستوى: {level}</p>
        <p>XP: {xp}</p>
        <p>المهام المكتملة: {completedTasks}</p>
      </div>
      <Link to="/">
        <button className="go-back-btn">العودة للصفحة الرئيسية</button>
      </Link>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </Router>
  );
};

export default App;
