import PubSub from 'pubsub-js';
const subscribe = (requirement) => {
    return new Promise(resolve => {
        // get out the topic provided
        let topic;
        if (requirement.indexOf('(') !== -1) {
            const topicStart = requirement.indexOf('(') + 1;
            topic = requirement.slice(topicStart, -1);
        }
        if (topic) {
            let subscriber = PubSub.subscribe(topic, () => {
                PubSub.unsubscribe(subscriber);
                resolve();
            });
        } else {
            resolve(); // no topic provided, resolve immediately
        }
    });
};

export default subscribe;