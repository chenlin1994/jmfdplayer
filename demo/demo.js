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
// handleEvent();
function reload () {
    window.dp1.reload();
}
function empty () {
    window.dp1.empty();
}
function speed (number) {
    window.dp1.danmaku.speed(number);
}
// function handleEvent () {
//     document.getElementById('dplayer-dialog').addEventListener('click', (e) => {
//         const $clickDom = e.currentTarget;
//         const isShowStatus = $clickDom.getAttribute('data-show');

//         if (isShowStatus) {
//             document.getElementById('float-dplayer').style.display = 'none';
//         } else {
//             $clickDom.setAttribute('data-show', 1);
//             document.getElementById('float-dplayer').style.display = 'block';
//         }
//     });

//     document.getElementById('close-dialog').addEventListener('click', () => {
//         const $openDialogBtnDom = document.getElementById('dplayer-dialog');
//         $openDialogBtnDom.setAttribute('data-show', '');
//         document.getElementById('float-dplayer').style.display = 'none';
//     });
// }
function getUUID() {
    let d = Date.now()
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (
        c == 'x'
          ? r
          : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
  }
function initPlayers () {
    let nonce = this.getUUID()
    let timestamp = Date.now()
    // dplayer-float
    const options = {
        container: document.getElementById('dplayer1'),
        autoplay: true,
        screenshot: true,
        live: true,
        volume:0.5,
        danmaku: false,
        headers:{
            nonce : nonce,
            timestamp:timestamp,
            sign:timestamp + nonce
        },
        buttons:{
            playButton:{

            },
            volumeButton:{

            },
            // settingCustomer: {},
            // screenshot:{

            // },
            setting:{},
            fullScreen:{

            },
            timePanel:{

            },

            // webFullScreen:{},
            // qualityCustomer:{}
        },
        video: {
            quality: [
                {
                    name: '标清',
                    type: 'flv',
                    url: 'https://liveplay.qiuhui.com/live/100186.flv'
                },
                {
                    name: '高清',
                    type: 'flv',
                    url: 'https://liveplay.qiuhui.com/live/100186.flv'
                },
                {
                    name: '超清',
                    type: 'hls',
                    url: 'https://gw.sit.qiuhui.com/jmfen-live/v2.3/room/stream/distribute?format=3&agreement=2&transcod=3&room_id=203831&line=0'
                }
            ],
            defaultQuality: 0,
            defaultLine: 0,
            line:[
                {default_status:1, line_id:0, line_name:'主线路', need_login:0},
                {default_status:0, line_id:1, line_name:'备用线路1', need_login:0}
            ]
        }
    };
    const options1 = {
        container: document.getElementById('dplayer1'),
        autoplay: false,
        live: false,
        theme: '#FADFA3',
        loop: false,
        lang: 'zh-cn',
        screenshot: true,
        hotkey: true,
        // preload: 'auto',
        volume: 0.7,
        mutex: true,
        unlimited: true,
        // 暂停之后重新加载
        chasingNeedle:true,
        buttons: {
            playButton: {},
            volumeButton: {},
            settingCustomer: {},
            screenshot: {},
            fullScreen: {},
            setting:{}
        },
        video: {
            quality: [
                {
                    name: '标清',
                    type: 'flv',
                    url: 'http://scoreplay.qiugood.com/live/stream681322.flv?txSecret=279d5ba428e0f3edfbc6ea91cfe3e7b7&txTime=5e605190'
                },
                {
                    name: '高清',
                    type: 'flv',
                    url: 'http://scoreplay.qiugood.com/live/stream681322.flv?txSecret=279d5ba428e0f3edfbc6ea91cfe3e7b7&txTime=5e605190'
                },
                {
                    name: '超清',
                    type: 'flv',
                    url: 'http://scoreplay.qiugood.com/live/stream681322.flv?txSecret=279d5ba428e0f3edfbc6ea91cfe3e7b7&txTime=5e605190'
                }
            ],
            defaultQuality: 0,
            // defaultLine: 0,
            // hoverCssClass: '',
            // line: []
        },
        isLogin:{
            status:false,
            callback:() => {this.G_SetLogin(true); }
        },
        danmaku: false
        // screenshot: true,
        // live: true,
        // theme: '#FADFA3',
        // loop: false,
        // lang: 'zh-cn',
        // hotkey: true,
        // preload: 'auto',
        // volume: 0.7,
        // mutex: true,
        // unlimited:true,
        // dblclick:true,
        // autoplay:true,
        // buttons:{
        //     playButton:{// 播放 暂停
        //         icon_pause:'',  // 暂停图标
        //         icon_play:'',   // 播放图标
        //         // callback: (obj) => {  // 点击回调函数 obj为Dplayer对象
        //         //     console.log('========play=========');
        //         //     console.log(obj);
        //         // }
        //     },
        //     volumeButton:{  // 声音
        //         volumeUp:'',
        //         volumeDown:'',
        //         volumeOff:''
        //     },
        //     fullScreen:{  // 全屏
        //         icon:'',
        //         // callback: (obj) => {
        //         //     console.log('========fullScreen=============');
        //         //     console.log(obj);
        //         // }
        //     },
        //     // settingCustomer:{  // 自定义设置
        //     //     icon:''
        //     // },
        //     // setting:{

        //     // },
        //     // comment:{  // 评论
        //     //     icon:'',
        //     //     icon_pallette:'',
        //     //     icon_send:''
        //     // },
        //     // screenshot:{  // 截图
        //     //     icon:'',
        //     //     callback: (obj) => {
        //     //         console.log('========screenshot=============');
        //     //         console.log(obj);
        //     //     }
        //     // },
        //     subtitle:{  // 字幕
        //         icon:'',
        //         // callback: (obj) => {
        //         //     console.log('========subtitle=============');
        //         //     console.log(obj);
        //         // }
        //     },
        //     webFullScreen:{  // 网页全屏
        //         icon:'',
        //         callback:(obj) => {
        //             console.log('========webFullScreen=============');
        //             console.log(obj);
        //         }
        //     },
        //     timePanel:{

        //     }
        // },
        // video:{
        //     quality:[
        //         // {
        //         //     name: '标清',
        //         //     type: 'flv',
        //         //     url: 'https://gw.sit.qiuhui.com/jmfen-live/v2.3/room/stream/distribute?format=3&agreement=3&transcod=1&room_id=100109'
        //         // },
        //         // {
        //         //     name: '高清',
        //         //     type: 'flv',
        //         //     url: 'https://gw.sit.qiuhui.com/jmfen-live/v2.3/room/stream/distribute?format=3&agreement=3&transcod=2&room_id=100109'
        //         // },
        //         // {
        //         //     name: '超清',
        //         //     type: 'flv',
        //         //     url: 'https://gw.sit.qiuhui.com/jmfen-live/v2.3/room/stream/distribute?format=3&agreement=3&transcod=3&room_id=100109'
        //         // }


        //         // {
        //         //     name: '标清',
        //         //     type: 'hls',
        //         //     url: 'https://gw.sit.qiuhui.com/jmfen-live/v2.3/room/stream/distribute?format=2&agreement=3&transcod=1&room_id=100109'
        //         // },
        //         // {
        //         //     name: '高清',
        //         //     type: 'hls',
        //         //     url: 'https://gw.sit.qiuhui.com/jmfen-live/v2.3/room/stream/distribute?format=2&agreement=3&transcod=2&room_id=100109'
        //         // },
        //         // {
        //         //     name: '超清',
        //         //     type: 'hls',
        //         //     url: 'https://gw.sit.qiuhui.com/jmfen-live/v2.3/room/stream/distribute?format=2&agreement=3&transcod=3&room_id=100109'
        //         // }


        //         {
        //             name: '标清',
        //             type: 'flv',
        //             url: 'http://scoreplay.qiugood.com/live/stream681322.flv?txSecret=d82d4cef652b6b40a3451efd878ba6e1&txTime=5e604eb0'
        //         },
        //         {
        //             name: '高清',
        //             type: 'flv',
        //             url: 'http://scoreplay.qiugood.com/live/stream681322.flv?txSecret=d82d4cef652b6b40a3451efd878ba6e1&txTime=5e604eb0'
        //         },
        //         {
        //             name: '超清',
        //             type: 'flv',
        //             url: 'https://gw.qiuhui.com/jmfen-live/v2.3/room/stream/distribute?format=3&agreement=3&transcod=3&room_id=100012'
        //         }

        //         // {
        //         //     name: '高清',
        //         //     type: 'hls',
        //         //     url: 'https://tcplay.qiuhui.com/live/100012_ld.m3u8'
        //         // },
        //         // {
        //         //     name: '高清',
        //         //     type: 'hls',
        //         //     url: 'https://tcplay.qiuhui.com/live/100012_hd.m3u8'
        //         // },
        //         // {
        //         //     name: '超清',
        //         //     type: 'hls',
        //         //     url: 'https://tcplay.qiuhui.com/live/100012_ld.m3u8'
        //         // }


        //         // {
        //         //     name:'标清',
        //         //     type:'hls',
        //         //     url:'http://txplay.qiuhui.com/live/100144_hd.m3u8'
        //         // }
        //     ],
        //     defaultQuality:0,
        //     defaultLine:0,
        //     line:[
        //         {
        //             line_name:'主线路',
        //             line_id:0
        //         }, {
        //             line_name:'备用线路2',
        //             line_id:2
        //         }, {
        //             line_name:'备用线路1',
        //             line_id:1
        //         }
        //     ]
        // },
        // danmaku: {
        //     bottom:'20px',
        //     top:'20px'

        // },
        // contextmenu:[
        //     {
        //         text:'haha',
        //         click:() => {
        //             console.log(this);
        //         }
        //     },
        //     {
        //         text:'haha',
        //         link:'http://www.baidu.com'
        //     },
        //     {
        //         text:'haha',
        //         link:'http://www.baidu.com'
        //     },
        //     {
        //         text:'haha',
        //         link:'http://www.baidu.com'
        //     }, {
        //         text:'haha',
        //         link:'http://www.baidu.com'
        //     }, {
        //         text:'haha',
        //         link:'http://www.baidu.com'
        //     }, {
        //         text:'haha',
        //         link:'http://www.baidu.com'
        //     }, {
        //         text:'haha',
        //         link:'http://www.baidu.com'
        //     }, {
        //         text:'haha',
        //         link:'http://www.baidu.com'
        //     }, {
        //         text:'haha',
        //         link:'http://www.baidu.com'
        //     }
        // ]

    };
    // dp1
    window.dp1 = new DPlayer(options);
}
// window.dp1.on('sendComment', (message) => { // message 为弹幕信息(颜色，文字，内容)
//     console.log('============sendComment=============');
//     console.log(message);
// });

window.dp1.on('error', (error) => {
    console.log('=========error===========');
    console.log(error);
    window.dp1.reload();
});
window.dp1.on('canplay', () => {
    console.log('==========canplay==============');
});
window.dp1.on('loadedmetadata', function () {
    // const height = window.dp1.video.videoHeight;
    // const width = window.dp1.video.videoWidth;
    // window.dp1.video.style.width = width + 'px';
    // window.dp1.video.style.height = height + 'px';
    // window.dp1.video.style.margin = '0 auto';
    // console.log('==================');
    // console.log(height, width);
});
// window.dp1.on('sourthError', (error) => {
//     console.log('=======sourthError=======');
//     console.log(error);
// });
// window.dp1.on('reload', (quality) => {
//     console.log('===========reload=================');
//     console.log(quality);
// });
// window.dp1.on('sendComment', (quality) => {
//     console.log('===========sendComment============');
//     console.log(quality);
// });
// window.dp1.on('ended', () => {
//     console.log('===========ending============');
// });
// window.dp1.on('suspend', () => {
//     console.log('========suspend=========');
// });
// window.dp1.on('loadedmetadata', () => {
//     console.log('=====loadedmetadata============');
// });
// window.dp1.on('suspend', () => {
//     console.log('============suspend============');
// });

function closeVideo () {
    window.dp1.destroy();
}

function suspension () {
    window.dp1.setSuspension(true);
}