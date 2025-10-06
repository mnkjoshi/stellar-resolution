// utils.js
// Tawfeeq Mannan

// lat/long-to-RA/Dec conversions adapted from https://github.com/legacysurvey/imagine/blob/main/static/utils.js
export function ra2long(ra) {
    return 180 - ra;
}

export function long2ra(lng) {
    return 180 - lng;
}

export function dec2lat(dec) {
    return dec;
}

export function lat2dec(lat) {
    return lat;
}

// mercator-to-lat/long conversions from https://stackoverflow.com/questions/14329691/
export function long2x(lng, width) {
    return (lng + 180) * (width / 360);
}

export function x2long(x, width) {
    return x * (360 / width) - 180;
}

export function lat2y(lat, width, height) {
    let R = width / (2 * Math.PI);
    let latRad = lat * Math.PI / 180.;
    let mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    return (height / 2) - (R * mercN);
}

export function y2lat(y, width, height) {
    let R = width / (2 * Math.PI);
    let mercN = (height / 2 - y) / R
    let latRad = (Math.atan(Math.exp(mercN)) - Math.PI / 4) * 2;
    return latRad * (180 / Math.PI);
}
