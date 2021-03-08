let animationDuration = 1500;
let animationEasing = 'cubicInOut';
export default {
    all: {
        animationDuration,
        animationEasing,
    },
    custom: ({ duration: animationDuration, easing: animationEasing } = {}) => {
        return {
            animationDuration: animationDuration,
            animationEasing: animationEasing,
        }
    }
}