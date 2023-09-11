<template>
	<div id="headerId">
		<div class="header-title-class">
			<!-- <img src="image/header/logo.png" class="header-logo" /> -->
			<span class="icon icon-diqiu myicon"></span>
			<span class="header-text">数字地球</span>
		</div>
		<div class="header-time">
			<span>{{currentTime}}</span>
		</div>
	</div>
</template>


<script>
	export default {
		name: 'HeaderComp',
		data() {
			return {
				currentTime: ''
			}
		},
		mounted() {
			setInterval(() => {
				this.currentTime = this.getTime();
			}, 1000);
		},
		methods: {
			getTime() {
				let now = new Date();
				let month = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1);
				let day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
				let hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
				let minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
				let second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
				return now.getFullYear() + '/' + month + '/' + day + " " + hour + ':' + minute + ':' + second;
			},
		}
	}
</script>


<style scoped="true">
	#headerId {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 60px;
		z-index: 100;
		color: #FFF;
		background-color: #11171db3;
		border-bottom: 1px solid #4897c5;
		user-select: none;
		display: flex;
		justify-content: end;
	}

	.header-title-class {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.header-logo {
		width: 50px;
		height: 50px;
		margin-right: 20px;
	}

	.header-text {
		font-weight: 500;
		letter-spacing: 80px;
		font-size: 38px;
		color: #4897c5;
	}

	.header-time {
		color: #ffffff;
		align-items: center;
		width: 40%;
		justify-content: flex-start;
		display: flex;
		font-size: 30px;
	}

	.myicon {
		color: #1a8bed;
		font-size: 40px;
		font-weight: 500;
		margin-right: 20px;
	}
</style>
