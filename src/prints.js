// -- Prints-class

function Prints() {
    var self = this;

    self.m_db = null;

    // -- Register events

    self.event_DataFileReady = new Event(self);
    self.event_DataFileReady.attach(function() { self.DrawLog(); });

    // -- Function (pointers) for log iteration and sorting

    self.ForEndDesc = function(current, total) { return current > 0; };
    self.ForEndAsc = function(current, total) { return current < total; };
    self.ForIterDesc = function(current) { return current - 1; };
    self.ForIterAsc = function(current) { return current + 1; };

    // -- Read log file entries

    self.ReadFile = function() {
        $.get({
            cache: false,
            url: settings.logfile
        }).then(function(file) {
            var lines = file.split(settings.new_line);
            var items = -1;

            self.m_db = []; // new Array();

            // -- Vars/func* for log iteration

            var start = settings.new_first ? lines.length - 1 : 0;
            var end = settings.new_first ? self.ForEndDesc : self.ForEndAsc;
            var iter = settings.new_first ? self.ForIterDesc : self.ForIterAsc;

            for (var line = start; end(line, lines.length); line = iter(line)) {
                if (lines[line].startsWith(settings.comment) || lines[line] == "") { // Skip comments and empty lines
                    continue;
                } else if (lines[line].startsWith(settings.change_mark)) { // Profiles/non-log entries ie. "general changes" belong to Profiles-class
                    profiles.UpdateFromString(lines[line]);

                    continue;
                } else
                    items++;

                // -- Actual log entry (separate function?)

                var data = lines[line].split(settings.col_delimiter); // Contains line data
                var entry = {}; // new Object();

                for (var i = 0; i < settings.data.length; i++) {
                    if (typeof data[settings.data[i].col] !== 'undefined') {
                        entry[settings.data[i].name] = data[settings.data[i].col]; // Match line data columns defined in settings.data (column 0 has short_file)

                        if (typeof settings.data[i].dateFormat !== 'undefined') {
                            entry[settings.data[i].name] = StringToDate(entry[settings.data[i].name], settings.data[i].dateFormat, settings.date_delimiter);
                            entry[settings.data[i].name].setMilliseconds(lines.length - line); // Keeps natural order
                        } else {
                            if (IsDefined(settings.data[i].hasSubItems) && settings.data[i].hasSubItems) { // Column sub items (entry settings namely)
                                var sub_items = entry[settings.data[i].name].split(settings.col_subdelimiter);
                                entry[settings.data[i].name] = []; // new Array();

                                for (var s = 0; s < sub_items.length; s++)
                                    entry[settings.data[i].name].push(sub_items[s].split(settings.rule_pointer));
                            }
                        }
                    }
                }

                // -- Add entry to db

                entry.profile = profiles.GetCurrentID();
                entry._hard_id = items; // Item hard no
                self.m_db.push(entry);
            }

            self.event_DataFileReady.notify();
        });
    };

    // -- Log to html

    self.DrawLog = function() {
        var items_html = "";

        var db = self.Sort();

        // -- JSLint wanted to separate this

        function AppendProfileSettings(item, num, values_array) {
            items_html += "<span class=\"header_item_val_" + (values_array.length - num) + "\">" + item + "</span>";
        }

        // -- Actual processing

        for (var entry = 0; entry < db.length; entry++) {

            // -- Headers

            var first_before_header = "";

            if (entry == 0 || db[entry].profile != db[entry - 1].profile) {

                // Add nth_last

                {
                    var top_place = items_html.lastIndexOf("entry row"); // What if entry value has this D:

                    if (top_place > -1)
                        items_html = items_html.insert(top_place, "nth_last ");
                }

                // -- Profiles

                var profile = profiles.GetByID(db[entry].profile);
                var keys = Object.keys(profile);

                items_html += "<div class=\"row row-eq-height no-gutters sub_header_container\">" +
                    "<div class=\"col-sm-12 sub_header\">" + profile.Profile;

                // -- Profile settings
                /*jshint loopfunc:true*/
                for (var k = 0; k < keys.length; k++) {
                    if (keys[k] != "Profile") {
                        items_html += "<div class=\"sub_header_item\"><span class=\"header_item_key\">" + keys[k] + "</span>";

                        var values = profile[keys[k]].split(settings.col_change_delimiter);
                        values.forEach(function(item, num) {
                            items_html += "<span class=\"header_item_val_" + (values.length - num) + "\">" + item + "</span>";
                        });

                        items_html += "</div>";
                    }
                }
                /*jshint loopfunc:false*/

                items_html += "</div></div>";
                first_before_header = " nth_first";
            }

            // -- Log entries

            var odd_or_even = (entry % 2 ? "nth_odd" : "nth_even");
            items_html += "<div class=\"entry row row-eq-height no-gutters " + odd_or_even + first_before_header + "\" id=\"entry-id_" + db[entry]._hard_id + "\">";

            for (var i = 0; i < settings.data.length; i++) {
                items_html += "<div class=\"" + settings.data[i].class + " " + settings.data[i].name + "\"><span class=\"" + settings.data[i].name + "_bg\"></span><div class=\"" + settings.data[i].name + "_val entry_val\">";

                // -- Sub items

                if (IsDefined(db[entry][settings.data[i].name]) && IsDefined(settings.data[i].hasSubItems) && settings.data[i].hasSubItems) {
                    var entry_val = db[entry][settings.data[i].name];

                    for (var s = 0; s < entry_val.length; s++) {
                        items_html += "<div class=\"sub_item_container\"><span class=\"sub_item_key\">" + entry_val[s][0] + "</span><span class=\"sub_item_val\">" + entry_val[s][1] + "</span></div>";
                    }
                } else { // -- Else either date or value
                    var text = (typeof db[entry][settings.data[i].name] !== 'undefined') ? db[entry][settings.data[i].name] : "<br />";

                    if (typeof settings.data[i].dateFormat !== 'undefined')
                        text = DateToString(text, settings.ui_date_format);

                    items_html += text;
                }

                items_html += "</div></div>";
            }

            items_html += "</div>";
        }

        // Add nth_last

        {
            var bottom_place = items_html.lastIndexOf("entry row"); // What if entry value has this D:

            if (bottom_place > -1)
                items_html = items_html.insert(bottom_place, "nth_last ");
        }

        // Remove existing and use newly defined

        $(settings.html_log).children(".entry").remove();
        $(settings.html_log).prepend(items_html);

        $(settings.html_log).on("click", ".entry", function(e) { self.EntryClick(this); });
    };

    // -- Log entry click
    // For testing only, NOT dynamic/abiding settings!! Functionality not decided

    self.EntryClick = function(element) {
        var entryNum = parseInt(element.id.split("_")[1]);
        var entry = self.m_db[entryNum];

        ui.entry_input_date.val(DateToString(entry.date, settings.ui_date_format));
        ui.entry_input_short_file.val(entry.short_file);
        ui.entry_input_file.val(entry.file);

        ui.entry_input_settings.children(".setting").remove();

        var settings_html = "";
        var settings_count = IsDefined(entry.settings) ? entry.settings.length : 0;

        for (var i = 0; i < settings_count; i++) {
            settings_html += "<div class=\"setting\"><span>" + entry.settings[i][0] + "</span><span>" + entry.settings[i][1] + "</span></div>";
        }

        ui.entry_input_settings.prepend(settings_html);

        ui.entry_input_settings.off("click", ".setting");
        ui.entry_input_settings.on("click", ".setting", function(e) {
            e.stopPropagation();
            ui.entry_input_settings_dropdown.addClass("open");
            ui.entry_input_settings_dropdown.trigger("show.bs.dropdown");

            var childs = $(this).children("span");
            var key = childs[0].innerHTML;
            var val = childs[1].innerHTML;

            ui.entry_input_settingsKey.val(key);
            ui.entry_input_settingsValue.val(val);

            ui.entry_input_settingsAdd.val("Update setting");
        });
    };

    // -- Sorting, returns a sorted db

    self.Sort = function() {
        var sorted = [self.m_db[0]];
        var end = settings.sort_desc ? self.ForEndDesc : self.ForEndAsc;
        var iter = settings.sort_desc ? self.ForIterDesc : self.ForIterAsc;
        var isText = typeof settings.GetSortByData().dateFormat === 'undefined';

        for (var i = 1; i < self.m_db.length; i++) {
            var s = settings.sort_desc ? sorted.length - 1 : 0;

            for (; end(s, sorted.length); s = iter(s)) {
                var sort_a = self.m_db[i][settings.sort_by];
                var sort_b = sorted[s][settings.sort_by];

                if (isText) {
                    sort_a = sort_a.toLowerCase();
                    sort_b = sort_b.toLowerCase();
                }

                if (sort_a > sort_b)
                    break;
            }

            sorted.splice(s, 0, self.m_db[i]);
        }

        return sorted;
    };

}