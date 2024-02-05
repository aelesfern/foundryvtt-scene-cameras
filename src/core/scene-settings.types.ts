import { MODULE_ID } from './constants';

export const SCENE_SETTINGS_FLAG = `${MODULE_ID}-scene-settings`;

export interface SceneSettings {
	/** Activates custom settings for this Scene, overriding Module settings */
	defaultLayout?: string;
	currentLayout?: string;
	layouts?: { [key: string]: LayoutSettings };
}

export type SceneSettingsKey = keyof SceneSettings;

export interface LayoutSettings {
	active?: boolean;
	name?: string;
	icon?: string;
	backgroundImage?: string;
	customBackground?: string;
	customStyles?: string;
	canvasHide?: boolean;
	canvasWidth?: number;
	canvasHeight?: number;
	canvasInset?: string;
}

export enum SCENE_SETTINGS {
	DEFAULT_LAYOUT = 'defaultLayout',
	CURRENT_LAYOUT = 'currentLayout',
	LAYOUTS = 'layouts',
}

export const DefaultLayoutSettings: { [key: string]: LayoutSettings } = {
	0: { active: true, name: 'Layout inicial', icon: 'fa-video' },
	1: { active: false, name: 'Layout 2' },
	2: { active: false, name: 'Layout 3' },
	3: { active: false, name: 'Layout 4' },
	4: { active: false, name: 'Layout 5' },
	5: { active: false, name: 'Layout 6' },
	6: { active: false, name: 'Layout 7' },
	7: { active: false, name: 'Layout 8' },
	8: { active: false, name: 'Layout 9' },
	9: { active: false, name: 'Layout 10' },
};
