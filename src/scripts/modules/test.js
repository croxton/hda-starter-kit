// say
function say(message) {
    let $container = $("#test-jquery");
    let originalMessage = $container.text();
    $container.text(originalMessage + message);
}

export { say };