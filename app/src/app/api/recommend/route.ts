import { NextResponse } from "next/server";
import { modelCatalog, modalityWeight, type RoutingContext } from "@/lib/models";
import { buildInsights, evaluateRouting } from "@/lib/router";

export async function GET() {
  const payload = modelCatalog.map((model) => ({
    id: model.id,
    provider: model.provider,
    modalities: model.modalities,
    family: model.family,
    latency: model.latency,
    cost: model.cost,
    quality: model.quality,
    tagline: model.tagline,
  }));
  return NextResponse.json({ models: payload });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<RoutingContext> | null;

  if (!body || typeof body.prompt !== "string" || !body.prompt.trim()) {
    return NextResponse.json(
      { message: "A prompt description is required." },
      { status: 400 }
    );
  }

  const priority =
    body.priority === "speed" || body.priority === "cost" || body.priority === "quality"
      ? body.priority
      : "quality";
  const tone =
    body.tone === "balanced" ||
    body.tone === "creative" ||
    body.tone === "deterministic"
      ? body.tone
      : "balanced";
  const modalities =
    Array.isArray(body.modalities) && body.modalities.length
      ? (body.modalities.filter((value): value is RoutingContext["modalities"][number] =>
          value === "text" || value === "vision" || value === "audio"
        ) as RoutingContext["modalities"])
      : (["text"] as RoutingContext["modalities"]);

  const context: RoutingContext = {
    prompt: body.prompt.trim(),
    priority,
    tone,
    modalities,
  };

  const { ranked, familyNotes } = evaluateRouting(context);
  const [top, ...other] = ranked;

  if (!top) {
    return NextResponse.json(
      { message: "No models available for routing right now." },
      { status: 503 }
    );
  }

  const alternativeRanked = other.slice(0, 2);
  const alternatives = alternativeRanked.map((item) => ({
    id: item.model.id,
    provider: item.model.provider,
    reason: item.notes[0] ?? "Ready fallback if primary is unavailable.",
  }));

  const insights = buildInsights(context, top, alternativeRanked, familyNotes);

  const bestPayload = {
    id: top.model.id,
    provider: top.model.provider,
    tagline: top.model.tagline,
    latency: `${top.model.latency}ms median`,
    reason: top.notes[0] ?? "Highest composite score across catalog.",
    strengths: top.model.strengths,
  };

  return NextResponse.json({
    best: bestPayload,
    alternatives,
    insights,
    tokens: {
      estimated: Math.round(
        context.prompt.length * 0.6 +
          modalities.reduce((acc, item) => acc + modalityWeight[item] * 120, 0)
      ),
    },
  });
}
