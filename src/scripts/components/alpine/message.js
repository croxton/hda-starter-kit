export default function message(message) {
    return {
        init() {
            this.$root.innerText = message;
        }
    };
}
