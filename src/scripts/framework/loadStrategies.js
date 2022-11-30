/**
 * Loading strategies
 */

import * as strategies from '../strategies/index.js';

export function loadStrategies(strategy, selector) {

    let promises = [];

    // custom import strategies
    if (strategy) {

        // support multiple strategies separated by pipes
        // e.g. "idle | visible | media (min-width: 1024px)"
        let requirements = strategy
            .split('|')
            .map(requirement => requirement.trim())
            .filter(requirement => requirement !== 'immediate')
            .filter(requirement => requirement !== 'eager');

        for (let requirement of requirements) {

            // event listener, pass the event inside parentheses
            // e.g."event (htmx:afterSettle)"
            if (requirement.startsWith('event')) {
                promises.push(
                    strategies.event(requirement)
                );
                continue;
            }

            // idle using requestIdleCallback
            if (requirement === 'idle') {
                promises.push(
                    strategies.idle()
                );
                continue;
            }

            // media query, pass the rule inside parentheses
            // e.g."media (only screen and (min-width:768px))"
            if (requirement.startsWith('media')) {
                promises.push(
                    strategies.media(requirement)
                );
                continue;
            }

            // PubSub subscription, pass the topic inside parentheses
            // e.g."subscribe (video.play)"
            if (requirement.startsWith('subscribe')) {
                promises.push(
                    strategies.subscribe(requirement)
                );
                continue;
            }

            // visible using intersectionObserver, optionally pass the
            // root margins of the observed element inside parentheses
            // e.g."visible (0px 0px 0px 0px)"
            if (requirement.startsWith('visible')) {
                promises.push(
                    strategies.visible(selector, requirement)
                );
            }
        }
    }

    return promises;
}