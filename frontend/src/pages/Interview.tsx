import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
  item(index: number): SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
  item(index: number): SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Error) => void;
  onend: () => void;
  onstart: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

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
  const [userName, setUserName] = useState<string>("there");
  const [greeting, setGreeting] = useState("");
  const [isGreetingReady, setIsGreetingReady] = useState(false); 
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [textareaContent, setTextareaContent] = useState("");
  const [inputMethod, setInputMethod] = useState<"text" | "recording" | null>(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  // const [GREETINGS , setG] = useState()
//  const GREETINGS = [

//       ];
  useEffect(() => {
    
    const user = localStorage.getItem('user');
    try {
      const U = JSON.parse(user || '{}'); 
      setUserName(U?.username || "there");
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      setUserName("there");
    }
    setIsGreetingReady(true);
  }, []);

  useEffect(() => {
    if (isGreetingReady) {
      const GREETINGS = [
        `Welcome ${userName} to your interview session! I'm your AI interviewer today. When you're ready, we'll go through a series of questions to assess your skills.`,
            `Hello ${userName} and welcome to your interview! I'll be guiding you through some questions today. Take your time and answer as best as you can.`,
            `Thank you for joining the interview session, ${userName}. I'll start by asking you a few questions. Let's begin when you're ready.`,
            `Good day! ${userName}, This is your AI interviewer. We'll proceed with the interview questions one by one. Feel free to start when you're prepared.`,
            `Welcome! ${userName}, Let's kick off the interview. I'll ask you some questions, and you can respond at your own pace. Ready to start?`,
            `Hey ${userName}, Hope you are doing great! Let's start your interview session! When you're ready, click 'Start Interview' and I'll guide you through a series of questions.`
        
          ]
      const greet = GREETINGS[Math.floor(Math.random() * GREETINGS.length )]
      // const fullGreeting = `Hey ${userName}, Hope you are doing great! Let's start your interview session! When you're ready, click 'Start Interview' and I'll guide you through a series of questions.`;
      setGreeting(greet); 
      speakText(greet); 
    }
  }, [isGreetingReady, userName]); 

  useEffect(() => {
    if (!globalSocket) {
      navigate("/");
      return;
    }
    globalSocket.on("receiveQuestion", (question: Question) => {
      if (started) {
        speakText(question.question);
      }
      setCurrentQuestion(question);
      setTimer(180);
      setTranscript(null);
      setTextareaContent("");
      setInputMethod(null);
    });
    globalSocket.on("interviewComplete", () => {
      if (started) {
        speakText("The interview is now complete. Please wait for a while till I process the interview and check in dashboard for Analysis.");
      }
      setInterviewComplete(true);
      setTimeout(() => {
        setSubmitEnabled(true);
      }, 8000);
    });
    globalSocket.on("interviewFeedback", (feedback) => {
      navigate("/dashboard", { state: { feedback } });
    });
    return () => {
      globalSocket.off("receiveQuestion");
      globalSocket.off("interviewComplete");
      globalSocket.off("interviewFeedback");
      speechSynthesis.cancel();
    };
  }, [globalSocket, navigate, started]);

  useEffect(() => {
    if (started && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [started, timer]);

  const speakText = (text: string) => {
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const handleStartInterview = () => {
    setStarted(true);
    globalSocket?.emit("nextQuestion");
  };

  const startRecording = () => {
    setInputMethod("recording");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = "en-US";
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = false;
    recognitionInstance.onstart = () => {
      setIsRecording(true);
      setTranscript("");
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

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaContent(e.target.value);
    if (inputMethod !== "text" && e.target.value.length > 0) {
      setInputMethod("text");
    }
    if (e.target.value.length > 0) {
      setTranscript(e.target.value);
    } else {
      setTextareaContent('')
      setTranscript(null)
      setInputMethod(null)
    }
  };

  const handleSaveAndNext = async () => {
    if (!currentQuestion || transcript === null) return;
    globalSocket?.emit("saveAnswer", { question: currentQuestion.question, answer: transcript });
    setCurrentQuestion(null);
    setTranscript(null);
    setIsRecording(false);
    setRecognition(null);
    setTextareaContent("");
    setInputMethod(null);
    globalSocket?.emit("nextQuestion");
  };

  const handleSkipQuestion = () => {
    if (!currentQuestion) return;
    globalSocket?.emit("saveAnswer", { question: currentQuestion.question, answer: "" });
    setCurrentQuestion(null);
    setTranscript(null);
    setIsRecording(false);
    setRecognition(null);
    setTextareaContent("");
    setInputMethod(null);
    globalSocket?.emit("nextQuestion");
  };

  const handleSubmitInterview = () => {
    const user = localStorage.getItem('user');
    globalSocket?.emit("submitInterview", {user: user});
  };

  const handleClearText = () => {
    setTextareaContent('')
    setTranscript(null)
    setInputMethod(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-0 m-0 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            AI
          </div>
          <h1 className="text-xl font-medium text-gray-800">IntervAI session</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Participants</span>
          </button>
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
            You
          </div>
        </div>
      </header>

      {/* Warning Message */}
      {showWarning && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 flex items-center justify-between" role="alert">
          <p className="font-bold">Important:</p>
          <p>Please do not refresh the page until you submit your interview to save your progress.</p>
          <button
            onClick={() => setShowWarning(false)}
            className="ml-4 text-yellow-700 hover:text-yellow-900 focus:outline-none"
            aria-label="Dismiss warning"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className={`flex-1 flex flex-col ${showParticipants ? 'md:w-3/4' : 'w-full'}`}>
          {/* Video/Avatar Area */}
          <div className="flex-1 bg-gray-100 flex items-center justify-center relative">
            {/* AI Interviewer Block */}
            <div className="relative w-64 h-64 bg-white rounded-lg shadow-md flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-50 rounded-lg flex items-center justify-center">
                <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-gray-700 font-medium">AI Interviewer</p>
                {isSpeaking && (
                  <div className="flex justify-center space-x-1 mt-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                )}
              </div>
            </div>

            {/* User Block */}
            <div className={`relative w-64 h-64 bg-white rounded-lg shadow-md flex items-center justify-center ml-8
              ${isRecording ? 'ring-4 ring-red-300 ring-opacity-75 animate-pulse' : ''}`}
            >
              <div className="absolute inset-0 bg-green-50 rounded-lg flex items-center justify-center">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center
                  ${isRecording ? 'bg-red-100' : 'bg-green-100'}`}>
                  {isRecording ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-gray-700 font-medium">You</p>
                {isRecording && (
                  <div className="flex justify-center space-x-1 mt-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  </div>
                )}
              </div>
            </div>

            {/* Timer */}
            <div className="absolute top-4 right-4 left-4 text-center bg-white px-3 py-1 rounded-full shadow-sm text-sm font-medium">
              {timer > 0 ? `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}` : "0:00"}
            </div>

            {/* Canvas for animation effects */}
            {/* <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" /> */}
          </div>

          {/* Controls and Question Area */}
          <div className="bg-white border-t border-gray-200 p-4">
            {!started ? (
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-xl font-medium text-gray-800 mb-3">Ready to begin your interview?</h2>
                {/* The greeting text is still displayed here for the user to read */}
                <p className="text-gray-600 mb-6">{greeting}</p>
                <button
                  onClick={handleStartInterview}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition-colors"
                >
                  Start Interview
                </button>
              </div>
            ) : currentQuestion ? (
              <div className="max-w-3xl mx-auto">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-1">Current Question</h3>
                  <p className="text-gray-800">{currentQuestion.question}</p>
                </div>
                <div className="flex flex-col space-y-4">
                  <div className="flex space-x-3 justify-center">
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={inputMethod === "text"}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
                        isRecording
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : inputMethod === "text"
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-300' : 'bg-gray-400'}`}></span>
                      <span>{isRecording ? "Stop" : "Record"}</span>
                    </button>
                    {!isRecording && inputMethod === "recording" && (
                      <button
                        onClick={() => {
                          setInputMethod(null);
                          setTranscript(null);
                        }}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {!isRecording && (
                    <div>
                      <textarea
                        placeholder="Or type your answer here..."
                        value={textareaContent}
                        onChange={handleTextareaChange}
                        disabled={inputMethod === "recording"}
                        className={`w-full p-3 border rounded-lg text-gray-700 resize-none min-h-24 ${
                          inputMethod === "recording"
                            ? 'bg-gray-100 cursor-not-allowed'
                            : 'bg-white border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-100'
                        }`}
                      ></textarea>
                    </div>
                  )}
                  {(transcript !== null ) && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Your Answer</h4>
                      <p className="text-gray-800 mb-4">{transcript}</p>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleClearText}
                          className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                        >
                          Clear
                        </button>
                        <button
                          onClick={handleSkipQuestion}
                          className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                        >
                          Skip
                        </button>
                        <button
                          onClick={handleSaveAndNext}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleSkipQuestion}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    Skip
                  </button>
                </div>
              </div>
            ) : interviewComplete ? (
              <div className="max-w-md mx-auto text-center bg-white p-6 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Interview Complete!</h3>
                <p className="text-gray-600 mb-4">Thank you for completing the interview. You can now submit your responses.</p>
                <button
                  onClick={handleSubmitInterview}
                  disabled={!submitEnabled}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    submitEnabled
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-300 text-white cursor-not-allowed'
                  }`}
                >
                  {submitEnabled ? "Submit Interview" : "Processing..."}
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Loading next question...</p>
              </div>
            )}
          </div>
        </div>
        {/* Participants Panel */}
        {showParticipants && (
          <div className="hidden md:block w-1/4 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-800">Participants (1)</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-medium">
                  Y
                </div>
                <div>
                  <p className="font-medium text-gray-800">You</p>
                  <p className="text-xs text-gray-500">Candidate</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-medium">
                  AI
                </div>
                <div>
                  <p className="font-medium text-gray-800">AI Interviewer</p>
                  <p className="text-xs text-gray-500">Interviewer</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
