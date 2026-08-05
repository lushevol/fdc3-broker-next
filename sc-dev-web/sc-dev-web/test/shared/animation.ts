export const mockAnimation = () => {
    HTMLElement.prototype.getAnimations = () => [];
    HTMLElement.prototype.animate = () =>
    ({
        cancel() { },
        finish() { },
        onfinish: null,
        play() { },
        pause() { },
        currentTime: 0,
        addEventListener() { },
        removeEventListener() { },
    } as any);
};