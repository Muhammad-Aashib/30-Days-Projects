"use client"; 
import React, { useState, ChangeEvent } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function WordCounter() {
    // State to Manage the Input Text
  const [text, setText] = useState<string>("");

  // Function to Handle text Input Changes
  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  // Clear the Input Text
  const clearText = () => {
    setText("");
  };

  // Calculate Word Count
  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word).length;

  // Calculate Character Count
  const charCount = text.length;

  //JSX Statement
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center justify-center flex flex-col">
          <CardTitle>Text Analysis</CardTitle>
          <CardDescription>
            Enter text and see the word and character count.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            id="text-input"
            placeholder="Enter your text here..."
            className="h-32 resize-none"
            value={text}
            onChange={handleTextChange}
          />
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <span id="word-count">{wordCount}</span> words,{" "}
              <span id="char-count">{charCount}</span> characters
            </div>
            <Button onClick={clearText}>Clear</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
