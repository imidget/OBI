// Виджет бота поддержки: открывает окно чата, отправляет сообщение на сервер и показывает ответ

// Находим элементы виджета на странице по их id
const chatToggle = document.getElementById("chat-toggle");
const chatPanel = document.getElementById("chat-panel");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

// Нажали на круглую кнопку — открываем или закрываем окно чата
chatToggle.addEventListener("click", function () {
  chatPanel.hidden = !chatPanel.hidden;
  if (!chatPanel.hidden) {
    chatInput.focus(); // сразу ставим курсор в поле ввода
  }
});

// Добавляет одно сообщение в окно чата.
// who — "user" (пользователь) или "bot" (бот)
function addMessage(text, who) {
  const div = document.createElement("div");
  div.className = "chat-msg " + who;
  div.textContent = text; // textContent, а не innerHTML: так нельзя подсунуть вредный HTML-код
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight; // прокручиваем к последнему сообщению
}

// Отправляет сообщение на сервер и показывает ответ
async function sendMessage() {
  const text = chatInput.value.trim(); // убираем пробелы по краям
  if (text === "") {
    return; // пустое сообщение не отправляем
  }

  addMessage(text, "user");
  chatInput.value = "";

  try {
    // Отправляем запрос на наш сервер по адресу /api/chat
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const data = await response.json(); // ответ сервера, например {"reply": "..."}
    addMessage(data.reply, "bot");
  } catch (error) {
    // Сервер не запущен или пропал интернет
    addMessage("Не удалось связаться с сервером. Попробуйте позже.", "bot");
  }
}

// Отправка по кнопке и по клавише Enter
chatSend.addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});
