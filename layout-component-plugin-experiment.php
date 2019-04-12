<?php
/**
 * Plugin Name: Layout Component Experiment
 */

class Copons_Layout_Component_Experiment {

	function __construct() {
		add_action( 'init', [ $this, 'register_blocks' ], 100 );

		add_filter( 'default_content', [ $this, 'add_layout_components' ] );
		//add_filter( 'edit_post_content_filtered', [ $this, 'add_layout_components' ], 10, 2 );
		add_filter( 'content_save_pre', [ $this, 'remove_layout_components' ] );
	}

	function register_blocks() {
		wp_register_script(
			'copons-layout-component',
			plugins_url( 'dist/index.js', __FILE__ ),
			array( 'wp-blocks', 'wp-data', 'wp-element' )
		);

		register_block_type( 'copons/layout-component', [
			'editor_script' => 'copons-layout-component',
			'render_callback' => [ $this, 'render_layout_component' ],
		] );
	}

	function render_layout_component() {
		$title = get_bloginfo( 'name' );
		$description = get_bloginfo( 'description' );
		ob_start();
		?>
			<header class="copons-layout-component">
				<h1><?php echo $title; ?></h1>
				<h2><?php echo $description; ?></h2>
			</header>
		<?php
		return ob_get_clean();
	}

	function add_layout_components( $content ) {
		return '<!-- wp:copons/layout-component /-->';
	}

	function remove_layout_components( $content ) {
		error_log( $content );
		return str_replace( '<!-- wp:copons/layout-component /-->', '', $content );
	}
}

new Copons_Layout_Component_Experiment();
