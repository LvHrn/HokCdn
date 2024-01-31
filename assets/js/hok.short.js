/**
 * 获取直属子元素
 * @param el
 * @param className
 * @returns {*|null}
 */
function getChildren(el, className) {
	for (let item of el.children) if (item.className === className) return item;
	return null;
}

document.addEventListener('DOMContentLoaded', () => {
	$('.hok_detail__article p:empty').remove();

	customElements.define(
		'hok-mtitle',
		class HokMtitle extends HTMLElement {
			constructor() {
				super();
				this.innerHTML = `
				<span class="hok_mtitle">
					<span class="hok_mtitle__text">
						${this.getAttribute('title') || '默认标题'}
					</span>
				</span>
			`;
			}
		}
	);

	customElements.define(
		'hok-mp3',
		class HokMp3 extends HTMLElement {
			constructor() {
				super();
				this.options = {
					name: this.getAttribute('name'),
					url: this.getAttribute('url'),
					theme: this.getAttribute('theme') || '#1989fa',
					cover: this.getAttribute('cover'),
					autoplay: this.getAttribute('autoplay') ? true : false
				};
				this.render();
			}
			render() {
				if (!this.options.url) return (this.innerHTML = '音频地址未填写！');
				this.innerHTML = '<span style="display: block" class="_content"></span>';
				new APlayer({
					container: getChildren(this, '_content'),
					theme: this.options.theme,
					autoplay: this.options.autoplay,
					audio: [
						{
							url: this.options.url,
							name: this.options.name,
							cover: this.options.cover
						}
					]
				});
			}
		}
	);

	customElements.define(
		'hok-music',
		class HokMusic extends HTMLElement {
			constructor() {
				super();
				this.options = {
					id: this.getAttribute('id'),
					color: this.getAttribute('color') || '#1989fa',
					autoplay: this.getAttribute('autoplay') ? true : false
				};
				this.render();
			}
			render() {
				if (!this.options.id) return (this.innerHTML = '网易云歌曲ID未填写！');
				this.innerHTML = '<span style="display: block" class="_content"></span>';
				fetch('https://www.vvhan.com/usr/themes/Hok/NeteaseCloudMusicApi.php?id=' + this.options.id).then(async response => {
					const audio = await response.json();
					new APlayer({
						container: getChildren(this, '_content'),
						lrcType: 1,
						theme: this.options.color,
						autoplay: this.options.autoplay,
						audio
					});
				});
			}
		}
	);

	customElements.define(
		'hok-mlist',
		class HokMlist extends HTMLElement {
			constructor() {
				super();
				this.options = {
					id: this.getAttribute('id'),
					color: this.getAttribute('color') || '#1989fa',
					autoplay: this.getAttribute('autoplay') ? true : false
				};
				this.render();
			}
			render() {
				if (!this.options.id) return (this.innerHTML = '网易云歌单ID未填写！');
				this.innerHTML = '<span style="display: block" class="_content"></span>';
				fetch('https://api.i-meto.com/meting/api?server=netease&type=playlist&id=' + this.options.id).then(async response => {
					const audio = await response.json();
					new APlayer({
						container: getChildren(this, '_content'),
						lrcType: 3,
						theme: this.options.color,
						autoplay: this.options.autoplay,
						audio
					});
				});
			}
		}
	);

	customElements.define(
		'hok-abtn',
		class HokAbtn extends HTMLElement {
			constructor() {
				super();
				this.options = {
					icon: this.getAttribute('icon') || '',
					color: this.getAttribute('color') || '#ff6800',
					href: this.getAttribute('href') || '#',
					radius: this.getAttribute('radius') || '17.5px',
					content: this.getAttribute('content') || '多彩按钮'
				};
				this.innerHTML = `
                    <a class="hok_abtn" style="background: ${this.options.color}; border-radius: ${this.options.radius}" href="${this.options.href}" target="_blank" rel="noopener noreferrer nofollow">
                        <span class="hok_abtn__icon">
                            <i class="${this.options.icon} fa"></i>
                        </span>
                        <span class="hok_abtn__content">
                            ${this.options.content}
                        </span>
                    </a>
                `;
			}
		}
	);

	customElements.define(
		'hok-anote',
		class HokAnote extends HTMLElement {
			constructor() {
				super();
				this.options = {
					icon: this.getAttribute('icon') || 'fa-download',
					href: this.getAttribute('href') || '#',
					type: /^secondary$|^success$|^warning$|^error$|^info$/.test(this.getAttribute('type')) ? this.getAttribute('type') : 'secondary',
					content: this.getAttribute('content') || '标签按钮'
				};
				this.innerHTML = `
					<a class="hok_anote ${this.options.type}" href="${this.options.href}" target="_blank" rel="noopener noreferrer nofollow">
						<span class="hok_anote__icon">
							<i class="fa ${this.options.icon}"></i>
						</span>
						<span class="hok_anote__content">
							${this.options.content}
						</span>
					</a>
				`;
			}
		}
	);

	customElements.define(
		'hok-dotted',
		class HokDotted extends HTMLElement {
			constructor() {
				super();
				this.startColor = this.getAttribute('startColor') || '#ff6c6c';
				this.endColor = this.getAttribute('endColor') || '#1989fa';
				this.innerHTML = `
					<span class="hok_dotted" style="background-image: repeating-linear-gradient(-45deg, ${this.startColor} 0, ${this.startColor} 20%, transparent 0, transparent 25%, ${this.endColor} 0, ${this.endColor} 45%, transparent 0, transparent 50%)"></span>
				`;
			}
		}
	);

	customElements.define(
		'hok-cloud',
		class HokCloud extends HTMLElement {
			constructor() {
				super();
				this.options = {
					type: this.getAttribute('type') || 'default',
					title: this.getAttribute('title') || '默认标题',
					url: this.getAttribute('url'),
					password: this.getAttribute('password')
				};
				const type = {
					default: '默认网盘',
					360: '360网盘',
					bd: '百度网盘',
					ty: '天翼网盘',
					ct: '城通网盘',
					wy: '微云网盘',
					github: 'Github仓库',
					lz: '蓝奏云网盘'
				};
				this.innerHTML = `
					<span class="hok_cloud">
						<div class="hok_cloud__logo _${this.options.type}"></div>
						<div class="hok_cloud__describe">
							<div class="hok_cloud__describe-title">${this.options.title}</div>
							<div class="hok_cloud__describe-type">来源：${type[this.options.type] || '默认网盘'}${this.options.password ? ' | 提取码：' + this.options.password : ''}</div>
						</div>
						<a class="hok_cloud__btn" href="${this.options.url}" target="_blank" rel="noopener noreferrer nofollow">
							<i class="fa fa-download"></i>
						</a>
					</span>
				`;
			}
		}
	);

	customElements.define(
		'hok-hide',
		class HokHide extends HTMLElement {
			constructor() {
				super();
				this.render();
			}
			render() {
				this.innerHTML = '<span class="hok_hide">此处内容作者设置了 <i class="hok_hide__button">回复</i> 可见</span>';
				this.$button = this.querySelector('.hok_hide__button');
				const $comment = document.querySelector('.hok_comment');
				const $header = document.querySelector('.hok_header');
				if (!$comment || !$header) return;
				this.$button.addEventListener('click', () => {
					const top = $comment.offsetTop - $header.offsetHeight - 15;
					window.scrollTo({ top, behavior: 'smooth' });
				});
			}
		}
	);

	customElements.define(
		'hok-card-default',
		class HokCardDefault extends HTMLElement {
			constructor() {
				super();
				const _temp = getChildren(this, '_temp');
				this.options = {
					width: this.getAttribute('width') || '100%',
					label: this.getAttribute('label') || '卡片标题',
					content: _temp.innerHTML.trim().replace(/^(<br>)|(<br>)$/g, '') || '卡片内容'
				};
				const htmlStr = `
				<div class="hok_card__default" style="width: ${this.options.width}">
					<div class="hok_card__default-title">${this.options.label}</div>
					<div class="hok_card__default-content">${this.options.content}</div>
				</div>
			`;
				if (getChildren(this, '_content')) {
					getChildren(this, '_content').innerHTML = htmlStr;
				} else {
					const span = document.createElement('span');
					span.style.display = 'block';
					span.className = '_content';
					span.innerHTML = htmlStr;
					this.appendChild(span);
				}
			}
		}
	);

	customElements.define(
		'hok-message',
		class HokMessage extends HTMLElement {
			constructor() {
				super();
				this.options = {
					type: /^success$|^info$|^warning$|^error$/.test(this.getAttribute('type')) ? this.getAttribute('type') : 'info',
					content: this.getAttribute('content') || '消息内容'
				};
				this.innerHTML = `
					<span class="hok_message ${this.options.type}">
						<span class="hok_message__icon"></span>
						<span class="hok_message__content">${this.options.content}</span>
					</span>
				`;
			}
		}
	);

	customElements.define(
		'hok-progress',
		class HokProgress extends HTMLElement {
			constructor() {
				super();
				this.options = {
					percentage: /^\d{1,3}%$/.test(this.getAttribute('percentage')) ? this.getAttribute('percentage') : '50%',
					color: this.getAttribute('color') || '#ff6c6c'
				};
				this.innerHTML = `
				<span class="hok_progress">
					<div class="hok_progress__strip">
						<div class="hok_progress__strip-percent" style="width: ${this.options.percentage}; background: ${this.options.color};"></div>
					</div>
					<div class="hok_progress__percentage">${this.options.percentage}</div>
				</span>
			`;
			}
		}
	);

	customElements.define(
		'hok-callout',
		class HokCallout extends HTMLElement {
			constructor() {
				super();
				const _temp = getChildren(this, '_temp');
				this.options = {
					color: this.getAttribute('color') || '#f0ad4e',
					content: _temp.innerHTML.trim().replace(/^(<br>)|(<br>)$/g, '') || '标注内容'
				};
				const htmlStr = `
					<div class="hok_callout" style="border-left-color: ${this.options.color};">
						${this.options.content}
					</div>
				`;
				if (getChildren(this, '_content')) {
					getChildren(this, '_content').innerHTML = htmlStr;
				} else {
					const span = document.createElement('span');
					span.style.display = 'block';
					span.className = '_content';
					span.innerHTML = htmlStr;
					this.appendChild(span);
				}
			}
		}
	);

	customElements.define(
		'hok-card-describe',
		class HokCardDescribe extends HTMLElement {
			constructor() {
				super();
				const _temp = getChildren(this, '_temp');
				this.options = {
					title: this.getAttribute('title') || '卡片描述',
					content: _temp.innerHTML.trim().replace(/^(<br>)|(<br>)$/g, '') || '卡片内容'
				};
				const htmlStr = `
					<div class="hok_card__describe">
						<div class="hok_card__describe-title">${this.options.title}</div>
						<div class="hok_card__describe-content">${this.options.content}</div>
					</div>
				`;
				if (getChildren(this, '_content')) {
					getChildren(this, '_content').innerHTML = htmlStr;
				} else {
					const span = document.createElement('span');
					span.style.display = 'block';
					span.className = '_content';
					span.innerHTML = htmlStr;
					this.appendChild(span);
				}
			}
		}
	);

	customElements.define(
		'hok-card-list',
		class HokCardList extends HTMLElement {
			constructor() {
				super();
				const _temp = getChildren(this, '_temp');
				let _innerHTML = _temp.innerHTML.trim().replace(/^(<br>)|(<br>)$/g, '');
				let content = '';
				_innerHTML.replace(/{card-list-item}([\s\S]*?){\/card-list-item}/g, function ($0, $1) {
					content += `<div class="hok_card__list-item">${$1.trim().replace(/^(<br>)|(<br>)$/g, '')}</div>`;
				});
				let htmlStr = `<div class="hok_card__list">${content}</div>`;
				if (getChildren(this, '_content')) {
					getChildren(this, '_content').innerHTML = htmlStr;
				} else {
					const span = document.createElement('span');
					span.className = '_content';
					span.style.display = 'block';
					span.innerHTML = htmlStr;
					this.appendChild(span);
				}
			}
		}
	);

	customElements.define(
		'hok-alert',
		class HokAlert extends HTMLElement {
			constructor() {
				super();
				const _temp = getChildren(this, '_temp');
				this.options = {
					type: /^success$|^info$|^warning$|^error$/.test(this.getAttribute('type')) ? this.getAttribute('type') : 'info',
					content: _temp.innerHTML.trim().replace(/^(<br>)|(<br>)$/g, '') || '警告提示'
				};
				const htmlStr = `
					<div class="hok_alert ${this.options.type}">
						${this.options.content}
					</div>
				`;
				if (getChildren(this, '_content')) {
					getChildren(this, '_content').innerHTML = htmlStr;
				} else {
					const span = document.createElement('span');
					span.style.display = 'block';
					span.className = '_content';
					span.innerHTML = htmlStr;
					this.appendChild(span);
				}
			}
		}
	);

	customElements.define(
		'hok-timeline',
		class HokTimeline extends HTMLElement {
			constructor() {
				super();
				const _temp = getChildren(this, '_temp');
				let _innerHTML = _temp.innerHTML.trim().replace(/^(<br>)|(<br>)$/g, '');
				let content = '';
				_innerHTML.replace(/{timeline-item([^}]*)}([\s\S]*?){\/timeline-item}/g, function ($0, $1, $2) {
					content += `
					<div class="hok_timeline__item">
						<div class="hok_timeline__item-tail"></div>
						<div class="hok_timeline__item-circle" ${$1}></div>
						<div class="hok_timeline__item-content">${$2.trim().replace(/^(<br>)|(<br>)$/g, '')}</div>
					</div>
				`;
				});
				let htmlStr = `<div class="hok_timeline">${content}</div>`;
				if (getChildren(this, '_content')) {
					getChildren(this, '_content').innerHTML = htmlStr;
				} else {
					const span = document.createElement('span');
					span.className = '_content';
					span.style.display = 'block';
					span.innerHTML = htmlStr;
					this.appendChild(span);
				}
				this.querySelectorAll('.hok_timeline__item-circle').forEach((item, index) => {
					const color = item.getAttribute('color') || '#19be6b';
					item.style.borderColor = color;
				});
			}
		}
	);

	customElements.define(
		'hok-collapse',
		class HokCollapse extends HTMLElement {
			constructor() {
				super();
				const _temp = getChildren(this, '_temp');
				let _innerHTML = _temp.innerHTML.trim().replace(/^(<br>)|(<br>)$/g, '');
				let content = '';
				_innerHTML.replace(/{collapse-item([^}]*)}([\s\S]*?){\/collapse-item}/g, function ($0, $1, $2) {
					content += `
					<div class="hok_collapse__item" ${$1}>
						<div class="hok_collapse__item-head">
							<div class="hok_collapse__item-head--label"></div>
							<svg class="hok_collapse__item-head--icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path d="M7.406 7.828L12 12.422l4.594-4.594L18 9.234l-6 6-6-6z"/></svg>
						</div>
						<div class="hok_collapse__item-wrapper">
							<div class="hok_collapse__item-wrapper--content">${$2.trim().replace(/^(<br>)|(<br>)$/g, '')}</div>
						</div>
					</div>
				`;
				});
				let htmlStr = `<div class="hok_collapse">${content}</div>`;
				if (getChildren(this, '_content')) {
					getChildren(this, '_content').innerHTML = htmlStr;
				} else {
					const span = document.createElement('span');
					span.className = '_content';
					span.style.display = 'block';
					span.innerHTML = htmlStr;
					this.appendChild(span);
				}
				this.querySelectorAll('.hok_collapse__item').forEach(item => {
					const label = item.getAttribute('label') || '折叠标题';
					const head = getChildren(item, 'hok_collapse__item-head');
					const headLabel = getChildren(head, 'hok_collapse__item-head--label');
					headLabel.innerHTML = label;
					const wrapper = getChildren(item, 'hok_collapse__item-wrapper');
					const content = getChildren(wrapper, 'hok_collapse__item-wrapper--content');
					const open = item.getAttribute('open');
					if (open !== null) {
						item.classList.add('active');
						wrapper.style.maxHeight = 'none';
					}
					head.addEventListener('click', () => {
						wrapper.style.maxHeight = content.offsetHeight + 'px';
						let timer = setTimeout(() => {
							if (item.classList.contains('active')) {
								item.classList.remove('active');
								wrapper.style.maxHeight = 0;
							} else {
								item.classList.add('active');
								wrapper.style.maxHeight = content.offsetHeight + 'px';
							}
							clearTimeout(timer);
						}, 30);
					});
				});
			}
		}
	);

	customElements.define(
		'hok-dplayer',
		class HokDplayer extends HTMLElement {
			constructor() {
				super();
				this.options = {
					src: this.getAttribute('src'),
					player: this.getAttribute('player')
				};
				this.render();
			}
			render() {
				if (this.options.src) this.innerHTML = `<iframe allowfullscreen="true" class="hok_vplayer" src="${this.options.player + this.options.src}"></iframe>`;
				else this.innerHTML = '播放地址未填写！';
			}
		}
	);

	customElements.define(
		'hok-bilibili',
		class HokBilibili extends HTMLElement {
			constructor() {
				super();
				this.bvid = this.getAttribute('bvid');
				this.page = Object.is(Number(this.getAttribute('page')), NaN) ? 1 : this.getAttribute('page');
				this.render();
			}
			render() {
				if (this.bvid) this.innerHTML = `<iframe allowfullscreen="true" class="hok_vplayer" src="//player.bilibili.com/player.html?bvid=${this.bvid}&page=${this.page}"></iframe>`;
				else this.innerHTML = 'Bvid未填写！';
			}
		}
	);

	customElements.define(
		'hok-tabs',
		class HokTabs extends HTMLElement {
			constructor() {
				super();
				const _temp = getChildren(this, '_temp');
				let _innerHTML = _temp.innerHTML.trim().replace(/^(<br>)|(<br>)$/g, '');
				let navs = '';
				let contents = '';
				_innerHTML.replace(/{tabs-pane([^}]*)}([\s\S]*?){\/tabs-pane}/g, function ($0, $1, $2) {
					navs += `<div class="hok_tabs__head-item" ${$1}></div>`;
					contents += `<div style="display: none" class="hok_tabs__body-item" ${$1}>${$2.trim().replace(/^(<br>)|(<br>)$/g, '')}</div>`;
				});
				let htmlStr = `
                <div class="hok_tabs">
                    <div class="hok_tabs__head">${navs}</div>
                    <div class="hok_tabs__body">${contents}</div>
                </div>
            `;
				if (getChildren(this, '_content')) {
					getChildren(this, '_content').innerHTML = htmlStr;
				} else {
					const span = document.createElement('span');
					span.className = '_content';
					span.style.display = 'block';
					span.innerHTML = htmlStr;
					this.appendChild(span);
				}
				this.querySelectorAll('.hok_tabs__head-item').forEach((item, index) => {
					const label = item.getAttribute('label');
					item.innerHTML = label;
					item.addEventListener('click', () => {
						this.querySelectorAll('.hok_tabs__head-item').forEach(_item => _item.classList.remove('active'));
						this.querySelectorAll('.hok_tabs__body-item').forEach(_item => (_item.style.display = 'none'));
						if (this.querySelector(`.hok_tabs__body-item[label="${label}"]`)) {
							this.querySelector(`.hok_tabs__body-item[label="${label}"]`).style.display = 'block';
						}
						item.classList.add('active');
					});
					if (index === 0) item.click();
				});
			}
		}
	);

	customElements.define(
		'hok-gird',
		class HokGird extends HTMLElement {
			constructor() {
				super();
				this.options = {
					column: isNaN(this.getAttribute('column')) || !this.getAttribute('column') ? 3 : this.getAttribute('column'),
					gap: isNaN(this.getAttribute('gap')) || !this.getAttribute('gap') ? 15 : this.getAttribute('gap')
				};
				const _temp = getChildren(this, '_temp');
				let _innerHTML = _temp.innerHTML.trim().replace(/^(<br>)|(<br>)$/g, '');
				let contents = '';
				_innerHTML.replace(/{gird-item}([\s\S]*?){\/gird-item}/g, function ($0, $1) {
					contents += `<div class="hok_gird__item">${$1.trim().replace(/^(<br>)|(<br>)$/g, '')}</div>`;
				});
				let htmlStr = `<div class="hok_gird" style="gap: ${this.options.gap}px; grid-template-columns: repeat(${this.options.column}, 1fr);">${contents}</div>`;
				if (getChildren(this, '_content')) {
					getChildren(this, '_content').innerHTML = htmlStr;
				} else {
					const span = document.createElement('span');
					span.className = '_content';
					span.style.display = 'block';
					span.innerHTML = htmlStr;
					this.appendChild(span);
				}
			}
		}
	);

	customElements.define(
		'hok-copy',
		class HokCopy extends HTMLElement {
			constructor() {
				super();
				this.options = {
					showText: this.getAttribute('showText') || '点击复制',
					copyText: this.getAttribute('copyText') || '默认文本'
				};
				this.innerHTML = `<span class="hok_copy" style="cursor: pointer; user-select: none;">${this.options.showText}</span>`;
				const button = getChildren(this, 'hok_copy');
				if (typeof ClipboardJS !== 'undefined' && typeof Qmsg !== 'undefined') {
					new ClipboardJS(button, { text: () => this.options.copyText }).on('success', () => Qmsg.success('复制成功！'));
				} else {
					button.addEventListener('click', () => alert('该功能请前往前台查看！'));
				}
			}
		}
	);

	$('.hok_detail__article p:empty').remove();
});
