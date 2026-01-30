import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
//import { Camera, Send, Mic } from 'lucide-react';

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Hi! 👋 I'm your ōly beauty assistant.\nAsk me anything about skincare, makeup, haircare… or upload a skin photo for analysis! 💄✨" }
  ]);
  const [input, setInput] = useState('');
  const [context] = useState('User is browsing skincare products for oily skin');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      setSelectedImage(base64);
      setMessages(prev => [...prev, { role: 'user', content: '[Skin photo uploaded—analyzing now...]' }]);
      sendMessage('', base64);
    };
    reader.readAsDataURL(file);
  };

  const sendMessage = async (text = input.trim(), imageBase64 = selectedImage) => {
    if (!text && !imageBase64) return;

    if (text) {
      setMessages(prev => [...prev, { role: 'user', content: text }]);
      setInput('');
    }

    setSelectedImage(null);
    setLoading(true);

    try {
      const payload = {
        message: text || 'Analyze this skin photo for age, texture, elasticity, and recommendations.',
        conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
        imageBase64,
        context
      };
      console.log('Sending to backend:', payload);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/chat`,
        payload,
        { timeout: 60000 }
      );

      console.log('Backend full response:', res.data);

      let reply = res.data.reply?.trim() || "Hmm... I'm thinking! Try asking again 💭";

      const replyParts = reply.split(/\n{2,}/).filter(p => p.trim().length > 10);
      if (replyParts.length === 0) replyParts.push(reply);

      replyParts.forEach(part => {
        if (part.trim()) {
          setMessages(prev => [...prev, { role: 'bot', content: part.trim() }]);
          speak(part.trim());
        }
      });
    } catch (err) {
      console.error('Frontend chat error:', err);
      const errorMsg = err.response?.data?.reply || "Oops! Something went wrong 😅 Try again or ask without photo!";
      setMessages(prev => [...prev, { role: 'bot', content: errorMsg }]);
      speak(errorMsg);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  // TTS
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      speechSynthesis.speak(utterance);
    }


 else {
      console.warn('Browser TTS not supported');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          width: 64,
          height: 64,
          background: '#FF1493',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          fontSize: '32px',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(255,20,147,0.4)',
          zIndex: 9999,
          transition: 'all 0.3s'
        }}
      >
        💄
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 30,
      right: 30,
      width: 400,
      height: '620px',
      background: 'white',
      borderRadius: 24,
      boxShadow: '0 20px 60px rgba(255,20,147,0.25)',
      overflow: 'hidden',
      zIndex: 9999,
      fontFamily: "'Poppins', system-ui, sans-serif",
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #FF1493, #FF69B4)',
        color: 'white',
        padding: '18px 20px',
        fontWeight: '600',
        fontSize: '18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>ōly Beauty Assistant 💄</span>
        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '28px', cursor: 'pointer' }}>×</button>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', background: '#fff8fb' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 20, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <div style={{
              display: 'inline-block',
              maxWidth: '85%',
              padding: '14px 18px',
              borderRadius: 22,
              background: msg.role === 'user' ? '#FFE4F0' : '#f0f0f0',
              color: '#333',
              fontSize: '15.5px',
              lineHeight: '1.5',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {selectedImage && (
          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <img src={`data:image/jpeg;base64,${selectedImage}`} alt="Your skin" style={{ maxWidth: '80%', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'left', marginBottom: 20 }}>
            <div style={{ display: 'inline-block', padding: '14px 18px', borderRadius: 22, background: '#f0f0f0', fontStyle: 'italic', color: '#FF1493' }}>
              Analyzing your glow... ✨
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions */}
      {messages.length <= 3 && (
        <div style={{ padding: '12px 16px', background: '#fff', borderTop: '1px solid #ffe0ed' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {["Best for oily skin", "Moisturizer under ₹800", "Hairfall tips", "Sunscreen no white cast", "Lip tint ideas", "Night cream for glow"].map((q) => (
              <button key={q} onClick={() => sendMessage(q)} style={{
                padding: '10px 14px',
                background: '#fff0f7',
                color: '#FF1493',
                border: '1.5px solid #FF69B4',
                borderRadius: 30,
                fontSize: '13px',
                cursor: 'pointer'
              }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div style={{ padding: '16px', background: 'white', borderTop: '1px solid #eee' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me anything..."
            style={{
              flex: 1,
              padding: '14px 18px',
              border: '2px solid #ffd1e8',
              borderRadius: 30,
              outline: 'none',
              fontSize: '15.5px',
              background: '#fff'
            }}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            style={{
              padding: '14px',
              background: '#FF69B4',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            📸
          </button>
<<<<<<< HEAD
          {/*<button
            onClick={() => alert('Voice input coming soon! 🎤')} // Placeholder for mic
=======
          <button
            onClick={() => alert('Voice input coming soon! 🎤')} 
>>>>>>> a9b20f084fb1fada004348f9c5bf564e871638b3
            style={{
              padding: '14px',
              background: '#FF69B4',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            🎤
          </button>*/}
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() && !selectedImage}
            style={{
              padding: '14px 22px',
              background: input.trim() || selectedImage ? '#FF1493' : '#ffb3d9',
              color: 'white',
              border: 'none',
              borderRadius: 30,
              cursor: input.trim() || selectedImage ? 'pointer' : 'not-allowed',
              fontWeight: '600'
            }}
          >
            Send
          </button>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
      </div>
    </div>
  );
}
