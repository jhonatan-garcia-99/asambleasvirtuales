const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/admindate', async(req, res) => {

    if (req.user.id == 1) {
        res.render('new/adminvotacion');

    } else {
        req.flash('message', 'No tienes acceso a esta area de la aplicacion');
        res.redirect('/');

    }
});


router.get('/participantes', async(req, res) => {
    const produc = await pool.query('SELECT * FROM bd_conjunto_datos  ORDER BY `bd_conjunto_datos`.`create_at` DESC');
    res.json(produc)
})

router.get('/porcentajes', async(req, res) => {
    const produc = await pool.query('SELECT coeficiente FROM bd_conjunto_datos');
    suma = 0.00

    produc.forEach(produ => {
        console.log(suma)
        suma += produ.coeficiente
    })

    porcentaje = {
        sumatotal: suma,
        restatotal: 100 - suma
    }

    res.json(porcentaje)
})



router.post('/estadisticas', async(req, res) => {
    const produc = await pool.query('SELECT * FROM votaviones');
    var imprimir = "";

    for (let index = 0; index < produc.length; index++) {
        const element = await pool.query(`SELECT * FROM ${produc[index].nametable}`);
        var identificador = "";
        var valor = "";

        //console.log(Object.keys(element[0]).length)
        for (let index2 = 1; index2 < Object.keys(element[0]).length - 2; index2++) {
            identificador += `'${Object.keys(element[0])[index2]}',`;
            //console.log(`SELECT * FROM ${produc[index].nametable} where ${Object.keys(element[0])[index]} = "${Object.keys(element[0])[index]}"`)
            const elementos = await pool.query(`SELECT * FROM ${produc[index].nametable} where ${Object.keys(element[0])[index2]} = "${Object.keys(element[0])[index2]}"`);
            valor += `${elementos.length} ,`
                //Object.keys(element[0])[index]
        }

        imprimir += `
    <div class="col-md-6 mt-4">
        <div class="card">
            <div class="card-header">
                <g4>${produc[index].nametable}</g4>
            </div>
            <div  class="card-body" style="height: 600px; overflow-y: scroll;">
                <div id="${produc[index].nametable}"></div>
            </div>
        </div>              
    </div>
    
        <script type="text/javascript">
    Highcharts.chart('${produc[index].nametable}', {
        chart: {
            type: 'column'
        },
        title: {
            text: '${produc[index].nametable}'
        },
        xAxis: {
            categories: [
                ${identificador}
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Votos'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Tokyo',
            data: [${valor}]
    
        }]
    });
            </script>`

        //console.log(imprimir)
    }

    res.send(imprimir)
})

/*
<div class="col-md-6 mt-4">
    <div class="card">
        <div class="card-header">
            <g4>Participantes Nuevos</g4>
        </div>
        <div  class="card-body" style="height: 600px; overflow-y: scroll;">
            <div id="container"></div>
        </div>
    </div>              
</div>

	<script type="text/javascript">
Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Monthly Average Rainfall'
    },
    subtitle: {
        text: 'Source: WorldClimate.com'
    },
    xAxis: {
        categories: [
            'Si',
            'NO'
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Rainfall (mm)'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'Tokyo',
        data: [49.9, 71.5]

    }]
});
		</script>

*/




module.exports = router;