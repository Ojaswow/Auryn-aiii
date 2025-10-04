const sendBtn = document.getElementById('send');
const inputBox = document.getElementById('input');
const messages = document.getElementById('messages');

// ------------------------
// Local brain (offline responses)
// ------------------------
function aurynLocalBrain(userInput) {
  const input = userInput.toLowerCase();
  if (input.includes("who made you") || input.includes("developer")) {
    return "I was developed by Ojas, a solo developer. He built me entirely on a mobile phone as a personal AI assistant project.";
  } else if (input.includes("hello") || input.includes("hi auryn")) {
    return "Hello, I am Auryn [Orion]! How can I help you today?";
  } else if (input.includes("exit") || input.includes("quit")) {
    return "exit";
  } else if (input.includes("guess number")) {
    return "🕹️ Game mode not available here. (Can be added later).";
  } else {
    return null; // pass to API
  }
}

// ------------------------
// Append message to chat window
// ------------------------
function appendMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${sender}`;
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'bubble';
  bubbleDiv.textContent = text;
  msgDiv.appendChild(bubbleDiv);
  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
}

// ------------------------
// Page load AI greeting
// ------------------------
window.addEventListener('DOMContentLoaded', () => {
  const greetMsg = "🤖 Hi! I'm Auryn, made by Ojas 😎, your personal AI assistant at your service! 🎉";
  appendMessage(greetMsg, 'left');
});

// ------------------------
// Call Worker endpoint (instead of direct Groq API)
// ------------------------
async function aurynWorkerAI(userInput) {
  appendMessage(userInput, 'right'); // user message

  try {
    const response = await fetch("https://red-union-0301.tiwariojas459.workers.dev/", { // <-- apna Worker URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userInput })
    });

    const data = await response.json();
    const aiText = data.choices?.[0]?.message?.content || "Sorry, I couldn't understand that.";
    appendMessage(aiText, 'left');

  } catch (error) {
    console.error(error);
    appendMessage("⚠️ Something went wrong with the AI request.", 'left');
  }
}

// ------------------------
// Handle user input
// ------------------------
async function handleInput() {
  const userInput = inputBox.value.trim();
  if (!userInput) return;
  inputBox.value = '';

  const localReply = aurynLocalBrain(userInput);
  if (localReply === "exit") {
    appendMessage("Auryn: Shutting down. Goodbye 👋", 'left');
    return;
  } else if (localReply) {
    appendMessage(localReply, 'left');
  } else {
    appendMessage("(thinking with Auryn AI...)", 'left');
    await aurynWorkerAI(userInput);
  }
}

// Event listeners
sendBtn.addEventListener('click', handleInput);
inputBox.addEventListener('keydown', (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleInput();
  }
});
