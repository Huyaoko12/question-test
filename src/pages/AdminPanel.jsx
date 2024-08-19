import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import QuestionCard from '../components/QuestionCard/QuestionCard';
import './AdminPanel.css';

const AdminPanel = () => {
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [answer, setAnswer] = useState('');
    const [answers, setAnswers] = useState([]); // State lưu trữ câu trả lời
    const [likedQuestions, setLikedQuestions] = useState([]); // Track liked questions
    const [error, setError] = useState('');

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

    const handleQuestionClick = (question) => {
        setSelectedQuestion(question);
        // Tìm câu trả lời hiện có cho câu hỏi đã chọn
        const currentAnswer = answers.find(ans => ans.questionId === question.id);
        setAnswer(currentAnswer ? currentAnswer.answer : '');
    };

    const handleDeleteQuestion = (id) => {
        setQuestions(questions.filter(question => question.id !== id));
    };

    const handleLikeQuestion = (id) => {
        setQuestions(questions.map(question => {
            if (question.id === id) {
                const isLiked = likedQuestions.includes(id);
                const currentLikeCount = question.likeCount || 0; // Ensure likeCount is initialized to 0

                const updatedLikeCount = isLiked ? currentLikeCount - 1 : currentLikeCount + 1;

                if (isLiked) {
                    setLikedQuestions(likedQuestions.filter(likedId => likedId !== id));
                } else {
                    setLikedQuestions([...likedQuestions, id]);
                }

                return { ...question, likeCount: updatedLikeCount };
            }
            return question;
        }));
    };

    const handleSubmitAnswer = async (e) => {
        e.preventDefault();

        try {
            const existingAnswer = answers.find(ans => ans.questionId === selectedQuestion.id);

            if (existingAnswer) {
                // Cập nhật câu trả lời hiện có
                await axios.put(`https://66c2cb6dd057009ee9bdec9e.mockapi.io/api/Question/answers/${existingAnswer.id}`, {
                    questionId: selectedQuestion.id,
                    answer
                });
            } else {
                // Thêm câu trả lời mới
                await axios.post('https://66c2cb6dd057009ee9bdec9e.mockapi.io/api/Question/answers', {
                    questionId: selectedQuestion.id,
                    answer
                });
            }

            alert(`Answer submitted for question: ${selectedQuestion.text}`);
            setSelectedQuestion(null);
            setAnswer('');
            // Cập nhật danh sách câu trả lời sau khi gửi
            const updatedAnswers = await axios.get('https://66c2cb6dd057009ee9bdec9e.mockapi.io/api/Question/answers');
            setAnswers(updatedAnswers.data);
        } catch (err) {
            console.error('Error submitting answer:', err);
            setError('Unable to submit answer. Please try again later.');
        }
    };

    const getAnswerForQuestion = (questionId) => {
        const answer = answers.find((ans) => ans.questionId === questionId);
        return answer ? answer.answer : 'No answer yet.';
    };

    return (
        <div>
            <Header />
            <div className="question-list">
                {error && <p className="error">{error}</p>}
                {questions.map((question) => (
                    <div key={question.id} className="question-card-container">
                        <QuestionCard
                            question={question}
                            onDelete={handleDeleteQuestion}
                            onLike={handleLikeQuestion}
                            onClick={() => handleQuestionClick(question)}
                        />
                        <div className="answer-display">
                            <p className="answer-text">
                                {getAnswerForQuestion(question.id)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            {selectedQuestion && (
                <div className="answer-form">
                    <h3>Answer Question: {selectedQuestion.text}</h3>
                    <form onSubmit={handleSubmitAnswer}>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your answer here..."
                            rows="4"
                            cols="50"
                            required
                        />
                        <br />
                        <button type="submit">Submit Answer</button>
                    </form>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default AdminPanel;
