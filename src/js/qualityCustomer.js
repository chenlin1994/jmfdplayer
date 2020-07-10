
class SettingCustomer {
    constructor (player) {
        this.player = player;
        this.hasSelected = true;
        // 播放器控件阴影
        this.player.template.mask.addEventListener('click', () => {
            this.hide();
        });
        // 清晰度按钮
        this.player.template.customerQualityButton.addEventListener('click', () => {
            this.show();
        });
        // 当前线路
        this.player.template.customerQualityCurrent.addEventListener('click', () => {
            if (this.hasSelected) {
                this.hasSelected = false;
                this.player.template.customerLineSelect.classList.remove('hasSelected');
                this.player.template.customerQualityCurrent.querySelector('.iconfont').classList.remove('icondown');
                this.player.template.customerQualityCurrent.querySelector('.iconfont').classList.add('icontop');
            }
        });
        // 线路选择列表
        this.player.template.customerLineSelect.addEventListener('click', (e) => {
            if (e.target.dataset.index !== null && e.target.dataset.index !== undefined) {
                this.hasSelected = true;
                this.player.template.customerLineSelect.classList.add('hasSelected');
                this.player.template.customerQualityCurrent.querySelector('.iconfont').classList.remove('icontop');
                this.player.template.customerQualityCurrent.querySelector('.iconfont').classList.add('icondown');
                this.player.template.customerLineSelect.querySelectorAll('.line-customer-item').forEach((item) => {item.classList.remove('active');});
                e.target.classList.add('active');
                if (e.target.innerText ===  this.player.template.customerQualityCurrent.innerText) {return;}
                this.player.switchLine(e.target.dataset.index, e.target.innerText, e.target);
            }
        });
        // 清晰度切换
        this.player.template.customerQualitySelect.addEventListener('click', (e) => {
            if (e.target.dataset.index !== null && e.target.dataset.index !== undefined) {
                this.player.switchQuality(e.target.dataset.index,  e.target.dataset.index == 1 ? false : true);
                document.querySelectorAll('.dplayer-quality-item').forEach((item) => {
                    item.classList.remove('active');
                });
                e.target.classList.add('active');
            }
        });
    }
    hide () {
        this.player.template.customerQualityBox.classList.remove('dplayer-quality-box-open');
        this.player.template.mask.classList.remove('dplayer-mask-show');
        this.player.controller.disableAutoHide = false;
    }

    show () {
        this.player.template.customerQualityBox.classList.add('dplayer-quality-box-open');
        this.player.template.mask.classList.add('dplayer-mask-show');
        this.player.controller.disableAutoHide = true;
    }
}

export default SettingCustomer;