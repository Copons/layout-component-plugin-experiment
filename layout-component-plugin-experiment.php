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
			'copons-blocks',
			plugins_url( 'dist/index.js', __FILE__ ),
			array( 'wp-blocks', 'wp-components', 'wp-compose', 'wp-data', 'wp-element' ),
			filemtime( plugin_dir_path( __FILE__ ) . 'dist/index.js' )
		);

		wp_register_style(
			'copons-blocks-styles',
			plugins_url( 'dist/index.css', __FILE__ ),
			array( 'wp-edit-blocks' ),
			filemtime( plugin_dir_path( __FILE__ ) . 'dist/index.css' )
		);

		/*register_block_type( 'copons/layout-component', [
			'editor_script' => 'copons-blocks',
			'render_callback' => [ $this, 'render_layout_component' ],
		] );*/

		register_block_type( 'copons/page-content', [
			'editor_script' => 'copons-blocks',
			'editor_style' => 'copons-blocks-styles',
			'render_callback' => [ $this, 'render_page_content_block' ],
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

	function render_page_content_block( $attributes ) {
		if ( ! $attributes[ 'pageId' ] ) {
			return '';
		}
		$post = get_post( $attributes[ 'pageId' ] );
		setup_postdata( $post );
		$the_content = get_the_content();
		wp_reset_postdata();
		return $the_content;
	}
}

new Copons_Layout_Component_Experiment();
