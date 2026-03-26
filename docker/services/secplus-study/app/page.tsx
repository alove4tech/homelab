import { Shield, BookOpen, BrainCircuit } from "lucide-react";

import { SecPlusStudyClient } from "@/components/secplus-study-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/50 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_45%)]">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
              <Shield className="h-4 w-4" />
              CompTIA Security+ Study App
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Study smarter for Security+
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A focused standalone study site with flashcards, practice exams, and domain-based review.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-5 w-5 text-primary" /> Flashcards
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Review key exam concepts quickly by domain.
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BrainCircuit className="h-5 w-5 text-primary" /> Practice Exams
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Answer multiple-choice questions and review explanations.
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-5 w-5 text-primary" /> Domain Review
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Focus on weak areas and work through the exam objectives systematically.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <SecPlusStudyClient />
      </section>
    </main>
  );
}
