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
function reload () {
    window.dp1.reload();
}
function empty () {
    window.dp1.empty();
}
function speed (number) {
    window.dp1.danmaku.speed(number);
}
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
        dblclick:true,
        buttons:{
            playButton:{// 播放 暂停
                icon_pause:'',  // 暂停图标
                icon_play:'',   // 播放图标
                // callback: (obj) => {  // 点击回调函数 obj为Dplayer对象
                //     console.log('========play=========');
                //     console.log(obj);
                // }
            },
            volumeButton:{  // 声音
                volumeUp:'',
                volumeDown:'',
                volumeOff:''
            },
            fullScreen:{  // 全屏
                icon:'',
                // callback: (obj) => {
                //     console.log('========fullScreen=============');
                //     console.log(obj);
                // }
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
                // callback: (obj) => {
                //     console.log('========screenshot=============');
                //     console.log(obj);
                // }
            },
            subtitle:{  // 字幕
                icon:'',
                // callback: (obj) => {
                //     console.log('========subtitle=============');
                //     console.log(obj);
                // }
            },
            webFullScreen:{  // 网页全屏
                icon:'',
                // callback:(obj) => {
                //     console.log('========webFullScreen=============');
                //     console.log(obj);
                // }
            },
            timePanel:{

            }
        },
        // http://gw.sit.qiuhui.com/jmfen-live/v2.3/room/stream/distribute?line=0&format=3&agreement=2&transcod=1&room_id=100109
        video1: {
            url:'http://static.qiuhui.com/avatar/6a8523da-c0fb-42c7-80f2-7a3cbbbe313d.mp4'
        },
        video:{
            quality:[
                // {
                //     name: '标清',
                //     type: 'flv',
                //     url: 'https://gw.sit.qiuhui.com/jmfen-live/v2.3/room/stream/distribute?format=3&agreement=2&transcod=1&room_id=100109'
                // },
                // {
                //     name: '高清',
                //     type: 'flv',
                //     url: 'https://gw.sit.qiuhui.com/jmfen-live/v2.3/room/stream/distribute?format=3&agreement=2&transcod=2&room_id=100109'
                // },
                // {
                //     name: '超清',
                //     type: 'flv',
                //     url: 'https://gw.sit.qiuhui.com/jmfen-live/v2.3/room/stream/distribute?format=3&agreement=2&transcod=3&room_id=100109'
                // }


                {
                    name: '标清',
                    type: 'hls',
                    url: 'https://gw.sit.qiuhui.com/jmfen-live/v2.3/room/stream/distribute?format=2&agreement=2&transcod=1&room_id=100109'
                },
                {
                    name: '高清',
                    type: 'hls',
                    url: 'https://gw.sit.qiuhui.com/jmfen-live/v2.3/room/stream/distribute?format=2&agreement=2&transcod=2&room_id=100109'
                },
                {
                    name: '超清',
                    type: 'hls',
                    url: 'https://gw.sit.qiuhui.com/jmfen-live/v2.3/room/stream/distribute?format=2&agreement=2&transcod=3&room_id=100109'
                }


                // {
                //     name: '标清',
                //     type: 'flv',
                //     url: 'https://gw.sit.qiuhui.com/jmfen-live/v2.3/room/stream/distribute?format=3&agreement=2&transcod=1&room_id=100144'
                // },
                // {
                //     name: '高清',
                //     type: 'flv',
                //     url: 'https://gw.sit.qiuhui.com/jmfen-live/v2.3/room/stream/distribute?format=3&agreement=2&transcod=2&room_id=100144'
                // },
                // {
                //     name: '超清',
                //     type: 'flv',
                //     url: 'https://gw.sit.qiuhui.com/jmfen-live/v2.3/room/stream/distribute?format=3&agreement=2&transcod=3&room_id=100144'
                // }


                // {
                //     name: '标清',
                //     type: 'hls',
                //     url: 'https://gw.sit.qiuhui.com/jmfen-live/v2.3/room/stream/distribute?format=2&agreement=2&transcod=1&room_id=100144'
                // },
                // {
                //     name: '高清',
                //     type: 'hls',
                //     url: 'http://gw.sit.qiuhui.com/jmfen-live/v2.3/room/stream/distribute?format=2&agreement=2&transcod=2&room_id=100144'
                // },
                // {
                //     name: '超清',
                //     type: 'hls',
                //     url: 'http://gw.sit.qiuhui.com/jmfen-live/v2.3/room/stream/distribute?format=2&agreement=2&transcod=3&room_id=100144'
                // }
            ],
            defaultQuality:0,
            defaultLine:0,
            line:[
                {
                    line_name:'主线路',
                    line_id:0
                }, {
                    line_name:'备用线路1',
                    line_id:1
                }
            ]
        },
        danmaku: {
            bottom:'20px',
            top:'20px'

        },
        // contextmenu: [],
    });
}
window.dp1.on('sendComment', (message) => { // message 为弹幕信息(颜色，文字，内容)
    console.log('============sendComment=============');
    console.log(message);
});

