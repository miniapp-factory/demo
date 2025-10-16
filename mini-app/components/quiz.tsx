"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { cn } from "@/lib/utils";

type Question = {
  text: string;
  options: string[];
};

const questions: Question[] = [
  {
    text: "What is your primary concern when choosing a Layer‑2 solution?",
    options: [
      "Low transaction fees",
      "Fast confirmation times",
      "Strong security guarantees",
    ],
  },
  {
    text: "How important is developer tooling and ecosystem support?",
    options: [
      "Very important – I want many libraries and tutorials",
      "Somewhat important – I can learn on my own",
      "Not important – I only need basic functionality",
    ],
  },
  {
    text: "Do you prefer a solution that is fully decentralized or one that offers some centralization for speed?",
    options: [
      "Fully decentralized",
      "Some centralization is acceptable",
      "I don't care",
    ],
  },
  {
    text: "Which type of application are you most interested in building?",
    options: [
      "Gaming / NFTs",
      "DeFi / lending",
      "Enterprise / data‑heavy apps",
    ],
  },
  {
    text: "How much risk are you willing to accept for higher throughput?",
    options: [
      "Low risk – I want proven security",
      "Medium risk – I can tolerate some trade‑offs",
      "High risk – I want the fastest possible throughput",
    ],
  },
];

type Result = {
  name: string;
  description: string;
};

const results: Result[] = [
  {
    name: "Optimism",
    description:
      "Optimism offers low fees and fast finality with a strong focus on security and a large developer community.",
  },
  {
    name: "Arbitrum",
    description:
      "Arbitrum balances speed and security, providing a robust ecosystem and excellent tooling for DeFi and gaming projects.",
  },
  {
    name: "Polygon",
    description:
      "Polygon delivers very low fees and high throughput, ideal for gaming, NFTs, and data‑heavy applications with a flexible architecture.",
  },
  {
    name: "zkSync",
    description:
      "zkSync uses zero‑knowledge proofs for high throughput and low fees, with a focus on privacy and strong security guarantees.",
  },
  {
    name: "Base",
    description:
      "Base is a newer Optimistic Rollup with a developer‑friendly experience and strong backing from Coinbase, great for DeFi and NFT projects.",
  },
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[current] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculateResult = (): Result => {
    // Simple scoring: map each answer to a score for each L2
    const scores = {
      Optimism: 0,
      Arbitrum: 0,
      Polygon: 0,
      zkSync: 0,
      Base: 0,
    };

    answers.forEach((answer, idx) => {
      // Very naive mapping – in a real app you'd have a more sophisticated scoring system
      switch (idx) {
        case 0:
          if (answer === "Low transaction fees") scores.Polygon += 1;
          if (answer === "Fast confirmation times") scores.Arbitrum += 1;
          if (answer === "Strong security guarantees") scores.Optimism += 1;
          break;
        case 1:
          if (answer.includes("libraries")) scores.Arbitrum += 1;
          if (answer.includes("tutorials")) scores.Optimism += 1;
          if (answer.includes("basic")) scores.Polygon += 1;
          break;
        case 2:
          if (answer === "Fully decentralized") scores.Optimism += 1;
          if (answer === "Some centralization is acceptable") scores.Arbitrum += 1;
          break;
        case 3:
          if (answer === "Gaming / NFTs") scores.Polygon += 1;
          if (answer === "DeFi / lending") scores.Arbitrum += 1;
          if (answer === "Enterprise / data‑heavy apps") scores.zkSync += 1;
          break;
        case 4:
          if (answer === "Low risk") scores.Optimism += 1;
          if (answer === "Medium risk") scores.Arbitrum += 1;
          if (answer === "High risk") scores.Polygon += 1;
          break;
      }
    });

    // Find the L2 with the highest score
    const best = Object.entries(scores).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
    return results.find((r) => r.name === best)!;
  };

  if (showResult) {
    const result = calculateResult();
    return (
      <Card className="max-w-2xl mx-auto mt-10">
        <CardHeader>
          <CardTitle>Your Ideal Layer‑2 Solution</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-2">{result.name}</h2>
          <p>{result.description}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => { setCurrent(0); setAnswers(Array(questions.length).fill("")); setShowResult(false); }}>
            Take the quiz again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = questions[current];

  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>
          Question {current + 1} of {questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{question.text}</p>
        <RadioGroup value={answers[current]} onValueChange={handleSelect}>
          {question.options.map((opt) => (
            <div key={opt} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={opt} id={opt} />
              <label htmlFor={opt} className="cursor-pointer">
                {opt}
              </label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleNext}
          disabled={answers[current] === ""}
          className={cn(answers[current] === "" && "opacity-50 cursor-not-allowed")}
        >
          {current === questions.length - 1 ? "See Result" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
}
