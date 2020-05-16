const express = require('express');
const router = express.Router();
const pool = require('../database');


router.get('/votaciones', async(req, res) => {
    if (req.user.id == 1) {
        const links = await pool.query('SELECT * FROM votaviones');
        res.render('votacion/votos', { links });

    } else {
        req.flash('message', 'No tienes acceso a esta area de la aplicacion');
        res.redirect('/');

    }

})

router.get('/delete/:Titulopregunta', async(req, res) => {
    const { Titulopregunta } = req.params;
    await pool.query('UPDATE votaviones SET Estado = "Desactivado"  WHERE Titulopregunta = ?', [Titulopregunta]);
    req.flash('success', `desactivado la votacion ${Titulopregunta}`);
    res.redirect('/votaciones');
});


router.post('/votaciones', async(req, res) => {
    const { Titulopregunta, texto, opcionesvotacion, textoopcionesvotos } = req.body
    var element = "";
    var tablaop = "";
    var array = textoopcionesvotos.split(",");
    console.log(array);
    for (let index = 0; index < array.length; index++) {
        datoactua = array[index].replace(/ /g, "_")
        element += `<div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" id="${datoactua}" name="votacion" value="${array[index]}">
                    <label class="form-check-label" for="${datoactua}">${datoactua}</label>
                    </div>`;
        tablaop += `${datoactua} varchar(60)  DEFAULT "-",`

    }
    nametable = Titulopregunta.replace(/ /g, "_")
    console.log(nametable)
    var pregunta = `
    <form action="/guardarvoto/${Titulopregunta}" method="post" id="formuploadajax">
    <h4 class="h4">${Titulopregunta}</h4>
    <p class="text-lowercase">${texto}</p>
    ${element}
    <button type="submit" class="btn btn-primary mb-2">Confirmar Votacion</button>
    </form>`;
    newLink = {
        nametable,
        Titulopregunta,
        texto,
        opcionesvotacion,
        textoopcionesvotos,
        pregunta
    }

    await pool.query('INSERT INTO votaviones set ?', [newLink]);

    contrai = `fk_user_${opcionesvotacion}`

    await pool.query(`create TABLE ${nametable} (
        id INT PRIMARY KEY AUTO_INCREMENT,
        ${tablaop}
        user_id int(11),
        create_at timestamp not null DEFAULT current_timestamp,
        CONSTRAINT ${nametable} FOREIGN KEY (user_id) REFERENCES users(id)
        )`)
    req.flash('success', 'Votacion Creada');

    res.redirect('/votaciones');


})

router.post('/guardarvoto/:Titulopregunta', async(req, res) => {
    const { votacion } = req.body
    const { Titulopregunta } = req.params;
    nametable = Titulopregunta.replace(/ /g, "_")
    namevoto = votacion.replace(/ /g, "_")
    const consulta = await pool.query(`SELECT * FROM ${nametable}`);

    if (consulta.length != 0) {
        req.flash('message', 'Ya as votado anteriormente no se te permite volver a votar')
        res.redirect('/links')
    } else {

        newLink = {
            user_id: req.user.id,

        }
        newLink[namevoto] = namevoto
        console.log(newLink)
        await pool.query(`INSERT INTO ${nametable} set ?`, [newLink]);

        req.flash('success', 'Voto guardado')
        res.redirect('/links')
    }

})


router.post('/solicitabotacion', async(req, res) => {

    try {
        const resul = await pool.query(`SELECT * FROM votaviones where Estado = "Activa"`)
        if (resul.length != 0) {
            var element = "";
            for (let index = 0; index < resul.length; index++) {
                const resul2 = await pool.query(`SELECT * FROM ${resul[index].nametable} where user_id = ${req.user.id}`)
                console.log(resul2.length)
                if (resul2.length == 0) {
                    element += resul[index].pregunta;
                }

            }
            if (element == "") {
                res.send('No Hay votaciones activas o ya tu voto fue registrado en la plataforma')
            } else {
                res.send(element)
            }

        } else {
            res.send('No Hay votaciones activas o ya tu voto fue registrado en la plataforma')
        }
    } catch (error) {
        res.send('Ups algo paso' + error)
    }

})


module.exports = router;