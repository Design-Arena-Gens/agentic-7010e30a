"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Gauge,
  Globe,
  Layers,
  ShieldCheck,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";

type RecommendationResponse = {
  best: {
    id: string;
    provider: string;
    tagline: string;
    reason: string;
    latency: string;
    strengths: string[];
  };
  alternatives: {
    id: string;
    provider: string;
    reason: string;
  }[];
  insights: string[];
  tokens: {
    estimated: number;
  };
};

const heroStats = [
  { label: "Models orchestrated", value: "120+" },
  { label: "Median latency", value: "620ms" },
  { label: "Cost savings", value: "Up to 68%" },
];

const featurePillars = [
  {
    icon: <Sparkles className="h-5 w-5 text-purple-500" />,
    title: "Intelligent Routing",
    description:
      "Pai Keys analyzes every request and dispatches the best model blend for accuracy, latency, and spend.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
    title: "No Lock-in, Infinite Choice",
    description:
      "Keep your workloads fluid across GPT, Claude, Gemini, Mistral, open-source LLMs, and more with one credential.",
  },
  {
    icon: <Zap className="h-5 w-5 text-amber-500" />,
    title: "Fast, Free Tier Friendly",
    description:
      "Optimized defaults and aggressive caching deliver lightning-fast responses without the enterprise price tag.",
  },
];

const modelFamilies = [
  {
    name: "Reasoning & Agents",
    badge: "Claude 3.5, GPT-4o, DeepSeek R1",
    points: [
      "Deep thought, planning, and complex orchestration",
      "Structure-aware JSON and tool calling with guardrails",
      "Balance creativity with deterministic outputs when needed",
    ],
  },
  {
    name: "Realtime & Chat",
    badge: "GPT-4o mini, Claude Haiku, Llama-3.1-Instruct",
    points: [
      "Snappy streaming chat with low-token pricing",
      "Hybrid fine-tunes for multilingual support",
      "Latency-aware routing keeps conversations flowing",
    ],
  },
  {
    name: "Vision & Multimodal",
    badge: "Gemini 1.5 Pro, GPT-4o mini vision, LLaVA",
    points: [
      "Screen understanding, document QA, and product search",
      "Autonomous image reasoning with cascading fallbacks",
      "Seamless handoff to speech or image generation",
    ],
  },
  {
    name: "Audio & Creation",
    badge: "Whisper v3, Stable Audio, Bark, CosyVoice",
    points: [
      "Transcribe, translate, and summarize media in real-time",
      "Generate voices, podcasts, and sonic branding",
      "Route output to diffusion or video pipelines instantly",
    ],
  },
  {
    name: "Vision to Image",
    badge: "Stable Diffusion XL, Flux, Playground v2",
    points: [
      "High-fidelity renders and fine-grained control for creatives",
      "Safety filters with multi-model consensus scoring",
      "Token-aware batching for massive generation bursts",
    ],
  },
  {
    name: "Structured Data",
    badge: "Mistral Large, GPT-4o mini JSON, Groq Llama-3",
    points: [
      "Deterministic JSON schemas with validation",
      "Groq acceleration for ultra-low latency inference",
      "Hybrid on-prem + hosted orchestration",
    ],
  },
];

const platformHighlights = [
  {
    icon: <Gauge className="h-5 w-5 text-sky-500" />,
    title: "Unified Dashboard",
    description:
      "Track usage, latency, and spend across every model, team, and workspace.",
  },
  {
    icon: <Layers className="h-5 w-5 text-rose-500" />,
    title: "Composable Flows",
    description:
      "Chain prompts, retrieval, function calling, and structured outputs without leaving the canvas.",
  },
  {
    icon: <Globe className="h-5 w-5 text-indigo-500" />,
    title: "Every Region Covered",
    description:
      "Deploy inference endpoints close to users with global edge routing and compliance presets.",
  },
  {
    icon: <Bot className="h-5 w-5 text-lime-500" />,
    title: "Open-Source First",
    description:
      "Fine-tune, self-host, or stream from community models with zero configuration switches.",
  },
];

