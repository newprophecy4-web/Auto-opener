export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders(),
      });
    }

    if (url.pathname === "/") {
      return json({
        success: true,
        service: "Geo IP Test Backend",
        status: "online",
      });
    }

    if (url.pathname === "/test" && request.method === "POST") {
      return startTest(request, env);
    }

    return json(
      { success: false, error: "Route not found" },
      404
    );
  },
};

async function startTest(request, env) {
  try {
    const body = await request.json();

    const target = body?.url;
    const count = Number(body?.count || 1);

    if (!target) {
      return json(
        { success: false, error: "URL is required" },
        400
      );
    }

    if (count < 1 || count > 20) {
      return json(
        {
          success: false,
          error: "Count must be between 1 and 20",
        },
        400
      );
    }

    const targetUrl = new URL(target);

    // Only allow domains explicitly configured in Worker env.
    const allowedHosts = (env.ALLOWED_HOSTS || "")
      .split(",")
      .map((x) => x.trim().toLowerCase())
      .filter(Boolean);

    if (
      allowedHosts.length === 0 ||
      !allowedHosts.includes(targetUrl.hostname.toLowerCase())
    ) {
      return json(
        {
          success: false,
          error: "Target domain is not allowed",
        },
        403
      );
    }

    const results = [];

    for (let i = 1; i <= count; i++) {
      const started = Date.now();

      try {
        const response = await fetch(targetUrl.toString(), {
          method: "GET",
          redirect: "manual",
          headers: {
            "User-Agent": "GeoIP-Test-Client/1.0",
            "X-Geo-Test": "true",
          },
        });

        results.push({
          request: i,
          status: response.status,
          success: response.ok,
          responseTimeMs: Date.now() - started,
        });
      } catch (error) {
        results.push({
          request: i,
          success: false,
          error: String(error),
          responseTimeMs: Date.now() - started,
        });
      }
    }

    return json({
      success: true,
      target: targetUrl.hostname,
      total: count,
      completed: results.length,
      results,
    });
  } catch (error) {
    return json(
      {
        success: false,
        error: "Invalid request",
        details: String(error),
      },
      400
    );
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json",
      ...corsHeaders(),
    },
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
            }
