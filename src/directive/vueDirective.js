import Vue from 'vue'

// v-allow 自定义权限指令:用来控制每个页面按钮的显隐
const allow = Vue.directive('allow', {
	inserted(el, binding, vnode) {
		el.style.display = 'none';
		let permission = binding.value;
		let flag = isHasPermission(permission);
		if (flag) {
			el.style.display = 'block';
		}
	}
})

// v-drag 自定义拖动指令:用来控制每个div元素的拖拽
const drag = Vue.directive('drag', {
	inserted(el, binding, vnode) {
		el.onmousedown = function(e) {
			el.style.cursor = "move";
			let l = e.clientX - el.offsetLeft;
			let t = e.clientY - el.offsetTop;
			document.onmousemove = function(e2) {
				el.style.left = e2.clientX - l + 'px';
				el.style.top = e2.clientY - t + 'px';
			};
			document.onmouseup = function(e3) {
				document.onmousemove = null;
				document.onmouseup = null;
			};
			return false;
		};
	}
})

export {
	allow,
	drag
}