const faqs = [
  {
    question: "How does Pai Keys decide which model to call?",
    answer:
      "We fingerprint every request for complexity, safety, modality requirements, and latency budget. Pai Keys blends historical win rates with your policy constraints to select the strongest model or ensemble.",
  },
  {
    question: "Can I bring my own models or endpoints?",
    answer:
      "Yes. Register any hosted or on-prem model with a URL + schema. Pai Keys will route to it when it outperforms our defaults for the jobs you describe.",
  },
  {
    question: "Is there a cost to getting started?",
    answer:
      "Our free tier includes 3M tokens, unlimited projects, and realtime monitoring. Usage-based billing only kicks in when you need massive throughput.",
  },
];

const testimonials = [
  {
    quote:
      "Pai Keys lets us prototype with Claude, ship with open models, and flip to Groq for production spikes without rewriting a line.",
    name: "Riya Malhotra",
    role: "Head of AI Engineering · Orbit Labs",
  },
  {
    quote:
      "We saw a 55% latency drop on customer support automations the week we switched. Intelligent routing is absolutely the superpower.",
    name: "Chris Nguyen",
    role: "COO · Joyride",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "$0",
    cadence: "per month",
    cta: "Launch for free",
    items: [
      "3M orchestration tokens",
      "Shared GPU inference",
      "Realtime playground",
      "Unlimited team members",
    ],
  },
  {
    name: "Scale",
    price: "$249",
    cadence: "per month + usage",
    cta: "Talk to sales",
    items: [
      "Dedicated failover policies",
      "Batch + async pipelines",
      "Bring your own models",
      "24/7 priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "annually",
    cta: "Book a workshop",
    items: [
      "On-prem orchestration plane",
      "SOC2, HIPAA, ISO27001",
      "Fine-tuning & eval suite",
      "SLA-backed latency",
    ],
  },
];

function ModelRouterForm() {
  const [prompt, setPrompt] = useState(
    "Summarize this legal transcript and flag the top risk clauses."
  );
  const [priority, setPriority] = useState<"speed" | "quality" | "cost">(
    "quality"
  );
  const [tone, setTone] = useState<"balanced" | "creative" | "deterministic">(
    "balanced"
  );
  const [modalities, setModalities] = useState<string[]>(["text"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecommendationResponse | null>(null);

  const toggleModality = (value: string) => {
    setModalities((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const hasSelectedModality = modalities.length > 0;

  const modalityLabels = useMemo(
    () => [
      { value: "text", label: "Text" },
      { value: "vision", label: "Vision" },
      { value: "audio", label: "Audio" },
    ],
    []
  );

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim()) {
      setError("Describe the task so we can pick the perfect model.");
      return;
    }
    if (!hasSelectedModality) {
      setError("Select at least one modality.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          priority,
          tone,
          modalities,
        }),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => null);
        throw new Error(detail?.message ?? "Request failed");
      }

      const payload = (await response.json()) as RecommendationResponse;
      setResult(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={submit}
          className="flex flex-col gap-6 p-8 md:p-10 lg:p-12"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-200">
              <Sparkles className="h-3 w-3" /> Live routing demo
            </span>
            <h2 className="mt-4 text-2xl font-semibold text-white md:text-3xl">
              Describe your task. We pick the ideal AI instantly.
            </h2>
          </div>
          <label className="flex flex-col gap-3">
            <span className="text-sm font-medium text-slate-200">
              What do you need to build?
            </span>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className="min-h-[140px] rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm leading-relaxed text-slate-100 outline-none ring-0 transition focus:border-white/30"
              placeholder="Explain the workload, modalities, constraints, or targets."
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-200">
              <span className="font-medium text-white">Latency target</span>
              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as typeof priority)
                }
                className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
              >
                <option value="speed">Sub-500ms</option>
                <option value="quality">Highest quality</option>
                <option value="cost">Cheapest available</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-200">
              <span className="font-medium text-white">Output personality</span>
              <select
                value={tone}
                onChange={(event) =>
                  setTone(event.target.value as typeof tone)
                }
                className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
              >
                <option value="balanced">Balanced</option>
                <option value="creative">Creative</option>
                <option value="deterministic">Deterministic</option>
              </select>
            </label>
          </div>

          <fieldset className="flex flex-wrap gap-2">
            {modalityLabels.map((modality) => {
              const active = modalities.includes(modality.value);
              return (
                <button
                  key={modality.value}
                  type="button"
                  onClick={() => toggleModality(modality.value)}
                  className={[
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition",
                    active
                      ? "border-white/40 bg-white/20 text-white"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white",
                  ].join(" ")}
                >
                  <CheckCircle2
                    className={`h-4 w-4 ${
                      active ? "text-emerald-300" : "text-slate-500"
                    }`}
                  />
                  {modality.label}
                </button>
              );
            })}
          </fieldset>

          <button
            type="submit"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-white/40 disabled:text-slate-500"
            disabled={loading}
          >
            {loading ? "Routing..." : "Run intelligent routing"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          {error && (
            <p className="text-sm text-rose-300/90" role="alert">
              {error}
            </p>
          )}
        </form>

        <div className="relative overflow-hidden border-t border-white/10 bg-white/5 p-8 md:border-l md:border-t-0">
          <div className="absolute -right-24 -top-16 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between gap-6 rounded-2xl border border-white/10 bg-slate-950/70 p-6 text-sm text-slate-200">
            {result ? (
              <>
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Recommended stack
                  </span>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {result.best.provider} · {result.best.id}
                  </h3>
                  <p className="mt-1 text-slate-300">{result.best.tagline}</p>
                </div>
                <div className="space-y-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      Why this wins
                    </p>
                    <p className="mt-2 text-sm text-slate-100">
                      {result.best.reason}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      Strengths
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-100">
                      {result.best.strengths.map((strength) => (
                        <li key={strength} className="flex items-center gap-2">
                          <Sparkles className="h-3.5 w-3.5 text-purple-300" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
                    <span className="font-medium text-slate-100">Latency:</span>{" "}
                    {result.best.latency}
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Fallback ensemble
                  </p>
                  <ul className="space-y-2 text-sm text-slate-200">
                    {result.alternatives.map((alternative) => (
                      <li
                        key={`${alternative.provider}-${alternative.id}`}
                        className="rounded-xl border border-white/10 bg-white/5 p-3"
                      >
                        <span className="font-semibold text-white">
                          {alternative.provider} · {alternative.id}
                        </span>
                        <p className="text-xs text-slate-300">
                          {alternative.reason}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-white/10 bg-indigo-500/10 p-4 text-xs text-indigo-100">
                  <p className="uppercase tracking-[0.2em] text-indigo-200">
                    Insights
                  </p>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-start gap-2">
                      <BarChart3 className="mt-0.5 h-3.5 w-3.5" />
                      <span>
                        Estimated usage: {result.tokens.estimated.toLocaleString()} tokens
                      </span>
                    </li>
                    {result.insights.map((insight) => (
                      <li key={insight} className="flex items-start gap-2">
                        <BarChart3 className="mt-0.5 h-3.5 w-3.5" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-start justify-center gap-4 text-slate-300">
                <Wand2 className="h-9 w-9 text-purple-300" />
                <p className="text-sm leading-relaxed">
                  Describe any workflow—gen AI apps, speech-to-image, legal QA,
                  you name it. Pai Keys analyzes millions of telemetry signals to
                  deliver the perfect mix of accuracy, cost, and latency.
                </p>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Awaiting your prompt…
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 z-0 h-[540px] bg-gradient-to-br from-purple-800/60 via-indigo-900/50 to-slate-950 blur-3xl" />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 px-6 pb-24 pt-24 lg:px-12">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
            <Sparkles className="h-3.5 w-3.5" />
            Unified AI routing, solved
          </div>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Pai Keys gives you one supercharged API key for every world-class AI
            model — instantly, affordably, endlessly.
          </h1>
          <p className="max-w-2xl text-lg text-slate-200/90 sm:text-xl">
            Ship products on GPT, Claude, Gemini, Mistral, Whisper, Stable
            Diffusion, DeepSeek, and open-source LLMs without vendor lock-in.
            Pai Keys auto-routes every call for peak accuracy, speed, and cost.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="#router"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-purple-500/20 transition hover:bg-slate-200"
            >
              Launch router playground
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:text-white"
            >
              Talk to an orchestrator
              <Bot className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 pt-10 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/10 px-6 py-5 text-sm text-white/90 backdrop-blur"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-white/60">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-24 px-6 pb-32 lg:px-12">
        <section className="-mt-20 rounded-[40px] border border-white/10 bg-white/10 p-1 shadow-2xl shadow-purple-700/10 backdrop-blur" id="router">
          <div className="rounded-[38px] border border-white/10 bg-slate-950/70">
            <ModelRouterForm />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {featurePillars.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-slate-200 transition hover:border-white/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-200/90">
                {feature.description}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              Model universe
            </span>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Every proprietary, open, and self-hosted model in one routing mesh.
            </h2>
            <p className="max-w-2xl text-sm text-slate-200/90">
              Switch providers or mix models per request. Pai Keys builds a
              performance graph from billions of evaluations so you can rely on
              the fastest, smartest ensemble every single time.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {modelFamilies.map((family) => (
              <article
                key={family.name}
                className="rounded-3xl border border-white/10 bg-slate-950/80 p-6"
              >
                <p className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                  {family.badge}
                </p>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {family.name}
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-200/90">
                  {family.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <Sparkles className="mt-1 h-4 w-4 text-purple-300" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {platformHighlights.map((highlight) => (
            <article
              key={highlight.title}
              className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-slate-200"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                {highlight.icon}
              </div>
              <h3 className="text-xl font-semibold text-white">
                {highlight.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-200/90">
                {highlight.description}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              Loved by builders
            </span>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Why teams switch from single-vendor tooling to Pai Keys
            </h2>
            <p className="max-w-2xl text-sm text-slate-200/90">
              Whether you are experimenting or running production workloads, our
              orchestration plane keeps you shipping faster than heavyweight
              incumbents.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <blockquote
                key={testimonial.quote}
                className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-sm leading-relaxed text-slate-200/90"
              >
                “{testimonial.quote}”
                <footer className="mt-6 text-xs uppercase tracking-[0.18em] text-white/60">
                  {testimonial.name} · {testimonial.role}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section id="pricing">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              Pricing
            </span>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Start free. Scale infinitely.
            </h2>
            <p className="max-w-2xl text-sm text-slate-200/90">
              Choose the plan that matches your workload, or bring your own
              contract. Every tier includes our unified API, instant telemetry,
              and enterprise-grade security.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <article
                key={tier.name}
                className="flex h-full flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-slate-200"
              >
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {tier.name}
                  </h3>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {tier.price}
                    <span className="text-sm font-normal text-slate-300">
                      {" "}
                      / {tier.cadence}
                    </span>
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-slate-200/90">
                  {tier.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="#router"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white/40 hover:text-white"
                >
                  {tier.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {faqs.map((faq) => (
            <article
              key={faq.question}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-slate-200"
            >
              <h3 className="text-lg font-semibold text-white">
                {faq.question}
              </h3>
              <p className="mt-3 leading-relaxed text-slate-200/90">
                {faq.answer}
              </p>
            </article>
          ))}
          <article className="rounded-3xl border border-purple-400/40 bg-purple-500/10 p-8 text-sm text-purple-100">
            <h3 className="text-lg font-semibold text-white">
              Ready to orchestrate everything?
            </h3>
            <p className="mt-3 leading-relaxed text-purple-100/90">
              Join thousands of developers consolidating their AI workloads.
              Deploy Pai Keys in minutes, route intelligently forever.
            </p>
            <Link
              href="#"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-slate-200"
            >
              Claim your universal key
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 text-xs text-slate-400 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <p>Pai Keys © {new Date().getFullYear()} · Intelligent AI routing.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="#" className="hover:text-white/90">
              Status
            </Link>
            <Link href="#" className="hover:text-white/90">
              Docs
            </Link>
            <Link href="#" className="hover:text-white/90">
              Security
            </Link>
            <Link href="#" className="hover:text-white/90">
              Careers
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
