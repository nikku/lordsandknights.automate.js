// ==UserScript==
// @matches http://browser.lordsandknights.com/*
// @name Lords and Knigths Automation
// ==/UserScript==

/** automator implementation */

(function() {

  (function() {

    var Action = function(fn, scheduledAt, city) {
      this.fn = fn;
      this.scheduledAt = scheduledAt;
      this.repeatMs = null;
      this.name = this.fn.name;
      this.city = city;
    };

    Action.prototype = {
      log: function() {
        U.debug("Action ", fn, " due at ", new Date(this.scheduledAt));
      },
      repeatIn: function(repeatMs) {
        this.repeatMs = repeatMs;
      }
    };

    var Actions = window.Actions = function(scope) {
      this.scheduledActions = [],
      this.timer = null,
      this.nextAction = null;
      this.enabled = false;
      this.scope = scope;
    };

    Actions.prototype = {
      schedule: function(fn, delay, city) {
        var action = new Action(fn, new Date().getTime() + delay, city);

        U.debug("[actions] new action ", action, " at ", new Date(action.scheduledAt));

        this.scheduledActions.push(action);
        this.updateTimer();
      },

      disable: function() {
        if (this.timer) {
          T.cancel(this.timer);
        }

        this.timer = null;
        this.nextAction = null;
        this.enabled = false;
      },

      enable: function() {
        U.debug("[actions] enable", this.scheduledActions);

        this.enabled = true;
        this.updateTimer();
      },

      purge: function() {
        this.scheduledActions = [];
      },

      updateTimer: function() {
        if (!this.enabled || this.actionInProgress()) {
          U.info("Not updating: action in progress");
          return;
        }

        var next = null;

        U.debug("[actions] update timer", this.scheduledActions);

        $.each(this.scheduledActions, function(i, e) {
          if (!next) {
            next = e;
          } else
          if (next.scheduledAt > e.scheduledAt) {
            next = e;
          }
        });

        U.info("[actions]", next.name, "[next]");
        if (this.timer) {
          T.cancel(this.timer);
        }

        this.setNextAction(next);
      },

      carryOutAction: function(action) {
        U.info("[action]", action.name, "[start]");

        this.setCurrentAction(action);
        this.scheduledActions.splice(this.scheduledActions.indexOf(action), 1);

        var self = this;

        function navigateToCity() {
          return Navigation
            .navigateTo({ city: action.city })
            .then(U.waitDefault);
        }

        function executeAction() {
          return action.fn(action);
        }

        function handleActionSuccess() {
          self.setCurrentAction(null);

          if (action.repeatMs) {
            self.rescheduleAction(action, new Date().getTime() + action.repeatMs);
            action.repeatMs = null;
          }

          U.info("[actions]", action.name, "[finished]");
        }

        function handleActionError(e) {
          self.setCurrentAction(null);
          self.rescheduleAction(action, action.scheduledAt + 10000);

          U.info("[actions]", action, "[finished in error]", e);
        }

        if (action.city) {
          navigateToCity()
            .then(executeAction)
            .then(handleActionSuccess, handleActionError);
        } else {
          executeAction()
            .then(handleActionSuccess, handleActionError);
        }
      },

      rescheduleAction: function(action, scheduledAt) {
        action.scheduledAt = scheduledAt;

        U.debug("[actions] reschedule", action, "to", new Date(scheduledAt));
        this.scheduledActions.push(action);
        this.updateTimer();
      },

      unschedule: function(fn, city) {

        var indexOfAction = -1;

        angular.forEach(this.scheduledActions, function(e, i) {
          if (e.fn == fn && e.city == city) {
            indexOfAction = i;
          }
        });

        var removed = null;
        if (indexOfAction != -1) {
          removed = this.scheduledActions.splice(indexOfAction, 1)[0];
          this.updateTimer();
        }
        return removed;
      },

      setNextAction: function(action) {
        var self = this;
        self.nextAction = action;

        this.timer = T.delay(function() {
          self.carryOutAction(action);
        }, Math.max(0, action.scheduledAt - new Date().getTime()));
      },

      setCurrentAction: function(action) {

        var self = this;

        self.scope.$apply(function() {
          self.currentAction = action;
        });
      },

      actionInProgress: function() {
        return !!this.currentAction;
      }
    };

    // LOCAL STORAGE ACCESS ::::::::

    var Storage = window.Storage = {
      get: function(key) {
        var data = window.localStorage[key];
        if (data) {
          return JSON.parse(data);
        } else {
          return null;
        }
      },
      put: function(key, data) {
        window.localStorage[key] = JSON.stringify(data);
      }
    };

    // BUILDINGS AND RESOURCES :::::::

    var C = window.C = {
      buildings: [
        {name: "Keep", type: "building"},
        {name: "Arsenal", type: "building"},
        {name: "Tavern", type: "building"},
        {name: "Library", type: "building"},
        {name: "Fortifications", type: "building"},
        {name: "Market", type: "building"},
        {name: "Farm", type: "building"},
        {name: "Lumberjack", type: "building"},
        {name: "Wood store", type: "building"},
        {name: "Quarry", type: "building"},
        {name: "Stone store", type: "building"},
        {name: "Ore mine", type: "building"},
        {name: "Ore store", type: "building"} ],
      technologies: [
        {name: "Longbow", libraryLevel: 1, type: "technology"},
        {name: "Crop rotation", libraryLevel: 1, type: "technology"},
        {name: "Yoke", libraryLevel: 1, type: "technology"},
        {name: "Cellar storeroom", libraryLevel: 1, type: "technology"},
        {name: "Stirrup", libraryLevel: 2, type: "technology"},
        {name: "Weaponsmith", libraryLevel: 3, type: "technology"},
        {name: "Armoursmith", libraryLevel: 3, type: "technology"},
        {name: "Beer tester", libraryLevel: 3, type: "technology"},
        {name: "Swordsmith", libraryLevel: 4, type: "technology"},
        {name: "Iron hardening", libraryLevel: 4, type: "technology"},
        {name: "Crossbow", libraryLevel: 5, type: "technology"},
        {name: "Poison arrows", libraryLevel: 6, type: "technology"},
        {name: "Horse breeding", libraryLevel: 6, type: "technology"},
        {name: "Weapons manufacturing", libraryLevel: 7, type: "technology"},
        {name: "Horse armour", libraryLevel: 7, type: "technology"},
        {name: "Wheelbarrow", libraryLevel: 8, type: "technology"},
        {name: "Flaming arrows", libraryLevel: 8, type: "technology"},
        {name: "Blacksmith", libraryLevel: 9, type: "technology"},
        {name: "Map of area", libraryLevel: 10, type: "technology"},
        {name: "Cistern", libraryLevel: 10, type: "technology"},
      ],
      resources: [ "Wood", "Stone", "Ore", "People" ],
      cityUpgrades: Storage.get("cityUpgrades") || [
        {name: "Lumberjack", type: "building"}, {name: "Quarry", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Lumberjack", type: "building"},
        {name: "Quarry", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Tavern", type: "building"}, {name: "Wood store", type: "building"},
        {name: "Stone store", type: "building"}, {name: "Ore store", type: "building"}, {name: "Tavern", type: "building"}, {name: "Farm", type: "building"},
        {name: "Lumberjack", type: "building"}, {name: "Quarry", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Wood store", type: "building"},
        {name: "Stone store", type: "building"}, {name: "Ore store", type: "building"}, {name: "Tavern", type: "building"}, {name: "Lumberjack", type: "building"},
        {name: "Quarry", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Farm", type: "building"}, {name: "Lumberjack", type: "building"},
        {name: "Quarry", type: "building"}, {name: "Wood store", type: "building"}, {name: "Stone store", type: "building"}, {name: "Ore store", type: "building"},
        {name: "Farm", type: "building"}, {name: "Wood store", type: "building"}, {name: "Stone store", type: "building"}, {name: "Ore store", type: "building"},
        {name: "Lumberjack", type: "building"}, {name: "Quarry", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Tavern", type: "building"},
        {name: "Farm", type: "building"}, {name: "Wood store", type: "building"}, {name: "Stone store", type: "building"}, {name: "Ore store", type: "building"},
        {name: "Lumberjack", type: "building"}, {name: "Quarry", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Farm", type: "building"},
        {name: "Lumberjack", type: "building"}, {name: "Quarry", type: "building"}, {name: "Wood store", type: "building"}, {name: "Stone store", type: "building"},
        {name: "Ore store", type: "building"}, {name: "Lumberjack", type: "building"}, {name: "Quarry", type: "building"}, {name: "Ore mine", type: "building"},
        {name: "Farm", type: "building"}, {name: "Wood store", type: "building"}, {name: "Stone store", type: "building"}, {name: "Ore store", type: "building"},
        {name: "Lumberjack", type: "building"}, {name: "Quarry", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Farm", type: "building"},
        {name: "Lumberjack", type: "building"}, {name: "Quarry", type: "building"}, {name: "Farm", type: "building"}, {name: "Wood store", type: "building"},
        {name: "Stone store", type: "building"}, {name: "Ore store", type: "building"}, {name: "Lumberjack", type: "building"}, {name: "Quarry", type: "building"},
        {name: "Ore mine", type: "building"}, {name: "Farm", type: "building"}, {name: "Lumberjack", type: "building"}, {name: "Quarry", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Farm", type: "building"}, {name: "Lumberjack", type: "building"}, {name: "Library", type: "building"}, {name: "Quarry", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Farm", type: "building"}, {name: "Lumberjack", type: "building"}, {name: "Quarry", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Wood store", type: "building"}, {name: "Stone store", type: "building"}, {name: "Ore store", type: "building"}, {name: "Farm", type: "building"}, {name: "Lumberjack", type: "building"}, {name: "Quarry", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Wood store", type: "building"}, {name: "Stone store", type: "building"}, {name: "Lumberjack", type: "building"}, {name: "Quarry", type: "building"}, {name: "Keep", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Farm", type: "building"}, {name: "Wood store", type: "building"}, {name: "Stone store", type: "building"}, {name: "Ore store", type: "building"}, {name: "Lumberjack", type: "building"}, {name: "Quarry", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Keep", type: "building"}, {name: "Farm", type: "building"}, {name: "Wood store", type: "building"}, {name: "Stone store", type: "building"}, {name: "Ore store", type: "building"}, {name: "Lumberjack", type: "building"}, {name: "Quarry", type: "building"}, {name: "Farm", type: "building"}, {name: "Lumberjack", type: "building"}, {name: "Quarry", type: "building"}, {name: "Library", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Farm", type: "building"}, {name: "Wood store", type: "building"}, {name: "Stone store", type: "building"}, {name: "Ore store", type: "building"}, {name: "Lumberjack", type: "building"}, {name: "Keep", type: "building"}, {name: "Keep", type: "building"}, {name: "Quarry", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Farm", type: "building"}, {name: "Wood store", type: "building"}, {name: "Stone store", type: "building"}, {name: "Ore store", type: "building"}, {name: "Lumberjack", type: "building"}, {name: "Fortifications", type: "building"}, {name: "Fortifications", type: "building"}, {name: "Quarry", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Farm", type: "building"}, {name: "Lumberjack", type: "building"},
        {name: "Fortifications", type: "building"}, {name: "Quarry", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Lumberjack", type: "building"}, {name: "Quarry", type: "building"}, {name: "Fortifications", type: "building"},
        {name: "Ore mine", type: "building"}, {name: "Wood store", type: "building"}, {name: "Stone store", type: "building"}, {name: "Ore store", type: "building"}, {name: "Lumberjack", type: "building"}, {name: "Quarry", type: "building"}, {name: "Fortifications", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Farm", type: "building"}, {name: "Keep", type: "building"}, {name: "Lumberjack", type: "building"}, {name: "Quarry", type: "building"}, {name: "Fortifications", type: "building"}, {name: "Ore mine", type: "building"},
        {name: "Lumberjack", type: "building"}, {name: "Keep", type: "building"}, {name: "Quarry", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Farm", type: "building"}, {name: "Fortifications", type: "building"}, {name: "Fortifications", type: "building"}, {name: "Lumberjack", type: "building"}, {name: "Quarry", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Wood store", type: "building"},
        {name: "Stone store", type: "building"}, {name: "Fortifications", type: "building"}, {name: "Ore store", type: "building"}, {name: "Farm", type: "building"}, {name: "Farm", type: "building"}, {name: "Farm", type: "building"}, {name: "Wood store", type: "building"}, {name: "Keep", type: "building"}, {name: "Stone store", type: "building"}, {name: "Keep", type: "building"}, {name: "Ore store", type: "building"}, {name: "Farm", type: "building"}, {name: "Wood store", type: "building"}, {name: "Stone store", type: "building"}, {name: "Ore store", type: "building"}, {name: "Farm", type: "building"}, {name: "Wood store", type: "building"}, {name: "Stone store", type: "building"}, {name: "Ore store", type: "building"}, {name: "Ore store", type: "building"}, {name: "Farm", type: "building"}, {name: "Lumberjack", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Quarry", type: "building"}, {name: "Keep", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Ore mine", type: "building"}, {name: "Ore mine", type: "building"}],
      farmConfiguration: Storage.get("farmConfiguration") || {
        "Some city" : { attackComposition: [ 6, 6, 6, 6, 6, 15], targets: [] }
      },

      defaults: {
        attackComposition: [ 6, 6, 6, 6, 6, 15]
      }
    };

    var Intel = window.Intel = {
      getCityLink: function(city) {

        var link = null;

        $(".nameDelimiter").each(function() {
          if ($(this).text() === city) {
            link = $(this);
          }
        });

        return link;
      },

      getBaseFor: function(city) {

        var link = Intel.getCityLink(city);
        var base = null;

        if (link != null) {
          base = link.parents(".level").parent();
        }

        if (!base) {
          throw new Error("No base found");
        }

        return base;
      },

      getCityNames: function() {
        return Navigation.navigateTo({ tab: 'no-of-castles' }).then(function() {
          var cityNames = $(".habitatName");
          var cities = [];
          cityNames.each(function() {
            cities.push($(this).text());
          });
          return U.resolvedDefer(cities);
        });
      },

      getBuildingsLevelInfo: function(city) {
        var base = Intel.getBaseFor(city);
        if (!base.length) {
          return null;
        }

        var buildings = {};
        angular.forEach(C.buildings, function(building, index) {
          var e = base.find("> td").eq(index + 1).find(".level:last");
          var regexp = /Upgrade level ([\d]+)\s+(?:([\d]+)\s+([\d]+)\s+([\d]+)(?:\s+([\d]+))?)?/m;
          var result = regexp.exec(e.text());

          if (result) {
            buildings[building.name] = {
              name: building.name,
              level: +result[1],
              building: building,
              upgradeCost: {
                wood: +result[2],
                stone: +result[3],
                iron: +result[4],
                people: +result[5] || 0
              }
            };
          } else {
            U.debug(e.text(), "Does not match");
          }
        });

        return buildings;
      },

      canBuildMore: function(city) {
        var base = Intel.getBaseFor(city);
        return base.find(".speedupBuildingUpgrade, .finishBuildingUpgrade").length < 2 &&
          base.find(".build").length > 1;
      },

      performUpgrade: function(upgrade, city) {

        var deferred = Q.defer();

        var index = C.buildings.indexOf(upgrade);
        var base = Intel.getBaseFor(city);

        var e = base.find("> td").eq(index + 1).find(".level:last");

        var buildButton = $(e).find(".build");

        // can build?
        if (buildButton.length) {
          U.click(buildButton).then(function() {
            deferred.resolve(true);
          });
        } else {
          deferred.resolve(false);
        }

        return deferred.promise;
      },

      getResources: function() {
        var resources = {};

        angular.forEach(C.resources, function(resourceId) {
          var e = $(".resource." + resourceId);
          resources[resourceId.toLowerCase()] = { current: +$(e).find(".current").text(), store: +$(e).find(".store").text() };
        });

        return resources;
      },

      getNextBuildingUpgrade: function(city) {
        var buildingInfos = Intel.getBuildingsLevelInfo(city);
        var buildingToUpgrade = null;
        var upgradeIndex = 0;

        if (!buildingInfos) {
          return null;
        }

        angular.forEach(buildingInfos, function(buildingInfo, i) {

          var level = 1;
          angular.forEach(C.cityUpgrades, function(upgrade, j) {
            if (upgrade.name == buildingInfo.name && level <= buildingInfo.level) {
              level++;

              if (level == buildingInfo.level + 1) {
                if (!upgradeIndex || upgradeIndex > j) {
                  buildingToUpgrade = buildingInfo.building;
                  upgradeIndex = j;
                }
              }
            }
          });
        });

        if (buildingToUpgrade) {
          return { building: buildingToUpgrade, index: upgradeIndex };
        } else {
          return null;
        }
      }
    };

    var Timers = function() {
      this.timers = {};
      this.i = 0;
    };

    Timers.prototype = {
      uniqueName: function() {
        return "timer-" + (this.i++);
      },
      ended: function(name) {
        this.timers[name] = null;
      },
      delay: function(fn, delay, name) {

        // default to function name
        name = name || fn.name || this.uniqueName();
        delay = delay || 0;

        if (this.timers[name]) {
          this.cancel(name);
        }

        this.register(fn, delay, name);
        return name;
      },

      register: function(fn, delay, name) {
        var self = this,
            wrappedFn;

        wrappedFn = function() {
          fn();
          self.ended(name);
        };

        this.timers[name] = { fn: fn, delay: delay, timer: setTimeout(wrappedFn, delay)};
      },

      cancel: function(name) {
        var t = this.timers[name];
        if (t) {
          clearTimeout(t.timer);
          this.ended(name);
        }
      }
    };

    var T = window.T = new Timers();

    var U = window.U = {
      debug: function() {
        if (false) {
          console.log.apply(console, arguments);
        }
      },
      info: function() {
        if (true) {
          console.log.apply(console, arguments);
        }
      },
      waitDefault: function(value) {
        return U.wait(2500, value);
      },
      /**
       * Wait for specific delay
       *
       * @param {type} delay
       * @param {type} value
       * @returns {unresolved}
       *
       * @example
       *
       * Q.defer().promise.then(U.waitForPromise(1000, "FOO")). ...
       */
      waitForPromise: function(delay, value) {
        return function() {
          return U.wait(delay, value);
        };
      },
      wait: function(delay, value) {
        var deferred = Q.defer();

        U.debug("[wait] " + delay + "ms");
        T.delay(function() {
          deferred.resolve(value);
        }, delay);

        return deferred.promise;
      },
      click: function(selector, optionalAction) {
        var deferred = Q.defer(),
            action = optionalAction || "click";

        U.waitDefault().then(function() {
          var e = $(selector);
          if (e.length == 0) {
            U.debug("[click] ", selector, " not found");
            throw new Error("Element '" + selector + "' not found");
          } else {
            U.debug("[" + action + "] ", e);
            e[action]();
            deferred.resolve();
          }
        });

        return deferred.promise;
      },
      resolvedDefer: function(value) {
        var deferred = Q.defer();

        deferred.resolve(value);
        return deferred.promise;
      },

      resolvedDeferWith: function(value) {
        return function() {
          return U.resolvedDefer(value);
        }
      }
    };

    var Navigation = window.Navigation = {
      currentCity: function() {
        return $("#btn_hab_name").text();
      },

      currentTab: function() {
        return $(".main .button.active").attr("title");
      },

      navigateTo: function(page) {
        var currentCity = Navigation.currentCity();
        var currentTab = Navigation.currentTab();

        var city = (page.city || currentCity).replace(/-/g, " ");
        var tab = page.tab || currentTab;

        function navigateToCity() {
          return U.click(".main .button[title='no-of-castles']")
            .then(function() {
              var cities = $(".habitatName"),
                  cityLink = null;

              cities.each(function() {
                if ($(this).text() == city) {
                  cityLink = $(this);
                }
              });

              if (!cityLink) {
                throw new Error("Target city " + city + " not found");
              }

              return U.click(cityLink);
            });
        }

        function navigateToTab() {
           return U.click(".main .button[title='" + tab + "']");
        }

        var promise = U.wait(200);

        // already in the selected city
        if (currentCity !== city) {
          promise = promise.then(navigateToCity);
        }

        if (currentTab !== tab) {
          promise = promise.then(navigateToTab);
        }

        return promise;
      }
    }
  })();

  function parseTimeMs(text) {
    var timeData = text.split(" - ")[0].split(":");
    var timeMs = ((parseInt(timeData[0], 10) * 60 + parseInt(timeData[1], 10)) * 60 + parseInt(timeData[2], 10)) * 1000;

    return timeMs;
  }

  function performMissions(action) {

    var SKIP_MISSION_NAMES = [  ];

    var startedStats = null;

    function isSkip(missionName) {
      for (var i = 0; i < SKIP_MISSION_NAMES.length; i++) {
        if (SKIP_MISSION_NAMES[i] == missionName) {
          return true;
        }
      }
      return false;
    }

    function navigateToCastle() {
      return Navigation.navigateTo({ tab: 'castle' });
    }

    function navigateToTavern() {
      var habitatLinkTitle = $(".habitatListItemTitle");
      var subPageTitle = $(".listTitle b");

      if (habitatLinkTitle.text() == "Tavern") {
        if (subPageTitle.text() != "Missions") {
          // Close view mission (what ever it is)
          $(".closeViewMission").click();
        }
        return U.resolvedDefer();
      } else {
        return U.click("#habitatView a.tavern");
      }
    }

    function uncheckMissions() {
      U.debug("[overtime] schedule start");

      $(".div_checkbox_missions input[type=checkbox]").prop("checked", false);

      return U.waitDefault();
    }

    function checkAndPerformMissions() {
      var startedCount = 0;
      var skipped = 0;

      while (true) {
        var e = $(".div_checkbox_missions input[type=checkbox]:not(:disabled):not(:checked)");

        if (e.length - skipped == 0) {
          break;
        }

        var checkbox = e.eq(0 + skipped);

        var missionName = checkbox.parents(".div_checkbox_missions").prev().find(".timeblock b").text();
        if (isSkip(missionName)) {
          skipped++;
        } else {
          checkbox.prop("checked", true);
          startedCount++;
        }
      }

      startedStats = { started: startedCount || 0, skipped: skipped };

      if (startedCount) {
        return U.click($("#btn_missions_start")).then(function() {
          U.debug("[overtime] executed, triggered ", startedCount, " new missions");
          U.resolvedDefer();
        });
      } else {
        return U.resolvedDefer();
      }
    }

    function reschedule() {
      var closestTimeMs = -1;

      var missionsLeft = $(".execute").length;
      if (missionsLeft && missionsLeft != startedStats.skipped) {
        closestTimeMs = 2000;
      } else {
        $(".resourceDetails .pictureButton:not(.noexecute)").parents(".resourceDetails.clickable").each(function() {
          var timestr = $(this).find(".timeblock span").text();
          if (timestr) {
            var timeMs = parseTimeMs(timestr);

            if (!isNaN(timeMs) && (closestTimeMs == -1 || timeMs < closestTimeMs)) {
              closestTimeMs = timeMs;
            }
          }
        });

        // no mission possible? check back in 4 minutes
        if (closestTimeMs == -1) {
          closestTimeMs = 1000 * 60 * 4;
        }
      }

      action.repeatIn(closestTimeMs + 10000);
    }

    var deferred = Q.defer();

    navigateToCastle()
      .then(navigateToTavern)
      .then(U.waitDefault)
      .then(uncheckMissions)
      .then(checkAndPerformMissions)
      .then(U.waitDefault)
      .then(reschedule)
      .then(function() {
        deferred.resolve(true);
      });

    return deferred.promise;
  }

  function EvolveCastlesAction(cities) {

    this.cities = cities;

    var self = this;

    this.resume = function evolveCastles(action) {
      return self._resume(action);
    };
  }

  EvolveCastlesAction.prototype = {

    _resume: function(action) {

      var self = this;
      var repeatIn = -1;

      function navigateToBuildingList() {
        return Navigation.navigateTo({ tab: "building-list" });
      }

      function repeatActionIn(newRepeatIn) {
          if (repeatIn == -1) {
            repeatIn = newRepeatIn;
          } else {
            repeatIn = Math.min(repeatIn, newRepeatIn);
          }
      }

      function evolve(city) {
        return function() {
          var deferred = Q.defer();
          if (Intel.canBuildMore(city)) {
            var nextUpgrade = Intel.getNextBuildingUpgrade(city);
            if (!nextUpgrade) {
              U.info("[evolve] no more upgrades for " + city);
              return U.resolvedDefer();
            }

            U.debug("[evolve] next upgrade is", nextUpgrade);
            Intel.performUpgrade(nextUpgrade.building, city).then(function(success) {
              U.debug("[evolve] started upgrade?", success);
              repeatActionIn(1000 * 60 * 2); // two minutes
              deferred.resolve();
            });
          } else {
            // cannot build more
            U.debug("[evolve] cannot build more!");
            repeatActionIn(1000 * 60 * 3); // three minutes
            deferred.resolve();
          }
          return deferred.promise;
        };
      }

      function updateRepeatIn() {
        action.repeatIn(repeatIn);
        return U.resolvedDefer();
      }

      var deferred = Q.defer();

      var promise = navigateToBuildingList();

      angular.forEach(self.cities, function(city) {
        promise = promise.then(evolve(city));
      });

      promise
        .then(updateRepeatIn)
        .then(function() {
          deferred.resolve();
        });

      return deferred.promise;
    }
  };

  function FarmAction(castles, config, callbackScope) {

    this.config = config;
    this.callbackScope = callbackScope;

    // init the action with the castles given
    this.init(castles);

    var self = this;

    this.resume = function resumeFarm(action) {
      return self._resume(action);
    };
  };

  FarmAction.prototype = {

    // logging /////////////////////////////////

    logAttackStartSuccess: function(attackerCity, target) {

      var status = this.status[attackerCity];
      status.outstanding--;
      status.attacked++;

      this.progress.outstanding--;
      this.progress.attacked++;

      U.info("[farm] attack ", attackerCity, " > ", target, "success");
    },

    logAttackStartFail: function(attackerCity, target, e) {

      var status = this.status[attackerCity];
      status.outstanding--;
      status.failed++;

      this.progress.outstanding--;
      this.progress.failed++;

      U.info("[farm] attack ", attackerCity, " > ", target, "failed: ", e);
    },

    // updating targets /////////////////////////////////

    updateTargetProcessed: function(attacker, target) {

      var targets = this.getFarmTargets(attacker);
      var removed = targets.shift();

      U.info("[farm] Processed: ", target, "; add ", removed, " to end of queue");
      targets.push(removed);
    },


    // initialization /////////////////////////////////

    init: function(castles) {

      var attackingCastles = [];
      var attackStatus = {};

      var totalAttacks = 0;

      for (var i = 0; i < castles.length; i++) {

        var castle = castles[i];
        var targets = this.getFarmTargets(castle);

        if (targets && targets.length) {
          attackingCastles.push(castle);

          var targetsForCastle = targets.length;

          attackStatus[castle] = { outstanding: targetsForCastle, attacked: 0, skipped: 0 };
          totalAttacks += targetsForCastle;
        }
      }

      this.castles = attackingCastles;
      this.status = attackStatus;

      this.progress = { outstanding: totalAttacks, attacked: 0, skipped: 0};
    },

    farm: function(city) {

      var self = this;
      var deferred = Q.defer();

      // clone map if open
      $("#mapCloseButtonContainer").click();

      var status = this.status[city];
      var targets = this.getFarmTargets(city).slice(0, status.outstanding);

      function attackNextOrStop(stop) {
        if (targets.length && stop !== false) {
          var next = targets.shift();
          self.farmTarget(city, next).then(attackNextOrStop);
        } else {
          deferred.resolve();
        }
      }

      Navigation
        .navigateTo({ tab: "building-list", city: city })
        .then(function() {
          var link = Intel.getCityLink(city);
          return U.click(link);
        })
        .then(U.waitDefault)
        .then(attackNextOrStop);

      return deferred.promise;
    },

    reschedule: function(action, oldProgress) {

      U.info("[farm] finished for now; ", oldProgress, "/", this.progress);

      if (this.hasMoreCastlesToStartAttacks()) {
        action.repeatIn(1000 * 60 * 5); // five minutes
        U.info("[farm] rechecking in 5 minutes");
      }

      return U.resolvedDefer();
    },

    _resume: function(action) {

      var castles = this.getCastlesWithWorkLeft();

      if (!castles.length) {
        return U.resolvedDefer();
      }

      var oldProgress = angular.copy(this.progress);

      var promise = U.wait(500);

      for (var i = 0; i < castles.length; i++) {
        var castle = castles[i];

        if (this.canResumeFarm(castle)) {
          U.info("[farm] +farm promise (", castle, ")");
          promise = promise.then(this.farmPromise(castle));
        }
      }

      U.info("[farm] +reschedule promise");
      return promise
        .then(this.reschedulePromise(action, oldProgress));
    },

    getFarmTargets: function(castle) {
      return (this.config.farmConfiguration[castle] || {}).targets;
    },

    getAttackComposition: function(castle) {
      return (this.config.farmConfiguration[castle] || {}).attackComposition;
    },

    hasMoreCastlesToStartAttacks: function() {
      return !!this.getCastlesWithWorkLeft().length;
    },

    getCastlesWithWorkLeft: function() {
      var castlesWithWorkLeft = [];

      for (var i = 0; i < this.castles.length; i++) {
        var castle = this.castles[i];

        if (this.hasWorkLeft(castle)) {
          castlesWithWorkLeft.push(castle);
        }
      }

      return castlesWithWorkLeft;
    },

    hasWorkLeft: function(city) {
      var farmStatus = this.status[city];
      return !!farmStatus.outstanding;
    },

    canResumeFarm: function(city) {
      var farmStatus = this.status[city];

      if (!this.hasWorkLeft(city)) {
        return false;
      }

      if (!farmStatus.pauseUntil) {
        return true;
      } else {
        var now = new Date();

        if (now.getTime() <= farmStatus.pauseUntil.getTime()) {
          farmStatus.pauseUntil = null;
          return true;
        } else {
          return false;
        }
      }
    },

    inProgress: function() {
      return this.progress && this.progress.outstanding > 0;
    },

    // promises /////////////////////////////////////////////////////

    farmTarget: function(city, target) {
      var self = this;
      var attackComposition = self.getAttackComposition(city);

      var e = $("#" + target.id);
      if (!e.length) {
        U.info("[farm]", target, "not found. skipping");
        self.updateTargetProcessed(city, target);
        return U.resolvedDefer(true);
      }

      return U.click(e, "mouseup")
        .then(function() {
          if ($(".headLineAttackLabel").text() == "Attack") {
            // already on attack page
            return U.resolvedDefer();
          } else {
            return U.click("#foreign_attack_click");
          }
        })
        .then(function() {
          var totalUnitCount = 0;
          var attackUnits = [];

          var attackElements = $(".mapMaxButton:not(#silverMax):not(#unitMax7):not(#unitMax6)");
          var i = 0;

          attackElements.each(function() {
            var e = $(this);
            var currentUnitMax = attackComposition[i++];
            var available = +e.siblings(".unitsInputCount").text();
            var toBeSent = Math.floor(Math.min(currentUnitMax, available));

            attackUnits.push(toBeSent);
            totalUnitCount += toBeSent;
          });

          if (totalUnitCount >= 25) {
            var i = 0;

            U.info("[farm] with ", totalUnitCount, " (composition: ", attackUnits, ")");

            attackElements.each(function() {
              $(this).siblings(".unitsInput").val(attackUnits[i++]).blur();
            });

            return U.click("#attackButton").then(U.resolvedDeferWith(true));
          } else {
            U.info("[farm] pause; only ", totalUnitCount, " units (composition: ", attackUnits, ")");
            return U.resolvedDefer(false);
          }
        }, function(e) {
          self.logAttackStartFail(city, target, e);
          return U.resolvedDefer();
        })
        .then(function(success) {
          var processed = false;

          if (success === true) {
            processed = true;
            self.logAttackStartSuccess(city, target);
          }

          // error
          if (success === undefined) {
            processed = true;
          }

          if (processed) {
            self.updateTargetProcessed(city, target);
          }

          return U.resolvedDefer(success);
        });
    },

    farmPromise: function(city) {

      var self = this;

      return function() {
        return self.farm(city);
      };
    },

    reschedulePromise: function(action, attackCount) {

      var self = this;

      return function() {
        return self.reschedule(action, attackCount);
      };
    }
  };

  //function exchangeStone() {
  //  $(".main .button[title=castle]").click();
  //  T.delay(function() {
  //    $("#habitatView a.market").click();
  //    T.delay(function() {
  //      $(".marketplace").eq(1).click();
  //      T.delay(function() {
  //        U.debug("Trading goods (5 people, ");
  //        $(".material_unit").eq(0).val(5).blur();
  //
  //        var material = $(".material_resource").eq(0).parents(".material");
  //        var maxResources = parseInt($(material).find(".value").text());
  //        $(material).find(".material_resource").val(maxResources > 60 ? 60 : maxResources).blur();
  //
  //        $(".changeAction").click();
  //        var delay = 1000 * 60 * 60 * 2 + 30000;
  //
  //        U.debug("Repeat at: " + new Date(new Date().getTime() + delay));
  //        timers.exchangeStone = T.delay(function() {
  //          exchangeStone();
  //        }, delay);
  //      }, 1000);
  //    }, 1000);
  //  }, 1000);
  //};

  var AutomateController = window.AutomateController = function($scope, $location, $routeParams, $route) {
    var shown = $scope.shownComponents = {};

    var actions = $scope.actions = new Actions($scope);

    $scope.cities = [];

    $scope.city = null;
    $scope.tab = null;

    $scope.toggleShow = function(component) {
      shown[component] = !shown[component];
    };

    $scope.show = function(component) {
      shown[component] = true;
    };

    $scope.hide = function(component) {
      shown[component] = false;
    };

    $scope.shown = function(component) {
      return shown.controls && shown[component];
    };

    $scope.openCls = function(component) {
      return $scope.shown(component) ? 'active' : '';
    };

    $scope.inActionCls = function() {
      return $scope.inAction() ? 'in-action' : '';
    };

    $scope.farmInProgress = function() {
      return $scope.farmAction && $scope.farmAction.inProgress();
    };

    $scope.farmStatus = function() {
      if (!$scope.farmAction) {
        return "off";
      }

      var status = $scope.farmAction.progress;
      return status.outstanding + "/" + status.attacked + "/" + status.skipped;
    };

    $scope.stopFarm = function() {
      actions.unschedule($scope.farmAction.resume); $scope.farmAction = null;
    };

    $scope.startFarm = function() {
      if ($scope.farmInProgress()) {
        return;
      }

      var farmAction = $scope.farmAction = new FarmAction($scope.cities, C, $scope);

      actions.schedule(farmAction.resume, 1000);
    },

    $scope.automateEnabled = function() {
      return actions.enabled;
    };

    $scope.nextAction = function() {
      return actions.nextAction;
    };

    $scope.inAction = function() {
      return !!actions.currentAction;
    };

    $scope.enable = function() {
      var search = $location.search();

      var automate = search.automate;

      var automateMissions = true;
      var automateBuild = true;

      if (automate && automate !== true) {
        if (automate.indexOf("missions") === -1) {
          automateMissions = false;
        }

        if (automate.indexOf("build") === -1) {
          automateBuild = false;
        }
      }

      if (automateMissions) {
        angular.forEach($scope.cities, function(city) {
          actions.schedule(performMissions, 2000, city);
        });
      }

      if (automateBuild) {
        var action = new EvolveCastlesAction($scope.cities);
        actions.schedule(action.resume, 4000);
      }

      actions.enable();

      if (!automate) {
        search.automate = true;
        $location.search(search);
      }
    };

    $scope.disable = function() {
      actions.disable();
      actions.purge();

      var search = $location.search();
      delete search.automate;

      $location.search(search);
    };

    $scope.updateLocation = function(data) {
      var city = data.city || $routeParams.city || $scope.city;
      if (city) {
        $scope.city = city.replace(/-/g, " ");
      }

      $scope.tab = data.tab || $routeParams.tab;

      $location.path("/" + $scope.city.replace(/ /g, "-") + "/" + $scope.tab);

      T.delay(function() {
        $scope.$apply();
        $scope.$digest();
      });
    }

    $scope.timeUntilScheduled = function(action) {
      var diff = action.scheduledAt - new Date().getTime();

      if (diff > 0) {
        if (diff > 1000 * 60) {
          return "in " + Math.floor(diff / (1000 * 60)) + "min";
        } else
        if (diff > 1000) {
         return "in " + Math.floor(diff / 1000) + "s";
        } else {
          return "in " + diff + "ms";
        }
      } else {
        return "now!";
      }
    };

    // ::::::::::::::: page initialization :::::::::::::::::::

    $(".main .button").each(function() {
      var e = $(this),
          title = e.attr("title").toLowerCase().replace(/ /g, "-").replace(/\./g, "");
      e.attr("title", title);
    }).on("click", function() {
      var e = $(this);
      $scope.updateLocation({ tab: e.attr("title") });
    });

    function updateLocation(event) {
      $scope.updateLocation({ city: Navigation.currentCity() });
    };

    function registerEventHandlers() {
      $(document).on("click", "#nextHabitat", updateLocation);
      $(document).on("click", "#previousHabitat", updateLocation);
      $(document).on("click", ".castle_list", updateLocation);

      var customCities = $location.search().cities;
      if (customCities) {
        customCities = customCities.split(/,/);
        angular.forEach(customCities, function(e, i) {
          customCities[i] = e.replace(/-/g, " ");
        });

        U.info("[automation] Using custom cities: ", customCities);
      }

      var loadCityNames = customCities ? U.resolvedDefer(customCities) : Intel.getCityNames();

      loadCityNames.then(function(cities) {

        $scope.cities = cities;

        T.delay(function() {
          $scope.$apply();
          $scope.$digest();
        });

        // navigate to stuff
        Navigation.navigateTo({ city: $routeParams.city, tab: $routeParams.tab }).then(function() {
          if ($location.search().automate) {
            $scope.enable();

            U.info("[automation] Autostart automation");
          }
        });
      });
    }

    T.delay(registerEventHandlers, 1000);
  };

  var BuildingUpgradesController = window.BuildingUpgradesController = function($scope, $location, $routeParams) {

    $scope.buildings = C.buildings;
    $scope.technologies = C.technologies;

    $scope.cityUpgrades = C.cityUpgrades;

    $scope.nextUpgrade = null;
    $scope.nextTechnologyUpgrade = null;

    $scope.elements = function() {
      return $scope.cityUpgrades;
    };

    $scope.removeUpgrade = function(index) {
      $scope.cityUpgrades.splice(index, 1);
    };

    $scope.addUpgrade = function(upgrade, index) {
      if (index !== undefined) {
        $scope.cityUpgrades.splice(index, 0, upgrade);
      } else {
        $scope.cityUpgrades.push(upgrade);
      }
    };

    $scope.upgradeLevel = function(upgrade, index) {
      var level = 1;
      angular.forEach($scope.cityUpgrades, function(e, i) {
        if (i < index && e.name == upgrade.name) {
          level++;
        }
      });

      return level + 1;
    };

    $scope.markedClass = function(index) {
      if (($scope.nextUpgrade && $scope.nextUpgrade.index == index) ||
          ($scope.nextTechnologyUpgrade && $scope.nextTechnologyUpgrade.index == index)) {
        return "next-upgrade";
      }

      return "";
    };

    $scope.$watch(function() { return $scope.tab; }, function(newValue) {
      if (newValue == "building-list") {
        $scope.nextUpgrade = Intel.getNextBuildingUpgrade($scope.city);
      }
    });
  };

  var AttackController = window.AttackController = function($scope) {

    $scope.attackActions = {};

    $scope.farmConfiguration = C.farmConfiguration;

    $scope.currentAttacks = null;

    $scope.attackTargets = null;
    $scope.attackComposition = null;

//
//    $(document).on("click", ".habitatContainer clickRectangle", function(event) {
//      $scope.mapSelectedCity = $(this).attr("id");
//    });
//
//    $scope.onLeave({ tab: "map" }, function() {
//
//    });
//
//    $scope.offerOptions("map", {
//      calculateDistances: function() {
//
//      }
//    });

    $scope.elements = function() {
      return $scope.attackTargets;
    };

    function captureHabitatClick(event, city) {
      $scope.$apply(function() {
        $scope.attackTargets.push(city);
        $("#" + city.id).addClass("click-captured-city");
      });
    }

    $scope.$watch("attackComposition", function(newValue) {
      if (newValue && $scope.city) {
        $scope.farmConfiguration[$scope.city].attackComposition = newValue;
      }
    });

    $scope.$watch("city", function(city) {
      if (!city) {
        return;
      }
      var farmConfig = $scope.farmConfiguration[city];

      if (!farmConfig) {
        farmConfig = $scope.farmConfiguration[city] = { attackComposition: C.defaults.attackComposition, targets: [] };
      }

      $scope.attackTargets = farmConfig.targets;
      $scope.attackComposition = farmConfig.attackComposition;

      $scope.currentAttacks = $scope.attackActions[city];
    });

    $scope.$watch("shownComponents.controls", function(newVal, oldVal) {
      if (newVal) {
        $(document).off("click-habitat");
      }
    });

    $scope.startCaptureTargets = function() {
      $(document).on("click-habitat", captureHabitatClick);
      $scope.hide("controls");
      Navigation.navigateTo({ tab: "map" });
    };

    $scope.highlightCaptured = function() {

      $scope.hide("controls");

      Navigation.navigateTo({ tab: "map" })
        .then(U.waitDefault)
        .then(function() {
          angular.forEach($scope.attackTargets, function(e) {
            $("#" + e.id).addClass("click-captured-city");
          });
        });
    };

    $scope.clearTargets = function() {
      if ($scope.city) {
        $scope.attackTargets = $scope.farmConfiguration[$scope.city].targets = [];
      }
    };

    $scope.removeTarget = function(index) {
      $scope.attackTargets.splice(index, 1);
    };
  };

  var OptionsController = window.OptionsController = function($scope, $location, $timeout) {

    $scope.save = function() {
      Storage.put("farmConfiguration", angular.copy(C.farmConfiguration));
      Storage.put("cityUpgrades", angular.copy(C.cityUpgrades));
    };

    $scope.applyCustomCities = function() {
      var search = $location.search();

      if ($scope.customCities) {
        search.cities = $scope.customCities;
      } else {
        delete search.cities;
      }

      $location.search(search);
    };

    $scope.applyCustomAutomate = function() {
      var search = $location.search();

      if ($scope.customAutomate) {
        search.automate = $scope.customAutomate;
      } else {
        delete search.automate;
      }

      $location.search(search);
    };
  };

  var EditableListController = window.EditableListController = function($scope) {

    // mark and edit support
    function elements() {
      return $scope.elements();
    }

    $scope.markedIndex = null;

    function moveUpMarked(jump) {
      var newIndex = $scope.markedIndex - (jump ? 5 : 1);
      newIndex = Math.max(newIndex, 0);

      var removedElements = elements().splice($scope.markedIndex, 1);
      elements().splice(newIndex, 0, removedElements[0]);
      $scope.markedIndex = newIndex;
    }

    function moveDownMarked(jump) {

      var newIndex = $scope.markedIndex + (jump ? 5 : 1);
      newIndex = Math.min(newIndex, elements().length - 1);

      var removedElements = elements().splice($scope.markedIndex, 1);
      elements().splice(newIndex, 0, removedElements[0]);
      $scope.markedIndex = newIndex;
    }

    function handleKeyPress(e) {
      $scope.$apply(function() {
        switch (e.which) {
          case 38:
            moveUpMarked(e.shiftKey);
            break;
          case 40:
            moveDownMarked(e.shiftKey);
            break;
          case 27:
            $scope.markedIndex = null;
            break;
        }
      });
    }

    $scope.$watch("markedIndex", function(newValue, oldValue) {
      if (newValue && (oldValue !== 0) && !oldValue) {
        $(document).on("keyup", handleKeyPress);
      } else
      if (oldValue && (newValue !== 0) && !newValue) {
        $(document).off("keyup", handleKeyPress);
      }
    });

    $scope.markedClass = function(index) {
      var cls = (index == $scope.markedIndex ? "marked" : "");

      if ($scope.$parent.markedClass) {
        var prntCls = $scope.$parent.markedClass(index);
        if (prntCls) {
          cls += " " + prntCls;
        }
      }
      return cls;
    };

    $scope.toggleMark = function(index) {
      if ($scope.markedIndex == index) {
        $scope.markedIndex = null;
      } else {
        $scope.markedIndex = index;
      }
    };
  };

  var content = $('<div ng-app>\
      <div ng-controller="AutomateController">\
        <div id="automate-overlay" ng-class="inActionCls()" ng-show="inAction()"></div>\
        <div id="automate-controls">\
          <div class="menu control-box">\
            <span ng-hide="shown(\'controls\')">\
              <button ng-click="show(\'controls\')">&raquo;</button>\
            </span>\
            <span ng-show="shown(\'controls\')">\
              <button ng-click="hide(\'controls\')">&laquo;</button>\
              <button ng-click="toggleShow(\'building-upgrades\')" ng-class="openCls(\'building-upgrades\')">b</button>\
              <button ng-click="toggleShow(\'attack\')" ng-class="openCls(\'attack\')">a</button>\
              <button ng-click="toggleShow(\'options\')" ng-class="openCls(\'options\')">o</button>\
            </span>\
            <button ng-show="automateEnabled()" ng-click="disable()" class="active">!</button>\
            <button ng-hide="automateEnabled()" ng-click="enable()">!</button>\
            <button ng-hide="farmInProgress()" ng-click="startFarm()">!!</button>\
            <button ng-show="farmInProgress()" ng-click="stopFarm()" class="active">!! {{farmStatus()}}</button>\
          </div>\
          <div ng-show="shown(\'controls\')" ng-switch on="automateEnabled()" class="status control-box">\
            <span ng-switch-when="true">\
              next <code>{{nextAction().name}}</code> <span ng-show="nextAction().city">for <code>{{nextAction().city}}</code></span> {{ timeUntilScheduled(nextAction()) }}\
            </span>\
            <span ng-switch-when="false">\
              no scheduled actions\
            </span>\
          </div>\
          <div class="building-upgrades control-box" ngm-if="shown(\'building-upgrades\')">\
            <div ng-controller="BuildingUpgradesController">\
              <h3>Building upgrades</h3>\
              <ul ng-controller="EditableListController">\
                <li ng-repeat="upgrade in cityUpgrades" ng-class="markedClass($index)" title="Upgrade #{{$index}}" ng-click="toggleMark($index)">\
                  <span ng-switch on="upgrade.type">\
                    <span class="technology" ng-switch-when="technology">\
                      {{upgrade.name}} (lib_lvl {{upgrade.libraryLevel}})\
                      <div style="float:right">\
                        <button ng-click="removeUpgrade($index)">-</button>\
                      </div>\
                    </span>\
                    <span ng-switch-when="building">\
                      {{upgrade.name}} (Level {{ upgradeLevel(upgrade, $index) }})\
                      <div style="float:right">\
                        <button ng-click="removeUpgrade($index)">-</button>\
                        <button ng-click="addUpgrade(upgrade, $index)">+</button>\
                      </div>\
                    </span>\
                  </span>\
                </li>\
              </ul>\
              <div class="box">\
                <select ng-model="nextUpgrade" ng-options="building.name for building in buildings"></select>\
                <button ng-click="addUpgrade(nextUpgrade)">+</button>\
              </div>\
              <div class="box">\
                <select ng-model="nextTechnologyUpgrade" ng-options="technology.name for technology in technologies"></select>\
                <button ng-click="addUpgrade(nextTechnologyUpgrade)">+</button>\
              </div>\
              <div class="box">\
                <textarea style="width: 190px; height: 40px; overflow: hidden; border: none; padding: 5px; background: #EEE;">{{cityUpgrades }}</textarea>\
              </div>\
            </div>\
          </div>\
          <div class="attack-upgrades control-box" ng-show="shown(\'attack\')">\
            <div ng-controller="AttackController">\
              <h3>Attacks for {{city}}</h3>\
              <div style="margin-top: 10px">\
                <button ng-click="startCaptureTargets()">capture</button>\
                <button ng-click="highlightCaptured()">highlight</button>\
                <button ng-click="clearTargets()">clear</button>\
              </div>\
              <div style="margin-top: 10px">\
                comp <input attack-composition ng-model="attackComposition" class="attack-composition-field" />\
              </div>\
              <ul ng-controller="EditableListController">\
                <li ng-repeat="city in attackTargets" ng-class="markedClass($index)" ng-click="toggleMark($index)">\
                  {{city.name}} ({{city.points}} Points)\
                  <div style="float:right">\
                    <button ng-click="removeTarget($index)">-</button>\
                  </div>\
                </li>\
              </ul>\
              <div class="box">\
                <textarea style="width: 190px; height: 40px; overflow: hidden; border: none; padding: 5px; background: #EEE;">{{attackTargets}}</textarea>\
              </div>\
            </div>\
          </div>\
          <div class="options control-box" ng-show="shown(\'options\')">\
            <div ng-controller="OptionsController">\
              <h3>Options</h3>\
              <div style="margin-top: 10px">\
                <button ng-click="save()">save</button>\
              </div>\
              <div style="margin-top: 10px">\
                 <input placeholder="cities to automate" ng-model="customCities" />\
                 <button ng-click="applyCustomCities()">apply</button>\
              </div>\
              <div style="margin-top: 10px">\
                 <input placeholder="actions to automate" ng-model="customAutomate" />\
                 <button ng-click="applyCustomAutomate()">apply</button>\
              </div>\
            </div>\
          </div>\
        </div>\
      </div>\
      <div ng-view></div>\
    </div>');

  $(document).on("click", ".habitatContainer .clickRectangle", function(e) {

    var element = $(this);

    T.delay(function() {

      var base = $("#foreignHabitatView"),
          foreign;

      if (base.length) {
        foreign = true;
      } else {
        base = $("#ownHabitatView");
        foreign = false;
      }

      var city = {
        foreign: foreign,
        name: $(".habitatHeadlineName", base).text(),
        id: element.attr("id"),
        points: $(".habitatHeadlinePoints", base).text().split(" ")[0]
      };

      $(document).trigger("click-habitat", city);
    }, 300);
  });

  function attackCompositionDirective() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {

        function toString(array) {
          var str = "";

          angular.forEach(array, function(e, i) {
            if (i != 0) {
              str += "/";
            }

            str += e;
          });

          return str;
        }

        function toNumberArray(str, convertFn) {
          if (!convertFn) {
            throw new Error("no convertFn given");
          }

          var array = str.split(/\s*\/\s*/);
          var parseFail = false;

          angular.forEach(array, function(e, i) {
            var n = convertFn(e);
            if (isNaN(n)) {
              parseFail = true;
            }

            array[i] = n;
          });

          return parseFail ? null : array;
        }

        ngModel.$parsers.push(function(val) {
          var config = toNumberArray(val, parseInt);
          var valid = angular.isArray(config) && config.length == 6;

          ngModel.$setValidity("attackComposition", valid);
          if (!valid) {
            return ngModel.$modelValue;
          } else {
            return config;
          }
        });

        ngModel.$formatters.push(function(val) {
          return toString(val);
        });
      }
    };
  }

  content.appendTo("body");

  T.delay(function() {

    var DefaultController = window.DefaultController = function($scope) { };

    var automateJs = angular.module("automate.js", [ "ng" ]);

    automateJs
      .directive('attackComposition', attackCompositionDirective)
      .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/:city/:tab', {
          template: "<div></div>",
          controller: DefaultController
        });

        $routeProvider.otherwise({ redirectTo: '/Gars-Bu/castle' });
      }]);

    angular.bootstrap(content, [ "automate.js" ]);
  }, 300);
})();