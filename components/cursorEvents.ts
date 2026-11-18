export const cursorHoverEvent = "jyotii-cursor-hover";

export type CursorHoverDetail = {
  active: boolean;
  label?: string;
};

export function setCursorHover(active: boolean, label?: string) {
  window.dispatchEvent(
    new CustomEvent<CursorHoverDetail>(cursorHoverEvent, {
      detail: { active, label },
    }),
  );
}