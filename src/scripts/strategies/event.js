const event = (requirement) => {
    return new Promise(resolve => {
        // get the topic provided
        let topic;
        if (requirement.indexOf('(') !== -1) {
            const topicStart = requirement.indexOf('(') + 1;
            topic = requirement.slice(topicStart, -1);
        }
        if (topic) {
            document.body.addEventListener(topic, () => {
                resolve();
            }, { once: true });
        } else {
            resolve(); // no topic provided, resolve immediately
        }
    });
};

export default event;