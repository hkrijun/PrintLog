// -- Settings-class/namespace

function Settings() {

    // -- File format

    this.logfile = "log.txt";
    this.new_first = true;

    this.col_delimiter = ':';
    this.col_subdelimiter = '|';
    this.col_change_delimiter = "->";
    this.comment = '#';
    this.setting_delimiter = ';';
    this.rule_pointer = '=';
    this.new_line = "\r\n";

    this.change_mark = '+';

    this.date_delimiter = '-';
    this.ui_date_format = "dd-mm-yyyy";

    // -- HTML
    // col relates to log file line column

    this.data = [{
        "col": 2,
        "name": "date",
        "class": "col-sm-1",
        "dateFormat": "dd-mm-yyyy"
    }, {
        "col": 0,
        "name": "short_file",
        "class": "col-sm-1"
    }, {
        "col": 1,
        "name": "file",
        "class": "col-sm-5"
    }, {
        "col": 3,
        "name": "settings",
        "class": "col-sm-5",
        "hasSubItems": true
    }];

    // -- Webpage settings

    this.html_log = ".log_lines";

    // -- Dynamic settings

    this.sort_by = "date";
    this.sort_desc = false;

    // -- Helper functions

    this.GetSortByData = function() {
        for (var i = 0; i < this.data.length; i++)
            if (this.data[i].name == this.sort_by)
                return this.data[i];
    };
}