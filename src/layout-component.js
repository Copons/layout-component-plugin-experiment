const { registerBlockType } = wp.blocks;

registerBlockType('copons/layout-component', {
	title: 'Layout Component Experiment',
	icon: 'layout',
	category: 'layout',
	edit: () => <div className="copons-layout-component">TEST</div>,
	save: () => null,
});
