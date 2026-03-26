"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  FileSliders,
  RotateCcw,
  ShieldCheck,
  Target,
  TrendingUp,
  Upload,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  flashcards,
  getDomainLabel,
  getTopics,
  pbqScenarios,
  practiceQuestions,
  secPlusDomains,
  shuffleArray,
  type Question,
} from "@/lib/secplus-data";

type ExamMode = "standard" | "random" | "missed-only" | "cram" | "timed" | "custom";
type TopicFilter = "all" | string;

type ExamResult = {
  id: string;
  mode: ExamMode;
  domain: string;
  topic: TopicFilter;
  total: number;
  correct: number;
  percent: number;
  timestamp: string;
  durationSeconds: number;
  missedQuestionIds: number[];
};

type FlashcardProgress = Record<number, { confidence: number; lastReviewed: string }>;

type StoredData = {
  savedResults: ExamResult[];
  missedQuestionIds: number[];
  flashcardProgress: FlashcardProgress;
};

type ExamState = {
  current: number;
  answers: Record<number, number>;
  submitted: boolean;
  questions: Question[];
  mode: ExamMode;
  startedAt: number;
};

const ALL_DOMAINS = "all";
const ALL_TOPICS = "all";
const STORAGE_KEY = "secplus-study-progress-v3";
const TIMED_EXAM_SECONDS = 15 * 60;
const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20, 30, 40, 50];

function getFilteredQuestions(domain: string, topic: TopicFilter) {
  return practiceQuestions.filter((question) => {
    const domainMatch = domain === ALL_DOMAINS || question.domain === domain;
    const topicMatch = topic === ALL_TOPICS || question.topic === topic;
    return domainMatch && topicMatch;
  });
}

function getFilteredFlashcards(domain: string, topic: TopicFilter) {
  return flashcards.filter((card) => {
    const domainMatch = domain === ALL_DOMAINS || card.domain === domain;
    const topicMatch = topic === ALL_TOPICS || card.topic === topic;
    return domainMatch && topicMatch;
  });
}

function buildExamQuestions(
  domain: string,
  topic: TopicFilter,
  mode: ExamMode,
  missedQuestionIds: number[],
  questionCount: number
) {
  const baseQuestions = getFilteredQuestions(domain, topic);

  if (mode === "missed-only") {
    return shuffleArray(baseQuestions.filter((question) => missedQuestionIds.includes(question.id))).slice(0, questionCount);
  }

  if (mode === "cram") {
    return shuffleArray(baseQuestions).slice(0, Math.min(questionCount, 8, baseQuestions.length));
  }

  if (mode === "random" || mode === "timed" || mode === "custom") {
    return shuffleArray(baseQuestions).slice(0, Math.min(questionCount, baseQuestions.length));
  }

  return baseQuestions.slice(0, Math.min(questionCount, baseQuestions.length));
}

