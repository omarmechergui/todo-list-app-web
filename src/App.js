import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { generateQuestByLevel } from './data'; // استيراد دالة توليد المهام

const defaultTasks = [
  { id: 1, name: "مهمة 1", completed: false },
  { id: 2, name: "مهمة 2", completed: false },
  { id: 3, name: "مهمة 3", completed: false },
  { id: 4, name: "مهمة 4", completed: false },
  { id: 5, name: "مهمة 5", completed: false },
];

const Home = () => {
  const [taskList, setTaskList] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : defaultTasks;
  });
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

  // استخدام دالة generateQuestByLevel لتوليد المهام بناءً على المستوى
  useEffect(() => {
    const generatedTasks = generateQuestByLevel(level);
    setTaskList(generatedTasks);
  }, [level]);

  useEffect(() => {
    if (xp >= xpRequired) {
      setLevel(level + 1);
      setXp(0);
      setXpRequired(xpRequired * 1.2);  // Increase xp required for each level
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);  // Hide popup after 2 seconds
    }
  }, [xp, level, xpRequired]);

  // Save tasks, XP, and level to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("level", level);
    localStorage.setItem("xp", xp);
  }, [taskList, level, xp]);

  const toggleTask = (id) => {
    setTaskList(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    setXp(xp + 10); // Add XP for completed task
  };

  const refreshTasks = () => {
    // Check if all tasks are completed before generating new ones
    const allTasksCompleted = taskList.every(task => task.completed);
    if (allTasksCompleted) {
      const generatedTasks = generateQuestByLevel(level);
      setTaskList(generatedTasks);
      localStorage.setItem("tasks", JSON.stringify(generatedTasks));
    } else {
      alert("يجب إتمام جميع المهام قبل تحديثها.");
    }
  };

  return (
    <div className="App">
      <div className={`stats-card ${showPopup ? 'popup-visible' : ''}`}>
        <h2>المستوى: {level}</h2>
        <div className="xp-bar">
          <div className="xp-fill" style={{ width: `${(xp / xpRequired) * 100}%` }}>
            XP: {xp} / {xpRequired}
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

      <button className="refresh-btn" onClick={refreshTasks}>تحديث المهام</button>
      {/* Link to Stats Page */}
      <Link to="/stats">
        <button className="go-to-stats-btn">عرض الإحصائيات</button>
      </Link>
    </div>
  );
};

const Stats = () => {
  return (
    <div className="stats-page">
      <h2>إحصائياتك الشخصية</h2>
      <div className="stat-card">
        <p>المستوى: 1</p>
        <p>XP: 50 / 100</p>
        <p>المهام المكتملة: 3</p>
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
