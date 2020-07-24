import React from "react";

export default class ScrollToTopOnMount extends React.Component {
    componentDidMount() {
        document.body.scrollTo(0, 0);
    }

    render() {
        return null;
    }
}
