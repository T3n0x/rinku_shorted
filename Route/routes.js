const format = require('date-format');

const express = require('express');
const Route = express.Router();

const path = require('./../functions/random_url');
const sql = require('../functions/sqlite')


Date.prototype.addDays = function (days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Route.get('/', (req, res) => {
    try{
        let url_params

        if (req.query.u) {
            let URL_LINK = new URL(req.query.u)
            let datetime = new Date()
            let new_path = req.query.n
            let currentDate = format('yyyy-MM-dd', datetime)
            let limitDate = format('yyyy-MM-dd', datetime.addDays(parseInt(req.query.d)))

            let add_url = sql.short_url(new_path, URL_LINK.href, null, currentDate, limitDate)
        
            url_params = {
                path : new_path,
                origin : req.headers.host,
                new_link : req.protocol+"://"+req.headers.host+'/'+new_path,
                protocol : URL_LINK.protocol
            }
        }
        

        res.render('index', {
            url : url_params,
            input : req.query.u,
            path : path(Math.floor((Math.random() + 1) * 5))
        })
    } catch (err){
        console.error(err);
        return res.status(500).send('Server Error')
    }
});

Route.get('/:url', (req, res) => {
    try{
        let row = sql.get_url(req.params.url)
            .then(result => {
                if(result){ res.redirect(result.location) }
                else{ return res.status(404).render('error', { type: 404}) }
            })
    }catch (err) {
        console.error(err);
        return res.status(500).send('Server Error')
    }
})

module.exports = Route;