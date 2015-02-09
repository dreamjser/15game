({
    appDir: "./",
    baseUrl: "js",
    dir: "../15game_min",
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard',
    paths: {
        "zepto": 'lib/zepto',
        'io': 'lib/socket.io-1.3.2',
        'qrcode': 'lib/qrcode.min',
        "public": 'module/public',
        'load': 'module/load',
        'sprite': 'module/sprite'
    },
    shim: {

        'zepto': {

            exports: 'Zepto'
        },
        'io': {
            exports: 'io'
        },
        'qrcode': {

            exports: 'QRCode'
        }
    },
    modules: [{
        name: "index",
    },{
        name:"game1",
    },{
        name:"game2",
    },{
        name:"game3"
    }]
})