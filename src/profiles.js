// -- Profiles-class

function Profiles() {
    var self = this;

    self.m_profiles = []; // new Array();
    self.m_profiles[0] = { "Profile": "Default" };

    // -- When itering, uses previous profile name when undefined by the log, essentially only updating parameters

    self.UpdateFromString = function(str) {
        var line = str.split(settings.col_delimiter);
        line[0] = line[0].substr(1);

        var params = line[1].split(settings.col_subdelimiter);
        var new_profile = {}; // new Object();

        for (var i = 0; i < params.length; i++) {
            var param = params[i].split(settings.rule_pointer);

            new_profile[param[0]] = param[1];
        }

        if (typeof new_profile.Profile === 'undefined')
            new_profile.Profile = self.GetCurrent().Profile;

        self.m_profiles.push(new_profile);
    };

    // -- Get currently itering

    self.GetCurrentID = function() {
        return self.m_profiles.length - 1;
    };

    self.GetCurrent = function() {
        return self.m_profiles[self.GetCurrentID()];
    };

    // -- Get profile by ID

    self.GetByID = function(id) {
        return self.m_profiles[id];
    };
}