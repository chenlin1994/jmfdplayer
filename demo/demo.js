// stats.js: JavaScript Performance Monitor
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);
function animate () {
    stats.begin();
    // monitored code goes here
    stats.end();

    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

initPlayers();
handleEvent();

function handleEvent () {
    document.getElementById('dplayer-dialog').addEventListener('click', (e) => {
        const $clickDom = e.currentTarget;
        const isShowStatus = $clickDom.getAttribute('data-show');

        if (isShowStatus) {
            document.getElementById('float-dplayer').style.display = 'none';
        } else {
            $clickDom.setAttribute('data-show', 1);
            document.getElementById('float-dplayer').style.display = 'block';
        }
    });

    document.getElementById('close-dialog').addEventListener('click', () => {
        const $openDialogBtnDom = document.getElementById('dplayer-dialog');
        $openDialogBtnDom.setAttribute('data-show', '');
        document.getElementById('float-dplayer').style.display = 'none';
    });
}

function initPlayers () {
    // dplayer-float
    window.dpFloat = new DPlayer({
        container: document.getElementById('dplayer-container'),
        preload: 'none',
        screenshot: true,
        video: {
            url: 'http://static.smartisanos.cn/common/video/t1-ui.mp4',
            pic: 'http://static.smartisanos.cn/pr/img/video/video_03_cc87ce5bdb.jpg',
            thumbnails: 'http://static.smartisanos.cn/pr/img/video/video_03_cc87ce5bdb.jpg'
        },
        subtitle: {
            url: 'subtitle test'
        },
        danmaku: {
            id: '9E2E3368B56CDBB4',
            api: 'https://api.prprpr.me/dplayer/'
        }
    });
    // dp1
    window.dp1 = new DPlayer({
        container: document.getElementById('dplayer1'),
        autoplay: true,
        live: true,
        theme: '#FADFA3',
        loop: false,
        lang: 'zh-cn',
        screenshot: true,
        hotkey: true,
        preload: 'auto',
        volume: 0.7,
        mutex: true,
        unlimited:true,
        buttons:{
            playButton:{// 播放 暂停
                icon_pause:'',  // 暂停图标
                icon_play:'',   // 播放图标
                callback: (obj) => {  // 点击回调函数 obj为Dplayer对象
                    console.log(obj);
                }
            },
            volumeButton:{  // 声音
                volumeUp:'',
                volumeDown:'',
                volumeOff:''
            },
            fullScreen:{  // 全屏
                icon:'',
                callback: (obj) => {
                    console.log(obj);
                }
            },
            settingCustomer:{  // 自定义设置
                icon:''
            },
            setting:{    // 设置
                icon:''
            },
            comment:{  // 评论
                icon:'',
                icon_pallette:'',
                icon_send:''
            },
            screenshot:{  // 截图
                icon:'',
                callback: (obj) => {
                    console.log(obj);
                }
            },
            subtitle:{  // 字幕
                icon:'',
                callback: (obj) => {
                    console.log(obj);
                }
            },
            webFullScreen:{  // 网页全屏
                icon:'',
                callback:(obj) => {
                    console.log(obj);
                }
            }
        },
        video: {
            quality:[
                {name:'超清', url:'http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8', number:0, type:'auto'},
                {name:'高清', url:'http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8', number:1, type:'auto'},
                {name:'标清', url:'http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8', number:2, type:'auto'}
            ],
            defaultQuality:0
        },
        danmaku: {
            bottom:'20px',
            top:'20px'
        },
        apiBackend: {
            read: function (endpoint) {
                // 设置加载完成
                endpoint.success();
                // callback()
            },
            send: function () {
                // 如果需要手动发送旦暮，在这里
                // callback()
            }
        },
        contextmenu: [],
    });
    let a = 1;
    setInterval(() => {
        window.dp1.danmaku.draw({
            text:a++,
            color:'red',
            type:'right'
        });
    }, 0);

    window.dp1.on('sendComment', (message) => { // message 为弹幕信息(颜色，文字，内容)
        console.log(message);
    });

    window.dp1.on('error', (obj) => {
        console.log(obj);
    });
    // dp2
    window.dp2 = new DPlayer({
        container: document.getElementById('dplayer2'),
        preload: 'none',
        autoplay: false,
        theme: '#FADFA3',
        loop: true,
        screenshot: true,
        hotkey: true,
        logo: 'https://i.loli.net/2019/06/06/5cf8c5d94521136430.png',
        volume: 0.2,
        mutex: true,
        buttons:{
            playButton:{// 播放 暂停
                icon_pause:'',  // 暂停图标
                icon_play:'',   // 播放图标
                callback: (obj) => {  // 点击回调函数 obj为Dplayer对象
                    console.log(obj);
                }
            },
            volumeButton:{  // 声音
                volumeUp:'',
                volumeDown:'',
                volumeOff:''
            },
            fullScreen:{  // 全屏
                icon:'',
                callback: (obj) => {
                    console.log(obj);
                }
            },
            settingCustomer:{  // 自定义设置
                icon:''
            },
            setting:{    // 设置
                icon:''
            },
            comment:{  // 评论
                icon:'',
                icon_pallette:'',
                icon_send:''
            },
            screenshot:{  // 截图
                icon:'',
                callback: (obj) => {
                    console.log(obj);
                }
            },
            subtitle:{  // 字幕
                icon:'',
                callback: (obj) => {
                    console.log(obj);
                }
            },
            webFullScreen:{  // 网页全屏
                icon:'',
                callback:(obj) => {
                    console.log(obj);
                }
            }
        },
        video: {
            url: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
            pic: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
            thumbnails: 'https://i.loli.net/2019/06/06/5cf8c5d9cec8510758.jpg',
            type: 'auto'
        },
        subtitle: {
            url: 'https://moeplayer.b0.upaiyun.com/dplayer/hikarunara.vtt',
            type: 'webvtt',
            fontSize: '25px',
            bottom: '10%',
            color: '#b7daff'
        },
        danmaku: {
            id: '9E2E3368B56CDBB4',
            api: 'https://api.prprpr.me/dplayer/',
            token: 'tokendemo',
            maximum: 3000,
            user: 'DIYgod',
            bottom: '15%',
            unlimited: true
        },
        contextmenu: [
            {
                text: 'custom contextmenu',
                link: 'https://github.com/MoePlayer/DPlayer'
            }
        ]
    });

    const events = [
        'abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'error',
        'loadeddata', 'loadedmetadata', 'loadstart', 'mozaudioavailable', 'pause', 'play',
        'playing', 'ratechange', 'seeked', 'seeking', 'stalled',
        'volumechange', 'waiting',
        'screenshot',
        'thumbnails_show', 'thumbnails_hide',
        'danmaku_show', 'danmaku_hide', 'danmaku_clear',
        'danmaku_loaded', 'danmaku_send', 'danmaku_opacity',
        'contextmenu_show', 'contextmenu_hide',
        'notice_show', 'notice_hide',
        'quality_start', 'quality_end',
        'destroy',
        'resize',
        'fullscreen', 'fullscreen_cancel', 'webfullscreen', 'webfullscreen_cancel',
        'subtitle_show', 'subtitle_hide', 'subtitle_change'
    ];
    const eventsEle = document.getElementById('events');
    for (let i = 0; i < events.length; i++) {
        dp2.on(events[i], (info) => {
            eventsEle.innerHTML += '<p>Event: ' + events[i] + '</p>';
            eventsEle.scrollTop = eventsEle.scrollHeight;
        });
    }
}

function clearPlayers () {
    for (let i = 0; i < 6; i++) {
        window['dp' + (i + 1)].pause();
        document.getElementById('dplayer' + (i + 1)).innerHTML = '';
    }
}

function switchDPlayer () {
    if (dp2.option.danmaku.id !== '5rGf5Y2X55qu6Z2p') {
        dp2.switchVideo({
            url: 'http://static.smartisanos.cn/common/video/t1-ui.mp4',
            pic: 'http://static.smartisanos.cn/pr/img/video/video_03_cc87ce5bdb.jpg',
            type: 'auto',
        }, {
            id: '5rGf5Y2X55qu6Z2p',
            api: 'https://api.prprpr.me/dplayer/',
            maximum: 3000,
            user: 'DIYgod'
        });
    } else {
        dp2.switchVideo({
            url: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
            pic: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
            thumbnails: 'https://i.loli.net/2019/06/06/5cf8c5d9cec8510758.jpg',
            type: 'auto'
        }, {
            id: '9E2E3368B56CDBB42',
            api: 'https://api.prprpr.me/dplayer/',
            maximum: 3000,
            user: 'DIYgod'
        });
    }
}