import Promise from 'promise-polyfill';
import utils from './utils';
import handleOption from './options';
import i18n from './i18n';
import Template from './template';
import Icons from './icons';
import Danmaku from './danmaku';
import Events from './events';
import FullScreen from './fullscreen';
import User from './user';
import Subtitle from './subtitle';
import Bar from './bar';
import Timer from './timer';
import Bezel from './bezel';
import Controller from './controller';
import Setting from './setting';
import SettingCustomer from './settingCustomer';
import QualityCustomer from './qualityCustomer';
import Comment from './comment';
import HotKey from './hotkey';
import ContextMenu from './contextmenu';
import InfoPanel from './info-panel';
import tplVideo from '../template/video.art';
import md5 from 'crypto-js/md5'
let index = 0;
const instances = [];
class DPlayer {

    /**
     * DPlayer constructor function
     *
     * @param {Object} options - See README
     * @constructor
     */
    constructor (options) {
        this.options = handleOption(options);
        this.suspension = false;
        if (this.options.video.quality) {
            this.qualityIndex = this.options.video.defaultQuality || 0;
            this.quality = this.options.video.quality[this.qualityIndex];
        }
        if (this.options.video.line) {
            // this.lineIndex = this.options.video.defaultLine || 0;
            // this.line = this.options.video.line[this.lineIndex];

            this.line_id = this.options.video.defaultLine;
            this.quality.url =  this.quality.url.split('&line')[0] + '&line=' + this.line_id;
        }
        this.tran = new i18n(this.options.lang).tran;
        this.events = new Events();
        this.user = new User(this);
        this.container = this.options.container;
        this.container.classList.add('dplayer');
        this.playerObj = null;
        if (!this.options.danmaku) {
            this.container.classList.add('dplayer-no-danmaku');
        }
        if (this.options.live) {
            this.container.classList.add('dplayer-live');
        }
        if (utils.isMobile) {
            this.container.classList.add('dplayer-mobile');
        }
        this.arrow = this.container.offsetWidth <= 500;
        if (this.arrow) {
            this.container.classList.add('dplayer-arrow');
        }

        this.template = new Template({
            container: this.container,
            options: this.options,
            index: index,
            tran: this.tran,
            isAndroid:utils.isAndroid,
            isMobile:utils.isMobile
        });

        this.video = this.template.video;

        this.bar = new Bar(this.template);

        this.bezel = new Bezel(this.template.bezel);

        this.fullScreen = new FullScreen(this);

        this.controller = new Controller(this);
        if (this.options.danmaku) {
            this.danmaku = new Danmaku({
                container: this.template.danmaku,
                opacity: this.user.get('opacity'),
                live:this.options.live,
                callback: () => {
                    setTimeout(() => {
                        this.template.danmakuLoading.style.display = 'none';
                        // autoplay
                        if (this.options.autoplay) {
                            this.play();
                        }
                    }, 0);
                },
                error: (msg) => {
                    this.notice(msg);
                },
                apiBackend: this.options.apiBackend,
                borderColor: this.options.theme,
                height: this.arrow ? 24 : 30,
                time: () => this.video.currentTime,
                unlimited: this.user.get('unlimited'),
                api: {
                    id: this.options.danmaku.id,
                    address: this.options.danmaku.api,
                    token: this.options.danmaku.token,
                    maximum: this.options.danmaku.maximum,
                    addition: this.options.danmaku.addition,
                    user: this.options.danmaku.user,
                },
                events: this.events,
                tran: (msg) => this.tran(msg),
            });

            this.options.buttons.comment && (this.comment = new Comment(this));
        }

        this.options.buttons.setting && (this.setting = new Setting(this));
        this.options.buttons.settingCustomer && (this.settingCustomer = new SettingCustomer(this));
        this.options.buttons.qualityCustomer && (this.qualityCustomer = new QualityCustomer(this));
        document.addEventListener('click', () => {
            this.focus = false;
        }, true);
        this.container.addEventListener('click', () => {
            this.focus = true;
        }, true);

        this.paused = true;

        this.timer = new Timer(this);

        this.hotkey = new HotKey(this);

        this.options.contextmenu && (this.contextmenu = new ContextMenu(this));
        this.initVideo(this.video, this.quality && this.quality.type || this.options.video.type);

        this.infoPanel = new InfoPanel(this);

        if (!this.danmaku && this.options.autoplay) {
            this.play();
        }

        index++;
        instances.push(this);
    }

