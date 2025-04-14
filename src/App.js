import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { generateQuestByLevel } from './data';

function App() {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  });

  const [level, setLevel] = useState(() => {
    const storedLevel = localStorage.getItem('level');
    return storedLevel ? parseInt(storedLevel) : 1;
  });

  const [xp, setXp] = useState(() => {
    const storedXp = localStorage.getItem('xp');
    return storedXp ? parseInt(storedXp) : 0;
  });

  const [xpToNextLevel, setXpToNextLevel] = useState(() => {
    const storedXpToNextLevel = localStorage.getItem('xpToNextLevel');
    return storedXpToNextLevel ? parseInt(storedXpToNextLevel) : 100;
  });

  const [popupMessage, setPopupMessage] = useState('');
  const [showExplosion, setShowExplosion] = useState(false);

  useEffect(() => {
    const lastUpdated = localStorage.getItem('lastUpdated');
    const now = new Date();

    if (!lastUpdated || (now - new Date(lastUpdated)) > 24 * 60 * 60 * 1000) {
      const newQuests = generateQuestByLevel(level);
      setTasks(newQuests);
      localStorage.setItem('tasks', JSON.stringify(newQuests));
      localStorage.setItem('lastUpdated', now.toString());
    }
  }, [level]);

  const completeTask = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id && !task.completed) {
        const gainedXp = task.xpReward;
        let newXp = xp + gainedXp;
        let newLevel = level;
        let newXpToNext = xpToNextLevel;

        while (newXp >= newXpToNext) {
          newXp -= newXpToNext;
          newLevel += 1;
          newXpToNext = Math.floor(newXpToNext * 1.2);
        }

        setXp(newXp);
        setLevel(newLevel);
        setXpToNextLevel(newXpToNext);

        localStorage.setItem('xp', newXp.toString());
        localStorage.setItem('level', newLevel.toString());
        localStorage.setItem('xpToNextLevel', newXpToNext.toString());

        // Trigger explosion effect
        setShowExplosion(true);
        setTimeout(() => setShowExplosion(false), 1000); // Reset after 1 second

        // Show popup when level up
        setPopupMessage(`Congratulations! You've reached Level ${newLevel}!`);

        return { ...task, completed: true };
      }
      return task;
    });

    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const refreshTasks = () => {
    const newQuests = generateQuestByLevel(level);
    setTasks(newQuests);
    localStorage.setItem('tasks', JSON.stringify(newQuests));
    localStorage.setItem('lastUpdated', new Date().toString());
  };

  const allTasksCompleted = tasks.length > 0 && tasks.every(task => task.completed);

  return (
    <div className="app-container">
      {popupMessage && <div className="popup-message">{popupMessage}</div>}
      
      <div className={`stats-card ${showExplosion ? 'explode' : ''}`}>
        <h2>🧍‍♂️ Level {level}</h2>
        <div className="xp-bar">
          <div
            className="xp-fill"
            style={{ width: `${(xp / xpToNextLevel) * 100}%` }}
          >
            XP {xp}/{xpToNextLevel}
          </div>
        </div>
      </div>

      {allTasksCompleted && (
        <div className="text-center my-3">
          <button className="refresh-btn" onClick={refreshTasks}>
            🔁 Refresh Missions
          </button>
        </div>
      )}

      <div className="quests-section">
        <h3>🏋️‍♂️ Sport Missions</h3>
        <div className="quests-list">
          {tasks.filter(task => task.type === 'Sport').map(task => (
            <div key={task.id} className={`quest-card ${task.completed ? 'completed' : ''}`}>
              <div className="icon">{task.completed ? '✔️' : '🏋️‍♂️'}</div>
              <h5>{task.title}</h5>
              <p>XP: {task.xpReward}</p>
              {!task.completed && (
                <button className="btn btn-success btn-sm" onClick={() => completeTask(task.id)}>
                  ✅ Complete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="quests-section">
        <h3>📚 Culture Missions</h3>
        <div className="quests-list">
          {tasks.filter(task => task.type === 'Culture').map(task => (
            <div key={task.id} className={`quest-card ${task.completed ? 'completed' : ''}`}>
              <div className="icon">{task.completed ? '✔️' : '📚'}</div>
              <h5>{task.title}</h5>
              <p>XP: {task.xpReward}</p>
              {!task.completed && (
                <button className="btn btn-danger btn-sm" onClick={() => completeTask(task.id)}>
                  ✅ Complete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
