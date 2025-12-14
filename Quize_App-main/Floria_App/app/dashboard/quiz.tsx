// app/dashboard/quiz.tsx
import React, { useEffect, useMemo, useState } from "react";
import FloriaHeader from "@/components/ui/FloriaHeader";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useSupabase } from "@/context/SupabaseContext";
import type { Country } from "@/types";
import * as Speech from "expo-speech";

const checkIcon = require("@/assets/images/check.png");
const crossIcon = require("@/assets/images/cross.png");

const TOTAL_QUESTIONS = 10;

type Question = {
  country: Country;
  options: Country[];
};

function createQuestion(countries: Country[]): Question | null {
  if (!countries || countries.length < 4) return null;

  const correctIndex = Math.floor(Math.random() * countries.length);
  const country = countries[correctIndex];

  const otherCountries = countries
    .filter((c) => c.id !== country.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const options = [country, ...otherCountries].sort(
    () => Math.random() - 0.5
  );

  return { country, options };
}

const QuizScreen = () => {
  const { countries, loading, error } = useSupabase();

  const [questionIndex, setQuestionIndex] = useState(1);
  const [score, setScore] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [finished, setFinished] = useState(false);

  const quizCountries = useMemo(
    () =>
      countries.filter(
        (c) => c.flag_url && c.flag_url.trim() !== ""
      ),
    [countries]
  );

  useEffect(() => {
    if (quizCountries.length >= 4) {
      setQuestion(createQuestion(quizCountries));
      setQuestionIndex(1);
      setScore(0);
      setSelectedId(null);
      setFinished(false);
    } else {
      setQuestion(null);
      setFinished(false);
    }
  }, [quizCountries]);

  const progress = useMemo(
    () => questionIndex / TOTAL_QUESTIONS,
    [questionIndex]
  );

  const handleAnswer = (answer: Country) => {
    if (!question || selectedId !== null || finished) return;

    setSelectedId(answer.id);

    if (answer.id === question.country.id) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      setSelectedId(null);

      if (questionIndex < TOTAL_QUESTIONS) {
        const next = createQuestion(quizCountries);
        if (next) {
          setQuestion(next);
          setQuestionIndex((prev) => prev + 1);
        } else {
          setFinished(true);
          setQuestion(null);
        }
      } else {
        setFinished(true);
        setQuestion(null);
      }
    }, 800);
  };

  const handlePlayAgain = () => {
    Speech.stop(); // stop evt. lopende spraak
    if (quizCountries.length >= 4) {
      setQuestion(createQuestion(quizCountries));
      setQuestionIndex(1);
      setScore(0);
      setSelectedId(null);
      setFinished(false);
    }
  };

  const speakResult = (message: string, subMessage: string) => {
    const text = `You scored ${score} out of ${TOTAL_QUESTIONS}. ${message}. ${subMessage}`;
    Speech.stop();
    Speech.speak(text, {
      language: "en",
      pitch: 1.0,
      rate: 1.0,
    });
  };

  /* ==== loading / error ==== */

  if (loading) {
    return (
      <SafeAreaView style={styles.centerScreen}>
        <ActivityIndicator />
        <Text style={styles.centerText}>Landen aan het laden...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centerScreen}>
        <Text style={styles.centerText}>Fout bij het ophalen van landen:</Text>
        <Text style={styles.errorText}>{error.message}</Text>
      </SafeAreaView>
    );
  }

  if (!finished && !question) {
    return (
      <SafeAreaView style={styles.centerScreen}>
        <Text style={styles.centerText}>
          Er zijn nog geen vragen mogelijk. Voeg minstens vier landen mét vlag toe aan
          de Supabase-tabel <Text style={styles.bold}>countries</Text>.
        </Text>
      </SafeAreaView>
    );
  }

  /* ==== SCORE SCREEN ==== */

  if (finished) {
    const wrong = TOTAL_QUESTIONS - score;
    let message = "Nice try!";
    let subMessage = "You're on your way";
    if (score === TOTAL_QUESTIONS) {
      message = "Perfect!";
      subMessage = "You are a world champion";
    } else if (score >= 7) {
      message = "Great job!";
      subMessage = "Almost perfect!";
    } else if (score <= 3) {
      message = "Keep practicing!";
      subMessage = "You'll get there!";
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        <FloriaHeader section="quiz" />

        <View style={styles.scoreContainer}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Your result</Text>

            <Text style={styles.scoreNumber}>
              {score}/{TOTAL_QUESTIONS}
            </Text>

            <Text style={styles.scoreMessage}>{message}</Text>
            <Text style={styles.scoreSubMessage}>{subMessage}</Text>

            <View style={styles.scoreRow}>
              <View style={styles.scoreItem}>
                <Image source={checkIcon} style={styles.scoreIcon} />
                <Text style={styles.scoreRight}>{score} right</Text>
              </View>

              <View style={styles.scoreItem}>
                <Image source={crossIcon} style={styles.scoreIcon} />
                <Text style={styles.scoreWrong}>{wrong} wrong</Text>
              </View>
            </View>

            {/* Expo Speech knop */}
            <TouchableOpacity
              style={styles.speakButton}
              onPress={() => speakResult(message, subMessage)}
            >
              <Text style={styles.speakButtonText}>Read result aloud</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={handlePlayAgain}
            >
              <Text style={styles.playAgainText}>Play again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // vanaf hier bestaat `question` zeker
  const currentQuestion = question as Question;

  /* ==== QUIZ SCREEN ==== */

  return (
    <SafeAreaView style={styles.safeArea}>
      <FloriaHeader section="quiz" />

      {/* Vraag teller + progress bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.questionCounter}>
          Question {questionIndex} of {TOTAL_QUESTIONS}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(progress, 1) * 100}%` },
            ]}
          />
        </View>
      </View>

      <Text style={styles.questionTitle}>What Country ?</Text>

      <View style={styles.flagContainer}>
        {currentQuestion.country.flag_url ? (
          <Image
            source={{ uri: currentQuestion.country.flag_url }}
            style={styles.flagImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.flagPlaceholder}>
            <Text style={styles.flagPlaceholderText}>No flag available</Text>
          </View>
        )}
      </View>

      <View style={styles.optionsGrid}>
        {currentQuestion.options.map((option) => {
          const isSelected = selectedId === option.id;
          const isCorrect =
            selectedId !== null && option.id === currentQuestion.country.id;
          const isWrong =
            selectedId !== null &&
            option.id === selectedId &&
            option.id !== currentQuestion.country.id;

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                isCorrect && styles.optionButtonCorrect,
                isWrong && styles.optionButtonWrong,
              ]}
              onPress={() => handleAnswer(option)}
              disabled={selectedId !== null}
            >
              <Text style={styles.optionText}>{option.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default QuizScreen;

/* ===== styles ===== */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },

  // Progress
  progressContainer: {
    marginBottom: 24,
  },
  questionCounter: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  progressBar: {
    height: 8,
    borderRadius: 9999,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginTop: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "white",
  },

  // Vraag
  questionTitle: {
    marginTop: 16,
    marginBottom: 24,
    color: "#ffffff",
    fontSize: 28,
    fontStyle: "italic",
    textAlign: "center",
    fontWeight: "600",
  },

  // Vlag
  flagContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  flagImage: {
    width: 280,
    height: 160,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(5, 5, 5, 0.5)",
  },
  flagPlaceholder: {
    width: 280,
    height: 160,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(11, 10, 10, 0.5)",
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  flagPlaceholderText: {
    color: "#ffffff",
  },

  // Opties
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionButton: {
    width: "48%",
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f5f5f7ff",
    backgroundColor: "#000000",
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  optionButtonCorrect: {
    backgroundColor: "#15803d",
    borderColor: "#4ade80",
  },
  optionButtonWrong: {
    backgroundColor: "#b91c1c",
    borderColor: "#f87171",
  },
  optionText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 14,
  },

  // Center screens
  centerScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  centerText: {
    color: "#ffffff",
    textAlign: "center",
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    color: "#f97373",
    textAlign: "center",
    marginTop: 8,
  },
  bold: {
    fontWeight: "700",
  },

  // Score screen
  scoreContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
  },

  scoreCard: {
    width: "100%",
    minHeight: 260,
    backgroundColor: "rgba(0,0,0,0.75)",
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f8fafbff",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },

  scoreLabel: {
    color: "#e5e7eb",
    fontSize: 18,
    marginBottom: 4,
  },
  scoreNumber: {
    color: "#ffffff",
    fontSize: 62,
    fontWeight: "800",
    marginBottom: 18,
  },
  scoreMessage: {
    color: "#ffffff",
    fontSize: 22,
    textAlign: "center",
  },
  scoreSubMessage: {
    color: "#e5e7eb",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 28,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  scoreItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreIcon: {
    width: 22,
    height: 22,
    marginRight: 6,
  },
  scoreRight: {
    color: "#4ade80",
    fontSize: 16,
  },
  scoreWrong: {
    color: "#fb7185",
    fontSize: 16,
  },

  speakButton: {
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#38bdf8",
  },
  speakButtonText: {
    color: "#38bdf8",
    fontSize: 14,
    fontWeight: "600",
  },

  playAgainButton: {
    backgroundColor: "#3d3e3eff",
    borderRadius: 9999,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: "100%",
  },
  playAgainText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
