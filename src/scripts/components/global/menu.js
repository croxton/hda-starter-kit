/**
 * Main menu
 */

class Menu {

    constructor() {

        const menuButtons = document.querySelectorAll('.c-menu a');
        let self = this;

        // Mark current page with aria-current="page"
        htmx.on('htmx:pushedIntoHistory', (htmxEvent) => {
            self.manageMenuState(menuButtons, String(htmxEvent.detail.path));
        });

        htmx.on('htmx:historyRestore', (htmxEvent) => {
            self.manageMenuState(menuButtons, String(htmxEvent.detail.path));
        });

        // Page swapping - update the menu state
        htmx.on('htmx:beforeSwap', (htmxEvent) => {
            self.manageMenuState(menuButtons, String(htmxEvent.detail.path));
        });

        // initial state
        self.manageMenuState(menuButtons, window.location.href);
    }

    manageMenuState(menuButtons, requestedUrl) {

        const root = location.protocol + '//' + location.host;

        // normalise requested URL
        if (requestedUrl.startsWith('/')) {
            requestedUrl = root + requestedUrl;
        }

        for (let i=0; i < menuButtons.length; i++) {
            let buttonUrl = menuButtons[i].href;
            if (buttonUrl) {
                if (buttonUrl.startsWith('/')) {
                    buttonUrl = root + buttonUrl;
                }
                if (requestedUrl.startsWith(buttonUrl)) {
                    menuButtons[i].setAttribute('aria-current', 'page');
                } else {
                    menuButtons[i].removeAttribute('aria-current');
                }
            }
        }
    }
}

export default Menu;