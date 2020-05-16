$(function() {
    const socket = io()


    //optener partes del dom delc front
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');
    const $nombre = document.getElementById("nombre").value;

    //eventos
    $messageForm.submit(e => {
        e.preventDefault();
        socket.emit('canal', $nombre, data => {
            console.log(data)

        });
        socket.emit('send message', {
            msg: $messageBox.val(),
            nickname: $nombre
        }, datos => {
            $chat.append(`<p class="error">${datos}</p>`)
        });

        $messageBox.val('')

    });

    socket.on('whisper', data => {
        $chat.append(`<h6 class="h6">${data.nick} : </h6>${data.msg}<br>`)
    })

    socket.on('new message', function(data) {

        $chat.append('<h6 class="h6">' + data.nick + ': </h6>' + data.msg + '<br>');


    });



})