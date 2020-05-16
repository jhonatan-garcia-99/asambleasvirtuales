//Tabla 



$(function() {

    $('#datosasamblea').on('click', function() {
        $.ajax({
            url: '/participantes',
            success: function(produc) {

                let tbody = $('tbody');
                tbody.html('');
                let num = 0;
                produc.forEach(produ => {
                    num += 1;
                    var fecha = produ.create_at.split('T')[1].split('.')[0].split(':');

                    formato = fecha[0] - 5;
                    if (formato == 0) {
                        formato = '00'
                    } else if (formato < 0) {
                        formato = 24 + formato
                    } else if (formato > 0 && formato < 10) {
                        formato = ' ' + '0' + formato
                    } else {
                        formato = formato
                    }

                    tbody.append(`
                    <tr>
                        <th scope="row">${num}</th>
                        <td>${produ.nombres_apalledios}</td>
                        <td>${produ.param_vivienda_1}</td>
                        <td>${produ.param_vivienda_2}</td>
                        <td>${formato}:${fecha[1]}:${fecha[2]}</td>
                    </tr>
                     `)
                });



            }
        })
        $.ajax({
            url: '/porcentajes',
            success: function(porcentaje) {
                $("#asisitido").val(porcentaje.sumatotal);
                $("#noasisitido").val(porcentaje.restatotal);


                Highcharts.chart('container', {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: 0,
                        plotShadow: false
                    },
                    title: {
                        text: 'Asamblea',
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 60
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                enabled: true,
                                distance: -50,
                                style: {
                                    fontWeight: 'bold',
                                    color: 'white'
                                }
                            },
                            startAngle: -90,
                            endAngle: 90,
                            center: ['50%', '75%'],
                            size: '110%'
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'Browser share',
                        innerSize: '50%',
                        data: [
                            ['Asistidos', porcentaje.sumatotal],
                            ['Faltantes', porcentaje.restatotal],


                        ]
                    }]
                });

            }
        })
    })
})


$(function() {

    $('#datosvotacio').on('click', function() {
        $.ajax({
                url: "/estadisticas",
                type: "post",
                dataType: "html",
                data: "",
                cache: false,
                contentType: false,
                processData: false
            })
            .done(function(res) {
                $("#votacione").html(res);
            });
    })
})






// tbody.append(`
// <tr>
//     <th scope="row">${num}</th>
//     <td>${produ.nombres_apalledios}</td>
//     <td>${produ.param_vivienda_1}</td>
//     <td>${produ.param_vivienda_2}</td>
//     <td>${produ.coeficiente}</td>
//     <td>${formato}:${fecha[1]}:${fecha[2]}</td>
// </tr>
// `)




// {
//     name: 'Other',
//     y: 7.61,
//     dataLabels: {
//         enabled: false
//     }
// }