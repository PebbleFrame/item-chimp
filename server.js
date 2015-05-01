var express = require('express');
var browserify = require('browserify-middleware');
var reactify = require('reactify');
var nunjucks = require('nunjucks');
var config = require('./client/config');

var app = express();

nunjucks.configure('server/templates/views', {
  express: app
});

app.use(express.static('public'));

app.get('/js/' + config.common.bundle, browserify(config.common.packages, {
  cache: true,
  precompile: true
}));

app.use('/js', browserify('./client/scripts', {
  external: config.common.packages,
  transform: ['reactify']
}));

app.get('*', function(req, res) {
  res.render('index.html');
});

var OperationHelper = require('apac').OperationHelper;

var opHelper = new OperationHelper({
  awsId:     'AKIAIQ27TFDH7YXONTJQ',
  awsSecret: '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',
  assocId:   'bap071-20',
  version:   '2013-08-01'});

opHelper.execute('ItemSearch', {
  'SearchIndex': 'Books',
  'Keywords': 'harry potter',
  'ResponseGroup': 'ItemAttributes,Offers'
}, function(err, results) { // you can add a third parameter for the raw xml response, "results" here are currently parsed using xml2js
  console.log(results.ItemSearchResponse.Item[0]);
});

app.post('/general-query', function(req, res) {
  res.send([
/*    {walmart:
      ["items":[
      {
        "itemId":30135922,
        "parentItemId":30135922,
        "name":"Apple iPod touch 32GB",
        "msrp":249,
        "salePrice":229,
        "upc":"885909827367",
        "categoryPath":"Electronics/iPods & MP3 Players/Apple iPods",
        "shortDescription":"iPod touch is more fun than ever. It has an ultrathin design, a 4-inch Retina display, a 5MP iSight camera, iOS 7, Siri, iMessage, FaceTime, iTunes and the App Store, iTunes Radio, and more.",
        "longDescription":"<br><b>Key Features:</b> <ul><li>Ultrathin design available in five gorgeous colors</li><li>4-inch Retina display</li><li>Apple A5 chip</li><li>5-megapixel iSight camera with 1080p HD video recording</li><li>FaceTime HD camera with 1.2-megapixel photos and 720p HD video recording</li><li>iOS 7 with features like Control Center, AirDrop, smarter multitasking, and iTunes Radio</li><li>Siri intelligent assistant</li><li>iTunes Store with millions of songs, and thousands of movies and TV shows</li><li>App Store with more than 1,000,000 apps, including over 100,000 games<sup>1</sup></li><li>Game Center with millions of gamers</li><li>Free text messaging over Wi-Fi with iMessage</li><li>Rich HTML email and Safari web browser</li><li>AirPlay and AirPlay Mirroring</li><li>40 hours of music playback, 8 hours of video playback<sup>2</sup></li><li>iPod touch loop (sold separately for 16GB model)</li><li>Apple EarPods</li><li>16GB, 32GB, and 64GB capacities<sup>3</sup></li></ul><br> iPod models are not available in all colors at all resellers. iPod touch loop is included with 32GB and 64GB models only. Wi-Fi Internet access is required for some features; broadband recommended; fees may apply. Some features, applications, and services are not available in all areas. Application availability and pricing are subject to change. <br><br> <sup>1</sup>App count refers to the total number of apps worldwide. Not all content is available in all countries. <br> <sup>2</sup>Rechargeable batteries have a limited number of charge cycles and may eventually need to be replaced. Battery life and number of charge cycles vary by use and settings. See www.apple.com/batteries for more information. <br> <sup>3</sup> 1GB = 1 billion bytes; actual formatted capacity less. Accessories and Related Products <ul class="noindent"><li>Apple EarPods with Remote and Mic</li><li>Apple Lightning to USB Cable</li><li>Apple Lightning to 30-pin Adapter</li><li>Apple Lightning to 30-pin Adapter (0.2 m)</li><li>AppleCare+ for iPod touch/iPod classic ?</li></ul>",
        "thumbnailImage":"http://i.walmartimages.com/i/p/00/88/59/09/82/0088590982736_Color_Space-Gray_SW_100X100.jpg",
        "productTrackingUrl":"http://linksynergy.walmart.com/fs-bin/click?id=|LSNID|&offerid=223073.7200&type=14&catid=8&subid=0&hid=7200&tmpid=1082&RD_PARM1=http%253A%252F%252Fwww.walmart.com%252Fip%252FiPod-touch-32GB-Assorted-Colors%252F30135922%253Faffp1%253DQZgRg5FCruS1ZONZjdE96G2csJdrFkjK5r5qPrTCDm8%2526affilsrc%253Dapi",
        "standardShipRate":0,
        "marketplace":false,
        "modelNumber":"ME978LL/A",
        "productUrl":"http://c.affil.walmart.com/t/api02?l=http%3A%2F%2Fwww.walmart.com%2Fip%2FiPod-touch-32GB-Assorted-Colors%2F30135922%3Faffp1%3DQZgRg5FCruS1ZONZjdE96G2csJdrFkjK5r5qPrTCDm8%26affilsrc%3Dapi%26veh%3Daff%26wmlspartner%3Dreadonlyapi",
        "customerRating":"4.653",
        "numReviews":450,
        "customerRatingImage":"http://i2.walmartimages.com/i/CustRating/4_7.gif",
        "categoryNode":"3944_96469_1057284",
        "bundle":false,
        "addToCartUrl":"http://c.affil.walmart.com/t/api02?l=http%3A%2F%2Fwww.walmart.com%2Fcatalog%2Fselect_product.gsp%3Fproduct_id%3D30135922%26add_to_cart%3D1%26qty%3D1%26affp1%3DQZgRg5FCruS1ZONZjdE96G2csJdrFkjK5r5qPrTCDm8%26affilsrc%3Dapi%26veh%3Daff%26wmlspartner%3Dreadonlyapi",
        "affiliateAddToCartUrl":"http://linksynergy.walmart.com/fs-bin/click?id=|LSNID|&offerid=223073.7200&type=14&catid=8&subid=0&hid=7200&tmpid=1082&RD_PARM1=http%253A%252F%252Fwww.walmart.com%252Fcatalog%252Fselect_product.gsp%253Fproduct_id%253D30135922%2526add_to_cart%253D1%2526qty%253D1%2526affp1%253DQZgRg5FCruS1ZONZjdE96G2csJdrFkjK5r5qPrTCDm8%2526affilsrc%253Dapi",
        "availableOnline":true
      },
      {
        "itemId":21805444,
        "parentItemId":21805444,
        "name":"Apple iPod nano 16GB",
        "msrp":145,
        "salePrice":145,
        "upc":"885909564910",
        "categoryPath":"Electronics/iPods & MP3 Players/All MP3 Players",
        "shortDescription":"The redesigned, ultraportable iPod nano has a larger, 2.5-inch Multi-Touch display; plays music, FM radio and videos; includes built-in Bluetooth technology; and features a pedometer and Nike+ support for fitness.",
        "longDescription":"The redesigned, ultraportable iPod nano now has a larger 2.5-inch Multi- Touch display. Play your favourite songs, browse music by genre, or listen to Genius playlists and FM radio. Or watch movies and widescreen videos on the bigger screen. A perfect workout partner, iPod nano tracks your steps, your runs and burned calories and syncs to the Nike+ website to challenge friends. And with built-in Bluetooth technology, you can wirelessly connect to speakers, headphones or car stereos.Key Features<p></p><ul class="noindent"><li>2.5-inch Multi-Touch colour display with 240-by-432-pixel resolution</li><li>Only 5.4 millimetres thin — the thinnest iPod ever</li><li>Easy-to-use controls to quickly adjust volume, or play, pause and change songs</li><li>Bluetooth 4.0</li><li>Widescreen video</li><li>FM radio with Live Pause</li><li>Built-in pedometer for fitness</li><li>Built-in Nike+ support for voice feedback and syncing to nikeplus.com</li><li>Anodised aluminium in seven gorgeous colors</li><li>16GB capacity</li><li>Up to 30 hours of music playback</li><li>Apple EarPods</li><li>Works with Mac and PC</li></ul>",
        "thumbnailImage":"http://i.walmartimages.com/i/p/00/88/59/09/56/0088590956491_Color_Blue_SW_100X100.jpg",
        "productTrackingUrl":"http://linksynergy.walmart.com/fs-bin/click?id=|LSNID|&offerid=223073.7200&type=14&catid=8&subid=0&hid=7200&tmpid=1082&RD_PARM1=http%253A%252F%252Fwww.walmart.com%252Fip%252FiPod-nano-16GB%252F21805444%253Faffp1%253DQZgRg5FCruS1ZONZjdE96G2csJdrFkjK5r5qPrTCDm8%2526affilsrc%253Dapi",
        "standardShipRate":0,
        "marketplace":false,
        "modelNumber":"MD477LL/A",
        "productUrl":"http://c.affil.walmart.com/t/api02?l=http%3A%2F%2Fwww.walmart.com%2Fip%2FiPod-nano-16GB%2F21805444%3Faffp1%3DQZgRg5FCruS1ZONZjdE96G2csJdrFkjK5r5qPrTCDm8%26affilsrc%3Dapi%26veh%3Daff%26wmlspartner%3Dreadonlyapi",
        "customerRating":"4.439",
        "numReviews":683,
        "customerRatingImage":"http://i2.walmartimages.com/i/CustRating/4_4.gif",
        "categoryNode":"3944_96469_164001",
        "bundle":false,
        "addToCartUrl":"http://c.affil.walmart.com/t/api02?l=http%3A%2F%2Fwww.walmart.com%2Fcatalog%2Fselect_product.gsp%3Fproduct_id%3D21805444%26add_to_cart%3D1%26qty%3D1%26affp1%3DQZgRg5FCruS1ZONZjdE96G2csJdrFkjK5r5qPrTCDm8%26affilsrc%3Dapi%26veh%3Daff%26wmlspartner%3Dreadonlyapi",
        "affiliateAddToCartUrl":"http://linksynergy.walmart.com/fs-bin/click?id=|LSNID|&offerid=223073.7200&type=14&catid=8&subid=0&hid=7200&tmpid=1082&RD_PARM1=http%253A%252F%252Fwww.walmart.com%252Fcatalog%252Fselect_product.gsp%253Fproduct_id%253D21805444%2526add_to_cart%253D1%2526qty%253D1%2526affp1%253DQZgRg5FCruS1ZONZjdE96G2csJdrFkjK5r5qPrTCDm8%2526affilsrc%253Dapi",
        "availableOnline":true
      }
    ]
  },
    {amazon:
      [
        {"Items": {
          "Request": {
          "IsValid": "True",
          "ItemLookupRequest": { "ItemId": "B00008OE6I" }
        },
        "Item": {
          "ASIN": "B00008OE6I",
          "ItemAttributes": {
            "Manufacturer": "Canon",
            "ProductGroup": "Photography",
            "Title": "Canon PowerShot S400 4MP Digital Camera w/ 3x Optical Zoom"
          }
        }
      }
    }]
    },
    {bestbuy:
      [
        {
          "from": 1,
          "to": 10,
          "total": 50,
          "currentPage": 1,
          "totalPages": 5,
          "queryTime": "0.064",
          "totalTime": "0.163",
          "partial": false,
          "canonicalUrl": "/v1/products((search=\"iPad*\"&search=\"apple*\")&salePrice<500&categoryPath.id=pcmcat209000050006)?show=name,sku,salePrice&format=json&apiKey=8mgm6znngxhnt8fexd3xcug2",
          "products": [
            {
              "name": "Apple iPad mini Wi-Fi 16GB (Space Gray), Screen Protector, Keyboard, Stylus, Audio Cable & Headphones Package",
              "sku": 9999240600050019,
              "salePrice": 334.99
            },
            {
              "name": "Apple® - iPad Air 2 Wi-Fi + Cellular 16GB - Silver",
              "sku": 3781019,
              "salePrice": 499.99
            },
            {
              "name": "Apple® - iPad Air 2 Wi-Fi 16GB - Gold",
              "sku": 2881031,
              "salePrice": 499.99
            },
            {
              "name": "Apple® - iPad Air 2 Wi-Fi 16GB - Space Gray",
              "sku": 3312008,
              "salePrice": 499.99
            },
            {
              "name": "Apple® - iPad Air 2 Wi-Fi16GB - Silver",
              "sku": 2881022,
              "salePrice": 499.99
            },
            {
              "name": "Apple® - iPad mini 3 Wi-Fi 16GB - Gold",
              "sku": 3325038,
              "salePrice": 399.99
            },
            {
              "name": "Apple® - iPad mini 3 Wi-Fi 16GB - Silver",
              "sku": 3322004,
              "salePrice": 399.99
            },
            {
              "name": "Apple® - iPad mini 3 Wi-Fi 16GB - Space Gray",
              "sku": 3325001,
              "salePrice": 399.99
            },
            {
              "name": "Apple® - iPad mini 3 Wi-Fi 64GB - Gold",
              "sku": 3325511,
              "salePrice": 499.99
            },
            {
              "name": "Apple® - iPad mini 3 Wi-Fi 64GB - Silver",
              "sku": 3325056,
              "salePrice": 499.99
            }
          ]
        }
    ]
    }
*/  ]);
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Server listening on port ' + port);
});