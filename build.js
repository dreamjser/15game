({
    appDir: "./",
    baseUrl: "js",
    dir: "../txgame",
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard',
    paths: {
        'zepto': 'lib/zepto',
        'sprite': 'module/sprite',
        'load':'module/load',
        'public':'module/public'
    },
    
    shim:{
        'zepto': {

            exports: 'Zepto'
        }
    },
     modules: [
        {
            name: "index"
        }
    ]
})