function formatTopicLabel(topic: string) {
  return topic
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function SecPlusStudyClient() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedDomain, setSelectedDomain] = useState<string>(ALL_DOMAINS);
  const [selectedTopic, setSelectedTopic] = useState<TopicFilter>(ALL_TOPICS);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [examMode, setExamMode] = useState<ExamMode>("standard");
  const [savedResults, setSavedResults] = useState<ExamResult[]>([]);
  const [missedQuestionIds, setMissedQuestionIds] = useState<number[]>([]);
  const [flashcardProgress, setFlashcardProgress] = useState<FlashcardProgress>({});
  const [timeRemaining, setTimeRemaining] = useState(TIMED_EXAM_SECONDS);
  const [showPbqAnswers, setShowPbqAnswers] = useState<Record<number, boolean>>({});
  const [examState, setExamState] = useState<ExamState>({
    current: 0,
    answers: {},
    submitted: false,
    questions: buildExamQuestions(ALL_DOMAINS, ALL_TOPICS, "standard", [], 10),
    mode: "standard",
    startedAt: Date.now(),
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<StoredData>;
      setSavedResults(parsed.savedResults ?? []);
      setMissedQuestionIds(parsed.missedQuestionIds ?? []);
      setFlashcardProgress(parsed.flashcardProgress ?? {});
    } catch {
      // ignore storage parse issues
    }
  }, []);

  useEffect(() => {
    const payload: StoredData = {
      savedResults,
      missedQuestionIds,
      flashcardProgress,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [savedResults, missedQuestionIds, flashcardProgress]);

  useEffect(() => {
    if (examMode !== "timed" || examState.submitted || examState.questions.length === 0) return;

    setTimeRemaining(TIMED_EXAM_SECONDS);
    const interval = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          setExamState((current) => ({ ...current, submitted: true }));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [examMode, examState.startedAt, examState.submitted, examState.questions.length]);

  const availableTopics = useMemo(() => getTopics(selectedDomain), [selectedDomain]);

  const filteredFlashcards = useMemo(() => {
    const cards = getFilteredFlashcards(selectedDomain, selectedTopic);

    if (examMode === "random" || examMode === "cram" || examMode === "custom") {
      return shuffleArray(cards);
    }

    return [...cards].sort((a, b) => {
      const aConfidence = flashcardProgress[a.id]?.confidence ?? 0;
      const bConfidence = flashcardProgress[b.id]?.confidence ?? 0;
      return aConfidence - bConfidence;
    });
  }, [selectedDomain, selectedTopic, examMode, flashcardProgress]);

  const filteredPbqs = useMemo(() => {
    return pbqScenarios.filter((scenario) => {
      const domainMatch = selectedDomain === ALL_DOMAINS || scenario.domain === selectedDomain;
      const topicMatch = selectedTopic === ALL_TOPICS || scenario.topic === selectedTopic;
      return domainMatch && topicMatch;
    });
  }, [selectedDomain, selectedTopic]);

  const currentCard = filteredFlashcards[cardIndex];
  const currentQuestion = examState.questions[examState.current];

  const answeredCount = Object.keys(examState.answers).length;
  const score = examState.questions.reduce((total, question, index) => {
    return total + (examState.answers[index] === question.answer ? 1 : 0);
  }, 0);
  const scorePercent = examState.questions.length ? Math.round((score / examState.questions.length) * 100) : 0;

  const domainStats = useMemo(() => {
    return secPlusDomains.map((domain) => {
      const relevant = savedResults.filter((result) => result.domain === domain.id || result.domain === ALL_DOMAINS);
      const average = relevant.length
        ? Math.round(relevant.reduce((sum, result) => sum + result.percent, 0) / relevant.length)
        : null;
      return { domain, average, attempts: relevant.length };
    });
  }, [savedResults]);

  const topicStats = useMemo(() => {
    return getTopics(selectedDomain).map((topic) => {
      const relevant = savedResults.filter(
        (result) =>
          (selectedDomain === ALL_DOMAINS || result.domain === selectedDomain || result.domain === ALL_DOMAINS) &&
          (result.topic === topic || result.topic === ALL_TOPICS)
      );
      const average = relevant.length
        ? Math.round(relevant.reduce((sum, result) => sum + result.percent, 0) / relevant.length)
        : null;
      return { topic, average, attempts: relevant.length };
    });
  }, [savedResults, selectedDomain]);

  const resetFlashcards = () => {
    setCardIndex(0);
    setFlipped(false);
  };

  const resetExam = (mode = examMode) => {
    setExamState({
      current: 0,
      answers: {},
      submitted: false,
      questions: buildExamQuestions(selectedDomain, selectedTopic, mode, missedQuestionIds, questionCount),
      mode,
      startedAt: Date.now(),
    });
    setTimeRemaining(TIMED_EXAM_SECONDS);
  };

  useEffect(() => {
    resetFlashcards();
    resetExam(examMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDomain, selectedTopic, questionCount]);

  const handleModeChange = (mode: ExamMode) => {
    setExamMode(mode);
    resetFlashcards();
    resetExam(mode);
  };

  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain);
    setSelectedTopic(ALL_TOPICS);
  };

  const selectAnswer = (optionIndex: number) => {
    if (examState.submitted) return;
    setExamState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [prev.current]: optionIndex,
      },
    }));
  };

  const submitExam = () => {
    const missed = examState.questions
      .filter((question, index) => examState.answers[index] !== question.answer)
      .map((question) => question.id);

    setMissedQuestionIds((prev) => Array.from(new Set([...prev, ...missed])));

    const durationSeconds = Math.max(0, Math.round((Date.now() - examState.startedAt) / 1000));
    const result: ExamResult = {
      id: crypto.randomUUID(),
      mode: examState.mode,
      domain: selectedDomain,
      topic: selectedTopic,
      total: examState.questions.length,
      correct: score,
      percent: scorePercent,
      timestamp: new Date().toISOString(),
      durationSeconds,
      missedQuestionIds: missed,
    };

    setSavedResults((prev) => [result, ...prev].slice(0, 50));
    setExamState((prev) => ({ ...prev, submitted: true }));
  };

  const rateFlashcard = (confidence: number) => {
    if (!currentCard) return;
    setFlashcardProgress((prev) => ({
      ...prev,
      [currentCard.id]: {
        confidence,
        lastReviewed: new Date().toISOString(),
      },
    }));

    if (cardIndex < filteredFlashcards.length - 1) {
      setCardIndex((prev) => prev + 1);
      setFlipped(false);
    }
  };

  const exportProgress = () => {
    const payload: StoredData = { savedResults, missedQuestionIds, flashcardProgress };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "secplus-study-progress.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importProgress = async (file: File) => {
    const text = await file.text();
    const parsed = JSON.parse(text) as Partial<StoredData>;
    setSavedResults(parsed.savedResults ?? []);
    setMissedQuestionIds(parsed.missedQuestionIds ?? []);
    setFlashcardProgress(parsed.flashcardProgress ?? {});
  };

  const weakTopics = [...topicStats]
    .filter((item) => item.average !== null)
    .sort((a, b) => (a.average ?? 100) - (b.average ?? 100))
    .slice(0, 5);

  const latestResult = savedResults[0] ?? null;
  const availableQuestionCount = getFilteredQuestions(selectedDomain, selectedTopic).length;

  return (
    <div className="space-y-6 md:space-y-8">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void importProgress(file);
          event.currentTarget.value = "";
        }}
      />

      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Security+ Study Hub</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
            Custom exam builder, selectable question counts, PBQ-style practice, timed exams, analytics, and spaced repetition flashcards.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Domain</label>
            <select
              value={selectedDomain}
              onChange={(event) => handleDomainChange(event.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary sm:min-w-44"
            >
              <option value={ALL_DOMAINS}>All Domains</option>
              {secPlusDomains.map((domain) => (
                <option key={domain.id} value={domain.id}>
                  {domain.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Topic</label>
            <select
              value={selectedTopic}
              onChange={(event) => setSelectedTopic(event.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary sm:min-w-44"
            >
              <option value={ALL_TOPICS}>All Topics</option>
              {availableTopics.map((topic) => (
                <option key={topic} value={topic}>
                  {formatTopicLabel(topic)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Mode</label>
            <select
              value={examMode}
              onChange={(event) => handleModeChange(event.target.value as ExamMode)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary sm:min-w-44"
            >
              <option value="standard">Standard review</option>
              <option value="random">Randomized exam</option>
              <option value="cram">Cram mode</option>
              <option value="missed-only">Missed only</option>
              <option value="timed">Timed exam</option>
              <option value="custom">Custom exam</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Question count</label>
            <select
              value={questionCount}
              onChange={(event) => setQuestionCount(Number(event.target.value))}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary sm:min-w-36"
            >
              {QUESTION_COUNT_OPTIONS.filter((count) => count <= Math.max(availableQuestionCount, 5)).map((count) => (
                <option key={count} value={count}>
                  {count} questions
                </option>
              ))}
              {availableQuestionCount > 0 && !QUESTION_COUNT_OPTIONS.includes(availableQuestionCount) && (
                <option value={availableQuestionCount}>{availableQuestionCount} questions</option>
              )}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <Button variant="outline" onClick={exportProgress}>
              <Download className="mr-1 h-4 w-4" /> Export
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-1 h-4 w-4" /> Import
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {domainStats.map(({ domain, average, attempts }) => (
          <Card
            key={domain.id}
            className={`border ${selectedDomain === domain.id ? "border-primary ring-1 ring-primary/40" : "border-border/50"}`}
          >
            <CardHeader>
              <CardTitle className="text-sm leading-5">{domain.name}</CardTitle>
              <CardDescription>{domain.weight} of exam</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{domain.description}</p>
              <div className="rounded-lg border border-border bg-secondary/20 p-3 text-xs text-muted-foreground">
                <div>Attempts: <span className="font-semibold text-foreground">{attempts}</span></div>
                <div>Average: <span className="font-semibold text-foreground">{average ?? "--"}{average !== null ? "%" : ""}</span></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wide">Flashcards</span>
            </div>
            <CardTitle>{getDomainLabel(selectedDomain)} • {selectedTopic === ALL_TOPICS ? "All Topics" : formatTopicLabel(selectedTopic)}</CardTitle>
            <CardDescription>
              {filteredFlashcards.length} card{filteredFlashcards.length === 1 ? "" : "s"} available. Lower-confidence cards are surfaced first.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentCard ? (
              <>
                <button
                  type="button"
                  onClick={() => setFlipped((prev) => !prev)}
                  className="min-h-64 w-full rounded-2xl border border-border bg-secondary/40 p-4 text-left transition hover:border-primary/50 hover:bg-secondary/60 md:min-h-72 md:p-6"
                >
                  <div className="mb-4 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <span>{flipped ? "Answer" : "Prompt"}</span>
                    <span>
                      Card {cardIndex + 1} / {filteredFlashcards.length}
                    </span>
                  </div>
                  <div className="flex min-h-44 items-center justify-center text-center md:min-h-48">
                    <p className="max-w-2xl text-lg font-semibold leading-relaxed text-foreground md:text-xl">
                      {flipped ? currentCard.back : currentCard.front}
                    </p>
                  </div>
                  <p className="mt-4 text-center text-sm text-muted-foreground">Tap card to flip</p>
                </button>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="text-sm text-muted-foreground">
                    Topic: {formatTopicLabel(currentCard.topic)} • Confidence: {flashcardProgress[currentCard.id]?.confidence ?? 0}/3
                  </div>
                  <div className="grid grid-cols-3 gap-2 md:flex md:gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCardIndex((prev) => Math.max(prev - 1, 0));
                        setFlipped(false);
                      }}
                      disabled={cardIndex === 0}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" /> Prev
                    </Button>
                    <Button variant="outline" onClick={() => setFlipped((prev) => !prev)}>
                      Flip
                    </Button>
                    <Button
                      onClick={() => {
                        setCardIndex((prev) => Math.min(prev + 1, filteredFlashcards.length - 1));
                        setFlipped(false);
                      }}
                      disabled={cardIndex >= filteredFlashcards.length - 1}
                    >
                      Next <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" onClick={() => rateFlashcard(1)}>Again</Button>
                  <Button variant="outline" onClick={() => rateFlashcard(2)}>Good</Button>
                  <Button onClick={() => rateFlashcard(3)}>Easy</Button>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
                No flashcards for this filter yet.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/50 bg-card">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wide">Practice Exam</span>
              </div>
              <CardTitle>
                {examMode === "timed"
                  ? "Timed exam"
                  : examMode === "cram"
                    ? "Cram mode"
                    : examMode === "missed-only"
                      ? "Missed-only review"
                      : examMode === "custom"
                        ? "Custom exam builder"
                        : "Exam mode"}
              </CardTitle>
              <CardDescription>
                {examState.questions.length} question{examState.questions.length === 1 ? "" : "s"} loaded.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                <div className="rounded-lg border border-border bg-secondary/30 p-3 text-sm">
                  <div className="text-muted-foreground">Answered</div>
                  <div className="mt-1 text-2xl font-bold">{answeredCount}/{examState.questions.length}</div>
                </div>
                <div className="rounded-lg border border-border bg-secondary/30 p-3 text-sm">
                  <div className="text-muted-foreground">Current</div>
                  <div className="mt-1 text-2xl font-bold">{examState.questions.length ? examState.current + 1 : 0}</div>
                </div>
                <div className="rounded-lg border border-border bg-secondary/30 p-3 text-sm">
                  <div className="text-muted-foreground">Score</div>
                  <div className="mt-1 text-2xl font-bold">{examState.submitted ? `${scorePercent}%` : "--"}</div>
                </div>
                <div className="rounded-lg border border-border bg-secondary/30 p-3 text-sm">
                  <div className="text-muted-foreground">Missed bank</div>
                  <div className="mt-1 text-2xl font-bold">{missedQuestionIds.length}</div>
                </div>
                <div className="rounded-lg border border-border bg-secondary/30 p-3 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock3 className="h-4 w-4" /> Timer
                  </div>
                  <div className="mt-1 text-2xl font-bold">
                    {examMode === "timed" ? formatDuration(timeRemaining) : "--:--"}
                  </div>
                </div>
              </div>

              {(examMode === "custom" || examMode === "random" || examMode === "timed") && (
                <div className="rounded-xl border border-border bg-secondary/20 p-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <FileSliders className="h-4 w-4 text-primary" /> Exam builder
                  </div>
                  <p className="mt-2">This run is using your selected filters and question count: <span className="font-semibold text-foreground">{questionCount}</span>.</p>
                  <p className="mt-1">Available questions for this filter: <span className="font-semibold text-foreground">{availableQuestionCount}</span>.</p>
                </div>
              )}

              {currentQuestion ? (
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {getDomainLabel(currentQuestion.domain)} • {formatTopicLabel(currentQuestion.topic)} • {currentQuestion.difficulty}
                    </p>
                    <h3 className="text-base font-semibold leading-relaxed text-foreground md:text-lg">
                      {currentQuestion.question}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {currentQuestion.options.map((option, optionIndex) => {
                      const selected = examState.answers[examState.current] === optionIndex;
                      const correct = examState.submitted && currentQuestion.answer === optionIndex;
                      const incorrect = examState.submitted && selected && currentQuestion.answer !== optionIndex;

                      return (
                        <button
                          key={`${currentQuestion.id}-${optionIndex}`}
                          type="button"
                          onClick={() => selectAnswer(optionIndex)}
                          className={`w-full rounded-xl border p-4 text-left transition ${
                            correct
                              ? "border-green-500 bg-green-500/10"
                              : incorrect
                                ? "border-red-500 bg-red-500/10"
                                : selected
                                  ? "border-primary bg-primary/10"
                                  : "border-border bg-secondary/20 hover:border-primary/40 hover:bg-secondary/40"
                          }`}
                        >
                          <span className="text-sm font-medium text-foreground">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {examState.submitted && (
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                      <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Explanation
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">{currentQuestion.explanation}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap">
                    <Button
                      variant="outline"
                      onClick={() => setExamState((prev) => ({ ...prev, current: Math.max(prev.current - 1, 0) }))}
                      disabled={examState.current === 0}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setExamState((prev) => ({
                          ...prev,
                          current: Math.min(prev.current + 1, examState.questions.length - 1),
                        }))
                      }
                      disabled={examState.current >= examState.questions.length - 1}
                    >
                      Next <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                    <Button onClick={submitExam} disabled={!examState.questions.length || answeredCount !== examState.questions.length || examState.submitted}>
                      Submit
                    </Button>
                    <Button variant="secondary" onClick={() => resetExam(examMode)}>
                      <RotateCcw className="mr-1 h-4 w-4" /> Reset
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
                  {examMode === "missed-only"
                    ? "No missed questions saved yet. Take an exam first to build your review bank."
                    : "No questions available for this filter yet."}
                </div>
              )}

              {examState.submitted && examState.questions.length > 0 && (
                <div className="rounded-xl border border-border bg-secondary/20 p-4">
                  <h4 className="font-semibold text-foreground">Results</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You scored <span className="font-semibold text-foreground">{score}</span> out of {examState.questions.length} ({scorePercent}%) in {formatDuration(Math.max(0, Math.round((Date.now() - examState.startedAt) / 1000)))}.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/50 bg-card">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase tracking-wide">Analytics</span>
                </div>
                <CardTitle>Score history</CardTitle>
                <CardDescription>Recent attempts with time and filter context.</CardDescription>
              </CardHeader>
              <CardContent>
                {savedResults.length > 0 ? (
                  <div className="space-y-3">
                    {savedResults.slice(0, 8).map((result) => (
                      <div key={result.id} className="rounded-xl border border-border bg-secondary/20 p-3 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-medium text-foreground">{result.mode}</div>
                          <div className="font-semibold text-primary">{result.percent}%</div>
                        </div>
                        <div className="mt-1 text-muted-foreground">
                          {getDomainLabel(result.domain)} • {result.topic === ALL_TOPICS ? "All Topics" : formatTopicLabel(result.topic)}
                        </div>
                        <div className="mt-1 text-muted-foreground">
                          {result.correct}/{result.total} • {formatDuration(result.durationSeconds)}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">{new Date(result.timestamp).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No saved attempts yet.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary">
                  <Target className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase tracking-wide">Weak Points</span>
                </div>
                <CardTitle>Topic breakdown</CardTitle>
                <CardDescription>Lowest-performing topics float to the top.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {weakTopics.length > 0 ? (
                  weakTopics.map((item) => (
                    <div key={item.topic} className="rounded-xl border border-border bg-secondary/20 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-medium text-foreground">{formatTopicLabel(item.topic)}</div>
                        <div className="font-semibold text-primary">{item.average}%</div>
                      </div>
                      <div className="mt-1 text-muted-foreground">Attempts: {item.attempts}</div>
                    </div>
                  ))
                ) : (
                  <p>No topic analytics yet. Finish a few practice runs first.</p>
                )}

                <div className="rounded-xl border border-border bg-secondary/20 p-3">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <XCircle className="h-4 w-4 text-red-400" /> Missed questions bank
                  </div>
                  <p className="mt-1">Saved missed questions: <span className="font-semibold text-foreground">{missedQuestionIds.length}</span></p>
                </div>

                {latestResult && (
                  <div className="rounded-xl border border-border bg-secondary/20 p-3">
                    <div className="font-medium text-foreground">Latest attempt</div>
                    <p className="mt-1">{latestResult.percent}% in {getDomainLabel(latestResult.domain)}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/50 bg-card">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <BrainCircuit className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wide">PBQ Practice</span>
              </div>
              <CardTitle>Scenario-based drills</CardTitle>
              <CardDescription>Starter performance-based question practice with guided solutions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredPbqs.length > 0 ? (
                filteredPbqs.map((scenario) => {
                  const revealed = showPbqAnswers[scenario.id] ?? false;
                  return (
                    <div key={scenario.id} className="rounded-xl border border-border bg-secondary/20 p-4">
                      <div className="text-sm font-semibold text-foreground">{scenario.title}</div>
                      <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                        {getDomainLabel(scenario.domain)} • {formatTopicLabel(scenario.topic)}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{scenario.scenario}</p>
                      <div className="mt-3 rounded-lg border border-border bg-background/40 p-3 text-sm text-foreground">
                        <span className="font-medium">Prompt:</span> {scenario.prompt}
                      </div>
                      <div className="mt-3">
                        <div className="text-sm font-medium text-foreground">Tasks</div>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                          {scenario.tasks.map((task) => (
                            <li key={task}>{task}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" onClick={() => setShowPbqAnswers((prev) => ({ ...prev, [scenario.id]: !revealed }))}>
                          {revealed ? "Hide solution" : "Show solution"}
                        </Button>
                      </div>
                      {revealed && (
                        <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
                          <div className="mb-2 font-medium text-foreground">Suggested solution</div>
                          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                            {scenario.solution.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
                  No PBQ scenarios match the current filter yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
