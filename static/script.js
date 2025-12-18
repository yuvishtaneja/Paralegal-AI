document.getElementById('input-form').onsubmit = async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    // Add current chat_id to the form
    const activeChat = document.querySelector('.chat-item.active');
    if (activeChat) {
        formData.append('chat_id', activeChat.getAttribute('data-chat-id'));
    }
    const res = await fetch('/api/chat', { method: 'POST', body: formData });
    const data = await res.json();
    renderChats(data.chats, data.chat_id);
    renderChatList(data.chat_list, data.chat_id);
    this.reset();
    fileNamesSpan.textContent = '';
};

function renderChats(chats, chat_id) {
    const chatArea = document.getElementById('chat-area');
    chatArea.innerHTML = '';
    chats.forEach(msg => {
        if (msg.user && msg.user.trim() !== "") {
            let userMsgHtml = `<div class="user-msg">`;
            if (msg.files && msg.files.length > 0) {
                userMsgHtml += `<div class='attached-files'><b>Files:</b> ${msg.files.join(', ')}</div>`;
            }
            userMsgHtml += `<div class='user-prompt'>${msg.user}</div>`;
            userMsgHtml += `</div>`;
            chatArea.innerHTML += userMsgHtml;
        }
        if (msg.ai && msg.ai.trim() !== "") {
            chatArea.innerHTML += `<div class="ai-response">${msg.ai}</div>`;
        }
    });
    chatArea.scrollTop = chatArea.scrollHeight;
}

function renderChatList(chatList, currentChatId) {
    const chatListDiv = document.getElementById('chat-list');
    chatListDiv.innerHTML = '';
    // Descending numbering: Chat 1 is most recent (top)
    const total = chatList.length;
    chatList.forEach((chat_id, idx) => {
        const div = document.createElement('div');
        div.className = 'chat-item' + (chat_id === currentChatId ? ' active' : '');
        div.setAttribute('data-chat-id', chat_id);
        div.textContent = `Chat ${total - idx}`;
        chatListDiv.appendChild(div);
    });
    addChatItemListeners();
}

function addChatItemListeners() {
    document.querySelectorAll('.chat-item').forEach(item => {
        item.onclick = async function() {
            const chat_id = this.getAttribute('data-chat-id');
            // Use /api/get_chat for both logged-in users and guests
            const res = await fetch('/api/get_chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id })
            });
            if (res.ok) {
                const data = await res.json();
                renderChats(data.chats, chat_id);
                renderChatList(Array.from(document.querySelectorAll('.chat-item')).map(i => i.getAttribute('data-chat-id')), chat_id);
            }
        };
    });
}

addChatItemListeners();

document.getElementById('new-chat').onclick = async function() {
    const res = await fetch('/api/new_chat', { method: 'POST' });
    const data = await res.json();
    renderChats(data.chats, data.chat_id);
    // Use the chat_list returned from /api/new_chat for correct order and selection
    renderChatList(data.chat_list, data.chat_id);
};

// Show selected file names
const fileInput = document.getElementById('file-input');
const fileNamesSpan = document.getElementById('file-names');
fileInput.addEventListener('change', function() {
    if (fileInput.files.length > 0) {
        const names = Array.from(fileInput.files).map(f => f.name).join(', ');
        fileNamesSpan.textContent = names;
    } else {
        fileNamesSpan.textContent = '';
    }
});

firebase.auth().onAuthStateChanged(async (user) => {
    if (user && !sessionStorage.getItem('sessionSet')) {
        const idToken = await user.getIdToken();
        const res = await fetch('/sessionLogin', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ idToken })
        });
        if (res.ok) {
            sessionStorage.setItem('sessionSet', 'true');
            window.location.href = '/';  // reload page as authenticated
        }
    }
});

// Example: If you have a logout button
document.querySelector('.logout-link')?.addEventListener('click', function(e) {
    e.preventDefault();
    firebase.auth().signOut().then(() => {
        sessionStorage.removeItem('sessionSet');
        window.location.href = '/logout';
    });
}); 