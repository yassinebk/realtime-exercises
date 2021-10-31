// a global called "io" is being loaded separately

const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");
const presence = document.getElementById("presence-indicator");

let allChat = [];

const socket = io("http://localhost:8080");
socket.on("connect", () => {
  presence.innerText = "🟢";
});
socket.on("disconnect", () => {
  console.log("disconnected");
  presence.innerText = "🔴";
});
socket.on("msg:get", (data) => {
  console.log("recieved new msg", data.msg);
  allChat = data.msg;
  render();
});

/*
 *
 * Code goes here
 *
 */

chat.addEventListener("submit", function (e) {
  e.preventDefault();
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});

async function postNewMsg(user, text) {
  const data = {
    user,
    text,
  };

  socket.emit("msg:post", data);
  /*
   *
   * Code goes here
   *
   */
}

function render() {
  const html = allChat.map(({ user, text, time }) => {
    console.log(new Date(time));
    return template(user, text, new Date(time).toUTCString());
  });

  msgs.innerHTML = html.join("\n");
}

const template = (user, msg, time) =>
  `<li class="collection-item">
        <div class="inside-collection-item">
            <span class="badge">${user}</span> ${msg}
        </div> 
            <span>${time}</span>
     </li>`;
