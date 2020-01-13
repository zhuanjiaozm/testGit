<template>
	<div class="captcha" ref="captcha" style="position: relative"></div>
</template>

<script>
	export default {
		name: 'LoginSlider',
		props: {
			randomStr: {
				type: String
			}
		},
		data() {
			return {
				formCustom: {
					w: 288,
					h: 155,
					bigImage: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2786741331,312930537&fm=26&gp=0.jpg',
					smallImage: 'http://img3.imgtn.bdimg.com/it/u=2672961933,811696830&fm=26&gp=0.jpg',
					yHeight: 0,
					trail: []
				},
				DOM: {
					bigImage: '',
					block: '',
					sliderContainer: '',
					sliderPanel: '',
					refreshIcon: '',
					sliderMask: '',
					slider: '',
					sliderIcon: '',
					text: ''
				}
			}
		},
		mounted() {
			this.initDOM(this.$refs.captcha)
			this.bindEvents(this.$refs.captcha)
			this.initImg()
			this.initCodeImg()
		},
		methods: {
			initCodeImg() {
				/** 初始化拼图验证码 **/
				/*return new Promise((resolve, reject) => {
					getCode({
						randomStr: this.randomStr
					}).then(res => {
						if(res.code === 200) {
							this.formCustom = res.data
							this.initImg()
						}
						resolve()
					}).catch(error => {
						reject(error)
					})
				})*/

			},
			onVerify(code) {
				/** 传给父组件 请求登录验证 **/
				this.$emit('parentHandleSubmit', code)
			},
			onSuccess() {
				this.addClass(this.DOM.sliderContainer, 'sliderContainer_success')
			},
			onFail() {
				this.addClass(this.DOM.sliderContainer, 'sliderContainer_fail')
				this.reset()
			},
			initDOM(el) {
				this.DOM.bigImage = this.createElement('img') // 大图
				this.DOM.block = this.createElement('img') // 滑块
				this.DOM.sliderContainer = this.createElement('div')
				this.DOM.sliderPanel = this.createElement('div')
				this.DOM.refreshIcon = this.createElement('div')
				this.DOM.sliderMask = this.createElement('div')
				this.DOM.slider = this.createElement('div')
				this.DOM.sliderIcon = this.createElement('span')
				this.DOM.text = this.createElement('span')

				this.DOM.sliderPanel.className = 'sliderPanel'
				this.DOM.block.className = 'block'
				this.DOM.bigImage.className = 'bigImage'
				this.DOM.sliderContainer.className = 'sliderContainer'
				this.DOM.refreshIcon.className = 'refreshIcon'
				this.DOM.sliderMask.className = 'sliderMask'
				this.DOM.slider.className = 'slider'
				this.DOM.sliderIcon.className = 'sliderIcon'
				this.DOM.text.innerHTML = '向右滑动滑块填充拼图'
				this.DOM.text.className = 'sliderText'

				el.appendChild(this.DOM.sliderPanel)
				this.DOM.sliderPanel.appendChild(this.DOM.bigImage)
				this.DOM.sliderPanel.appendChild(this.DOM.refreshIcon)
				this.DOM.sliderPanel.appendChild(this.DOM.block)
				this.DOM.slider.appendChild(this.DOM.sliderIcon)
				this.DOM.sliderMask.appendChild(this.DOM.slider)
				this.DOM.sliderContainer.appendChild(this.DOM.sliderMask)
				this.DOM.sliderContainer.appendChild(this.DOM.text)
				el.appendChild(this.DOM.sliderContainer)
			},
			initImg() {
				this.DOM.bigImage.src = this.formCustom.bigImage
				this.DOM.block.src = this.formCustom.smallImage
				this.DOM.block.style = 'padding-top:' + this.formCustom.yHeight + 'px'
			},
			createElement(tagName) {
				return document.createElement(tagName)
			},
			bindEvents(el) {
				let that = this
				el.onselectstart = () => false
				that.DOM.refreshIcon.onclick = () => {
					that.initCodeImg()
				}
				let originX, originY, blockLeft, trail = [],
					isMouseDown = false
				/** 鼠标点击 **/
				that.DOM.slider.addEventListener('mousedown', function(e) {
					originX = e.x, originY = e.y
					isMouseDown = true
				})
				const formCustomW = that.formCustom.w
				/** 鼠标拖动 **/
				document.addEventListener('mousemove', (e) => {
					if(!isMouseDown) return false
					const moveX = e.x - originX
					const moveY = e.y - originY
					if(moveX < 0 || moveX + 38 >= formCustomW) return false
					that.DOM.slider.style.left = moveX + 'px'
					blockLeft = (formCustomW - 40 - 20) / (formCustomW - 40) * moveX
					that.DOM.block.style.left = blockLeft + 'px'

					that.addClass(that.DOM.sliderContainer, 'sliderContainer_active')
					that.DOM.sliderMask.style.width = moveX + 'px'
					trail.push(moveY)
				})
				/** 鼠标放开 **/
				document.addEventListener('mouseup', (e) => {
					if(!isMouseDown) return false
					isMouseDown = false
					if(e.x == originX) return false
					that.removeClass(that.DOM.sliderContainer, 'sliderContainer_active')
					that.trail = trail
					that.onVerify(parseInt(blockLeft))
				})
			},
			addClass(tag, className) {
				tag.classList.add(className)
			},
			removeClass(tag, className) {
				tag.classList.remove(className)
			},
			reset() {
				this.DOM.sliderContainer.className = 'sliderContainer'
				this.DOM.slider.style.left = 0
				this.DOM.block.style.left = 0
				this.DOM.sliderMask.style.width = 0
				this.initCodeImg()
			}
		}
	};
