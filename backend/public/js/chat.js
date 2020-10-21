function scrollDown(id) {
    var el = document.getElementById(id);
    el.scrollTop = el.scrollHeight;
}

$(document).ready(function() {
    var socket = io.connect();

    $(".participant").each(function() {
        $(this).click(function() {
            $(".selected").removeClass("selected");
            $(this).addClass("selected");
            var sala = $(this).find(".name").text();
            sala = sala.replaceAll(' ', '').replace(/\n/g,'');
            socket.emit("entrar sala", sala);
        });
    });

    $("#chat-form").submit(function(e) {
        e.preventDefault();

        var mensagem = $("#message-input").val();

        if (mensagem.length == 0) {
            return;
        }

        var data = {
            chat_id: '',
            message: $("#message-input").val()
        }

        $.post('/message/send', data)

        socket.emit("enviar mensagem", mensagem, function() {
            $("#message-input").val("");
        });

        var mensagem_formatada = `<div class="message-row you-message">
                                        <div class="message-content">
                                            <div class="message-text">${mensagem}</div>
                                        </div>
                                        <div class="message-time">
                                            20 oct
                                        </div>
                                    </div>`;    

        $("#chat-message-list").append(mensagem_formatada);
        document.getElementById(
            "chat-message-list"
        ).scrollTop = document.getElementById("chat-message-list").scrollHeight;
    });

    socket.on("atualizar mensagens", function(mensagem) {
        var mensagem_formatada = `<div class="message-row other-message">
                                        <div class="message-content">
                                            <img src="./images/rodrigo.jpg" alt="rodrigo" /> 
                                            <div class="message-text">${mensagem}</div>
                                        </div>
                                     </div>`;

        $("#chat-message-list").append(mensagem_formatada);
        var el = document.getElementById("chat-message-list");
        el.scrollTop = el.scrollHeight;
    });

    scrollDown("chat-message-list");
});