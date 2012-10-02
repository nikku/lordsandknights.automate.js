// ==UserScript==
// @matches http://browser.lordsandknights.com/*
// @name Lords and Knigths Automation
// ==/UserScript==

/** automator implementation */

(function() {
  
  (function() {

    var Action = function(fn, scheduledAt) {
      this.fn = fn;
      this.scheduledAt = scheduledAt;
      this.repeatMs = null;
      this.name = this.fn.name;
    };

    Action.prototype = {
      log: function() {
        console.log("Action ", fn, " due at ", new Date(this.scheduledAt));
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
      schedule: function(fn, delay) {
        var action = new Action(fn, new Date().getTime() + delay);

        console.log("[actions] new action ", action, " at ", new Date(action.scheduledAt));

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
        this.enabled = true;
        this.updateTimer();
      }, 

      purge: function() {
        this.scheduledActions = [];
      }, 
      
      updateTimer: function() {
        if (!this.enabled) {
          return;
        }
        
        var next = null;

        console.log("[actions] update timer", this.scheduledActions);

        $.each(this.scheduledActions, function(i, e) {
          if (!next) {
            next = e;
          } else 
          if (next.scheduledAt > e.scheduledAt) {
            next = e;
          }
        });

        console.log("[actions] next is ", next);
        if (this.timer) {
          T.cancel(this.timer);
        }

        this.setNextAction(next);
      }, 

      carryOutAction: function(action) {
        console.log("[carry out action] ", action, " started");

        var self = this;
        self.scheduledActions.splice(self.scheduledActions.indexOf(action), 1);

        self.setCurrentAction(action);

        U.wait(1000).then(function() {
          action.fn(action).then(function() {
            console.log("[actions] ", action, " finished");
            if (action.repeatMs) {
              self.rescheduleAction(action, new Date().getTime() + action.repeatMs);
              action.repeatMs = null;
            }
            self.setCurrentAction(null);
          }).fail(function(e) {
            console.log("[actions] ", action, "not completed due to", e);
            self.rescheduleAction(action, action.scheduledAt + 10000);
            
            self.setCurrentAction(null);
          }); 
        });
      }, 

      rescheduleAction: function(action, scheduledAt) {
        action.scheduledAt = scheduledAt;
        
        console.log("[actions] reschedule", action, "to", new Date(scheduledAt));
        this.scheduledActions.push(action);
        this.updateTimer();
      }, 

      unschedule: function(fn) {
        
        var indexOfAction = -1;
        
        angular.forEach(this.scheduledActions, function(e, i) {
          if (e.fn == fn) {
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
      attackTargets: Storage.get("attackTargets") || { "Gars Bu" : [{"foreign":true,"name":"Bimbi","id":"hab_64657","points":"20"},{"foreign":true,"name":"Mytho","id":"hab_62910","points":"15"},{"foreign":true,"name":"eigen6","id":"hab_63783","points":"13"},{"foreign":true,"name":"Free castle 65542","id":"hab_65542","points":"33"},{"foreign":true,"name":"Free castle 63782","id":"hab_63782","points":"34"},{"foreign":true,"name":"Free castle 64658","id":"hab_64658","points":"33"},{"foreign":true,"name":"Free castle 64660","id":"hab_64660","points":"32"},{"foreign":true,"name":"Bafur","id":"hab_64659","points":"17"},{"foreign":true,"name":"Free castle 63778","id":"hab_63778","points":"37"},{"foreign":true,"name":"eigen5","id":"hab_63779","points":"13"},{"foreign":true,"name":"Free castle 63784","id":"hab_63784","points":"37"},{"foreign":true,"name":"Free castle 65544","id":"hab_65544","points":"33"},{"foreign":true,"name":"Free castle 62043","id":"hab_62043","points":"34"},{"foreign":true,"name":"Kaida","id":"hab_62908","points":"13"},{"foreign":true,"name":"Free castle 64656","id":"hab_64656","points":"33"}] }, 
      attackComposition: [ 6, 6, 6, 6, 6, 15]
    };
    
    var Intel = window.Intel = {
      getCurrentCityName: function() {
        return $("#btn_hab_name").text();
      }, 
      getBaseForCurrentCity: function() {
        var currentCity = Intel.getCurrentCityName();
        var base = null;
        
        $(".nameDelimiter").each(function() {
          if ($(this).text() == currentCity) {
            base = $(this).parents(".level").parent();
          }
        });
        
        if (!base) {
          throw new Error("No base found");
        }
        
        return base;
      }, 
      
      getBuildingsLevelInfo: function() {
        var base = Intel.getBaseForCurrentCity();
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
            console.log(e.text(), "Does not match");
          }
        });
        
        return buildings;
      }, 
      
      canBuildMore: function() {
        var base = Intel.getBaseForCurrentCity();
        return base.find(".speedupBuildingUpgrade, .finishBuildingUpgrade").length < 2 && 
          base.find(".build").length > 1;
      }, 
      
      performUpgrade: function(upgrade) {
        
        var deferred = Q.defer();
        
        var index = C.buildings.indexOf(upgrade);
        var base = Intel.getBaseForCurrentCity();
        
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
      
      getNextBuildingUpgrade: function() {
        var buildingInfos = Intel.getBuildingsLevelInfo();
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
      wait: function(delay) {
        var deferred = Q.defer();

        console.log("[wait] " + delay + "ms");
        T.delay(function() {
          deferred.resolve();
        }, delay);

        return deferred.promise;
      }, 
      click: function(selector, optionalAction) {
        var deferred = Q.defer(), 
            action = optionalAction || "click";
        
        U.wait(1000).then(function() {
          var e = $(selector);
          if (e.length == 0) {
            console.log("[click] ", selector, " not found");
            throw new Error("Element '" + selector + "' not found");
          } else {
            console.log("[" + action + "] ", e);
            e[action]();
            deferred.resolve();
          }
        });

        return deferred.promise;
      }, 
      resolvedDefer: function() {
        var deferred = Q.defer();

        deferred.resolve();
        return deferred.promise;
      }
    };
  })();

  function parseTimeMs(text) {
    var timeData = text.split(" - ")[0].split(":");
    var timeMs = ((parseInt(timeData[0], 10) * 60 + parseInt(timeData[1], 10)) * 60 + parseInt(timeData[2], 10)) * 1000;

    return timeMs;
  }

  function performMissions(action) {
    var viewMission = $(".closeViewMission");
    if (viewMission.length) {
      // Close view mission (what ever it is)
      viewMission.click();
    }
    
    return U.click(".main .button[title=castle]")
      .then(function() {
        return U.click("#habitatView a.tavern");
      })
      .then(function() {
        var deferred = Q.defer(), 
            clickDelay = 2000, 
            startMissionPromises = [],
            i = 0;
        
        startMissionPromises.push(U.wait((i + 1) * clickDelay).then(function() {
          console.log("[overtime] schedule start");
          var e = $(".div_checkbox_missions input[type=checkbox]:not(:disabled):not(:checked)");
          while (e.length) {
            e.eq(0).prop("checked", true);
            
            e = $(".div_checkbox_missions input[type=checkbox]:not(:disabled):not(:checked)");
          }
          
          e = $(".div_checkbox_missions input[type=checkbox]:checked");
          
          if (e.length) {
            i = e.length;
            return U.click($("#btn_missions_start"));
          } else {
            return U.resolvedDefer();
          }
        }));

        Q.all(startMissionPromises).then(function() {
          console.log("[overtime] executed, triggered ", i, " new missions");

          U.wait(5000).then(function() {
            var closestTimeMs = -1;

            if ($(".execute").length) {
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

            action.repeatIn(closestTimeMs + 2000);
            deferred.resolve();
          });
        });

        return deferred.promise;
      });
  };

  function evolveCastel(action) {
    // Navigate to buildings page
    return U.click(".main .button[title='building-list']").then(function() {
      var deferred = Q.defer();
        
      if (Intel.canBuildMore()) {
        var nextUpgrade = Intel.getNextBuildingUpgrade();
        if (!nextUpgrade) {
          throw new Error("Building upgrade is null");
        }
        
        console.log("[evolve] next upgrade is", nextUpgrade);
        Intel.performUpgrade(nextUpgrade.building).then(function(success) {
          console.log("[evolve] started upgrade?", success);
          action.repeatIn(1000 * 60 * 2); // two minutes
          deferred.resolve();
        });
      } else {
        // cannot build more
        console.log("[evolve] cannot build more!");
        action.repeatIn(1000 * 60 * 3); // three minutes
        deferred.resolve();
      }
      return deferred.promise;
    });
  };

  function tradeSilver(action) {
    // too many resources?
    if ("asddsa") {
      // asdsda
      
    }
  };
  
  function AttackCastleBuilder(scope, castels) {
    
    var castlesToAttack = castels;
    var attackedCastles = [];

    this.doneCount = 0;
    this.inProgress = true;
    
    var self = this;
    
    var internalAction = function attackCastle(action) {

      this.doneCount = function() {
        return self.doneCount;
      };
      
      this.inProgress = function() {
        return self.inProgress;
      };

      if (attackedCastles.length < castlesToAttack.length) {
        var gotoMapsPage = (self.onMapsPage ? U.click("#mapCloseButtonContainer") : U.click(".main .button[title=map]").then(function() { return U.wait(4000); }));
        var currentCastle = castlesToAttack[0];

        console.log("[attack]", (castlesToAttack.length - attackedCastles.length), " attacks left. Next target is ", currentCastle);

        return gotoMapsPage.then(function() {
          return U.click("#" + currentCastle.id, "mouseup");
        }).then(function() {
          if ($(".headLineAttackLabel").text() == "Attack") {
            // already on attack page
            return U.resolvedDefer();
          } else {
            return U.click("#foreign_attack_click");
          }
        }).then(function() {

          var attackComposition = C.attackComposition;
          
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

            console.log("[attack] with ", totalUnitCount, " (composition: ", attackUnits, ")");

            attackElements.each(function() {
              $(this).siblings(".unitsInput").val(attackUnits[i++]).blur();
            });

            return U.click("#attackButton").then(function() {
              // append castle to end
              castlesToAttack.splice(0, 1);
              castlesToAttack.push(currentCastle);

              attackedCastles.push(currentCastle);
              action.repeatIn(1000); 
              console.log("[attack] started");
              self.doneCount++;

              return U.resolvedDefer();
            });
          } else {
            console.log("[attack] postponed: not enough troops");
            action.repeatIn(1000 * 60 * 10); // ten minutes
            return U.resolvedDefer();
          }
        });
      } else {
        console.log("[attack] finished: no more castels to attack");
        self.inProgress = false;
        return U.resolvedDefer();
      }
    };
    
    this.action = function() {
      return internalAction;
    };
  };
  
  //function exchangeStone() {
  //  $(".main .button[title=castle]").click();
  //  T.delay(function() {
  //    $("#habitatView a.market").click();
  //    T.delay(function() {
  //      $(".marketplace").eq(1).click();
  //      T.delay(function() {
  //        console.log("Trading goods (5 people, ");
  //        $(".material_unit").eq(0).val(5).blur();
  //        
  //        var material = $(".material_resource").eq(0).parents(".material");
  //        var maxResources = parseInt($(material).find(".value").text());
  //        $(material).find(".material_resource").val(maxResources > 60 ? 60 : maxResources).blur();
  //        
  //        $(".changeAction").click();
  //        var delay = 1000 * 60 * 60 * 2 + 30000;
  //        
  //        console.log("Repeat at: " + new Date(new Date().getTime() + delay));
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
      actions.schedule(performMissions, 2000);
      actions.schedule(evolveCastel, 4000);
      // actions.schedule(tradeResources, 10000);
      actions.enable();
    };
    
    $scope.disable = function() {
      actions.disable();
      actions.purge();
    };
    
    $scope.updateLocation = function(data) {
      
      if (data.city) {
        data.city = data.city.replace(/ /g, "-");
      }
      
      $scope.currentLocation = { city: (data.city || $routeParams.city), tab: (data.tab || $routeParams.tab) };
      
      $location.path("/" + $scope.currentLocation.city + "/" + $scope.currentLocation.tab);
    }
    
    $scope.navigateTo = function(city, tab) {
      var nextCityButton = $("#nextHabitat"), 
          cityInView = city.replace(/-/g, " ");
      
      T.delay(function() {
        $(".main .button[title=" + tab + "]").click();
        goNext();
      });

      function goNext() {
        if (Intel.getCurrentCityName() == cityInView) {
          return;
        }
        
        var nextCityButton = $("#nextHabitat");
        if (nextCityButton.is(".disabled")) {
          return;
        } else {
          nextCityButton.click();
          T.delay(function() {
            goNext();
          }, 1000);
        }
      }
    };
    
    // ::::::::::::::: page initialization :::::::::::::::::::
    
    $(".main .button").each(function() {
      var e = $(this),
          title = e.attr("title").toLowerCase().replace(/ /g, "-");
      
      e.attr("title", title);
    }).on("click", function() {
      var e = $(this);
      
      T.delay(function() {
        $scope.$apply(function() {
          $scope.updateLocation({ tab: e.attr("title") });
        });
      }, 500);
    });
    
    function registerUpdateLocation() {

      function updateLocation(event) {
        T.delay(function() {
          $scope.$apply(function() {
            $scope.updateLocation({ city: Intel.getCurrentCityName() });
            $("#nextHabitat, #previousHabitat").click(updateLocation);
          });
        }, 1000);
      };
      
      $("#nextHabitat, #previousHabitat").click(updateLocation);
      
      $scope.$apply(function() {
        $scope.navigateTo($routeParams.city, $routeParams.tab);
      });
    }
    
    T.delay(registerUpdateLocation, 1000);
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

    $scope.addUpgrade = function(upgrade) {
      $scope.cityUpgrades.push(upgrade);
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

    $scope.$watch(function() { return $scope.currentLocation; }, function(newValue) {
      if ((newValue || {}).tab == "building-list") {
        $scope.nextUpgrade = Intel.getNextBuildingUpgrade();
      }
    });
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
  
  var AttackController = window.AttackController = function($scope) {
    
    $scope.cities = [];
    $scope.currentCity = Intel.getCurrentCityName();

    $scope.currentAttacks = null;
    $scope.attackTargets = [];

    $scope.elements = function() {
      return $scope.attackTargets;
    };

    function captureHabitatClick(event, city) {
      $scope.$apply(function() {
        $scope.attackTargets.push(city);
        $("#" + city.id).addClass("click-captured-city");
      });
    }

    $scope.$watch("currentLocation", function(newVal) {
      if (newVal && $scope.currentAttacks) {
        $scope.currentAttacks.onMapsPage = (newVal.tab == "map");
      }
    });

    $scope.$watch("currentCity", function(newValue) {
      if (newValue) {
        console.log("Change " + newValue);
        if (!C.attackTargets[newValue]) {
          C.attackTargets[newValue] = [];
        }
        
        $scope.attackTargets = C.attackTargets[newValue];
      }
    });

    $scope.$watch(function() { return $scope.currentLocation; }, function(newValue) {
      if ((newValue || {}).tab == "building-list") {
        var cities = [];
        $(".nameDelimiter").each(function() {
          cities.push($(this).text());
        });
        console.log(cities);
        
        $scope.cities = cities;
      }
    });

    $scope.$watch("shownComponents.controls", function(newVal, oldVal) {
      if (newVal) {
        $(document).off("click-habitat");
      }
    });

    $scope.startCaptureTargets = function() {
      $(document).on("click-habitat", captureHabitatClick);
      $scope.hide("controls");
      $(".main .button[title=map]").click();
    };

    $scope.clearTargets = function() {
      if ($scope.currentCity) {
        $scope.attackTargets = C.attackTargets[$scope.currentCity] = [];
      }
    };

    $scope.removeTarget = function(index) {
      $scope.attackTargets.splice(index, 1);
    };

    $scope.stopAttacks = function() {
      $scope.actions.unschedule($scope.currentAttacks.action());
      $scope.currentAttacks = null;
    };

    $scope.attackCapturedTargets = function() {
      $scope.currentAttacks = new AttackCastleBuilder($scope, $scope.attackTargets, $scope.currentCity);
      $scope.actions.schedule($scope.currentAttacks.action(), 1000);
    };
  };

  var OptionsController = window.OptionsController = function($scope) {
    
    $scope.save = function() {
      Storage.put("attackTargets", angular.copy(C.attackTargets));
      Storage.put("cityUpgrades", angular.copy(C.cityUpgrades));
    };
  };

  var content = $('<div ng-app>\
      <div ng-controller="AutomateController">\
        <div id="automate-overlay" ng-class="inActionCls()" ng-show="shown(\'controls\') || inAction()"></div>\
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
          </div>\
          <div ng-show="shown(\'controls\') && automateEnabled()" class="status control-box">\
            Next action: {{nextAction().name}} at {{ nextAction().scheduledAt | date:"mediumTime" }}\
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
                        <button ng-click="addUpgrade(upgrade)">+</button>\
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
              <h3>Attacks for <select ng-model="currentCity" ng-options="city for city in cities"></select></h3>\
              <div style="margin-top: 10px">\
                <button ng-click="startCaptureTargets()">capture</button>\
                <button ng-click="clearTargets()">clear</button>\
                <button ng-hide="currentAttacks.inProgress" ng-click="attackCapturedTargets()">attack selected ({{attackTargets.length}})</button>\
                <button ng-show="currentAttacks.inProgress" ng-click="stopAttacks()" class="active">attacked ({{currentAttacks.doneCount}}/{{attackTargets.length}})</button>\
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
              <div>\
                <button ng-click="save()">save</button>\
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
  
  content.appendTo("body");
  
  T.delay(function() {
    var automateJs = angular.module("automate.js", [ "ng" ]);
    
    var FooController = window.FooController = function($scope) { };
    
    automateJs.config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/:city/:tab', {
        template: "<div></div>", 
        controller: FooController
      });
      
      $routeProvider.otherwise({redirectTo: '/Gars-Bu/castle'});
    }]);
    
    angular.bootstrap(content, [ "automate.js" ]);
  }, 300);
})();