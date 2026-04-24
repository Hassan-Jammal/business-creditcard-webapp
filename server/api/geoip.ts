import maxmind from 'maxmind';
import path from 'path';

function getClientIp(event) {
    return (
        getRequestHeader(event, 'cf-connecting-ip') ||
        getRequestHeader(event, 'x-real-ip') ||
        getRequestHeader(event, 'x-forwarded-for')?.split(',')[0].trim() ||
        event.node.req.socket?.remoteAddress ||
        null
    );
}

function normalizeIp(ip) {
    return ip?.replace('::ffff:', '');
}

function isPrivateIp(ip) {
    return /^(10\.|172\.(1[6-9]|2\d|3[0-1])\.|192\.168\.|127\.|::1)/.test(ip);
}

export default defineEventHandler(async (event) => {
    const geoDbPath = path.resolve('server/geoip/GeoLite2-Country.mmdb');

    const testIp = '100.128.0.1'; // Replace with an IP you want to test (US)
    const testIp1 = '109.110.96.1'; // Replace with an IP you want to test (Lebanon)
    const testIp2 = '101.44.32.1'; // Replace with an IP you want to test (Turkey)
    const testIp3 = '101.56.0.1'; // Replace with an IP you want to test (Italy)
    const testIp4 = '109.120.192.1'; // Replace with an IP you want to test (Bulgaria)
    const testIp5 = '178.238.11.6'; // Replace with an IP you want to test (United Kingdom)
    const testIp6 = '202.70.125.9'; // Replace with an IP you want to test (American Samoa)

    let ip = process.env.NODE_ENV === 'development' ? testIp : getClientIp(event);

    ip = normalizeIp(ip);

    if (!ip || isPrivateIp(ip)) {
        return { country: 'LB' };
    }

    try {
        const lookup = await maxmind.open(geoDbPath);
        const geoData = lookup.get(ip);

        return {
            country: geoData?.country?.iso_code || 'LB',
        };
    } catch {
        return { country: 'LB' };
    }
});
