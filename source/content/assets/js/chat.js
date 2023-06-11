// https://github.com/farzadex-eth/DjangoChatGPT
// adopted by Jiahang Li on June 11, 2023

const promptForm = document.getElementById("prompt-form");
const promptBtn = document.getElementById("prompt-btn");
let chatbox = document.getElementById("chatbox");

var converter = new showdown.Converter();

// get csrf token from cookies
const getCsrf = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; csrftoken=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return "";
}

// get last 10 messages in history for the user
const getLastTen = async () => {
    const formData = new FormData();
    formData.append("history", 10);
    formData.append("csrfmiddlewaretoken", getCsrf());
    const formRequest = new URLSearchParams(formData);
    fetch('/chat/', {
        method: 'post',
        body: formRequest,
    })
        .then(resp => resp.json())
        .then(data => {
            if(data.error) {
                chatbox.innerHTML = `<div class="message"><p class="bubble error">🚫: ${data.msg}</p></div>`;
            } else {
                chatbox.innerHTML = "";
                data.history.forEach((msg) => {
                    chatbox.innerHTML += `<div class="message"><div class="bubble ${msg['role'] === 'user' ? 'right' : 'left'}">${msg['role'] === 'user' ? '🙂' : '🤖'}: ${converter.makeHtml(msg['content'])}</div></div>`;
                    chatbox.scrollTop = chatbox.scrollHeight;
                })
            }
        })
}

// submit the prompt and wait for the reply
const submitChat = async (e) => {
    e.preventDefault();
    const formData = new FormData(promptForm);
    console.log(formData)
    const formRequest = new URLSearchParams(formData);
    new_content = `<div class="message"><div class="bubble right">🙂:<br>${formData.get("prompt")}</div></div>`;
    new_content = new_content.replace(/(\r\n)|(\n)/g,'<br>');
    chatbox.innerHTML += new_content;
    chatbox.scrollTop = chatbox.scrollHeight;
    promptForm.reset();
    fetch('/chat/', {
        method: 'post',
        body: formRequest,
    })
        .then(resp => resp.json())
        .then(data => {
            if (data.error) {
                console.log(data.msg);
                chatbox.innerHTML += `<div class="message"><div class="bubble error">🚫: ${data.msg}</div></div>`;
            } else {
                chatbox.innerHTML += `<div class="message"><div class="bubble left">🤖: ${converter.makeHtml(data.response)}</div></div>`;
                chatbox.scrollTop = chatbox.scrollHeight;
            }
        })
}

/// shift/ctrl + enter line break, enter submit, implement in jQuery
$("#prompt").keydown(function (event) {
    if (event.keyCode == 13 && (!event.shiftKey && !event.ctrlKey)) {
        // Prevent the default behavior of the enter key
        event.preventDefault();
        $("#prompt-btn").click();
        return false;
    }
    else {
        return true;
    }
    
})


//load the history
// TODO: we need this part to load history message
// document.addEventListener("DOMContentLoaded", getLastTen)

//submit the prompt
promptForm.addEventListener("submit", submitChat);
promptBtn.addEventListener("click", submitChat);
// https://github.com/farzadex-eth/DjangoChatGPT