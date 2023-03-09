import BaseComponent from '../../framework/baseComponent';

export default class Share extends BaseComponent {

    shares = null;

    constructor() {
        super();
        this.mount();
    }

    mount() {
        this.shares = document.querySelectorAll(`[data-share]`);
        this.shares.forEach(element => {

            // we need to remove any DOM changes if the page was restored from history cache
            element.innerHTML = '';

            // setup sharing
            this.share(element);
        });
    }

    share(element) {
        const canShare = 'share' in window.navigator;
        const isTouchDevice ='ontouchstart' in window; // only detects modern touch devices
        const useShareApi = canShare && isTouchDevice;
        const options = element.dataset.share.split(' ');
        const shareIndex = options.findIndex(option => { return option === 'device' });
        const shareData = {
            facebook: { url: 'https://www.facebook.com/share.php?u=' },
            linkedin: { url: 'https://www.linkedin.com/sharing/share-offsite/?url=' },
            twitter: { url: 'https://www.twitter.com/share?url=' }
        }

        if (shareIndex > -1 && !useShareApi) {
            options.splice(shareIndex, 1);
        }

        if (shareIndex > -1 && useShareApi) {
            const shareButton = this.h('button', {
                'aria-label': `${element.dataset.shareDevice}`,
                'data-share-item': ''
            }, [this.h('i')]);
            shareButton.addEventListener('click', () => {
                navigator.share({
                    title: document.title,
                    url: element.dataset.shareUrl
                }).catch(() => { return });
            })
            element.appendChild(shareButton);
        } else {
            options.forEach(option => {
                const shareLink = this.h('a', {
                    'aria-label': `${element.dataset.shareLabel} ${option}`,
                    'data-share-item': option,
                    href: shareData[option].url + encodeURIComponent(element.dataset.shareUrl),
                    rel: 'noopener noreferrer',
                    target: '_blank'
                }, [this.h('i')])
                element.appendChild(shareLink);
            })
        }
    }

    h(type, attributes, children = []) {

        const element = document.createElement(type);

        for (let key in attributes) {
            element.setAttribute(key, attributes[key]);
        }

        if (children.length) {
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else {
                    element.appendChild(child);
                }
            });
        }
        return element;
    }

    unmount() {
        if (this.mounted) {

            // cleanup
            this.shares.forEach(element => {
                // remove buttons and their event listeners
                element.innerHTML = '';
            });
            this.shares = null;

            // remove component reference
            this.ref = null;
        }
    }

}