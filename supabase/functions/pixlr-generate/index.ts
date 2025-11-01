import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GenerateRequest {
  prompt: string;
  style: string;
}

// Helper function to base64url encode
function base64urlEncode(data: ArrayBuffer | Uint8Array): string {
  const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
  const base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Helper function to create a JWT token for Pixlr API
async function generatePixlrToken(apiKey: string, apiSecret: string): Promise<string> {
  // Create JWT header
  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  // Create JWT payload as per Pixlr documentation
  // sub = API key, mode = http for server-side integration
  const payload = {
    sub: apiKey,
    mode: "http",
  };

  // Encode header and payload
  const encodedHeader = base64urlEncode(
    new TextEncoder().encode(JSON.stringify(header))
  );
  const encodedPayload = base64urlEncode(
    new TextEncoder().encode(JSON.stringify(payload))
  );

  // Create the signing input
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  // Create the signature
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(apiSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(signingInput)
  );

  // Encode the signature
  const encodedSignature = base64urlEncode(signature);

  // Return the complete JWT
  return `${signingInput}.${encodedSignature}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { prompt, style }: GenerateRequest = await req.json();

    if (!prompt || prompt.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "Prompt must be at least 10 characters" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!style) {
      return new Response(
        JSON.stringify({ error: "Style is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const pixlrApiKey = "6906159977cfaad90cf4524a";
    const pixlrApiSecret = "eb5ff1ca98cf405892322b9745eff002";

    // Generate JWT token
    console.log("Generating JWT token for Pixlr API");
    const token = await generatePixlrToken(pixlrApiKey, pixlrApiSecret);
    console.log("Token generated successfully");

    // Enhanced prompt based on style
    const stylePrompts: Record<string, string> = {
      modern: "modern, clean, contemporary style",
      vintage: "vintage, retro, classic style",
      minimalist: "minimalist, simple, clean lines",
      bold: "bold, vibrant, striking colors",
      professional: "professional, business, corporate style",
      artistic: "artistic, creative, expressive style",
    };

    const enhancedPrompt = `${prompt}, ${stylePrompts[style] || "beautiful style"}`;

    const requestPayload = {
      prompt: enhancedPrompt,
      width: 1200,
      height: 800,
    };

    // Build URL with token as query parameter (as per Pixlr docs)
    const apiUrl = `https://pixlr.com/api/ai/generate?token=${encodeURIComponent(token)}`;

    console.log("Sending request to Pixlr API with JWT token in query param");

    // Make request to Pixlr API with JWT token in URL
    const pixlrResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    });

    if (!pixlrResponse.ok) {
      const errorText = await pixlrResponse.text();
      console.error("Pixlr API error:", errorText);
      console.error("Status:", pixlrResponse.status);
      return new Response(
        JSON.stringify({ 
          error: "Failed to generate image with Pixlr",
          status: pixlrResponse.status,
          details: errorText 
        }),
        {
          status: pixlrResponse.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const pixlrData = await pixlrResponse.json();
    console.log("Pixlr API success:", pixlrData);

    return new Response(
      JSON.stringify(pixlrData),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in pixlr-generate function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});