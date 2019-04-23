const URL = require('url');
const uuid = require('uuid/v4');

function createEvent(data, ipLocked, pairing, { quality, provider, source, isResultOfScrape = false, cookieRequired = '', cookie = '', isDDL = false }, headers) {
    if (ipLocked) {
        return {
            event: 'scrape',
            target: pairing.target,
            headers,
            provider,
            resolver: source,
            cookieRequired,
            isResultOfScrape,
            scrapeId: uuid()
        }
    }

    return {
        event: 'result',
        file: {
            data,
        },
        isResultOfScrape,
        metadata: {
            quality,
            provider,
            source,
            cookie,
            isDDL
        },
        headers
    };
}

module.exports = exports = createEvent;
