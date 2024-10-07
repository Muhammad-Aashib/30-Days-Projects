"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";


//Interface For Jokes
interface JokeResponse {
    setup: string;
    punchline: string;
  }

  export default function RandomJoke() {

    //State Hooks For Managing the Current Joke
    const [joke, setJoke] = useState<string>("");

    //State Hooks For Managing the Intital Joke
    useEffect(() => {
        fetchJoke();
      }, []);

      //Async Function to fetch a Joke from the API
      async function fetchJoke(): Promise<void> {
        try {
          const response = await fetch(
            "https://official-joke-api.appspot.com/random_joke"
          );
          const data: JokeResponse = await response.json();
          setJoke(`${data.setup} - ${data.punchline}`);
        } catch (error) {
          console.error("Error fetching joke:", error);
          setJoke("Failed to fetch joke. Please try again.");
        }
      }

      //JSX Statement
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#ffa500] to-[#ff6b6b] p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
            <h1 className="text-3xl font-bold mb-4 text-[#333]">😂 Random Joke 👈</h1>
            <div className="bg-[#f5f5f5] rounded-lg p-6 mb-6 text-[#555] text-lg">
              {joke || "Loading..."}
            </div>
            <Button
              onClick={fetchJoke}
              className="bg-[#4caf50] hover:bg-[#43a047] text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
            >
              😂 Get New Joke 😂
            </Button>
          </div>
        </div>
      );
    }