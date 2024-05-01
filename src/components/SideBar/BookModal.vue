<template>
	<div class="modal_wrapper">
		<h3 class="modal_title">请选择教材版本</h3>
		<div class="modal_list">
			<ul>
				<li v-for="(version, idx) in props.versionList" :key="idx" @click="() => handleChooseVersion(version)">
					{{ idx + 1 }}. {{ version }}
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
import { defineProps } from 'vue';
import { closeModal } from 'jenesius-vue-modal';
const props = defineProps(['versionList', 'chooseVersion']);

function handleChooseVersion(version) {
	props.chooseVersion(version, 'choose');
	closeModal();
}
</script>

<style scoped>
.modal_wrapper {
	position: relative;
	width: 450px;
	max-height: 600px;
	padding: 30px;
	border-radius: 15px;
	background-color: #fff;
	overflow: hidden;
}

.modal_title {
	position: fixed;
	padding-left: 20px;
	margin: 0;
	font-size: 16px;
	font-weight: bold;
}

.modal_list ul {
	max-height: 600px;
	padding-left: 20px;
	margin: 30px 0 0 0;
	list-style: none;
	font-size: 16px;
	color: #878787;
	overflow-y: auto;
}

.modal_list li {
	padding: 10px 0;
	cursor: pointer;
	border-bottom: 1px solid #bbbaba;
}

.modal_list li:last-child {
	border-bottom: none;
}
</style>