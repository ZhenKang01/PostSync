import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { invitee_email, inviter_name, invite_token, role } = await req.json();

    if (!invitee_email || !invite_token) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // In a production environment, you would send an actual email here
    // For now, we'll just log it and return success
    console.log("Team invitation:", {
      to: invitee_email,
      from: inviter_name,
      token: invite_token,
      role: role,
    });

    // Simulate email sending (in production, integrate with a service like SendGrid, Resend, etc.)
    const inviteUrl = `${req.headers.get("origin") || "http://localhost:5173"}/accept-invite?token=${invite_token}`;

    console.log(`Invitation URL: ${inviteUrl}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Invitation sent successfully",
        invite_url: inviteUrl,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing invitation:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process invitation" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});