import { ReplaySubject, distinctUntilChanged, map } from 'rxjs';
import { MODULE_ID } from './constants';
import { LayoutSettings, SCENE_SETTINGS, SceneSettings, SceneSettingsKey } from './scene-settings.types';

class SceneSettingsServiceClass {
	private get game(): Game {
		return game as Game;
	}

	private _currentSceneFlags$ = new ReplaySubject<SceneSettings>(1);
	currentSceneFlags$ = this._currentSceneFlags$.asObservable().pipe(distinctUntilChanged());
	currentLayout$ = this.currentSceneFlags$.pipe(
		map((flags) => flags.currentLayout),
		distinctUntilChanged()
	);

	constructor() {
		/** Actualizar la configuración de la escena activa cuando se cambia la config o se cambia de escena */
		Hooks.on('renderSceneNavigation', () => this.refreshSettings());
	}

	get<T extends SceneSettingsKey>(key: T, sceneID?: string): SceneSettings[T] | undefined {
		const scene = sceneID ? this.game.scenes?.get(sceneID) : this.game.scenes?.current;
		return (scene?.getFlag(MODULE_ID, key) as SceneSettings[T]) || undefined;
	}

	getAll(sceneID?: string): SceneSettings {
		return {
			currentLayout: this.get(SCENE_SETTINGS.CURRENT_LAYOUT, sceneID),
			defaultLayout: this.get(SCENE_SETTINGS.DEFAULT_LAYOUT, sceneID),
			layouts: this.get(SCENE_SETTINGS.LAYOUTS, sceneID),
		};
	}

	getCurrentLayout(sceneID?: string): LayoutSettings | undefined {
		const layouts = this.get(SCENE_SETTINGS.LAYOUTS, sceneID);
		const currentLayout = this.get(SCENE_SETTINGS.CURRENT_LAYOUT, sceneID);
		return layouts?.[currentLayout || ''] || undefined;
	}

	async set<T extends SceneSettingsKey>(key: T, value: SceneSettings[T], sceneID?: string): Promise<StoredDocument<Scene> | undefined> {
		const scene = sceneID ? this.game.scenes?.get(sceneID) : this.game.scenes?.current;
		return scene?.setFlag(MODULE_ID, key, value);
	}

	private refreshSettings(): void {
		if (!!this.game.scenes?.current) this._currentSceneFlags$.next(this.getAll());
	}
}

export const SceneSettingsService = new SceneSettingsServiceClass();
