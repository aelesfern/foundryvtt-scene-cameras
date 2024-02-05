import { filter } from 'rxjs';
import { HooksStore } from '../core/hooks.store';
import { LoggerService } from '../core/logger.service';
import { SceneSettingsService } from '../core/scene-settings.service';
import { SCENE_SETTINGS } from '../core/scene-settings.types';

/**
 * Configures module-wide controls available in the tools interface at the left of the screen
 */
export class UiControlsOverride {
	init() {
		LoggerService.log('Registering ModuleControls');
		SceneSettingsService.currentSceneFlags$.subscribe((_flags) => {
			ui.controls?.initialize();
		});
		HooksStore.onGetSceneControlButtons$
			.pipe(filter(() => !!(game as Game).user?.isGM))

			.subscribe((sceneButtons) => {
				const sceneFlags = SceneSettingsService.getAll();
				if (Object.keys(sceneFlags.layouts || {}).length === 0) return;

				const tools: SceneControlTool[] = [];

				for (const [key, value] of Object.entries(sceneFlags.layouts!)) {
					if (value.active) {
						tools.push({
							icon: `fas ${value.icon}`,
							name: value.name || '',
							title: value.name || '',
							onClick: () => SceneSettingsService.set(SCENE_SETTINGS.CURRENT_LAYOUT, key),
						});
					}
				}
				if (tools.length === 0) return;
				// const tools: SceneControlTool[] = [
				// 	{
				// 		icon: 'fas fa-border-all',
				// 		name: 'grid',
				// 		title: 'Cuadricula',
				// 		// toggle: true,
				// 		// active: currentLayout === LAYOUTS.GRID,
				// 		onClick: () => {
				// 			SceneSettingsService.set(SCENE_SETTINGS.CURRENT_LAYOUT, LAYOUTS.GRID);
				// 		},
				// 	},
				// 	{
				// 		icon: 'fas fa-angle-right',
				// 		name: 'all-right',
				// 		title: 'Todo a la derecha',
				// 		// toggle: true,
				// 		// active: currentLayout === LAYOUTS.RIGHT,
				// 		onClick: () => SceneSettingsService.set(SCENE_SETTINGS.CURRENT_LAYOUT, LAYOUTS.RIGHT),
				// 	},
				// 	{
				// 		icon: 'fas fa-angle-left',
				// 		name: 'all-left',
				// 		title: 'Todo a la izquierda',
				// 		// toggle: true,
				// 		// active: currentLayout === LAYOUTS.LEFT,
				// 		onClick: () => SceneSettingsService.set(SCENE_SETTINGS.CURRENT_LAYOUT, LAYOUTS.LEFT),
				// 	},
				// ];
				const controls: SceneControl = {
					activeTool: tools[0].name,
					icon: 'fas fa-video',
					layer: 'controls',
					name: 'scene-cameras',
					title: 'Scene cameras',
					tools: tools,
					visible: true,
				};
				// ui.controls?.render();
				sceneButtons.push(controls);
				LoggerService.log('Updated ModuleControls');
			});
	}
}

export const ModuleControls = new UiControlsOverride();
