import React, { useEffect } from 'react';
import io from 'socket.io-client';

function App() {
  useEffect(() => {
    const socket = io('http://localhost:3000'); // Anslut till din server

    // Lyssna på meddelanden från servern
    socket.on('message', (message) => {
      console.log(`Meddelande från servern: ${message}`);
    });
  }, []);

  return (
    <div className="App">
      {/* Din React-kod här */}
    </div>
  );
}

export default App;
