// -- Generic event system

function Event(sender) {
    this._sender = sender;
    this._listeners = [];
    this._run_once = [];
}

Event.prototype = {
    attach: function(listener, run_once) {
        this._listeners.push(listener);

        if (run_once == null) run_once = false;
        this._run_once.push(run_once);
    },
    notify: function(args) {
        for (var i = 0; i < this._listeners.length; i++) {
            this._listeners[i](this._sender, args);

            if (this._run_once[i]) {
                this._run_once.splice(i, 1);
                this._listeners.splice(i, 1);
                i--;
            }
        }
    }
};

function ReverseStr(str) { return reverseString(str.substr(1)) + str.charAt(0); }

// -- Date formatting

function StringToDate(_date, _format, _delimiter) {
    var formatItems = _format.split(_delimiter);
    var dateItems = _date.split(_delimiter);

    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var month = parseInt(dateItems[monthIndex]) - 1;

    return new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
}

function DateToString(_date, _format) {
    var mm = _date.getMonth() + 1;
    var dd = _date.getDate();

    mm = (mm > 9 ? "" : "0") + mm;
    dd = (dd > 9 ? "" : "0") + dd;

    return _format.replace("yyyy", _date.getFullYear()).replace("mm", mm).replace("dd", dd);
}

function IsDefined(objToCheck) {
    return typeof objToCheck !== 'undefined';
}

// -- String-class additions

String.prototype.splice = function(start, delCount, newSubStr) {
    return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
};

String.prototype.insert = function(index, string) {
    if (index > 0)
        return this.substring(0, index) + string + this.substring(index, this.length);
    else
        return string + this;
};

// -- Variables

var prints = new Prints();
var settings = new Settings();
var profiles = new Profiles();
var ui = new UIElements(); // Holds prefetched UI elements

// -- UI elements-class

function UIElements() {
    var self = this;

    self.Add = function(elements) {
        var items = Object.keys(elements);

        for (var i = 0; i < items.length; i++) {
            self[items[i]] = $(elements[items[i]]);
        }
    };
}

// -- Init

$(document).ready(function() {

    // Prefetched ui elements

    ui.Add({
        entry_input_date: "#entry_input_date",
        entry_input_short_file: "#entry_input_short_file",
        entry_input_file: "#entry_input_file",
        entry_input_add_settings: "#entry_input_add_setting",
        entry_input_settingsKey: "#entry_input_settingsKey",
        entry_input_settingsValue: "#entry_input_settingsValue",
        entry_input_settingsAdd: "#entry_input_settingsAdd",
        entry_input_settings: ".entry_input .settings",
        entry_input_settings_dropdown: ".entry_input .settings .dropdown",
        input_settings_new: ".entry_input .settings .form-inline"
    });

    // Dropdown events

    ui.entry_input_settings_dropdown.on("show.bs.dropdown", function() {
        ui.entry_input_add_settings.html("Hide <span class=\"glyphicon glyphicon-triangle-top\"></span>");
        ui.entry_input_settingsAdd.val("Add setting");
    });

    ui.entry_input_settings_dropdown.on("hide.bs.dropdown", function() {
        ui.entry_input_add_settings.html("Add <span class=\"glyphicon glyphicon-triangle-bottom\"></span>");
    });

    ui.entry_input_add_settings.on("click", function() {
        ui.entry_input_settingsKey.val("");
        ui.entry_input_settingsValue.val("");
    });

    // On with the program

    prints.ReadFile();
});