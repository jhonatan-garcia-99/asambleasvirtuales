$('#datosasamblea').on('click', function() {
    $.ajax({
            url: "/solicitabotacion",
            type: "post",
            dataType: "html",
            data: "",
            cache: false,
            contentType: false,
            processData: false
        })
        .done(function(res) {
            $("#pregunta").html(res);
        });
})