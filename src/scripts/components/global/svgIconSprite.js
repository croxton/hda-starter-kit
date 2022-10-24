/**
 * SVG Icon Sprite
 *
 * Usage in HTML:
 *
 * Add the data-icons attribute to the body:
 * <body data-icons="PATH_TO_ICON_SPRITE">
 *
 * Use this code to display an icon:
 * (Css is also required to display the icon correctly)
 * <svg><use xlink:href="{{ "#icon-FILENAME" }}"/></svg>
 */

/**
 * Require files for the SVG icon sprite
 */
require.context("icons", true, /\.svg$/);

class SvgIconSprite {

    /**
     * Insert a hidden SVG containing icons at the top of the body
     */
    constructor() {
        this.bodyElement = document.querySelector("body");
        this.bodyAttribute = "data-icons";
        this.iconsPath = this.bodyElement.getAttribute(this.bodyAttribute);

        this.inlineFile(this.iconsPath);
    }

    inlineFile = (iconsPath) => {
        if (!iconsPath) {
            //return console.warn(
            //    `No body attribute of "${this.bodyAttribute}" found for SVG icon sprite`
            //);
            return; // do nothing, already initialised
        }

        const request = new XMLHttpRequest();
        request.open("GET", iconsPath, true);

        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                const svgIcon = request.responseXML.documentElement;
                svgIcon.setAttribute("display", "none");
                svgIcon.setAttribute("aria-hidden", "true");
                svgIcon.setAttribute("class", "hidden");
                this.bodyElement.insertBefore(svgIcon, this.bodyElement.firstChild);
                this.bodyElement.removeAttribute(this.bodyAttribute);
            }
        };

        request.send();
    };
}

export default SvgIconSprite;