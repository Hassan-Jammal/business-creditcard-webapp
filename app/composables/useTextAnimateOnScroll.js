
import { animate, stagger, text } from 'animejs';

export function useTextAnimateOnScroll(selector = '.animated-text') {
    onMounted(() => {
        const elements = document.querySelectorAll(selector);
        if (!elements.length) return;

        elements.forEach(element => {
            // Split text for this element
            const { chars } = text.split(element, { chars: { wrap: true } });

            // Intersection Observer
            const observer = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            animate(chars, {
                                y: ['75%', '0%'],
                                duration: 750,
                                ease: 'out(3)',
                                delay: stagger(50),
                                loop: false,
                                alternate: true,
                            });

                            observer.unobserve(entry.target); // Stop observing
                        }
                    });
                },
                { threshold: 0.5 } // Trigger when 50% visible
            );

            observer.observe(element);
        });
    });
}
