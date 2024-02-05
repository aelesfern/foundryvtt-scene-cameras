import { ReplaySubject } from 'rxjs';

class HooksStoreClass {
	private _onInit$ = new ReplaySubject<void>(1);
	private _onReady$ = new ReplaySubject<void>(1);
	private _onRenderCameraViews$ = new ReplaySubject<void>(1);
	private _renderSceneNavigation$ = new ReplaySubject<void>(1);
	private _renderSceneConfig$ = new ReplaySubject<{ sceneConfig: SceneConfig; html: JQuery<HTMLElement>; scene: { document: Scene } }>(1);
	private _getSceneControlButtons$ = new ReplaySubject<SceneControl[]>(1);
	private _onRenderSceneControls$ = new ReplaySubject<SceneControls>(1);

	onInit$ = this._onInit$.asObservable();
	onReady$ = this._onReady$.asObservable();
	onRenderCameraViews$ = this._onRenderCameraViews$.asObservable();
	onRenderSceneNavigation$ = this._renderSceneNavigation$.asObservable();
	onRenderSceneConfig$ = this._renderSceneConfig$.asObservable();
	onGetSceneControlButtons$ = this._getSceneControlButtons$.asObservable();
	onRenderSceneControls$ = this._onRenderSceneControls$.asObservable();

	constructor() {
		Hooks.on('init', () => this._onInit$.next());
		Hooks.on('ready', () => this._onReady$.next());
		Hooks.on('renderCameraViews', () => this._onRenderCameraViews$.next());
		Hooks.on('renderSceneNavigation', () => this._renderSceneNavigation$.next());
		Hooks.on('renderSceneConfig', (sceneConfig: any, html: any, scene: any) => this._renderSceneConfig$.next({ sceneConfig, html, scene }));
		Hooks.on('getSceneControlButtons', (sceneButtons) => this._getSceneControlButtons$.next(sceneButtons));
		Hooks.on('renderSceneControls', (sceneControls: SceneControls) => this._onRenderSceneControls$.next(sceneControls));
	}
}

export const HooksStore = new HooksStoreClass();
