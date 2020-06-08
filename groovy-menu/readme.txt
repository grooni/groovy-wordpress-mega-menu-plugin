=== Groovy Menu Plugin (Free) ===
Contributors: Grooni
Tags: mega menu, megamenu, navigation, mobile menu, drop down, menu, responsive, responsive menu, sticky menu, vertical menu, horizontal menu, ajax cart
Requires at least: 4.9.7
Tested up to: 5.4.1
Requires PHP: 7.0
Stable tag: 1.2.0
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.en.html

Groovy Menu is a Free responsive Mega Menu plugin that will allow you easily to add an awesome menu on your site and improve website navigation.

== Description ==
[Mega Menu Pro](https://codecanyon.net/item/groovy-menu-wordpress-mega-menu-plugin/23049456) | [Demo](https://groovymenu.grooni.com/) | [Documentation](https://grooni.com/docs/groovy-menu/) | [Video tutorials](https://www.youtube.com/channel/UCpbGGAUnqSLwCAoNgm5uAKg)

Groovy Menu is a responsive and free [Mega Menu WordPress plugin](https://groovymenu.grooni.com/) that will allow you easily to add an awesome menu on your site and improve website navigation. Is an easy to customize, just need to upload your logo and fit your own colors, fonts and sizes.
https://youtu.be/w1SIBwMdfn8
View more video tutorials: [Mega Menu Tutorials](https://www.youtube.com/channel/UCpbGGAUnqSLwCAoNgm5uAKg)

= Features =
* Mega Menu
* Vertical menu
* One-page menu
* Dropdown menu
* Submenu
* Toolbar menu
* Ajax Cart
* [WooCommerce Mega menu](https://groovymenu.grooni.com/shop/)
* Responsive menu
* Fullwidth mega menu
* Mobile menu
* RTL Support
* WPML Ready
* Multi-level menu support
* Smooth scroll
* GDPR Compliance
* Preview mode
* 2 hover types
* 1 desktop logo + 1 mobile logo
* Automatic and manual integration
* No coding skills needed
* Easy to customize

= Premium Features =
* Megamenu
* Mega menu blocks - that allow adding rich content into the mega menu. Compatibility with best popular page builders as Elementor,
WPBakery (Visual Composer), Beaver Builder, Gutenberg
* Many header layouts
* Online preset library with pre-made presets
* Vertical menu
* Icon menu
* Sticky menu
* Fixed menu
* Off-canvas navigation
* Hamburger menu
* Submenu
* Sidebar menu
* Custom menu badges (icon, text, image)
* User roles with user role plugins
* Set specific menu for the taxonomies
* Premium Support
* Theme Developers features
* [Elementor Mega Menu](https://groovymenu.grooni.com/standard-wordpress-menu-plugin/)
* WPBakery Mega Menu
* Mega menu for Visual Composer
Get max from your site menu with the Groovy Mega Menu PRO for WP.
= Plugin compatibility =
WooCommerce, WPBakery, Elementor, SiteOrigin, Beaver Builder, WPML,
Gutenberg, Elementor PRO

== Installation ==
1. Upload \"groovy-menu.zip\" to the \"/wp-content/plugins/\" directory.
2. Activate the plugin through the \"Plugins\" menu in WordPress.
3. Enable automatic integration from the WordPress admin page > Groovy menu > Integration

== Frequently Asked Questions ==
= How to integrate? =
Groovy menu can be integrated both manually and automatically. The automatic integration is the easiest and in most
cases the working way to implement Groovy Menu on your website. The principle of autointegration is that the Groovy Menu
 plugin will be displayed immediately after the opening HTML tag “body”. [Read more](https://grooni.com/docs/groovy-menu/integration/automatic-integration/)

= How to upload logo? =
Please read [this](https://grooni.com/docs/groovy-menu/global-settings-2/logo-settings/) article.

== Additional Info ==
The source code of the plugin can be found at [GitHub](https://github.com/grooni/groovy-wordpress-mega-menu-plugin)

== Screenshots ==
1. Classic dropdown menu.
2. Dashboard.
3. Global settings.
4. Preset options.
5. Mega menu with menu blocks.

== Changelog ==

= 1.2.0 =
* Improve: Для редактирования пунктов навигационного меню добавлена кнопка с модальным окном, содержащим настройки. Сохранение настроек происходит по AJAX и не требует сохранения всего меню. Предотвращает проблемы с низкими значениями PHP max_input_vars на хостинге сайта.
* Improve: Added the ability to disable the mobile menu.
* Improve: Added module for Divi Theme Builder.
* Improve: Design of integration section.
* Improve: Added the possibility to set different logo URLs for WPML.
* Fix: Increased priority of the handler of admin nav_menu in WP Dashboard -> Appearance -> Menus. This eliminates conflicts with some plugins.
* Fix: Added the possibility to hide Groovy menu layout from not public post types. Managed in Global setting -> Tools -> Enable displaying the Groovy menu layout into Menu blocks post type.
* Fix: Resolved conflict сaused by Сomposer autoload (dependency manager for PHP) with some other plugins in some cases.
* Fix: Removed the menu overlapping on content during page editing in Elementor with the "Enable Groovy menu to overlap the first block in the page" option enabled.
* Fix: Added compatibility with Avada theme through automatic integration.
* Fix: Anchors highlight for centered menu style.

= 1.1.12 =
* Fix: Fixed bug with sub-menu icon.

= 1.1.11 =
* Fix: Fixed fonts issue that appears while editing a preset and displaying a previously saved font in some cases.
* Fix: Hide title by "-" symbol.
* Fix: Improved work with caching plugins. A case with multiple saving preset styles has been fixed.
* Fix: Auto integration will be applied only once on the page, immediately after the HTML tag <BODY>.
* Improve: Additional characters are allowed in the rename a preset name

= 1.1.10 =
* Fix: Fixed fit on the screen of search icons and mini-cart for iOS.
* Fix: Preset preview fix.

= 1.1.9 =
* Fix: Fixed php notice: "Undefined variable isCustom".

= 1.1.8 =
* Improve: Added setting for choosing background color to search screen in fullscreen mode.
* Fix: The search query now is considering the language setting, with installed and active the multilanguage WPML plugin.
* Fix: "Global settings" button not working on the "Integration" section.
* Fix: Bug with assignment and deleting presets of the menu.
* Fix: Bug with RTL issue.

= 1.1.7 =
* Fix: Fixed a bug when the option "Top level links with align center must considering logo width" has been ignored.
* Fix: Text size for social icons in the toolbar now also depends on the preset option "Toolbar social icon size".
* Fix: Fixed a bug when Woocommerce mini-cart aren't displayed in the mobile version.

= 1.1.6 =
* Fix: Fixed minimalistic menu bug with centered logo.

= 1.1.5 =
* Fix: Fixed text color for active top-level menu item.
* Fix: Mega menu wrapper padding.
* Add: Added a smooth transition between dropdowns of the 3rd level.

= 1.1.4 =
* Fix: Issue with minimalistic menu type.
* Fix: Styles for Woocommerce mini-cart.
* Fix: Issue with preview mode.
* Add: Created a separate stylesheet for RTL. Increased performance during transition from LTR to RTL and back.

= 1.1.3 =
* Fix: Mobile menu button click issue after window resize.
* Fix: Some preset editor style fixes.
* Fix: Fixed display of WP AdminBar in cases when Groovy Menu Z-index is set more than WP AdminBar.
* Add: Added styles for menu items without a link (with an empty URL).
* Add: An animation that shows the process of saving a preset.

= 1.1.2 =
* Fix: Save preset defaults when value is 0.
* Fix: RTL support.
* Fix: The multilevel menu for the mega menu will be displayed as a flat list with indentation.

= 1.1.1 =
* Fix: Error when used location for the integration.

= 1.1.0 =
* Fix: Error in determining preset ID in some cases of manual integration. This error affected the possibility to show the dropdown menu.
* Fix: Improved compatibility of created presets in the free version with the premium version of the plugin.
* Fix: Fixed display of multi-level menus that did not fit the width of the screen.
* Fix: Logo centering when a search and a WooCommerce mini-cart were simultaneously displayed in a menu block.
* Fix: Added some minor fixes from the previous premium version 1.8.x and 1.9.x.
* Add: Added CSS setting for z-index in the presets settings
* Add: Added the ability to display another navigation menu for the mobile version.
* Add: New Actions that can be called immediately above menu, under the menu, and after the menu layout.
* Fix: Minor CSS changes have been made to fix the appearance of the text at the social links.
* Fix: Bug with the cutting the Logotype appearance in the Global settings
* Add: The ability to disable the internal pre-cache for presets.
* Improve: Added reset styles feature for better compatibility with different themes.
* Improve: Implemented cache for displaying and processing nav_menu items.
* Improve: Removed files that were added to support older versions of the plugin.
* Improve: The minimum value for the setting "Mobile version switch" is can set to 0 for disabling the appearance of the menu on mobile devices.
* Improve: Minor appearance changes for the Dashboard> Appearance> Menus page
* Updated: NPM modules.

= 1.0.9 =
* Add: Added an option "General" > "Submenu" > "Show Mega Menu titles as regular menu items" to the preset settings. Which will allow you to display the links and badges for Mega Menu titles.
* Add: Integration into the "Theme Locations"
* Fix: Now the output of echo when the Actions from Header.php are working will be displayed in the markup location match to the action.
* Add: Added 4 new actions for working in the toolbar.

= 1.0.8 =
* Fix: check empty nav_menu list when get Global settings translations.

= 1.0.7 =
* Add: ru_RU language
* Fix: Fixed an error that did not allow translating phrases in the Global settings.

= 1.0.6 =
* Fix: Cancels the display of the menu in maintenance mode when auto-integration is enabled.
* Fix: Prevent conflict with cornerstone plugin.
* Fix: Anchor tracking for one page scrolls now works with any id.
* Fix: Output buffer conflict with some plugins.
* Fix: Overlay submenu of submenu with multi level dropdowns.
* Fix: Social icon link text font size.
* Add: Option for preset: social icon link text hide on mobile.
* Add: Target and rel options for social links.
* Add: New social icons default font pack.
* Add: The ability to display custom text in the social media link.
* Add: Preset option: Top level links with align center must considering logo width.

= 1.0.5 =
* Fix: Added an additional check on errors when getting the Groovy Menu metadata on WooCommerce product pages.

= 1.0.4 =
* Updated: plugin Welcome page.

= 1.0.3 =
* Fix: dropdown menu not closing while hovering on simple menu links.

= 1.0.1 =
* Initial release.
