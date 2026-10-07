exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const bodyData = JSON.parse(event.body);

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData)
    });
const response = await fetch("/api/predict", { method: "POST", headers: { "Authorization": `Token ${apiToken}`, "Content-Type": "application/json", }, body: JSON.stringify({ version: "3f0457e4619daac51203dedb472816fd4af51f3149fa7a2e0b0ffde14a3043d", input: { image: imageBase64, fps: 6, motion_bucket_id: 127 } }) });
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
};
