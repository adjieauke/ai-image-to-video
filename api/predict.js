export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const bodyData = JSON.parse(event.body);

    // Otomatis rapikan format agar sesuai dengan standar Replicate API
    const payload = {
      version: bodyData.version || "3398edbc0fb619d8425255470d0322c3584852e9cb389778c187532d56a73c14",
      input: bodyData.input || {
        image: bodyData.imageUrl || bodyData.image
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
