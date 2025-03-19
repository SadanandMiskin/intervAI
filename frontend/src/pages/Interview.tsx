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
  const [timer, setTimer] = useState(180);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [interviewComplete, setInterviewComplete] = useState(false);

  useEffect(() => {
    if (!globalSocket) {
      navigate("/");
      return;
    }

    globalSocket.on("receiveQuestion", (question: Question) => {
      speakText(question.question);
      setCurrentQuestion(question);
      setTimer(180);
      setTranscript(null);
    });

    globalSocket.on("interviewComplete", () => {
      setInterviewComplete(true);
    });

    globalSocket.on("interviewFeedback", (feedback) => {
      navigate("/results", { state: { feedback } }); // Navigate to results page with feedback data
    });

    return () => {
      globalSocket.off("receiveQuestion");
      globalSocket.off("interviewComplete");
      globalSocket.off("interviewFeedback");
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
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const startRecording = () => {
    const recognitionInstance = new (window as any).webkitSpeechRecognition();
    recognitionInstance.lang = "en-US";
    recognitionInstance.continuous = true; // Keeps recording until user stops
    recognitionInstance.interimResults = false; // Only capture final speech

    recognitionInstance.onstart = () => {
      setIsRecording(true);
      setTranscript(""); // Reset transcript
    };

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
    };

    recognitionInstance.onerror = (event) => console.error("Speech Recognition Error:", event);

    recognitionInstance.onend = () => {
      setIsRecording(false);
    };

    setRecognition(recognitionInstance);
    recognitionInstance.start();
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
      setRecognition(null);
    }
  };

  const handleSaveAndNext = async () => {
    if (!currentQuestion || transcript === null) return;

    globalSocket?.emit("saveAnswer", { question: currentQuestion.question, answer: transcript });

    setCurrentQuestion(null);
    setTranscript(null);
    setIsRecording(false);
    setRecognition(null);

    globalSocket?.emit("nextQuestion");
  };

  const handleSkipQuestion = () => {
    if (!currentQuestion) return;

    globalSocket?.emit("saveAnswer", { question: currentQuestion.question, answer: "" });

    setCurrentQuestion(null);
    setTranscript(null);
    setIsRecording(false);
    setRecognition(null);

    globalSocket?.emit("nextQuestion");
  };

  const handleSubmitInterview = () => {
    const user = localStorage.getItem('user')
    globalSocket?.emit("submitInterview", {user: user});
  };

  return (
    <div>
      <h2>Interview Session</h2>

      {!started ? (
        <div>
          <button onClick={() => setStarted(true)}>Start Interview</button>
        </div>
      ) : (
        <div>
          {currentQuestion ? (
            <>
              <h3>{currentQuestion.question}</h3>
              <p>Time left: {timer}s</p>

              <button onClick={startRecording} disabled={isRecording}>
                {isRecording ? "Recording..." : "Start Recording"}
              </button>

              {isRecording && (
                <button onClick={stopRecording}>Stop Recording</button>
              )}

              {transcript && (
                <div>
                  <p><strong>Your Answer:</strong> {transcript}</p>
                  <button onClick={handleSaveAndNext}>Save & Next</button>
                  <button onClick={handleSkipQuestion}>Skip Question</button>
                </div>
              )}
            </>
          ) : (
            <p>Loading next question...</p>
          )}

          {interviewComplete && (
            <button onClick={handleSubmitInterview}>Submit Interview</button>
          )}
        </div>
      )}
    </div>
  );
};