var utils = require('utils');

exports.create = function(casper) {
    return new Mouse(casper);
};

var Mouse = function(casper) {
    if (!utils.isCasperObject(casper)) {
        throw new Error('Mouse() needs a Casper instance');
    }

    var supportedEvents = ['mouseup', 'mousedown', 'click', 'mousemove'];

    var computeCenter = function(selector) {
        var bounds = casper.getElementBounds(selector);
        if (utils.isClipRect(bounds)) {
            var x = Math.round(bounds.left + bounds.width / 2);
            var y = Math.round(bounds.top  + bounds.height / 2);
            return [x, y];
        }
    };

    var processEvent = function(type, args) {
        if (!utils.isString(type) || supportedEvents.indexOf(type) === -1) {
            throw new Error('Unsupported mouse event type: ' + type);
        }
        args = Array.prototype.slice.call(args); // cast Arguments -> Array
        switch (args.length) {
            case 0:
                throw new Error('Too few arguments');
            case 1:
                // selector
                var selector = args[0];
                if (!utils.isString(selector)) {
                    throw new Error('No valid CSS selector passed: ' + selector);
                }
                casper.page.sendEvent.apply(casper.page, [type].concat(computeCenter(selector)))
                break;
            case 2:
                // coordinates
                if (!utils.isNumber(args[1]) || !utils.isNumber(args[2])) {
                    throw new Error('No valid coordinates passed');
                }
                casper.page.sendEvent(type, args[0], args[1])
                break;
            default:
                throw new Error('Too many arguments');
        }
    };

    this.click = function() {
        processEvent('click', arguments);
    },

    this.down = function() {
        processEvent('mousedown', arguments);
    },

    this.move = function() {
        processEvent('mousemove', arguments);
    },

    this.up = function() {
        processEvent('mouseup', arguments);
    }
};
exports.Mouse = Mouse;
