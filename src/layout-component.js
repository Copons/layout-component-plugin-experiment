const { createBlock, registerBlockType } = wp.blocks;
const { dispatch } = wp.data;

registerBlockType('copons/layout-component', {
	title: 'Layout Component Experiment',
	icon: 'layout',
	category: 'layout',
	edit: () => <div className="copons-layout-component">TEST</div>,
	save: () => null,
});

const waitForEditorToLoad = setInterval(function() {
	if (!!document.querySelector('.editor-block-list__layout')) {
		const layoutBlock = createBlock('copons/layout-component');
		dispatch('core/block-editor').insertBlock(layoutBlock, 0);
		clearInterval(waitForEditorToLoad);
	}
}, 100);
