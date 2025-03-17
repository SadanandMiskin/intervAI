import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface Question {
  type: string;
  question: string;
  topics: string[];
}

export const Interview = ({ globalSocket }: { globalSocket: Socket | null }) => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [started, setStarted] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [timer, setTimer] = useState(180); // 3-minute timer
  const [isRecording, setIsRecording] = useState(false);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);

  const greetings = [
    "Hello! Welcome to your mock interview.",
    "Hey there! Ready to sharpen your skills?",
    "Hi! Let's get started with your interview practice.",
    "Welcome! Let's see how well you perform today.",
    "Good day! Are you ready for some challenging questions?",
  ];

  useEffect(() => {
    if (!globalSocket) {
      navigate("/"); // Redirect to home if socket is missing
      return;
    }

    // Pick a random greeting and start TTS
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setGreeting(randomGreeting);
    speakText(randomGreeting);

    globalSocket.on("receiveQuestion", (question: Question) => {
      speakText(question.question); // Speak the question before showing it
      setCurrentQuestion(question);
      setTimer(180); // Reset timer
      setAnswer(""); // Reset answer
    });

    return () => {
      globalSocket.off("receiveQuestion");
    };
  }, [globalSocket, navigate]);

  useEffect(() => {
    if (started && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [started, timer]);

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const startRecording = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setAnswer(transcript);
    };
    recognition.onerror = (event) => console.error("Speech Recognition Error:", event);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  const handleStartInterview = () => {
    setStarted(true);
    if (globalSocket) {
      globalSocket.emit("nextQuestion");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion) {
      setAnswers((prev) => [...prev, { question: currentQuestion.question, answer }]);
    }

    if (globalSocket) {
      globalSocket.emit("nextQuestion");
    }
  };

  const handleSkipQuestion = () => {
    if (currentQuestion) {
      setAnswers((prev) => [...prev, { question: currentQuestion.question, answer: "" }]);
    }

    if (globalSocket) {
      globalSocket.emit("nextQuestion");
    }
  };

  return (
    <div>
      <h2>Interview Session</h2>

      {!started ? (
        <div>
          <h3>{greeting}</h3>
          <button onClick={handleStartInterview}>I'm good and Start</button>
        </div>
      ) : (
        <div>
          {currentQuestion ? (
            <>
              <h3>{currentQuestion.question}</h3>
              <p>Time left: {timer}s</p>

              <button onClick={startRecording} disabled={isRecording}>
                {isRecording ? "Recording..." : "Start Answering"}
              </button>

              <p><strong>Your Answer:</strong> {answer || "No answer yet"}</p>

              <button onClick={handleNextQuestion}>Next Question</button>
              <button onClick={handleSkipQuestion}>Skip Question</button>
            </>
          ) : (
            <p>Loading questions...</p>
          )}
        </div>
      )}
    </div>
  );
};
