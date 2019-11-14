'use strict';

export default function (message) {

    if (NODE_ENV === 'development') {
        console.log(message);
    }

    console.log(`Welcome ${message}`);
}