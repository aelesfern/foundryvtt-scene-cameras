import { merge, throttleTime } from 'rxjs';
import { HooksStore } from '../core/hooks.store';
import { SceneSettingsService } from '../core/scene-settings.service';

export class CanvasOverride {
	init() {
		merge(HooksStore.onRenderSceneNavigation$, SceneSettingsService.currentSceneFlags$)
			.pipe(throttleTime(100))
			.subscribe(() => this.repositionCanvas());
	}

	private repositionCanvas() {
		canvas?.app?.view.style.setProperty('display', 'block');
		const { layouts, currentLayout } = SceneSettingsService.getAll();
		const layout = layouts?.[currentLayout || ''];
		if (!layout || !layout.active) return;
		const { canvasHide, canvasWidth, canvasHeight, canvasInset } = layout;
		if (canvasHide) {
			canvas?.app?.view.style.setProperty('display', 'none');
			return;
		}
		if (canvasWidth && canvasHeight) {
			// TODO: Para hacer esto por porcentaje, tendría que calcularse ya que el resize no lo soporta
			canvas?.app?.renderer.resize(canvasWidth, canvasHeight);
		}
		canvas?.app?.view.style.setProperty('inset', canvasInset || '');
	}
}
