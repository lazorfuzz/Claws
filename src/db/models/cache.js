let mongoose = require('mongoose')
let cacheSchema = new mongoose.Schema({
    uri: String,
    type: String,
    event: String,
    searchData: {
        title: String,
        season: String,
        episode: String,
        year: String,
    },
    eventData: {
        provider: String,
        resolver: String,
        target: String,
        isResultOfScrape: Boolean,
        cookieRequired: String,        
        file: {
            data: String
        },
        metadata: {
            provider: String,
            source: String,
            isStreamable: Boolean,
            headers: String,
            source: String,
            quality: String
        }
    }
})

module.exports = mongoose.model('Cache', cacheSchema);