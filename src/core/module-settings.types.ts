/**
 * Representation of the object stored with all the settings of the game for this module.
 *
 * Name of the properties MUST match MODULE_SETTINGS enum values
 */
export interface ModuleSettings {
	active: boolean;
	gridLayoutSettings: ModuleLayoutSettings;
	leftLayoutSettings: ModuleLayoutSettings;
	rightLayoutSettings: ModuleLayoutSettings;
}

export type ModuleSettingsKey = keyof ModuleSettings;

/**
 * Keys of the settings of the game for this module, to ease access to them
 *
 * Values MUST match ModuleSettings propertie names
 */
export enum MODULE_SETTINGS {
	ACTIVE = 'active',
	GRID_LAYOUT_SETTINGS = 'gridLayoutSettings',
	LEFT_LAYOUT_SETTINGS = 'leftLayoutSettings',
	RIGHT_LAYOUT_SETTINGS = 'rightLayoutSettings',
}

export interface ModuleLayoutSettings {
	backgroundImage: string;
	customCSS: string;
}
