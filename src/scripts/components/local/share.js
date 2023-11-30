import BaseComponent from '../../framework/baseComponent';

export default class Share extends BaseComponent {

    shareMount;

    constructor(elm) {
        super(elm);
        this.mount();
    }

    mount() {

        this.shareMount = document.querySelector(this.elm);

        // default options
        this.options = {
            "share"  : [
                "device",
                "linkedin",
                "facebook",
                "twitter",
                "email",
                "copy"
            ],
            "title"  : "My page",
            "label"  : "Share on",
            "device" : "Share using device sharing",
            "url"    : "#"
        };

        // we need to remove any DOM changes if the page was restored from history cache
        this.shareMount.innerHTML = '';

        // setup sharing
        this.share(this.shareMount);
    }

    share(element) {
        const canShare = 'share' in window.navigator;
        const canCopy = 'clipboard' in window.navigator;
        const isTouchDevice ='ontouchstart' in window; // only detects modern touch devices
        const useShareApi = canShare && isTouchDevice;
        const shareIndex = this.options.share.findIndex(option => { return option === 'device' });
        const shareData = {
            facebook: { url: 'https://www.facebook.com/share.php?u=' },
            linkedin: { url: 'https://www.linkedin.com/sharing/share-offsite/?url=' },
            twitter: { url: 'https://www.twitter.com/intent/tweet?url=' },
            email: { url: 'mailto:?subject='+encodeURIComponent(this.options.title)+'&body=' },
            copy: { url: '#' }
        }

        if (shareIndex > -1 && !useShareApi) {
            this.options.share.splice(shareIndex, 1);
        }

        if (shareIndex > -1 && useShareApi) {
            const shareButton = this.h('button', {
                'aria-label': `${this.options.device}`,
                'data-share-item': ''
            }, [this.h('i')]);
            shareButton.addEventListener('click', () => {
                navigator.share({
                    title: document.title,
                    url: this.options.url
                }).catch(() => { return });
            })
            element.appendChild(shareButton);
        } else {
            this.options.share.forEach(option => {

                let shareLink;

                if (option === 'copy') {
                    if (canCopy) {
                        shareLink = this.h('button', {
                            'aria-label': 'Copy link',
                            'data-share-item': option,
                        }, [this.h('i')]);
                        shareLink.addEventListener('click', () => {
                            navigator.clipboard.writeText(this.options.url).then();
                            shareLink.setAttribute('data-share-item', 'copied');
                            setTimeout(() => {
                                shareLink.setAttribute('data-share-item', option);
                            }, 1000);
                        });
                    }
                } else {
                    shareLink = this.h('a', {
                        'aria-label': `${this.options.label} ${option}`,
                        'data-share-item': option,
                        href: shareData[option].url + encodeURIComponent(this.options.url),
                        rel: 'noopener noreferrer',
                        target: '_blank'
                    }, [this.h('i')]);
                }

                if (shareLink) {
                    let shareLi = this.h('li');
                    shareLi.appendChild(shareLink);
                    element.appendChild(shareLi);
                }

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
            // remove markup and event listeners
            this.shareMount.innerHTML = '';
            this.shareMount.clearEventListeners();
            this.shareMount = null;
        }
    }
}