/**
 * app/api/import-airbnb/route.js
 * API Route de Next.js (App Router) para importar listings de Airbnb.
 *
 * Uso:
 *   POST /api/import-airbnb
 *   Body: { "url": "https://www.airbnb.com/rooms/12345678", "userId": "user_abc123" }
 */

import { NextResponse } from "next/server";
import { importFromAirbnbUrl } from "@/services/airbnbImporter";

export const maxDuration = 90;

// ─── Rate Limiting en memoria ─────────────────────────────────────────────────
// Simple rate limit: máximo 3 imports por usuario cada 60 segundos.
// Si usas Redis o Upstash en producción, reemplaza este Map por eso.

const rateLimitMap = new Map(); // key: userId, value: { count, resetAt }

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minuto

function checkRateLimit(userId) {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);

  if (!entry || now > entry.resetAt) {
    // Primera request o ventana expirada: resetear
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  entry.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count };
}

// Limpiar entradas viejas del Map cada 5 minutos para evitar memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetAt) rateLimitMap.delete(key);
    }
  }, 5 * 60_000);
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(request) {
  try {
    const body = await request.json();
    const { url, userId } = body;

    // 1. Validar que venga la URL
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "URL_REQUERIDA",
          message: "Debes proporcionar una URL de Airbnb.",
        },
        { status: 400 }
      );
    }

    // 2. Validar que venga el userId
    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "USER_REQUERIDO",
          message: "Se requiere identificación de usuario.",
        },
        { status: 400 }
      );
    }

    // 3. Verificar rate limit
    const rateLimit = checkRateLimit(userId);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "RATE_LIMIT",
          message: `Demasiadas importaciones seguidas. Espera ${rateLimit.retryAfterSeconds} segundos e intenta nuevamente.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    // 4. Importar desde Airbnb
    const result = await importFromAirbnbUrl(url.trim());

    if (!result.success) {
      // El servicio ya construyó el mensaje de error apropiado
      const statusCode =
        result.error === "URL_INVALIDA" ? 400
        : result.error === "LISTING_NO_ENCONTRADO" ? 404
        : result.error === "TIMEOUT" ? 504
        : 502;

      return NextResponse.json(result, { status: statusCode });
    }

    // 5. Éxito
    return NextResponse.json(
      {
        success: true,
        data: result.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[/api/import-airbnb] Error inesperado:", error);
    return NextResponse.json(
      {
        success: false,
        error: "ERROR_INTERNO",
        message: "Error interno del servidor. Intenta nuevamente.",
      },
      { status: 500 }
    );
  }
}

// Solo aceptar POST
export async function GET() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
}
