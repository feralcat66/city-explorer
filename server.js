require('dotenv').config();
const express = require('express');
const app = express();
const request = require('superagent');
const cors = require('cors');


app.use(cors());

let lat;
let lng;

app.get('/location', async (req, res, next) => {
    try {
        const location = req.query.search;

        const URL = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${location}&format=json`;
        const cityData = await request.get(URL);
        const firstResult = cityData.body[0];

        lat = firstResult.lat;
        lng = firstResult.lon;

        res.json({
            formatted_query: firstResult.display_name,
            latitude: lat,
            longitude: lng, 
        });
    } catch (err) {
        next(err);
    }
});

const getWeatherData = async(lat, lng) => {
    const weather = await request.get(`https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${lat},${lng}`);
    return weather.body.daily.data.map(forecast => {
        return {
            forecast: forecast.summary,
            time: new Date(forecast.time * 1000),
        };
    });
};
app.get('/weather', async(req, res, next) => {
    try {
        const portlandWeather = await getWeatherData(lat, lng);

        console.log(portlandWeather);

        res.json(portlandWeather);
    } catch (err) {
        next(err);
    }
});

const getTrails = async (lat, lng) => {
    const trails = await request.get(`https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lng}&key=${process.env.TRAILS_API_KEY}`);
    return trails.body.trails.map(trail => {
        
        return {
            name: trail.name,
            summary: trail.summary,
            location: trail.location
        };
    });
};

app.get('/trails', async(req, res, next) => {
    try {
        const myTrail = await getTrails(lat, lng);
        res.json(myTrail);
    } catch (err) {
        next(err);   
    }

});

const getEvent = async (lat, lng) => {
    const events = await request.get(`http://api.eventful.com/json/events/search?app_key=${process.env.EVENT_API_KEY}&where=${lat},${lng}&within=25&page_size=20&page_number=1`);

    const formattedData = JSON.parse(events.text);
    const realData = formattedData.events.event;

    return realData.map(event => {
        return {
            name: event.title,
            date: event.start_time,
            address: event.venue_address,
            link: event.venue_url
        };
    });
    
};

app.get('/events', async(req, res, next) => {
    try {
        const myEvent = await getEvent(lat, lng);
        res.json(myEvent);
    } catch (err) {
        next(err);   
    }

});
                             
module.exports = { app: app };


