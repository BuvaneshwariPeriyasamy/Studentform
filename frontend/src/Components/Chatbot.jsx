import React, { useState } from 'react';
import axios from 'axios';


const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');

    const handleSend = async () => {
        const userMessage = { sender: 'User', text: userInput };
        setMessages([...messages, userMessage]);

        try {
            const response = await axios.post('/api/chat', { message: userInput });
            const botMessage = { sender: 'Bot', text: response.data.reply };
            setMessages(prevMessages => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error fetching bot response:', error);
        }

        setUserInput('');
    };

    return (
        <div className="chatbot">
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender === 'User' ? 'user-message' : 'bot-message'}>
                        {msg.sender}: {msg.text}
                    </div>
                ))}
            </div>
            <input 
                type="text" 
                value={userInput} 
                onChange={(e) => setUserInput(e.target.value)} 
                placeholder="Type a message..."
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default Chatbot;
