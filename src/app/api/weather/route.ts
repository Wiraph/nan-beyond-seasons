import { getNanForecast, getMonthProfile, getSeason } from "@/lib/weather";

export const runtime = "nodejs";

export async function GET() {
  const days = await getNanForecast();
  const month = new Date().getMonth() + 1;
  return Response.json(
    {
      days,
      month: getMonthProfile(month),
      season: getSeason(month),
    },
    { headers: { "Cache-Control": "public, max-age=900" } }
  );
}
