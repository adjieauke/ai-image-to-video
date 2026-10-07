export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const bodyData = JSON.parse(event.body);

    // Otomatis terjemahkan format agar sesuai dengan standar Replicate API
    let payload = bodyData;
    if (bodyData.imageUrl && !bodyData.input) {
      payload = {
        version: "3f0457e4619daac51203dedb472816fd4af51f3149fa7a2e0b0ffde14a3043d",
        input: {
          image: bodyData.imageUrl
        }
      };
    } else if (!bodyData.version || !bodyData.input) {
      payload = {
        version: bodyData.version || "3f0457e4619daac51203dedb472816fd4af51f3149fa7a2e0b0ffde14a3043d",
        input: bodyData.input || { image: bodyData.imageUrl || bodyData.image }
      };
    }

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
