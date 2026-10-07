export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const bodyData = JSON.parse(event.body);

    // Otomatis ubah format data agar kompatibel dengan standar Replicate
    const payload = {
      version: bodyData.version || "9f747673945c62801b13b8470217480629b954ee3651ac73efbc12c887f995cf",
      input: {
        image: bodyData.image || bodyData.imageUrl,
        fps: bodyData.fps || 6,
        motion_bucket_id: bodyData.motion_bucket_id || 127,
        cond_aug: 0.02
      }
    };

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
