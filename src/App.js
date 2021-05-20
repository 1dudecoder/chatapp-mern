import React, { useEffect, useState } from "react";
import './App.css';
import Chat from './Chat';
import SideBar from './SideBar';
import Pusher from "pusher-js";
import axios from "./axios";


function App() { 

	const [messages, setMessages] = useState([]);

	useEffect(() => {
		axios.get("/messages/sync").then((response) => {
			setMessages(response.data);
		});
	}, []);

	useEffect(() => {
    var pusher = new Pusher('2688adff8c17691a4e04', {
      cluster: 'eu'
    });

		const channel = pusher.subscribe("message");
		channel.bind("inserted", (newMessage) => {
			setMessages([...messages, newMessage]);
		});

		// Clean up function
		return () => {
			channel.unbind_all();
			channel.unsubscribe("message");
		};
	}, [messages]);



  return (
    <div className="app">
      <div className="app__body">
        <SideBar />
        <Chat messages={messages} />
      </div>
    </div>
  );
}

export default App;
