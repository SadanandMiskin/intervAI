import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

// Add type definitions for the Web Speech API
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

// Declare the global SpeechRecognition constructor
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
  const [greeting] = useState("Welcome to your interview session! I'm your AI interviewer today. When you're ready, click 'Start Interview' and I'll guide you through a series of questions.");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [textareaContent, setTextareaContent] = useState("");
  const [inputMethod, setInputMethod] = useState<"text" | "recording" | null>(null);
  // const GREETINGS = [
  //   "Welcome to your interview session! I'm your AI interviewer today. When you're ready, we'll go through a series of questions to assess your skills.",
  //   "Hello and welcome to your interview! I'll be guiding you through some questions today. Take your time and answer as best as you can.",
  //   "Thank you for joining the interview session. I'll start by asking you a few questions. Let's begin when you're ready.",
  //   "Good day! This is your AI interviewer. We'll proceed with the interview questions one by one. Feel free to start when you're prepared.",
  //   "Welcome! Let's kick off the interview. I'll ask you some questions, and you can respond at your own pace. Ready to start?"
  // ];

  const animationRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      navigate("/results", { state: { feedback } });
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

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasDimensions = () => {
      const width = canvas.parentElement?.clientWidth || 300;
      const height = canvas.parentElement?.clientHeight || 500;
      canvas.width = width;
      canvas.height = height;
    };

    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    let noiseOffset = 0;
    let colorHue = 0;
    const shadowPoints = Array.from({ length: 50 }, () => Math.random() * Math.PI * 2);

    const noise = (x: number) => {
      return Math.sin(x) * 0.5 + Math.sin(x * 2.2) * 0.3 + Math.sin(x * 4.7) * 0.2;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseSize = Math.min(canvas.width, canvas.height) * 0.3;

      const createShadowPath = (phase: number) => {
        const points = shadowPoints.map((angle, i) => {
          const noiseValue = noise(noiseOffset + i * 0.1 + phase);
          const displacement = baseSize * 0.7 * noiseValue;
          return {
            x: centerX + Math.cos(angle) * (baseSize + displacement),
            y: centerY + Math.sin(angle) * (baseSize + displacement)
          };
        });

        return points;
      };

      const drawShadowLayer = (points: Array<{x: number, y: number}>, phaseOffset: number) => {
        ctx.beginPath();
        points.forEach((point, i) => {
          const nextPoint = points[(i + 1) % points.length];
          if (i === 0) ctx.moveTo(point.x, point.y);
          ctx.lineTo(nextPoint.x, nextPoint.y);
        });
        ctx.closePath();

        const gradient = ctx.createLinearGradient(
          centerX + Math.cos(colorHue) * baseSize,
          centerY + Math.sin(colorHue) * baseSize,
          centerX + Math.cos(colorHue + Math.PI) * baseSize,
          centerY + Math.sin(colorHue + Math.PI) * baseSize
        );

        gradient.addColorStop(0, `hsl(${(colorHue * 180/Math.PI + phaseOffset) % 360}, 100%, 80%)`);
        gradient.addColorStop(0.5, `hsl(${(colorHue * 180/Math.PI + 120 + phaseOffset) % 360}, 90%, 70%)`);
        gradient.addColorStop(1, `hsl(${(colorHue * 180/Math.PI + 240 + phaseOffset) % 360}, 89%, 100%)`);

        ctx.fillStyle = gradient;
        ctx.filter = `blur(${baseSize * 0.1}px) opacity(${isSpeaking ? 0.7 : 0.3})`;
        ctx.fill();
      };

      const frontPoints = createShadowPath(1);
      drawShadowLayer(frontPoints, -30);

      const pulse = Math.sin(Date.now() * 0.005) * (isSpeaking ? 7 : 5);
      const coreGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, baseSize + pulse
      );
      coreGradient.addColorStop(0, `hsla(180, 10%, 100%, ${isSpeaking ? 0.3 : 0.2})`);
      coreGradient.addColorStop(1, `hsla(210, 10%, 80%, ${isSpeaking ? 0.3 : 0.1})`);

      ctx.beginPath();
      ctx.arc(centerX, centerY, baseSize + pulse, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.filter = 'none';
      ctx.fill();

      noiseOffset += isSpeaking ? 0.05 : 0.02;
      colorHue += isSpeaking ? 0.03 : 0.01;
      shadowPoints.forEach((_, i) => {
        shadowPoints[i] += (isSpeaking ? 0.02 : 0.005) * (i % 2 ? 1 : -1);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isSpeaking]);

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
    speakText(greeting);
    globalSocket?.emit("nextQuestion");
  };

  const startRecording = () => {
    setInputMethod("recording");

    // Use the correct SpeechRecognition constructor with proper type checking
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-0 m-0 overflow-auto flex flex-col md:flex-row">

      <div className="w-full md:w-3/10 relative flex flex-col bg-gradient-to-b from-indigo-900 to-blue-900 items-center justify-center">
        <div className="px-6 py-8 flex flex-col items-center justify-center h-full w-full">
          <div className="relative w-full aspect-square max-w-md mb-4">
            <canvas
              ref={canvasRef}
              className="w-full h-full rounded-full"
            ></canvas>
            <div className={`absolute inset-0 rounded-full ${isSpeaking ? 'animate-pulse' : ''} bg-indigo-500 bg-opacity-10 -z-10`}></div>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-white mb-2 text-center">AI Interviewer</h2>
          <p className="text-indigo-200 text-sm md:text-base text-center">
            {isSpeaking ? "Speaking..." : "Listening..."}
          </p>

          {!started && (
            <button
              onClick={handleStartInterview}
              className="mt-8 px-6 py-3 bg-indigo-500 text-white font-medium rounded-xl shadow-lg hover:bg-indigo-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 transform hover:scale-105"
            >
              Start Interview
            </button>
          )}
        </div>
      </div>

      <div className="w-full md:w-7/10 overflow-y-auto md:h-screen">
        <div className="p-6 md:p-10 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-8">Interview Session</h1>

          {!started ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 transform transition-all duration-500">
              <p className="text-gray-700 text-lg leading-relaxed mb-4">{greeting}</p>
              <p className="text-gray-600 mb-6">Click the button on the left to begin your interview experience.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {currentQuestion ? (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500">
                  <div className="bg-gradient-to-r from-indigo-700 to-blue-700 px-6 py-5">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                      <h3 className="text-xl font-semibold text-white mb-2 sm:mb-0">Current Question</h3>
                      <div className="bg-indigo-900 bg-opacity-30 px-4 py-2 rounded-lg">
                        <p className="text-white">Time: <span className="font-mono font-bold">{timer}s</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="bg-indigo-50 p-5 rounded-xl mb-6">
                      <p className="text-gray-800 text-lg">{currentQuestion.question}</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={inputMethod === "text"}
                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium shadow-md transition-all duration-300 ${
                          isRecording
                            ? 'bg-red-600 hover:bg-red-700 animate-pulse text-white'
                            : inputMethod === "text"
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        <span className={`h-3 w-3 rounded-full ${isRecording ? 'bg-red-300' : inputMethod === "text" ? 'bg-gray-400' : 'bg-indigo-300'}`}></span>
                        {isRecording ? "Stop Recording" : "Start Recording"}
                      </button>



                      {!isRecording && inputMethod === "recording" && (
                        <button
                          onClick={() => {
                            setInputMethod(null);
                            setTranscript(null);
                          }}
                          className="px-4 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors"
                        >
                          Clear Recording
                        </button>
                      )}
                    </div>
                      <div className="w-full text-center mb-4">
                      <p className="bg-green-400/20">or</p>
                      </div>
                    {!isRecording && (
                      <div className="mb-6">

                        <textarea
                          placeholder="Type your answer here..."
                          value={textareaContent}
                          onChange={handleTextareaChange}
                          disabled={inputMethod === "recording"}
                          className={`w-full p-4 border rounded-xl text-gray-700 resize-none min-h-32 transition-all ${
                            inputMethod === "recording"
                              ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                              : 'bg-white border-indigo-200 focus:border-indigo-400 focus:ring focus:ring-indigo-100'
                          }`}
                        ></textarea>
                      </div>
                    )}

                    {transcript !== null && (
                      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-2">Your Answer:</h4>
                        <p className="text-gray-800 mb-6">{transcript}</p>

                        {!isRecording && (
                          <div className="flex flex-wrap gap-3 justify-end">
                            <button
                              onClick={handleClearText}
                              className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Clear Text
                            </button>
                            <button
                              onClick={handleSkipQuestion}
                              className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Skip Question
                            </button>
                            <button
                              onClick={handleSaveAndNext}
                              className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                            >
                              Save & Next
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center min-h-64">
                  {interviewComplete ? (
                    <div className="text-center w-full max-w-md">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Interview Complete!</h3>
                      <p className="text-gray-600 mb-6">All questions are complete, Please submit the interview and check dashboard for Analysis.</p>
                      <button
                        onClick={handleSubmitInterview}
                        disabled={!submitEnabled}
                        className={`w-full px-5 py-3 font-medium rounded-xl shadow-md transition-all ${
                          submitEnabled
                            ? 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
                            : 'bg-green-300 text-white cursor-not-allowed'
                        }`}
                      >
                        {submitEnabled ? "Submit Interview" : "Processing interview..."}
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-600">Loading Question...</p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};