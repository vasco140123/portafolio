declare module "vanilla-tilt" {
  interface VanillaTiltOptions {
    max?: number;
    speed?: number;
    glare?: boolean;
    "max-glare"?: number;
    scale?: number;
  }

  export default class VanillaTilt {
    static init(
      element: HTMLElement | NodeListOf<HTMLElement>,
      options?: VanillaTiltOptions,
    ): void;
  }
}
