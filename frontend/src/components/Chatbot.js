import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Communitychat.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [dis, setDis] = useState("");
  const [meds, setMeds] = useState("");
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const currTime = new Date().toLocaleTimeString();
  const sendMessage = async (message) => {
    const newMessage = {
      sender: "user",
      content: message,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      const response = await axios.post("http://localhost:8000/chatbot", {
        message,
      });

      if (response.data.message === "0") {
        // Take symptoms as input
        const symptoms = prompt("Please enter your symptoms:");
        // Send symptoms to FastAPI
        const symptomResponse = await axios.post(
          "http://localhost:8000/predictionpage",
          {
            symptoms,
          }
        );

        const botMessage = {
          sender: "bot",
          content: symptomResponse.data.message,
        };
        setDis(symptomResponse.data.message);
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else if (response.data.message === "1") {
        // Take symptoms as input
        const diseases = prompt("Enter the disease to get symptoms");
        setDis(diseases);
        // Send symptoms to FastAPI
        const diseaseResponse = await axios.post(
          "http://localhost:8000/symptoms",
          {
            diseases,
          }
        );

        const botMessage = {
          sender: "bot",
          content: diseaseResponse.data.message,
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else if (response.data.message === "2") {
        // Take symptoms as input
        const precautions = dis;
        // Send symptoms to FastAPI
        const precautionResponse = await axios.post(
          "http://localhost:8000/precautions",
          {
            precautions,
          }
        );

        const botMessage = {
          sender: "bot",
          content: precautionResponse.data.message,
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else if (response.data.message === "3") {
        // Take symptoms as input
        const medicines = dis;
        const notfound = "No information available";
        // Send symptoms to FastAPI
        const medicineResponse = await axios.post(
          "http://localhost:8000/medicines",
          {
            medicines,
          }
        );
        if (medicineResponse.data.message === null) {
          const botMessage = {
            sender: "bot",
            content: notfound,
          };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        } else {
          const botMessage = {
            sender: "bot",
            content: medicineResponse.data.message,
          };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        }
      } else if (response.data.message === "4") {
        // Take symptoms as input
        const discriptions = dis;
        // Send symptoms to FastAPI
        const discriptionResponse = await axios.post(
          "http://localhost:8000/discriptions",
          {
            discriptions,
          }
        );

        const botMessage = {
          sender: "bot",
          content: discriptionResponse.data.message,
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else if (response.data.message === "5") {
        const medicine_name = prompt(
          'Please enter your medicine_name(Plz enter the name in format "Augmentin 625 Duo Tablet"):'
        );
        const medicine_nameResponse = await axios.post(
          "http://localhost:8000/medicine_market",
          {
            medicine_name,
          }
        );
        setMeds(medicine_name);

        if (medicine_nameResponse.data.message === "not found") {
          const botMessage = {
            sender: "bot",
            content: "Medicine not found in the database.",
          };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        } else {
          const { manufacturer_name, price, packet_size } =
            medicine_nameResponse.data.message;
          const botMessage = {
            sender: "bot",
            content: `Manufacturer: ${manufacturer_name},  
                      Price(in Rs): ${price},  
                      Packet_Size: ${packet_size}`,
          };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        }
      } else if (response.data.message === "6") {
        // Take symptoms as input
        const substitute = meds;
        // Send symptoms to FastAPI
        const substituteResponse = await axios.post(
          "http://localhost:8000/substitutes",
          {
            substitute,
          }
        );

        const botMessage = {
          sender: "bot",
          content: substituteResponse.data.message,
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else if (response.data.message === "7") {
        // Take symptoms as input
        const sideeffect = meds;
        // Send symptoms to FastAPI
        const sideeffectResponse = await axios.post(
          "http://localhost:8000/sideeffects",
          {
            sideeffect,
          }
        );

        const botMessage = {
          sender: "bot",
          content: sideeffectResponse.data.message,
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        const botMessage = {
          sender: "bot",
          content: response.data.message,
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputMessage.trim() !== "") {
      sendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const scrollToBottom = () => {
    const chatbox = document.getElementById("chatbox");
    chatbox.scrollTop = chatbox.scrollHeight;
  };

  return (
    <>
      <div className="comsca">
        <div className="comsssc">
          <div className="bodyy">
            <div className="commchat">
              <div className="commmess">
                {" "}
                <div id="daicina" className="received-msg">
                  <p className="comssend">
                    <p className="wowowow">
                      <p>Bot</p>
                    </p>
                    <p className="flexdisp">
                      <p>Type hello to get started</p>

                      <div className="datemess">{currTime}</div>
                    </p>
                  </p>
                </div>
                {messages.map((message, index) => (
                  <>
                    {message.sender === "bot" ? (
                      <>
                        {" "}
                        <div className="received-msg">
                          <p className="comssend" key={index}>
                            <p className="wowowow">
                              <p>Bot</p>
                            </p>
                            <p className="flexdisp">
                              <p>
                                {message.content === "Hello" ? (
                                  <>
                                    Hello Medi-Bot here plz enter <br />0 : Find
                                    disease by symptoms <br />1 : Find symptoms
                                    by disease <br />2 : Get precautions <br />3
                                    : Get medicines <br />4 : More information
                                    about disease <br />5 : Medicine market
                                    discription <br />6 : Get the substute of
                                    medicine <br />7 : Get side-effects of
                                    medicine
                                  </>
                                ) : (
                                  <>{message.content}</>
                                )}
                              </p>

                              <div className="datemess">{currTime}</div>
                            </p>
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="sender-mess">
                          <p className="comssend" key={index}>
                            <p className="wowowow">
                              <p>Me</p>
                            </p>
                            <p className="flexdisp">
                              <p>{message.content}</p>

                              <div className="datemesss">{currTime}</div>
                            </p>
                          </p>
                        </div>
                      </>
                    )}
                  </>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="submitmenu">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                />

                {inputMessage === "" ? (
                  <></>
                ) : (
                  <button type="submit" id="sendbutton">
                    <img src="./send.png" id="sendicon" alt="send" />
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="chatbot-container">
        <div id="chatbox" className="chatbox">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.sender === "bot" ? "bot-message" : "user-message"
              }`}
            >
              {message.content}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
};

export default Chatbot;
