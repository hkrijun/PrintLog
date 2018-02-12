
// -- Event system

function Event(sender) {
    this._sender = sender;
    this._listeners = [];
	this._run_once = [];
}

Event.prototype = {
    attach: function (listener, run_once) {
        this._listeners.push(listener);
		
		if( run_once == null ) run_once = false;
		this._run_once.push(run_once);
    },
    notify: function (args) {
        for (var i = 0; i < this._listeners.length; i++) {
            this._listeners[i](this._sender, args);
			
			if( this._run_once[i] ) {
				this._run_once.splice(i, 1);
				this._listeners.splice(i, 1);
				i--;
			}
        }
    }
};

// -- Shorthands

function ForEndDesc(current, total) { return current > 0; }
function ForEndAsc(current, total) { return current < total; }
function ForIterDesc(current) { return current-1; }
function ForIterAsc(current) { return current+1; }
function ReverseStr(str) { return reverseString(str.substr(1)) + str.charAt(0); }

// -- Date formatting

function StringToDate(_date,_format,_delimiter)
{
	var formatItems=_format.split(_delimiter);
	var dateItems=_date.split(_delimiter);
	
	var monthIndex=formatItems.indexOf("mm");
	var dayIndex=formatItems.indexOf("dd");
	var yearIndex=formatItems.indexOf("yyyy");
	var month=parseInt(dateItems[monthIndex]) - 1;
	
	return new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
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

String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};

// -- Variables

var prints = new Prints();
var settings = new Settings();
var profiles = new Profiles();
var ui;								// Holds prefetched UI elements

// -- Settings-class/namespace

function Settings()
{
	// File settings
	
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
	
	this.data = [
		{
			"col": 2,
			"name": "date",
			"class": "col-sm-1",
			"dateFormat": "dd-mm-yyyy"
		},{
			"col": 0,
			"name": "short_file",
			"class": "col-sm-1"
		},{
			"col": 1,
			"name": "file",
			"class": "col-sm-5"
		},{
			"col": 3,
			"name": "settings",
			"class": "col-sm-5",
			"hasSubItems": true
		}
	];
	
	// Webpage settings
	
	this.html_log = ".log_lines";
	
	// Dynamic settings
	
	this.sort_by = "date";
	this.sort_desc = false;
	
	// Helper functions
	
	this.GetSortByData = function() {
		for( var i = 0 ; i < this.data.length ; i++ )
			if( this.data[i].name == this.sort_by )
				return this.data[i];
	}
}

// -- Profiles-class

function Profiles()
{
	var self = this;
	
	self.m_profiles = new Array();
	
	self.m_profiles[0] = { "Profile": "Default" };
	
	self.UpdateFromString = function(str) {
		var line = str.split(settings.col_delimiter);
		line[0] = line[0].substr(1);
		
		var params = line[1].split(settings.col_subdelimiter);
		var new_profile = new Object();
		
		for( var i = 0 ; i < params.length ; i++ ) {
			var param = params[i].split(settings.rule_pointer);
			
			new_profile[param[0]] = param[1];
		}
		
		if( typeof new_profile.Profile === 'undefined' )
			new_profile.Profile = self.GetCurrent().Profile;
		
		self.m_profiles.push(new_profile);
	}
	
	self.GetCurrentID = function() {
		return self.m_profiles.length-1;
	}
	
	self.GetCurrent = function() {
		return self.m_profiles[self.GetCurrentID()];
	}
	
	self.GetByID = function(id) {
		return self.m_profiles[id];
	}
}

// -- Prints-class

