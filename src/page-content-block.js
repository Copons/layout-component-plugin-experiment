import classNames from 'classnames';
import { find, get, map } from 'lodash';
const { BlockControls } = wp.blockEditor;
const { registerBlockType } = wp.blocks;
const { IconButton, Placeholder, SelectControl, Toolbar } = wp.components;
const { compose, withState } = wp.compose;
const { withSelect } = wp.data;
const { Fragment } = wp.element;

import './page-content-block.scss';

const edit = compose(
	withSelect(select => ({
		pages: select('core').getEntityRecords('postType', 'page', {
			per_page: -1,
		}),
	})),
	withState({
		isEditing: false,
	})
)(({ attributes, isEditing, pages, setAttributes, setState }) => {
	const { align, selectedPageId } = attributes;

	const selectOptions = [
		{ label: '', value: undefined },
		...map(pages, page => ({
			label: `[${page.id}] ${page.title.rendered}`,
			value: page.id,
		})),
	];

	const toggleEditing = () => setState({ isEditing: !isEditing });

	const onChange = pageId => {
		if (!!pageId) {
			setState({ isEditing: false });
		}
		setAttributes({ selectedPageId: parseInt(pageId, 10) });
	};

	const selectedPage = find(pages, { id: selectedPageId });

	const showToggleButton = !isEditing || !!selectedPageId;
	const showPlaceholder = isEditing || !selectedPageId;
	const showPreview = !isEditing && !!selectedPageId;

	return (
		<Fragment>
			{showToggleButton && (
				<BlockControls>
					<Toolbar>
						<IconButton
							className={classNames(
								'components-icon-button components-toolbar__control',
								{ 'is-active': isEditing }
							)}
							label="Change Preview"
							onClick={toggleEditing}
							icon="edit"
						/>
					</Toolbar>
				</BlockControls>
			)}
			<div
				className={classNames('copons-page-content-block', {
					[`align${align}`]: align,
				})}
			>
				{showPlaceholder && (
					<Placeholder
						icon="layout"
						label="Page Content"
						instructions="Select a page to preview"
					>
						<div className="copons-page-content-block__selector">
							<SelectControl
								onChange={onChange}
								options={selectOptions}
								value={selectedPageId}
							/>
							{!!selectedPageId && (
								<a href={`?post=${selectedPageId}&action=edit`}>Edit Page</a>
							)}
						</div>
					</Placeholder>
				)}
				{showPreview && (
					<div
						className="copons-page-content-block__preview"
						dangerouslySetInnerHTML={{
							__html: get(selectedPage, 'content.rendered'),
						}}
					/>
				)}
			</div>
		</Fragment>
	);
});

registerBlockType('copons/page-content-block', {
	title: 'Page Content Preview',
	icon: 'layout',
	category: 'layout',
	attributes: {
		selectedPageId: { type: 'number' },
	},
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
