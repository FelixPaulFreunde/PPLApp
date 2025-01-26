import React, { useState, useEffect } from 'react';
import { Search, SkipForward, Bookmark, BarChart2, Moon, Sun } from 'lucide-react';

const PilotQuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    fetch('/questions.json', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error('Invalid questions format. Expected an array.');
        }
        setQuestions(data.filter(q => q.set === "Navigation V1"));
      })
      .catch(error => {
        console.error('Error loading questions:', error);
        setQuestions([]);
      });
  }, []);

  const handleAnswer = (selectedOption) => {
    if (!questions.length || !questions[currentQuestion] || answeredQuestions.includes(currentQuestion)) return;
    
    const isCorrect = selectedOption === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    setAnsweredQuestions([...answeredQuestions, currentQuestion]);
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 1000);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} p-4`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-400">PPL Navigation Training - Navigation V1</h1>
        {questions.length === 0 ? (
          <p className="text-red-500 text-center mt-4">Error loading questions. Please check the data source.</p>
        ) : (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold">Question {currentQuestion + 1}/{questions.length}</h2>
            <p className="text-lg mb-6">{questions[currentQuestion]?.question || "No question available"}</p>
            <div className="space-y-3">
              {questions[currentQuestion]?.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full text-left p-4 rounded-lg bg-gray-700 hover:bg-gray-600">
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PilotQuizApp;