window.dp1.on('error', (error) => {
    console.log('=========error===========');
    console.log(error);
});
window.dp1.on('canplay', () => {
    console.log('==========canplay==============');
});
window.dp1.on('sourthError', (error) => {
    console.log('=======sourthError=======');
    console.log(error);
});
window.dp1.on('reload', (quality) => {
    console.log('===========reload=================');
    console.log(quality);
});
window.dp1.on('sendComment', (quality) => {
    console.log('===========sendComment============');
    console.log(quality);
});
window.dp1.on('ended', () => {
    console.log('===========ending============');
});
window.dp1.on('suspend', () => {
    console.log('========suspend=========');
});
window.dp1.on('loadedmetadata', () => {
    console.log('=====loadedmetadata============');
});

// return;
// dp2
//     window.dp2 = new DPlayer({
//         container: document.getElementById('dplayer2'),
//         preload: 'none',
//         autoplay: false,
//         theme: '#FADFA3',
//         loop: true,
//         screenshot: true,
//         hotkey: true,
//         logo: 'https://i.loli.net/2019/06/06/5cf8c5d94521136430.png',
//         volume: 0.2,
//         mutex: true,
//         buttons:{
//             playButton:{// 播放 暂停
//                 icon_pause:'',  // 暂停图标
//                 icon_play:'',   // 播放图标
//                 callback: (obj) => {  // 点击回调函数 obj为Dplayer对象
//                     console.log(obj);
//                 }
//             },
//             volumeButton:{  // 声音
//                 volumeUp:'',
//                 volumeDown:'',
//                 volumeOff:''
//             },
//             fullScreen:{  // 全屏
//                 icon:'',
//                 callback: (obj) => {
//                     console.log(obj);
//                 }
//             },
//             settingCustomer:{  // 自定义设置
//                 icon:''
//             },
//             setting:{    // 设置
//                 icon:''
//             },
//             comment:{  // 评论
//                 icon:'',
//                 icon_pallette:'',
//                 icon_send:''
//             },
//             screenshot:{  // 截图
//                 icon:'',
//                 callback: (obj) => {
//                     console.log(obj);
//                 }
//             },
//             subtitle:{  // 字幕
//                 icon:'',
//                 callback: (obj) => {
//                     console.log(obj);
//                 }
//             },
//             webFullScreen:{  // 网页全屏
//                 icon:'',
//                 callback:(obj) => {
//                     console.log(obj);
//                 }
//             }
//         },
//         video: {
//             url: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
//             pic: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
//             thumbnails: 'https://i.loli.net/2019/06/06/5cf8c5d9cec8510758.jpg',
//             type: 'auto'
//         },
//         danmaku: {
//             top:'20px',
//             bottom:'20px'
//         },
//         contextmenu: [
//             {
//                 text: 'custom contextmenu',
//                 link: 'https://github.com/MoePlayer/DPlayer'
//             }
//         ]
//     });

//     const events = [
//         'abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'error',
//         'loadeddata', 'loadedmetadata', 'loadstart', 'mozaudioavailable', 'pause', 'play',
//         'playing', 'ratechange', 'seeked', 'seeking', 'stalled',
//         'volumechange', 'waiting',
//         'screenshot',
//         'thumbnails_show', 'thumbnails_hide',
//         'danmaku_show', 'danmaku_hide', 'danmaku_clear',
//         'danmaku_loaded', 'danmaku_send', 'danmaku_opacity',
//         'contextmenu_show', 'contextmenu_hide',
//         'notice_show', 'notice_hide',
//         'quality_start', 'quality_end',
//         'destroy',
//         'resize',
//         'fullscreen', 'fullscreen_cancel', 'webfullscreen', 'webfullscreen_cancel',
//         'subtitle_show', 'subtitle_hide', 'subtitle_change'
//     ];
//     const eventsEle = document.getElementById('events');
//     for (let i = 0; i < events.length; i++) {
//         dp2.on(events[i], (info) => {
//             eventsEle.innerHTML += '<p>Event: ' + events[i] + '</p>';
//             eventsEle.scrollTop = eventsEle.scrollHeight;
//         });
//     }
// }

// function clearPlayers () {
//     for (let i = 0; i < 6; i++) {
//         window['dp' + (i + 1)].pause();
//         document.getElementById('dplayer' + (i + 1)).innerHTML = '';
//     }
// }

// function switchDPlayer () {
//     if (dp2.option.danmaku.id !== '5rGf5Y2X55qu6Z2p') {
//         dp2.switchVideo({
//             url: 'http://static.smartisanos.cn/common/video/t1-ui.mp4',
//             pic: 'http://static.smartisanos.cn/pr/img/video/video_03_cc87ce5bdb.jpg',
//             type: 'auto',
//         }, {
//             id: '5rGf5Y2X55qu6Z2p',
//             api: 'https://api.prprpr.me/dplayer/',
//             maximum: 3000,
//             user: 'DIYgod'
//         });
//     } else {
//         dp2.switchVideo({
//             url: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
//             pic: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
//             thumbnails: 'https://i.loli.net/2019/06/06/5cf8c5d9cec8510758.jpg',
//             type: 'auto'
//         }, {
//             id: '9E2E3368B56CDBB42',
//             api: 'https://api.prprpr.me/dplayer/',
//             maximum: 3000,
//             user: 'DIYgod'
//         });
//     }
// }