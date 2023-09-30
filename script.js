"use strict"

// Här skriver vi JavaScript

// ===================== TRANSLATION FUNCTIONALITY =====================


const timesetOutInterval = 60000; // timer to revert the translated text back to the original text after a minute

/**
 * Fetches the translation for a text chunk using the translation API.
 *
 * @param {string} chunk - The chunk of text to translate.
 * @param {string} language - The target language code.
 * @returns {Object} - Response data from the translation API.
 */
async function fetchTranslation(chunk, language) {
  const response = await fetch("http://127.0.0.1:5000/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: chunk, language }),
  });

  return await response.json();
}









/**
 * Translates a given text into the specified language using API. from Python
 * 
 * @param {string} text - The text to translate.
 * @param {string} language - The target language code.
 * @returns {string} - The translated text.
 */
async function translateText(text, language) {
  const chunkSize = 1000;  // Define the max size for each chunk
  const chunks = [];
  let currentChunk = "";

  for (let i = 0; i < text.length; i++) {
    currentChunk += text[i];

    // When reaching the chunk size limit or end of text, fetch translation
    if (currentChunk.length >= chunkSize || i === text.length - 1) {
      const data = await fetchTranslation(currentChunk, language);
      // console.log(data);
      chunks.push(data.translated);
      currentChunk = "";
    }
  }

  return chunks.join(""); 
}







// Event listener for language change
document.getElementById("languageSelect").addEventListener("change", async function () {
  const language = this.value;

  // Elements to translate
  const textElements = document.querySelectorAll("#text h1, #text .paragraph");
  console.log(textElements.entries());

  for (let element of textElements) {
    // Check if the "data-original-text" attribute is already set
    let originalText = element.getAttribute("data-original-text");

    // If not, set the attribute with the current content of the element
    if (!originalText) {
      originalText = element.textContent;
      element.setAttribute("data-original-text", originalText);
    }

    // Translate the text
    const translatedText = await translateText(originalText, language);
    element.innerHTML = translatedText;

    // Set a timer to revert the translated text back to the original text
    setTimeout(() => {
      element.innerHTML = originalText;
    }, timesetOutInterval);
  }
});




// Reference to the language select dropdown
const languageSelect = document.getElementById("languageSelect");

// Store the original HTML content of the dropdown
const originalOptions = languageSelect.innerHTML;
console.log(originalOptions)

// When the value of the dropdown changes
languageSelect.addEventListener("change", function() {

    // After any changes, set a timer to revert to original options
    setTimeout(() => {
        // Restore the original dropdown content
        languageSelect.innerHTML = originalOptions;

        // Optionally, reset the selected option to original value Svenska.
        languageSelect.selectedIndex = 0;
    }, timesetOutInterval); // Timer is counted in miliseconds 60000 = 1 minute
});




// ===================== CHATBOT FUNCTIONALITY =====================

