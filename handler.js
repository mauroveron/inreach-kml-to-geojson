'use strict';

const fetch = require('node-fetch');
const togeojson = require('@mapbox/togeojson');
const DOMParser = require('xmldom').DOMParser;


module.exports.inreach = async event => {
    const username = process.env.GARMIN_MAPSHARE_USERNAME
    const password = process.env.GARMIN_MAPSHARE_PASSWORD
    const mapshare_url = process.env.GARMIN_MAPSHARE_URL
    // const date_from = process.env.GARMIN_MAPSHARE_D1 || "2021-02-01T00:00z";
    const auth = new Buffer(`${username}:${password}`).toString('base64');

    // const response = await fetch(mapshare_url + `?d1=${date_from}`, {
    const response = await fetch(mapshare_url + ``, {
        headers: {
            Authorization: 'Basic ' + auth
        }
    });
    const kml = await response.text();
    const geojson = togeojson.kml(new DOMParser('xmldom').parseFromString(kml));

    for (var i=0; i < geojson.features.length; i++) {
        if (geojson.features[i].geometry.type == 'LineString') {
            geojson.features.splice(i, 1);
        }
    }

    console.log(geojson);

    function filterOutSentisiveStuff(key, value) {
        const excludeKeys = [
            "IMEI",
            "In Emergency",
            "Device Identifier",
            "Incident Id",
            "Text",
            "Event"
        ];
        if (key != "properties") {
            return value
        }

        excludeKeys.forEach(excludedKey => {
            if (excludedKey in value) {
                delete value[excludedKey];
            }
        })

        return value;
    }

    return {
        statusCode: 200,
        body: JSON.stringify(geojson, filterOutSentisiveStuff, 2),
        headers: {
            "Access-Control-Allow-Headers": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET"
        }
    };
};