    /**
    * Seek video
    */
    seek (time) {
        time = Math.max(time, 0);
        if (this.video.duration) {
            time = Math.min(time, this.video.duration);
        }
        if (this.video.currentTime < time) {
            this.notice(`${this.tran('FF')} ${(time - this.video.currentTime).toFixed(0)} ${this.tran('s')}`);
        }
        else if (this.video.currentTime > time) {
            this.notice(`${this.tran('REW')} ${(this.video.currentTime - time).toFixed(0)} ${this.tran('s')}`);
        }

        this.video.currentTime = time;

        if (this.danmaku) {
            this.danmaku.seek();
        }

        this.bar.set('played', time / this.video.duration, 'width');
        this.template.ptime.innerHTML = utils.secondToTime(time);
    }
    getUUID() {
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
    /**
     * Play video
     */
    play (chasingFrame, noLoading) {
        this.paused = false;
        if (this.video.paused) {
            this.bezel.switch(this.options.buttons.playButton && this.options.buttons.playButton.icon_play || Icons.play);
        }

        this.template.playButton.innerHTML = this.options.buttons.playButton && this.options.buttons.playButton.icon_pause || Icons.pause;
        this.template.playButton.dataset.balloon = '暂停'
        let playedPromise = null;
        playedPromise = chasingFrame ? Promise.resolve(this.reload()) : Promise.resolve(this.video.play());
        // const playedPromise = Promise.resolve(this.video.play());
        // const playedPromise = Promise.resolve(this.video.reload());
        playedPromise.catch(() => {
            // 如果不允许自动播放则静音之后播放
            if(this.options.live){
                this.volume(0)
                this.play()
            }
            // this.pause();
        }).then(() => {
        });
        !noLoading && this.timer.enable('loading');
        this.container.classList.remove('dplayer-paused');
        this.container.classList.add('dplayer-playing');
        if (this.danmaku && !this.options.live) {
            this.danmaku.play();
        }
        if (this.options.mutex) {
            for (let i = 0; i < instances.length; i++) {
                if (this !== instances[i]) {
                    instances[i].pause();
                }
            }
        }
    }

    empty () {
        this.template.commentInput.value = '';
    }

    /**
     * Pause video
     */
    pause () {
        this.paused = true;
        this.container.classList.remove('dplayer-loading');

        if (!this.video.paused) {
            this.bezel.switch(this.options.buttons.playButton &&  this.options.buttons.playButton.icon_pause || Icons.pause);
        }

        this.template.playButton && (this.template.playButton.innerHTML = this.options.buttons.playButton && this.options.buttons.playButton.icon_play || Icons.play, this.template.playButton.dataset.balloon = '播放');
        this.video.pause();
        this.timer.disable('loading');
        // 弹幕不暂停
        // this.container.classList.remove('dplayer-playing');
        // this.container.classList.add('dplayer-paused');
        !this.options.live && this.container.classList.remove('dplayer-playing');
        !this.options.live && this.container.classList.add('dplayer-paused');
        if (this.danmaku && !this.options.live) {
            this.danmaku.pause();
        }
    }

    switchVolumeIcon () {
        if (this.volume() >= 0.95) {
            this.template.volumeIcon.innerHTML = this.options.buttons.volumeButton && this.options.buttons.volumeButton.volumeUp || Icons.volumeUp;
        }
        else if (this.volume() > 0) {
            this.template.volumeIcon.innerHTML = this.options.buttons.volumeButton && this.options.buttons.volumeButton.volumeDown || Icons.volumeDown;
        }
        else {
            this.template.volumeIcon.innerHTML = this.options.buttons.volumeButton && this.options.buttons.volumeButton.volumeOff || Icons.volumeOff;
        }
    }

    /**
     * Set volume
     */
    volume (percentage, nostorage, nonotice) {
        percentage = parseFloat(percentage);
        if (!isNaN(percentage)) {
            percentage = Math.max(percentage, 0);
            percentage = Math.min(percentage, 1);
            this.bar.set('volume', percentage, 'width');
            const formatPercentage = `${(percentage * 100).toFixed(0)}%`;
            this.template.volumeBarWrapWrap.dataset.balloon = formatPercentage;
            if (!nostorage) {
                this.user.set('volume', percentage);
            }
            if (!nonotice) {
                this.notice(`${this.tran('Volume')} ${(percentage * 100).toFixed(0)}%`);
            }

            this.video.volume = percentage;
            if (this.video.muted) {
                this.video.muted = false;
            }
            this.switchVolumeIcon();
        }

        return this.video.volume;
    }

    /**
     * Toggle between play and pause
     */
    toggle () {
        if (this.video.paused) {
            this.play(this.options.chasingNeedle);
        }
        else {
            this.pause();
        }
    }

    /**
     * attach event
     */
    on (name, callback) {
        this.events.on(name, callback);
    }

    /**
     * Switch to a new video
     *
     * @param {Object} video - new video info
     * @param {Object} danmaku - new danmaku info
     */
    switchVideo (video, danmakuAPI) {
        this.pause();
        this.video.poster = video.pic ? video.pic : '';
        this.video.src = video.url;
        this.initMSE(this.video, video.type || 'auto');
        if (danmakuAPI) {
            this.template.danmakuLoading.style.display = 'block';
            this.bar.set('played', 0, 'width');
            this.bar.set('loaded', 0, 'width');
            this.template.ptime.innerHTML = '00:00';
            this.template.danmaku.innerHTML = '';
            if (this.danmaku) {
                this.danmaku.reload({
                    id: danmakuAPI.id,
                    address: danmakuAPI.api,
                    token: danmakuAPI.token,
                    maximum: danmakuAPI.maximum,
                    addition: danmakuAPI.addition,
                    user: danmakuAPI.user,
                });
            }
        }
    }

    initMSE (video, type) {
        this.type = type;
        if (this.options.video.customType && this.options.video.customType[type]) {
            if (Object.prototype.toString.call(this.options.video.customType[type]) === '[object Function]') {
                this.options.video.customType[type](this.video, this);
            }
            else {
                console.error(`Illegal customType: ${type}`);
            }
        }
        else {
            if (this.type === 'auto') {
                if (/m3u8(#|\?|$)/i.exec(video.src)) {
                    this.type = 'hls';
                }
                else if (/.flv(#|\?|$)/i.exec(video.src)) {
                    this.type = 'flv';
                }
                else if (/.mpd(#|\?|$)/i.exec(video.src)) {
                    this.type = 'dash';
                }
                else {
                    this.type = 'normal';
                }
            }

            if (this.type === 'hls' && (video.canPlayType('application/x-mpegURL') || video.canPlayType('application/vnd.apple.mpegURL'))) {
                this.type = 'normal';
            }

            switch (this.type) {
            // https://github.com/video-dev/hls.js
            case 'hls':
                if (this.options.mutex && this.options.live) {
                    if (this.playerObj) {
                        this.playerObj.destroy();
                        this.playerObj = null;
                    }
                }
                // this.options.mutex && window.hlsObject && window.hlsObject.destroy();
                if (Hls) {
                    if (Hls.isSupported()) {
                        let nonce = this.getUUID()
                        let timestamp = Date.now()
                        let sign = String(md5(timestamp+nonce))
                        let headers = {
                              nonce,
                              timestamp,
                              sign
                        }
                        const hls = new Hls();
                        hls.loadSource(video.src,/m3u8(#|\?|$)/i.exec(video.src) || !this.options.needHeaders?{}:headers);
                        hls.attachMedia(video);
                        hls.on(Hls.Events.ERROR, (event, data) => {
                            if (data.type === 'networkError') {
                                this.events.trigger('error', data);
                                this.events.trigger('sourthError', data);
                            }
                        });
                        this.options.mutex && this.options.live && (this.playerObj = hls);
                        this.events.on('destroy', () => {
                            hls.destroy();
                        });
                    }
                    else {
                        this.notice('Error: Hls is not supported.');
                    }
                }
                else {
                    this.notice('Error: Can\'t find Hls.');
                }
                break;

            // https://github.com/Bilibili/flv.js
            case 'flv':
                if (this.options.mutex && this.options.live) {
                    if (this.playerObj) {
                        this.playerObj.destroy();
                        this.playerObj = null;
                    }
                }
                if (flvjs) {
                    if (flvjs.isSupported()) {
                        let nonce = this.getUUID()
                        let timestamp = Date.now()
                        let sign = String(md5(timestamp+nonce))
                        let headers = {
                              nonce,
                              timestamp,
                              sign
                        }
                        const flvPlayer = flvjs.createPlayer({
                            type: 'flv',
                            url: video.src,
                            
                        },{
                            headers:/.flv(#|\?|$)/i.exec(video.src) || !this.options.needHeaders?{}:headers
                        });
                        flvPlayer.attachMediaElement(video);
                        flvPlayer.load();
                        flvPlayer.on('error', (e) => {
                            this.events.trigger('error', e);
                            this.events.trigger('sourthError', e);
                        });
                        flvPlayer.on('source_open', () => {
                        });
                        this.options.mutex &&  this.options.live && (this.playerObj = flvPlayer);
                        this.events.on('destroy', () => {
                            flvPlayer.unload();
                            flvPlayer.detachMediaElement();
                            flvPlayer.destroy();
                        });
                    }
                    else {
                        this.notice('Error: flvjs is not supported.');
                    }
                }
                else {
                    this.notice('Error: Can\'t find flvjs.');
                }
                break;

            // https://github.com/Dash-Industry-Forum/dash.js
            case 'dash':
                if (dashjs) {
                    dashjs.MediaPlayer().create().initialize(video, video.src, false);
                    this.events.on('destroy', () => {
                        dashjs.MediaPlayer().reset();
                    });
                }
                else {
                    this.notice('Error: Can\'t find dashjs.');
                }
                break;

            // https://github.com/webtorrent/webtorrent
            case 'webtorrent':
                if (WebTorrent) {
                    if (WebTorrent.WEBRTC_SUPPORT) {
                        this.container.classList.add('dplayer-loading');
                        const client = new WebTorrent();
                        const torrentId = video.src;
                        client.add(torrentId, (torrent) => {
                            const file = torrent.files.find((file) => file.name.endsWith('.mp4'));
                            file.renderTo(this.video, {
                                autoplay: this.options.autoplay
                            }, () => {
                                this.container.classList.remove('dplayer-loading');
                            });
                        });
                        this.events.on('destroy', () => {
                            client.remove(torrentId);
                            client.destroy();
                        });
                    }
                    else {
                        this.notice('Error: Webtorrent is not supported.');
                    }
                }
                else {
                    this.notice('Error: Can\'t find Webtorrent.');
                }
                break;
            }
        }
    }

    initVideo (video, type) {
        this.initMSE(video, type);

        /**
         * video events
         */
        // show video time: the metadata has loaded or changed
        this.on('durationchange', () => {
            // compatibility: Android browsers will output 1 or Infinity at first
            if (video.duration !== 1 && video.duration !== Infinity) {
                if (!this.options.buttons.timePanel) {return;}
                this.template.dtime.innerHTML = utils.secondToTime(video.duration);
            }
        });

        // show video loaded bar: to inform interested parties of progress downloading the media
        this.on('progress', () => {
            const percentage = video.buffered.length ? video.buffered.end(video.buffered.length - 1) / video.duration : 0;
            !this.options.live && this.bar.set('loaded', percentage, 'width');
        });

        // video download error: an error occurs
        this.on('error', () => {
            if (!this.video.error) {
                // Not a video load error, may be poster load failed, see #307
                return;
            }
            this.tran && this.notice && this.type !== 'webtorrent' & this.notice(this.tran('Video load failed'), -1);
        });

        // video end
        this.on('ended', () => {
            this.bar.set('played', 1, 'width');
            if (this.options.loop) {
                if (!this.setting.loop) {
                    this.pause();
                }
                else {
                    this.seek(0);
                    this.play();
                }
                if (this.danmaku) {
                    this.danmaku.danIndex = 0;
                }
            }
        });

        this.on('play', () => {
            if (this.paused) {
                this.play();
            }
        });

        this.on('pause', () => {
            if (!this.paused) {
                this.pause();
            }
        });

        this.on('timeupdate', () => {
            if( this.video){
                this.bar.set('played', this.video.currentTime / this.video.duration, 'width');
                const currentTime = utils.secondToTime(this.video.currentTime);
                if (!this.options.buttons.timePanel) {return;}
                if (this.template.ptime.innerHTML !== currentTime) {
                    this.template.ptime.innerHTML = currentTime;
                }
            }
        });

        for (let i = 0; i < this.events.videoEvents.length; i++) {
            video.addEventListener(this.events.videoEvents[i], () => {
                this.events.trigger(this.events.videoEvents[i]);
            });
        }

        this.options.buttons.volumeButton && !utils.isMobile  && this.volume(this.user.get('volume'), true, true);

        if (this.options.buttons.subtitle) {
            this.subtitle = new Subtitle(this.template.subtitle, this.video, this.options.buttons.subtitle, this.events);
            if (!this.user.get('subtitle')) {
                this.subtitle.hide();
            }
        }
    }
    reload (obj) {
        const videoHTML = tplVideo({
            current:false,
            pic:null,
            screenshot:this.options.buttons.screenshot,
            preload:'auto',
            url:obj?obj.url:(this.quality ? this.quality.url : this.options.video.url),
            subtitle:this.options.subtitle,
            isAndroid:this.isAndroid
        });
        const videoEle = new DOMParser().parseFromString(videoHTML, 'text/html').body.firstChild;
        this.template.videoWrap.insertBefore(videoEle, this.template.videoWrap.getElementsByTagName('div')[0]);
        this.prevVideo = this.video;
        this.video = videoEle;
        if(obj){
            this.initVideo(this.video,obj.type)
        } else {
            this.quality ? this.initVideo(this.video, this.quality.type || this.options.video.type) : this.initVideo(this.video, this.options.video.type);
        }
        this.events.trigger('quality_start', this.quality);
        this.events.trigger('reload', this.quality);
        let currentTime = '';
        if (this.prevVideo) {
            currentTime = this.prevVideo.currentTime;
            this.template.videoWrap.removeChild(this.prevVideo);
            this.prevVideo = null;
        }
        this.video.addEventListener('canplay', () => {
            this.video.classList.add('dplayer-video-current');
            if (this.currentTime && this.video.currentTime !== currentTime && !this.options.live) {
                !this.options.live && this.seek(currentTime);
            }
            this.video.play();
        });
    }
    switchLine (line_id, line_name, target) {
        if (this.line_id === line_id || this.switchingLine) {
            return;
        } else {
            this.line_id = line_id;
        }
        this.switchingLine = true;
        if (!this.options.buttons.qualityCustomer) {
            this.template.lineButton.innerHTML = line_name;
            this.template.lineList.querySelectorAll('.dplayer-line-item').forEach((item) => {item.classList.remove('active');});
            target.classList.add('active');
        } else {
            this.template.customerQualityCurrent.innerHTML = this.template.customerQualityCurrent.innerHTML.replace(this.template.customerQualityCurrent.innerText, line_name);
        }
        this.quality.url = this.quality.url.split('&line')[0] + '&line=' + this.line_id;
        const paused = this.video.paused;
        this.video.pause();
        const videoHTML = tplVideo({
            current:false,
            pic:null,
            screenshot: this.options.buttons.screenshot,
            preload: 'auto',
            url: this.quality.url,
            subtitle: this.options.subtitle,
            isAndroid:this.isAndroid
        });
        const videoEle = new DOMParser().parseFromString(videoHTML, 'text/html').body.firstChild;
        this.template.videoWrap.insertBefore(videoEle, this.template.videoWrap.getElementsByTagName('div')[0]);
        this.prevVideo = this.video;
        this.video = videoEle;
        this.pause();
        this.initVideo(this.video, this.quality.type || this.options.video.type);
        this.notice(`${this.tran('Switching to')} ${line_name}`, -1);
        this.events.trigger('line_start', line_id);
        let currentTime = '';
        if (this.prevVideo) {
            currentTime = this.prevVideo.currentTime;
            this.template.videoWrap.removeChild(this.prevVideo);
            this.prevVideo = null;
        }
        this.video.addEventListener('canplay', () => {
            this.video.classList.add('dplayer-video-current');
            if (this.currentTime && this.video.currentTime !== currentTime && !this.options.live) {
                !this.options.live && this.seek(currentTime);
            }
            if (!paused) {
                this.video.play();
            }
            this.switchingLine && this.notice(`${this.tran('Switched to')} ${line_name}`);
            this.switchingLine = false;
            this.events.trigger('line_end');
        });
        this.on('error', () => {
            this.notice('');
            this.switchingLine = false;
        });
    }
    switchQuality (index, canSwitch) {
        if (!canSwitch && this.options.isLogin && !this.options.isLogin.status) {
            this.options.isLogin.callback &&  this.options.isLogin.callback();
            return;
        }
        index = typeof index === 'string' ? parseInt(index) : index;
        if (this.qualityIndex === index || this.switchingQuality) {
            return;
        }
        else {
            this.qualityIndex = index;
        }
        this.switchingQuality = true;
        this.quality = this.options.video.quality[index];
        this.quality.url.indexOf('/distribute') === -1 ? '' : this.quality.url = this.quality.url.split('&line')[0] + '&line=' + this.line_id;
        this.template.qualityButton.innerHTML = this.quality.name;
        if (!this.options.buttons.qualityCustomer) {
            this.template.qualityList.querySelectorAll('.dplayer-quality-item').forEach((item) => {item.classList.remove('active');});
            this.template.qualityList.querySelectorAll('.dplayer-quality-item')[index].classList.add('active');
        }
        const paused = this.video.paused;
        this.video.pause();
        const videoHTML = tplVideo({
            current: false,
            pic: null,
            screenshot: this.options.buttons.screenshot,
            preload: 'auto',
            url: this.quality.url,
            subtitle: this.options.subtitle,
            isAndroid:this.isAndroid
        });
        const videoEle = new DOMParser().parseFromString(videoHTML, 'text/html').body.firstChild;
        this.template.videoWrap.insertBefore(videoEle, this.template.videoWrap.getElementsByTagName('div')[0]);
        this.prevVideo = this.video;
        this.video = videoEle;
        this.initVideo(this.video, this.quality.type || this.options.video.type);
        this.notice(`${this.tran('Switching to')} ${this.quality.name} ${this.tran('quality')}`, -1);
        this.events.trigger('quality_start', this.quality);
        let currentTime = '';
        if (this.prevVideo) {
            currentTime = this.prevVideo.currentTime;
            this.template.videoWrap.removeChild(this.prevVideo);
            this.prevVideo = null;
        }
        this.video.addEventListener('canplay', () => {
            this.video.classList.add('dplayer-video-current');
            if (currentTime &&  this.video.currentTime !==  currentTime && !this.options.live) {
                !this.options.live && this.seek(currentTime);
                return;
            }
            if (!paused) {
                this.video.play();
            }
            this.switchingQuality && this.notice(`${this.tran('Switched to')} ${this.quality.name} ${this.tran('quality')}`);
            this.switchingQuality = false;
            this.events.trigger('quality_end');
        });
        this.on('error', () => {
            this.notice('');
            this.switchingQuality = false;
        });
    }

    notice (text, time = 2000, opacity = 0.8) {
        this.template.notice.innerHTML = text;
        this.template.notice.style.opacity = opacity;
        if (this.noticeTime) {
            clearTimeout(this.noticeTime);
        }
        this.events.trigger('notice_show', text);
        if (time > 0) {
            this.noticeTime = setTimeout(() => {
                this.template.notice.style.opacity = 0;
                this.events.trigger('notice_hide');
            }, time);
        }
    }

    resize () {
        if (this.danmaku) {
            this.danmaku.resize();
        }
        if (this.controller.thumbnails) {
            this.controller.thumbnails.resize(160, this.video.videoHeight / this.video.videoWidth * 160, this.template.barWrap.offsetWidth);
        }
        this.events.trigger('resize');
    }

    speed (rate) {
        this.video.playbackRate = rate;
    }

    destroy () {
        instances.splice(instances.indexOf(this), 1);
        this.pause();
        this.controller.destroy();
        this.timer.destroy();
        // 重置该参数会导致m3u8销毁失效
        // this.video.src = '';
        // this.container.innerHTML = '';
        this.template.videoWrap.innerHTML = ''
        this.video = null
        if (this.options.live && this.options.mutex) {
            if (this.playerObj) {
                this.playerObj.destroy();
                this.playerObj = null;
            }
        } else {
            this.events.trigger('destroy');
        }
    }
    setSuspension (boolean) {
        this.suspension = boolean;
    }
    static get version () {
        /* global DPLAYER_VERSION */
        return DPLAYER_VERSION;
    }
}

export default DPlayer;
