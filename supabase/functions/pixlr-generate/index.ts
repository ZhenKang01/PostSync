import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import jwt from "https://esm.sh/jsonwebtoken";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GenerateRequest {
  prompt: string;
  style: string;
}

const PIXLR_CLIENT_KEY = Deno.env.get("PIXLR_CLIENT_KEY") || "6906159977cfaad90cf4524a";
const PIXLR_CLIENT_SECRET = Deno.env.get("PIXLR_CLIENT_SECRET") || "eb5ff1ca98cf405892322b9745eff002";

function generatePixlrToken(payload: Record<string, any>): string {
  return jwt.sign(payload, PIXLR_CLIENT_SECRET, { algorithm: "HS256" });
}

Deno.serve(async (req: Request) => {
  console.log("Function invoked!", req.method);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { prompt, style } = body as GenerateRequest;

    if (!prompt || prompt.trim().length < 10) {
      return new Response(JSON.stringify({ error: "Prompt must be at least 10 characters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!style) {
      return new Response(JSON.stringify({ error: "Style is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stylePrompts: Record<string, string> = {
      modern: "modern, clean, contemporary, sleek design",
      vintage: "vintage, retro, classic, nostalgic style",
      minimalist: "minimalist, simple, clean lines, uncluttered",
      bold: "bold, vibrant, striking colors, dynamic",
      professional: "professional, business, corporate, polished",
      artistic: "artistic, creative, expressive, imaginative",
    };
    const enhancedPrompt = `${prompt}, ${stylePrompts[style] || "beautiful style"}, high quality, detailed, 4k`;
    console.log("Generating image with prompt:", enhancedPrompt);

    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: { num_inference_steps: 30, guidance_scale: 7.5 },
        }),
      }
    );
    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      if (hfResponse.status === 503) {
        return new Response(
          JSON.stringify({
            error: "AI model is warming up",
            message: "The AI model is loading. Please try again in a moment.",
            status: 503,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      return new Response(
        JSON.stringify({ error: "Failed to generate image", status: hfResponse.status, details: errorText }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    const imageBlob = await hfResponse.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const imageUrl = `data:image/jpeg;base64,${base64}`;

    const pixlrPayload = {
      sub: PIXLR_CLIENT_KEY,
      mode: "embedded",
      origin: new URL(req.url).origin,
      settings: {
        referrer: "PostSync",
      },
    };
    const pixlrToken = generatePixlrToken(pixlrPayload);
    console.log("Generated Pixlr token");

    return new Response(
      JSON.stringify({
        image_url: imageUrl,
        pixlr_token: pixlrToken,
        success: true,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in image generation function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});