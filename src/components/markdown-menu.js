import React, {Component} from "react";
import MDEditor from '@uiw/react-md-editor';

export default class MarkdownMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            source: ''
        }
    }

    onMenuClick(path) {
        if (this.props.onMenuClick) {
            this.props.onMenuClick(path);
        }
    }

    componentDidUpdate() {
        let elements = document.getElementsByTagName('a');
        let self = this;
        for (let i in elements) {
            let element = elements[i];
            let href = element.href;
            if (typeof (href) == 'string' && href.indexOf('/bars/') !== -1) {
                element.href = "javascript:;";
                let path = href.split('/bars/')[1];
                element.setAttribute('id', path);
                element.setAttribute('md', path);
                element.onclick = function () {
                    self.onMenuClick(element.getAttribute('md'));
                }
            }
        }
    }

    render() {
        return (
            <div>
                <MDEditor.Markdown
                    source={this.props.source ? this.props.source : this.state.source}/>
            </div>
        );
    }
}