// Event listener to ensure DOM content is loaded before the script runs
document.addEventListener("DOMContentLoaded", function() {
  const messages = document.getElementById("messages");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");

  /**
   * Adds a message to the chat window.
   * 
   * @param {string} content - The message text.
   * @param {string} type - The sender type ("user" or "bot").
   */
  function addMessage(content, type) {
    const message = document.createElement("div");
    message.className = type;
    message.textContent = content;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  }










  /**
   * Displays a "typing" indicator for the bot in the chat window.
   * 
   * @returns {HTMLElement} - The typing indicator element.
   */
  function showTypingIndicator() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "bot typing";
    typingDiv.textContent = "Bot is typing...";
    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;
    return typingDiv;
  }




/**
 * Checks if a given string contains the search term, accounting for potential small errors or misspellings.
 *
 * @param {string} string - The main string in which to look for the searchTerm.
 * @param {string} searchTerm - The term to search for within the string.
 * @returns {boolean} - Returns true if the searchTerm is found within the string, false otherwise.
 */
function fuzzyIncludes(string, searchTerm) {
    // Calculate the difference in length between the main string and the searchTerm.
    const distance = string.length - searchTerm.length;

    // For each position in the main string up to the distance...
    for (let i = 0; i <= distance; i++) {
        // This allows us to compare the searchTerm to various parts of the main string.
        const subString = string.substring(i, i + searchTerm.length);

        // If any of these substrings include the searchTerm, return true.
        if (subString.includes(searchTerm)) {
            return true;
        }
    }
    return false;
}



/**
 * Determines the bot's reply based on the user's input.
 *
 * @param {string} input - The user's input.
 * @returns {string} - The bot's reply.
 */
function getBotReply(input) {
    const lowerInput = input.toLowerCase();

    if (fuzzyIncludes(lowerInput, "iss") || fuzzyIncludes(lowerInput, "rymdstationen")) {
        return "ISS är den internationella rymdstationen som kretsar runt jorden.";
    } else if (fuzzyIncludes(lowerInput, "besättning")) {
        return "Många astronauter från olika länder har bott på ISS.";
    } else if (fuzzyIncludes(lowerInput, "experiment")) {
        return "På ISS utförs många vetenskapliga experiment inom olika forskningsområden.";
    } else if (fuzzyIncludes(lowerInput, "lansering")) {
        return "Den första ISS-komponenten lanserades 1998.";
    } else if (fuzzyIncludes(lowerInput, "ägare")) {
        return "Projektet involverar fem rymdorganisationer: NASA, Roscosmos, JAXA, ESA och CSA.";
    } else if (fuzzyIncludes(lowerInput, "levnadstid")) {
        return "I januari 2022 förlängdes stationens drifttillstånd till 2030.";
    } else if (fuzzyIncludes(lowerInput, "rymdfarkost")) {
        return "Stationen betjänas av en mängd besökande rymdfarkoster som Soyuz, Progress, Dragon och Cygnus.";
    } else if (fuzzyIncludes(lowerInput, "hi") || fuzzyIncludes(lowerInput, "hej")) {
        return "Hej! Hur kan jag hjälpa dig idag?";
    } else if (fuzzyIncludes(lowerInput, "adjö") || fuzzyIncludes(lowerInput, "vi ses")  || fuzzyIncludes(lowerInput, "hej då")) {
        return "Adjö! Om du har fler frågor i framtiden, tveka inte att fråga.";
    } else if (fuzzyIncludes(lowerInput, "hur mår du")) {
        return "Jag är bara ett program, så jag har inga känslor, men tack för att du frågar!";
    } else if (fuzzyIncludes(lowerInput, "vem skapade dig")) {
        return "Jag utvecklades av duktiga ingenjörer.";
    } else {
        return "Jag är osäker på det. Kan du specificera mer?";
    }
}


// Reset the messge
document.getElementById("reset-button").addEventListener("click", function() {
    document.getElementById("messages").innerHTML = "";
});



  /**
   * Handles the user's input, sending it to the chat and fetching the bot's reply.
   */
  function handleUserInput() {
    const userText = userInput.value;

    // Checks if the user's input is empty or just whitespace. If it is, the function returns without proceeding.
    if (userText.trim() === "") return;

    // Adds the user's message to the chatbox with the "user" classification.
    addMessage(userText, "user");


    // Displays a typing indicator to simulate the bot is processing/thinking.
    const typingIndicator = showTypingIndicator();


    // Fetches the reply from the bot for the given user input.
    const botReply = getBotReply(userText);

    // Uses a setTimeout to simulate a delay before the bot responds.
    setTimeout(() => {
      messages.removeChild(typingIndicator);  // Remove typing indicator
      addMessage(botReply, "bot");
    }, 1500);  // 1.5-second delay to simulate bot thinking
 // Resets the user's input field to be empty.
    userInput.value = "";
  }







  // Listen for click event on the send button
  sendButton.addEventListener("click", handleUserInput);

  // Listen for Enter key in the input field
  userInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      handleUserInput();
    }
  });
});
