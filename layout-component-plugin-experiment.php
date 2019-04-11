<?php
/**
 * Plugin Name: Layout Component Experiment
 */

class Copons_Layout_Component_Experiment {
	function __construct() {
		add_action( 'init', [ $this, 'register_blocks' ], 100 );
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
}

new Copons_Layout_Component_Experiment();
