import { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance'
import Header from '../components/header';
import Footer from '../components/footer';

const ChatPage = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const result = await axiosInstance.post('/chat', {question} , 
        { headers: {'Content-Type': 'application/json'}, withCredentials: true });

      setResponse(result.data.answer);
    } catch (error) {
      
      // Handle rate limit error
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        setResponse("Sorry, we are currently out of tokens. You can try again later!");
      } else {
        setResponse("Sorry, something went wrong. Please try again later!");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="container my-5">
        <h1 className="text-center mb-4">Ask Our AI Friend a Question!</h1>
        <div className="mb-3">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask something..."
            rows={4}
            className="form-control"
          />
        </div>
        <div className="text-center">
          <button
            onClick={handleAskQuestion}
            className="btn btn-primary"
            disabled={loading}
          >
            Ask
          </button>
        </div>
        {loading && <p className="text-center mt-3">Loading...</p>}
        {response && (
          <div className="mt-4 p-3 border rounded bg-light">
            <h5>Response:</h5>
            <p>{response}</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ChatPage;