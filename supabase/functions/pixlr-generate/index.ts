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

    const pixlrClientId = "6906159977cfaad90cf4524a";
    const pixlrClientSecret = "eb5ff1ca98cf405892322b9745eff002";

    const requestPayload = {
      client_key: pixlrClientId,
      client_secret: pixlrClientSecret,
      prompt: prompt.trim(),
      style: style,
      width: 1200,
      height: 800,
    };

    console.log("Sending request to Pixlr API");

    const pixlrResponse = await fetch("https://pixlr.com/api/ai/generate", {
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
    console.log("Pixlr API success");

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