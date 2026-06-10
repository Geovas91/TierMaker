import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminEmail } from "@/lib/admin";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: NextRequest) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: "La conexion con Supabase no esta configurada." },
      { status: 503 },
    );
  }

  const accessToken = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");

  if (!accessToken) {
    return NextResponse.json({ error: "Acceso no autorizado." }, { status: 401 });
  }

  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
  const { data: userData, error: userError } =
    await authClient.auth.getUser(accessToken);

  if (userError || !isAdminEmail(userData.user?.email)) {
    return NextResponse.json({ error: "Acceso no autorizado." }, { status: 403 });
  }

  if (!supabaseServiceRoleKey) {
    return NextResponse.json(
      { error: "El panel administrativo no esta configurado en el servidor." },
      { status: 503 },
    );
  }

  const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const [tierListsResult, publicTierListsResult, feedbackResult, latestResult] =
    await Promise.all([
      adminClient
        .from("tier_lists")
        .select("id", { count: "exact", head: true }),
      adminClient
        .from("tier_lists")
        .select("id", { count: "exact", head: true })
        .eq("is_public", true),
      adminClient
        .from("feedback")
        .select("id", { count: "exact", head: true }),
      adminClient
        .from("feedback")
        .select("id,message,created_at")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

  const queryError =
    tierListsResult.error ??
    publicTierListsResult.error ??
    feedbackResult.error ??
    latestResult.error;

  if (queryError) {
    return NextResponse.json(
      { error: "No se pudieron cargar los datos administrativos." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    latestFeedback: latestResult.data ?? [],
    totals: {
      feedback: feedbackResult.count ?? 0,
      publicTierLists: publicTierListsResult.count ?? 0,
      tierLists: tierListsResult.count ?? 0,
    },
  });
}
