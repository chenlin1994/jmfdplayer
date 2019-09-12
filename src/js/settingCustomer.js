
class SettingCustomer {
    constructor (player) {
        this.player = player;
        this.player.template.mask.addEventListener('click', () => {
            this.hide();
        });
        this.player.template.customerSettingButton.addEventListener('click', () => {
            this.show();
        });
        this.player.template.customerSettingArea.addEventListener('click', (e) => {
            let objectDom = null;
            if (e.target.classList.contains('area_choice') || e.target.parentElement.classList.contains('rect')) {
                objectDom = e.target.classList.contains('area_choice') ? e.target.parentElement : e.target.parentElement.parentElement;
                const domList = document.querySelectorAll('.rect_parent');
                domList.forEach(function (item) {
                    item.classList.remove('active');
                });
                objectDom.classList.add('active');
                switch (objectDom.getAttribute('data-type')) {
                case '0':this.changeDanmakuStatus(false);break;
                case '1':this.changeDanmakuStatus(true, true);break;
                case '2':this.changeDanmakuStatus(true, false);break;
                }
            }
        });
        this.player.template.customerSettingDanmaku.addEventListener('click', (e) => {
            const dom = e.target.classList.contains('checkBox') ? e.target : e.target.parentElement;
            if (dom.classList.contains('checkBox')) {
                this.setFontSize(dom.getAttribute('data-type'));
                const domList = document.querySelectorAll('.checkBox');
                domList.forEach(function (item) {
                    item.classList.remove('active');
                });
                dom.classList.add('active');
            }
        });
        this.init();
    }
    init () {
        const wrapper = document.querySelector('#wrapper');
        const slider = document.querySelector('#slider');
        const fill = document.querySelector('#fill');
        const silder_po = document.querySelector('#silder_po');
        this.move(wrapper, slider, fill, silder_po);
    }
    hide () {
        this.player.template.customerSettingBox.classList.remove('dplayer-setting-box-open');
        this.player.template.mask.classList.remove('dplayer-mask-show');
        this.player.controller.disableAutoHide = false;
    }

    show () {
        this.player.template.customerSettingBox.classList.add('dplayer-setting-box-open');
        this.player.template.mask.classList.add('dplayer-mask-show');
        this.player.controller.disableAutoHide = true;
    }

    changeDanmakuStatus (isShow, isHalf) {
        if (!isShow) {
            this.player.danmaku.hide();
        } else {
            this.player.danmaku.half = isHalf;
            this.player.danmaku.show();
        }
    }

    setFontSize (type) {
        switch (type) {
        case '0': this.player.template.danmaku.style.fontSize = '16px';break;
        case '1': this.player.template.danmaku.style.fontSize = '22px';break;
        case '2': this.player.template.danmaku.style.fontSize = '28px';break;
        }
    }
    move (dom1, dom2, dom3, dom4) {
        dom1.addEventListener('click', (e) => {
            if (e.target !== dom2) {
                if (e.offsetX > 132) {
                    dom2.style.left = '128px';
                    dom3.style.width = '128px';
                    dom4.style.left = '128px';
                } else if (e.offsetX < 4) {
                    dom2.style.left = '0px';
                    dom3.style.width = '0px';
                    dom4.style.left = '0px';
                } else {
                    dom2.style.left = e.offsetX - 4 + 'px';
                    dom3.style.width = e.offsetX - 4 + 'px';
                    dom4.style.left =  e.offsetX - 4 + 'px';
                }
                const percent = Math.floor(dom3.offsetWidth * 100 / 128) + '%';
                dom4.innerHTML = percent;
                this.settingOpacity(dom3.offsetWidth / 128);
            }
        });
        dom2.addEventListener('mousedown', (e) => {
            const pageX = e.pageX;
            const width = dom3.offsetWidth;
            document.onmousemove = (e) => {
                const currentD = e.pageX - pageX;
                if (width + currentD <= 0) {
                    dom2.style.left = 0 + 'px';
                    dom3.style.width = 0 + 'px';
                    dom4.style.left = 0 + 'px';
                } else if (width + currentD >= 132) {
                    dom2.style.left = 128 + 'px';
                    dom3.style.width = 128 + 'px';
                    dom4.style.left = 128 + 'px';
                } else {
                    dom2.style.left = width + currentD + 'px';
                    dom3.style.width = width + currentD + 'px';
                    dom4.style.left = width + currentD + 'px';
                }
                const percent = Math.floor(dom3.offsetWidth * 100 / 128) + '%';
                dom4.innerHTML = percent;
                this.settingOpacity(dom3.offsetWidth  / 128);
            };
        });
        document.addEventListener('mouseup', function () {
            document.onmousemove = null;
        });
    }
    settingOpacity (opacity) {
        this.player.danmaku.opacity(opacity);
    }
}

export default SettingCustomer;