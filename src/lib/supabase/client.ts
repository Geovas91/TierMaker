import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigErrorMessage =
  "La conexion con Supabase no esta configurada en este entorno. Algunas funciones en linea no estan disponibles por ahora.";

export function createSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(supabaseConfigErrorMessage);
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}
