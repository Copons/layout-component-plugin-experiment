import { find, get, map } from 'lodash';
const { registerBlockType } = wp.blocks;
const { SelectControl } = wp.components;
const { compose, withState } = wp.compose;
const { withSelect } = wp.data;

import './page-content-block.scss';

const edit = compose(
	withSelect(select => ({
		pages: select('core').getEntityRecords('postType', 'page', {
			per_page: -1,
		}),
	})),
	withState({
		selectedPageId: undefined,
	})
)(({ attributes, pages, selectedPageId, setState }) => {
	const selectOptions = [
		{ label: '', value: undefined },
		...map(pages, page => ({
			label: `[${page.id}] ${page.title.rendered}`,
			value: page.id,
		})),
	];

	const onChange = pageId => setState({ selectedPageId: parseInt(pageId, 10) });

	const selectedPage = find(pages, { id: selectedPageId });

	const className = `copons-page-content-block${
		attributes.align ? ` align${attributes.align}` : ''
	}`;

	return (
		<div className={className}>
			<SelectControl
				label="Select a page to preview:"
				onChange={onChange}
				options={selectOptions}
			/>
			<div
				className="copons-page-content-block__selected-page"
				dangerouslySetInnerHTML={{
					__html: get(selectedPage, 'content.rendered'),
				}}
			/>
		</div>
	);
});

registerBlockType('copons/page-content-block', {
	title: 'Page Content Preview',
	icon: 'layout',
	category: 'layout',
	supports: {
		align: ['wide', 'full'],
		anchor: true,
		html: false,
		multiple: false,
		reusable: false,
	},
	edit,
	save: () => null,
});
