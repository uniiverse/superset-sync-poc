function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
export var DashboardsConfig = /*#__PURE__*/ function() {
    "use strict";
    function DashboardsConfig(dashboards) {
        var _this = this;
        _class_call_check(this, DashboardsConfig);
        _define_property(this, "dashboards", void 0);
        this.dashboards = new Map();
        dashboards.forEach(function(dashboard) {
            dashboard.dashboardIds.forEach(function(id) {
                _this.dashboards.set(id, dashboard);
            });
        });
    }
    _create_class(DashboardsConfig, [
        {
            key: "get",
            value: function get(dashboardId, locale, defaultToEn) {
                var dashboardConfig = this.dashboards.get(dashboardId);
                if (!dashboardConfig) {
                    return null;
                }
                // If no map exists for this locale, so default to "en".
                return dashboardConfig.get(locale, defaultToEn);
            }
        }
    ]);
    return DashboardsConfig;
}();
export var DashboardConfig = /*#__PURE__*/ function() {
    "use strict";
    function DashboardConfig(title, dashboardIds, locales) {
        var _this = this;
        _class_call_check(this, DashboardConfig);
        _define_property(this, "title", void 0);
        _define_property(this, "dashboardIds", void 0);
        _define_property(this, "dashboardLocales", void 0);
        this.title = title;
        this.dashboardIds = dashboardIds;
        this.dashboardLocales = new Map();
        locales.forEach(function(dashboardLocale) {
            dashboardLocale.locales.forEach(function(locale) {
                dashboardLocale.title = title;
                _this.dashboardLocales.set(locale, dashboardLocale);
            });
        });
    }
    _create_class(DashboardConfig, [
        {
            key: "get",
            value: function get(locale, defaultToEn) {
                return this.dashboardLocales.get(locale) || defaultToEn && this.dashboardLocales.get("en") || null;
            }
        }
    ]);
    return DashboardConfig;
}();
export var DashboardLocaleConfig = function DashboardLocaleConfig(param) {
    "use strict";
    var locales = param.locales, embeddableUUID = param.embeddableUUID, stableUUID = param.stableUUID;
    _class_call_check(this, DashboardLocaleConfig);
    _define_property(this, "title", "") // Set by parent config.
    ;
    _define_property(this, "locales", void 0);
    _define_property(this, "embeddableUUID", void 0);
    _define_property(this, "stableUUID", void 0);
    this.locales = locales;
    this.embeddableUUID = embeddableUUID;
    this.stableUUID = stableUUID;
};
