import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Quiz from "./Quiz";

export const metadata: Metadata = {
  title: "Find Your AI Pair — vbarrai",
  description:
    "Take a 15-question personality quiz to discover your developer style and find the AI agent persona that matches how you work.",
};

export default function QuizPage() {
  return (
    <>
      <Navbar />
      <Quiz />
    </>
  );
}
