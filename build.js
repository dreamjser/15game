({
    appDir: "./",
    baseUrl: "js",
    dir: "../15game_min",
    fileExclusionRegExp: /r.js|build.js|\w.less/,
    optimizeCss: 'standard',
    paths: {
        "zepto": 'lib/zepto',
        'io': 'lib/socket.io',
        'wx':'lib/jweixin-1.0.0',
        'qrcode': 'lib/qrcode.min',
        "public": 'module/public',
        'load': 'module/load',
        'sprite': 'module/sprite',
        'share': 'module/share',
        'api':'module/api'
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