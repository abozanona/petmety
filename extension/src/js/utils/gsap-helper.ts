import { gsap } from "gsap";

export class GSAPHelper {
	private static lastAnimation: gsap.core.Tween | undefined;

	public static to(targets: gsap.TweenTarget, vars: gsap.TweenVars): gsap.core.Tween {
		if (this.lastAnimation) {
			this.lastAnimation.kill();
		}
		this.lastAnimation = gsap.to(targets, vars);
		return this.lastAnimation;
	}

	public static killCurrentAnimation() {
		if (this.lastAnimation) {
			this.lastAnimation.kill();
		}
	}
}
