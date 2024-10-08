"use client";
import { useState, useEffect } from "react"; 
import { Button } from "@/components/ui/button"; 
import { Spinner } from "@/components/ui/spinner"; 
import ClipLoader from "react-spinners/ClipLoader";

//Defining Types
type Answer = {
    text: string;
    isCorrect: boolean;
  };
  
  
  type Question = {
    question: string;
    answers: Answer[];
  };
  
  type QuizState = {
    currentQuestion: number;
    score: number;
    showResults: boolean;
    questions: Question[];
    isLoading: boolean;
  };


  export default function QuizComponent() {
    //State to Manage Quiz
    const [state, setState] = useState<QuizState>({
      currentQuestion: 0,
      score: 0,
      showResults: false,
      questions: [],
      isLoading: true,
    });

    //Fetching Qs from APi
    useEffect(() => {
        const fetchQuestions = async () => {
          try {
            const response = await fetch(
              "https://opentdb.com/api.php?amount=10&type=multiple"
            );
            const data = await response.json();
            const questions = data.results.map((item: any) => {
              const incorrectAnswers = item.incorrect_answers.map(
                (answer: string) => ({
                  text: answer,
                  isCorrect: false,
                })
              );
              const correctAnswer = {
                text: item.correct_answer,
                isCorrect: true,
              };
              return {
                question: item.question,
                answers: [...incorrectAnswers, correctAnswer].sort(
                  () => Math.random() - 0.5
                ),
              };
            });
            setState((prevState) => ({
              ...prevState,
              questions,
              isLoading: false,
            }));
          } catch (error) {
            console.error("Failed to fetch questions:", error);
          }
        };
    
    fetchQuestions();
      }, []);

      //Function to Handle Answers
      const handleAnswerClick = (isCorrect: boolean): void => {
        if (isCorrect) {
          setState((prevState) => ({ ...prevState, score: prevState.score + 1 }));
        }
    
    const nextQuestion = state.currentQuestion + 1;
        if (nextQuestion < state.questions.length) {
          setState((prevState) => ({
            ...prevState,
            currentQuestion: nextQuestion,
          }));
        } else {
          setState((prevState) => ({ ...prevState, showResults: true }));
        }
      };

      //Function to Reset Quiz
      const resetQuiz = (): void => {
        setState({
          currentQuestion: 0,
          score: 0,
          showResults: false,
          questions: state.questions,
          isLoading: false,
        });
      };

      //Show Spinner
      if (state.isLoading) {
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
            <Spinner />
            <p>Loading quiz questions, please wait...</p>
          </div>
        );
      }

      //Message if no Qs Available
      
if (state.questions.length === 0) {
    return <div>No questions available.</div>;
  }

  //Current Qs
  const currentQuestion = state.questions[state.currentQuestion];

  //JSX Statement
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      {state.showResults ? (
        <div className="bg-card p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Results</h2>
          <p className="text-lg mb-4">
            You scored {state.score} out of {state.questions.length}
          </p>
          <Button onClick={resetQuiz} className="w-full">
            Try Again
          </Button>
        </div>
      ) : (
        <div className="bg-card p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">
            Question {state.currentQuestion + 1}/{state.questions.length}
          </h2>
          <p
            className="text-lg mb-4"
            dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
          />
          <div className="grid gap-4">
            {currentQuestion.answers.map((answer, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerClick(answer.isCorrect)}
                className="w-full"
              >
                {answer.text}
              </Button>
            ))}
          </div>
          <div className="mt-4 text-right">
            <span className="text-muted-foreground">Score: {state.score}</span>
          </div>
        </div>
      )}
    </div>
  );
}