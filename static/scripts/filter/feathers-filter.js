import VueFilterUi, { inputs, layouts, parser } from 'vue-filter-ui';
import Vue from 'vue/dist/vue.esm';

Vue.use(VueFilterUi);

const inputTypes = {
	radio: inputs.Radio,
	triSwitch: inputs.TriSwitch,
	toggle: inputs.Toggle,
	select: inputs.Select,
};

const layoutTypes = {
	default: layouts.Default,
	sort: layouts.Sort,
};

Vue.component('feathers-filter', {
	components: {
		VueFilterUi,
	},
	props: {
		filter: {
			type: Array,
			required: true,
		},
		addLabel: {
			type: String,
		},
		applyLabel: {
			type: String,
		},
		cancelLabel: {
			type: String,
		},
		removeLabel: {
			type: String,
		},
	},
	data() {
		this.filter = JSON.parse(this.filter);
		this.filter.forEach((f) => {
			f.layout = layoutTypes[f.layout];
			f.filter.forEach((filter) => {
				filter.input = inputTypes[filter.input];
			});
		});
		return {
			addLabel: this.addLabel,
			applyLabel: this.applyLabel,
			cancelLabel: this.cancelLabel,
			removeLabel: this.removeLabel,
			filter: this.filter,
			parser: parser.FeathersJS,
		};
	},
	template: `<div>
		<vue-filter-ui
			:label-add="addLabel"
			:label-apply="applyLabel"
			:label-cancel="cancelLabel"
			:label-remove="removeLabel"
			:filter="filter"
			:parser="parser"
		/>
	</div>`,
});

new Vue({ // eslint-disable-line no-new
	el: '#vue-filter-ui',
});
