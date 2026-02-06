import React, { useState } from 'react';
import { Target, TrendingUp, Calendar, Award, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import Layout from '../../../layout/page';

export default function GoalTracker() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Complete 50 Projects',
      category: 'Career',
      target: 50,
      current: 32,
      unit: 'projects',
      deadline: '2025-12-31',
      color: 'blue',
      milestones: [
        { id: 1, value: 10, completed: true },
        { id: 2, value: 25, completed: true },
        { id: 3, value: 40, completed: false },
        { id: 4, value: 50, completed: false }
      ]
    },
    {
      id: 2,
      title: 'Read 24 Books',
      category: 'Personal',
      target: 24,
      current: 15,
      unit: 'books',
      deadline: '2025-12-31',
      color: 'green',
      milestones: [
        { id: 1, value: 6, completed: true },
        { id: 2, value: 12, completed: true },
        { id: 3, value: 18, completed: false },
        { id: 4, value: 24, completed: false }
      ]
    },
    {
      id: 3,
      title: 'Save $10,000',
      category: 'Finance',
      target: 10000,
      current: 6500,
      unit: 'dollars',
      deadline: '2025-11-30',
      color: 'purple',
      milestones: [
        { id: 1, value: 2500, completed: true },
        { id: 2, value: 5000, completed: true },
        { id: 3, value: 7500, completed: false },
        { id: 4, value: 10000, completed: false }
      ]
    },
    {
      id: 4,
      title: 'Exercise 200 Hours',
      category: 'Health',
      target: 200,
      current: 145,
      unit: 'hours',
      deadline: '2025-12-31',
      color: 'red',
      milestones: [
        { id: 1, value: 50, completed: true },
        { id: 2, value: 100, completed: true },
        { id: 3, value: 150, completed: false },
        { id: 4, value: 200, completed: false }
      ]
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    category: 'Personal',
    target: 0,
    current: 0,
    unit: '',
    deadline: '',
    color: 'blue'
  });

  const addGoal = () => {
    if (newGoal.title && newGoal.target > 0) {
      const milestones = [
        { id: 1, value: Math.round(newGoal.target * 0.25), completed: false },
        { id: 2, value: Math.round(newGoal.target * 0.5), completed: false },
        { id: 3, value: Math.round(newGoal.target * 0.75), completed: false },
        { id: 4, value: newGoal.target, completed: false }
      ];
      
      setGoals([...goals, { ...newGoal, id: Date.now(), milestones }]);
      setNewGoal({ title: '', category: 'Personal', target: 0, current: 0, unit: '', deadline: '', color: 'blue' });
      setShowForm(false);
    }
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const updateProgress = (goalId, newValue) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updated = { ...goal, current: Math.min(Math.max(0, newValue), goal.target) };
        updated.milestones = updated.milestones.map(m => ({
          ...m,
          completed: updated.current >= m.value
        }));
        return updated;
      }
      return goal;
    }));
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      purple: { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      red: { bg: 'bg-red-500', light: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
      orange: { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' }
    };
    return colors[color] || colors.blue;
  };

  const calculateProgress = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const end = new Date(deadline);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.current >= g.target).length;
  const averageProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, g) => sum + calculateProgress(g.current, g.target), 0) / goals.length)
    : 0;

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <Target className="text-indigo-600" size={40} />
              My Goals
            </h1>
            <p className="text-gray-600 mt-2">Track your progress and achieve your dreams</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-medium shadow-lg"
          >
            <Plus size={20} />
            New Goal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-indigo-500">
            <div className="flex items-center gap-3 mb-2">
              <Target className="text-indigo-600" size={24} />
              <h3 className="text-gray-600 font-medium">Total Goals</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{totalGoals}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
            <div className="flex items-center gap-3 mb-2">
              <Award className="text-green-600" size={24} />
              <h3 className="text-gray-600 font-medium">Completed</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{completedGoals}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-purple-600" size={24} />
              <h3 className="text-gray-600 font-medium">Avg Progress</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{averageProgress}%</p>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-indigo-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Create New Goal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Goal Title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Personal</option>
                <option>Career</option>
                <option>Health</option>
                <option>Finance</option>
                <option>Education</option>
              </select>
              <select
                value={newGoal.color}
                onChange={(e) => setNewGoal({...newGoal, color: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
                <option value="red">Red</option>
                <option value="orange">Orange</option>
              </select>
              <input
                type="number"
                placeholder="Target Value"
                value={newGoal.target || ''}
                onChange={(e) => setNewGoal({...newGoal, target: parseInt(e.target.value) || 0})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Unit (e.g., books, hours, kg)"
                value={newGoal.unit}
                onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={addGoal}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Create Goal
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map(goal => {
            const colors = getColorClasses(goal.color);
            const progress = calculateProgress(goal.current, goal.target);
            const daysLeft = getDaysRemaining(goal.deadline);
            const isCompleted = goal.current >= goal.target;

            return (
              <div
                key={goal.id}
                className={`bg-white rounded-xl shadow-lg p-6 border-t-4 ${colors.border} hover:shadow-xl transition`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {isCompleted ? (
                        <CheckCircle2 className="text-green-500" size={24} />
                      ) : (
                        <Circle className={colors.text} size={24} />
                      )}
                      <h3 className="text-xl font-bold text-gray-800">{goal.title}</h3>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${colors.light} ${colors.text}`}>
                      {goal.category}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="text-red-500 hover:text-red-700 transition p-1"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-gray-800">
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                    <span className="text-lg font-semibold text-gray-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`${colors.bg} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Milestones</h4>
                  <div className="flex gap-2">
                    {goal.milestones.map((milestone, idx) => (
                      <div key={milestone.id} className="flex-1">
                        <div className={`h-2 rounded-full ${milestone.completed ? colors.bg : 'bg-gray-200'} mb-1`}></div>
                        <p className={`text-xs text-center ${milestone.completed ? colors.text : 'text-gray-400'} font-medium`}>
                          {milestone.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span className="text-sm">
                      {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today' : 'Overdue'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateProgress(goal.id, goal.current - 1)}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition font-bold"
                    >
                      -
                    </button>
                    <button
                      onClick={() => updateProgress(goal.id, goal.current + 1)}
                      className={`${colors.bg} text-white px-3 py-1 rounded hover:opacity-90 transition font-bold`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <Target size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="text-xl text-gray-400">No goals yet. Create your first goal to get started!</p>
          </div>
        )}
      </div>
    </div>
    </Layout>
  );
}