</script>
<style type="text/css">
	.block {
		position: absolute;
		left: 0;
		top: 0;
	}
	
	.sliderContainer {
		position: relative;
		text-align: center;
		width: 288px;
		height: 40px;
		line-height: 40px;
		background: #f7f9fa;
		color: #45494c;
		border: 1px solid #e4e7eb;
	}
	
	.sliderContainer_active .slider {
		height: 38px;
		top: -1px;
		border: 1px solid #1991FA;
	}
	
	.sliderContainer_active .sliderMask {
		height: 38px;
		border-width: 1px;
	}
	
	.sliderContainer_success .slider {
		height: 38px;
		top: -1px;
		border: 1px solid #52CCBA;
		background-color: #52CCBA !important;
	}
	
	.sliderContainer_success .sliderMask {
		height: 38px;
		border: 1px solid #52CCBA;
		background-color: #D2F4EF;
	}
	
	.sliderContainer_success .sliderIcon {
		background-position: 0 0 !important;
	}
	
	.sliderContainer_fail .slider {
		height: 38px;
		top: -1px;
		border: 1px solid #f57a7a;
		background-color: #f57a7a !important;
	}
	
	.sliderContainer_fail .sliderMask {
		height: 38px;
		border: 1px solid #f57a7a;
		background-color: #fce1e1;
	}
	
	.sliderContainer_fail .sliderIcon {
		background-position: 0 -83px !important;
	}
	
	.sliderContainer_active .sliderText,
	.sliderContainer_success .sliderText,
	.sliderContainer_fail .sliderText {
		display: none;
	}
	
	.sliderMask {
		position: absolute;
		left: 0;
		top: 0;
		height: 40px;
		border: 0 solid #1991FA;
		background: #D1E9FE;
	}
	
	.slider {
		position: absolute;
		top: 0;
		left: 0;
		width: 40px;
		height: 40px;
		background: #fff;
		box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
		cursor: pointer;
		transition: background .2s linear;
	}
	
	.slider:hover {
		background: #1991FA;
	}
	
	.slider:hover .sliderIcon {
		background-position: 0 -13px;
	}
	
	.sliderIcon {
		position: absolute;
		top: 15px;
		left: 13px;
		width: 14px;
		height: 10px;
		background: url(../assets/xueshan.jpg) 0 -26px;
		background-size: 34px 471px;
	}
	
	.refreshIcon {
		position: absolute;
		right: 0;
		top: 0;
		width: 34px;
		height: 34px;
		cursor: pointer;
		background: url(../assets/xini.jpg) 0 -437px;
		background-size: 34px 471px;
	}
	
	.sliderPanel {
		background-color: #ffffff;
		/* Animation with transition in Safari and Chrome */
		-webkit-transition: all 0.6s ease-in-out;
		/* Animation with transition in Firefox (No supported Yet) */
		-moz-transition: all 0.6s ease-in-out;
		/* Animation with transition in Opera (No supported Yet)*/
		-o-transition: all 0.6s ease-in-out;
		/* The the opacity to 0 to create the fadeOut effect*/
		/*opacity: 0;
		visibility: hidden;*/
		position: absolute;
		/* box shadow effect in Safari and Chrome*/
		-webkit-box-shadow: #272229 2px 2px 10px;
		/* box shadow effect in Firefox*/
		-moz-box-shadow: #272229 2px 2px 10px;
		/* box shadow effect in IE*/
		filter: progid:DXImageTransform.Microsoft.Shadow(color='#272229', Direction=135, Strength=5);
		/* box shadow effect in Browsers that support it, Opera 10.5 pre-alpha release*/
		box-shadow: #272229 2px 2px 10px;
		margin-top: 60px;
		height: 150px;
	}
	.block{
		width: 40px;
		height: 40px;
	}
	.bigImage{
		width: 100%;
	}
	/*.captcha:hover .sliderPanel {
		opacity: 1;
		visibility: visible;
	}*/
</style>