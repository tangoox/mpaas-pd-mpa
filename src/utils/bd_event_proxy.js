'use strict';
const bdEventProxy = {
    onObj: {},
    oneObj: {},
    on: function (key, view, fn) {
        if (this.onObj[key] === undefined) {
            this.onObj[key] = [];
        }

        if (view !== null && view !== undefined) {
            fn.view = view;
        }

        this.onObj[key].push(fn);
    },
    one: function (key, view, fn) {
        if (this.oneObj[key] === undefined) {
            this.oneObj[key] = [];
        }

        if (view !== null && view !== undefined) {
            fn.view = view;
        }

        this.oneObj[key].push(fn);
    },
    off: function (key, view) {
        if (view !== null && view !== undefined) {
            if (this.onObj[key] !== null && this.onObj[key] !== undefined) {
                for (let i = this.onObj[key].length - 1; i >= 0; i--) {
                    if (this.onObj[key][i].view === view) {
                        this.onObj[key].splice(i, 1);
                    }
                }
            }
            if (this.oneObj[key] !== null && this.oneObj[key] !== undefined) {
                for (let i = this.oneObj[key].length - 1; i >= 0; i--) {
                    if (this.oneObj[key][i].view === view) {
                        this.oneObj[key].splice(i, 1);
                    }
                }
            }
        } else {
            this.onObj[key] = [];
            this.oneObj[key] = [];
        }
    },
    trigger: function () {
        let key, args;
        if (arguments.length === 0) {
            return false;
        }
        key = arguments[0];
        args = [].concat(Array.prototype.slice.call(arguments, 1));

        if (this.onObj[key] !== undefined
            && this.onObj[key].length > 0) {
            for (let i in this.onObj[key]) {
                this.onObj[key][i].apply(null, args);
            }
        }
        if (this.oneObj[key] !== undefined
            && this.oneObj[key].length > 0) {
            for (let i in this.oneObj[key]) {
                this.oneObj[key][i].apply(null, args);
                this.oneObj[key][i] = undefined;
            }
            this.oneObj[key] = [];
        }
    }
};

export default bdEventProxy;
