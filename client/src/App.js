import React, { useState, useEffect } from 'react';

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch('http://localhost:3003/api/messages')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          setMessages(data);
        })
        .catch((error) => {
          console.error('There was a problem fetching data:', error);
        });
    };

    fetchData();

    //refreshing the UI after every oneminute
    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, []); 

  return (
    <div>
      <h1>Messages</h1>
      {messages.map((message) => (
        <div key={message._id}>
          <h2>Timestamp: {message.timestamp}</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Origin</th>
                <th>Destination</th>
              </tr>
            </thead>
            <tbody>
              {message.data.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.origin}</td>
                  <td>{item.destination}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default App;
