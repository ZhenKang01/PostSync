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
  console.log("Function invoked!", req.method);
  
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();
    console.log("Received body:", body);
    
    const { prompt, style } = body as GenerateRequest;

    console.log("Received request - prompt:", prompt, "style:", style);

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

    // Enhanced prompt based on style
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

    // Use Hugging Face's free Stable Diffusion model
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            num_inference_steps: 30,
            guidance_scale: 7.5,
          },
        }),
      }
    );

    console.log("HF Response status:", hfResponse.status);

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error("Hugging Face API error:", errorText);
      console.error("Status:", hfResponse.status);
      
      // If model is loading, return a helpful message
      if (hfResponse.status === 503) {
        return new Response(
          JSON.stringify({ 
            error: "AI model is warming up",
            message: "The AI model is loading. This typically takes 20-30 seconds. Please try again in a moment.",
            status: 503
          }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to generate image",
          status: hfResponse.status,
          details: errorText 
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Get the image blob
    const imageBlob = await hfResponse.blob();
    console.log("Image generated successfully, size:", imageBlob.size);

    // Convert blob to base64
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const imageUrl = `data:image/jpeg;base64,${base64}`;

    return new Response(
      JSON.stringify({ 
        image_url: imageUrl,
        success: true 
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in image generation function:", error);
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