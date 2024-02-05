import { first, tap } from 'rxjs';
import { MODULE_ID } from '../core/constants';
import { HooksStore } from '../core/hooks.store';
import { LoggerService } from '../core/logger.service';
import './camera-views.scss';

export class CameraViewsOverride {
	private get game() {
		return game as Game;
	}

	private get cameraViewsElem() {
		return document.getElementById('camera-views');
	}

	init() {
		HooksStore.onRenderCameraViews$.pipe(first()).subscribe(() => this.toggleCamerasPopout());
		HooksStore.onRenderCameraViews$
			.pipe(
				tap(() => LoggerService.log('Overriding <div id="camera-views">')),
				tap(() => this.cameraViewsElem?.classList.add(MODULE_ID)),
				tap(() => this.removeCameraControls()),
				tap(() => LoggerService.log('Overriding <div id="camera-views"> finished'))
			)
			.subscribe();
	}

	/**
	 * Checks webrtc user configuration and sets every camera to be on popout mode
	 */
	private toggleCamerasPopout(popout = true): void {
		LoggerService.log('Module activation changed, updating video cameras', popout);
		if (!this.game.webrtc) throw new Error(`${MODULE_ID} | Can't access Webrtc`);
		const webrtcUsers = this.game.webrtc.settings.users;
		const users = Object.keys(webrtcUsers).map((userID) => ({
			...webrtcUsers[userID],
			id: userID,
		}));
		users.filter((user) => user.popout !== popout).forEach((user) => this.game.webrtc?.settings.set('client', `users.${user.id}.popout`, popout));
		this.game.webrtc.render();
		LoggerService.log('Module activation changed, updating video cameras finished');
	}

	/**
	 * Tries to remove every camera control from the camera views that doesn't fit the module needs
	 * Note: If the camera views are not rendered yet, this method will do nothing
	 */
	private removeCameraControls() {
		const cameraViews = this.cameraViewsElem;
		if (!cameraViews) return;
		cameraViews.querySelectorAll('[data-action="toggle-popout"]').forEach((element) => element.remove());
		cameraViews.querySelectorAll('.window-resizable-handle').forEach((element) => element.remove());
		cameraViews.querySelectorAll('.video-container').forEach((element) => {
			element.classList.remove('draggable');
			element.setAttribute('style', 'pointer-events: none;');
		});
		cameraViews.querySelectorAll('.camera-view-popout').forEach((elem) => elem.removeAttribute('style'));
	}
}
