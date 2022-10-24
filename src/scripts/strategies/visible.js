const visible = (selector=null, requirement) => {
    if (selector) {
        return new Promise(resolve => {
            // work out if a rootMargin has been specified, and if so take it from the requirement
            let rootMargin = '0px 0px 0px 0px';
            if (requirement.indexOf('(') !== -1) {
                const rootMarginStart = requirement.indexOf('(') + 1;
                rootMargin = requirement.slice(rootMarginStart, -1);
            }

            const observer = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    observer.disconnect();
                    resolve();
                }
            }, { rootMargin });

            // observe element
            let elm = document.querySelector(selector);
            if (elm) {
                observer.observe(elm);
            } else {
                resolve(); // no element matched, resolve immediately
            }
        });
    } else {
        // no element to observe so resolve immediately
        return Promise.resolve(true);
    }
};

export default visible;