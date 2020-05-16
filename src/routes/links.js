const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', async(req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('success', 'Link Saved Successfully');
    res.redirect('/links');
});
router.get('/', isLoggedIn, async(req, res) => {
    const links = await pool.query('SELECT * FROM bd_conjunto_datos WHERE user_id = ?', [req.user.id]);

    //console.log(links[0].id)
    datos = {
        id: links[0].id,
        nombres_apalledios: links[0].nombres_apalledios,
        param_vivienda_1: links[0].param_vivienda_1,
        param_vivienda_2: links[0].param_vivienda_2
    }
    res.render('links/asamblea', { datos });
});

router.get('/:username', isLoggedIn, async(req, res) => {
    const { username } = req.params;
    const rows = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    const links = await pool.query('SELECT * FROM bd_conjunto_datos WHERE user_id = ?', [req.user.id]);
    console.log(links[0])
    link = {
        id: req.user.id,
        nombres_apalledios: '',
        param_vivienda_1: '',
        param_vivienda_2: '',
        correo_electronico: '',
        numero_documento: '',
        estado: 'nuevo'
    }
    if (links[0] != undefined) {
        link.nombres_apalledios = links[0].nombres_apalledios
        link.param_vivienda_1 = links[0].param_vivienda_1
        link.param_vivienda_2 = links[0].param_vivienda_2
        link.correo_electronico = links[0].correo_electronico
        link.numero_documento = links[0].numero_documento
        link.estado = 'viejo'
    }
    res.render('links/datos', { link });
});

router.get('/delete/:id', async(req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/links');
});

router.get('/edit/:id', async(req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    console.log(links);
    res.render('links/edit', { link: links[0] });
});

router.post('/edit/:id/:estado', async(req, res) => {
    const { id, estado } = req.params;
    const { nombres_apalledios, param_vivienda_1, param_vivienda_2, correo_electronico, numero_documento } = req.body;
    let now = new Date()
    const newLink = {
        id,
        nombres_apalledios,
        param_vivienda_1,
        param_vivienda_2,
        correo_electronico,
        numero_documento,
        coeficiente: 2.21,
        user_id: id,
        create_at: now
    };
    console.log(newLink)
    console.log(estado)
    if (estado == 'nuevo') {
        await pool.query('INSERT INTO bd_conjunto_datos (id, nombres_apalledios, param_vivienda_1, param_vivienda_2, correo_electronico, numero_documento, coeficiente, user_id, create_at) values (?,?,?,?,?,?,?,?,?)', [newLink.id, newLink.nombres_apalledios, newLink.param_vivienda_1, newLink.param_vivienda_2, newLink.correo_electronico, newLink.numero_documento, newLink.coeficiente, newLink.user_id, newLink.create_at]);
    } else {
        await pool.query('UPDATE bd_conjunto_datos set ? WHERE id = ?', [newLink, id]);
    }
    req.flash('success', 'Link Updated Successfully');
    res.redirect('/links');
});



module.exports = router;