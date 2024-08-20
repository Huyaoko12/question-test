import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import QuestionCard from '../components/QuestionCard/QuestionCard';
import './Home.css';

const Home = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [error, setError] = useState('');
    const [newQuestion, setNewQuestion] = useState('');
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('https://66c2cb6dd057009ee9bdec9e.mockapi.io/api/Question/questions');
                setQuestions(response.data);
            } catch (err) {
                console.error('Error fetching questions:', err);
                setError('Unable to load questions. Please try again later.');
            }
        };

        const fetchAnswers = async () => {
            try {
                const response = await axios.get('https://66c2cb6dd057009ee9bdec9e.mockapi.io/api/Question/answers');
                setAnswers(response.data);
            } catch (err) {
                console.error('Error fetching answers:', err);
                setError('Unable to load answers. Please try again later.');
            }
        };

        fetchQuestions();
        fetchAnswers();
    }, []);

    const handleAddQuestion = async () => {
        if (newQuestion.trim()) {
            try {
                const response = await axios.post('https://66c2cb6dd057009ee9bdec9e.mockapi.io/api/Question/questions', {
                    text: newQuestion.trim(),
                    likedByUser: false
                });
                setQuestions([...questions, response.data]);
                setNewQuestion('');
                setError(''); // Xóa thông báo lỗi nếu câu hỏi hợp lệ
            } catch (err) {
                console.error('Error adding question:', err);
                setError('Unable to add question. Please try again later.');
            }
        } else {
            setError('Question cannot be empty.');
        }
    };

    const handleDeleteQuestion = async (id) => {
        try {
            await axios.delete(`https://66c2cb6dd057009ee9bdec9e.mockapi.io/api/Question/questions/${id}`);
            setQuestions(questions.filter((question) => question.id !== id));
        } catch (err) {
            console.error('Error deleting question:', err);
            setError('Unable to delete question. Please try again later.');
        }
    };

    const handleLikeQuestion = async (id) => {
        try {
            const questionToUpdate = questions.find(question => question.id === id);
            if (questionToUpdate) {
                const updatedLikeCount = questionToUpdate.likedByUser ? (questionToUpdate.likeCount || 0) - 1 : (questionToUpdate.likeCount || 0) + 1;
                await axios.put(`https://66c2cb6dd057009ee9bdec9e.mockapi.io/api/Question/questions/${id}`, {
                    ...questionToUpdate,
                    likeCount: updatedLikeCount,
                    likedByUser: !questionToUpdate.likedByUser 
                });
                setQuestions(questions.map(question =>
                    question.id === id ? { ...question, likeCount: updatedLikeCount, likedByUser: !question.likedByUser } : question
                ));
            }
        } catch (err) {
            console.error('Error updating like count:', err);
            setError('Unable to update like count. Please try again later.');
        }
    };

    const handleQuestionClick = (question) => {
        setSelectedQuestion(question);
    };

    const getAnswerForQuestion = (questionId) => {
        const answer = answers.find((ans) => ans.questionId === questionId);
        return answer ? answer.answer : 'Câu hỏi chưa được trả lời!!';
    };

    return (
        <div>
            <Header />
            <div className="question-list">
                {error && <p className="error">{error}</p>}
                {questions.map((question) => (
                    <QuestionCard 
                        key={question.id} 
                        question={question} 
                        onDelete={handleDeleteQuestion}
                        onLike={handleLikeQuestion}
                        onClick={() => handleQuestionClick(question)}
                    />
                ))}
            </div>
            {selectedQuestion && (
                <div className="answer-display">
                    <h3>Câu trả lời cho câu hỏi: {selectedQuestion.text}</h3>
                    <p>{getAnswerForQuestion(selectedQuestion.id)}</p>
                </div>
            )}
            <div className="add-question-form">
                <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Nhập câu hỏi của bạn"
                />
                <button onClick={handleAddQuestion}>Thêm câu hỏi</button>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
