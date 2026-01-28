const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const MODEL = "gemini-1.5-flash";

export async function getAIResponse(userMessage) {
const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
contents: [
{
parts: [{ text: userMessage }],
},
],
}),
}
);

const data = await response.json();

return (
data?.candidates?.[0]?.content?.parts?.[0]?.text ||
"No response from Gemini"
);
}