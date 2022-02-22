<?php

namespace GroovyMenu;


defined( 'ABSPATH' ) || die( 'This script cannot be accessed directly.' );


/**
 * Class StyleStorage. Manage Cache for preset options, Global options and compiled styles.
 */
class StyleStorage {
	/**
	 * Self object instance.
	 *
	 * @var null|object
	 */
	private static $instance = null;


	/**
	 * Disable storage.
	 *
	 * @var array
	 */
	private $disable_storage_flag = false;

	/**
	 * Storage of preset options (configs).
	 *
	 * @var array
	 */
	private $preset_storage_config = array();

	/**
	 * Storage of preset settings.
	 *
	 * @var array
	 */
	private $preset_storage = array();

	/**
	 * Storage of preset settings.
	 *
	 * @var array
	 */
	private $preset_storage_serialize = array();

	/**
	 * Storage of global options (configs).
	 *
	 * @var array
	 */
	private $global_storage_config = array();

	/**
	 * Storage of global settings.
	 *
	 * @var array
	 */
	private $global_storage = array();

	/**
	 * Singleton self instance.
	 *
	 * @return StyleStorage
	 */
	public static function getInstance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	private function __clone() {
	}

	private function __construct() {
	}

	/**
	 * Disable storage flag.
	 *
	 * @return void
	 */
	public function set_disable_storage() {
		$this->disable_storage_flag = true;
	}

	/**
	 * Enable storage flag.
	 *
	 * @return void
	 */
	public function set_enable_storage() {
		$this->disable_storage_flag = false;
	}

	/**
	 * Save preset config.
	 *
	 * @return void
	 */
	public function set_preset_config( $configs ) {
		if ( is_array( $configs ) ) {
			$this->preset_storage_config = $configs;
		}
	}

	/**
	 * Return preset config.
	 *
	 * @return array
	 */
	public function get_preset_config() {
		if ( ! empty( $this->preset_storage_config ) ) {
			return $this->preset_storage_config;
		}

		return array();
	}

	/**
	 * Save global config.
	 *
	 * @return void
	 */
	public function set_global_config( $configs ) {
		if ( is_array( $configs ) ) {
			$this->global_storage_config = $configs;
		}
	}

	/**
	 * Return global config.
	 *
	 * @return array
	 */
	public function get_global_config() {
		if ( ! empty( $this->global_storage_config ) ) {
			return $this->global_storage_config;
		}

		return array();
	}

	/**
	 * Return preset setting by preset id.
	 *
	 * @param string|int $preset_id preset id.
	 *
	 * @return array
	 */
	public function get_preset_settings( $preset_id ) {
		$return_value = null;

		if ( $this->disable_storage_flag ) {
			return $return_value;
		}

		$preset_id = intval( $preset_id );

		if ( isset( $this->preset_storage[ $preset_id ] ) ) {
			$return_value = $this->preset_storage[ $preset_id ];
		}

		return $return_value;
	}

	/**
	 * Save preset setting by preset id.
	 *
	 * @param string|int $preset_id preset id.
	 * @param array      $settings  preset settings.
	 *
	 * @return void
	 */
	public function set_preset_settings( $preset_id, $settings ) {
		$preset_id = intval( $preset_id );

		$this->preset_storage[ $preset_id ] = $settings;
	}

	/**
	 * Return preset setting by preset id in serialize view.
	 *
	 * @param string|int $preset_id  Preset id.
	 * @param bool       $get_all    Get all flag. include secondary options.
	 * @param bool       $camelize   CamelCase flag. Return options name with CamelCase.
	 * @param bool       $get_global Include global options flag.
	 *
	 * @return array|null
	 */
	public function get_preset_settings_serialized( $preset_id, $get_all = false, $camelize = true, $get_global = true ) {
		$return_value = null;

		if ( $this->disable_storage_flag ) {
			return $return_value;
		}

		$preset_id = intval( $preset_id );

		$key  = $get_all ? '1' : '0';
		$key .= $camelize ? '1' : '0';
		$key .= $get_global ? '1' : '0';

		if ( isset( $this->preset_storage_serialize[ $key ] ) && isset( $this->preset_storage_serialize[ $key ][ $preset_id ] ) ) {
			$return_value = $this->preset_storage_serialize[ $key ][ $preset_id ];
		}

		return $return_value;
	}

	/**
	 * Save preset setting by preset id in serialize view.
	 *
	 * @param string|int $preset_id  Preset id.
	 * @param array      $settings   Preset settings.
	 * @param bool       $get_all    Get all flag. include secondary options.
	 * @param bool       $camelize   CamelCase flag. Return options name with CamelCase.
	 * @param bool       $get_global Include global options flag.
	 *
	 * @return void
	 */
	public function set_preset_settings_serialized( $preset_id, $settings, $get_all = false, $camelize = true, $get_global = true ) {
		$preset_id = intval( $preset_id );

		$key  = $get_all ? '1' : '0';
		$key .= $camelize ? '1' : '0';
		$key .= $get_global ? '1' : '0';

		$this->preset_storage_serialize[ $key ][ $preset_id ] = $settings;
	}

	/**
	 * Return global settings.
	 *
	 * @return array
	 */
	public function get_global_settings() {
		return $this->global_storage;
	}

	/**
	 * Save Global settings.
	 *
	 * @param array $settings Global settings array.
	 */
	public function set_global_settings( $settings ) {
		$this->global_storage = $settings;
	}

	/**
	 * Return stored presets list.
	 *
	 * @return array
	 */
	public function get_stored_preset_list() {
		$return_value = array();

		if ( ! empty( $this->preset_storage ) ) {
			foreach ( $this->preset_storage as $index => $item ) {
				$return_value[] = $index;
			}
		}

		return $return_value;
	}

	/**
	 * Clear presets cache.
	 *
	 * @return void
	 */
	public function remove_preset_settings() {
		$this->preset_storage = array();
	}

	/**
	 * Clear global options cache.
	 *
	 * @return void
	 */
	public function remove_global_settings() {
		$this->global_storage = array();
	}

	/**
	 * Return all presets settings array.
	 *
	 * @return array
	 */
	public function get_all_preset_settings() {
		return $this->preset_storage;
	}


}