function Prints()
{
	var self = this;
	
	self.m_db = null;
	self.event_DataFileReady = new Event(this);
	
	self.event_DataFileReady.attach(function() { self.DrawLog(); });
	
	self.ReadFile = function() {
		$.get({
			cache: false,
			url: settings.logfile
		}).then(function (file) {	
			var lines = file.split(settings.new_line);
			var items = -1;
			
			self.m_db = new Array();
			
			// -- Vars/func* for log iteration
			
			var start = settings.new_first ? lines.length - 1 : 0;
			var end = settings.new_first ? ForEndDesc : ForEndAsc;
			var iter = settings.new_first ? ForIterDesc : ForIterAsc;
			
			for( var line = start; end(line, lines.length) ; line = iter(line) ) {
				if( lines[line].startsWith(settings.comment) || lines[line] == "" ) { 	// Comments
					continue;
				} else if( lines[line].startsWith(settings.change_mark) ) {				// Profiles/non-log entries
					profiles.UpdateFromString(lines[line]);
					
					continue;
				} else
					items++;
				
				var data = lines[line].split(settings.col_delimiter);					// Line data
				var entry = new Object();
				
				for( var i = 0 ; i < settings.data.length ; i++ ) {
					if( typeof data[settings.data[i].col] !== 'undefined' ) {
						entry[settings.data[i].name] = data[settings.data[i].col];		// Match line data columns defined in settings.data (column 0 has short_file)
						
						if( typeof settings.data[i].dateFormat !== 'undefined' ) {
							entry[settings.data[i].name] = StringToDate(entry[settings.data[i].name], settings.data[i].dateFormat, settings.date_delimiter);
							entry[settings.data[i].name].setMilliseconds(lines.length - line); // Keeps natural order
						} else {
							if( IsDefined(settings.data[i].hasSubItems) && settings.data[i].hasSubItems ) {		// Column sub items (entry settings namely)
								var sub_items = entry[settings.data[i].name].split(settings.col_subdelimiter);
								entry[settings.data[i].name] = new Array();
								
								for( var s = 0 ; s < sub_items.length ; s++ )
									entry[settings.data[i].name].push(sub_items[s].split(settings.rule_pointer));
							}
						}
					}
				}
				
				entry.profile = profiles.GetCurrentID();
				entry._hard_id = items; // Item no
				self.m_db.push(entry);
			}

			self.event_DataFileReady.notify();
		});
	}
	
	self.DrawLog = function() {
		var items_html = "";
		
		var db = self.Sort();
		
		for( var entry = 0 ; entry < db.length ; entry ++ ) {
			
			// -- Headers
			
			var first_before_header = "";
			
			if( entry == 0 || db[entry].profile != db[entry-1].profile ) {
			
				// Add nth_last
				
				{
					var place = items_html.lastIndexOf("entry row"); // What if entry value has this D:
					
					if( place > -1 )
						items_html = items_html.insert(place, "nth_last ");
				}
				
				// -- Profiles
				
				var profile = profiles.GetByID(db[entry].profile);
				var keys = Object.keys(profile);
				
				items_html += 	"<div class=\"row row-eq-height no-gutters sub_header_container\">" +
									"<div class=\"col-sm-12 sub_header\">" + profile.Profile;
				
				// -- Profile settings
				 
				for( var k = 0 ; k < keys.length ; k++ ) {
					if( keys[k] != "Profile" ) {
						items_html += "<div class=\"sub_header_item\"><span class=\"header_item_key\">" + keys[k] + "</span>";
						
						var values = profile[keys[k]].split(settings.col_change_delimiter);
						
						values.forEach(function (item, num) {
							items_html +="<span class=\"header_item_val_" + (values.length - num) + "\">" + item + "</span>";
						});
						
						items_html += "</div>";
					}
				}
									
				items_html += "</div></div>";
				first_before_header = " nth_first";
			}
			
			// -- Log entries
			
			var odd_or_even = (entry % 2 ? "nth_odd" : "nth_even");
			items_html += "<div class=\"entry row row-eq-height no-gutters " + odd_or_even + first_before_header + "\" id=\"entry-id_" + db[entry]._hard_id + "\">";
			
			for( var i = 0 ; i < settings.data.length ; i++ ) {
				items_html += "<div class=\"" + settings.data[i].class + " " + settings.data[i].name + "\"><span class=\"" + settings.data[i].name + "_bg\"></span><div class=\"" + settings.data[i].name + "_val entry_val\">";
				
				if( IsDefined(db[entry][settings.data[i].name]) && IsDefined(settings.data[i].hasSubItems) && settings.data[i].hasSubItems ) {
					var entry_val = db[entry][settings.data[i].name];
					
					for( var s = 0 ; s < entry_val.length ; s++ ) {
						items_html += "<div class=\"sub_item_container\"><span class=\"sub_item_key\">" + entry_val[s][0] + "</span><span class=\"sub_item_val\">" + entry_val[s][1] + "</span></div>";
					}
				} else {
					var text = ( typeof db[entry][settings.data[i].name] !== 'undefined' ) ? db[entry][settings.data[i].name] : "<br />";
					
					if( typeof settings.data[i].dateFormat !== 'undefined' )
						text = DateToString(text, settings.ui_date_format);
					
					items_html += text;
				}
				
				items_html += "</div></div>";
			}

			items_html += "</div>";
		}
		
		// Add nth_last
		
		{
			var place = items_html.lastIndexOf("entry row"); // What if entry value has this D:
					
			if( place > -1 )
				items_html = items_html.insert(place, "nth_last ");
		}
		
		// Empty existing and add new
		
		$(settings.html_log).children(".entry").remove();
		$(settings.html_log).prepend(items_html);
		
		$(settings.html_log).on("click", ".entry", function(e) { self.EntryClick(this); });
	}
	
	// Not dynamic!! Functionality not decided
	self.EntryClick = function(element) {
		var entryNum = parseInt(element.id.split("_")[1]);
		var entry = self.m_db[entryNum];
		
		ui.entry_input_date.val(DateToString(entry.date, settings.ui_date_format));
		ui.entry_input_short_file.val(entry.short_file);
		ui.entry_input_file.val(entry.file);
		
		ui.entry_input_settings.children(".setting").remove();

		var settings_html = "";
		var settings_count = IsDefined(entry.settings) ? entry.settings.length : 0;
		
		for( var i = 0 ; i < settings_count ; i++ ) {
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
	}
	
	self.Sort = function() {
		var sorted = [ self.m_db[0] ];
		var end = settings.sort_desc ? ForEndDesc : ForEndAsc;
		var iter = settings.sort_desc ? ForIterDesc : ForIterAsc;
		var isText = typeof settings.GetSortByData().dateFormat === 'undefined';
		
		for( var i = 1 ; i < self.m_db.length ; i++ ) {
			var s = settings.sort_desc ? sorted.length - 1 : 0;
			
			for( ; end(s, sorted.length) ; s = iter(s) ) {
				var sort_a = self.m_db[i][settings.sort_by];
				var sort_b = sorted[s][settings.sort_by];
				
				if( isText ) {
					sort_a = sort_a.toLowerCase();
					sort_b = sort_b.toLowerCase();
				}
				
				if(sort_a > sort_b  )
					break;
			}
			
			sorted.splice(s, 0, self.m_db[i]);
		}
		
		return sorted;
	}
}

// -- UI elements-class

function UIElements(_elements)
{
	items = Object.keys(_elements);

	for( var i = 0 ; i < items.length ; i++ ) {
		this[items[i]] = $(_elements[items[i]]);
	}

	delete items;
}

// -- Init

$(document).ready(function() {
	
	// Prefetched ui elements
	
	ui = new UIElements({
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
	
	ui.entry_input_settings_dropdown.on("show.bs.dropdown", function () {
		ui.entry_input_add_settings.html("Hide <span class=\"glyphicon glyphicon-triangle-top\"></span>");
		ui.entry_input_settingsAdd.val("Add setting");
	});
	
	ui.entry_input_settings_dropdown.on("hide.bs.dropdown", function () {
		ui.entry_input_add_settings.html("Add <span class=\"glyphicon glyphicon-triangle-bottom\"></span>");
	});
	
	ui.entry_input_add_settings.on("click", function() {
		ui.entry_input_settingsKey.val("");
		ui.entry_input_settingsValue.val("");
	});
	
	// On with the program
	
	prints.ReadFile();
});
















































