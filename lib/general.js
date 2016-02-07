var Request = require('request');
var Cheerio = require('cheerio');
var L       = require('./logger.js');

/**
 *
 */
module.exports.scrape9gagLink = function(link, done) {
    var options = {
        "timeout"   : 10000,
        "url" : link,
        "headers"   : {
            "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.94 Safari/537.36",
            "gzip":false
        }
    };

    return Request(options, function(err, res, body) {
        if (err) {
            return done(err);
        }

        if (!body || res.statusCode !== 200) {
            return done(new Error('Invalid response for 9gag link'));
        }
        
        var $ = Cheerio.load(body);

        var data =  $('.badge-animated-container-animated').attr('data-mp4') ||
                    $('.badge-animated-container-animated').attr('data-image') ||
                    $('.badge-item-img').attr('src');

        var newObj = {
            "title" : $('.badge-item-title').text().trim(),
            "data" : data,
            "source_type" : "9gag",
            "source" : options.url
        }

        return done(null, newObj);
    });
};
/**
 *
 */
module.exports.scrapeImgur = function(link, done) {
    var options = {
        "timeout"   : 10000,
        "url" : link,
        "headers"   : {
            "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.94 Safari/537.36",
            "gzip":false
        }
    };

    return Request(options, function(err, res, body) {
        if (err) {
            return done(err);
        }

        if (!body || res.statusCode !== 200) {
            return done(new Error('Invalid response for 9gag link'));
        }
        
        var $ = Cheerio.load(body);

        var title = $('#image-title').text() || $('.post-title').text() || '';
 
        var data =  $('a.zoom img').attr('src') ||
                    $('div#image div a img').attr('src') ||
                    $('div#image div img').attr('src') ||
                    $('div.post-image img').attr('src') ||
                    $('meta[property=og\\:image]').attr('content');

        if (data && data.indexOf('http:') !== 0) {
            data = 'http:' + data;
        }

        var newObj = {
            "title" : (title).trim(),
            "data" : data,
            "source_type" : "imgur",
            "source" : options.url
        }

        return done(null, newObj);
    });
};