import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMic,
  FiMicOff,
  FiVolume2,
  FiVolumeX,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiSettings,
  FiRefreshCw,
} from "react-icons/fi";

const VoiceSearch = ({ onVoiceResult, onClose, isOpen }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if (!window.webkitSpeechRecognition && !window.SpeechRecognition) {
      setIsSupported(false);
      setError("Speech recognition is not supported in this browser");
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
      startVisualization();
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          setConfidence(confidence);
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript);
      setInterimTranscript(interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      stopVisualization();

      switch (event.error) {
        case "no-speech":
          setError("No speech detected. Please try again.");
          break;
        case "audio-capture":
          setError("Microphone access denied. Please check permissions.");
          break;
        case "not-allowed":
          setError("Microphone access denied. Please allow microphone access.");
          break;
        case "network":
          setError("Network error. Please check your connection.");
          break;
        default:
          setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      stopVisualization();
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopVisualization();
    };
  }, []);

  const startVisualization = () => {
    if (!isMuted) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          audioContextRef.current = new (window.AudioContext ||
            window.webkitAudioContext)();
          analyserRef.current = audioContextRef.current.createAnalyser();
          microphoneRef.current =
            audioContextRef.current.createMediaStreamSource(stream);

          analyserRef.current.fftSize = 256;
          microphoneRef.current.connect(analyserRef.current);

          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const updateVisualization = () => {
            if (isListening) {
              analyserRef.current.getByteFrequencyData(dataArray);
              const average = dataArray.reduce((a, b) => a + b) / bufferLength;
              setConfidence(average / 255);
              animationFrameRef.current =
                requestAnimationFrame(updateVisualization);
            }
          };

          updateVisualization();
        })
        .catch((err) => {
          console.error("Error accessing microphone:", err);
          setIsMuted(true);
        });
    }
  };

  const stopVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript("");
      setInterimTranscript("");
      setError("");
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      setIsProcessing(true);
      // Simulate processing delay
      setTimeout(() => {
        onVoiceResult(transcript);
        setIsProcessing(false);
        onClose();
      }, 1000);
    }
  };

  const handleRetry = () => {
    setTranscript("");
    setInterimTranscript("");
    setError("");
    startListening();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Voice Search
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Not Supported */}
          {!isSupported && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Not Supported
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Close
              </button>
            </div>
          )}

          {/* Voice Interface */}
          {isSupported && (
            <>
              {/* Visual Feedback */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <motion.div
                    animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                    transition={{
                      duration: 1,
                      repeat: isListening ? Infinity : 0,
                    }}
                    className={`w-24 h-24 rounded-full flex items-center justify-center ${
                      isListening
                        ? "bg-blue-500 animate-pulse"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}>
                    {isListening ? (
                      <FiMicOff className="w-8 h-8 text-white" />
                    ) : (
                      <FiMic className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                    )}
                  </motion.div>

                  {/* Audio Visualization */}
                  {isListening && (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border-4 border-blue-300 opacity-50"
                    />
                  )}
                </div>

                {/* Confidence Bar */}
                {isListening && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${confidence * 100}%` }}
                        animate={{ width: `${confidence * 100}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Confidence: {Math.round(confidence * 100)}%
                    </p>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="text-center mb-6">
                {isListening ? (
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    Listening... Speak now
                  </p>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    Click the microphone to start voice search
                  </p>
                )}
              </div>

              {/* Transcript Display */}
              <div className="mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-[80px]">
                  {transcript && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Final:
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {transcript}
                      </p>
                    </div>
                  )}
                  {interimTranscript && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Interim:
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 italic">
                        {interimTranscript}
                      </p>
                    </div>
                  )}
                  {!transcript && !interimTranscript && (
                    <p className="text-gray-400 dark:text-gray-500 text-center">
                      Your speech will appear here...
                    </p>
                  )}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FiAlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-2 rounded-full transition-colors ${
                      isMuted
                        ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    }`}>
                    {isMuted ? (
                      <FiVolumeX className="w-4 h-4" />
                    ) : (
                      <FiVolume2 className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={handleRetry}
                    className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <FiRefreshCw className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  {isListening ? (
                    <button
                      onClick={stopListening}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
                      Stop
                    </button>
                  ) : (
                    <button
                      onClick={startListening}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                      Start
                    </button>
                  )}

                  {transcript && !isListening && (
                    <motion.button
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      onClick={handleSubmit}
                      disabled={isProcessing}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center space-x-2">
                      {isProcessing ? (
                        <>
                          <FiRefreshCw className="w-4 h-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <FiCheck className="w-4 h-4" />
                          <span>Search</span>
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Voice Search Tips:
                </h4>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Speak clearly and at a normal pace</li>
                  <li>• Say product names, brands, or categories</li>
                  <li>
                    • Use natural language like "show me wireless headphones"
                  </li>
                  <li>• Try "under $100" or "with 4+ stars" for filters</li>
                </ul>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceSearch;
