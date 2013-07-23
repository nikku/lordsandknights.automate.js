function Alliance(b, a, l, e, h, k, g, j, f, d, c) {
  this.id = b;
  this.name = a;
  this.points = l;
  this.rank = e;
  this.rankAverage = c;
  this.order = "rank";
  this.memberCount = h;
  this.descriptionText = k;
  this.relationship = g;
  this.diplomacyToArray = j;
  this.playerArray = f;
  this.invitedPlayerArray = d
}
function Alliance(b) {
  this.id = getValueFromJSON(b.id);
  this.name = getValueFromJSON(b.name);
  this.points = getValueFromJSON(b.points);
  this.rank = getValueFromJSON(b.rank);
  this.rankAverage = getValueFromJSON(b.rankAverage);
  this.memberCount = getValueFromJSON(b.memberCount);
  this.descriptionText = getValueFromJSON(b.descriptionText);
  if (typeof this.descriptionText != "undefined" && this.descriptionText != null) {
    var e = escape(this.descriptionText).replace(/\%0A/g, "\\n");
    this.descriptionText = unescape(e).replace(/\\n/g, "<br/>")
  }
  this.relationship = getValueFromJSON(b.relationship);
  this.pointsAverage = getValueFromJSON(b.pointsAverage);
  this.diplomacyToArray = null;
  if (b.diplomacyToArray) {
    var a = new Array();
    $.each(b.diplomacyToArray, function(g, h) {
      a.push(new Alliance(h))
    });
    this.diplomacyToArray = a
  }
  this.playerArray = null;
  if (b.playerArray) {
    var d = new Array();
    $.each(b.playerArray, function(g, h) {
      d.push(new Player(h))
    });
    d.sort(function(h, g) {
      if (parseInt(h.points) > parseInt(g.points)) {
        return -1
      } else {
        return +1
      }
    });
    this.playerArray = d
  }
  this.invitedPlayerArray = null;
  if (b.invitedPlayerArray) {
    var f = new Array();
    $.each(b.invitedPlayerArray, function(g, h) {
      f.push(new Player(h))
    });
    f.sort(function(h, g) {
      if (parseInt(h.points) > parseInt(g.points)) {
        return -1
      } else {
        return +1
      }
    });
    this.invitedPlayerArray = f
  }
  this.forumThreadArray = null;
  if (b.forumThreadArray) {
    var c = new Array();
    $.each(b.forumThreadArray, function(g, h) {
      c.push(new ForumThread(h))
    });
    c.sort(function(h, g) {
      if (h.lastMessageDate > g.lastMessageDate) {
        return -1
      } else {
        return +1
      }
    });
    this.forumThreadArray = c
  }
}
Alliance.prototype.getLeaderCount = function() {
  var b = 0;
  var a;
  if (this instanceof Alliance) {
    a = this
  } else {
    a = this.data
  }
  if (a.playerArray) {
    $.each(a.playerArray, function(c, d) {
      if ((d.alliancePermission & ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_DISBAND_ALLIANCE) || d.alliancePermission == -1) {
        b++
      }
    })
  }
  return b
};
Alliance.prototype.getUnreadThreadsCount = function(a) {
  var b = 0;
  if (this.forumThreadArray) {
    $.each(this.forumThreadArray, function(c, d) {
      if (a.getTime() < d.lastMessageDate.getTime()) {
        b++;
        d.read = false
      }
    });
    if (typeof mPlayer != "undefined") {
      if (mPlayer.lastReadForumDate != null && mPlayer.unreadAllianceMessages > 0 && b == 0) {
        b += mPlayer.unreadAllianceMessages
      }
    }
  }
  return b
};
Alliance.prototype.updateForumThreads = function(a) {
  if (a.forumThreadArray) {
    var b = new Array();
    $.each(a.forumThreadArray, function(c, d) {
      b.push(new ForumThread(d))
    });
    b.sort(function(d, c) {
      if (d.lastMessageDate > c.lastMessageDate) {
        return -1
      } else {
        return +1
      }
    });
    this.forumThreadArray = b
  }
};
Alliance.prototype.updatePlayerArray = function(a) {
  if (a.playerArray) {
    var b = new Array();
    $.each(a.playerArray, function(c, d) {
      b.push(new Player(d))
    });
    b.sort(function(d, c) {
      if (d.points > c.points) {
        return -1
      } else {
        return +1
      }
    });
    this.playerArray = b
  }
};
Alliance.prototype.getAllMembersWithSamePermission = function(b) {
  var a;
  var c = null;
  if (this instanceof Alliance) {
    a = this
  } else {
    a = this.data
  }
  $.each(a.playerArray, function(d, e) {
    if ((e.alliancePermission & b) || e.alliancePermission == -1) {
      if (c == null) {
        c = new Array()
      }
      c.push(e)
    }
  });
  return c
};
Alliance.prototype.getRelationshipString = function(b) {
  var a = mStringtable.getValueOf("Neutral");
  if (b == 2) {
    a = mStringtable.getValueOf("Allies")
  } else {
    if (b == 1) {
      a = mStringtable.getValueOf("NAP")
    } else {
      if (b == -1) {
        a = mStringtable.getValueOf("Enemies")
      } else {
        if (b == 3) {
          a = mStringtable.getValueOf("Vassal / Feudal Lord")
        }
      }
    }
  }
  return a
};
Alliance.prototype.getRelationshipImage = function(a) {
  var b = mPath_Images + mDir_Diplomacy + "AllianceNeutral.png";
  if (a == 2) {
    b = mPath_Images + mDir_Diplomacy + "AllianceAlly.png"
  } else {
    if (a == 1) {
      b = mPath_Images + mDir_Diplomacy + "AllianceNap.png"
    } else {
      if (a == -1) {
        b = mPath_Images + mDir_Diplomacy + "AllianceEnemy.png"
      } else {
        if (a == 3) {
          b = mPath_Images + mDir_Diplomacy + "AllianceVassal.png"
        }
      }
    }
  }
  return b
};
Alliance.prototype.findForumThread = function(b) {
  var a = null;
  $.each(this.forumThreadArray, function(d, c) {
    if (c.id == b) {
      a = c
    }
  });
  return a
};
Alliance.prototype.deleteForumThread = function(c) {
  var b = 0;
  var a = this;
  $.each(a.forumThreadArray, function(e, d) {
    if (d.id == c) {
      a.forumThreadArray.slice(b, 1);
      return
    }
    b += 1
  })
};
Alliance.prototype.sortMemberByRights = function() {
  this.playerArray.sort(function(d, c) {
    if (d.alliancePermission > c.alliancePermission) {
      return -1
    } else {
      return +1
    }
  });
  return this.playerArray
};
Alliance.prototype.getDiplomacyRelationship = function(c) {
  var a;
  var b = 0;
  if (this instanceof Alliance) {
    a = this
  } else {
    a = this.data
  }
  $.each(a.diplomacyToArray, function(d, e) {
    if (e.id == c) {
      b = e.relationship
    }
  });
  return b
};
Alliance.prototype.allianceMembersCallback = function(a) {
  if (a.error) {
    if (a.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error))
    }
  } else {
    if (a.allianceMemberArray) {
      var b = new Array();
      $.each(a.allianceMemberArray, function(c, d) {
        b.push(new Player(d))
      });
      b.sort(function(d, c) {
        if (d.points > c.points) {
          return -1
        } else {
          return +1
        }
      });
      this.playerArray = b
    }
  }
  unblockUI()
};
Alliance.prototype.changePermissionForMember = function(b, c) {
  var a;
  if (this instanceof Alliance) {
    a = this
  } else {
    a = this.data
  }
  $.each(a.playerArray, function(e, f) {
    if (f.id == b) {
      f.alliancePermission = c
    }
    if (mPlayer.id == b) {
      mPlayer.alliancePermission = c
    }
  });
  blockUI("Loading...");
  var d = {};
  d.permission = c;
  d.id = b;
  d.PropertyListVersion = propertyListVersion;
  d[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("AllianceAction/setPermission", d, "AllianceView.allianceMemberPermissionChangedCallback")
};
Alliance.prototype.deleteInvitation = function(a) {
  blockUI("Loading...");
  var b = {};
  b.id = a;
  b.PropertyListVersion = propertyListVersion;
  b[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("AllianceAction/cancelInvitation", b, "Session.updateCallback")
};
Alliance.prototype.changeAllianceRelationship = function(a, c) {
  $.each(this.diplomacyToArray, function(d, e) {
    if (e.id == a) {
      e.relationship = c
    }
  });
  blockUI("Loading...");
  var b = {};
  b.id = a;
  b.diplomaticValue = c;
  b.PropertyListVersion = propertyListVersion;
  b[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("AllianceAction/setDiplomaticRelation", b, "AllianceView.changeAllianceRelationshipCallback")
};
function AllianceForum() {
  this.thread = null;
  this.deletedThreadId = 0;
  this.discussionEntryArray;
  this.contentclosed = false;
  this.currentScrollValue = 0;
  this.deletedMessageId = 0;
  this.selectedForumMessage = 0
}
AllianceForum.prototype.validateTitle = function(b) {
  var a = true;
  if (b == null) {
    showPapyrusMsgBox(mStringtable.getValueOf("Please enter topic and content"));
    a = false
  } else {
    if (b.length == 0) {
      showPapyrusMsgBox(mStringtable.getValueOf("Please enter topic and content"));
      a = false
    } else {
      if (b.length > mSettings.maxForumThreadTopicLength) {
        showPapyrusMsgBox(mStringtable.getValueOf("Topic is too long."));
        a = false
      }
    }
  }
  return a
};
AllianceForum.prototype.validateMessageContent = function(b) {
  var a = true;
  if (b == null) {
    showPapyrusMsgBox(mStringtable.getValueOf("Please enter content"));
    a = false
  } else {
    if (b.length == 0) {
      showPapyrusMsgBox(mStringtable.getValueOf("Please enter content"));
      a = false
    } else {
      if (b.length > mSettings.maxForumMessageContentLength) {
        showPapyrusMsgBox(mStringtable.getValueOf("Message content is too long."));
        a = false
      }
    }
  }
  return a
};
AllianceForum.prototype.loadThreads = function() {
  var a;
  if (this instanceof AllianceForum) {
    a = this
  } else {
    a = this.data
  }
  mPlayer.resetCurrentItems(mPlayer.forumThreadItems);
  $.tmpl("allianceMessagesViewTmpl", mPlayer.alliance).appendTo($("div#forum").empty());
  setHover("div.messagesview");
  windowSize();
  if (mAllianceForum.selectedForumMessage == 0) {
    $("table.forumThreadSelect:first").removeClass("notSelected").addClass("isSelected")
  } else {
    $("#forumMessageNumber_" + mAllianceForum.selectedForumMessage).find("table.forumThreadSelect").removeClass("notSelected");
    $("#forumMessageNumber_" + mAllianceForum.selectedForumMessage).find("table.forumThreadSelect").addClass("isSelected")
  }
  if (mPlayer.alliance.forumThreadArray.length != null && mPlayer.alliance.forumThreadArray.length > 0) {
    if (a.thread == null) {
      a.thread = mPlayer.alliance.forumThreadArray[0];
      if (a.thread.read == false) {
        a.thread.read = true;
        mAllianceForum.decreaseUnreadMessageCount();
        $("div.messagePicture:first").removeClass("unread").addClass("read")
      }
    }
    a.loadThreadEntries();
    if (mAllianceForum.selectedForumMessage == 0) {
      $("table.forumThreadSelect:first").removeClass("notSelected").addClass("isSelected")
    } else {
      $("#forumMessageNumber_" + mAllianceForum.selectedForumMessage).find("table.forumThreadSelect").removeClass("notSelected");
      $("#forumMessageNumber_" + mAllianceForum.selectedForumMessage).find("table.forumThreadSelect").addClass("isSelected")
    }
  }
  $("a.discussiontitlelink").click(function() {
    mAllianceForum.currentScrollValue = 0;
    mAllianceForum.currentScrollValue = $("div.noscroll").scrollTop();
    a.thread = mPlayer.alliance.findForumThread($(this).metadata().discussionId);
    if (a.thread.read == false) {
      a.thread.read = true;
      mAllianceForum.decreaseUnreadMessageCount();
      $(this).find("div.messagePicture").removeClass("unread").addClass("read")
    }
    a.loadThreadEntries();
    $("div#newMessageForm").hide()
  });
  $("table.forumThreadSelect").click(function() {
    mAllianceForum.selectedForumMessage = $(this).metadata().selectedForumMessageIndex;
    $("#forumMessageNumber_" + $(this).metadata().selectedForumMessageIndex).find("table.forumThreadSelect").each(function(b) {
      if ($("table.forumThreadSelect").hasClass("isSelected")) {
        $("table.forumThreadSelect").removeClass("isSelected");
        $("table.forumThreadSelect").addClass("notSelected")
      }
      $(this).addClass("isSelected")
    })
  });
  $("table.messageSelect").click(function() {
    mMessagesView.selectedMessageNumber = $(this).metadata().selectedMessageIndex;
    $("#messageNumber_" + $(this).metadata().selectedMessageIndex).find("table.messageSelect").each(function(b) {
      if ($("table.messageSelect").hasClass("isSelected")) {
        $("table.messageSelect").removeClass("isSelected");
        $("table.messageSelect").addClass("notSelected")
      }
      $(this).addClass("isSelected")
    })
  });
  $("div#deleteselecteddiscussions").click(function() {
    var c = false;
    var b = new Array();
    $("table.discussion input:checked").each(function() {
      b.push($(this).metadata().discussionId);
      if (mAllianceForum.thread.id == $(this).metadata().discussionId) {
        c = true
      }
    });
    if (b.length > 0) {
      $("#ui-dialog-title-dialog-confirm").text(mStringtable.getValueOf("Really delete selection?"));
      $("#dialog-confirm").attr("title", mStringtable.getValueOf("Really delete selection?"));
      $("#dialog-confirm > p").html(mStringtable.getValueOf("Really delete selection?"));
      $("#dialog:ui-dialog").dialog("destroy");
      $("#dialog-confirm").dialog({resizable: false, width: 375, modal: true, draggable: false, buttons: [{text: mStringtable.getValueOf("cancel"), click: function() {
              $(this).dialog("close")
            }}, {text: mStringtable.getValueOf("ok"), click: function() {
              $(this).dialog("close");
              if (c) {
                mAllianceForum.thread = null
              }
              var d = {};
              d.forumThreadIdArray = "(" + b.join(",") + ")";
              d.PropertyListVersion = propertyListVersion;
              d[mPlayer.userIdentifier] = mPlayer.getHash();
              genericAjaxRequest("ForumAction/deleteForumThreads", d, "AllianceForum.deleteThreadCallback")
            }}]})
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf("No element selected."), false, false, false, false)
    }
  });
  $("div#deletethread").click(function() {
    var b = new Array();
    $("table.forumMessages input:checked").each(function() {
      b.push($(this).metadata().discussionId)
    });
    if (b.length > 0) {
      $("#ui-dialog-title-dialog-confirm").text(mStringtable.getValueOf("Really delete selection?"));
      $("#dialog-confirm").attr("title", mStringtable.getValueOf("Really delete selection?"));
      $("#dialog-confirm > p").html(mStringtable.getValueOf("Really delete selection?"));
      $("#dialog:ui-dialog").dialog("destroy");
      $("#dialog-confirm").dialog({resizable: false, width: 375, modal: true, draggable: false, buttons: [{text: mStringtable.getValueOf("cancel"), click: function() {
              $(this).dialog("close")
            }}, {text: mStringtable.getValueOf("ok"), click: function() {
              $(this).dialog("close");
              var c = {};
              c.forumMessageIdArray = "(" + b.join(",") + ")";
              c.PropertyListVersion = propertyListVersion;
              c[mPlayer.userIdentifier] = mPlayer.getHash();
              genericAjaxRequest("ForumAction/deleteForumMessages", c, "mAllianceForum.loadThreadEntriesCallback")
            }}]})
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf("No element selected."), false, false, false, false)
    }
  });
  $("div#answerthread").click(function() {
    $("div#discussionentrylist").hide();
    $("div#discussionentryform").show();
    $("div.threadheadline").html(mStringtable.getValueOf("Send Message"));
    $("div#newMessageForm").hide();
    $("textarea#content").val("")
  });
  $("div#cancelAddThread").click(function() {
    $("div#discussionentrylist").show();
    $("div.threadheadline").html(mAllianceForum.thread.topic);
    $("div#discussionentryform").hide();
    $("div#newMessageForm").hide()
  });
  $("div#createnewthread").click(function() {
    $("div#discussionentrylist").hide();
    $("div#discussionentryform").hide();
    $("div#newMessageForm").show();
    $("div.threadheadline").html(mStringtable.getValueOf("New Message"));
    $("div.noscroll").scrollTop(0)
  });
  $("div#cancelnewMessage").click(function() {
    $("div#discussionentrylist").show();
    $("div#newMessageForm").hide();
    a.loadThreads()
  });
  $("div#addThreadEntry").click(function() {
    var c = $("textarea#content").val();
    if (mAllianceForum.validateMessageContent(c)) {
      blockUI("Loading...");
      var b = {};
      b.id = $("input#discussionId").val();
      b.content = $("textarea#content").val();
      b.PropertyListVersion = propertyListVersion;
      b[mPlayer.userIdentifier] = mPlayer.getHash();
      genericAjaxRequest("ForumAction/createForumMessage", b, "mAllianceForum.loadThreadEntriesCallback")
    }
  });
  $("div#closethread").click(function() {
    mCurrentActionBlocked = false;
    a.thread.closed = true;
    var b = {};
    b.id = a.thread.id;
    b.closed = "1";
    b.PropertyListVersion = propertyListVersion;
    b[mPlayer.userIdentifier] = mPlayer.getHash();
    genericAjaxRequest("ForumAction/setForumThreadClosed", b, "Session.updateCallback");
    mCurrentActionBlocked = true
  });
  $("div#reopenthread").click(function() {
    mCurrentActionBlocked = false;
    a.thread.closed = false;
    var b = {};
    b.id = a.thread.id;
    b.closed = "0";
    b.PropertyListVersion = propertyListVersion;
    b[mPlayer.userIdentifier] = mPlayer.getHash();
    genericAjaxRequest("ForumAction/setForumThreadClosed", b, "Session.updateCallback");
    mCurrentActionBlocked = true
  });
  $("div#newMessage").click(function() {
    var b = $("input.newSubject").val();
    var d = $("textarea#newcontent").val();
    if (mAllianceForum.validateMessageContent(d) && mAllianceForum.validateTitle(b)) {
      mAllianceForum.selectedForumMessage++;
      var c = {};
      c.topic = b;
      c.content = d;
      c.PropertyListVersion = propertyListVersion;
      c[mPlayer.userIdentifier] = mPlayer.getHash();
      genericAjaxRequest("ForumAction/createForumThread", c, "mAllianceForum.createThreadCallback")
    }
  });
  forumMessageInput = "";
  $("textarea#content").keyup(function() {
    forumMessageInput = $(this).val().length - 1;
    forumMessageInput++;
    if (forumMessageInput <= mSettings.maxForumMessageContentLength) {
      $("span#messageContentLength").text(forumMessageInput);
      $("div.messageContentLengthCounter").css("color", "black");
      $("#addThreadEntry").show()
    } else {
      $("div.messageContentLengthCounter").css("color", "red");
      $("#addThreadEntry").hide()
    }
  });
  $("textarea#content").keypress(function() {
    if (forumMessageInput >= mSettings.maxForumMessageContentLength) {
      $("div.messageContentLengthCounter").css("color", "red");
      return false
    }
  });
  threadMessageInput = "";
  $("textarea#newcontent").keyup(function() {
    threadMessageInput = $(this).val().length - 1;
    threadMessageInput++;
    if (threadMessageInput <= mSettings.maxForumMessageContentLength) {
      $("span#newMessageContentLength").text(threadMessageInput);
      $("div.messageContentLengthCounter").css("color", "black");
      $("#newMessage").show()
    } else {
      $("div.messageContentLengthCounter").css("color", "red");
      $("#newMessage").hide()
    }
  });
  $("textarea#newcontent").keypress(function() {
    if (threadMessageInput >= mSettings.maxForumMessageContentLength) {
      $("div.messageContentLengthCounter").css("color", "red");
      return false
    }
  });
  messageTitleInput = "";
  $("input.newSubject").keyup(function(b) {
    messageTitleInput = $(this).val().length - 1;
    messageTitleInput++;
    if (messageTitleInput <= mSettings.maxDiscussionTitleLength) {
      $("span#newForumMessageTitle").text(messageTitleInput)
    } else {
      return false
    }
  });
  $("#paste_link_discussion_newThread").click(function() {
    var b = buffer_links.get_link();
    if (b == null) {
      return
    }
    var c = $("#newcontent").val() + " " + b;
    $("#newcontent").val(c)
  });
  $(".CheckBoxClass").change(function() {
    if ($(this).is(":checked")) {
      $(this).next("label").addClass("LabelSelected");
      $(this).next("label").find(".fakeCheckBox").attr("src", "../pictures/Icons/TransitAttack.png")
    } else {
      $(this).next("label").removeClass("LabelSelected");
      $(this).next("label").find(".fakeCheckBox").attr("src", "../pictures/Icons/Search.png")
    }
  });
  $("#prevAllianceMessages").click(function() {
    mPlayer.prevPage(mPlayer.alliance.forumThreadArray.length);
    $("#allianceMessagesNumbers").text(mPlayer.currentItems.start + 1 + " - " + mPlayer.currentItems.end + " / " + mPlayer.alliance.playerArray.length);
    mAllianceView.openAllianceProfile();
    return false
  });
  $("#nextAllianceMessages").click(function() {
    mPlayer.nextPage(mPlayer.alliance.forumThreadArray.length);
    $("#allianceMessagesNumbers").text(mPlayer.currentItems.start + 1 + " - " + mPlayer.currentItems.end + " / " + mPlayer.alliance.forumThreadArray.length);
    mAllianceView.openAllianceProfile();
    return false
  })
};
AllianceForum.prototype.decreaseUnreadMessageCount = function() {
  if (mPlayer.unreadAllianceMessages >= 1) {
    mPlayer.unreadAllianceMessages -= 1
  }
  mBottomBar.setNewCounts()
};
AllianceForum.prototype.loadThreadEntries = function() {
  blockUI("ForumAction/forumMessageArray");
  var a = {};
  a.id = mAllianceForum.thread.id;
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("ForumAction/forumMessageArray", a, "mAllianceForum.loadThreadEntriesCallback")
};
AllianceForum.prototype.createThreadCallback = function(a) {
  if (a.touchDate) {
    globalTouchDate = a.touchDate
  }
  if (a.error) {
    if (a.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error))
    }
  } else {
    mPlayer.alliance.updateForumThreads(a.player.alliance);
    mAllianceForum.loadThreads()
  }
  unblockUI()
};
AllianceForum.deleteThreadCallback = function(a) {
  if (a.touchDate) {
    globalTouchDate = a.touchDate
  }
  if (a.error) {
    if (a.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error))
    }
  } else {
    mPlayer.updateAllianceData(a.player.alliance);
    mAllianceForum.loadThreads()
  }
  unblockUI()
};
AllianceForum.prototype.loadThreadEntriesCallback = function(c) {
  if (c.touchDate) {
    globalTouchDate = c.touchDate
  }
  unblockUI();
  if (c.error) {
    if (c.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(c.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(c.error))
    }
  } else {
    $("input#discussionId").val(this.thread.id);
    $("span#receiver").html("");
    $("span#subject").html(this.thread.topic);
    $("textarea#content").val("");
    mAllianceForum.discussionEntryArray = new Array();
    var a = "";
    $.each(c.forumMessageArray, function(d, e) {
      a = new ForumThreadEntry(e);
      a.content = Linksmaker.process(a.content);
      mAllianceForum.discussionEntryArray.push(a)
    });
    mAllianceForum.discussionEntryArray.sort(function(e, d) {
      if (e.creationDate < d.creationDate) {
        return -1
      } else {
        return 1
      }
    });
    $.tmpl("allianceMessageEntryTmpl", mAllianceForum).appendTo($("div#discussionentrys").empty());
    $(".internal_link").click(function() {
      Actionslinks.openView($(this).attr("id"))
    });
    $("#paste_link_discussion").click(function() {
      var d = buffer_links.get_link();
      if (d == null) {
        return
      }
      var e = $("#content").val() + " " + d;
      $("#content").val(e)
    });
    $("span.discussionMemberLink").click(function() {
      playerProfileCloseButton = true;
      openExternPlayerProfile($(this).metadata().authorID)
    });
    $("div.threadheadline").html(mAllianceForum.thread.topic);
    $("div#discussionentryform").hide();
    $("div#closethread").show();
    $("div#answerthread").show();
    $("div#deletethread").show();
    $("div#discussionentrylist").show();
    if (mAllianceForum.thread != null && mAllianceForum.thread.closed == false) {
      $("div#answerthread").show();
      if (mPlayer.alliancePermission == -1 || (mPlayer.alliancePermission & ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_MODERATE_FORUM)) {
        $("div#closethread").show();
        $("div#reopenthread").hide();
        $("div#deletethread").show()
      } else {
        $("div#closethread").hide();
        $("div#reopenthread").hide();
        $("div#deletethread").hide()
      }
    } else {
      if (mAllianceForum.thread != null && mAllianceForum.thread.closed == true) {
        $("div#answerthread").hide();
        $("{discussionId:'${this.id}'}").find("div.messagePicture").addClass("closed");
        if (mPlayer.alliancePermission == -1 || (mPlayer.alliancePermission & ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_MODERATE_FORUM)) {
          $("div#closethread").hide();
          $("div#reopenthread").show();
          $("div#deletethread").show()
        } else {
          $("div#closethread").hide();
          $("div#reopenthread").hide();
          $("div#deletethread").hide()
        }
      } else {
        $("div#closethread").hide();
        $("div#reopenthread").hide();
        if (mPlayer.alliancePermission == -1 || (mPlayer.alliancePermission & ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_MODERATE_FORUM)) {
          $("div#deletethread").show()
        } else {
          $("div#deletethread").hide()
        }
      }
    }
    $(".CheckBoxClass").change(function() {
      if ($(this).is(":checked")) {
        $(this).next("label").addClass("LabelSelected");
        $(this).next("label").find(".fakeCheckBox").attr("src", "../pictures/Icons/TransitAttack.png")
      } else {
        $(this).next("label").removeClass("LabelSelected");
        $(this).next("label").find(".fakeCheckBox").attr("src", "../pictures/Icons/Search.png")
      }
    });
    windowSize();
    var b = $(".viewport").height() * 0.75;
    $(".noscroll").height(b);
    $(".right50").scrollTop(b);
    if (mAllianceForum.currentScrollValue > 0) {
      $("div.noscroll").scrollTop(mAllianceForum.currentScrollValue)
    }
    $("div.right50").scrollTop($("#discussionentrylist").height())
  }
};
function AllianceReport(a) {
  this.id = getValueFromJSON(a.id);
  this.type = getValueFromJSON(a.type);
  this.date = jsonDateToDate(getValueFromJSON(a.date));
  this.alliance = null;
  if (a.alliance) {
    this.alliance = new Alliance(a.alliance)
  }
  this.sendingPlayer = null;
  if (a.sendingPlayer) {
    this.sendingPlayer = new Player(a.sendingPlayer)
  }
  this.receivingPlayer = null;
  if (a.receivingPlayer) {
    this.receivingPlayer = new Player(a.receivingPlayer)
  }
  this.newDiplomaticRelation = null;
  this.oldDiplomaticRelation = null;
  this.newAlliancePermission = null;
  this.oldAlliancePermission = null;
  this.destinationAlliance = null;
  if (a.variables) {
    if (a.variables.newDiplomaticRelation != null) {
      this.newDiplomaticRelation = getValueFromJSON(a.variables.newDiplomaticRelation);
      this.oldDiplomaticRelation = getValueFromJSON(a.variables.oldDiplomaticRelation);
      this.destinationAlliance = new Alliance(a.variables.alliance)
    }
    if (a.variables.newAlliancePermission) {
      this.newDiplomaticRelation = getValueFromJSON(a.variables.newAlliancePermission);
      this.oldDiplomaticRelation = getValueFromJSON(a.variables.oldAlliancePermission)
    }
  }
}
function AllianceView() {
  this.selectedTabIndex = 0;
  this.externalProfile = false;
  this.tips = null;
  this.newMessageMode = false;
  this.curRankingStartIndex = 1;
  this.curRankingEndIndex = mSettings.maxRankingListItemsPerPage + 1;
  this.rankingEntries = new Array();
  this.externAllianceId;
  this.isLastDeletedMemberID = 0;
  this.openRangingListForFirstTime = true;
  this.direction = 1;
  this.prev_or_next = false;
  this.scroll_down = 0;
  this.closeGroup_Arrow = 0;
  this.diplomacyTypeArray = {};
  this.diplomacyTypeArray[0] = new Array(mStringtable.getValueOf("Vassal / Feudal Lord"), DIPLOMACYTYPE.TYPE_VASSAL);
  this.diplomacyTypeArray[1] = new Array(mStringtable.getValueOf("Allies"), DIPLOMACYTYPE.TYPE_ALLY);
  this.diplomacyTypeArray[2] = new Array(mStringtable.getValueOf("NAP"), DIPLOMACYTYPE.TYPE_NAP);
  this.diplomacyTypeArray[3] = new Array(mStringtable.getValueOf("Enemy"), DIPLOMACYTYPE.TYPE_FOE)
}
function c_alliance(a) {
  if (a.touchDate) {
    globalTouchDate = a.touchDate
  }
  if (!a.error) {
    mPlayer.alliance = null;
    mPlayer.updateData(a.player);
    mBottomBar.callLastView()
  } else {
    if (a.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, false, false, false)
    }
  }
  unblockUI()
}
function b_alliance(a) {
  if (a.touchDate) {
    globalTouchDate = a.touchDate
  }
  if (!a.error) {
    mAllianceView = null;
    mCurrentActionBlocked = false;
    mPlayer.alliance = null;
    mPlayer.updateData(a.player);
    mBottomBar.callLastView()
  } else {
    if (a.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, false, false, false)
    }
  }
  unblockUI()
}
function leave_alliance(b) {
  blockUI("Loading...");
  var a = {};
  a.id = b;
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("AllianceAction/leaveAlliance", a, "c_alliance")
}
function disband_alliance(b) {
  blockUI("Loading...");
  var a = {};
  a.id = b;
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("AllianceAction/disbandAlliance", a, "b_alliance")
}
AllianceView.prototype.addViewToStack = function(b) {
  var a = new StackItem();
  if (typeof b == "undefined") {
    if (mAllianceView.externalProfile == false) {
      a.itemType = ITEMTYPE.ALLIANCE_VIEW_ITEM
    } else {
      a.itemType = ITEMTYPE.EXTERNALLIANCE_VIEW_ITEM
    }
    if (mAllianceView.externalProfile == false) {
      a.functionname = mAllianceView.openAllianceProfile
    } else {
      if (mAllianceView.externalProfile == true) {
        a.functionname = mAllianceView.getAllianceInformation;
        a.objectID = mAllianceView.externAllianceId
      } else {
        if (mPlayer.alliance == null) {
          a.itemType = ITEMTYPE.NEW_ALLIANCE_VIEW;
          a.functionname = mAllianceView.createNewAlliance
        }
      }
    }
  } else {
    a.itemType = ITEMTYPE.NEW_ALLIANCE_VIEW;
    a.functionname = openAllianceView
  }
  mBottomBar.addToStack(a)
};
function callback_search_allyname(a) {
  if (a.error) {
    if (a.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false)
    }
  } else {
    var b = [];
    $.each(a.ranking, function(c, d) {
      b.push(new Alliance(d))
    });
    if (b.length == 0) {
      showPapyrusMsgBox(mStringtable.getValueOf("No search results"), false);
      return
    }
    mAllianceView.rankingEntries = b;
    mAllianceView.closeGroup_Arrow = 1;
    mAllianceView.showRanking()
  }
  if (mIsBlocked) {
    unblockUI()
  }
}
AllianceView.prototype.openAllianceProfile = function() {
  var b = mAllianceView;
  b.externalProfile = false;
  if (mBottomBar.selectedIndex == 8) {
    selectButton(8, ITEMTYPE.ALLIANCE_VIEW_ITEM)
  }
  if (mPlayer.alliance != null) {
    mPlayer.resetCurrentItems(mPlayer.memberItems);
    b.addViewToStack();
    if (mPlayer.alliance != null) {
      var a = $("<span>").html(mPlayer.alliance.descriptionText).text();
      mPlayer.alliance.descriptionText = Linksmaker.process(a)
    }
    $.tmpl("allianceViewTmpl", mPlayer).appendTo($("div.viewport").empty());
    setPapyrusBackgroundForFullScreenView();
    setHover("div.allianceView");
    $("#btn_search_ally").click(function() {
      $("#div_form_search_ally").show();
      $("#btn_search_ally").hide();
      $("#input_search_ally").focus()
    });
    $("#btn_search_close_ally").click(function() {
      $("#div_form_search_ally").hide();
      $("#btn_search_ally").show();
      mAllianceView.closeGroup_Arrow = 0;
      mAllianceView.loadRanking()
    });
    $("#btn_search_send_ally").click(function() {
      var c = $("#input_search_ally").val();
      if (c.length < 3) {
        showPapyrusMsgBox(mStringtable.getValueOf("The name is too short"), false);
        return false
      }
      var d = {};
      d.name = c;
      d[mPlayer.userIdentifier] = mPlayer.getHash();
      d.PropertyListVersion = propertyListVersion;
      genericAjaxRequest("AllianceAction/search", d, "callback_search_allyname");
      if (!mIsBlocked) {
        blockUI("Loading...")
      }
    });
    $("#input_search_ally").keydown(function(c) {
      if (c.which == 13 || c.which == 32) {
        $("#btn_search_send_ally").click();
        c.preventDefault()
      }
    });
    $(".internal_link").click(function() {
      Actionslinks.openView($(this).attr("id"))
    });
    $("#copy_alliance_link").click(function() {
      copy_alliance_link_Handler(mPlayer.alliance.id)
    });
    $("#tabsAllianceView").tabs({selected: b.selectedTabIndex, select: function(c, d) {
        b.selectedTabIndex = d.index;
        if (d.panel.id == "permissions") {
          selectButtonWithoutClearStack(7, ITEMTYPE.ALLIANCE_VIEW_ITEM);
          mCurrentActionBlocked = true;
          mPlayer.resetCurrentItems(mPlayer.memberItems);
          b.getAllianceMembers()
        } else {
          if (d.panel.id == "reports") {
            selectButtonWithoutClearStack(7, ITEMTYPE.ALLIANCE_VIEW_ITEM);
            mCurrentActionBlocked = true;
            mPlayer.resetCurrentItems(mPlayer.allianceReportsItems);
            mAllianceView.initReportsView()
          } else {
            if (d.panel.id == "ranking") {
              selectButtonWithoutClearStack(7, ITEMTYPE.ALLIANCE_VIEW_ITEM);
              mCurrentActionBlocked = true;
              mAllianceView.loadRanking()
            } else {
              mCurrentActionBlocked = true;
              selectButtonWithoutClearStack(7, ITEMTYPE.ALLIANCE_VIEW_ITEM)
            }
          }
        }
      }});
    $("div.perm").click(function() {
      if ($(this).metadata().right == "INITIALREVOKE") {
        $(this).metadata().right = "GRANT";
        $(this).toggleClass("revoke0").toggleClass("grant");
        $(this).toggleClass("changed", true)
      } else {
        if ($(this).metadata().right == "INITIALGRANT") {
          $(this).metadata().right = "REVOKE";
          $(this).toggleClass("grant0").toggleClass("revoke");
          $(this).toggleClass("changed", true)
        } else {
          if ($(this).metadata().right == "REVOKE") {
            $(this).metadata().right = "GRANT";
            $(this).toggleClass("grant").toggleClass("revoke")
          } else {
            if ($(this).metadata().right == "GRANT") {
              $(this).metadata().right = "REVOKE";
              $(this).toggleClass("grant").toggleClass("revoke")
            }
          }
        }
      }
    });
    $("div.changeRights").click(function() {
      var c = 0;
      $(this).parent().parent().find(".perm").each(function() {
        if ($(this).metadata().right == "GRANT" || $(this).metadata().right == "INITIALGRANT") {
          c = (c | $(this).metadata().permission)
        }
      });
      mPlayer.alliance.changePermissionForMember($(this).metadata().allianceMember, c)
    });
    $("#prevMemberPermissions").click(function() {
      mPlayer.prevPage(mPlayer.alliance.playerArray.length);
      $("#memberNumbers").text(mPlayer.currentItems.start + 1 + " - " + mPlayer.currentItems.end + " / " + mPlayer.alliance.playerArray.length);
      mAllianceView.openAllianceProfile();
      return false
    });
    $("#nextMemberPermissions").click(function() {
      mPlayer.nextPage(mPlayer.alliance.playerArray.length);
      $("#memberNumbers").text(mPlayer.currentItems.start + 1 + " - " + mPlayer.currentItems.end + " / " + mPlayer.alliance.playerArray.length);
      mAllianceView.openAllianceProfile();
      return false
    });
    $(".editabledescription").editableText({newlinesEnabled: true});
    $(".editablename").editableText({newlinesEnabled: false});
    $(".editableText").change(function() {
      var d = $(this).html();
      var c = $(this).metadata().changeAction;
      if (c == "NAME") {
        if (mAllianceView.checkAllianceName(d)) {
          mAllianceView.changeAllianceName(d)
        }
      } else {
        if (mAllianceView.checkMaxDescriptionLength(d)) {
          mAllianceView.changeAllianceDescription(d)
        }
      }
    });
    $("div.deleteInvitation").click(function() {
      mCurrentActionBlocked = false;
      mPlayer.alliance.deleteInvitation($(this).metadata().invitedMember)
    });
    $("select.selectDiplomacy").change(function() {
      var c = parseInt($(this).val());
      mPlayer.alliance.changeAllianceRelationship($(this).metadata().allianceMember, c)
    });
    $("table.diplomacyTypeTable").first().removeClass("notSelected");
    $("table.diplomacyTypeTable").first().addClass("isSelected");
    $("table.diplomacyTypeTable").click(function() {
      $("table.diplomacyTypeTable").each(function(c) {
        if ($("table.diplomacyTypeTable").hasClass("isSelected")) {
          $("table.diplomacyTypeTable").removeClass("isSelected");
          $("table.diplomacyTypeTable").addClass("notSelected")
        }
      });
      $(this).addClass("isSelected")
    });
    $("div.diplomacyName").click(function() {
      var d = ($(this).metadata().diplomacyID);
      var c = $(this);
      switch (d) {
        case"1":
          $("div.friendAlliance").hide();
          $("div.foeAlliance").hide();
          $("div.vasallAlliance").hide();
          $("div.napAlliance").show();
          break;
        case"2":
          $("div.napAlliance").hide();
          $("div.foeAlliance").hide();
          $("div.vasallAlliance").hide();
          $("div.friendAlliance").show();
          break;
        case"3":
          $("div.friendAlliance").hide();
          $("div.napAlliance").hide();
          $("div.foeAlliance").hide();
          $("div.vasallAlliance").show();
          break;
        case"-1":
          $("div.friendAlliance").hide();
          $("div.vasallAlliance").hide();
          $("div.napAlliance").hide();
          $("div.foeAlliance").show();
          break
        }
    });
    $("div.accept").click(function() {
      mCurrentActionBlocked = false;
      mPlayer.alliance = null;
      var c = $(this).parent().metadata().allianceId;
      blockUI("Loading...");
      var d = {};
      d.id = c;
      d.PropertyListVersion = propertyListVersion;
      d[mPlayer.userIdentifier] = mPlayer.getHash();
      genericAjaxRequest("AllianceAction/acceptInvitation", d, "Session.updateCallback")
    });
    $("div.noaccept").click(function() {
      mCurrentActionBlocked = false;
      var c = $(this).parent().metadata().allianceId;
      blockUI("Loading...");
      var d = {};
      d.id = c;
      d.PropertyListVersion = propertyListVersion;
      d[mPlayer.userIdentifier] = mPlayer.getHash();
      genericAjaxRequest("AllianceAction/declineInvitation", d, "Session.updateCallback")
    });
    $("div.alliancelink").click(function() {
      if ($(this).metadata().allianceId != mPlayer.alliance.id) {
        mAllianceView.getAllianceInformation($(this).metadata().allianceId)
      }
    });
    $("div.leave").click(function() {
      mCurrentActionBlocked = false;
      var d = mStringtable.getValueOf("Are you sure?");
      var c = $(this).metadata().ownAllianceId;
      showPapyrusMsgBox(d, false, leave_alliance, c, true)
    });
    $("div.disband").click(function() {
      mCurrentActionBlocked = false;
      var d = mStringtable.getValueOf("Are you sure?");
      var c = $(this).metadata().ownAllianceId;
      showPapyrusMsgBox(d, false, disband_alliance, c, true)
    });
    $("td.ownMemberlink").click(function() {
      var c = $(this).metadata().memberId;
      if (c != mPlayer.id) {
        openExternPlayerProfile(c)
      } else {
        openPlayerView()
      }
    });
    $(".fire").click(function() {
      var c;
      mCurrentActionBlocked = false;
      $("table.members tr::visible input:checked").each(function() {
        c = $(this).metadata().memberId;
        if (c == mPlayer.id) {
          mPlayer.alliance = null
        }
        blockUI("Loading...");
        var d = {};
        d.id = c;
        d.PropertyListVersion = propertyListVersion;
        d[mPlayer.userIdentifier] = mPlayer.getHash();
        genericAjaxRequest("AllianceAction/dismissPlayer", d, "mAllianceView.deleteMemberCallback")
      })
    });
    $("input#selectAllAllianceMember").click(function() {
      if (($(this).is(":checked"))) {
        $("#ally_members_list table.members tr:visible input").each(function() {
          $(this).attr("checked", "checked");
          $(".fire").hide()
        })
      } else {
        $("#ally_members_list table.members tr:visible input").each(function() {
          $(this).attr("checked", false);
          $(".fire").show()
        })
      }
    });
    $("div.massmail").click(function() {
      var g = $("#ally_members_list table.members tr::visible input:checked").length;
      var d = "";
      var e = "";
      var c = "";
      $("#ally_members_list table.members tr::visible input:checked").each(function() {
        d += (($(this).metadata().memberId) + ",");
        e += (($(this).metadata().memberNick) + ", ")
      });
      d = d.substring(0, d.length - 1);
      e = e.substring(0, e.length - 2);
      if (e.length >= 70) {
        e = e.substring(0, 70);
        e += "..."
      }
      if (g == 0) {
        var f = 0;
        $("#ally_members_list table.members tr::visible input").each(function() {
          f++;
          if (f < 10) {
            c += (($(this).metadata().memberNick) + ", ")
          } else {
            return false
          }
        });
        c = c.substring(0, c.length - 2);
        if (c.length >= 70) {
          c = c.substring(0, 70);
          c += "..."
        }
        d = "all";
        mMessagesView = new MessagesView(d, c)
      } else {
        mMessagesView = new MessagesView(d, e)
      }
      mMessagesView.massMailMode = true;
      mMessagesView.newMessageMode = true;
      mMessagesView.fromView = mBottomBar.selectedIndex;
      selectButton(5, ITEMTYPE.MESSAGES_VIEW_ITEM);
      mMessagesView.loadDiscussionTitles();
      mCurrentActionBlocked = true
    });
    $(".CheckBoxClass").change(function() {
      if ($(this).is(":checked")) {
        $(this).next("label").addClass("LabelSelected");
        $(this).next("label").find(".fakeCheckBox").attr("src", "../pictures/Icons/TransitAttack.png")
      } else {
        $(this).next("label").removeClass("LabelSelected");
        $(this).next("label").find(".fakeCheckBox").attr("src", "../pictures/Icons/Search.png")
      }
    });
    $("div.goToAllyProfile").click(function() {
      if ($(this).metadata().playerID != mPlayer.id) {
        openExternPlayerProfile($(this).metadata().playerID)
      }
    });
    $("div.goToAllyPage").click(function() {
      if ($(this).metadata().allyID != mPlayer.alliance.id) {
        openExternAllianceProfile($(this).metadata().allyID)
      }
    });
    windowSize();
    $(".noscroll").height($(".fullscreeninnerWithHeadlineAndPapyrus").height() * 0.75);
    if (b.selectedTabIndex == 5) {
      b.loadRanking()
    }
    if (b.selectedTabIndex == 6) {
      if (mBottomBar.selectedIndex == 8) {
        $("ul.tabDisplay").hide();
        $("#profileAlliance").hide();
        $("span.habitatListItemTitle").text(mStringtable.getValueOf("Alliance Forum"));
        b.initForum()
      }
    }
    if (b.selectedTabIndex == 2) {
      b.initReportsView()
    }
  } else {
    mCurrentActionBlocked = true;
    mAllianceView.createNewAlliance()
  }
  windowSize()
};
AllianceView.prototype.initReportsView = function() {
  if (mReportsView == null) {
    mReportsView = new ReportsView(true, false)
  } else {
    mReportsView.modus = true;
    mReportsView.spyReport = false
  }
  mReportsView.loadReports(mReportsView.initialCategory)
};
AllianceView.prototype.initForum = function() {
  if (mAllianceForum == null) {
    mAllianceForum = new AllianceForum()
  }
  mAllianceForum.loadThreads()
};
AllianceView.prototype.loadRanking = function() {
  var a = parseInt(mPlayer.alliance.rank);
  if ((a + parseInt(mSettings.maxRankingListItemsPerPage / 2)) > parseInt(mSettings.maxRankingListItemsPerPage)) {
    mAllianceView.curRankingStartIndex = (parseInt(mPlayer.alliance.rank) + parseInt(mSettings.maxRankingListItemsPerPage / 2)) - parseInt(mSettings.maxRankingListItemsPerPage);
    mAllianceView.curRankingEndIndex = parseInt(mPlayer.alliance.rank) + parseInt(mSettings.maxRankingListItemsPerPage)
  } else {
    mAllianceView.curRankingStartIndex = 1;
    mAllianceView.curRankingEndIndex = parseInt(mSettings.maxRankingListItemsPerPage + 1)
  }
  var a = parseInt(mPlayer.alliance.rankAverage);
  if ((a + parseInt(mSettings.maxRankingListItemsPerPage / 2)) > parseInt(mSettings.maxRankingListItemsPerPage)) {
    mAllianceView.curRankingAverageStartIndex = parseInt(mPlayer.alliance.rankAverage) - parseInt(mSettings.maxRankingListItemsPerPage / 2);
    mAllianceView.curRankingAverageEndIndex = parseInt(mPlayer.alliance.rankAverage) + parseInt(mSettings.maxRankingListItemsPerPage / 2)
  } else {
    mAllianceView.curRankingAverageStartIndex = 1;
    mAllianceView.curRankingAverageEndIndex = parseInt(mSettings.maxRankingListItemsPerPage + 1)
  }
  mAllianceView.rankingEntries = [];
  mAllianceView.rankingAverageEntries = [];
  mAllianceView.getNextRankingEntries()
};
AllianceView.prototype.getNextRankingEntries = function() {
  var b;
  if (this instanceof AllianceView) {
    b = this
  } else {
    b = this.data
  }
  if (!mIsBlocked) {
    blockUI("AllianceAction/showRanking")
  }
  var a = {};
  a.start = b.curRankingStartIndex;
  a.end = b.curRankingEndIndex;
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("AllianceAction/showRankingV2", a, "mAllianceView.openAllianceRankingCallback")
};
AllianceView.prototype.getNextRankingAverageEntries = function() {
  if (!mIsBlocked) {
    blockUI("AllianceAction/showRanking")
  }
  var b;
  if (this instanceof AllianceView) {
    b = this
  } else {
    b = this.data
  }
  var a = {};
  a.start = b.curRankingAverageStartIndex;
  a.end = b.curRankingAverageEndIndex;
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("AllianceAction/showRankingByAverage", a, "mAllianceView.openAllianceRankingAverageCallback")
};
AllianceView.prototype.openAllianceRankingAverageCallback = function(b) {
  if (b.error) {
    if (b.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(b.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(b.error))
    }
  } else {
    if (b.ranking.length > 0) {
      var c = new Array();
      var a = 0;
      $.each(b.ranking, function(d, e) {
        c.push(new Alliance(e));
        if (e.id == mPlayer.alliance.id) {
          a = d
        }
      });
      if (a > parseInt(mSettings.maxRankingListItemsPerPage / 2) && mAllianceView.openRangingListForFirstTime) {
        mAllianceView.rankingAverageEntries = c.splice((a - parseInt(mSettings.maxRankingListItemsPerPage / 2)), (a + parseInt(mSettings.maxRankingListItemsPerPage / 2)))
      } else {
        mAllianceView.rankingAverageEntries = c.splice(0, parseInt(mSettings.maxRankingListItemsPerPage))
      }
      mAllianceView.showRankingAverage()
    } else {
      if (mAllianceView.direction == 1) {
        mAllianceView.curRankingAverageStartIndex += mSettings.maxRankingListItemsPerPage;
        mAllianceView.curRankingAverageEndIndex += mSettings.maxRankingListItemsPerPage;
        mAllianceView.getNextRankingAverageEntries()
      } else {
        mAllianceView.curRankingAverageStartIndex -= mSettings.maxRankingListItemsPerPage;
        mAllianceView.curRankingAverageEndIndex -= mSettings.maxRankingListItemsPerPage;
        mAllianceView.getNextRankingAverageEntries()
      }
    }
  }
  unblockUI()
};
AllianceView.prototype.openAllianceRankingCallback = function(b) {
  if (b.error) {
    if (b.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(b.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(b.error))
    }
  } else {
    if (b.ranking.length > 0) {
      var c = new Array();
      var a = 0;
      $.each(b.ranking, function(d, e) {
        c.push(new Alliance(e));
        if (e.id == mPlayer.alliance.id) {
          a = d
        }
      });
      if (a > parseInt(mSettings.maxRankingListItemsPerPage / 2) && mAllianceView.openRangingListForFirstTime) {
        mAllianceView.rankingEntries = c.splice((a - parseInt(mSettings.maxRankingListItemsPerPage / 2)), (a + parseInt(mSettings.maxRankingListItemsPerPage / 2)));
        mAllianceView.openRangingListForFirstTime = false
      } else {
        mAllianceView.rankingEntries = c.splice(0, parseInt(mSettings.maxRankingListItemsPerPage))
      }
      mAllianceView.showRanking()
    } else {
      if (mAllianceView.direction == 1) {
        mAllianceView.curRankingStartIndex += mSettings.maxRankingListItemsPerPage;
        mAllianceView.curRankingEndIndex += mSettings.maxRankingListItemsPerPage;
        mAllianceView.getNextRankingEntries()
      } else {
        mAllianceView.curRankingStartIndex -= mSettings.maxRankingListItemsPerPage;
        mAllianceView.curRankingEndIndex -= mSettings.maxRankingListItemsPerPage;
        mAllianceView.getNextRankingEntries()
      }
    }
  }
  mAllianceView.getNextRankingAverageEntries()
};
AllianceView.prototype.showRankingAverage = function() {
  $.tmpl("allianceRankingAverageTmpl", mAllianceView).appendTo($("tbody#rankingAverageItems").empty());
  windowSize();
  if ($("#extra_for_scroll_yy2").length) {
    var a = $("#rankingAverageItems").offset().top;
    var b = ($("#extra_for_scroll_yy2").offset().top - a) - 100;
    $("#div_rankingAverage_scroll").scrollTop(b)
  } else {
    $("#div_rankingAverage_scroll").scrollTop(100)
  }
  $("div.nextItemsAverage").click(function() {
    mAllianceView.scroll_down = $("#div_rankingAverage_scroll").scrollTop();
    mAllianceView.prev_or_next = true;
    mAllianceView.direction = 1;
    if (mAllianceView.rankingAverageEntries[mAllianceView.rankingAverageEntries.length - 1].points > 0) {
      mAllianceView.curRankingAverageStartIndex = mAllianceView.rankingAverageEntries[0].rankAverage + mSettings.maxRankingListItemsPerPage;
      mAllianceView.curRankingAverageEndIndex = mAllianceView.curRankingAverageStartIndex + mSettings.maxRankingListItemsPerPage;
      mAllianceView.getNextRankingAverageEntries()
    } else {
      $("div.nextItemsAverage").empty()
    }
  });
  $("div.previousItemsAverage").click(function() {
    mAllianceView.scroll_down = 0;
    mAllianceView.prev_or_next = true;
    mAllianceView.direction = -1;
    if (mAllianceView.rankingAverageEntries[0].rankAverage > mSettings.maxRankingListItemsPerPage) {
      mAllianceView.curRankingAverageEndIndex = mAllianceView.rankingAverageEntries[0].rankAverage;
      mAllianceView.curRankingAverageStartIndex = (mAllianceView.rankingAverageEntries[0].rankAverage) - mSettings.maxRankingListItemsPerPage
    } else {
      mAllianceView.curRankingAverageEndIndex = mSettings.maxRankingListItemsPerPage + 1;
      mAllianceView.curRankingAverageStartIndex = 1
    }
    mAllianceView.getNextRankingAverageEntries()
  });
  $("div.allyline").click(function() {
    if ($(this).metadata().allyID != mPlayer.alliance.id) {
      openExternAllianceProfile($(this).metadata().allyID)
    }
  })
};
AllianceView.prototype.showRanking = function() {
  $.tmpl("allianceRankingTmpl", mAllianceView).appendTo($("tbody#rankingitems").empty());
  windowSize();
  if ($("#extra_for_scroll_yy").length) {
    var a = $("#rankingitems").offset().top;
    var b = ($("#extra_for_scroll_yy").offset().top - a) - 100;
    $("#div_ranking_scroll").scrollTop(b)
  } else {
    $("#div_ranking_scroll").scrollTop(100)
  }
  $("div.nextItems").click(function() {
    mAllianceView.scroll_down = $("#div_ranking_scroll").scrollTop();
    mAllianceView.prev_or_next = true;
    mAllianceView.direction = 1;
    if (mAllianceView.rankingEntries[mAllianceView.rankingEntries.length - 1].points > 0) {
      mAllianceView.curRankingStartIndex = mAllianceView.rankingEntries[0].rank + mSettings.maxRankingListItemsPerPage;
      mAllianceView.curRankingEndIndex = mAllianceView.curRankingStartIndex + mSettings.maxRankingListItemsPerPage;
      mAllianceView.getNextRankingEntries()
    } else {
      $("div.nextItems").empty()
    }
  });
  $("div.previousItems").click(function() {
    mAllianceView.scroll_down = 0;
    mAllianceView.prev_or_next = true;
    mAllianceView.direction = -1;
    if (mAllianceView.rankingEntries[0].rank > mSettings.maxRankingListItemsPerPage) {
      mAllianceView.curRankingEndIndex = mAllianceView.rankingEntries[0].rank;
      mAllianceView.curRankingStartIndex = (mAllianceView.rankingEntries[0].rank) - mSettings.maxRankingListItemsPerPage
    } else {
      mAllianceView.curRankingEndIndex = mSettings.maxRankingListItemsPerPage + 1;
      mAllianceView.curRankingStartIndex = 1
    }
    mAllianceView.getNextRankingEntries()
  });
  $("div.allyline").click(function() {
    if ($(this).metadata().allyID != mPlayer.alliance.id) {
      openExternAllianceProfile($(this).metadata().allyID)
    }
  })
};
AllianceView.prototype.deleteMemberCallback = function(a) {
  if (a.touchDate) {
    globalTouchDate = a.touchDate
  }
  unblockUI();
  if (a.error) {
    if (a.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error))
    }
  } else {
    if (mPlayer.alliance) {
      mPlayer.alliance.updatePlayerArray(a.player.alliance);
      mBottomBar.callLastView()
    } else {
      mAllianceView = null;
      openAllianceView()
    }
  }
};
AllianceView.prototype.openExternAllianceProfile = function(a) {
  var d = this;
  d.externalProfile = true;
  d.externAllianceId = a.id;
  mAllianceView.addViewToStack();
  a.descriptionText = Linksmaker.process(a.descriptionText);
  $.tmpl("externAllianceProfileTmpl", a).appendTo($("div.viewport").empty());
  setPapyrusBackgroundForFullScreenView();
  setHover("div.externAllianceProfile");
  var b = {alliance_id: a.id};
  $("#CenterAllianceForPolMap").bind("click", b, hAlliancePmap);
  $("#copy_alliance_link").click(function() {
    copy_alliance_link_Handler(a.id)
  });
  $(".internal_link").click(function() {
    Actionslinks.openView($(this).attr("id"))
  });
  $("div.closeViewMission").click(function(e) {
    if (mBottomBar.selectedIndex != 4) {
      navigateBack()
    } else {
      openMap()
    }
  });
  $("td.memberlink").click(function() {
    var e = $(this).metadata().memberId;
    if (e != mPlayer.id) {
      openExternPlayerProfile(e)
    }
  });
  if (mPlayer.alliance) {
    var c = mPlayer.alliance.getDiplomacyRelationship(a.id);
    $("select.selectDiplomacy").val(c);
    $("select.selectDiplomacy").change(function() {
      var e = parseInt($(this).val());
      mPlayer.alliance.changeAllianceRelationship($(this).metadata().allianceMember, e)
    })
  }
  windowSize()
};
AllianceView.prototype.getAllianceInformation = function(b) {
  if (typeof b != "undefined") {
    mAllianceView.externAllianceId = b
  }
  blockUI("Loading...");
  var a = {};
  a.id = mAllianceView.externAllianceId;
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("AllianceAction/allianceInformation", a, "AllianceView.getAllianceInformationCallback")
};
AllianceView.getAllianceInformationCallback = function(b) {
  if (b.error) {
    if (b.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(b.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(b.error))
    }
  } else {
    if (b.alliance) {
      var a = new Alliance(b.alliance);
      mAllianceView.openExternAllianceProfile(a)
    }
  }
  unblockUI()
};
AllianceView.prototype.getAllianceMembers = function() {
  blockUI("AllianceAction/allianceMembers");
  var a = {};
  a.id = mPlayer.alliance.id;
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("AllianceAction/allianceMembers", a, "mPlayer.alliance.allianceMembersCallback")
};
AllianceView.allianceMemberPermissionChangedCallback = function(a) {
  if (a.touchDate) {
    globalTouchDate = a.touchDate
  }
  if (a.touchDate) {
    globalTouchDate = a.touchDate
  }
  if (a.error) {
    if (a.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error))
    }
  } else {
    if (a.Player) {
      mAllianceView.openAllianceProfile()
    }
  }
  unblockUI()
};
AllianceView.deleteInvitationCallback = function(a) {
  if (a.error) {
    if (a.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error))
    }
  } else {
    if (a.player) {
      $.each(mPlayer.alliance.invitedPlayerArray, function(c, b) {
        if (b.id == a.player.id) {
          mPlayer.alliance.invitedPlayerArray.splice(c, 1)
        }
      });
      mAllianceView.openAllianceProfile()
    }
  }
  unblockUI()
};
AllianceView.changeAllianceRelationshipCallback = function(a) {
  if (a.touchDate) {
    globalTouchDate = a.touchDate
  }
  if (a.error) {
    if (a.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error))
    }
  } else {
    mSession.addJob(SESSIONJOBTYPE.ALLIANCERELATIONSHIP);
    if (mAllianceView.externalProfile == false) {
      mAllianceView.openAllianceProfile()
    }
  }
  unblockUI()
};
AllianceView.prototype.checkAllianceName = function(a) {
  if (a == null || a.length == 0) {
    showPapyrusMsgBox(mStringtable.getValueOf("Please enter alliance name"));
    return false
  } else {
    return true
  }
};
AllianceView.prototype.checkMaxDescriptionLength = function(a) {
  if (a != null && a.length > mSettings.maxAllianceDescriptionLength) {
    showPapyrusMsgBox(mStringtable.getValueOf("Beschreibung ist zu lang"));
    return false
  } else {
    return true
  }
};
AllianceView.prototype.createNewAlliance = function() {
  mBottomBar.clearStack();
  $.tmpl("newAllianceTmpl", mPlayer).appendTo($("div.viewport").empty());
  setPapyrusBackgroundForRightSide();
  setHover("div.noalliance");
  windowSize();
  $("div.formAlliance").click(function() {
    mCurrentActionBlocked = false;
    mAllianceView.addViewToStack(true);
    var a = $("div.noalliance").parent().find("#newAllianceName").val();
    if (mAllianceView.checkAllianceName(a)) {
      blockUI("Loading...");
      var b = {};
      b.name = a;
      b.descriptionText = "";
      b.PropertyListVersion = propertyListVersion;
      b[mPlayer.userIdentifier] = mPlayer.getHash();
      genericAjaxRequest("AllianceAction/createAlliance", b, "Session.updateCallback")
    }
  });
  $("div.alliancelink").click(function() {
    mAllianceView.addViewToStack();
    openExternAllianceProfile($(this).metadata().allianceId)
  });
  $("div.accept").click(function() {
    mCurrentActionBlocked = false;
    mAllianceView.addViewToStack(true);
    var a = $(this).parent().metadata().allianceId;
    blockUI("Loading...");
    var b = {};
    b.id = a;
    b.PropertyListVersion = propertyListVersion;
    b[mPlayer.userIdentifier] = mPlayer.getHash();
    genericAjaxRequest("AllianceAction/acceptInvitation", b, "Session.updateCallback")
  });
  $("div.noaccept").click(function() {
    mCurrentActionBlocked = false;
    var a = $(this).parent().metadata().allianceId;
    blockUI("Loading...");
    var b = {};
    b.id = a;
    b.PropertyListVersion = propertyListVersion;
    b[mPlayer.userIdentifier] = mPlayer.getHash();
    genericAjaxRequest("AllianceAction/declineInvitation", b, "Session.updateCallback")
  })
};
AllianceView.prototype.changeAllianceDescription = function(b) {
  blockUI("Loading...");
  var a = {};
  a.descriptionText = b;
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("AllianceAction/changeAllianceData", a, "mAllianceView.changeDescriptionCallback")
};
AllianceView.prototype.changeAllianceName = function(b) {
  blockUI("Loading...");
  var a = {};
  a.name = b;
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("AllianceAction/changeAllianceData", a, "Session.updateCallback")
};
AllianceView.prototype.changeDescriptionCallback = function(a) {
  if (a.touchDate) {
    globalTouchDate = a.touchDate
  }
  if (a.error) {
    if (a.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error))
    }
  } else {
    if (typeof a.player.alliance.descriptionText != "undefined" && a.player.alliance.descriptionText != null) {
      var b = escape(a.player.alliance.descriptionText).replace(/\%0A/g, "\\n");
      mPlayer.alliance.descriptionText = unescape(b).replace(/\\n/g, "<br/>");
      mPlayer.alliance.descriptionText = Linksmaker.process(mPlayer.alliance.descriptionText)
    }
  }
  unblockUI()
};
function BattleValue(b, a) {
  this.battleName = b;
  this.offense = a.offense;
  this.defense = a.defense
}
BattleValue.prototype.getOffense = function(a) {
  return this.getModifierPercentage(MODIFIERTYPE.OFFENSE, a, this.offense)
};
BattleValue.prototype.getDefense = function(a) {
  return this.getModifierPercentage(MODIFIERTYPE.DEFENSE, a, this.defense)
};
BattleValue.prototype.getModifierPercentage = function(b, a, c) {
  $.each(mPlayer.currentHabitat.habitatModifier, function(e, d) {
    if (d.type == b) {
      if (jQuery.inArray("Unit", d.targets) > -1) {
        if (d.corps == null || d.corps == a) {
          c = c * d.percentage
        }
      }
    }
  });
  return Math.round(c)
};
function BottomBar() {
  this.mainButtons = new Array();
  this.selectedIndex = -1;
  this.stackArray = new Array();
  this.soundOff = false
}
BottomBar.prototype.initializeButtons = function() {
  this.mainButtons.push(new Button(mStringtable.getValueOf("Habitat"), mPath_Images + mDir_Browser + mDir_BottomBar + "BarCastle.png", "openHabitatView(this)"));
  this.mainButtons.push(new Button(mStringtable.getValueOf("Castles"), mPath_Images + mDir_Browser + mDir_BottomBar + "BarCastleList.png", "openCastleList()"));
  this.mainButtons.push(new Button(mStringtable.getValueOf("Recruitment list"), mPath_Images + mDir_Browser + mDir_BottomBar + "BarRecruitment.png", "openRecruitingList(this)"));
  this.mainButtons.push(new Button(mStringtable.getValueOf("Construction list"), mPath_Images + mDir_Browser + mDir_BottomBar + "BarBuildings.png", "openBuildingList(this)"));
  this.mainButtons.push(new Button(mStringtable.getValueOf("Transit units"), mPath_Images + mDir_Browser + mDir_BottomBar + "BarTroops.png", "openUnitsView(this)"));
  this.mainButtons.push(new Button(mStringtable.getValueOf("Map"), mPath_Images + mDir_Browser + mDir_BottomBar + "BarMap.png", "openMap(this)"));
  this.mainButtons.push(new Button(mStringtable.getValueOf("Messages"), mPath_Images + mDir_Browser + mDir_BottomBar + "BarMessages.png", "openMessagesView(this)"));
  this.mainButtons.push(new Button(mStringtable.getValueOf("Reports"), mPath_Images + mDir_Browser + mDir_BottomBar + "BarReports.png", "openReportsView(this)"));
  this.mainButtons.push(new Button(mStringtable.getValueOf("Alliance"), mPath_Images + mDir_Browser + mDir_BottomBar + "BarAlliance.png", "openAllianceView(this)"));
  this.mainButtons.push(new Button(mStringtable.getValueOf("Forum"), mPath_Images + mDir_Browser + mDir_BottomBar + "BarForum.png", "openAllianceForum(this)"));
  this.mainButtons.push(new Button(mStringtable.getValueOf("Player"), mPath_Images + mDir_Browser + mDir_BottomBar + "BarPlayer.png", "openPlayerView(this)"))
};
BottomBar.prototype.initializeStacks = function() {
  for (var a = 0; a < this.mainButtons.length; a++) {
    this.stackArray.push(new Array())
  }
};
BottomBar.prototype.addToStack = function(b) {
  var a = mBottomBar.stackArray[this.selectedIndex];
  if (a.length < 1) {
    a.push(b)
  } else {
    if (b.equalsItem(a[a.length - 1]) == false) {
      a.push(b)
    }
  }
};
BottomBar.prototype.stacksEmpty = function() {
  var b = true;
  for (var a = 0; a < this.stackArray.length; a++) {
    if (this.stackArray[a].length > 0) {
      b = false
    }
  }
  return b
};
BottomBar.prototype.popFromStack = function() {
  var a = mBottomBar.stackArray[this.selectedIndex];
  if (a.length > 1) {
    a.pop()
  }
  a[a.length - 1].recallView()
};
BottomBar.prototype.clearStack = function() {
  mBottomBar.stackArray[this.selectedIndex].length = 0
};
BottomBar.prototype.clearAllStacks = function() {
  for (var a = 0; a < this.stackArray.length; a++) {
    mBottomBar.stackArray[a].length = 0
  }
};
BottomBar.prototype.currentStackIsEmpty = function() {
  return(mBottomBar.stackArray[this.selectedIndex].length == 0)
};
BottomBar.prototype.callLastView = function(c) {
  var b;
  if (typeof c == "undefined") {
    b = this.selectedIndex
  } else {
    b = c
  }
  if (b == 10) {
    return
  }
  if (b != 4) {
    if (b == 7 && mPlayer.alliance == null) {
      mBottomBar.clearStack();
      openAllianceView()
    } else {
      if (b == 6 && mBottomBar.stackArray[b].length > 0) {
        mReportsView.loadReports()
      } else {
        if (b == 8 && mBottomBar.stackArray[b].length > 0) {
          openAllianceForum()
        } else {
          var a = mBottomBar.stackArray[b];
          if (typeof a == "undefined") {
            finishConnect()
          } else {
            a[a.length - 1].recallView()
          }
        }
      }
    }
  } else {
    mapActions.execute()
  }
};
BottomBar.prototype.addToBody = function() {
  $("#" + mDivId).append('<div class="bottombar"></div>');
  $.tmpl("bottomBarTmpl", mPlayer).appendTo($("div.bottombar").empty());
  $("div.main a:first").addClass("active");
  $("a#logmeout").click(function() {
    mBottomBar.logout()
  })
};
BottomBar.prototype.logout = function() {
  var a = {};
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("SessionAction/disconnect", a, "disconnect")
};
BottomBar.prototype.unselectButton = function() {
  $("div.main a").each(function() {
    $(this).removeClass("active")
  })
};
BottomBar.prototype.selectButton = function(a) {
  if (a != 10) {
    this.selectedIndex = a
  }
  $("div.main a").each(function() {
    if (a == $(this).metadata().index) {
      $(this).addClass("active")
    }
  })
};
BottomBar.prototype.setNewCounts = function() {
  newArray3 = mPlayer.getGroupedHabitatTransits();
  mPlayer.habitatIsAttacked = 0;
  var a = new Array();
  $.each(mPlayer.habitate, function(d, e) {
    $.each(e.habitatTransits, function(g, f) {
      if (f.transitType == 2 && mPlayer.isOwnHabitat(f.destinationHabitat.id)) {
        a.push(f.destinationHabitat.id)
      }
    })
  });
  if (!Array.prototype.indexOf) {
    $.each(mPlayer.habitate, function(d, e) {
      if (a.indexOfExtra(d) > -1) {
        mPlayer.habitatIsAttacked++
      }
    })
  } else {
    $.each(mPlayer.habitate, function(d, e) {
      if (a.indexOf(d) > -1) {
        mPlayer.habitatIsAttacked++
      }
    })
  }
  var b = "<div class='messageDisplay_left'></div><div class='messageDisplay_middle'><span class='newVal'>";
  var c = "</span></div><div class='messageDisplay_right'></div>";
  $("div.setVal").each(function(e) {
    if (e == 1 && mPlayer.unreadDiscussionCount) {
      $(this).html(b + mPlayer.unreadDiscussionCount + c)
    } else {
      if (e == 1) {
        $(this).html("")
      }
    }
    if (e == 2 && mPlayer.unreadReportCount) {
      $(this).html(b + mPlayer.unreadReportCount + c)
    } else {
      if (e == 2) {
        $(this).html("")
      }
    }
    if (e == 3) {
      $(this).html("")
    } else {
      if (e == 3) {
        $(this).html("")
      }
    }
    if (e == 4 && mPlayer.unreadAllianceMessages) {
      $(this).html(b + mPlayer.unreadAllianceMessages + c)
    } else {
      if (e == 4) {
        $(this).html("");
        var d = mStringtable.getValueOf("Forum");
        if (mPlayer.alliance == null) {
          if (mResolution == "2x") {
            $("a.button[title^=" + d + "]").addClass("disabledFroumButton2x")
          } else {
            $("a.button[title^=" + d + "]").addClass("disabledFroumButton")
          }
        } else {
          $("a.button[title^=" + d + "]").removeClass("disabledFroumButton");
          $("a.button[title^=" + d + "]").removeClass("disabledFroumButton2x")
        }
      }
    }
    if (e == 0 && mPlayer.habitatIsAttacked > 0) {
      $(this).html(b + mPlayer.habitatIsAttacked + c)
    } else {
      if (e == 0) {
        $(this).html("")
      }
    }
  })
};
function Building(b, v, f, c, B, l, o, n, C, e, t, d, m, z, A, g, a, u, w, k, r, j, h) {
  this.primaryKey = b;
  this.order = v;
  this.identifier = f;
  this.level = c;
  this.upgradeOf = B;
  this.upgradeTo = l;
  this.buildResources = o;
  this.buildDuration = n;
  this.buildSpeedupCost = C;
  this.volumeResource = e;
  this.volumeAmount = t;
  this.storeAmount = d;
  this.storeResources = m;
  this.generateResources = z;
  this.marketDistance = A;
  this.marketRates = g;
  this.modifier = a;
  this.units = u;
  this.knowledges = w;
  this.requiredKnowledges = k;
  this.functions = r;
  this.missions = j;
  this.battleValues = h;
  this.numberOfPictures = 4
}
function Building(a) {
  this.primaryKey = getValueFromJSON(a.primaryKey);
  this.order = getValueFromJSON(a.order);
  this.identifier = getValueFromJSON(a.identifier);
  this.level = getValueFromJSON(a.level);
  this.upgradeOf = getValueFromJSON(a.upgradeOf);
  this.upgradeTo = getValueFromJSON(a.upgradeToArray);
  this.buildResources = makeKeyValueArrayFromJSON(a.buildResourceDictionary);
  this.buildDuration = getValueFromJSON(a.buildDuration);
  this.buildSpeedupCost = getValueFromJSON(a.buildSpeedupCost);
  this.volumeResource = getValueFromJSON(a.volumeResource);
  this.volumeAmount = getValueFromJSON(a.volumeAmount);
  this.storeAmount = getValueFromJSON(a.storeAmount);
  this.storeResources = makePointerArray(a.storeResourceArray, mResources, false);
  this.generateResources = makeKeyValueArrayFromJSON(a.generateResourceDictionary);
  this.marketDistance = getValueFromJSON(a.marketDistance);
  this.marketRates = null;
  if (a.marketRateDictionary) {
    var d = new Array();
    $.each(a.marketRateDictionary, function(j, g) {
      var h = {};
      $.each(g, function(k, l) {
        h[k] = l
      });
      d.push(new MarketRate(j, h))
    });
    this.marketRates = d
  }
  this.modifier = makePointerArray(a.modifierArray, mModifiers, false);
  this.units = makePointerArray(a.unitFactoryArray, mUnits, false);
  this.knowledges = null;
  if (a.knowledgeFactoryArray) {
    var e = new Array();
    $.each(a.knowledgeFactoryArray, function(g, h) {
      e.push(mKnowledges[h])
    });
    e.sort(function(h, g) {
      if (h.order < g.order) {
        return -1
      } else {
        return +1
      }
    });
    this.knowledges = e
  }
  this.requiredKnowledges = null;
  if (a.requiredKnowledgeArray) {
    var c = new Array();
    $.each(a.requiredKnowledgeArray, function(g, h) {
      c.push(mKnowledges[h])
    });
    c.sort(function(h, g) {
      if (h.order < g.order) {
        return -1
      } else {
        return +1
      }
    });
    this.requiredKnowledges = c
  }
  this.functions = makeValueArrayFromJSON(a.functionArray);
  this.missions = null;
  if (a.missionFactoryArray) {
    var b = new Array();
    $.each(a.missionFactoryArray, function(g, h) {
      b.push(mMissions[h])
    });
    b.sort(function(h, g) {
      if (h.order < g.order) {
        return -1
      } else {
        return +1
      }
    });
    this.missions = b
  }
  this.battleValues = null;
  if (a.battleValueDictionary) {
    var f = new Array();
    $.each(a.battleValueDictionary, function(h, g) {
      f.push(new BattleValue(h, g))
    });
    this.battleValues = f;
    this.battleValues.sort(function(h, g) {
      h = mStringtable.getValueOf(h.battleName).toLowerCase();
      g = mStringtable.getValueOf(g.battleName).toLowerCase();
      return(h == g) ? 0 : (h > g) ? 1 : -1
    })
  }
  this.numberOfPictures = parseInt(mPictureCounts[this.getIdentifierWithoutLevel()])
}
Building.prototype.getDescription = function() {
  var a;
  if (this instanceof Building) {
    a = this
  } else {
    a = this.data
  }
  return mStringtable.getValueOf("BKServerBuilding-" + (a.primaryKey - a.level))
};
Building.prototype.getUnitsArray = function() {
  var a = null;
  var b;
  if (this instanceof Building) {
    b = this
  } else {
    b = this.data
  }
  if (b.units) {
    a = new Array();
    $.each(b.units, function(c, d) {
      a.push(d)
    })
  }
  a.sort(function(d, c) {
    if (d.order < c.order) {
      return -1
    } else {
      return +1
    }
  });
  return a
};
Building.prototype.generatesOrStoresResource = function(b) {
  var a = false;
  if (this.generateResources != null) {
    $.each(this.generateResources, function(d, c) {
      if (b == d) {
        a = true
      }
    })
  } else {
    if (this.storeResources != null) {
      $.each(this.storeResources, function(d, c) {
        if (b == d) {
          a = true
        }
      })
    }
  }
  return a
};
Building.prototype.getVolumeAmountDifference = function() {
  var a;
  if (this instanceof Building) {
    a = this
  } else {
    a = this.data
  }
  return(a.volumeAmount - mBuildings[a.upgradeOf].volumeAmount)
};
Building.prototype.getTranslatedIdentifier = function() {
  if (this instanceof Building) {
    return mStringtable.getValueOf(this.identifier.split("/")[0])
  } else {
    return mStringtable.getValueOf(this.data.identifier.split("/")[0])
  }
};
Building.prototype.getIdentifierWithoutLevel = function() {
  if (this instanceof Building) {
    return this.identifier.split("/")[0]
  } else {
    return this.data.identifier.split("/")[0]
  }
};
Building.prototype.getOrder = function() {
  return this.order
};
Building.prototype.isFactory = function() {
  return(this.data.generateResources != null)
};
Building.prototype.getLevelString = function() {
  return $.sprintf(mStringtable.getValueOf("Level %d"), this.level)
};
Building.prototype.getCssName = function() {
  var a = this.getIdentifierWithoutLevel().replace(" ", "").toLowerCase();
  if (a.indexOf("store") == -1) {
    return a
  } else {
    return null
  }
};
Building.prototype.getImageSrc = function() {
  return mPath_Images + mDir_Buildings + this.getIdentifierWithoutLevel() + "Icon.png"
};
Building.prototype.getMaxLevel = function() {
  var a = this.level;
  if (mBuildings[this.primaryKey].upgradeTo) {
    a = mBuildings[this.upgradeTo].getMaxLevel()
  }
  return a
};
Building.prototype.getCurrentLevelPicture = function() {
  var a = this.getMaxLevel() / (this.numberOfPictures - 1);
  var b = this.level / a;
  if (b > (this.numberOfPictures - 1)) {
    b = this.numberOfPictures - 1
  }
  var c = this.getIdentifierWithoutLevel();
  return c + "/" + this.getIdentifierWithoutLevel() + Math.floor(b)
};
Building.prototype.getPictureFormat = function() {
  var a;
  if (this.getIdentifierWithoutLevel().replace(" ", "").toLowerCase() == "wall") {
    a = "jpg"
  } else {
    a = "png"
  }
  return a
};
Building.prototype.isUpgradeable = function(d) {
  var c;
  var e;
  if (this instanceof Building) {
    c = this.primaryKey;
    e = this.upgradeTo
  } else {
    c = this.data.primaryKey;
    e = this.data.upgradeTo
  }
  if (!d) {
    d = mPlayer.currentHabitat
  }
  if (e) {
    var b = true;
    $.each(mBuildings[e].buildResources, function(g, f) {
      if (f > d.habitatResources[g].amount) {
        b = false;
        return(false)
      }
    });
    var a = mBuildings[e].volumeResource;
    if (a) {
      if ((mBuildings[e].volumeAmount - mBuildings[c].volumeAmount) > (d.habitatResources[a].storeAmount - d.habitatResources[a].amount)) {
        b = false;
        return(false)
      }
    }
    if (mBuildings[e].requiredKnowledges) {
      $.each(mBuildings[e].requiredKnowledges, function(g, f) {
        if (!d.habitatKnowledges[f.primaryKey]) {
          b = false;
          return(false)
        }
      })
    }
    return b
  } else {
    return false
  }
};
Building.prototype.getResourcesForUpgrade = function(e) {
  if (e == null) {
    return false
  }
  var d;
  var f;
  if (this instanceof Building) {
    d = this.primaryKey;
    f = this.upgradeTo
  } else {
    d = this.data.primaryKey;
    f = this.data.upgradeTo
  }
  var c = [];
  if (f) {
    $.each(mBuildings[f].buildResources, function(h, g) {
      if (g > e.habitatResources[h].amount) {
        c.push({count: g, resourceId: h, color: "rot"})
      } else {
        c.push({count: g, resourceId: h, color: ""})
      }
    });
    var a = mBuildings[f].volumeResource;
    if (a) {
      var b = mBuildings[f].volumeAmount * 1 - mBuildings[d].volumeAmount * 1;
      if (b > (e.habitatResources[a].storeAmount * 1 - e.habitatResources[a].amount * 1)) {
        c.push({count: b, resourceId: 4, color: "rot"})
      } else {
        c.push({count: b, resourceId: 4, color: ""})
      }
    }
    if (mBuildings[f].requiredKnowledges) {
      $.each(mBuildings[f].requiredKnowledges, function(h, g) {
        if (!e.habitatKnowledges[g.primaryKey]) {
          c.push({count: g.identifier, resourceId: "know", color: "rot"})
        } else {
          c.push({count: g.identifier, resourceId: "know", color: ""})
        }
      })
    }
  }
  return c
};
Building.prototype.upgrade = function(b) {
  if (!b) {
    b = mPlayer.currentHabitat
  }
  if (this.isUpgradeable(b)) {
    if (b.habitatBuildingUpgrades.length >= mSettings.maxItemsInBuildingList) {
      var c = this;
      var a = mStringtable.getValueOf("Gold");
      $("#dialog:ui-dialog").dialog("destroy");
      $("#ui-dialog-title-dialog-confirm").text(mStringtable.getValueOf("Additional upgrade slot"));
      $("#dialog-confirm").attr("title", mStringtable.getValueOf("Additional upgrade slot"));
      $("#dialog-confirm > p").html($.sprintf(mStringtable.getValueOf("Your building upgrade queue is full. An additional slot costs %d %@\nYou have %d %@"), mBuildings[this.upgradeTo].buildSpeedupCost, a, mPlayer.gold, a));
      $("#dialog-confirm").dialog({resizable: false, width: 375, modal: true, draggable: false, buttons: [{text: mStringtable.getValueOf("cancel"), click: function() {
              $(this).dialog("close")
            }}, {text: mStringtable.getValueOf("ok"), click: function() {
              $(this).dialog("close");
              c.upgradeConfirm(b, true)
            }}]})
    } else {
      this.upgradeConfirm(b, false)
    }
  }
};
Building.prototype.upgradeConfirm = function(c, a) {
  blockUI("HabitatAction/upgradeBuilding");
  var b = {};
  b.habitatID = c.id;
  b.paymentGranted = a;
  b.primaryKey = mBuildings[this.upgradeTo].primaryKey;
  b.PropertyListVersion = propertyListVersion;
  b[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("HabitatAction/upgradeBuilding", b, "Session.updateCallback")
};
function event_building_speedup(b) {
  blockUI("HabitatAction/speedupBuildingUpgrade");
  var a = {};
  a.id = b;
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("HabitatAction/speedupBuildingUpgrade", a, "Session.updateCallback")
}
Building.prototype.speedup = function(b) {
  var a = mStringtable.getValueOf("Gold");
  var c = b.id;
  showPapyrusMsgBox($.sprintf(mStringtable.getValueOf("Build time reduction for %@ level %d costs %d %@. You have %d %@."), this.getTranslatedIdentifier(), this.level, this.buildSpeedupCost, a, mPlayer.gold, a), mStringtable.getValueOf("Speedup build"), event_building_speedup, c, true)
};
function event_building_finish(b) {
  blockUI("HabitatAction/finishBuildingUpgrade");
  var a = {};
  a.id = b;
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("HabitatAction/finishBuildingUpgrade", a, "Session.updateCallback")
}
Building.prototype.finish = function(b) {
  var a = mStringtable.getValueOf("Gold");
  var c = b.id;
  showPapyrusMsgBox($.sprintf(mStringtable.getValueOf("Finishing building %@ level %d instantly costs %d %@. You have %d %@."), this.getTranslatedIdentifier(), this.level, this.buildSpeedupCost, a, mPlayer.gold, a), mStringtable.getValueOf("Finish build"), event_building_finish, c, true)
};
Building.prototype.exchangeResource = function(f, b, e, d) {
  if (!f) {
    f = mPlayer.currentHabitat
  }
  var a = $.param(b).replace(/&/g, "; ") + ";";
  var g = $.param(e).replace(/&/g, "; ") + ";";
  blockUI("MarketAction/tradeResources");
  var c = {};
  c.habitatID = f.id;
  c.wantedResourceID = d;
  c.resourceDictionary = "{" + g + "}";
  c.unitDictionary = "{" + a + "}";
  c.PropertyListVersion = propertyListVersion;
  c[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("MarketAction/tradeResources", c, "Session.updateCallback")
};
function BuildingUpgrade(b, a) {
  this.habitatId = b;
  this.id = getValueFromJSON(a.id);
  this.buildingTarget = mBuildings[getValueFromJSON(a.buildingTargetID)];
  this.complete = jsonDateToDate(getValueFromJSON(a.complete));
  this.durationFactor = getValueFromJSON(a.durationFactor);
  this.durationInSeconds = getValueFromJSON(a.durationInSeconds)
}
BuildingUpgrade.prototype.getCompletionString = function() {
  return $.sprintf(mStringtable.getValueOf("Level %d done in %@"), this.buildingTarget.level, "")
};
BuildingUpgrade.prototype.getCompletionStringToLevel = function() {
  return $.sprintf(mStringtable.getValueOf("Upgrading to level %d done %@"), this.buildingTarget.level, "")
};
BuildingUpgrade.prototype.getLastCompletionString = function() {
  var a = mPlayer.currentHabitat.habitatBuildingUpgrades[mPlayer.currentHabitat.habitatBuildingUpgrades.length - 1].getCompletionDate();
  return $.sprintf(mStringtable.getValueOf("Last upgrade done %@"), a)
};
BuildingUpgrade.prototype.getCompletionDate = function() {
  return formatDateTime(this.complete)
};
BuildingUpgrade.prototype.isSpeededup = function() {
  if (this.durationFactor == 0.5) {
    return true
  } else {
    return false
  }
};
BuildingUpgrade.prototype.isHalfDurationReached = function() {
  var b = (this.complete - (new Date() - mTimeDifferenceToServer)) / 1000;
  var c = this.durationInSeconds;
  var a = b - c;
  if (a < 0) {
    a = 0
  }
  if (b < ((c / 2) + a)) {
    return true
  } else {
    return false
  }
};
BuildingUpgrade.prototype.updateTimeToComplete = function() {
  var a = this.complete - (new Date() - mTimeDifferenceToServer);
  if (a >= 0) {
    $("span#buildingUpgrade_" + this.id).html(secToTimeStr(Math.round(a / (1000))))
  } else {
    mSession.addJob(SESSIONJOBTYPE.BUILDINGUPGRADE);
    mPlayer.habitate[this.habitatId].deleteBuildingUpgradeFormList(this.id);
    $("table#" + this.id).remove()
  }
};
BuildingUpgrade.prototype.hasPreviousUpgrade = function() {
  var b = false;
  var a = this.buildingTarget.upgradeOf;
  if (mPlayer.habitate[this.habitatId].habitatBuildingUpgrades) {
    $.each(mPlayer.habitate[this.habitatId].habitatBuildingUpgrades, function(d, c) {
      if (c.buildingTarget.primaryKey == a) {
        b = true;
        return(false)
      }
    })
  }
  return b
};
function Button(a, b, c) {
  this.name = a;
  this.imageSrc = b;
  this.callback = c
}
function Country(a, b) {
  this.name = a;
  this.iso3166 = b
}
function Country(a) {
  this.name = getValueFromJSON(a.name);
  this.isoCode = getValueFromJSON(a.isoCode)
}
function Discussion(g, f, a, c, b, e, d) {
  this.id = g;
  this.title = f;
  this.lastReadDate = a;
  this.lastEntryDate = c;
  if (typeof a == "undefined" || a == null) {
    this.previouslyRead = false
  } else {
    if (a.getTime() < c.getTime()) {
      this.previouslyRead = false
    } else {
      this.previouslyRead = true
    }
  }
  this.lastEntry = b;
  this.discussionMember = e;
  this.discussionListener = d
}
function DiscussionEntry(e, c, d, a, b) {
  this.id = e;
  this.player = c;
  this.content = d;
  this.offenseLevel = a;
  this.creationDate = b
}
function DiscussionEntry(b, a) {
  this.player = a;
  if (b) {
    this.id = getValueFromJSON(b.id);
    this.content = getValueFromJSON(b.content);
    this.offenseLevel = getValueFromJSON(b.offenseLevel);
    this.creationDate = jsonDateToDate(getValueFromJSON(b.creationDate))
  }
}
function ExchangeView() {
  this.resValues = null;
  this.selectedResources = null;
  this.selectedUnits = null;
  this.unitValues = null
}
ExchangeView.prototype.initView = function(c, a) {
  this.unitValues = {};
  this.resValues = {};
  this.selectedUnits = {};
  this.selectedResources = {};
  $.tmpl("exchangeViewTmpl", mResources[c]).appendTo($("div.viewport").empty());
  $("img.warning").hide();
  setPapyrusBackgroundForFullScreenView();
  setHover("div.exchangeview");
  $("div.papyruscontent").scrollTop(0);
  $("div.actionTitle").html($.sprintf(mStringtable.getValueOf("Barter %@"), mStringtable.getValueOf(mResources[c].identifier)));
  $("." + c).css("display", "none");
  windowSize();
  $("input.materialcount").numeric({decimal: false, negative: false});
  $("input.materialcount").bind("paste", function(d) {
    d.preventDefault()
  });
  var b;
  $("span.rateright").html(secToTimeStr(Math.round(0)));
  $("span.rateright2").html(secToTimeStr(Math.round(0)));
  $("span.capacity").html("0 / 0");
  $("span.raterightResource").html("0");
  $.each(a.marketRates, function(d, e) {
    if (e.resourceID == c) {
      b = e;
      $.each(e.rates, function(f, g) {
        $("span#rate_" + f).html("1:" + g)
      })
    }
  });
  $("input.material_unit").blur(function(f) {
    var d = $(this);
    mExchangeView.updateExchangeViewValues(d, a, b)
  });
  $("input.material_resource").blur(function(f) {
    var d = $(this);
    mExchangeView.setMaxResourceAmount(d);
    mExchangeView.updateExchangeViewValues(d, a, b)
  });
  $("div.maxUnit").click(function() {
    var d = $(this).parent().find("input.materialcount");
    $(d).val(parseInt($(this).parent().find("span#unitCount").html()));
    mExchangeView.updateExchangeViewValues($(this), a)
  });
  $("div.maxResourceAmount").click(function() {
    var d = parseInt($(this).parent().find("span#unitCount").html());
    $(this).parent().find("input.materialcount").val(d);
    mExchangeView.setMaxResourceAmount($(this));
    mExchangeView.updateExchangeViewValues($(this), a, b)
  });
  $("div.changeAction").click(function() {
    if (mExchangeView.getCurrentChange(b) <= 0) {
      showPapyrusMsgBox(mStringtable.getValueOf("Not enough resources available."))
    } else {
      a.exchangeResource(mPlayer.currentHabitat, mExchangeView.unitValues, mExchangeView.resValues, $(this).metadata().resourceID);
      $("div.exchangeview").find("input.material_resource").val("");
      $("div.exchangeview").find("input.material_unit").val("");
      $("div.exchangeview").find("span.capacity").html("0 / 0");
      $("div.exchangeview").find("span.raterightResource").html("0");
      $("div.exchangeview").find("span.rateright").html("00:00:00");
      $("div.exchangeview").find("span.rateright2").html("00:00:00")
    }
  });
  $("div.closeViewMission").click(function(d) {
    navigateBack()
  });
  $("#globalExchange").click(function(d) {
    openGlobalExchange(c)
  })
};
ExchangeView.prototype.setMaxResourceAmount = function(g) {
  var b = $(g).parent().find("input.materialcount");
  var j = parseInt($(b).val());
  if (isNaN(j)) {
    j = 0
  }
  var f;
  var c = $(b).metadata().resource_id;
  if (mExchangeView.resValues[c]) {
    f = mExchangeView.resValues[c]
  } else {
    f = 0
  }
  if (f == 0 || f != j) {
    var e = parseInt($(g).parent().find("span#unitCount").html());
    var a = mExchangeView.getMaxTransportAmount();
    var h = mExchangeView.getCurrentTransportAmount();
    var d = a - (h - f);
    if (d < 0) {
      d = 0
    }
    if (j > e) {
      j = e;
      changed = true
    }
    if (j > d) {
      j = d;
      changed = true
    }
    $(b).val(j)
  }
};
ExchangeView.prototype.getMaxTransportAmount = function() {
  var a = 0;
  $.each(mExchangeView.unitValues, function(b, c) {
    if (c > 0) {
      a += c * mExchangeView.selectedUnits[b].storeAmount
    }
  });
  if (a > 0) {
    $("span.capacity").toggleClass("capacityok", true);
    $("span.capacity").toggleClass("capacitynok", false)
  } else {
    $("span.capacity").toggleClass("capacitynok", true);
    $("span.capacity").toggleClass("capacityok", false)
  }
  return a
};
ExchangeView.prototype.getCurrentTransportAmount = function() {
  var a = 0;
  $.each(mExchangeView.resValues, function(b, c) {
    a += c
  });
  return a
};
ExchangeView.prototype.getCurrentChange = function(b) {
  var a = 0;
  $.each(b.rates, function(c, d) {
    if (mExchangeView.resValues[c]) {
      if (mExchangeView.resValues[c] < d) {
        mExchangeView.resValues[c] = 0
      } else {
        if (mExchangeView.resValues[c] >= d) {
          var e = mExchangeView.resValues[c] - (mExchangeView.resValues[c] % d);
          mExchangeView.resValues[c] = e;
          a += (e / d)
        }
      }
    }
  });
  return a
};
ExchangeView.prototype.updateExchangeViewValues = function(e, d, h) {
  var c = $(e).parent().find("input.materialcount");
  var g = $(e).parent().find("span#unitCount").metadata().from;
  var f = parseInt($(c).val());
  if (isNaN(f)) {
    f = 0
  }
  var k = parseInt($(e).parent().find("span#unitCount").html());
  if (f > k) {
    f = k;
    $(e).val(f)
  }
  if (g == "unit") {
    if (f > 0) {
      mExchangeView.selectedUnits[$(c).metadata().unit_id] = mUnits[$(c).metadata().unit_id];
      mExchangeView.unitValues[$(c).metadata().unit_id] = f
    } else {
      delete mExchangeView.selectedUnits[$(c).metadata().unit_id];
      delete mExchangeView.unitValues[$(c).metadata().unit_id]
    }
    if (mExchangeView.getCurrentTransportAmount() > mExchangeView.getMaxTransportAmount()) {
      $("input.material_resource").val(0);
      mExchangeView.resValues = {};
      mExchangeView.selectedResources = {}
    }
    var b = mPlayer.currentHabitat.getSlowestHabitatUnit(mExchangeView.selectedUnits) * d.marketDistance;
    $("div.units").find("span.rateright").html(secToTimeStr(Math.round(b)));
    var j = new Date().getTime();
    if (b > 0) {
      $("div.units").find("span.rateright2").html(formatDateTime(new Date((b * 1000) + j)))
    } else {
      $("div.units").find("span.rateright2").html("00:00:00")
    }
  } else {
    if (f > 0) {
      mExchangeView.selectedResources[$(c).metadata().resource_id] = mResources[$(c).metadata().resource_id];
      mExchangeView.resValues[$(c).metadata().resource_id] = f
    } else {
      delete mExchangeView.selectedResources[$(c).metadata().resource_id];
      delete mExchangeView.resValues[$(c).metadata().resource_id]
    }
    $("span.raterightResource").html(mExchangeView.getCurrentChange(h));
    var a = mExchangeView.resValues[$(c).metadata().resource_id];
    if (a == undefined) {
      a = 0
    }
    $(c).val(a)
  }
  $("span.capacity").html(mExchangeView.getCurrentTransportAmount() + " / " + mExchangeView.getMaxTransportAmount())
};
function ForumThread(a) {
  this.id = getValueFromJSON(a.id);
  this.closed = getValueFromJSON(a.closed);
  if (this.closed == "false") {
    this.closed = false
  }
  if (this.closed == "true") {
    this.closed = true
  }
  this.lastMessageDate = jsonDateToDate(getValueFromJSON(a.lastMessageDate));
  this.topic = getValueFromJSON(a.topic);
  this.owner = new Player(a.owner);
  this.read = true
}
function ForumThreadEntry(a) {
  this.id = getValueFromJSON(a.id);
  this.creationDate = jsonDateToDate(getValueFromJSON(a.creationDate));
  this.content = getValueFromJSON(a.content);
  this.author = new Player(a.author)
}
$(".checkboxTable").live("click", function() {
  var a = $(this).prev();
  a.click()
});
function GoldView() {
  this.countries = new Array()
}
GoldView.prototype.addToBody = function() {
  $.tmpl("buyGoldTmpl", mGoldView).appendTo($("div.viewport").empty());
  setPapyrusBackgroundForFullScreenView();
  windowSize();
  $(".closeViewMission").click(function() {
    mBottomBar.callLastView()
  });
  blockUI("loading countries");
  var a = {};
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("PaymentAction/paymentCountryArray", a, "mGoldView.openCountry")
};
GoldView.prototype.openCountry = function(b) {
  unblockUI();
  mGoldView.countries = new Array();
  if (b.countryArray) {
    $.each(b.countryArray, function(g, h) {
      mGoldView.countries.push(new Country(h))
    })
  }
  var f = navigator.language;
  var e = navigator.browserLanguage;
  var d;
  var a;
  var c = null;
  if (typeof f == "undefined") {
    a = e
  } else {
    a = f
  }
  if (a != "") {
    if (a.length == 2) {
      d = a.substr(0, 2).toUpperCase()
    } else {
      if (a.length == 5) {
        d = a.substr(3, 2).toUpperCase()
      } else {
        d = a.substr(3, 3).toUpperCase()
      }
    }
  } else {
    d = "DE"
  }
  for (i = 0; i < mGoldView.countries.length; i++) {
    if (mGoldView.countries[i].isoCode == d) {
      c = mGoldView.countries[i];
      mGoldView.countries.splice(i, 1)
    }
  }
  mGoldView.countries.sort(function(h, g) {
    if (h.name < g.name) {
      return -1
    } else {
      return +1
    }
  });
  if (c != null) {
    mGoldView.countries.unshift(c)
  }
  $.tmpl("buyGoldTmpl", mGoldView).appendTo($("div.viewport").empty());
  setPapyrusBackgroundForFullScreenView();
  windowSize();
  $(".closeViewMission").click(function() {
    mBottomBar.callLastView()
  });
  $("input[name=countryName]:radio").unbind("click");
  $("input[name=countryName]:radio").click(function() {
    blockUI("loading packets");
    var g = {};
    g["country.isoCode"] = $(this).val();
    g.PropertyListVersion = propertyListVersion;
    g[mPlayer.userIdentifier] = mPlayer.getHash();
    genericAjaxRequest("PaymentAction/productArrayForCountry", g, "mGoldView.openProduct")
  });
  $('input[name="countryName"]:first').click()
};
GoldView.prototype.openProduct = function(b) {
  unblockUI();
  mGoldView.packetArray = new Array();
  if (b.storeProductArray) {
    $.each(b.storeProductArray, function(c, d) {
      mGoldView.packetArray.push(new GoldViewPacketSelection(d))
    })
  }
  $.tmpl("buyGoldPacketSelectionTmpl", mGoldView).appendTo($(".packageSelection").empty());
  $(".paymentSelection").empty();
  windowSize();
  $("input[name=packetName]:radio").unbind("click");
  var a = this;
  $("input[name=packetName]:radio").click(function() {
    if ($(this).val() == "gutschein") {
      a.openGutschein()
    } else {
      blockUI("loading paymentsystem");
      var c = {};
      c["storeProduct.identifier"] = $(this).val();
      c["country.isoCode"] = $('input[name="country.isoCode"]').val();
      c.PropertyListVersion = propertyListVersion;
      c[mPlayer.userIdentifier] = mPlayer.getHash();
      genericAjaxRequest("PaymentAction/paymentProviderArrayForProduct", c, "mGoldView.openPayment")
    }
  });
  $("div.goldView").scrollTop(0);
  $('input[name="packetName"]:first').click()
};
GoldView.prototype.openGutschein = function(a) {
  unblockUI();
  $.tmpl("buyGoldGutscheinSelectionTmpl", mGoldView).appendTo($(".paymentSelection").empty());
  setHover("div.loadButton");
  if ((mGoldView.paymentArray.length) == 1) {
    $(".paymentListFirstRow").css("width", "44%")
  }
  $("input[name='paymentName']").click(function(b, c) {
    if ($(this).val().toLowerCase() == "sponsorpay") {
      $(".aufladenButton div div div").html(mStringtable.getValueOf("Shop"))
    } else {
      $(".aufladenButton div div div").html(mStringtable.getValueOf("Paynow"))
    }
  });
  windowSize();
  $(".loadButton").click(function() {
    var e = $("input[name='code']").val();
    var d = {};
    if (e.length == 9 && e[4] == "-") {
      var c = $('input[name="country.isoCode"]').val();
      var b = $('input[name="storeProduct.identifier"]').val();
      var f = $("input[name=paymentName]:radio:checked").prev().val();
      d.code = e;
      d.PropertyListVersion = propertyListVersion;
      d[mPlayer.userIdentifier] = mPlayer.getHash();
      genericAjaxRequest("StoreAction/redeemPromotionCode", d, "mGoldView.payProduct")
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf("Promotion code is invalid."), mStringtable.getValueOf("Promotion-Code"))
    }
  });
  $('input[name="paymentName"]:first').click();
  windowSize();
  unblockUI()
};
GoldView.prototype.openPayment = function(a) {
  unblockUI();
  mGoldView.paymentArray = new Array();
  mGoldView.outputArray = new Array();
  if (a.paymentProviderArray) {
    $.each(a.paymentProviderArray, function(b, c) {
      mGoldView.paymentArray.push(new GoldViewPaymentSelection(c, a["country.isoCode"], a["storeProduct.identifier"]))
    })
  }
  for (i = 0; i < mGoldView.paymentArray.length; i += 2) {
    tmpArray = new Array();
    tmpArray[0] = mGoldView.paymentArray[i];
    tmpArray[1] = mGoldView.paymentArray[i + 1];
    mGoldView.outputArray.push(tmpArray)
  }
  $.tmpl("buyGoldPaymentSelectionTmpl", mGoldView).appendTo($(".paymentSelection").empty());
  setHover("div.loadButton");
  if ((mGoldView.paymentArray.length) == 1) {
    $(".paymentListFirstRow").css("width", "44%")
  }
  $("input[name='paymentName']").click(function(b, c) {
    if ($(this).val().toLowerCase() == "sponsorpay") {
      $(".aufladenButton div div div").html(mStringtable.getValueOf("Shop"))
    } else {
      $(".aufladenButton div div div").html(mStringtable.getValueOf("Paynow"))
    }
  });
  windowSize();
  $(".loadButton").click(function() {
    checked = $("input[name=paymentName]:radio:checked").length;
    checkValue = $("input[name=paymentName]:radio:checked").val();
    if (checked > 0) {
      var c = $('input[name="country.isoCode"]').val();
      var b = $('input[name="storeProduct.identifier"]').val();
      var e = $("input[name=paymentName]:radio:checked").prev().val();
      var d = {};
      d["country.isoCode"] = c;
      d["paymentProvider.identifier"] = e;
      d["storeProduct.identifier"] = b;
      d.PropertyListVersion = propertyListVersion;
      d[mPlayer.userIdentifier] = mPlayer.getHash();
      genericAjaxRequest("PaymentAction/payProduct", d, "mGoldView.payProduct")
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf("Bitte w\u00E4hlen Sie zuerst ein Zahlungssystem aus."), mStringtable.getValueOf("Gold aufladen"), null, null, false)
    }
  });
  $('input[name="paymentName"]:first').click();
  windowSize();
  unblockUI()
};
GoldView.prototype.payProduct = function(a) {
  unblockUI();
  if (a.error) {
    showPapyrusMsgBox(mStringtable.getValueOf(a.error), false)
  } else {
    if (a.paymentSession) {
      mGoldView.paymentProcessInformation = new GoldViewPaymentProcessInformation(a);
      if (mGoldView.paymentProcessInformation.paymentProvider === "paysafecard" || mGoldView.paymentProcessInformation.paymentProvider === "bill4net" || mGoldView.paymentProcessInformation.paymentProvider === "sponsorpay") {
        $.tmpl("buyGoldPaymentOverlayTmpl", mGoldView).appendTo($(".paymentProcessArea").empty());
        if (mGoldView.paymentProcessInformation.paymentProvider == "bill4net") {
          $("#paymentOverlay").css("width", "650px");
          $("#paymentOverlay").css("height", "550px");
          $("#paymentIframe").css("width", "600px");
          $("#paymentIframe").css("height", "400px");
          $("#paymentIframe").css("margin-left", "25px");
          $("#paymentIframe").css("margin-top", "35px")
        }
        $("#paymentOverlayClose").click(function(b) {
          $("#paymentOverlay").trigger("close");
          b.preventDefault()
        });
        $("#paymentOverlay").lightbox_me({centered: true, closeClick: false, destroyOnClose: true, onClose: function() {
            mSession.addJob(SESSIONJOBTYPE.SESSION);
            mSession.updateSession()
          }, onLoad: function() {
            $("#paymentIframe").prop("src", mGoldView.paymentProcessInformation.processUrl)
          }, overlayCSS: {background: "black", opacity: 0.85}})
      } else {
        if (mGoldView.paymentProcessInformation.paymentProvider === "sofortueberweisung") {
          window.location = mGoldView.paymentProcessInformation.processUrl
        }
      }
    } else {
      if (a.promotionCode || a.PromotionCode) {
        showPapyrusMsgBox($.sprintf(mStringtable.getValueOf("You received %d %@"), a.PromotionCode.goldAmount, mStringtable.getValueOf("Gold")), false);
        mSession.addJob(SESSIONJOBTYPE.SESSION);
        mSession.updateSession()
      } else {
        showPapyrusMsgBox(mStringtable.getValueOf("Could not parse server output"), false)
      }
    }
  }
};
function GoldViewPacketSelection(a, h, c, b, g, f, e, d) {
  this.goldAmount = a;
  this.id = h;
  this.identifier = c;
  this.name = b;
  this.price = g;
  this.sort = f;
  this.storeTierID = e;
  this.countryIsoCode = d
}
function GoldViewPacketSelection(a) {
  this.goldAmount = getValueFromJSON(a.goldAmount);
  this.id = getValueFromJSON(a.id);
  this.name = getValueFromJSON(a.name);
  this.price = getValueFromJSON(a.price);
  this.sort = getValueFromJSON(a.sort);
  this.storeTierID = getValueFromJSON(a.storeTierID);
  this.identifier = getValueFromJSON(a.identifier);
  this.countryIsoCode = getValueFromJSON(a["country.isoCode"])
}
function GoldViewPaymentProcessInformation(a) {
  this.processUrl = a
}
function GoldViewPaymentProcessInformation(a) {
  if (typeof a.paymentSession.redirectUrl == "undefined") {
    this.processUrl = getValueFromJSON(a.paymentSession.additionalInformationDictionary.redirectUrl)
  } else {
    this.processUrl = getValueFromJSON(a.paymentSession.redirectUrl)
  }
  this.paymentProvider = getValueFromJSON(a.paymentSession.paymentProviderIdentifier)
}
function GoldViewPaymentSelection(c, e, a, d, b) {
  this.name = c;
  this.id = e;
  this.scoreValue = a;
  this.countryIsoCode = d;
  this.storeProductIdentifier = b
}
function GoldViewPaymentSelection(c, b, a) {
  this.name = getValueFromJSON(c.name);
  this.id = getValueFromJSON(c.identifier);
  this.scoreValue = getValueFromJSON(c.scoreValue);
  this.countryIsoCode = b;
  this.storeProductIdentifier = a
}
function Habitat(r, z, n, t, b, a, j, c, k, u, d, h, w, m, v, g, f, o, e, l) {
  this.id = r;
  this.name = z;
  this.habitatType = n;
  this.points = t;
  this.mapX = b;
  this.mapY = a;
  this.nextNPCUpgradeDate = j;
  this.nextBattleDate = c;
  this.lastTick = k;
  this.habitatResources = u;
  this.habitatMissions = d;
  this.habitatKnowledges = h;
  this.habitatKnowledgeOrders = w;
  this.habitatUnits = m;
  this.habitatUnitOrders = v;
  this.externalHabitatUnits = g;
  this.habitatBuildings = f;
  this.habitatBuildingOrders = o;
  this.habitatBuildingUpgrades = e;
  this.habitatTransits = l;
  this.player = null;
  this.externalHabitatUnitsResources = null
}
function Habitat(a) {
  this.id = getValueFromJSON(a.id);
  var h = this.id;
  if (a.name) {
    this.name = getValueFromJSON(a.name)
  } else {
    this.name = mStringtable.getValueOf("Renegade") + " " + h
  }
  this.habitatType = getValueFromJSON(a.habitatType);
  this.points = getValueFromJSON(a.points);
  this.mapX = getValueFromJSON(a.mapX);
  this.mapY = getValueFromJSON(a.mapY);
  this.nextNPCUpgradeDate = getValueFromJSON(a.nextNPCUpgradeDate);
  this.nextBattleDate = jsonDateToDate(getValueFromJSON(a.nextBattleDate));
  var m;
  var g;
  this.externalHabitatUnitsResources = null;
  this.lastTick = getValueFromJSON(a.lastTick);
  this.habitatResources = null;
  if (a.habitatResourceDictionary) {
    var l = {};
    $.each(a.habitatResourceDictionary, function(o, r) {
      l[r.resourceId] = new HabitatResource(r)
    });
    this.habitatResources = l
  }
  this.habitatMissions = null;
  if (a.habitatMissionArray) {
    var f = new Array();
    $.each(a.habitatMissionArray, function(o, r) {
      f.push(new HabitatMission(r))
    });
    f.sort(function(r, o) {
      if (r.mission.order < o.mission.order) {
        return -1
      } else {
        return +1
      }
    });
    this.habitatMissions = f
  }
  this.habitatKnowledges = makePointerArray(a.habitatKnowledgeArray, mKnowledges, false);
  this.habitatKnowledgeOrders = null;
  if (a.habitatKnowledgeOrderArray) {
    var c = new Array();
    $.each(a.habitatKnowledgeOrderArray, function(o, r) {
      c.push(new KnowledgeOrder(h, r))
    });
    c.sort(function(r, o) {
      if (r.knowledge.order < o.knowledge.order) {
        return -1
      } else {
        return +1
      }
    });
    this.habitatKnowledgeOrders = c
  }
  this.habitatUnits = null;
  if (a.habitatUnitArray) {
    var n = new Array();
    $.each(a.habitatUnitArray, function(o, r) {
      n.push(new HabitatUnit(r))
    });
    this.habitatUnits = n
  }
  this.habitatUnitOrders = null;
  if (a.habitatUnitArray) {
    var b = new Array();
    $.each(a.habitatUnitOrderArray, function(o, r) {
      b.push(new UnitOrder(h, r))
    });
    b.sort(function(r, o) {
      if (r.id < o.id) {
        return -1
      } else {
        return +1
      }
    });
    this.habitatUnitOrders = b
  }
  this.externalHabitatUnits = null;
  if (a.externalHabitatUnitArray) {
    var j = new Array();
    $.each(a.externalHabitatUnitArray, function(o, r) {
      j.push(new HabitatUnit(r))
    });
    this.externalHabitatUnits = j
  }
  this.habitatBuildings = makeOrderdPointerArray(a.habitatBuildingDictionary, mBuildings);
  this.habitatBuildingOrders = null;
  this.habitatBuildingUpgrades = null;
  if (a.habitatBuildingUpgradeArray) {
    var e = new Array();
    $.each(a.habitatBuildingUpgradeArray, function(o, r) {
      e.push(new BuildingUpgrade(h, r))
    });
    e.sort(function(r, o) {
      if (r.complete < o.complete) {
        return -1
      } else {
        return +1
      }
    });
    this.habitatBuildingUpgrades = e
  }
  this.habitatTransits = null;
  if (a.habitatTransitArray) {
    var k = new Array();
    $.each(a.habitatTransitArray, function(o, r) {
      k.push(new Transit(h, r))
    });
    k.sort(function(r, o) {
      if (r.destinationETA.getTime() < o.destinationETA.getTime()) {
        return -1
      } else {
        return +1
      }
    });
    this.habitatTransits = k
  }
  this.player = null;
  if (a.player) {
    this.player = new Player(a.player)
  }
  if (this.externalHabitatUnits) {
    $.each(this.externalHabitatUnits, function(o, r) {
      if (r.battleType == 2) {
        var t = r.habitat.nextBattleDate - (new Date() - mTimeDifferenceToServer);
        window.setTimeout("Habitat.addAttackSessionJob()", t)
      }
    })
  }
  if (this.habitatUnits) {
    $.each(this.habitatUnits, function(o, r) {
      if (r.battleType == 2) {
        var t = r.habitat.nextBattleDate - (new Date() - mTimeDifferenceToServer);
        window.setTimeout("Habitat.addAttackSessionJob()", t)
      }
    })
  }
  var d = new Array();
  if (this.habitatKnowledges) {
    $.each(this.habitatKnowledges, function(o, r) {
      if (r.modifier) {
        $.each(r.modifier, function(u, t) {
          d.push(t)
        })
      }
    })
  }
  if (this.habitatBuildings) {
    $.each(this.habitatBuildings, function(r, o) {
      if (o.modifier) {
        $.each(o.modifier, function(u, t) {
          d.push(t)
        })
      }
    })
  }
  this.habitatModifier = d;
  this.habitatModifier.sort(function(r, o) {
    if (r.primaryKey < o.primaryKey) {
      return -1
    } else {
      return +1
    }
  })
}
Habitat.prototype.updateData = function(a) {
  this.id = getValueFromJSON(a.id);
  var h = this.id;
  if (a.name) {
    this.name = getValueFromJSON(a.name)
  } else {
    this.name = mStringtable.getValueOf("Renegade")
  }
  this.habitatType = getValueFromJSON(a.habitatType);
  this.points = getValueFromJSON(a.points);
  this.nextNPCUpgradeDate = getValueFromJSON(a.nextNPCUpgradeDate);
  this.nextBattleDate = jsonDateToDate(getValueFromJSON(a.nextBattleDate));
  this.lastTick = getValueFromJSON(a.lastTick);
  var f = this;
  $.each(a.habitatResourceDictionary, function(m, n) {
    f.habitatResources[n.resourceId].updateData(n)
  });
  this.habitatMissions = null;
  if (a.habitatMissionArray) {
    var g = new Array();
    $.each(a.habitatMissionArray, function(m, n) {
      g.push(new HabitatMission(n))
    });
    this.habitatMissions = g
  }
  this.habitatKnowledges = makePointerArray(a.habitatKnowledgeArray, mKnowledges, false);
  this.habitatKnowledgeOrders = null;
  if (a.habitatKnowledgeOrderArray) {
    var c = new Array();
    $.each(a.habitatKnowledgeOrderArray, function(m, n) {
      c.push(new KnowledgeOrder(h, n))
    });
    this.habitatKnowledgeOrders = c
  }
  this.habitatUnits = null;
  if (a.habitatUnitArray) {
    var l = new Array();
    $.each(a.habitatUnitArray, function(m, n) {
      l.push(new HabitatUnit(n))
    });
    this.habitatUnits = l
  }
  this.habitatUnitOrders = null;
  if (a.habitatUnitArray) {
    var b = new Array();
    $.each(a.habitatUnitOrderArray, function(m, n) {
      b.push(new UnitOrder(h, n))
    });
    b.sort(function(n, m) {
      if (n.id < m.id) {
        return -1
      } else {
        return +1
      }
    });
    this.habitatUnitOrders = b
  }
  this.externalHabitatUnits = null;
  if (a.externalHabitatUnitArray) {
    var j = new Array();
    $.each(a.externalHabitatUnitArray, function(m, n) {
      j.push(new HabitatUnit(n))
    });
    this.externalHabitatUnits = j
  }
  this.habitatBuildings = makeOrderdPointerArray(a.habitatBuildingDictionary, mBuildings);
  this.habitatBuildingOrders = null;
  this.habitatBuildingUpgrades = null;
  if (a.habitatBuildingUpgradeArray) {
    var e = new Array();
    $.each(a.habitatBuildingUpgradeArray, function(m, n) {
      e.push(new BuildingUpgrade(h, n))
    });
    e.sort(function(n, m) {
      if (n.id < m.id) {
        return -1
      } else {
        return +1
      }
    });
    this.habitatBuildingUpgrades = e
  }
  this.habitatTransits = null;
  if (a.habitatTransitArray) {
    var k = new Array();
    $.each(a.habitatTransitArray, function(m, n) {
      k.push(new Transit(h, n))
    });
    this.habitatTransits = k
  }
  if (a.player) {
    this.player = new Player(a.player)
  }
  if (this.externalHabitatUnits) {
    $.each(this.externalHabitatUnits, function(m, n) {
      if (n.battleType == 2) {
        var o = n.habitat.nextBattleDate - (new Date() - mTimeDifferenceToServer);
        window.setTimeout("Habitat.addAttackSessionJob()", o)
      }
    })
  }
  if (this.habitatUnits) {
    $.each(this.habitatUnits, function(m, n) {
      if (n.battleType == 2) {
        var o = n.habitat.nextBattleDate - (new Date() - mTimeDifferenceToServer);
        window.setTimeout("Habitat.addAttackSessionJob()", o)
      }
    })
  }
  var d = new Array();
  if (this.habitatKnowledges) {
    $.each(this.habitatKnowledges, function(m, n) {
      if (n.modifier) {
        $.each(n.modifier, function(r, o) {
          d.push(o)
        })
      }
    })
  }
  if (this.habitatBuildings) {
    $.each(this.habitatBuildings, function(n, m) {
      if (m.modifier) {
        $.each(m.modifier, function(r, o) {
          d.push(o)
        })
      }
    })
  }
  this.habitatModifier = d;
  this.habitatModifier.sort(function(n, m) {
    if (n.primaryKey < m.primaryKey) {
      return -1
    } else {
      return +1
    }
  })
};
Habitat.prototype.deleteBuildingUpgradeFormList = function(a) {
  var b = this.habitatBuildingUpgrades;
  $.each(b, function(c, d) {
    if (d.id == a) {
      b.splice(c, 1);
      return(false)
    }
  });
  this.habitatBuildingUpgrades = b;
  if (!mCurrentActionBlocked) {
    mBottomBar.callLastView()
  }
};
Habitat.prototype.deleteUnitOrderFormList = function(a) {
  var b = this.habitatUnitOrders;
  $.each(b, function(d, c) {
    if (c.id == a) {
      b.splice(d, 1);
      return(false)
    }
  });
  this.habitatUnitOrders = b;
  if (!mCurrentActionBlocked) {
    mBottomBar.callLastView()
  }
};
Habitat.prototype.deleteTransitFormList = function(b) {
  var a = this.habitatTransits;
  $.each(a, function(d, c) {
    if (c.generatedTransitId == b) {
      a.splice(d, 1);
      return(false)
    }
  });
  this.habitatTransits = a;
  if (!mCurrentActionBlocked) {
    mBottomBar.callLastView()
  }
};
Habitat.prototype.deleteMissionFormList = function(b) {
  var a = this.habitatMissions;
  $.each(a, function(c, d) {
    if (d.mission.primaryKey == b) {
      a.splice(c, 1);
      return(false)
    }
  });
  this.habitatMissions = a;
  if (!mCurrentActionBlocked) {
    mBottomBar.callLastView()
  }
};
Habitat.prototype.deleteKnowledgeOrderFormList = function(b) {
  var a = this.habitatKnowledgeOrders;
  $.each(a, function(d, c) {
    if (c.knowledge.primaryKey == b) {
      a.splice(d, 1);
      return(false)
    }
  });
  this.habitatKnowledgeOrders = a;
  if (!mCurrentActionBlocked) {
    mBottomBar.callLastView()
  }
};
Habitat.prototype.updateHabitatResources = function() {
  $.each(this.habitatResources, function(a, b) {
    b.updateResource()
  })
};
Habitat.prototype.updateAllTimesToComplete = function() {
  var a = this;
  $.each(this.habitatBuildingUpgrades, function(b, c) {
    if (c) {
      c.updateTimeToComplete()
    }
  });
  $.each(this.habitatUnitOrders, function(c, b) {
    if (b) {
      b.updateTimeToComplete()
    }
  });
  $.each(this.habitatTransits, function(c, b) {
    if (b) {
      b.updateTimeToComplete()
    }
  });
  $.each(this.habitatMissions, function(b, c) {
    if (c) {
      c.updateTimeToComplete(a.id)
    }
  });
  $.each(this.habitatKnowledgeOrders, function(b, c) {
    if (c) {
      c.updateTimeToComplete()
    }
  })
};
Habitat.prototype.getGroupedHabitatTransits = function() {
  var a = new Array();
  $.each(this.habitatTransits, function(c, b) {
    a.push(b)
  });
  a.sort(function(d, c) {
    if (d.destinationHabitat.id < c.destinationHabitat.id) {
      return -1
    } else {
      return +1
    }
  });
  return a
};
Habitat.prototype.getUnitOrder = function(b) {
  var a = null;
  $.each(this.habitatUnitOrders, function(d, c) {
    if (c.id == b) {
      a = c;
      return(false)
    }
  });
  return a
};
Habitat.prototype.getHabitatBuildingUpgrade = function(b) {
  var a = null;
  $.each(this.habitatBuildingUpgrades, function(c, d) {
    if (d.id == b) {
      a = d;
      return(false)
    }
  });
  return a
};
Habitat.prototype.removeHabitatBuildingUpgrade = function(b) {
  var a = new Array();
  $.each(this.habitatBuildingUpgrades, function(c, d) {
    if (d.id != b.id) {
      a.push(d)
    }
  });
  a.sort(function(d, c) {
    if (d.id < c.id) {
      return -1
    } else {
      return +1
    }
  });
  this.habitatBuildingUpgrades = a
};
Habitat.prototype.addHabitatBuildingUpgrade = function(a) {
  if (this.habitatBuildingUpgrades == null) {
    this.habitatBuildingUpgrades = new Array()
  }
  this.habitatBuildingUpgrades.push(a)
};
Habitat.prototype.findBuilding = function(b) {
  var c = this;
  var a;
  $.each(c.habitatBuildings, function(e, d) {
    if (d.getIdentifierWithoutLevel() == b) {
      a = d.primaryKey
    }
  });
  return a
};
Habitat.prototype.isKnowledgeResearched = function(c) {
  var a;
  var b = false;
  if (this instanceof Habitat) {
    a = this.habitatKnowledges
  } else {
    a = this.data.habitatKnowledges
  }
  $.each(a, function(d, e) {
    if (e != null && e.primaryKey == c.primaryKey) {
      b = true
    }
  });
  return b
};
Habitat.prototype.getSortedBuildings = function() {
  var b = this;
  var a = new Array();
  $.each(b.habitatBuildings, function(c, d) {
    a.push(d)
  });
  if (a.length > 1) {
    a.sort(function(d, c) {
      if (d.order < c.order) {
        return -1
      } else {
        return +1
      }
    })
  }
  return a
};
Habitat.prototype.getBuildingsWithHistory = function() {
  var a = this;
  var b = new Array();
  $.each(a.getSortedBuildings(), function(c, e) {
    var d = new Array();
    $.each(a.habitatBuildingUpgrades, function(f, g) {
      if (e.order == g.buildingTarget.order) {
        d.push(g)
      }
    });
    if (d.length == 0) {
      d.push(e)
    }
    b.push(d)
  });
  return b
};
Habitat.prototype.getTavern = function() {
  var b = this;
  var a = null;
  $.each(b.habitatBuildings, function(c, d) {
    if (d.knowledges) {
      a = d
    }
  });
  return a
};
Habitat.prototype.getBuildingByOrder = function(c) {
  var d = this;
  var a = null;
  $.each(d.habitatBuildings, function(b, e) {
    if (e.order == c) {
      a = e.primaryKey
    }
  });
  return a
};
Habitat.prototype.getCurrentUpgradeBuildings = function() {
  var b = this;
  var a = new Array();
  $.each(b.habitatBuildings, function(c, e) {
    var d = new Array();
    $.each(b.habitatBuildingUpgrades, function(f, g) {
      if (e.order == g.buildingTarget.order) {
        d.push(g)
      }
    });
    if (d.length == 0) {
      a.push(e)
    } else {
      a.push(mBuildings[d[d.length - 1].buildingTarget.primaryKey])
    }
  });
  a.sort(function(d, c) {
    if (d.order < c.order) {
      return -1
    } else {
      return +1
    }
  });
  return a
};
Habitat.prototype.getCurrentUpgradesOfBuilding = function(a) {
  var c = this;
  var b = new Array();
  $.each(c.habitatBuildingUpgrades, function(d, e) {
    if (a == e.buildingTarget.order) {
      b.push(e)
    }
  });
  return b
};
Habitat.prototype.getCurrentBuildingLevel = function(a) {
  var b = this;
  var c;
  $.each(b.habitatBuildings, function(e, d) {
    if (a == d.order) {
      c = d.level
    }
  });
  return c
};
Habitat.prototype.isUpgradingBuilding = function(a) {
  var c = this;
  var b = false;
  $.each(c.habitatBuildingUpgrades, function(d, e) {
    if (e.buildingTarget.primaryKey == a) {
      b = true
    }
  });
  return b
};
Habitat.prototype.getBuildingUpgrade = function(a) {
  var c = this;
  var b = null;
  $.each(c.habitatBuildingUpgrades, function(d, e) {
    if (e.buildingTarget.primaryKey == a) {
      b = e
    }
  });
  return b
};
Habitat.prototype.getHabitatTransitById = function(a) {
  var b = null;
  $.each(this.habitatTransits, function(d, c) {
    if (c.generatedTransitId == a) {
      b = c
    }
  });
  return b
};
Habitat.prototype.getSlowestHabitatUnit = function(a) {
  var b = 0;
  $.each(a, function(c, e) {
    if (e != null) {
      var d = e.getSecoundsPerField();
      if (d > b) {
        b = d
      }
    }
  });
  return b
};
Habitat.prototype.getHabitatUnitAmount = function(b) {
  var a = 0;
  $.each(this.habitatUnits, function(c, d) {
    if (d.battleType != null && d.battleType == BATTLETYPE.OWN_HABITAT) {
      $.each(d.units, function(e, f) {
        if (f.primaryKey == b) {
          a = f.count
        }
      })
    }
  });
  return a
};
Habitat.prototype.getHabitatUnits = function() {
  var a = new Array();
  $.each(this.habitatUnits, function(b, c) {
    if (c.battleType != null && c.battleType == BATTLETYPE.OWN_HABITAT) {
      a = c.units
    }
  });
  if (a.length == 0) {
    $.each(mUnits, function(b, d) {
      var c = d.clone();
      c.setCount(0);
      a.push(c)
    });
    a.sort(function(d, c) {
      if (d.order < c.order) {
        return -1
      } else {
        return +1
      }
    })
  }
  return a
};
Habitat.prototype.getForeignHabitatUnits = function() {
  var a = new Array();
  $.each(this.habitatUnits, function(b, c) {
    if (c.battleType != null && c.battleType == BATTLETYPE.ATTACKER) {
      a = c.units
    }
  });
  return a
};
Habitat.prototype.getAllHabitatUnits = function() {
  var b = [];
  var a = [];
  var c = this;
  $.each(c.habitatUnits, function(d, e) {
    if (e.battleType != null && e.battleType == BATTLETYPE.OWN_HABITAT) {
      b = e.units
    }
    if (e.battleType != null && e.battleType == BATTLETYPE.EXTERNAL_UNITS_TO_DEFENSE) {
      $.each(e.units, function(f, g) {
        if (g.count > 0) {
          a.push({key: g.primaryKey, count: g.count})
        }
      })
    }
  });
  $.each(b, function(d, e) {
    e.count_all = e.count
  });
  $.each(b, function(d, e) {
    $.each(a, function(g, f) {
      if (f.key == e.primaryKey) {
        e.count_all = e.count_all + f.count
      }
    })
  });
  if (b.length == 0) {
    $.each(mUnits, function(e, d) {
      b.push({key: d.primaryKey, count_all: 0, count: 0})
    })
  }
  return b
};
Habitat.prototype.getHabitatDefenseUnits = function() {
  var a = new Array();
  $.each(this.habitatUnits, function(b, c) {
    if (c.battleType != null && c.battleType == BATTLETYPE.EXTERNAL_UNITS_TO_DEFENSE) {
      a.push(c)
    }
  });
  if (a.length > 0) {
    a.sort(function(d, c) {
      if (d.order < c.order) {
        return -1
      } else {
        return +1
      }
    })
  }
  return a
};
Habitat.prototype.getHabitatAttackingUnits = function() {
  var a = new Array();
  $.each(this.habitatUnits, function(b, c) {
    if (c.battleType != null && c.battleType == BATTLETYPE.ATTACKER) {
      a.push(c)
    }
  });
  if (a.length > 0) {
    a.sort(function(d, c) {
      if (d.order < c.order) {
        return -1
      } else {
        return +1
      }
    })
  }
  return a
};
Habitat.prototype.getBundledHabitatUnits = function() {
  var b = null;
  var a = null;
  $.each(this.habitatUnits, function(c, d) {
    if (d.battleType != null && d.battleType <= 1) {
      $.each(d.units, function(e, f) {
        if (f.count > 0) {
          if (b == null) {
            b = {}
          }
          if (b[f.primaryKey] && b[f.primaryKey] > 0) {
            b[f.primaryKey] += f.count
          } else {
            b[f.primaryKey] = f.count
          }
        }
      })
    }
  });
  if (b) {
    a = {};
    $.each(mUnits, function(c, d) {
      if (b[d.primaryKey]) {
        a[d.primaryKey] = b[d.primaryKey]
      }
    })
  }
  return a
};
Habitat.prototype.getOwnBundledHabitatUnits = function() {
  var b = null;
  var a = null;
  $.each(this.habitatUnits, function(c, d) {
    if (d.battleType == 0) {
      $.each(d.units, function(e, f) {
        if (f.count > 0) {
          if (b == null) {
            b = {}
          }
          if (b[f.primaryKey] && b[f.primaryKey] > 0) {
            b[f.primaryKey] += f.count
          } else {
            b[f.primaryKey] = f.count
          }
        }
      })
    }
  });
  if (b) {
    a = {};
    $.each(mUnits, function(c, d) {
      if (b[d.primaryKey]) {
        a[d.primaryKey] = b[d.primaryKey]
      }
    })
  }
  return a
};
Habitat.prototype.getAttackingUnits = function() {
  $.each(this.habitatUnits, function(a, b) {
    if (b.battleType != null && b.battleType == BATTLETYPE.ATTACKER) {
      $.each(b.units, function(c, d) {
        if (d.count > 0) {
          if (amounts == null) {
            amounts = {}
          }
          if (amounts[d.primaryKey] && amounts[d.primaryKey] > 0) {
            amounts[d.primaryKey] += d.count
          } else {
            amounts[d.primaryKey] = d.count
          }
        }
      })
    }
  });
  if (amounts) {
    amountsSorted = {};
    $.each(mUnits, function(a, b) {
      if (amounts[b.primaryKey]) {
        amountsSorted[b.primaryKey] = amounts[b.primaryKey]
      }
    })
  }
  return amountsSorted
};
Habitat.prototype.getAttackingUnits = function() {
  var b = null;
  var a = null;
  $.each(this.habitatUnits, function(c, d) {
    if (d.battleType != null && d.battleType == BATTLETYPE.ATTACKER) {
      nextBattleDateAttack = d.habitat.nextBattleDate;
      $.each(d.units, function(e, f) {
        if (f.count > 0) {
          if (b == null) {
            b = {}
          }
          if (b[f.primaryKey] && b[f.primaryKey] > 0) {
            b[f.primaryKey] += f.count
          } else {
            b[f.primaryKey] = f.count
          }
        }
      })
    }
  });
  if (b) {
    a = {};
    $.each(mUnits, function(c, d) {
      if (b[d.primaryKey]) {
        a[d.primaryKey] = b[d.primaryKey]
      }
    })
  }
  return a
};
Habitat.prototype.getExternDefendingUnits = function() {
  var b = null;
  var a = null;
  $.each(this.externalHabitatUnits, function(c, d) {
    if (d.battleType != null && d.battleType == BATTLETYPE.EXTERNAL_UNITS_TO_DEFENSE) {
      $.each(d.units, function(e, f) {
        if (f.count > 0) {
          if (b == null) {
            b = {}
          }
          if (b[f.primaryKey] && b[f.primaryKey] > 0) {
            b[f.primaryKey] += f.count
          } else {
            b[f.primaryKey] = f.count
          }
        }
      })
    }
  });
  if (b) {
    a = {};
    $.each(mUnits, function(c, d) {
      if (b[d.primaryKey]) {
        a[d.primaryKey] = b[d.primaryKey]
      }
    })
  }
  return a
};
Habitat.prototype.getExternAttackingUnits = function() {
  var b = null;
  var a = null;
  $.each(this.externalHabitatUnits, function(c, d) {
    if (d.battleType != null && d.battleType == BATTLETYPE.ATTACKER) {
      nextBattleDateExternAttack = d.habitat.nextBattleDate;
      $.each(d.units, function(e, f) {
        if (f.count > 0) {
          if (b == null) {
            b = {}
          }
          if (b[f.primaryKey] && b[f.primaryKey] > 0) {
            b[f.primaryKey] += f.count
          } else {
            b[f.primaryKey] = f.count
          }
        }
      })
    }
  });
  if (b) {
    a = {};
    $.each(mUnits, function(c, d) {
      if (b[d.primaryKey]) {
        a[d.primaryKey] = b[d.primaryKey]
      }
    })
  }
  return a
};
Habitat.prototype.getExternAttackBattleDate = function(b) {
  var a;
  $.each(this.externalHabitatUnits, function(c, d) {
    if (d.battleType != null && d.battleType == BATTLETYPE.ATTACKER) {
      if (d.habitat.name == b) {
        nextBattleDateExternAttack = d.habitat.nextBattleDate
      }
    }
  });
  return $.sprintf(mStringtable.getValueOf("Next battle: %@"), formatDateTime(nextBattleDateExternAttack), "")
};
Habitat.prototype.getNextExternAttackBattleDate = function(a) {
  return $.sprintf(mStringtable.getValueOf("Next battle: %@"), formatDateTime(a.nextBattleDate), "")
};
Habitat.addAttackSessionJob = function() {
  mSession.addJob(SESSIONJOBTYPE.ATTACK)
};
Habitat.prototype.getUnitsWithHistory = function() {
  var b = this;
  var a = new Array();
  $.each(b.getHabitatUnits(), function(e, d) {
    var c = new Array();
    c.push(d);
    $.each(b.habitatUnitOrders, function(g, f) {
      if (d.order == f.unit.order) {
        c.push(f)
      }
    });
    a.push(c)
  });
  return a
};
Habitat.prototype.getDependingBuilding = function(b) {
  var a = mBuildings[b];
  var c;
  if (a) {
    if (a.storeResources != null) {
      $.each(this.habitatBuildings, function(e, d) {
        if (d.order != a.order && d.generateResources != null) {
          $.each(d.generateResources, function(g, f) {
            if (a.generatesOrStoresResource(g) == true) {
              c = d
            }
          })
        }
      })
    } else {
      if (a.generateResources != null) {
        $.each(this.habitatBuildings, function(e, d) {
          if (d.order != a.order && d.storeResources != null) {
            $.each(d.storeResources, function(g, f) {
              if (a.generatesOrStoresResource(g) == true) {
                c = d
              }
            })
          }
        })
      }
    }
  }
  return c
};
Habitat.prototype.getNoSpeedUpedUnitOrders = function() {
  var a = 0;
  $.each(this.habitatUnitOrders, function(c, b) {
    if (!b.isSpeededup()) {
      a++
    }
  });
  return a
};
Habitat.prototype.getSpeedUpedUnitOrders = function() {
  var a = 0;
  $.each(this.habitatUnitOrders, function(c, b) {
    if (b.isSpeededup()) {
      a++
    }
  });
  return a
};
Habitat.prototype.getNoSpeedUpedBuildingUpgrades = function() {
  var a = 0;
  $.each(this.habitatBuildingUpgrades, function(b, c) {
    if (!c.isSpeededup()) {
      a++
    }
  });
  return a
};
Habitat.prototype.getSpeedUpedBuildingUpgrades = function() {
  var a = 0;
  $.each(this.habitatBuildingUpgrades, function(b, c) {
    if (c.isSpeededup()) {
      a++
    }
  });
  return a
};
Habitat.prototype.getHabitatMission = function(b) {
  var a;
  $.each(this.habitatMissions, function(c, d) {
    if (d.mission.primaryKey == b) {
      a = d
    }
  });
  return a
};
Habitat.prototype.getUnitOrders = function(b) {
  var a = new Array();
  $.each(this.habitatUnitOrders, function(c, d) {
    if (d.unit.primaryKey == b) {
      a.push(d)
    }
  });
  return a
};
Habitat.prototype.getKnowledgeOrder = function(a) {
  var b;
  $.each(this.habitatKnowledgeOrders, function(c, d) {
    if (d.knowledge.primaryKey == a) {
      b = d
    }
  });
  return b
};
Habitat.prototype.changeName = function(a) {
  blockUI("HabitatAction/changeHabitatName");
  if (a.indexOf("'") > -1) {
    a = a.replace(/'/g, "`")
  }
  var b = {};
  b.habitatID = mPlayer.currentHabitat.id;
  b.name = a;
  b.PropertyListVersion = propertyListVersion;
  b[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("HabitatAction/changeHabitatName", b, "Session.updateCallback")
};
Habitat.prototype.recallTroops = function(f, b, e) {
  var d = mPlayer.currentHabitat;
  var a = e;
  if (typeof e == "undefined") {
    var a = {};
    $.each(f.units, function(g, h) {
      if (h.count > 0) {
        a[h.primaryKey] = h.count
      }
    })
  }
  var c = {};
  c.sourceHabitatID = f.habitat.id;
  c.destinationHabitatID = f.sourceHabitat.id;
  c.transitType = b;
  c.unitDictionary = "{" + $.param(a).replace(/&/g, "; ") + ";}";
  c.PropertyListVersion = propertyListVersion;
  c[mPlayer.userIdentifier] = mPlayer.getHash();
  blockUI("TransitAction/startTransit");
  genericAjaxRequest("TransitAction/startTransit", c, "Session.updateCallback")
};
Habitat.prototype.sendTroopsHome = function(e, b, d) {
  var a = d;
  if (typeof d == "undefined") {
    var a = {};
    $.each(e.units, function(f, g) {
      if (g.count > 0) {
        a[g.primaryKey] = g.count
      }
    })
  }
  var c = {};
  c.sourceHabitatID = e.habitat.id;
  c.destinationHabitatID = e.sourceHabitat.id;
  c.transitType = b;
  c.unitDictionary = "{" + $.param(a).replace(/&/g, "; ") + ";}";
  c.PropertyListVersion = propertyListVersion;
  c[mPlayer.userIdentifier] = mPlayer.getHash();
  blockUI("TransitAction/startTransit");
  genericAjaxRequest("TransitAction/startTransit", c, "Session.updateCallback")
};
function event_habitat_speedupAllUnits(a) {
  blockUI("HabitatAction/speedupBuildUnit");
  $.ajax({type: "POST", dataType: "jsonp", url: mServer + "HabitatAction/speedupBuildAllUnits", data: {id: a, PropertyListVersion: propertyListVersion}, jsonp: "callback", jsonpCallback: "Session.updateCallback", error: function(d, b, c) {
      jsonp_error(d, b, c)
    }, timeout: globalTimeout})
}
Habitat.prototype.speedupAllUnits = function() {
  var c = 0;
  var a = 0;
  $.each(this.habitatUnitOrders, function(g, f) {
    if (!f.isSpeededup()) {
      c += f.orderAmount;
      a += f.orderAmount * f.unit.buildSpeedupCost
    }
  });
  var d = this;
  var e = d.id;
  var b = mStringtable.getValueOf("Gold");
  showPapyrusMsgBox($.sprintf(mStringtable.getValueOf("Reducing recruition time for %d x %@ costs %d %@. You have %d %@."), c, mStringtable.getValueOf("Units"), a, b, mPlayer.gold, b), mStringtable.getValueOf("Speedup recruiting"), event_habitat_speedupAllUnits, e, true)
};
function event_habitat_finishAllUnits(a) {
  blockUI("HabitatAction/finishBuildUnit");
  $.ajax({type: "POST", dataType: "jsonp", url: mServer + "HabitatAction/finishBuildAllUnits", data: {id: a, PropertyListVersion: propertyListVersion}, jsonp: "callback", jsonpCallback: "Session.updateCallback", error: function(d, b, c) {
      jsonp_error(d, b, c)
    }, timeout: globalTimeout})
}
Habitat.prototype.finishAllUnits = function() {
  var c = 0;
  var a = 0;
  $.each(this.habitatUnitOrders, function(g, f) {
    if (f.isSpeededup()) {
      c += f.orderAmount;
      a += f.orderAmount * f.unit.buildSpeedupCost
    }
  });
  var d = this;
  var e = d.id;
  var b = mStringtable.getValueOf("Gold");
  showPapyrusMsgBox($.sprintf(mStringtable.getValueOf("Finishing recruiting %d x %@ instantly costs %d %@. You have %d %@."), c, mStringtable.getValueOf("Units"), a, b, mPlayer.gold, b), mStringtable.getValueOf("Finish build"), event_habitat_finishAllUnits, e, true)
};
Habitat.prototype.getNextBattleDateAttack = function() {
  return $.sprintf(mStringtable.getValueOf("Next battle: %@"), formatDateTime(nextBattleDateAttack), "")
};
Habitat.prototype.getNextBattleDateExternAttack = function() {
  return $.sprintf(mStringtable.getValueOf("Next battle: %@"), formatDateTime(this.getExternAttackBattleDate()), "")
};
Habitat.prototype.isHabitatAttacked = function(b) {
  var a = false;
  $.each(mPlayer.habitate, function(c, d) {
    if (d.id == b) {
      $.each(d.habitatTransits, function(f, e) {
        if (e.transitType == 2 && mPlayer.isOwnHabitat(e.destinationHabitat.id)) {
          a = true
        }
      })
    }
  });
  return a
};
function HabitatUnit(a, c, b, d) {
  this.units = a;
  this.battleType = c;
  this.sourceHabitat = b;
  this.habitat = d
}
function HabitatUnit(a) {
  var b = new Array();
  $.each(a.habitatUnitDictionary, function(e, d) {
    var c = mUnits[e].clone();
    c.setCount(d);
    b.push(c)
  });
  $.each(mUnits, function(c, f) {
    var e = false;
    $.each(b, function(g, h) {
      if (f.primaryKey == h.primaryKey) {
        e = true;
        return(false)
      }
    });
    if (!e) {
      var d = f.clone();
      d.setCount(0);
      b.push(d)
    }
  });
  b.sort(function(d, c) {
    if (d.order < c.order) {
      return -1
    } else {
      return +1
    }
  });
  this.units = b;
  this.battleType = getValueFromJSON(a.battleType);
  this.sourceHabitat = new Habitat(a.sourceHabitat);
  this.habitat = new Habitat(a.habitat)
}
function HabitatView() {
  this.buildingName;
  this.buildingID;
  this.dependingBuilding;
  this.upgradeToID;
  this.recruitingListValues = null;
  this.factory = null;
  this.selectedTabIndex = 0;
  this.unitIdentifierDetailsView;
  this.currentScrollValue = 0;
  this.currentScrollValue2 = 0;
  this.currentScrollValue3 = 0
}
HabitatView.prototype.addViewToStack = function(e, b) {
  if (mBottomBar.stackArray[0].length > 0) {
    var a = mBottomBar.stackArray[0];
    if (a[a.length - 1].itemType == e) {
      a.pop()
    }
  }
  var c = new StackItem();
  c.itemType = e;
  if (e == ITEMTYPE.HABITAT_VIEW_ITEM) {
    c.objectID = true;
    c.functionname = mHabitatView.openHabitat
  } else {
    if (e == ITEMTYPE.BUILDINGDETAIL_VIEW_ITEM) {
      c.objectID = mCurrentBuilding.order;
      c.functionname = mHabitatView.buildingClickHandler;
      if (typeof b != "undefined") {
        var d = new StackItem(ITEMTYPE.HABITAT_VIEW_ITEM, mHabitatView.openHabitat);
        d.objectID = false;
        c.addSequenceItem(d)
      }
    } else {
      if (e == ITEMTYPE.UNITDETAIL_VIEW_ITEM) {
        c.objectID = b;
        c.functionname = mHabitatView.openUnitDetailsView;
        var d = new StackItem(ITEMTYPE.HABITAT_VIEW_ITEM, mHabitatView.openHabitat);
        d.objectID = false;
        c.addSequenceItem(d)
      } else {
        if (e == ITEMTYPE.EXCHANGE_VIEW_ITEM) {
          c.functionname = openExchangeView
        } else {
          if (e == ITEMTYPE.MISSION_VIEW_ITEM) {
            c.objectID = mCurrentBuilding.order;
            c.additionalParameter = mCurrentKey;
            c.functionname = openKnowledgeAndMissionView;
            var d = new StackItem(ITEMTYPE.HABITAT_VIEW_ITEM, mHabitatView.openHabitat);
            d.objectID = false;
            c.addSequenceItem(d)
          } else {
            if (e == ITEMTYPE.TROOPS_VIEW_ITEM) {
              c.objectID = -1;
              c.additionalParameter = b;
              c.functionname = mHabitatView.openTroopDetails;
              var d = new StackItem(ITEMTYPE.HABITAT_VIEW_ITEM, mHabitatView.openHabitat);
              d.objectID = false;
              c.addSequenceItem(d)
            }
          }
        }
      }
    }
  }
  mBottomBar.addToStack(c)
};
HabitatView.prototype.openHabitat = function(a) {
  mCurrentActionBlocked = false;
  mHabitatView.addHabitatGraphics();
  $.tmpl("habitatBuildingUnitListTmpl", mPlayer).appendTo($("div#tabsBuildingUnitList").empty());
  windowSize();
  $("#tabsBuildingUnitList").tabs({select: function(b, c) {
      mHabitatView.selectedTabIndex = c.index;
      $("div.scrollAnchor").scrollTop(0)
    }, selected: mHabitatView.selectedTabIndex});
  if (a == true) {
    mHabitatView.addViewToStack(ITEMTYPE.HABITAT_VIEW_ITEM)
  }
  $("img.wall").load(function() {
    windowSize()
  });
  setHover("div.listview");
  $("td.buildingRow").click(function(b) {
    mHabitatView.currentScrollValue3 = $("div.scrollAnchor").scrollTop();
    if (b.target.className.indexOf("upgradebutton") >= 0 || b.target.parentNode.className.indexOf("upgradebutton") >= 0) {
      mBuildings[$(this).metadata().primaryKey].upgrade(mPlayer.currentHabitat)
    } else {
      if (b.target.className.indexOf("speedupbutton") >= 0 || b.target.parentNode.className.indexOf("speedupbutton") >= 0) {
        var c = mPlayer.currentHabitat.getHabitatBuildingUpgrade($(this).metadata().buildingUpgrade);
        if (c) {
          c.buildingTarget.speedup(c)
        }
      } else {
        if (b.target.className.indexOf("finishbutton") >= 0 || b.target.parentNode.className.indexOf("finishbutton") >= 0) {
          var c = mPlayer.currentHabitat.getHabitatBuildingUpgrade($(this).metadata().buildingUpgrade);
          if (c) {
            c.buildingTarget.finish(c)
          }
        } else {
          mHabitatView.dependingBuilding = mPlayer.currentHabitat.getDependingBuilding($(this).metadata().primaryKey);
          mHabitatView.buildingID = $(this).metadata().primaryKey;
          mCurrentBuilding = mBuildings[$(this).metadata().primaryKey];
          mHabitatView.addViewToStack(ITEMTYPE.BUILDINGDETAIL_VIEW_ITEM, true);
          if (mCurrentBuilding.identifier.substring(0, 6) == "Tavern" || mCurrentBuilding.identifier.substring(0, 7) == "Library") {
            if (mPlayer.currentHabitat.isUpgradingBuilding(mHabitatView.buildingID)) {
              mHabitatView.buildingID = mHabitatView.buildingID - 1
            }
          }
          mHabitatView.buildingClickHandler(mHabitatView.buildingID)
        }
      }
    }
  });
  $("table.clickable").click(function(d) {
    var b;
    var c = $(this).metadata().key;
    if (c == "TRANSIT") {
      b = mPlayer.currentHabitat.getHabitatTransitById($(this).metadata().index)
    } else {
      if (c == "MISSION") {
        b = mPlayer.currentHabitat.habitatMissions[$(this).metadata().index]
      } else {
        b = {};
        b.key = c
      }
    }
    mHabitatView.addViewToStack(ITEMTYPE.TROOPS_VIEW_ITEM, b);
    mHabitatView.openTroopDetails(b)
  });
  if (mHabitatView.currentScrollValue3 > 0) {
    $("div.scrollAnchor").scrollTop(mHabitatView.currentScrollValue3 + 120)
  }
};
HabitatView.prototype.buildingClickHandler = function(a) {
  mCurrentBuilding = mBuildings[a];
  mHabitatView.upgradeToID = mCurrentBuilding.upgradeTo;
  mHabitatView.buildingID = a;
  mHabitatView.buildingName = mCurrentBuilding.getIdentifierWithoutLevel();
  mHabitatView.dependingBuilding = mPlayer.currentHabitat.getDependingBuilding(mHabitatView.buildingID);
  str_mCurrentAction = "showBuilding";
  if (mHabitatView.buildingName == "Tavern" || mHabitatView.buildingName == "Library") {
    mCurrentActionBlocked = false;
    selectButtonWithoutClearStack(0, ITEMTYPE.HABITAT_VIEW_ITEM);
    mHabitatView.showLibraryDetails()
  } else {
    if (mHabitatView.buildingName == "Farm") {
      selectButtonWithoutClearStack(0, ITEMTYPE.HABITAT_VIEW_ITEM);
      mCurrentActionBlocked = false;
      mHabitatView.showFarmDetails()
    } else {
      if (mHabitatView.buildingName == "Ore Mine" || mHabitatView.buildingName == "Ore Store") {
        selectButtonWithoutClearStack(0, ITEMTYPE.HABITAT_VIEW_ITEM);
        mCurrentActionBlocked = false;
        mHabitatView.showResourceInformations("Ore")
      } else {
        if (mHabitatView.buildingName == "Quarry" || mHabitatView.buildingName == "Stone Store") {
          selectButtonWithoutClearStack(0, ITEMTYPE.HABITAT_VIEW_ITEM);
          mCurrentActionBlocked = false;
          mHabitatView.showResourceInformations("Stone")
        } else {
          if (mHabitatView.buildingName == "Lumberjack" || mHabitatView.buildingName == "Wood Store") {
            selectButtonWithoutClearStack(0, ITEMTYPE.HABITAT_VIEW_ITEM);
            mCurrentActionBlocked = false;
            mHabitatView.showResourceInformations("Wood")
          } else {
            if (mHabitatView.buildingName == "Market" || mHabitatView.buildingName == "Keep") {
              selectButtonWithoutClearStack(0, ITEMTYPE.HABITAT_VIEW_ITEM);
              mCurrentActionBlocked = true;
              mHabitatView.showMarketDistance()
            } else {
              if (mHabitatView.buildingName == "Wall" || mHabitatView.buildingName == "Arsenal") {
                selectButtonWithoutClearStack(0, ITEMTYPE.HABITAT_VIEW_ITEM);
                mCurrentActionBlocked = false;
                mHabitatView.showModifierInformations()
              }
            }
          }
        }
      }
    }
  }
};
HabitatView.prototype.switchHabitat = function() {
  mHabitatView.buildingID = mPlayer.currentHabitat.findBuilding(mHabitatView.buildingName);
  mHabitatView.addHabitatGraphics();
  mHabitatView.buildingClickHandler(mHabitatView.buildingID);
  windowSize()
};
HabitatView.prototype.selectUnitsInHabitatViewTab = function() {
  $("#tabsBuildingUnitList").tabs({selected: 1})
};
HabitatView.prototype.showBuildingDetails = function() {
  var g = "burg_" + mPlayer.currentHabitat.id;
  var j = $.jStorage.get(g);
  var c = null;
  if (j == null) {
    j = h(g)
  }
  if (j.length < 13) {
    $.jStorage.deleteKey(g);
    j = h(g)
  }
  mCurrentBuilding.ch_ch = j;
  $.tmpl("buildingDetailsTmpl", mCurrentBuilding).appendTo($("div#tabsBuildingUnitList").empty());
  function a(m, l) {
    var k = "burg_" + mPlayer.currentHabitat.id;
    var n = $.jStorage.get(k);
    n[m] = l;
    $.jStorage.set(k, n)
  }
  function h(l) {
    var k = 0;
    $.each(mMissions, function(o, r) {
      k = k + 1
    });
    var n = [null];
    for (var m = 1; m < k + 1; m++) {
      n[m] = 0
    }
    $.jStorage.set(l, n);
    return n
  }
  function d(l, k) {
    if (l == "btn_missions_start" && c === k) {
      return false
    }
    if (k) {
      $.each($("#" + l).find("div"), function(m, n) {
        if ($(this).hasClass("iconbutton_left_disabled")) {
          $(this).removeClass("iconbutton_left_disabled").addClass("iconbutton_left")
        } else {
          if ($(this).hasClass("iconbutton_right_disabled")) {
            $(this).removeClass("iconbutton_right_disabled").addClass("iconbutton_right")
          } else {
            if ($(this).hasClass("iconbutton_middle_disabled")) {
              $(this).removeClass("iconbutton_middle_disabled").addClass("iconbutton_middle")
            }
          }
        }
      });
      if (!$("#" + l).hasClass("hoverable")) {
        $("#" + l).addClass("hoverable");
        bindHoverHandler("#" + l)
      }
      if (l == "btn_missions_start") {
        c = true
      }
    } else {
      $.each($("#" + l).find("div"), function(m, n) {
        if ($(this).hasClass("iconbutton_left")) {
          $(this).removeClass("iconbutton_left").addClass("iconbutton_left_disabled")
        } else {
          if ($(this).hasClass("iconbutton_right")) {
            $(this).removeClass("iconbutton_right").addClass("iconbutton_right_disabled")
          } else {
            if ($(this).hasClass("iconbutton_middle")) {
              $(this).removeClass("iconbutton_middle").addClass("iconbutton_middle_disabled")
            }
          }
        }
      });
      $("#" + l).unbind("mouseover mouseout");
      $("#" + l).removeClass("hoverable");
      if (l == "btn_missions_start") {
        c = false
      }
    }
  }
  function b() {
    var k = false;
    $(".checkbox_missions").each(function(l) {
      var m = $(this);
      if (m.attr("checked")) {
        k = true;
        return true
      }
    });
    if (k) {
      d("btn_missions_start", true)
    } else {
      d("btn_missions_start", false)
    }
    if (mPlayer.currentHabitat.habitatMissions.length > 0) {
      d("btn_missions_spead", true)
    } else {
      d("btn_missions_spead", false)
    }
  }
  function e() {
    var t = [];
    var o = 0;
    var u;
    var n = mPlayer.currentHabitat.getHabitatUnits();
    var r = mPlayer.currentHabitat.habitatResources;
    var k = [];
    var l = [];
    var m = 0;
    $.each(r, function(w, v) {
      k[w] = Math.floor(v.amount)
    });
    $.each(n, function(v, w) {
      l[w.primaryKey] = w.count
    });
    $(".checkbox_missions").each(function(w) {
      var z = $(this);
      if (z.attr("checked")) {
        pk = parseInt(z.attr("id").substr(3));
        var v = mMissions[pk].resourceConsumptions;
        if (v) {
          $.each(v, function(B, C) {
            k[B] = k[B] - C
          })
        }
        var A = mMissions[pk].unitConsumptions;
        if (A) {
          $.each(A, function(C, B) {
            l[C] = l[C] - B
          })
        }
        m++
      }
    });
    $(".checkbox_missions").each(function(w) {
      var A = $(this);
      var z = false;
      if (!A.attr("checked")) {
        pk = parseInt(A.attr("id").substr(3));
        var v = mMissions[pk].resourceConsumptions;
        if (v) {
          $.each(v, function(C, D) {
            if (k[C] < D) {
              z = true
            }
          })
        }
        var B = mMissions[pk].unitConsumptions;
        if (B) {
          $.each(B, function(D, C) {
            if (l[D] < C) {
              z = true
            }
          })
        }
      }
      if (z) {
        A.hide()
      } else {
        A.show()
      }
    });
    if (m) {
      d("btn_missions_start", true)
    } else {
      d("btn_missions_start", false)
    }
  }
  b();
  e();
  $("#btn_missions_start").click(function() {
    if (!c) {
      return false
    }
    var k = [];
    $(".checkbox_missions").each(function(m) {
      var o = $(this);
      if (o.attr("checked")) {
        var n = parseInt(o.attr("id").substr(3));
        k.push(n)
      }
    });
    var l = {};
    l.primaryKeys = "(" + k.join(",") + ")";
    l.habitatID = mPlayer.currentHabitat.id;
    l[mPlayer.userIdentifier] = mPlayer.getHash();
    l.PropertyListVersion = propertyListVersion;
    genericAjaxRequest("HabitatAction/executeMissions", l, "Session.updateCallback");
    if (!mIsBlocked) {
      blockUI("Loading...")
    }
  });
  $("#btn_missions_spead").click(function() {
    Mission.speedupAll()
  });
  $("#start_global_missions").click(function() {
    openGlobalMissions()
  });
  $(".checkbox_missions").click(function() {
    var k = parseInt($(this).attr("id").substr(3));
    if ($(this).attr("checked")) {
      a(k, 1)
    } else {
      a(k, 0)
    }
    e()
  });
  var f = mPlayer.currentHabitat.getCurrentUpgradesOfBuilding(mCurrentBuilding.order);
  if (f.length > 0) {
    if (f[f.length - 1].buildingTarget.upgradeTo) {
      $.tmpl("nextLevelPreviewTmpl", mBuildings[f[f.length - 1].buildingTarget.upgradeTo]).appendTo($("div.nextLevel"));
      $("div.build").click(function() {
        mCurrentActionBlocked = false;
        mBuildings[$(this).metadata().primaryKey].upgrade(mPlayer.habitate[$(this).metadata().habitat])
      })
    }
    setHover("div.factory");
    windowSize()
  } else {
    if (mCurrentBuilding.upgradeTo) {
      $.tmpl("nextLevelPreviewTmpl", mBuildings[mCurrentBuilding.upgradeTo]).appendTo($("div.nextLevel"));
      $("div.build").click(function() {
        mCurrentActionBlocked = false;
        mBuildings[$(this).metadata().primaryKey].upgrade(mPlayer.habitate[$(this).metadata().habitat])
      })
    }
    setHover("div.factory");
    windowSize()
  }
  $("div.speedupBuildingUpgrade").click(function() {
    var k = mPlayer.habitate[$(this).metadata().habitat];
    var l = k.getHabitatBuildingUpgrade($(this).metadata().buildingUpgrade);
    if (l) {
      mCurrentActionBlocked = false;
      l.buildingTarget.speedup(l)
    }
  });
  $("div.finishBuildingUpgrade").click(function() {
    var k = mPlayer.habitate[$(this).metadata().habitat];
    var l = k.getHabitatBuildingUpgrade($(this).metadata().buildingUpgrade);
    if (l) {
      mCurrentActionBlocked = false;
      l.buildingTarget.finish(l)
    }
  });
  $("div.closeViewMission").click(function() {
    navigateBack()
  });
  if (mHabitatView.currentScrollValue == 0 || mHabitatView.currentScrollValue2 == 0) {
    $("div.paddinOut").scrollTop(0)
  }
  if (mHabitatView.currentScrollValue2 > 0) {
    $("div.paddinOut").scrollTop(mHabitatView.currentScrollValue2 + 100)
  } else {
    $("div.paddinOut").scrollTop(mHabitatView.currentScrollValue)
  }
};
HabitatView.prototype.showModifierInformations = function() {
  mHabitatView.showBuildingDetails();
  if (mBuildings[mHabitatView.buildingID].units) {
    $("img.warning").hide();
    mHabitatView.handleRecruitingActions()
  }
};
HabitatView.prototype.handleRecruitingActions = function() {
  mHabitatView.recruitingListValues = {};
  $("input.recruit_unit").numeric({decimal: false, negative: false});
  $("input.recruit_unit").bind("paste", function(a) {
    a.preventDefault()
  });
  $("input.recruit_unit").blur(function(a) {
    if ($(this).attr("class").indexOf("doNothing") == -1) {
      mHabitatView.updateRecruitingValues($(this))
    }
  });
  $("div.maxUnit").click(function() {
    var b = $(this).parent().find("input.recruit_unit");
    var a = parseInt($(this).find("span.unitValue").html(), 10);
    if ($(this).attr("class").indexOf("doNothing") == -1) {
      if (a > 0 && $(this).attr("class").indexOf("noMax") == -1) {
        var c = parseInt($(b).val(), 10);
        if (isNaN(c)) {
          c = 0
        }
        $(b).val(a);
        mHabitatView.updateRecruitingValues($(this))
      }
    }
  });
  $("div.recruit").click(function() {
    mHabitatView.currentScrollValue2 = $("div.paddinOut").scrollTop();
    var b = mPlayer.habitate[$(this).metadata().habitat];
    var a = $('input[id="recruit_' + $(this).metadata().habitat + "_" + $(this).metadata().primaryKey + '"]').val();
    if (b && a != "0" && $(this).attr("class").indexOf("norecruit") == -1) {
      mCurrentActionBlocked = false;
      mUnits[$(this).metadata().primaryKey].build(b, a)
    }
  });
  $("div.speedupRecruit").click(function() {
    mHabitatView.currentScrollValue2 = $("div.paddinOut").scrollTop();
    var b = mPlayer.habitate[$(this).metadata().habitat];
    var a = b.getUnitOrder($(this).metadata().unitOrder);
    if (a) {
      mCurrentActionBlocked = false;
      a.unit.speedup(a)
    }
  });
  $("div.finishRecruit").click(function() {
    mHabitatView.currentScrollValue2 = $("div.paddinOut").scrollTop();
    var b = mPlayer.habitate[$(this).metadata().habitat];
    var a = b.getUnitOrder($(this).metadata().unitOrder);
    if (a) {
      mCurrentActionBlocked = false;
      a.unit.finish(a)
    }
  });
  $("div.recruiting").click(function(b) {
    var c = b.target.className;
    var a = ((c.indexOf("noclick") > -1) || (c.indexOf("iconbutton") > -1));
    if (!a) {
      mHabitatView.unitIdentifierDetailsView = $(this).find("input.recruit_unit").metadata().pk;
      mHabitatView.openUnitDetailsView($(this).find("input.recruit_unit").metadata().pk)
    }
  })
};
HabitatView.prototype.updateRecruitingValues = function(h) {
  var f = $(h).parent().find("input.recruit_unit");
  var j = $(f).val();
  var d = parseInt(mHabitatView.recruitingListValues[$(f).attr("id")], 10);
  if (isNaN(d)) {
    d = 0
  }
  if (parseInt(j, 10) > (parseInt($(h).parent().find("span.unitValue").html(), 10))) {
    var g = $(h).parent().find("div.recruit");
    setDisabled(g);
    $(g).unbind("mouseover");
    $(g).unbind("mouseout");
    $(g).removeClass("hoverable");
    $(g).removeClass("recruit").addClass("norecruit");
    $(h).parent().find("img.warning").show();
    g = $(h).parent().find("div.maxUnit");
    setDisabled(g);
    $(g).unbind("mouseover");
    $(g).unbind("mouseout");
    $(g).removeClass("hoverable");
    $(g).removeClass("maxUnit").addClass("noMax")
  } else {
    var g = $(h).parent().find("div.norecruit");
    if (g) {
      setEnabled($(g));
      $(g).addClass("hoverable");
      bindHoverHandler($(g));
      $(g).removeClass("norecruit").addClass("recruit")
    }
    g = $(h).parent().find("div.noMax");
    if (g) {
      setEnabled($(g));
      $(g).addClass("hoverable");
      bindHoverHandler($(g));
      $(g).removeClass("noMax").addClass("maxUnit");
      $(h).parent().find("img.warning").hide()
    }
    if (!isNaN(parseInt(j))) {
      mHabitatView.recruitingListValues[$(f).attr("id")] = j
    }
    var b = 0, c = 0, a = 0, k = 0, e = 0;
    $("div.recruitingBlock").find("input.recruit_unit").each(function() {
      b += $(this).val() * $(this).metadata().wood;
      c += $(this).val() * $(this).metadata().stone;
      a += $(this).val() * $(this).metadata().ore;
      k += $(this).val() * $(this).metadata().people;
      e += $(this).val() * $(this).metadata().duration;
      var l = $(this).parent();
      if ($(this).parent().attr("class") == "recruitingBlock clearFloat") {
        $("div.contenttable").find("span#resource_Wood").html(b);
        $("div.contenttable").find("span#resource_Stone").html(c);
        $("div.contenttable").find("span#resource_Ore").html(a);
        $("div.contenttable").find("span#resource_People").html(k);
        $("div.contenttable").find("span#resource_Time").html(secToTimeStr(e))
      }
    })
  }
};
HabitatView.prototype.openUnitDetailsView = function(a) {
  mCurrentActionBlocked = false;
  mHabitatView.addViewToStack(ITEMTYPE.UNITDETAIL_VIEW_ITEM, a);
  $.tmpl("unitDetailsTmpl", mUnits[mHabitatView.unitIdentifierDetailsView]).appendTo($("div#tabsBuildingUnitList").empty());
  setHover("div.unitDetail");
  windowSize();
  mHabitatView.handleRecruitingActions();
  $("img.warning").hide();
  $("div.closeViewMission").click(function(b) {
    navigateBack()
  });
  $("div.reqshow").click(function(b) {
    mCurrentBuilding = mPlayer.currentHabitat.getTavern();
    mCurrentKey = $(this).metadata().reqID;
    mHabitatView.addViewToStack(ITEMTYPE.MISSION_VIEW_ITEM);
    openKnowledgeAndMissionView(mCurrentBuilding.primaryKey, mCurrentKey)
  })
};
HabitatView.prototype.showMarketDistance = function() {
  mHabitatView.showBuildingDetails();
  $("span.marketamount:first").html($.sprintf(mStringtable.getValueOf("%d fields"), mBuildings[mHabitatView.buildingID].marketDistance));
  if (mHabitatView.upgradeToID && $(".nextLevel").children().length > 0) {
    if (mPlayer.currentHabitat.isUpgradingBuilding(mHabitatView.upgradeToID)) {
      var a = parseInt(mHabitatView.upgradeToID) + 1;
      $("span.marketamount:last").html($.sprintf(mStringtable.getValueOf("%d fields"), mBuildings[a].marketDistance))
    } else {
      $("span.marketamount:last").html($.sprintf(mStringtable.getValueOf("%d fields"), mBuildings[mHabitatView.upgradeToID].marketDistance))
    }
  }
  $("div.marketplace").click(function() {
    mExchangeResourceId = $(this).metadata().resource;
    mExchangeBuilding = mBuildings[mHabitatView.buildingID];
    mHabitatView.addViewToStack(ITEMTYPE.EXCHANGE_VIEW_ITEM);
    openExchangeView()
  });
  $("div.playerGoldAmount").click(function() {
    openBuyGoldView()
  });
  $("img.warning").hide();
  mHabitatView.handleRecruitingActions();
  $(".editableText").editableText({newlinesEnabled: false});
  $(".editableText").change(function() {
    var b = $(this).text();
    if (mHabitatView.validateHabitatname(b)) {
      mCurrentActionBlocked = false;
      mChangedHabitatName = true;
      mPlayer.currentHabitat.changeName(b)
    } else {
      $(".editableText").text(mPlayer.currentHabitat.name)
    }
  })
};
HabitatView.prototype.showResourceInformations = function(b) {
  $("div.paddinOut").scrollTop(0);
  var a = mBuildings[mHabitatView.buildingID];
  if (a.getIdentifierWithoutLevel().indexOf("Store") == -1) {
    mHabitatView.factory = new Array(a, mHabitatView.dependingBuilding)
  } else {
    mHabitatView.factory = new Array(mHabitatView.dependingBuilding, a)
  }
  $.tmpl("factoryDetailsTmpl", mHabitatView).appendTo($("div#tabsBuildingUnitList").empty());
  if (mHabitatView.factory[0].upgradeTo) {
    var c = mPlayer.currentHabitat.getCurrentUpgradesOfBuilding(mHabitatView.factory[0].order);
    if (c.length > 0) {
      if (mBuildings[c[c.length - 1].buildingTarget.upgradeTo]) {
        $.tmpl("nextLevelPreviewTmpl", mBuildings[c[c.length - 1].buildingTarget.upgradeTo]).appendTo($("div.next:first"))
      }
    } else {
      if (mBuildings[mHabitatView.factory[0].upgradeTo]) {
        $.tmpl("nextLevelPreviewTmpl", mBuildings[mHabitatView.factory[0].upgradeTo]).appendTo($("div.next:first"))
      }
    }
  }
  if (mHabitatView.factory[1].upgradeTo) {
    var c = mPlayer.currentHabitat.getCurrentUpgradesOfBuilding(mHabitatView.factory[1].order);
    if (c.length > 0) {
      if (mBuildings[c[c.length - 1].buildingTarget.upgradeTo]) {
        $.tmpl("nextLevelPreviewTmpl", mBuildings[c[c.length - 1].buildingTarget.upgradeTo]).appendTo($("div.next:last"))
      }
    } else {
      if (mBuildings[mHabitatView.factory[1].upgradeTo]) {
        $.tmpl("nextLevelPreviewTmpl", mBuildings[mHabitatView.factory[1].upgradeTo]).appendTo($("div.next:last"))
      }
    }
  }
  windowSize();
  setHover("div.factory");
  $("div.build").click(function() {
    mBuildings[$(this).metadata().primaryKey].upgrade(mPlayer.habitate[$(this).metadata().habitat])
  });
  $("div.speedupBuildingUpgrade").click(function() {
    var d = mPlayer.habitate[$(this).metadata().habitat];
    var e = d.getHabitatBuildingUpgrade($(this).metadata().buildingUpgrade);
    if (e) {
      e.buildingTarget.speedup(e)
    }
  });
  $("div.finishBuildingUpgrade").click(function() {
    var d = mPlayer.habitate[$(this).metadata().habitat];
    var e = d.getHabitatBuildingUpgrade($(this).metadata().buildingUpgrade);
    if (e) {
      e.buildingTarget.finish(e)
    }
  });
  $("div.closeViewMission").click(function() {
    navigateBack()
  })
};
HabitatView.prototype.showFarmDetails = function() {
  mHabitatView.showBuildingDetails();
  var a = 0;
  $.each(mBuildings[mHabitatView.upgradeToID].storeResources, function(b, c) {
    $("span.storeamount:eq(" + a + ")").html(mBuildings[mHabitatView.upgradeToID].storeAmount);
    a++
  })
};
HabitatView.prototype.showLibraryDetails = function() {
  mHabitatView.showBuildingDetails();
  $("span.storeamount").html("");
  $("div.knowledges").click(function(b) {
    var c = b.target.className;
    var a = ((c.indexOf("noclick") > -1) || (c.indexOf("iconbutton") > -1));
    if (!a) {
      mCurrentKey = $(this).metadata().key;
      mHabitatView.addViewToStack(ITEMTYPE.MISSION_VIEW_ITEM);
      openKnowledgeAndMissionView(mCurrentBuilding.primaryKey, mCurrentKey)
    }
  });
  $("div.speedupMission").click(function() {
    mHabitatView.currentScrollValue = $("div.paddinOut").scrollTop();
    mMissions[$(this).metadata().primaryKey].speedup(mPlayer.habitate[$(this).metadata().habitat])
  });
  $("div.speedupResearch").click(function() {
    mHabitatView.currentScrollValue = $("div.paddinOut").scrollTop();
    mKnowledges[$(this).metadata().primaryKey].speedup(mPlayer.habitate[$(this).metadata().habitat])
  });
  $("div.finishResearch").click(function() {
    mHabitatView.currentScrollValue = $("div.paddinOut").scrollTop();
    mKnowledges[$(this).metadata().primaryKey].finish(mPlayer.habitate[$(this).metadata().habitat])
  });
  $("div.explore").click(function() {
    mHabitatView.currentScrollValue = $("div.paddinOut").scrollTop();
    mKnowledges[$(this).metadata().primaryKey].research(mPlayer.habitate[$(this).metadata().habitat])
  });
  $("div.execute").click(function() {
    mHabitatView.currentScrollValue = $("div.paddinOut").scrollTop();
    mMissions[$(this).metadata().primaryKey].execute(mPlayer.habitate[$(this).metadata().habitat])
  })
};
HabitatView.prototype.addHabitatGraphics = function() {
  $.tmpl("habitatViewTmpl", mPlayer).appendTo($("div.viewport").empty());
  setPapyrusBackgroundForRightSide();
  windowSize();
  $("div#habitatView a").click(function(a) {
    mHabitatView.dependingBuilding = mPlayer.currentHabitat.getDependingBuilding($(this).metadata().buildingID);
    mHabitatView.buildingID = $(this).metadata().buildingID;
    mCurrentBuilding = mBuildings[$(this).metadata().buildingID];
    mHabitatView.addViewToStack(ITEMTYPE.BUILDINGDETAIL_VIEW_ITEM, true);
    mHabitatView.buildingClickHandler(mHabitatView.buildingID)
  })
};
HabitatView.prototype.validateHabitatname = function(b) {
  var a = true;
  if (b == null) {
    showPapyrusMsgBox(mStringtable.getValueOf("The name is blacklisted"));
    a = false
  } else {
    if (b.length == 0) {
      showPapyrusMsgBox(mStringtable.getValueOf("The name is blacklisted"));
      a = false
    }
  }
  return a
};
HabitatView.prototype.openTroopDetails = function(a, b) {
  if (b == undefined || b == null) {
    b = "div#tabsBuildingUnitList"
  }
  $.tmpl("unitTroopsDetailsTmpl", a).appendTo($(b).empty());
  setHover("div.troopsview");
  windowSize();
  $("div.transitUnits").click(function(c) {
    if (b == "div#tabsBuildingUnitList") {
      mHabitatView.unitIdentifierDetailsView = $(this).metadata().primaryKey;
      mHabitatView.openUnitDetailsView($(this).metadata().primaryKey)
    }
  });
  $("div.closeViewMission").click(function(c) {
    if (b == "div#tabsBuildingUnitList") {
      navigateBack()
    } else {
      mapCloseButtonAction()
    }
  });
  $(".name").click(function() {
    mMapStackUsed = true;
    mapActions.reset();
    boardSetup($(this).metadata().habitatX, $(this).metadata().habitatY)
  });
  $(".internal_link").click(function() {
    Actionslinks.openView($(this).attr("id"))
  });
  $("div.recall").click(function(e) {
    var c = {};
    var d = 0;
    var f = 0;
    var g = 0;
    $("#externalUnits_" + $(this).metadata().externalUnitIndex).find("input.sendBack").each(function(h) {
      f = parseInt($(this).val());
      d = $(this).metadata().pk;
      if (f > 0 && !isNaN(f)) {
        c[d] = f;
        g += f
      }
    });
    if (Object.size(c) > 0) {
      mPlayer.currentHabitat.recallTroops(mPlayer.currentHabitat.externalHabitatUnits[$(this).metadata().externalUnitIndex], $(this).metadata().transittype, c)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf("No untis were assigned."))
    }
  });
  $("div.sendHome").click(function(e) {
    var c = {};
    var d = 0;
    var f = 0;
    var g = 0;
    $("#friendlyUnits_" + $(this).metadata().habitatUnitIndex).find("input.sendBack").each(function(h) {
      f = parseInt($(this).val());
      d = $(this).metadata().pk;
      if (f > 0 && !isNaN(f)) {
        c[d] = f;
        g += f
      }
    });
    if (Object.size(c) > 0) {
      mPlayer.currentHabitat.sendTroopsHome(mPlayer.currentHabitat.habitatUnits[$(this).metadata().habitatUnitIndex], $(this).metadata().transittype, c)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf("No untis were assigned."))
    }
  });
  $("input.sendBack").blur(function(d) {
    var c = parseInt($(this).val());
    var f = parseInt($(this).metadata().count);
    if (c > f) {
      $(this).val(f)
    } else {
      if (isNaN(c)) {
        $(this).val(0)
      }
    }
  });
  $("input.sendBack").numeric({decimal: false, negative: false});
  $("input.sendBack").bind("paste", function(c) {
    c.preventDefault()
  })
};
function HabitatMission(a) {
  this.mission = mMissions[getValueFromJSON(a.missionId)];
  this.complete = jsonDateToDate(getValueFromJSON(a.complete));
  this.durationFactor = getValueFromJSON(a.durationFactor);
  this.durationInSeconds = getValueFromJSON(a.durationInSeconds);
  this.units = null
}
HabitatMission.prototype.isSpeededup = function() {
  if (this.durationFactor == 0.5) {
    return true
  } else {
    return false
  }
};
HabitatMission.prototype.getAllUnits = function() {
  var b = new Array();
  var a;
  if (this instanceof HabitatMission) {
    a = this
  } else {
    a = this.data
  }
  $.each(a.mission.unitProductions, function(e, d) {
    var c = mUnits[e].clone();
    c.setCount(d);
    b.push(c)
  });
  $.each(mUnits, function(c, f) {
    var e = false;
    $.each(b, function(g, h) {
      if (f.primaryKey == h.primaryKey) {
        e = true;
        return(false)
      }
    });
    if (!e) {
      var d = f.clone();
      d.setCount(0);
      b.push(d)
    }
  });
  b.sort(function(d, c) {
    if (d.order < c.order) {
      return -1
    } else {
      return +1
    }
  });
  return b
};
HabitatMission.prototype.updateTimeToComplete = function(b) {
  var a = this.complete - (new Date() - mTimeDifferenceToServer);
  if (a >= 0) {
    $("span#mission_" + b + "_" + this.mission.primaryKey).html(secToTimeStr(Math.floor(a / (1000))) + " - " + formatDateTime(this.complete))
  } else {
    mSession.addJob(SESSIONJOBTYPE.MISSION);
    mPlayer.habitate[b].deleteMissionFormList(this.mission.primaryKey)
  }
};
function HabitatResource(a, b, f, e, c, d) {
  this.blockedAmount = a;
  this.amount = b;
  this.resourceId = f;
  this.generateAmount = e;
  this.lastUpdate = c;
  this.storeAmount = d;
  this.name = mStringtable.getValueOf(mResources[f].identifier)
}
function HabitatResource(a) {
  this.blockedAmount = getValueFromJSON(a.blockedAmount);
  this.amount = getValueFromJSON(a.amount);
  this.resourceId = getValueFromJSON(a.resourceId);
  this.generateAmount = getValueFromJSON(a.generateAmount);
  this.lastUpdate = getValueFromJSON(a.lastUpdate);
  this.storeAmount = getValueFromJSON(a.storeAmount);
  this.name = mStringtable.getValueOf(mResources[a.resourceId].identifier)
}
HabitatResource.prototype.updateData = function(a) {
  this.blockedAmount = getValueFromJSON(a.blockedAmount);
  this.amount = getValueFromJSON(a.amount);
  this.generateAmount = getValueFromJSON(a.generateAmount);
  this.lastUpdate = getValueFromJSON(a.lastUpdate);
  this.storeAmount = getValueFromJSON(a.storeAmount)
};
HabitatResource.prototype.getCssName = function() {
  return mResources[this.resourceId].identifier
};
HabitatResource.prototype.getPercent = function() {
  return parseInt(this.amount * 100 / this.storeAmount)
};
HabitatResource.prototype.getBgColor = function() {
  var b = this.getPercent();
  var a = "";
  $.each(mSettings.habitatResourcesCapacityColors, function(d, e) {
    if ((b == e.start) || (b >= e.start && b < e.end)) {
      a = e.color;
      return(false)
    }
  });
  return a
};
HabitatResource.prototype.updateResource = function() {
  var a = this.generateAmount;
  $.each(mPlayer.currentHabitat.habitatModifier, function(d, c) {
    if (c.type == MODIFIERTYPE.AMOUNTGENERATE) {
      if (jQuery.inArray("Building", c.targets) > -1) {
        a = a * c.percentage
      }
    }
  });
  var b = a / 3600;
  if (this.amount + b < this.storeAmount) {
    this.amount += b
  } else {
    this.amount = this.storeAmount
  }
};
HabitatResource.prototype.getTitle = function() {
  if (this.generateAmount > 0) {
    return this.name + " - " + $.sprintf(mStringtable.getValueOf("Generator header: %d"), this.generateAmount)
  } else {
    if (this.resourceId == 4) {
      var a = this.storeAmount - this.amount;
      return this.name + " - " + $.sprintf(mStringtable.getValueOf("Available subjects: %d"), a)
    } else {
      if (this.resourceId == 5 || this.resourceId == 6) {
        return this.name + " - " + $.sprintf(mStringtable.getValueOf("Available: %d"), this.amount)
      } else {
        return""
      }
    }
  }
};
HabitatResource.prototype.getRoundedAmount = function() {
  if (this.resourceId == 4) {
    return parseInt(this.storeAmount - this.amount)
  } else {
    return parseInt(this.amount)
  }
};
HabitatResource.prototype.getRoundedAmountOld = function() {
  return parseInt(this.amount)
};
HabitatResource.prototype.getAvailableAmount = function() {
  var a = this.amount;
  if (typeof this.blockedAmount != "undefined") {
    a = this.amount - this.blockedAmount
  }
  return parseInt(a)
};
HabitatResource.prototype.getResourcesLeft = function() {
  var a = this.storeAmount - this.amount;
  return parseInt(a)
};
HabitatResource.prototype.getNextLevelAmount = function(a, c) {
  var b = mBuildings[a.primaryKey].generateResources[c];
  $.each(mPlayer.currentHabitat.habitatModifier, function(e, d) {
    if (d.type == MODIFIERTYPE.AMOUNTGENERATE) {
      if (jQuery.inArray("Building", d.targets) > -1) {
        b = b * d.percentage
      }
    }
  });
  return Math.round(b)
};
function Knowledge(j, d, g, f, k, e, h, b, c, a) {
  this.primaryKey = j;
  this.order = d;
  this.identifier = g;
  this.buildResources = f;
  this.buildDuration = k;
  this.buildSpeedupCost = e;
  this.volumeResource = h;
  this.volumeAmount = b;
  this.modifier = c;
  this.requiredKnowledges = a
}
function Knowledge(a) {
  this.primaryKey = getValueFromJSON(a.primaryKey);
  this.order = getValueFromJSON(a.order);
  this.identifier = getValueFromJSON(a.identifier);
  this.buildResources = makeKeyValueArrayFromJSON(a.buildResourceDictionary);
  this.buildDuration = getValueFromJSON(a.buildDuration);
  this.buildSpeedupCost = getValueFromJSON(a.buildSpeedupCost);
  this.volumeResource = getValueFromJSON(a.volumeResource);
  this.volumeAmount = getValueFromJSON(a.volumeAmount);
  this.modifier = makePointerArray(a.modifierArray, mModifiers, false);
  this.requiredKnowledges = null;
  if (a.requiredKnowledgeArray) {
    this.requiredKnowledges = makeValueArrayFromJSON(a.requiredKnowledgeArray)
  }
}
Knowledge.prototype.getDescription = function() {
  return mStringtable.getValueOf("BKServerKnowledge-" + this.data.primaryKey)
};
Knowledge.prototype.getCssName = function() {
  return this.identifier.replace(" ", "").toLowerCase()
};
Knowledge.prototype.getEnabled = function() {
  var a;
  if (this instanceof Knowledge) {
    a = this
  } else {
    a = this.data
  }
  var b = new Array();
  $.each(mBuildings, function(d, c) {
    if (c.requiredKnowledges) {
      $.each(c.requiredKnowledges, function(e, f) {
        if (f.primaryKey == a.primaryKey) {
          b.push(c)
        }
      })
    }
  });
  $.each(mUnits, function(d, c) {
    if (c.requiredKnowledges) {
      $.each(c.requiredKnowledges, function(e, f) {
        if (f.primaryKey == a.primaryKey) {
          b.push(c)
        }
      })
    }
  });
  $.each(mKnowledges, function(d, c) {
    if (c.requiredKnowledges) {
      $.each(c.requiredKnowledges, function(e, f) {
        if (mKnowledges[f].primaryKey == a.primaryKey) {
          b.push(c)
        }
      })
    }
  });
  if (a.modifier) {
    $.each(a.modifier, function(d, c) {
      b.push(c)
    })
  }
  return b
};
Knowledge.prototype.isExplorable = function(b) {
  if (!b) {
    b = mPlayer.currentHabitat
  }
  var a = true;
  $.each(this.buildResources, function(d, c) {
    if (c > b.habitatResources[d].getAvailableAmount()) {
      a = false;
      return(false)
    }
  });
  if (this.volumeResource) {
    if (this.volumeAmount > (b.habitatResources[this.volumeResource].storeAmount - b.habitatResources[this.volumeResource].getAvailableAmount())) {
      a = false;
      return(false)
    }
  }
  if (this.requiredKnowledges) {
    $.each(this.requiredKnowledges, function(c, d) {
      if (b.isKnowledgeResearched(mKnowledges[d]) == false) {
        a = false;
        return(false)
      }
    })
  }
  return a
};
Knowledge.prototype.getImageSrc = function() {
  var a;
  if (this instanceof Knowledge) {
    a = this
  } else {
    a = this.data
  }
  return mPath_Images + mDir_Knowledges + a.identifier + "Icon.png"
};
Knowledge.prototype.getTranslatedIdentifier = function() {
  return mStringtable.getValueOf(this.data.identifier)
};
Knowledge.prototype.research = function(b) {
  if (!b) {
    b = mPlayer.currentHabitat
  }
  blockUI("HabitatAction/researchKnowledge");
  var a = {};
  a.primaryKey = this.primaryKey;
  a.habitatID = b.id;
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("HabitatAction/researchKnowledge", a, "Session.updateCallback")
};
function event_knowledge_speedup(c) {
  var b = c[0];
  var d = c[1];
  blockUI("HabitatAction/speedupKnowledgeResearch");
  var a = {};
  a.primaryKey = b;
  a.habitatID = d;
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("HabitatAction/speedupKnowledgeResearch", a, "Session.updateCallback")
}
Knowledge.prototype.speedup = function(d) {
  var c = this.primaryKey;
  if (!d) {
    d = mPlayer.currentHabitat
  }
  var e = d.id;
  var a = mStringtable.getValueOf("Gold");
  var b = new Array();
  b.push(c);
  b.push(e);
  showPapyrusMsgBox($.sprintf(mStringtable.getValueOf("Research time reduction for %@ costs %d %@. You have %d %@."), mStringtable.getValueOf(this.identifier), this.buildSpeedupCost, a, mPlayer.gold, a), mStringtable.getValueOf("Speedup research"), event_knowledge_speedup, b, true)
};
function event_knowledge_finish(c) {
  var b = c[0];
  var d = c[1];
  blockUI("HabitatAction/finishKnowledgeResearch");
  var a = {};
  a.primaryKey = b;
  a.habitatID = d;
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("HabitatAction/finishKnowledgeResearch", a, "Session.updateCallback")
}
Knowledge.prototype.finish = function(d) {
  var c = this.primaryKey;
  if (!d) {
    d = mPlayer.currentHabitat
  }
  var a = mStringtable.getValueOf("Gold");
  var b = new Array();
  b.push(c);
  b.push(d.id);
  showPapyrusMsgBox($.sprintf(mStringtable.getValueOf("Finishing the research (%@) instantly costs %d %@. You have %d %@."), mStringtable.getValueOf(this.identifier), this.buildSpeedupCost, a, mPlayer.gold, a), mStringtable.getValueOf("Finish research"), event_knowledge_finish, b, true)
};
Knowledge.prototype.getDurationString = function() {
  return secToTimeStr(this.data.buildDuration)
};
function KnowledgeOrder(b, a) {
  this.habitatId = b;
  this.knowledge = mKnowledges[getValueFromJSON(a.knowledgeId)];
  this.complete = jsonDateToDate(getValueFromJSON(a.complete));
  this.durationFactor = getValueFromJSON(a.durationFactor);
  this.durationInSeconds = getValueFromJSON(a.durationInSeconds)
}
KnowledgeOrder.prototype.isSpeededup = function() {
  if (this.durationFactor == 0.5) {
    return true
  } else {
    return false
  }
};
KnowledgeOrder.prototype.isHalfDurationReached = function() {
  var b = (this.complete - (new Date() - mTimeDifferenceToServer)) / 1000;
  var c = this.durationInSeconds;
  var a = b - c;
  if (a < 0) {
    a = 0
  }
  if (b < ((c / 2) + a)) {
    return true
  } else {
    return false
  }
};
KnowledgeOrder.prototype.updateTimeToComplete = function() {
  var a = this.complete - (new Date() - mTimeDifferenceToServer);
  if (a >= 0) {
    $("span#knowledgeResearch_" + this.knowledge.primaryKey).html(secToTimeStr(Math.round(a / (1000))) + " - " + formatDateTime(this.complete))
  } else {
    mSession.addJob(SESSIONJOBTYPE.KNOWLEDGEORDER);
    mPlayer.habitate[this.habitatId].deleteKnowledgeOrderFormList(this.knowledge.primaryKey)
  }
};
function MarketRate(b, a) {
  this.resourceID = b;
  this.rates = a
}
function MessagesView(b, a) {
  this.discussionId = 0;
  this.newMessageMode = false;
  this.massMailMode = false;
  this.answerMode = false;
  this.messageDestination = null;
  this.discussionEntryArray;
  this.fromView = -1;
  this.currentScrollValue = 0;
  this.messageEntryScrollValue = 0;
  this.recieverForMassMail = b;
  this.recieverNames = a;
  this.selectedMessageNumber = 0
}
MessagesView.prototype.addViewToStack = function() {
  var a = new StackItem();
  a.itemType = ITEMTYPE.MESSAGES_VIEW_ITEM;
  a.functionname = mMessagesView.loadDiscussionTitles;
  a.objectID = mMessagesView.discussionId;
  mBottomBar.addToStack(a)
};
MessagesView.prototype.validateTitle = function(b) {
  var a = true;
  if (b == null) {
    showPapyrusMsgBox(mStringtable.getValueOf("Content or subject are not defined."), false);
    a = false
  } else {
    if (b.length == 0) {
      showPapyrusMsgBox(mStringtable.getValueOf("Content or subject are not defined."), false);
      a = false
    } else {
      if (b.length > mSettings.maxDiscussionTitleLength) {
        showPapyrusMsgBox(mStringtable.getValueOf("Subject is too long."), false);
        a = false
      }
    }
  }
  return a
};
MessagesView.prototype.validateMessageContent = function(b) {
  var a = true;
  if (b == null) {
    showPapyrusMsgBox(mStringtable.getValueOf("You are not allowed to send empty messages."), false);
    a = false
  } else {
    if (b.length == 0) {
      showPapyrusMsgBox(mStringtable.getValueOf("You are not allowed to send empty messages."), false);
      a = false
    } else {
      if (b.length > mSettings.maxDiscussionEntryContentLength) {
        showPapyrusMsgBox(mStringtable.getValueOf("Message content is too long."), false);
        a = false
      }
    }
  }
  return a
};
MessagesView.prototype.loadDiscussionTitles = function() {
  var a = {};
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("DiscussionAction/discussionTitleArray", a, "mMessagesView.discussionTitleCallback")
};
MessagesView.prototype.discussionTitleCallback = function(c) {
  if (c.error) {
    if (c.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(c.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(c.error))
    }
  } else {
    mPlayer.resetCurrentItems(mPlayer.messageItems);
    var a = new Array();
    if (c.discussionTitleArray) {
      $.each(c.discussionTitleArray, function(h, j) {
        var g = {};
        if (j.discussionMemberArray) {
          $.each(j.discussionMemberArray, function(k, d) {
            g[d.id] = new Player(d)
          })
        }
        if (j.discussionListenerArray) {
          var f = {};
          $.each(j.discussionListenerArray, function(k, d) {
            f[k] = g[k]
          })
        }
        var e = new DiscussionEntry(j.lastEntryDate, g[j.lastEntryDate.playerId]);
        a.push(new Discussion(j.id, j.title, jsonDateToDate(j.lastReadDate), jsonDateToDate(j.lastEntryDate), e, g, f))
      });
      if (c.systemMessageTitleArray) {
        $.each(c.systemMessageTitleArray, function(h, j) {
          var g = {};
          if (j.discussionMemberArray) {
            $.each(j.discussionMemberArray, function(k, d) {
              g[d.id] = new Player(d)
            })
          }
          if (j.discussionListenerArray) {
            var f = {};
            $.each(j.discussionListenerArray, function(k, d) {
              f[k] = g[k]
            })
          }
          var e = new DiscussionEntry(j.lastEntryDate, g[j.lastEntryDate.playerId]);
          j.id = "-" + j.id;
          a.push(new Discussion(j.id, j.title, jsonDateToDate(j.lastReadDate), jsonDateToDate(j.lastEntryDate), e, g, f))
        })
      }
      a.sort(function(e, d) {
        if (e.lastEntryDate > d.lastEntryDate) {
          return -1
        } else {
          return +1
        }
      })
    }
    mPlayer.setDiscussions(a);
    $.tmpl("messagesViewTmpl", mPlayer).appendTo($("div.viewport").empty());
    setPapyrusBackgroundForRightSide();
    setHover("div.messagesview");
    windowSize();
    if (mMessagesView.newMessageMode == true || mMessagesView.massMailMode == true) {
      $("div#discussionentrylist").hide();
      $("div#discussionentryform").hide();
      $("div.discussionside").find("span.habitatListItemTitle").html(mStringtable.getValueOf("New Message"));
      $("div#newMessageForm").show();
      if (mMessagesView.massMailMode == true) {
        $(".contentheader").html(mStringtable.getValueOf("Send mass mail"));
        $("#receiverNewMail").html(mMessagesView.recieverNames)
      } else {
        $(".contentheader").html(mStringtable.getValueOf("Send Message"));
        $("#receiverNewMail").html(mMessagesView.messageDestination.nick)
      }
      mMessagesView.addViewToStack()
    } else {
      if (mMessagesView.answerMode == true) {
        mMessagesView.loadDiscussion()
      } else {
        $("div#discussionentrylist").show();
        $("div#discussionentryform").hide();
        $("div#newMessageForm").hide();
        if (a.length > 0) {
          if (mMessagesView.discussionId == 0) {
            mMessagesView.discussionId = a[0].id;
            if (mPlayer.discussions[0].previouslyRead == false) {
              mPlayer.discussions[0].previouslyRead = true;
              $("div.messagePicture:first").removeClass("unread").addClass("read");
              $("table.messageSelect:first").removeClass("notSelected").addClass("isSelected");
              mMessagesView.decreaseUnreadMessageCount()
            }
          }
          mMessagesView.loadDiscussion();
          if (mMessagesView.selectedMessageNumber == 0) {
            $("table.messageSelect:first").removeClass("notSelected").addClass("isSelected")
          } else {
            $("#messageNumber_" + mMessagesView.selectedMessageNumber).find("table.messageSelect").removeClass("notSelected");
            $("#messageNumber_" + mMessagesView.selectedMessageNumber).find("table.messageSelect").addClass("isSelected")
          }
        } else {
          unblockUI()
        }
      }
    }
    $("a.discussiontitlelink").click(function() {
      mMessagesView.discussionId = $(this).metadata().discussionId;
      var d = mPlayer.findMessage($(this).metadata().discussionId);
      if (d.previouslyRead == false) {
        d.previouslyRead = true;
        $(this).find("div.messagePicture").removeClass("unread").addClass("read");
        mMessagesView.decreaseUnreadMessageCount()
      }
      mMessagesView.loadDiscussion()
    });
    $("table.messageSelect").click(function() {
      mMessagesView.selectedMessageNumber = $(this).metadata().selectedMessageIndex;
      $("#messageNumber_" + $(this).metadata().selectedMessageIndex).find("table.messageSelect").each(function(d) {
        if ($("table.messageSelect").hasClass("isSelected")) {
          $("table.messageSelect").removeClass("isSelected");
          $("table.messageSelect").addClass("notSelected")
        }
        $(this).addClass("isSelected")
      })
    });
    $("#prevDiscussions").click(function() {
      mPlayer.prevPage(mPlayer.discussions.length);
      $("#discussionNumbers").text(mPlayer.currentItems.start + 1 + " - " + mPlayer.currentItems.end + " / " + mPlayer.discussions.length);
      mBottomBar.callLastView();
      return false
    });
    $("#nextDiscussions").click(function() {
      mPlayer.nextPage(mPlayer.discussions.length);
      $("#discussionNumbers").text(mPlayer.currentItems.start + 1 + " - " + mPlayer.currentItems.end + " / " + mPlayer.discussions.length);
      mBottomBar.callLastView();
      return false
    });
    $("div#deleteselecteddiscussions").click(function() {
      tempString = "(";
      $("table.discussion input:checked").each(function() {
        tempString += (($(this).metadata().discussionId) + ",");
        if (!mPlayer.findMessage($(this).metadata().discussionId).previouslyRead) {
          mMessagesView.decreaseUnreadMessageCount()
        }
      });
      tempString = tempString.substring(0, tempString.length - 1);
      tempString += ")";
      var d = tempString.replace(/-/gi, "");
      if (tempString != ")") {
        $("#ui-dialog-title-dialog-confirm").text(mStringtable.getValueOf("Really delete selection?"));
        $("#dialog-confirm").attr("title", mStringtable.getValueOf("Really delete selection?"));
        $("#dialog-confirm > p").html(mStringtable.getValueOf("Really delete selection?"));
        $("#dialog:ui-dialog").dialog("destroy");
        $("#dialog-confirm").dialog({resizable: false, width: 375, modal: true, draggable: false, buttons: [{text: mStringtable.getValueOf("cancel"), click: function() {
                $(this).dialog("close")
              }}, {text: mStringtable.getValueOf("ok"), click: function() {
                $(this).dialog("close");
                mMessagesView.currentScrollValue = $("div.messageEntryBoxLeft").scrollTop();
                blockUI("DiscussionAction/discussion");
                var e = {};
                e.discussionIdArray = d;
                e.PropertyListVersion = propertyListVersion;
                e[mPlayer.userIdentifier] = mPlayer.getHash();
                genericAjaxRequest("MessageAction/releaseFromMessageArray", e, "mMessagesView.discussionTitleCallback");
                mMessagesView.discussionId = 0
              }}]})
      } else {
        showPapyrusMsgBox(mStringtable.getValueOf("No element selected."), false, false, false, false)
      }
    });
    $("input#selectAllMessages").click(function() {
      if (($(this).is(":checked"))) {
        $("table.discussion tr:visible input").each(function() {
          $(this).attr("checked", "checked");
          $(".CheckBoxClass").change()
        })
      } else {
        $("table.discussion tr:visible input").each(function() {
          $(this).attr("checked", false);
          $(".CheckBoxClass").change()
        })
      }
    });
    $(".CheckBoxClass").change(function() {
      if ($(this).is(":checked")) {
        $(this).next("label").addClass("LabelSelected");
        $(this).next("label").find(".fakeCheckBox").attr("src", "../pictures/Icons/TransitAttack.png")
      } else {
        $(this).next("label").removeClass("LabelSelected");
        $(this).next("label").find(".fakeCheckBox").attr("src", "../pictures/Icons/Search.png")
      }
    });
    $("div#deletediscussion").click(function() {
      mMessagesView.currentScrollValue = $("div.messageEntryBoxLeft").scrollTop();
      blockUI("DiscussionAction/discussion");
      var d = {};
      d.discussionId = mMessagesView.discussionId;
      d.PropertyListVersion = propertyListVersion;
      d[mPlayer.userIdentifier] = mPlayer.getHash();
      genericAjaxRequest("DiscussionAction/releaseFromDiscussionV2", d, "mMessagesView.deleteDiscussionCallback");
      mMessagesView.discussionId = 0
    });
    $("div#paste_link_discussion").click(function() {
      var d = buffer_links.get_link(), e = "";
      if (d == null) {
        return
      }
      if ($("#newMessageContent").is(":visible")) {
        e = $("#newMessageContent").val() + " " + d;
        $("#newMessageContent").val(e)
      } else {
        e = $("#content").val() + " " + d;
        $("#content").val(e)
      }
    });
    $("div#answerdiscussion").click(function() {
      $("div#discussionentrylist").hide();
      $("div#discussionentryform").show();
      $("div#newMessageForm").hide();
      $("textarea#content").val("");
      mMessagesView.answerMode = true
    });
    $("div#cancelAddDiscussion").click(function() {
      $("div#discussionentrylist").show();
      $("div#discussionentryform").hide();
      $("div#newMessageForm").hide();
      mMessagesView.answerMode = false
    });
    $("div#addDiscussion").click(function() {
      var e = $("textarea#content").val();
      mMessagesView.answerMode = false;
      if (mMessagesView.validateMessageContent(e)) {
        blockUI("Loading...");
        var d = {};
        d.discussionId = $("input#discussionId").val();
        d.content = e;
        d.PropertyListVersion = propertyListVersion;
        d[mPlayer.userIdentifier] = mPlayer.getHash();
        genericAjaxRequest("DiscussionAction/addDiscussionEntry", d, "mMessagesView.addDiscussionCallback")
      }
    });
    $("div#cancelnewMessage").click(function() {
      mMessagesView.newMessageMode = false;
      mBottomBar.stackArray[mBottomBar.selectedIndex].pop();
      selectButton(mMessagesView.fromView, ITEMTYPE.PROFILE_VIEW_ITEM);
      if (mMessagesView.fromView == 4) {
        openMap()
      } else {
        mBottomBar.callLastView()
      }
    });
    $("div#sendnewMessage").click(function() {
      var f = $("textarea#newMessageContent").val();
      var d = $("input.newSubject").val();
      if (mMessagesView.validateMessageContent(f) && mMessagesView.validateTitle(d)) {
        if (mMessagesView.massMailMode && mMessagesView.recieverForMassMail == "all" && (typeof mMessagesView.recieverNames != "undefined")) {
          blockUI("Loading...");
          var e = {};
          e.subject = d;
          e.content = f;
          e.PropertyListVersion = propertyListVersion;
          e[mPlayer.userIdentifier] = mPlayer.getHash();
          genericAjaxRequest("AllianceAction/massMail", e, "mMessagesView.createDiscussionCallback");
          mMessagesView.recieverForMassMail = ""
        } else {
          if (mMessagesView.massMailMode && (typeof mMessagesView.recieverForMassMail != "undefined")) {
            blockUI("Loading...");
            var e = {};
            e.receivingPlayerArray = mMessagesView.recieverForMassMail;
            e.subject = d;
            e.content = f;
            e.PropertyListVersion = propertyListVersion;
            e[mPlayer.userIdentifier] = mPlayer.getHash();
            genericAjaxRequest("DiscussionAction/createDiscussion", e, "mMessagesView.createDiscussionCallback")
          } else {
            var g = mMessagesView.messageDestination.id;
            blockUI("Loading...");
            var e = {};
            e.receivingPlayerArray = g;
            e.subject = d;
            e.content = f;
            e.PropertyListVersion = propertyListVersion;
            e[mPlayer.userIdentifier] = mPlayer.getHash();
            genericAjaxRequest("DiscussionAction/createDiscussion", e, "mMessagesView.createDiscussionCallback")
          }
        }
      }
    });
    var b = "";
    $("textarea#newMessageContent").keyup(function() {
      b = $(this).val().length - 1;
      b++;
      if (b <= mSettings.maxDiscussionEntryContentLength) {
        $("span#newMessageContentLength").text(b);
        $("div.messageContentLengthCounter").css("color", "black");
        $("#sendnewMessage").show()
      } else {
        $("div.messageContentLengthCounter").css("color", "red");
        $("#sendnewMessage").hide()
      }
    });
    $("textarea#newMessageContent").keypress(function() {
      if (b >= mSettings.maxDiscussionEntryContentLength) {
        $("div.messageContentLengthCounter").css("color", "red");
        return false
      }
    });
    messageTitleInput = "";
    $("input.newSubject").keyup(function(d) {
      messageTitleInput = $(this).val().length - 1;
      messageTitleInput++;
      if (messageTitleInput <= mSettings.maxDiscussionTitleLength) {
        $("span#newMessageTitle").text(messageTitleInput)
      } else {
        return false
      }
    });
    if (mMessagesView.currentScrollValue > 0) {
      $("div.messageEntryBoxLeft").scrollTop(mMessagesView.currentScrollValue)
    } else {
      $("div.messageEntryBoxLeft").scrollTop(0)
    }
  }
};
MessagesView.prototype.decreaseUnreadMessageCount = function() {
  if (mPlayer.unreadDiscussionCount >= 1) {
    mPlayer.unreadDiscussionCount -= 1
  }
  mBottomBar.setNewCounts()
};
MessagesView.prototype.loadDiscussion = function() {
  mMessagesView.addViewToStack();
  var a = {};
  a.discussionId = mMessagesView.discussionId;
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("DiscussionAction/discussion", a, "mMessagesView.loadDiscussionCallback")
};
MessagesView.prototype.loadDiscussionCallback = function(c) {
  if (c.touchDate) {
    globalTouchDate = c.touchDate
  }
  if (c.error) {
    if (c.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(c.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(c.error))
    }
  } else {
    unblockUI();
    this.discussionId = c.discussion.id;
    $("input#discussionId").val(this.discussionId);
    $("span#receiver").html("");
    $("span#subject").html(c.discussion.title);
    $("textarea#content").val("");
    var b = {};
    if (c.discussion.discussionMemberArray) {
      $.each(c.discussion.discussionMemberArray, function(e, d) {
        $("span#receiver").html($("span#receiver").html() + new Player(d).nick + " ");
        b[d.id] = new Player(d)
      })
    }
    mMessagesView.discussionEntryArray = new Array();
    $.each(c.discussion.discussionEntryArray, function(e, f) {
      f.content = Linksmaker.process(f.content);
      mMessagesView.discussionEntryArray.push(new DiscussionEntry(f, b[f.playerId]))
    });
    mMessagesView.discussionEntryArray.sort(function(e, d) {
      if (e.creationDate < d.creationDate) {
        return -1
      } else {
        return +1
      }
    });
    $.tmpl("messagesViewEntrysTmpl", mMessagesView).appendTo($("div#discussionentrys").empty());
    if (mMessagesView.discussionEntryArray[0] && mMessagesView.discussionEntryArray[0].player) {
      $("div#answerdiscussion").show()
    } else {
      $("div#answerdiscussion").hide()
    }
    $("span.discussion_player").click(function() {
      var d = $(this).metadata().author;
      if (d != mPlayer.id) {
        openExternPlayerProfile(d)
      } else {
        openPlayerView()
      }
    });
    $(".internal_link").click(function() {
      Actionslinks.openView($(this).attr("id"))
    });
    windowSize();
    mMessagesView.messageEntryScrollValue = $("div#discussionentrylist").height();
    $("span.messageHeader").html(c.discussion.title);
    if (c.discussion.discussionListenerArray) {
      var a = "";
      $.each(c.discussion.discussionMemberArray, function(d, e) {
        if (jQuery.inArray(e.id, c.discussion.discussionListenerArray) > -1) {
          a += ", " + e.nick + " "
        }
      });
      a = a.substr(2);
      if (mPlayer.nick == a.substr(0, a.length - 1)) {
        $("span.messageMemberNicks").html(mStringtable.getValueOf("You are the only remaining member of this discussion"));
        $("div#answerdiscussion").hide()
      } else {
        $("span.messageMemberNicks").html(a);
        $("div#answerdiscussion").show()
      }
    }
    $("div#discussionentrylist").show();
    $("div#newMessageForm").hide();
    $("div#discussionentryform").hide();
    if (mMessagesView.answerMode == true) {
      $("div#discussionentrylist").hide();
      $("div#discussionentryform").show();
      $("div#newMessageForm").hide();
      $("textarea#content").val("")
    }
    $("div.messageEntryBox").scrollTop(mMessagesView.messageEntryScrollValue);
    messageInput = "";
    $("textarea#content").keyup(function(d) {
      messageInput = $(this).val().length - 1;
      messageInput++;
      if (messageInput <= mSettings.maxDiscussionEntryContentLength) {
        $("span#messageContentLength").text(messageInput);
        $("div.messageContentLengthCounter").css("color", "black");
        $("#addDiscussion").show()
      } else {
        $("div.messageContentLengthCounter").css("color", "red");
        $("#addDiscussion").hide();
        return false
      }
    })
  }
};
MessagesView.prototype.addDiscussionCallback = function(a) {
  if (a.touchDate) {
    globalTouchDate = a.touchDate
  }
  if (a.error) {
    if (a.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error))
    }
  } else {
    mMessagesView.loadDiscussion(a.discussion.id)
  }
};
MessagesView.prototype.createDiscussionCallback = function(a) {
  if (a.touchDate) {
    globalTouchDate = a.touchDate
  }
  unblockUI();
  if (a.error) {
    if (a.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false)
    }
  } else {
    mMessagesView.newMessageMode = false;
    mMessagesView.massMailMode = false;
    mBottomBar.stackArray[mBottomBar.selectedIndex].pop();
    selectButton(mMessagesView.fromView, ITEMTYPE.PROFILE_VIEW_ITEM);
    mMessagesView.loadDiscussionTitles();
    mBottomBar.callLastView()
  }
};
MessagesView.prototype.deleteDiscussionCallback = function(a) {
  if (a.touchDate) {
    globalTouchDate = a.touchDate
  }
  if (a.error) {
    if (a.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error))
    }
  } else {
    mMessagesView.loadDiscussionTitles()
  }
};
function Mission(k, b, h, e, d, c, a, f, g, j, l) {
  this.primaryKey = k;
  this.order = b;
  this.identifier = h;
  this.buildSpeedupCost = e;
  this.duration = d;
  this.unitProductions = c;
  this.unitProductionVariance = a;
  this.unitConsumptions = f;
  this.resourceProductions = g;
  this.resourceProductionVariance = j;
  this.resourceConsumptions = l
}
function Mission(a) {
  this.primaryKey = getValueFromJSON(a.primaryKey);
  this.order = getValueFromJSON(a.order);
  this.identifier = getValueFromJSON(a.identifier);
  this.buildSpeedupCost = getValueFromJSON(a.buildSpeedupCost);
  this.duration = getValueFromJSON(a.duration);
  this.unitProductions = makeKeyValueArrayFromJSON(a.unitProduction);
  this.unitProductionVariance = getValueFromJSON(a.unitProductionVariance);
  this.unitConsumptions = makeKeyValueArrayFromJSON(a.unitConsumption);
  this.resourceProductions = makeKeyValueArrayFromJSON(a.resourceProduction);
  this.resourceProductionVariance = getValueFromJSON(a.resourceProductionVariance);
  this.resourceConsumptions = makeKeyValueArrayFromJSON(a.resourceConsumption)
}
Mission.prototype.getResourceProduction = function(a) {
  return Math.round(this.data.resourceProductions[a] * this.data.resourceProductionVariance)
};
Mission.prototype.getUnitProduction = function(a) {
  return Math.round(this.data.unitProductions[a] * this.data.unitProductionVariance)
};
Mission.prototype.getDescription = function() {
  return mStringtable.getValueOf("BKServerMission-" + this.data.primaryKey)
};
Mission.prototype.isMissionPossible = function(b) {
  var c = mPlayer.habitate[b] || mPlayer.currentHabitat;
  var a = true;
  var d = this.unitConsumptions;
  if (c.getHabitatMission(this.primaryKey) != null) {
    a = false
  } else {
    if (this.resourceConsumptions) {
      $.each(this.resourceConsumptions, function(e, f) {
        if (c.habitatResources[e].amount < f) {
          a = false
        }
      })
    }
    if (d) {
      $.each(c.getHabitatUnits(), function(e, f) {
        if (d[f.primaryKey]) {
          if (d[f.primaryKey] > f.count) {
            a = false
          }
        }
      })
    }
  }
  return a
};
Mission.prototype.getImageSrc = function() {
  return mPath_Images + mDir_Missions + this.data.identifier + "Icon.png"
};
Mission.prototype.getTranslatedIdentifier = function() {
  return mStringtable.getValueOf(this.data.identifier)
};
Mission.prototype.execute = function(c) {
  if (!c) {
    c = mPlayer.currentHabitat
  }
  blockUI("HabitatAction/executeMission");
  var d = globalTouchDate;
  var a = "";
  a = d.substring(0, 10) + " " + d.substring(11, 19) + " Etc/GMT";
  var b = {};
  b.habitatID = c.id;
  b.primaryKey = this.primaryKey;
  b.PropertyListVersion = propertyListVersion;
  b.touchDate = a;
  b[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("HabitatAction/executeMission", b, "Session.updateCallback")
};
function event_mission_speedup(c) {
  var b = c[0];
  var d = c[1];
  blockUI("HabitatAction/speedupMission");
  var a = {};
  a.primaryKey = b;
  a.habitatID = d;
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("HabitatAction/speedupMission", a, "Session.updateCallback")
}
function event_mission_speedup_all(b) {
  blockUI("HabitatAction/speedupMission");
  var a = {};
  a.primaryKeys = "";
  a.habitatID = b[0];
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("HabitatAction/speedupMission", a, "Session.updateCallback")
}
Mission.prototype.speedup = function(d) {
  var a = this.primaryKey;
  if (!d) {
    d = mPlayer.currentHabitat
  }
  var b = mStringtable.getValueOf("Gold");
  var c = new Array();
  c.push(a);
  c.push(d.id);
  showPapyrusMsgBox($.sprintf(mStringtable.getValueOf("Mission time reduction for %@ costs %d %@. You have %d %@."), mStringtable.getValueOf(this.identifier), this.buildSpeedupCost, b, mPlayer.gold, b), mStringtable.getValueOf("Speedup mission"), event_mission_speedup, c, true)
};
Mission.speedupAll = function() {
  var d = mPlayer.currentHabitat;
  var e = [];
  var b = 0;
  $.each(d.habitatMissions, function(f, g) {
    if (g.durationFactor == 1) {
      e.push(mStringtable.getValueOf(g.mission.identifier));
      b = b + g.mission.buildSpeedupCost
    }
  });
  e = e.join(",");
  var a = mStringtable.getValueOf("Gold");
  var c = new Array();
  c.push(d.id);
  showPapyrusMsgBox($.sprintf(mStringtable.getValueOf("Mission time reduction for %@ costs %d %@. You have %d %@."), e, b, a, mPlayer.gold, a), mStringtable.getValueOf("Speedup mission"), event_mission_speedup_all, c, true)
};
Mission.prototype.getDurationString = function() {
  return secToTimeStr(this.data.duration)
};
function Modifier(e, a, f, g, d, c, b) {
  this.primaryKey = e;
  this.order = a;
  this.identifier = f;
  this.type = g;
  this.targets = d;
  this.percentage = c;
  this.corps = b
}
function Modifier(a) {
  this.primaryKey = getValueFromJSON(a.primaryKey);
  this.order = getValueFromJSON(a.order);
  this.identifier = getValueFromJSON(a.identifier);
  this.type = getValueFromJSON(a.type);
  this.targets = makeValueArrayFromJSON(a.targetArray);
  this.percentage = getValueFromJSON(a.percentage);
  this.corps = getValueFromJSON(a.corps)
}
Modifier.prototype.getImageSrc = function() {
  var a;
  if (this instanceof Modifier) {
    a = this
  } else {
    a = this.data
  }
  return mPath_Images + "Modifiers/ModifierIcon-" + a.type + ".png"
};
function initGlobalPictureDirectories() {
  mPath_Images = "pictures/";
  mDir_Browser = "Browser/";
  mDir_Background = "Background/";
  mDir_BottomBar = "BottomBar/";
  mDir_Buttons = "Buttons/";
  mDir_CornerImages = "CornerImages/";
  mDir_Disabled = "Disabled/";
  mDir_Message = "Message/";
  mDir_Papyrus = "Papyrus/";
  mDir_Tabs = "Tabs/";
  mDir_Buildings = "Buildings/";
  mDir_Buttons = "Buttons/";
  mDir_Castle = "castle/";
  mDir_Arsenal = "Arsenal/";
  mDir_Farm = "Farm/";
  mDir_Keep = "Keep/";
  mDir_Library = "Library/";
  mDir_Lumberjack = "Lumberjack/";
  mDir_Market = "Market/";
  mDir_OreMine = "Ore Mine/";
  mDir_Quarry = "Quarry/";
  mDir_Tavern = "Tavern/";
  mDir_Wall = "Wall/";
  mDir_Diplomacy = "Diplomacy/";
  mDir_Flags = "flags/";
  mDir_Icons = "Icons/";
  mDir_Knowledges = "Knowledges/";
  mDir_Launch = "Launch/";
  mDir_Map = "Map/";
  mDir_Missions = "Missions/";
  mDir_Modifiers = "Modifiers/";
  mDir_Resources = "Resources/";
  mDir_Units = "Units/"
}
function initGlobalBackgroundImageDimensions() {
  mPapyrusSize1x = 84;
  mPapyrusSize2x = 168;
  mCornersBigBoxSize1x = 8;
  mCornersBigBoxSize2x = 16;
  mCornersSmallBoxSize1x = 5;
  mCornersSmallBoxSize2x = 10
}
function Player(b, a, l, r, h, g, j, d, f, o, n, c, m, e, k) {
  this.id = b;
  this.nick = a;
  this.loginId = l;
  this.points = r;
  this.rank = h;
  this.gold = g;
  this.creationDate = j;
  this.unreadDiscussionCount = d;
  this.unreadReportCount = 0;
  this.alliancePermission = f;
  this.habitate = o;
  this.currentHabitat = n;
  this.allianceInvitations = c;
  this.conquerResourceAmounts = m;
  this.conquestPointDictionary = conquestPointDictionary;
  this.alliance = alliance;
  this.discussions = e;
  this.reports = k;
  this.touchDate = null;
  this.userIdentifier = null
}
function Player(c) {
  this.id = getValueFromJSON(c.id);
  this.nick = getValueFromJSON(c.nick);
  this.loginId = getValueFromJSON(c.loginId);
  this.points = getValueFromJSON(c.points);
  this.rank = getValueFromJSON(c.rank);
  this.gold = getValueFromJSON(c.gold);
  this.creationDate = getValueFromJSON(c.creationDate);
  this.unreadDiscussionCount = getValueFromJSON(c.unreadDiscussionCount);
  this.unreadReportCount = getValueFromJSON(c.unreadReportCount);
  this.lastReadForumDate = jsonDateToDate(c.lastReadForumDate);
  this.lastReadReportDate = jsonDateToDate(c.lastReadReportDate);
  this.alliancePermission = getValueFromJSON(c.alliancePermission);
  this.isOnVacation = getValueFromJSON(c.isOnVacation);
  this.remainingVacationHours = getValueFromJSON(c.remainingVacationHours);
  this.vacationStartDate = getValueFromJSON(c.vacationStartDate);
  this.habitatIsAttacked = 0;
  this.touchDate = getValueFromJSON(c.touchDate);
  this.userIdentifier = getValueFromJSON(c.id);
  this.conquestPointDictionary = getValueFromJSON(c.conquestPointDictionary);
  this.reportSetup = getValueFromJSON(c.reportSetup);
  this.habitate = null;
  this.curHabitatID = 0;
  if (this.nick.indexOf("'") > -1) {
    this.nick = this.nick.replace(/'/g, "`")
  }
  if (c.habitatDictionary) {
    var a = {};
    $.each(c.habitatDictionary, function(d, e) {
      a[e.id] = new Habitat(e)
    });
    this.habitate = a
  }
  this.currentHabitat = null;
  this.allianceInvitations = null;
  if (c.allianceInvitationArray) {
    var b = new Array();
    $.each(c.allianceInvitationArray, function(d, e) {
      b.push(new Alliance(e))
    });
    this.allianceInvitations = b
  }
  this.conquerResourceAmounts = makeKeyValueArrayFromJSON(c.conquerResourceAmountArray);
  this.unreadAllianceMessages = 0;
  this.alliance = null;
  if (c.alliance) {
    this.alliance = new Alliance(c.alliance);
    this.unreadAllianceMessages = this.alliance.getUnreadThreadsCount(this.lastReadForumDate)
  }
  this.discussions = new Array();
  this.reports = new Array();
  this.currentReports = {start: 0, end: 100, elements: 100};
  this.currentItems = {start: 0, end: 0, elements: 0};
  this.forumThreadItems = {start: 0, end: 10, elements: 10};
  this.memberItems = {start: 0, end: 50, elements: 50};
  this.allianceReportsItems = {start: 0, end: 50, elements: 50};
  this.forumThreadItemPosts = {start: 0, end: 50, elements: 50};
  this.messageItems = {start: 0, end: 30, elements: 30}
}
Player.prototype.updateData = function(b) {
  var j = this;
  if (b != undefined && b != null) {
    this.points = getValueFromJSON(b.points);
    this.rank = getValueFromJSON(b.rank);
    this.gold = getValueFromJSON(b.gold);
    this.unreadDiscussionCount = getValueFromJSON(b.unreadDiscussionCount);
    this.unreadReportCount = getValueFromJSON(b.unreadReportCount);
    this.lastReadForumDate = jsonDateToDate(b.lastReadForumDate);
    this.lastReadReportDate = jsonDateToDate(b.lastReadReportDate);
    this.alliancePermission = getValueFromJSON(b.alliancePermission);
    this.isOnVacation = getValueFromJSON(b.isOnVacation);
    this.remainingVacationHours = getValueFromJSON(b.remainingVacationHours);
    this.vacationStartDate = getValueFromJSON(b.vacationStartDate);
    this.conquestPointDictionary = getValueFromJSON(b.conquestPointDictionary);
    this.touchDate = getValueFromJSON(b.touchDate);
    this.userIdentifier = getValueFromJSON(b.id);
    this.reportSetup = getValueFromJSON(b.reportSetup)
  } else {
    return false
  }
  this.habitate = null;
  if (b.habitatDictionary) {
    var e = {};
    $.each(b.habitatDictionary, function(l, m) {
      e[m.id] = new Habitat(m)
    });
    this.habitate = e
  }
  if (Object.size(this.habitate) == 0) {
    mCurrentActionBlocked = false;
    this.createNewHabitate()
  }
  this.allianceInvitations = null;
  if (b.allianceInvitationArray) {
    var k = new Array();
    $.each(b.allianceInvitationArray, function(l, m) {
      k.push(new Alliance(m))
    });
    this.allianceInvitations = k
  }
  if (this.alliance != null) {
    this.alliance.diplomacyToArray = getValueFromJSON(b.alliance.diplomacyToArray);
    mPlayer.alliance.diplomacyToArray = this.alliance.diplomacyToArray;
    this.alliance.invitedPlayerArray = null;
    if (b.alliance.invitedPlayerArray) {
      var c = new Array();
      $.each(b.alliance.invitedPlayerArray, function(l, m) {
        c.push(m)
      });
      c.sort(function(m, l) {
        if (m.points > l.points) {
          return -1
        } else {
          return +1
        }
      });
      this.alliance.invitedPlayerArray = c
    }
  }
  this.conquerResourceAmounts = makeKeyValueArrayFromJSON(b.conquerResourceAmountArray);
  if (b.alliance) {
    if (this.alliance != null) {
      unreadMessagesArray = new Array();
      if (mPlayer.unreadAllianceMessages > 0) {
        $.each(mPlayer.alliance.forumThreadArray, function(l, m) {
          if (m.read == false) {
            unreadMessagesArray.push(m.id)
          }
        })
      }
      if (b.alliance.forumThreadArray) {
        var g = new Array();
        $.each(b.alliance.forumThreadArray, function(l, m) {
          g.push(new ForumThread(m))
        });
        g.sort(function(m, l) {
          if (m.lastMessageDate > l.lastMessageDate) {
            return -1
          } else {
            return +1
          }
        });
        mPlayer.alliance.forumThreadArray = g
      }
      var h = 0;
      var d = new Date();
      d = jsonDateToDate(b.lastReadForumDate);
      if (mPlayer.alliance.forumThreadArray) {
        $.each(mPlayer.alliance.forumThreadArray, function(l, m) {
          if (d < m.lastMessageDate) {
            h++;
            m.read = false
          }
        })
      }
      if (unreadMessagesArray.length > 0) {
        $.each(mPlayer.alliance.forumThreadArray, function(l, m) {
          $.each(unreadMessagesArray, function(o, n) {
            if (m.id == n) {
              m.read = false
            }
          })
        })
      }
      if (mPlayer.unreadAllianceMessages > 0 && h == 0) {
        h += mPlayer.unreadAllianceMessages
      }
      this.unreadAllianceMessages = h
    } else {
      this.alliance = new Alliance(b.alliance)
    }
    if (this.alliance == null && typeof b.alliance.forumThreadArray != "undefined") {
      this.unreadAllianceMessages = b.alliance.forumThreadArray.length
    }
  } else {
    this.alliance = null
  }
  if (str_mCurrentAction == "openMap") {
    mCurrentActionBlocked == false
  }
  var f = 0;
  mPlayer.habitatIsAttacked = 0;
  var a = new Array();
  $.each(mPlayer.habitate, function(l, m) {
    $.each(m.habitatTransits, function(o, n) {
      if (n.transitType == 2 && mPlayer.isOwnHabitat(n.destinationHabitat.id)) {
        a.push(n.destinationHabitat.id)
      }
    })
  });
  if (!Array.prototype.indexOf) {
    $.each(mPlayer.habitate, function(l, m) {
      if (a.indexOfExtra(l) > -1) {
        mPlayer.habitatIsAttacked++
      }
    })
  } else {
    $.each(mPlayer.habitate, function(l, m) {
      if (a.indexOf(l) > -1) {
        mPlayer.habitatIsAttacked++
      }
    })
  }
  this.currentHabitat = this.habitate[this.curHabitatID];
  mBottomBar.setNewCounts()
};
Player.prototype.updateAllianceData = function(b) {
  var a = this;
  if (b) {
    a.alliance = new Alliance(b)
  }
};
Player.prototype.isLeaderOfAlliance = function() {
  var a = false;
  if ((alliancePermission & ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_DISBAND_ALLIANCE) || alliancePermission == -1) {
    a = true
  }
  return a
};
Player.prototype.isLeaderOfAlliance = function() {
  var a = false;
  var b;
  if (this instanceof Player) {
    b = this
  } else {
    b = this.data
  }
  if ((b.alliancePermission & ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_DISBAND_ALLIANCE) || b.alliancePermission == -1) {
    a = true
  }
  return a
};
Player.prototype.addHabitat = function(b, a) {
  if (this.habitate == null) {
    this.habitate = {}
  }
  this.habitate[b] = a
};
Player.prototype.getSortedHabitate = function() {
  var a = new Array();
  $.each(mPlayer.habitate, function(b, c) {
    a.push(c)
  });
  if (a.length > 1) {
    a.sort(function(d, c) {
      if (d.name.toLowerCase() < c.name.toLowerCase()) {
        return -1
      } else {
        return +1
      }
    })
  }
  return a
};
Player.prototype.getSortedHabitateExternPlayer = function() {
  var b = this.data.habitate;
  var a = new Array();
  $.each(b, function(c, d) {
    a.push(d)
  });
  if (a.length > 1) {
    a.sort(function(d, c) {
      if (d.name.toLowerCase() < c.name.toLowerCase()) {
        return -1
      } else {
        return +1
      }
    })
  }
  return a
};
Player.prototype.setCurrentHabitat = function(b) {
  var a = mPlayer.getSortedHabitate();
  this.currentHabitat = a[b];
  this.curHabitatID = this.currentHabitat.id
};
Player.prototype.setDiscussions = function(a) {
  this.discussions = a
};
Player.prototype.setReports = function(a) {
  this.reports = a
};
Player.prototype.findHabitatById = function(b) {
  var a = null;
  $.each(this.habitate, function(c, d) {
    if (d.id == b) {
      a = d
    }
  });
  return a
};
Player.prototype.findHabitatTransitsByHabitatId = function(a) {
  return this.findHabitatById(a).habitatTransits
};
Player.prototype.findHabitatTransitsByForeignHabitatId = function(b) {
  var a = [];
  $.each(this.habitate, function(d, e) {
    var c = e.habitatTransits;
    $.each(c, function(f, g) {
      if (g.destinationHabitat.id == b) {
        a.push(g)
      }
    })
  });
  return a
};
Player.prototype.findExternalHabitatUnitsByHabitatId = function(d, a) {
  var c = {};
  function b(e, f) {
    $.each(c, function(g, h) {
      if (h.primaryKey == e) {
        h.count = h.count + f
      }
    })
  }
  $.each(this.habitate, function(e, f) {
    $.each(f.externalHabitatUnits, function(h, g) {
      if (g.habitat.id == d && g.battleType == a) {
        if (Object.size(c) == 0) {
          c = $.extend(true, {}, g.units)
        } else {
          $.each(g.units, function(j, k) {
            if (k.count > 0) {
              b(k.primaryKey, k.count)
            }
          })
        }
      }
    })
  });
  return c
};
Player.prototype.getGroupedHabitatTransits = function() {
  var a = new Array();
  var b = {};
  $.each(this.habitate, function(c, d) {
    if (d.habitatTransits && d.habitatTransits.length > 0) {
      $.each(d.habitatTransits, function(f, e) {
        a.push(e)
      })
    }
  });
  a.sort(function(d, c) {
    if (d.destinationETA < c.destinationETA) {
      return -1
    } else {
      return +1
    }
  });
  $.each(a, function(d, c) {
    b[c.generatedTransitId] = c
  });
  return b
};
Player.prototype.getSummedAttackingUnits = function() {
  var b = [], a = [], c = [];
  $.each(this.habitate, function(d, e) {
    if (e.externalHabitatUnits && e.externalHabitatUnits.length > 0) {
      $.each(e.externalHabitatUnits, function(f, h) {
        if (h.battleType == 2) {
          if (mPlayer.conquestPointDictionary != null) {
            $.each(mPlayer.conquestPointDictionary, function(j, k) {
              if (h.habitat.id == j) {
                h.sourceHabitat.externalHabitatUnitsResources = k
              }
            })
          }
          var g = {id: h.habitat.id, habitat: h.habitat, sourceHabitat: h.sourceHabitat, units: h.units};
          b.push(g);
          if (!a.in_array(h.habitat.id)) {
            a.push(h.habitat.id)
          }
        }
      })
    }
  });
  $.each(a, function(e, l) {
    var f = [];
    var h = {};
    var k = [];
    var g = 0;
    var j = 0;
    $.each(b, function(m, n) {
      if (l == n.id) {
        f.push(n);
        h = n.habitat;
        var m = 0;
        $.each(n.units, function(o, r) {
          g = r.count;
          if (k[o] != undefined) {
            g = g + k[o]
          }
          k[o] = g;
          o++
        });
        if (n.sourceHabitat.externalHabitatUnitsResources > 0) {
          j = n.sourceHabitat.externalHabitatUnitsResources
        }
      }
    });
    var d = {habitat: h, ext: f, sunits: k, silber: j};
    c.push(d)
  });
  return c
};
Player.prototype.getGroupedAttackingUnits = function() {
  var a = new Array();
  $.each(this.habitate, function(b, c) {
    if (c.externalHabitatUnits && c.externalHabitatUnits.length > 0) {
      $.each(c.externalHabitatUnits, function(d, e) {
        if (e.battleType == 2) {
          a.push(e)
        }
      })
    }
  });
  if (mPlayer.conquestPointDictionary != null) {
    $.each(a, function(b, c) {
      $.each(mPlayer.conquestPointDictionary, function(d, e) {
        if (c.habitat.id == d) {
          c.sourceHabitat.externalHabitatUnitsResources = e
        }
      })
    })
  }
  a.sort(function(d, c) {
    if (d.habitat.id < c.habitat.id) {
      return -1
    } else {
      return +1
    }
  });
  return a
};
Player.prototype.updateHabitateResources = function() {
  $.each(this.habitate, function(a, b) {
    b.updateHabitatResources()
  });
  if (this.currentHabitat) {
    $.each(this.currentHabitat.habitatResources, function(a, b) {
      $("div." + b.getCssName() + " span.current").html(parseInt(b.amount));
      $("div." + b.getCssName() + " span.store").html(parseInt(b.storeAmount));
      $("div." + b.getCssName() + " div.graph > div").css("width", b.getPercent() + "%").css("background", b.getBgColor())
    })
  }
  $("span.goldAmount").html(this.gold)
};
Player.prototype.updateAllTimesToComplete = function() {
  $.each(this.habitate, function(a, b) {
    b.updateAllTimesToComplete()
  });
  if (this.vacationStartDate != null) {
    this.updateTimeToComplete()
  }
};
Player.prototype.updateTimeToComplete = function() {
  var b = jsonDateToDate(this.vacationStartDate);
  var a = b - (new Date() - mTimeDifferenceToServer);
  if (a >= 0) {
    $("span#vacationCountdown").html(secToTimeStr(Math.round(a / (1000))))
  } else {
    showPapyrusMsgBox(mStringtable.getValueOf("Vacation mode is already active"), false, logoutEvent, false, false)
  }
};
Player.prototype.getNoSpeedUpedUnitOrders = function() {
  var a = 0;
  $.each(this.habitate, function(c, b) {
    a += b.getNoSpeedUpedUnitOrders()
  });
  return a
};
Player.prototype.getSpeedUpedUnitOrders = function() {
  var a = 0;
  $.each(this.habitate, function(c, b) {
    a += b.getSpeedUpedUnitOrders()
  });
  return a
};
Player.prototype.getNoSpeedUpedBuildingUpgrades = function() {
  var a = 0;
  $.each(this.habitate, function(c, b) {
    a += b.getNoSpeedUpedBuildingUpgrades()
  });
  return a
};
Player.prototype.getSpeedUpedBuildingUpgrades = function() {
  var a = 0;
  $.each(this.habitate, function(b, c) {
    a += c.getSpeedUpedBuildingUpgrades()
  });
  return a
};
Player.prototype.findMessage = function(c) {
  var b = null;
  var a = this;
  $.each(a.discussions, function(e, d) {
    if (d.id == c) {
      b = d
    }
  });
  return b
};
Player.prototype.getHabitatsArray = function() {
  var a = new Array();
  $.each(this.habitate, function(c, b) {
    a.push(b)
  });
  a.sort(function(d, c) {
    if (d.name < c.name) {
      return -1
    } else {
      return +1
    }
  });
  return a
};
Player.prototype.getPermissionImage = function() {
  var a;
  if ((this.alliancePermission & ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_DISBAND_ALLIANCE) || this.alliancePermission == -1) {
    a = mPath_Images + mDir_Icons + "Permission64.png"
  } else {
    if (this.alliancePermission & ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_DIPLOMATIC_RELATIONS) {
      a = mPath_Images + mDir_Icons + "Permission16.png"
    } else {
      if (this.alliancePermission & ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_MASS_MAIL) {
        a = mPath_Images + mDir_Icons + "Permission08.png"
      } else {
        if (this.alliancePermission & ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_MODERATE_FORUM) {
          a = mPath_Images + mDir_Icons + "Permission04.png"
        } else {
          if (this.alliancePermission & ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_DISMISS_PLAYER) {
            a = mPath_Images + mDir_Icons + "Permission02.png"
          } else {
            a = mPath_Images + mDir_Icons + "Permission0.png"
          }
        }
      }
    }
  }
  return a
};
Player.prototype.getPermissionImageforPlayer = function(b) {
  var a;
  if (b == ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_DISBAND_ALLIANCE) {
    a = mPath_Images + mDir_Icons + "Permission64.png"
  } else {
    if (b == ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_PLAYER_PERMISSIONS) {
      a = mPath_Images + mDir_Icons + "Permission64.png"
    } else {
      if (b == ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_DIPLOMATIC_RELATIONS) {
        a = mPath_Images + mDir_Icons + "Permission16.png"
      } else {
        if (b == ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_MASS_MAIL) {
          a = mPath_Images + mDir_Icons + "Permission08.png"
        } else {
          if (b == ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_MODERATE_FORUM) {
            a = mPath_Images + mDir_Icons + "Permission04.png"
          } else {
            if (b == ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_DISMISS_PLAYER) {
              a = mPath_Images + mDir_Icons + "Permission02.png"
            } else {
              if (b == ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_INVITE_PLAYER) {
                a = mPath_Images + mDir_Icons + "Permission01.png"
              } else {
                a = mPath_Images + mDir_Icons + "Permission0.png"
              }
            }
          }
        }
      }
    }
  }
  return a
};
Player.prototype.getPermissionNameforPlayer = function(b) {
  var a;
  if (b == ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_DISBAND_ALLIANCE) {
    a = mStringtable.getValueOf("Disband Alliance")
  } else {
    if (b == ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_PLAYER_PERMISSIONS) {
      a = mStringtable.getValueOf("Change Permission")
    } else {
      if (b == ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_DIPLOMATIC_RELATIONS) {
        a = mStringtable.getValueOf("Diplomacy Relationship")
      } else {
        if (b == ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_MASS_MAIL) {
          a = mStringtable.getValueOf("Mass Mail")
        } else {
          if (b == ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_MODERATE_FORUM) {
            a = mStringtable.getValueOf("Moderate Forum")
          } else {
            if (b == ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_DISMISS_PLAYER) {
              a = mStringtable.getValueOf("Dismiss Player")
            } else {
              if (b == ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_INVITE_PLAYER) {
                a = mStringtable.getValueOf("Invite Player")
              } else {
                a = mStringtable.getValueOf("No permission.")
              }
            }
          }
        }
      }
    }
  }
  return a
};
Player.prototype.canInvitePlayer = function(b) {
  var a = true;
  if (!this.alliance) {
    a = false
  } else {
    if (((this.alliancePermission & ALLIANCEPERMISSIONTYPE.ALLIANCE_PERMISSION_INVITE_PLAYER) == false) && this.alliancePermission != -1) {
      a = false
    }
    if (this.alliance.invitedPlayerArray) {
      $.each(this.alliance.invitedPlayerArray, function(c, d) {
        if (d.id == b) {
          a = false
        }
      })
    }
    $.each(this.alliance.playerArray, function(c, d) {
      if (d.id == b) {
        a = false
      }
    })
  }
  return a
};
Player.prototype.changeName = function(a) {
  blockUI("ProfileAction/changeNickname");
  if (a.indexOf("'") > -1) {
    a = a.replace(/'/g, "`")
  }
  var b = {};
  b.nick = a;
  b.PropertyListVersion = propertyListVersion;
  b[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("ProfileAction/changeNickname", b, "mPlayer.changeNameCallback")
};
Player.prototype.changeNameCallback = function(a) {
  if (a.touchDate) {
    globalTouchDate = a.touchDate
  }
  if (a.error) {
    if (a.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false);
      mBottomBar.callLastView()
    }
  } else {
    if (a.possibleNickname) {
      showPapyrusMsgBox(mStringtable.getValueOf("The nickname already exists."), false);
      mBottomBar.callLastView()
    } else {
      mPlayer.nick = a.Player.nick;
      if (mPlayer.alliance) {
        $.each(mPlayer.alliance.playerArray, function(b, c) {
          if (c.id == mPlayer.id) {
            c.nick = mPlayer.nick
          }
        });
        if (mPlayer.alliance.forumThreadArray) {
          $.each(mPlayer.alliance.forumThreadArray, function(c, b) {
            if (b.owner.id == mPlayer.id) {
              b.owner.nick = mPlayer.nick
            }
          })
        }
      }
    }
  }
  unblockUI()
};
function event_allunit_speedup() {
  blockUI("HabitatAction/speedupBuildUnit");
  var a = {};
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("HabitatAction/speedupBuildAllUnitsOnEveryHabitat", a, "Session.updateCallback")
}
Player.prototype.speedupAllUnits = function() {
  var c = 0;
  var a = 0;
  $.each(this.habitate, function(d, e) {
    $.each(this.habitatUnitOrders, function(g, f) {
      if (!f.isSpeededup()) {
        c += f.orderAmount;
        a += f.orderAmount * f.unit.buildSpeedupCost
      }
    })
  });
  var b = mStringtable.getValueOf("Gold");
  showPapyrusMsgBox($.sprintf(mStringtable.getValueOf("Reducing recruition time for %d x %@ costs %d %@. You have %d %@."), c, mStringtable.getValueOf("Units"), a, b, this.gold, b), mStringtable.getValueOf("Speedup recruiting"), event_allunit_speedup, null, true)
};
function event_allunit_finish() {
  blockUI("HabitatAction/finishBuildUnit");
  var a = {};
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("HabitatAction/finishBuildAllUnitsOnEveryHabitat", a, "Session.updateCallback")
}
Player.prototype.finishAllUnits = function() {
  var c = 0;
  var a = 0;
  $.each(this.habitate, function(d, e) {
    $.each(this.habitatUnitOrders, function(g, f) {
      if (f.isSpeededup()) {
        c += f.orderAmount;
        a += f.orderAmount * f.unit.buildSpeedupCost
      }
    })
  });
  var b = mStringtable.getValueOf("Gold");
  showPapyrusMsgBox($.sprintf(mStringtable.getValueOf("Finishing recruiting %d x %@ instantly costs %d %@. You have %d %@."), c, mStringtable.getValueOf("Units"), a, b, this.gold, b), mStringtable.getValueOf("Finish recruiting"), event_allunit_finish, null, true)
};
function event_newHabitate(b) {
  mBottomBar.clearAllStacks();
  unblockUI();
  blockUI("HabitatAction/createNewHabitat");
  var a = {};
  a.id = b;
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("HabitatAction/createNewHabitat", a, "Session.updateCallback")
}
Player.prototype.createNewHabitate = function() {
  $("#ui-dialog-title-dialog-confirm").text(mStringtable.getValueOf("Error"));
  $("#dialog-confirm").attr("title", mStringtable.getValueOf("Error"));
  $("#dialog-confirm > p").html(mStringtable.getValueOf("You have no castle left. Do you want to start anew?"));
  $("#dialog:ui-dialog").dialog("destroy");
  $("#dialog-confirm").dialog({resizable: false, width: 375, modal: true, draggable: false, buttons: [{text: mStringtable.getValueOf("cancel"), click: function() {
          $(this).dialog("close");
          var a = {};
          a.PropertyListVersion = propertyListVersion;
          a[mPlayer.userIdentifier] = mPlayer.getHash();
          genericAjaxRequest("SessionAction/disconnect", a, "disconnect")
        }}, {text: mStringtable.getValueOf("ok"), click: function() {
          $(this).dialog("close");
          event_newHabitate(mPlayer.id)
        }}]})
};
Player.prototype.deleteReport = function(a) {
  $.each(mPlayer.reports, function(c, b) {
    if (a == b.id) {
      mPlayer.reports.splice(c, 1);
      return(true)
    }
  })
};
Player.prototype.isOwnHabitat = function(a) {
  var b = false;
  if (this.habitate) {
    $.each(this.habitate, function(c, d) {
      if (d.id == a) {
        b = true
      }
    })
  }
  return b
};
Player.prototype.getHabitatsAttack = function() {
  var b = [];
  var c = [];
  var d = 0;
  function a(e) {
    $.each(mPlayer.habitate, function(f, g) {
      if (e == g.id) {
        return true
      }
    });
    return false
  }
  $.each(this.habitate, function(e, f) {
    if (f.habitatTransits && f.habitatTransits.length > 0) {
      $.each(f.habitatTransits, function(h, g) {
        if (g.transitType == 2) {
          d = g.habitatId;
          if (g.destinationHabitat.id != d) {
            if (!b.in_array(g.destinationHabitat.id)) {
              b.push(g.destinationHabitat.id)
            }
          } else {
            if (!c.in_array(d)) {
              c.push(d)
            }
          }
        }
      })
    }
    if (f.externalHabitatUnits && f.externalHabitatUnits.length > 0) {
      $.each(f.externalHabitatUnits, function(g, h) {
        if (h.battleType == 2) {
          if (!a(h.habitat.id)) {
            if (!c.in_array(h.habitat.id)) {
              b.push(h.habitat.id)
            }
          }
        }
      })
    }
    if (f.getAttackingUnits() != null) {
      if (!c.in_array(f.id)) {
        c.push(f.id)
      }
    }
  });
  return{attacked: b, under_attack: c}
};
Player.prototype.getHash = function() {
  var e = globalTouchDate;
  var b = mPlayer.id;
  var c = "9FF";
  var a = "";
  if (globalTouchDate == null || globalTouchDate == "") {
    e = mPlayer.creationDate
  }
  a = e.substring(0, 10) + " " + e.substring(11, 19) + " Etc/GMT";
  var d = c + "" + b + "" + a;
  return $.sha1(d)
};
Player.prototype.resetCurrentReports = function() {
  this.currentReports.start = 0;
  this.currentReports.end = 100
};
Player.prototype.getCurrentReports = function() {
  var a = this;
  if (typeof this.data != "undefined") {
    a = this.data
  }
  return a.reports.slice(a.currentReports.start, a.currentReports.end)
};
Player.prototype.nextReportPage = function() {
  var a = this;
  if (typeof this.data != "undefined") {
    a = this.data
  }
  if ((a.currentReports.start + 100) <= a.reports.length) {
    a.currentReports.start += 100;
    a.currentReports.end += 100
  }
  if (a.currentReports.end >= (a.reports.length - 1)) {
    a.currentReports.end = a.reports.length - 1
  }
  if ((a.currentReports.start + 100) < (a.reports.length - 1)) {
    a.currentReports.end = a.currentReports.start + 100
  }
  if (a.currentReports.start <= 0) {
    a.currentReports.start = 0
  }
};
Player.prototype.prevReportPage = function() {
  var a = this;
  if (typeof this.data != "undefined") {
    a = this.data
  }
  if ((a.currentReports.start - 100) >= 0) {
    a.currentReports.start -= 100;
    a.currentReports.end -= 100
  }
  if (a.currentReports.end >= (a.reports.length - 1)) {
    a.currentReports.end = a.reports.length - 1
  }
  if ((a.currentReports.start + 100) < (a.reports.length - 1)) {
    a.currentReports.end = a.currentReports.start + 100
  }
  if (a.currentReports.start <= 0) {
    a.currentReports.start = 0
  }
};
Player.prototype.getCurrentMembers = function() {
  var a = this;
  if (typeof this.data != "undefined") {
    a = this.data
  }
  a.currentItems = a.memberItems;
  return a.alliance.playerArray.slice(a.currentItems.start, a.currentItems.end)
};
Player.prototype.getCurrentAllianceReports = function() {
  var a = this;
  if (typeof this.data != "undefined") {
    a = this.data
  }
  a.currentItems = a.allianceReportsItems;
  return a.reports.slice(a.currentItems.start, a.currentItems.end)
};
Player.prototype.getCurrentAllianceMessages = function() {
  var a = this;
  if (typeof this.data != "undefined") {
    a = this.data
  }
  a.currentItems = a.forumThreadItems;
  return a.alliance.forumThreadArray.slice(a.currentItems.start, a.currentItems.end)
};
Player.prototype.getCurrentDiscussions = function() {
  var a = this;
  if (typeof this.data != "undefined") {
    a = this.data
  }
  a.currentItems = a.messageItems;
  return a.discussions.slice(a.currentItems.start, a.currentItems.end)
};
Player.prototype.resetCurrentItems = function(a) {
  this.currentItems = a
};
Player.prototype.nextPage = function(a) {
  var b = this;
  if (typeof this.data != "undefined") {
    b = this.data
  }
  if ((b.currentItems.start + b.currentItems.elements) <= a) {
    b.currentItems.start += b.currentItems.elements;
    b.currentItems.end += b.currentItems.elements
  }
  if (b.currentItems.end >= a) {
    b.currentItems.end = a
  }
  if ((b.currentItems.start + b.currentItems.elements) < a) {
    b.currentItems.end = b.currentItems.start + b.currentItems.elements
  }
  if (b.currentItems.start <= 0) {
    b.currentItems.start = 0
  }
};
Player.prototype.prevPage = function(a) {
  var b = this;
  if (typeof this.data != "undefined") {
    b = this.data
  }
  if ((b.currentItems.start - b.currentItems.elements) >= 0) {
    b.currentItems.start -= b.currentItems.elements;
    b.currentItems.end -= b.currentItems.elements
  }
  if (b.currentItems.end >= a) {
    b.currentItems.end = a
  }
  if ((b.currentItems.start + b.currentItems.elements) <= a) {
    b.currentItems.end = b.currentItems.start + b.currentItems.elements
  }
  if (b.currentItems.start <= 0) {
    b.currentItems.start = 0
  }
};
function ProfileView() {
  this.externalProfile = false;
  this.externId;
  this.player = null;
  this.rankingEntries = new Array();
  this.showRankingEntries = new Array();
  this.currentArrayIndex = -11111;
  this.direction = 1;
  this.itemsToFetch = mSettings.maxRankingListItemsPerPage;
  this.getNext = 1;
  this.isArrayEmpty = false;
  this.wert = mPlayer.rank;
  this.prev_or_next = false;
  this.scroll_down = 0;
  this.closeGroup_Arrow = 0
}
ProfileView.prototype.addViewToStack = function() {
  var a = new StackItem();
  a.itemType = ITEMTYPE.PROFILE_VIEW_ITEM;
  if (mProfileView.externalProfile == false) {
    a.functionname = mProfileView.openPlayerProfile
  } else {
    a.functionname = mProfileView.openExternPlayerProfile;
    a.objectID = mProfileView.player.id
  }
  mBottomBar.addToStack(a)
};
function callback_search_nick(a) {
  if (a.error) {
    if (a.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false)
    }
  } else {
    mProfileView.showRankingEntries = [];
    $.each(a.ranking, function(b, c) {
      mProfileView.showRankingEntries.push(new Player(c))
    });
    if (mProfileView.showRankingEntries.length == 0) {
      showPapyrusMsgBox(mStringtable.getValueOf("No search results"), false);
      return
    }
    $.tmpl("playerRankingTmpl", mProfileView).appendTo($("#rankingitems").empty());
    $("div.allyline").click(function() {
      if ($(this).metadata().playerID != mPlayer.id) {
        openExternPlayerProfile($(this).metadata().playerID)
      }
    })
  }
  if (mIsBlocked) {
    unblockUI()
  }
}
ProfileView.prototype.openPlayerProfile = function() {
  var b = mProfileView;
  b.externalProfile = false;
  b.addViewToStack();
  $.tmpl("playerViewTmpl", mPlayer).appendTo($("div.viewport").empty());
  setPapyrusBackgroundForFullScreenView();
  setHover("div.playerProfile");
  windowSize();
  $(".noscroll").height($(".fullscreeninnerWithHeadlineAndPapyrus").height() * 0.8);
  $("div.buyGold").click(function() {
    openBuyGoldView()
  });
  var a = "close";
  $("#btn_search").click(function() {
    if (a == "close") {
      $("#div_form_search").show();
      $("#btn_search").removeClass("search_form_close").addClass("search_form_open");
      $("#input_search").focus();
      a = "open";
      $("#div_playertable_scroll").scrollTop(0)
    } else {
      a = "close";
      $("#div_form_search").hide();
      $("#btn_search").removeClass("search_form_open").addClass("search_form_close");
      mProfileView.closeGroup_Arrow = 0;
      b.getNextRankingEntries()
    }
  });
  $("#btn_search_send").click(function() {
    var c = $("#input_search").val();
    if (c.length < 3) {
      showPapyrusMsgBox(mStringtable.getValueOf("The name is too short"), false);
      return false
    }
    mProfileView.closeGroup_Arrow = 1;
    var d = {};
    d.nick = c;
    d[mPlayer.userIdentifier] = mPlayer.getHash();
    d.PropertyListVersion = propertyListVersion;
    genericAjaxRequest("ProfileAction/search", d, "callback_search_nick");
    if (!mIsBlocked) {
      blockUI("Loading...")
    }
  });
  $("#input_search").keydown(function(c) {
    if (c.which == 13 || c.which == 32) {
      $("#btn_search_send").click();
      c.preventDefault()
    }
  });
  $("div.look").click(function() {
    openAllianceView()
  });
  if (playerProfileCloseButton) {
    $("div.closeViewMission").show();
    $("div.closeViewMission").click(function(c) {
      if (mBottomBar.selectedIndex != 4) {
        navigateBack()
      } else {
        getBackToMap = false;
        openMap()
      }
    })
  } else {
    $("div.closeViewMission").hide()
  }
  $("div.startVacation").click(function() {
    mProfileView.startVacationMode()
  });
  $(".editableText").editableText({newlinesEnabled: false});
  $(".editableText").change(function() {
    var c = $(this).text();
    if (mProfileView.validateNickname(c)) {
      mPlayer.changeName(c)
    } else {
      $(".editableText").text(mPlayer.nick)
    }
  });
  $("div.habitatline").click(function() {
    boardSetup($(this).metadata().habitatX, $(this).metadata().habitatY)
  });
  $("#copy_player_link").bind("click", {player_id: mPlayer.id}, copy_player_link_Handler);
  b.getNextRankingEntries();
  $("img.permType").tooltip({track: true, delay: 0, showURL: false, showBody: " - ", extraClass: "pretty", fixPNG: true, opacity: 0.95, left: 0, bodyHandler: function() {
      return $("#permission_" + $(this).metadata().permissionType).html()
    }})
};
ProfileView.prototype.getNextRankingEntries = function() {
  var b = mProfileView;
  var a = {};
  a.start = b.getStart();
  a.end = b.getEnd();
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("ProfileAction/showRankingV2", a, "mProfileView.openPlayerRankingCallback")
};
ProfileView.prototype.getStart = function() {
  var b = 0, a = 0;
  if (mProfileView.rankingEntries.length > 0) {
    if (mProfileView.direction == 1 && mProfileView.getNext != -1) {
      b = mProfileView.rankingEntries[mProfileView.rankingEntries.length - 1].rank;
      $.each(mProfileView.rankingEntries, function(c, d) {
        if (d.rank == b) {
          a++
        }
      });
      return b + a
    } else {
      b = mProfileView.rankingEntries[0].rank - mProfileView.itemsToFetch;
      $.each(mProfileView.rankingEntries, function(c, d) {
        if (d.rank == b) {
          a++
        }
      });
      if ((b - a) < 1) {
        b = 1
      }
      if (mProfileView.isArrayEmpty) {
        mProfileView.isArrayEmpty = false;
        return mProfileView.wert -= 50
      } else {
        return b
      }
    }
  } else {
    if (mPlayer.rank < parseInt(mSettings.maxRankingListItemsPerPage / 2)) {
      return 1
    } else {
      return mPlayer.rank
    }
  }
};
ProfileView.prototype.getEnd = function() {
  if (mProfileView.rankingEntries.length > 0) {
    if (mProfileView.direction == 1 && mProfileView.getNext != -1) {
      var c = mProfileView.rankingEntries[mProfileView.rankingEntries.length - 1].rank;
      var a = 0;
      $.each(mProfileView.rankingEntries, function(d, e) {
        if (e.rank == c) {
          a++
        }
      });
      if (a < 10) {
        a = mSettings.maxRankingListItemsPerPage
      }
      return c + a + mSettings.maxRankingListItemsPerPage + 2
    } else {
      if (mProfileView.getNext == -1) {
        mProfileView.getNext = 1;
        return mProfileView.rankingEntries[0].rank
      } else {
        var b = mProfileView.rankingEntries[0].rank;
        return b
      }
    }
  } else {
    return mPlayer.rank + mSettings.maxRankingListItemsPerPage
  }
};
ProfileView.prototype.openPlayerRankingCallback = function(d) {
  if (d.error) {
    if (d.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(d.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(d.error), false)
    }
  } else {
    if (mProfileView.direction == 1 && mProfileView.currentArrayIndex == -11111) {
      if (mProfileView.rankingEntries.length > 0) {
        var f = mProfileView.rankingEntries;
        var a = new Array();
        var e = new Array();
        var c = 0;
        $.each(d.ranking, function(g, h) {
          a.push(new Player(h));
          if (h.id == f[0].id) {
            c = g
          }
        });
        e = a.slice(0, c);
        if (c == 0) {
          mProfileView.rankingEntries = a.concat(f)
        } else {
          mProfileView.rankingEntries = e.concat(f)
        }
        if (mPlayer.rank <= parseInt(mSettings.maxRankingListItemsPerPage / 2)) {
          mProfileView.currentArrayIndex = 0
        } else {
          if (mPlayer.rank <= mSettings.maxRankingListItemsPerPage && mPlayer.rank > parseInt(mSettings.maxRankingListItemsPerPage / 2)) {
          } else {
            mProfileView.isArrayEmpty = true
          }
        }
      } else {
        $.each(d.ranking, function(g, h) {
          mProfileView.rankingEntries.push(new Player(h))
        })
      }
    } else {
      if (mProfileView.direction == 1) {
        $.each(d.ranking, function(g, h) {
          mProfileView.rankingEntries.push(new Player(h))
        })
      } else {
        if (d.ranking.length == 1) {
          mProfileView.itemsToFetch += mSettings.maxRankingListItemsPerPage
        } else {
          if (d.ranking.length == 0 || d.ranking[0].rank == mProfileView.rankingEntries[0].rank) {
            mProfileView.isArrayEmpty = true;
            mProfileView.wert -= 50;
            mProfileView.getNextRankingEntries();
            return false
          }
          mProfileView.itemsToFetch = mSettings.maxRankingListItemsPerPage;
          var b = mProfileView.rankingEntries.slice(1);
          mProfileView.rankingEntries = new Array();
          $.each(d.ranking, function(g, h) {
            mProfileView.rankingEntries.push(new Player(h))
          });
          mProfileView.rankingEntries = mProfileView.rankingEntries.concat(b);
          if (mProfileView.rankingEntries[0].rank == 1) {
            mProfileView.currentArrayIndex = 0
          } else {
            mProfileView.currentArrayIndex += d.ranking.length
          }
        }
      }
    }
    mProfileView.showRanking()
  }
};
ProfileView.prototype.showRanking = function() {
  if (mProfileView.currentArrayIndex == -11111) {
    $.each(mProfileView.rankingEntries, function(d, e) {
      if (e.id == mPlayer.id) {
        if (d < parseInt(mSettings.maxRankingListItemsPerPage / 2) && mPlayer.rank < parseInt(mSettings.maxRankingListItemsPerPage / 2)) {
          mProfileView.currentArrayIndex = 0;
          mProfileView.getNext = 1;
          return(false)
        } else {
          if (d >= parseInt(mSettings.maxRankingListItemsPerPage / 2)) {
            mProfileView.currentArrayIndex = d - (parseInt(mSettings.maxRankingListItemsPerPage / 2));
            mProfileView.getNext = 1;
            return(false)
          } else {
            mProfileView.getNext = -1
          }
        }
      }
    })
  }
  mProfileView.showRankingEntries = mProfileView.rankingEntries.slice(mProfileView.currentArrayIndex, mProfileView.currentArrayIndex + mSettings.maxRankingListItemsPerPage);
  if (mProfileView.showRankingEntries.length < mSettings.maxRankingListItemsPerPage) {
    mProfileView.getNextRankingEntries()
  } else {
    $.tmpl("playerRankingTmpl", mProfileView).appendTo($("tbody#rankingitems").empty());
    setHover("div.playerranking");
    unblockUI();
    $("div.nextItems").click(function() {
      mProfileView.scroll_down = $("#div_playertable_scroll").scrollTop();
      mProfileView.prev_or_next = true;
      blockUI("ProfileAction/showRanking");
      mProfileView.direction = 1;
      mProfileView.currentArrayIndex += mSettings.maxRankingListItemsPerPage;
      mProfileView.showRanking()
    });
    $("div.previousItems").click(function() {
      mProfileView.scroll_down = 0;
      mProfileView.prev_or_next = true;
      blockUI("ProfileAction/showRanking");
      mProfileView.direction = -1;
      if (mProfileView.showRankingEntries[0].rank < mSettings.maxRankingListItemsPerPage && mProfileView.showRankingEntries[0].rank == 1) {
        mProfileView.currentArrayIndex = 0
      } else {
        if (mProfileView.currentArrayIndex < parseInt(mSettings.maxRankingListItemsPerPage / 2) && mProfileView.showRankingEntries[0].rank < parseInt(mSettings.maxRankingListItemsPerPage / 2)) {
          mProfileView.currentArrayIndex = 0
        } else {
          mProfileView.currentArrayIndex -= mSettings.maxRankingListItemsPerPage
        }
      }
      mProfileView.showRanking()
    })
  }
  $("div.allyline").click(function() {
    if ($(this).metadata().playerID != mPlayer.id) {
      openExternPlayerProfile($(this).metadata().playerID)
    }
  });
  var a = 0;
  var c = $("div.content").find("th.cell").height();
  var b = $("div.playerranking").find("th.cell").height() + $("div.playerranking").find("td.allyrow").height();
  $("div.allyline").each(function() {
    a += c;
    if ($(this).metadata().playerID == mPlayer.id) {
      ($(this).find("div.habitatcell")).css("color", "#008000");
      ($(this).find("div.habitatcell")).css("font-weight", "bold");
      return false
    }
  });
  windowSize();
  if (!mProfileView.prev_or_next) {
    if (mPlayer.rank <= parseInt(mSettings.maxRankingListItemsPerPage / 2) && mPlayer.rank > 6) {
      $("#div_playertable_scroll").scrollTop(a - (2 * c))
    } else {
      if (mPlayer.rank > parseInt(mSettings.maxRankingListItemsPerPage / 2)) {
        $("#div_playertable_scroll").scrollTop(parseInt($("#div_playertable_scroll").find("#rankingitems").height() / 2) - (b * 2))
      }
    }
  } else {
    $("#div_playertable_scroll").scrollTop(mProfileView.scroll_down)
  }
};
ProfileView.prototype.validateNickname = function(b) {
  var a = true;
  if (b == null) {
    showPapyrusMsgBox(mStringtable.getValueOf("The name is blacklisted"), false);
    a = false
  } else {
    if (b.length == 0) {
      showPapyrusMsgBox(mStringtable.getValueOf("The name is blacklisted"), false);
      a = false
    }
  }
  return a
};
ProfileView.prototype.openExternPlayerProfile = function(c) {
  var b = this;
  mCurrentActionBlocked = true;
  if (mMapStackUsed == true) {
    mMapStackUsed = false
  }
  if (typeof c == "undefined") {
    c = mProfileView.externId
  }
  b.externalProfile = true;
  blockUI("ProfileAction/playerInformation");
  var a = {};
  a.id = c;
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("ProfileAction/playerInformation", a, "ProfileView.getPlayerInformationCallback")
};
ProfileView.prototype.invitePlayerToAlliance = function(b) {
  blockUI("Loading...");
  var a = {};
  a.id = b;
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("AllianceAction/sendInvitation", a, "ProfileView.getPlayerInformationCallback")
};
ProfileView.prototype.sendMessageToPlayer = function() {
  openSendMessageView(mProfileView.player)
};
ProfileView.getPlayerInformationCallback = function(a) {
  if (a.error) {
    if (a.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false)
    }
  } else {
    if (a.Player) {
      mProfileView.player = new Player(a.Player)
    } else {
      if (a.player) {
        mPlayer.updateData(a.player)
      }
    }
    if (mProfileView.externalProfile) {
      mProfileView.addViewToStack();
      $.tmpl("externPlayerProfileTmpl", mProfileView.player).appendTo($("div.viewport").empty());
      setPapyrusBackgroundForFullScreenView();
      setHover("div.playerProfile");
      $("#CenterPlayerForPolMap").bind("click", hPlayerMap);
      if (mProfileView.player.alliance != null) {
        $("#CenterAllianceForPolMap").bind("click", {alliance_id: mProfileView.player.alliance.id}, hAlliancePmap)
      }
      $("div.closeViewMission").click(function(b) {
        if (mBottomBar.selectedIndex != 4) {
          navigateBack()
        } else {
          getBackToMap = false;
          openMap()
        }
      })
    }
    windowSize();
    $(".noscroll").height($(".fullscreeninnerWithHeadlineAndPapyrus").height() * 0.8);
    $("div.allyline").click(function() {
      mMapStackUsed = true;
      boardSetup($(this).metadata().habitatX, $(this).metadata().habitatY)
    });
    $("div.inviteAction").click(function() {
      mProfileView.invitePlayerToAlliance($(this).metadata().playerId)
    });
    $("div.sendAction").click(function() {
      mProfileView.sendMessageToPlayer()
    });
    $("#copy_player_link").bind("click", {player_id: mProfileView.player.id}, copy_player_link_Handler);
    $("div.look").click(function() {
      mProfileView.externId = mProfileView.player.id;
      openExternAllianceProfile($(this).metadata().allianceId)
    });
    $("img.permType").tooltip({track: true, delay: 0, showURL: false, showBody: " - ", extraClass: "pretty", fixPNG: true, opacity: 0.95, left: 0, bodyHandler: function() {
        return $("#permission_" + $(this).metadata().permissionType).html()
      }})
  }
  unblockUI()
};
ProfileView.prototype.startVacationMode = function() {
  $("#ui-dialog-title-dialog-confirm").text(mStringtable.getValueOf("Start vacation"));
  $("#dialog-confirm").attr("title", mStringtable.getValueOf("Start vacation"));
  $("#dialog-confirm > p").html(mProfileView.getVacationTimeString());
  $("#dialog:ui-dialog").dialog("destroy");
  $("#dialog-confirm").dialog({resizable: false, width: 375, modal: true, draggable: false, buttons: [{text: mStringtable.getValueOf("cancel"), click: function() {
          $(this).dialog("close")
        }}, {text: mStringtable.getValueOf("ok"), click: function() {
          $(this).dialog("close");
          if (mPlayer.remainingVacationHours > 0) {
            blockUI("Loading...");
            var a = {};
            a.PropertyListVersion = propertyListVersion;
            a[mPlayer.userIdentifier] = mPlayer.getHash();
            genericAjaxRequest("ProfileAction/startVacationMode", a, "ProfileView.startVacationCallback")
          } else {
            showPapyrusMsgBox(mStringtable.getValueOf("There are no more vacation hours remaining"), false)
          }
        }}]})
};
ProfileView.prototype.getVacationTimeString = function() {
  var b = Math.floor(mPlayer.remainingVacationHours / 24);
  var a = mPlayer.remainingVacationHours - (b * 24);
  return $.sprintf(mStringtable.getValueOf("You have %1$d days and %2$d hours left for vacations. Vacation mode starts %3$d hours after you confirm. You can not log in for %4$d hours after vacation mode started."), b, a, mSettings.vacationDelayHours, mSettings.minimumVacationHours)
};
ProfileView.prototype.getVacationStartTime = function() {
  if (mProfileView.externalProfile) {
    var a = jsonDateToDate(mProfileView.player.vacationStartDate)
  } else {
    var a = jsonDateToDate(mPlayer.vacationStartDate)
  }
  return $.sprintf(mStringtable.getValueOf("Player's vacation starts on %@."), formatDateTime(a))
};
ProfileView.startVacationCallback = function(a) {
  if (a.touchDate) {
    globalTouchDate = a.touchDate
  }
  if (a.error) {
    if (a.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false)
    }
  } else {
    mPlayer.vacationStartDate = a.vacationStartDate;
    $("table.vacationTable").empty();
    $.tmpl("vacationTimerTmpl", mProfileView).appendTo($("table.vacationTable").empty());
    windowSize()
  }
  unblockUI()
};
function RecruitingView() {
  this.listValues = null;
  this.currentScrollValue = 0
}
RecruitingView.prototype.initView = function() {
  $.tmpl("recruitingListTmpl", mPlayer).appendTo($("div.viewport").empty());
  setPapyrusBackgroundForFullScreenView();
  setHover("div.recruitinglist");
  $("input.recruitcount").numeric({decimal: false, negative: false});
  $("input.recruitcount").bind("paste", function(a) {
    a.preventDefault()
  });
  if (mRecruitingView.listValues) {
    $("input.recruitcount").each(function(c) {
      var b = $(this);
      var a = $(this).attr("id");
      if (mRecruitingView.listValues[a]) {
        $(this).val(mRecruitingView.listValues[a]);
        mRecruitingView.updateRecruitingListValues(b)
      }
    })
  } else {
    mRecruitingView.listValues = {}
  }
  $("input.recruitcount").blur(function(a) {
    mRecruitingView.updateRecruitingListValues($(this))
  });
  $("div.max").click(function() {
    var d = $(this);
    var a = $(this).find("div.maxValue").text();
    a = a.substr(5);
    var b = $(this).parent().find("input.recruitcount");
    var c = parseInt($(b).val(), 10);
    if (isNaN(c)) {
      c = 0
    }
    $(b).val(parseInt(a));
    mRecruitingView.updateRecruitingListValues(d)
  });
  $("div.recruit").click(function() {
    mRecruitingView.currentScrollValue = $("#tablecontainer").scrollTop();
    var b = mPlayer.habitate[$(this).metadata().habitat];
    var a = $('input[id="recruit_' + $(this).metadata().habitat + "_" + $(this).metadata().primaryKey + '"]').val();
    if (b && a != "0") {
      delete mRecruitingView.listValues["recruit_" + $(this).metadata().habitat + "_" + $(this).metadata().primaryKey];
      mUnits[$(this).metadata().primaryKey].build(b, a)
    }
  });
  $("div.speedupRecruit").click(function() {
    mRecruitingView.currentScrollValue = $("#tablecontainer").scrollTop();
    var b = mPlayer.habitate[$(this).metadata().habitat];
    var a = b.getUnitOrder($(this).metadata().unitOrder);
    if (a) {
      a.unit.speedup(a)
    }
  });
  $("div.finishRecruit").click(function() {
    mRecruitingView.currentScrollValue = $("#tablecontainer").scrollTop();
    var b = mPlayer.habitate[$(this).metadata().habitat];
    var a = b.getUnitOrder($(this).metadata().unitOrder);
    if (a) {
      a.unit.finish(a)
    }
  });
  $("div.speedupRecruitAll").click(function() {
    mRecruitingView.currentScrollValue = $("#tablecontainer").scrollTop();
    var a = mPlayer.habitate[$(this).metadata().habitat];
    if (a) {
      a.speedupAllUnits()
    }
  });
  $("div.finishRecruitAll").click(function() {
    mRecruitingView.currentScrollValue = $("#tablecontainer").scrollTop();
    var a = mPlayer.habitate[$(this).metadata().habitat];
    if (a) {
      a.finishAllUnits()
    }
  });
  $("div.speedupRecruitAllHabitate").click(function() {
    mRecruitingView.currentScrollValue = $("#tablecontainer").scrollTop();
    mPlayer.speedupAllUnits()
  });
  $("div.finishRecruitAllHabitate").click(function() {
    mRecruitingView.currentScrollValue = $("#tablecontainer").scrollTop();
    mPlayer.finishAllUnits()
  });
  windowSize();
  if (mRecruitingView.currentScrollValue > 0) {
    $("#tablecontainer").scrollTop(mRecruitingView.currentScrollValue)
  } else {
    $("#tablecontainer").scrollTop(0)
  }
};
RecruitingView.prototype.updateRecruitingListValues = function(m) {
  var k = $(m).parent().find("input.recruitcount");
  var n = $(k).val();
  var g = parseInt(mRecruitingView.listValues[$(k).attr("id")], 10);
  if (isNaN(g)) {
    g = 0
  }
  var h = $(m).parent().find("div.maxValue").text();
  h = parseInt(h.substr(5));
  if (parseInt(n, 10) > (parseInt(h))) {
    if (g > 0) {
      $(m).val(h)
    } else {
      n = h + g;
      $(m).val(n)
    }
  }
  if (!isNaN(parseInt(n))) {
    mRecruitingView.listValues[$(k).attr("id")] = n
  }
  var c = 0, e = 0, b = 0, o = 0, j = 0;
  $(m).parent().parent().find("input.recruitcount").each(function() {
    c += $(this).val() * $(this).metadata().wood;
    e += $(this).val() * $(this).metadata().stone;
    b += $(this).val() * $(this).metadata().ore;
    o += $(this).val() * $(this).metadata().people;
    j += $(this).val() * $(this).metadata().duration
  });
  $("div#Wood_" + $(k).metadata().habitat).html(c);
  $("div#Stone_" + $(k).metadata().habitat).html(e);
  $("div#Ore_" + $(k).metadata().habitat).html(b);
  $("div#People_" + $(k).metadata().habitat).html(o);
  $("div#duration_" + $(k).metadata().habitat).html(secToTimeStr(j));
  var f = $("div#amount_Wood_" + $(k).metadata().habitat).html() - c;
  var d = $("div#amount_Stone_" + $(k).metadata().habitat).html() - e;
  var l = $("div#amount_Ore_" + $(k).metadata().habitat).html() - b;
  var a = $("div#amount_People_" + $(k).metadata().habitat).html() - o
};
function Report(a) {
  this.id = getValueFromJSON(a.id);
  this.type = getValueFromJSON(a.type);
  this.date = jsonDateToDate(getValueFromJSON(a.date));
  this.habitat = new Habitat(a.habitat);
  if (a.variables.missionId) {
    this.mission = mMissions[a.variables.missionId];
    this.units = makeKeyValueArrayFromJSON(a.variables.unitProduction);
    this.resources = makeKeyValueArrayFromJSON(a.variables.resourceProduction)
  }
  this.knowledge = mKnowledges[a.variables.knowledgeId];
  if (a.variables.destinationETA) {
    this.destinationETA = jsonDateToDate(getValueFromJSON(a.variables.destinationETA));
    this.resources = null;
    if (a.variables.resourceDictionary) {
      this.resources = makeKeyValueArrayFromJSON(a.variables.resourceDictionary)
    }
    this.destinationHabitat = null;
    if (a.variables.destinationHabitat) {
      this.destinationHabitat = new Habitat(a.variables.destinationHabitat);
      if (!this.destinationHabitat.name) {
        this.destinationHabitat.name = ""
      }
    }
    this.units = null;
    if (a.variables.unitDictionary) {
      this.units = makeKeyValueArrayFromJSON(a.variables.unitDictionary)
    }
    this.sourceHabitat = null;
    if (a.variables.sourceHabitat) {
      this.sourceHabitat = new Habitat(a.variables.sourceHabitat);
      if (!this.sourceHabitat.name) {
        this.sourceHabitat.name = ""
      }
    }
    this.transitType = getValueFromJSON(a.variables.transitType)
  }
  if (a.variables.battleType != null) {
    this.unitsLoss = makeKeyValueArrayFromJSON(a.variables.lossDictionary);
    this.destinationHabitat = null;
    if (a.variables.destinationHabitat) {
      this.destinationHabitat = new Habitat(a.variables.destinationHabitat);
      if (!this.destinationHabitat.name) {
        this.destinationHabitat.name = ""
      }
    }
    this.defenderUnitDictionary = null;
    if (a.variables.defenderUnitDictionary) {
      this.defenderUnitDictionary = makeKeyValueArrayFromJSON(a.variables.defenderUnitDictionary)
    }
    this.battlePartyDictionary = null;
    if (a.variables.battlePartyDictionary) {
      this.battlePartyDictionary = makeKeyValueArrayFromJSON(a.variables.battlePartyDictionary)
    }
    this.units = makeKeyValueArrayFromJSON(a.variables.unitDictionary);
    this.battleType = getValueFromJSON(a.variables.battleType)
  }
  if (a.variables.copperAmount) {
    this.copperAmount = getValueFromJSON(a.variables.copperAmount);
    this.successful = getValueFromJSON(a.variables.successful);
    this.destinationHabitat = null;
    if (a.variables.destinationHabitat) {
      this.destinationHabitat = new Habitat(a.variables.destinationHabitat)
    }
    this.sourceHabitat = null;
    if (a.variables.sourceHabitat) {
      this.sourceHabitat = new Habitat(a.variables.sourceHabitat)
    }
    this.impactDate = jsonDateToDate(getValueFromJSON(a.variables.impactDate));
    this.units = makeKeyValueArrayFromJSON(a.variables.unitDictionary);
    this.resources = makeKeyValueArrayFromJSON(a.variables.resourceDictionary);
    this.buildings = makeKeyValueArrayFromJSON(a.variables.buildings)
  }
  if (a.variables.silverAmount) {
    this.silverAmount = getValueFromJSON(a.variables.silverAmount);
    this.destinationHabitat = null;
    if (a.variables.destinationHabitat) {
      this.destinationHabitat = new Habitat(a.variables.destinationHabitat)
    }
    this.units = makeKeyValueArrayFromJSON(a.variables.unitDictionary)
  }
  if (a.variables.destinationHabitat) {
    this.destinationHabitat = new Habitat(a.variables.destinationHabitat);
    if (!this.destinationHabitat.name) {
      this.destinationHabitat.name = ""
    }
  }
  if (a.variables.unitDictionary && a.type == 9) {
    this.units = makeKeyValueArrayFromJSON(a.variables.unitDictionary)
  }
  this.published = getValueFromJSON(a.published);
  this.setCategory()
}
Report.prototype.setCategory = function() {
  if (this.type == 2) {
    this.internalCategory = 5
  } else {
    if (this.type == 3) {
      this.internalCategory = 4
    } else {
      if (this.type == 1 || this.type == 9) {
        this.internalCategory = 1
      } else {
        if (this.type == 10 || this.type == 11) {
          this.internalCategory = 2
        } else {
          if (this.type == 8) {
            if (this.battleType == 0 || this.battleType == 1) {
              this.internalCategory = 1
            } else {
              this.internalCategory = 2
            }
          } else {
            if (this.type == 6 || this.type == 14 || this.type == 15) {
              this.internalCategory = 3
            } else {
              if (this.type == 7 || this.type == 13) {
                this.internalCategory = 6
              }
            }
          }
        }
      }
    }
  }
};
Report.prototype.getUnitsCount = function() {
  var a = 0;
  $.each(this.units, function(c, b) {
    a += b
  });
  return a
};
Report.prototype.getUnitsLossCount = function() {
  var a = 0;
  $.each(this.unitsLoss, function(c, b) {
    a += b
  });
  return a
};
function ReportsView(a, b) {
  this.reportId = 0;
  this.initialCategory = "all";
  this.modus = a;
  this.spyReport = b;
  this.spyedHabitatID = 0;
  this.currentScrollValue = 0;
  this.currentScrollValue2 = 0;
  this.countMission = 0;
  this.countBattle = 0;
  this.countAttack = 0;
  this.countResearch = 0;
  this.countTransit = 0;
  this.countSpy = 0;
  this.countDefense = 0;
  this.selectedTabIndex = 0;
  this.selectedReports = 0;
  this.isEdit = false;
  this.isReportSettings = false;
  this.arrayMission = new Array();
  this.arrayBattle = new Array();
  this.arrayAttack = new Array();
  this.arrayResearch = new Array();
  this.arrayTransit = new Array();
  this.arraySpy = new Array();
  this.arrayDefense = new Array();
  this.arrayAll = new Array()
}
ReportsView.prototype.addViewToStack = function(a) {
  var b = new StackItem();
  b.itemType = ITEMTYPE.REPORTS_VIEW_ITEM;
  b.functionname = mReportsView.loadReports;
  b.objectID = mReportsView.initialCategory;
  b.additionalParameter = a;
  mBottomBar.addToStack(b)
};
ReportsView.prototype.loadReports = function(b) {
  str_mCurrentAction = "";
  if (mReportsView.modus == false) {
    selectButton(6, ITEMTYPE.REPORTS_VIEW_ITEM);
    mReportsView.initialCategory = b;
    mReportsView.addViewToStack();
    mCurrentActionBlocked = false;
    blockUI("ReportAction/habitatReportArray");
    var a = {};
    a.PropertyListVersion = propertyListVersion;
    a[mPlayer.userIdentifier] = mPlayer.getHash();
    genericAjaxRequest("ReportAction/habitatReportArray", a, "mReportsView.reportsCallback")
  } else {
    blockUI("Loading...");
    var a = {};
    a.PropertyListVersion = propertyListVersion;
    a[mPlayer.userIdentifier] = mPlayer.getHash();
    genericAjaxRequest("AllianceReportAction/allianceReportArray", a, "mReportsView.allianceReportsCallback")
  }
};
ReportsView.prototype.reportsCallback = function(b) {
  if (b.touchDate) {
    globalTouchDate = b.touchDate
  }
  if (b.error) {
    if (b.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(b.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(b.error))
    }
  } else {
    var c = new Array();
    var a = null;
    mReportsView.countMission = 0;
    mReportsView.countBattle = 0;
    mReportsView.countAttack = 0;
    mReportsView.countResearch = 0;
    mReportsView.countTransit = 0;
    mReportsView.countSpy = 0;
    mReportsView.countDefense = 0;
    mReportsView.arrayMission = new Array();
    mReportsView.arrayBattle = new Array();
    mReportsView.arrayAttack = new Array();
    mReportsView.arrayResearch = new Array();
    mReportsView.arrayTransit = new Array();
    mReportsView.arraySpy = new Array();
    mReportsView.arrayDefense = new Array();
    mReportsView.arrayAll = new Array();
    $.each(b.habitatReportArray, function(e, f) {
      if (mReportsView.isWellknownReportType(f.type)) {
        c.push(new Report(f));
        if (f.type == 1 || f.type == 9) {
          mReportsView.countDefense++;
          mReportsView.arrayDefense.push(new Report(f))
        } else {
          if (f.type == 11 || f.type == 10) {
            mReportsView.countAttack++;
            mReportsView.arrayAttack.push(new Report(f))
          } else {
            if (f.type == 6 || f.type == 14 || f.type == 15) {
              mReportsView.countTransit++;
              mReportsView.arrayTransit.push(new Report(f))
            } else {
              if (f.type == 3) {
                mReportsView.countResearch++;
                mReportsView.arrayResearch.push(new Report(f))
              } else {
                if (f.type == 2) {
                  mReportsView.countMission++;
                  mReportsView.arrayMission.push(new Report(f))
                } else {
                  if (f.type == 7 || f.type == 13) {
                    mReportsView.countSpy++;
                    mReportsView.arraySpy.push(new Report(f))
                  } else {
                    if (f.type == 8) {
                      if (f.variables.battleType == 0 || f.variables.battleType == 1) {
                        mReportsView.countDefense++;
                        mReportsView.arrayDefense.push(new Report(f))
                      } else {
                        mReportsView.countAttack++;
                        mReportsView.arrayAttack.push(new Report(f))
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (mReportsView.spyReport) {
          if (c[c.length - 1].internalCategory == mReportsView.initialCategory) {
            var d;
            if (c[c.length - 1].destinationHabitat) {
              d = c[c.length - 1].destinationHabitat.id
            } else {
              d = c[c.length - 1].sourceHabitat.id
            }
            if (mReportsView.spyedHabitatID == d) {
              a = c[c.length - 1]
            }
          }
        } else {
          if (mReportsView.initialCategory == "all") {
            a = c[0]
          } else {
            if (c[c.length - 1].internalCategory == mReportsView.initialCategory && a == null) {
              a = c[c.length - 1]
            }
          }
        }
      }
    });
    if (a != undefined && a != null && a.type == 11) {
      url_for_fb = create_url_for_fb()
    }
    mCurrentActionBlocked = true;
    mReportsView.arrayAll = c;
    mPlayer.setReports(c);
    mReportsView.showReports(a)
  }
};
ReportsView.prototype.isWellknownReportType = function(a) {
  if (a < 4 || (a > 5 && a < 12) || a == 13 || a == 14 || a == 15) {
    return(true)
  } else {
    return(false)
  }
};
ReportsView.prototype.getFirstReportOfCategory = function() {
  var a = null;
  if (mReportsView.initialCategory == "all") {
    a = mPlayer.reports[0]
  } else {
    $.each(mPlayer.reports, function(b, c) {
      if (c.internalCategory == mReportsView.initialCategory && a == null) {
        a = c
      }
    })
  }
  return a
};
function report_einheit(a, b) {
  this.buildingId = parseInt(a);
  this.level = parseInt(b)
}
function sort_report(a) {
  var c = false;
  var b = [];
  $.each(a, function(e, d) {
    if (typeof d == "object") {
      c = true
    }
    if (mBuildings[e] != undefined) {
      b[mBuildings[e].getOrder()] = new report_einheit(e, d)
    }
  });
  if (c) {
    b = a
  }
  return b
}
ReportsView.prototype.showReports = function(a) {
  $.tmpl("reportsViewTmpl", mPlayer).appendTo($("div.viewport").empty());
  setPapyrusBackgroundForRightSide();
  setHover("div.reportsview");
  if (a) {
    if (a.type == 7 && a.buildings != null) {
      a.buildings = sort_report(a.buildings)
    }
    $.tmpl("reportDetailTmpl", a).appendTo($("div.right50>div.content").empty());
    $("span.reportheadline").html(mReportsView.getReportHeadline(a));
    setHover("div.right50>div.content");
    $("div#deletereport").click(function() {
      blockUI("ReportAction/deleteHabitatReport");
      var b = {};
      b.id = a.id;
      b.PropertyListVersion = propertyListVersion;
      b[mPlayer.userIdentifier] = mPlayer.getHash();
      genericAjaxRequest("ReportAction/deleteHabitatReport", b, "mReportsView.reportsCallback")
    })
  } else {
  }
  $("table.reportSelect:first").removeClass("notSelected").addClass("isSelected");
  mPlayer.unreadReportCount = 0;
  mBottomBar.setNewCounts();
  if (mReportsView.isEdit == false) {
    $("table.reports").each(function(b) {
      $(this).find("input").hide()
    });
    $("#deleteselectedreports").css("visibility", "hidden");
    $(".selectAllCheckbox").css("visibility", "hidden");
    $("span.editButtonText").text(mStringtable.getValueOf("Edit"))
  } else {
    $("table.reports").each(function(b) {
      $(this).find("input").show()
    });
    $("#deleteselectedreports").css("visibility", "visible");
    $(".selectAllCheckbox").css("visibility", "visible");
    $("span.editButtonText").text(mStringtable.getValueOf("cancel"));
    $("#editReports").addClass("editIsActive")
  }
  windowSize();
  $("a.report").click(function() {
    a = mPlayer.reports[parseInt($(this).metadata().reportId) + parseInt($(this).metadata().page)];
    if (a != undefined && a != null && a.type == 11) {
      url_for_fb = create_url_for_fb()
    }
    mReportsView.reportId = a.id;
    mReportsView.showReportDetail(a)
  });
  $("table.reportSelect").click(function() {
    $("table.reportSelect").each(function() {
      if ($("table.reportSelect").hasClass("isSelected")) {
        $("table.reportSelect").removeClass("isSelected");
        $("table.reportSelect").addClass("notSelected")
      }
    });
    $(this).addClass("isSelected")
  });
  $("select#reporttype").change(function() {
    if ($(this).val() == "all") {
      $("table.reports tr").show()
    } else {
      $("table.reports tr.reportrow:not(tr_" + $(this).val() + ")").hide();
      $("table.reports tr.tr_" + $(this).val()).show()
    }
    $("div.cleft").scrollTop(0);
    mReportsView.initialCategory = $(this).val();
    mReportsView.setSelection($(this).val());
    a = mReportsView.getFirstReportOfCategory();
    mReportsView.addViewToStack(0);
    mReportsView.showReportDetail(a)
  });
  if (typeof mReportsView.initialCategory == "undefined") {
    $("select#reporttype").val(mReportsView.selectedTabIndex);
    $("select#reporttype").change()
  } else {
    $("select#reporttype").val(mReportsView.initialCategory);
    $("select#reporttype").change()
  }
  $("#tabsReportsView").tabs({selected: mReportsView.selectedTabIndex, select: function(b, c) {
      mPlayer.resetCurrentReports();
      mReportsView.selectedTabIndex = c.index;
      if (c.panel.id == "defenseReportTab") {
        $("select#reporttype").val(1);
        $("select#reporttype").change();
        mReportsView.addViewToStack(0);
        $(".reportSettingsArea").hide();
        mReportsView.isReportSettings = false;
        if (mReportsView.arrayDefense.length > 0) {
          mPlayer.setReports(mReportsView.arrayDefense);
          mReportsView.showReports(a)
        }
      } else {
        if (c.panel.id == "attackReportTab") {
          $("select#reporttype").val(2);
          $("select#reporttype").change();
          mReportsView.addViewToStack(0);
          $(".reportSettingsArea").hide();
          mReportsView.isReportSettings = false;
          if (mReportsView.arrayAttack.length > 0) {
            mPlayer.setReports(mReportsView.arrayAttack);
            mReportsView.showReports(a)
          }
        } else {
          if (c.panel.id == "transitReportTab") {
            $("select#reporttype").val(3);
            $("select#reporttype").change();
            mReportsView.addViewToStack(0);
            $(".reportSettingsArea").hide();
            mReportsView.isReportSettings = false;
            if (mReportsView.arrayTransit.length > 0) {
              mPlayer.setReports(mReportsView.arrayTransit);
              mReportsView.showReports(a)
            }
          } else {
            if (c.panel.id == "researchReportTab") {
              $("select#reporttype").val(4);
              $("select#reporttype").change();
              mReportsView.addViewToStack(0);
              $(".reportSettingsArea").hide();
              mReportsView.isReportSettings = false;
              if (mReportsView.arrayResearch.length > 0) {
                mPlayer.setReports(mReportsView.arrayResearch);
                mReportsView.showReports(a)
              }
            } else {
              if (c.panel.id == "missionReportTab") {
                $("select#reporttype").val(5);
                $("select#reporttype").change();
                mReportsView.addViewToStack(0);
                $(".reportSettingsArea").hide();
                mReportsView.isReportSettings = false;
                if (mReportsView.arrayMission.length > 0) {
                  mPlayer.setReports(mReportsView.arrayMission);
                  mReportsView.showReports(a)
                }
              } else {
                if (c.panel.id == "spyReportTab") {
                  $("select#reporttype").val(6);
                  $("select#reporttype").change();
                  mReportsView.addViewToStack(0);
                  $(".reportSettingsArea").hide();
                  mReportsView.isReportSettings = false;
                  if (mReportsView.arraySpy.length > 0) {
                    mPlayer.setReports(mReportsView.arraySpy);
                    mReportsView.showReports(a)
                  }
                } else {
                  if (c.panel.id == "reportSettingsTab") {
                    mReportsView.isReportSettings = true;
                    $("select#reporttype").val(7);
                    $("select#reporttype").change();
                    mReportsView.addViewToStack(0);
                    mPlayer.setReports(mReportsView.arrayAll);
                    $("select#reporttype").change();
                    $("table.reports").hide();
                    $(".reportSettingsArea").show();
                    $("#editReports").css("visibility", "hidden");
                    $(".selectAllCheckbox").css("visibility", "hidden")
                  } else {
                    mReportsView.addViewToStack(0);
                    mPlayer.setReports(mReportsView.arrayAll);
                    mReportsView.showReports(a);
                    mReportsView.isReportSettings = false;
                    $("select#reporttype").val(0);
                    $("select#reporttype").change()
                  }
                }
              }
            }
          }
        }
      }
    }});
  unblockUI();
  $("div#deleteselectedreports").click(function() {
    var b = new Array();
    $("table.reports tr:visible input:checked").each(function() {
      b.push($(this).metadata().reportId)
    });
    if (b.length > 0) {
      $("#ui-dialog-title-dialog-confirm").text(mStringtable.getValueOf("Really delete selection?"));
      $("#dialog-confirm").attr("title", mStringtable.getValueOf("Really delete selection?"));
      $("#dialog-confirm > p").html(mStringtable.getValueOf("Really delete selection?"));
      $("#dialog:ui-dialog").dialog("destroy");
      $("#dialog-confirm").dialog({resizable: false, width: 375, modal: true, draggable: false, buttons: [{text: mStringtable.getValueOf("cancel"), click: function() {
              $(this).dialog("close")
            }}, {text: mStringtable.getValueOf("ok"), click: function() {
              $(this).dialog("close");
              mReportsView.currentScrollValue = $("div.reportScroll").scrollTop();
              blockUI("ReportAction/deleteHabitatReportArray");
              var c = {};
              c.idArray = "(" + b.join(",") + ")";
              c.PropertyListVersion = propertyListVersion;
              c[mPlayer.userIdentifier] = mPlayer.getHash();
              genericAjaxRequest("ReportAction/deleteHabitatReportArray", c, "mReportsView.reportsCallback")
            }}]})
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf("No element selected."), false, false, false, false)
    }
  });
  $("input#selectAll").click(function() {
    mReportsView.selectedReports = 0;
    if (($(this).is(":checked"))) {
      $("table.reports tr:visible input").each(function() {
        $(this).attr("checked", "checked");
        mReportsView.selectedReports = mReportsView.selectedReports + 1;
        $("span.selectedReportNumber").text(mReportsView.selectedReports)
      })
    } else {
      $("table.reports tr:visible input").each(function() {
        $(this).attr("checked", false);
        $("span.selectedReportNumber").text(mReportsView.selectedReports);
        if (mReportsView.selectedReports >= 1) {
          mReportsView.selectedReports = mReportsView.selectedReports - 1;
          $("span.selectedReportNumber").text(mReportsView.selectedReports)
        } else {
          mReportsView.selectedReports = 0;
          $("span.selectedReportNumber").text(mReportsView.selectedReports)
        }
      })
    }
  });
  $("table.reports tr:visible input").click(function() {
    if (($(this).is(":checked"))) {
      mReportsView.selectedReports = mReportsView.selectedReports + 1;
      $("span.selectedReportNumber").text(mReportsView.selectedReports)
    } else {
      if (mReportsView.selectedReports >= 1) {
        mReportsView.selectedReports = mReportsView.selectedReports - 1;
        $("span.selectedReportNumber").text(mReportsView.selectedReports)
      } else {
        mReportsView.selectedReports = 0;
        $("span.selectedReportNumber").text(mReportsView.selectedReports)
      }
    }
  });
  $(".CheckBoxClass").change(function() {
    if ($(this).is(":checked")) {
      $(this).next("label").addClass("LabelSelected");
      $(this).next("label").find(".fakeCheckBox").attr("src", "../pictures/Icons/TransitAttack.png")
    } else {
      $(this).next("label").removeClass("LabelSelected");
      $(this).next("label").find(".fakeCheckBox").attr("src", "../pictures/Icons/Search.png")
    }
  });
  mReportsView.setSelection(mReportsView.initialCategory);
  if (mReportsView.currentScrollValue == 0) {
    $("div.reportScroll").scrollTop(0)
  } else {
    $("div.reportScroll").scrollTop(mReportsView.currentScrollValue)
  }
  $(".dateOrderRow").each(function() {
    $(".dateShort_" + $(this).metadata().reportDate).hide();
    $(".dateShort_" + $(this).metadata().reportDate).first().show();
    var b = $(".dateShort_" + $(this).metadata().reportDate).metadata().reportId;
    $(this).parent().parent().parent().parent().find("." + b).css("margin-top", "40px")
  });
  $("#editReports").click(function() {
    if (!mReportsView.isEdit) {
      mReportsView.isEdit = true;
      $(this).removeClass("editIsActive");
      $("span.editButtonText").text(mStringtable.getValueOf("cancel"));
      $("#deleteselectedreports").css("visibility", "visible");
      $(".selectAllCheckbox").css("visibility", "visible");
      if (mReportsView.isReportSettings) {
        $("#saveReportSelection").css("visibility", "visible")
      } else {
        $("table.reports").each(function(b) {
          $(this).find("input").show()
        })
      }
    } else {
      mReportsView.isEdit = false;
      $(this).addClass("editIsActive");
      $("span.editButtonText").text(mStringtable.getValueOf("Edit"));
      $("#deleteselectedreports").css("visibility", "hidden");
      $(".selectAllCheckbox").css("visibility", "hidden");
      $("table.reports").each(function(b) {
        $(this).find("input").hide()
      })
    }
  });
  $("#saveReportSelection").click(function() {
    var c = 0;
    $("input.settingsCheckBox:checked").each(function() {
      c = c + Math.pow(2, $(this).metadata().reportType)
    });
    blockUI("Loading...");
    var b = {};
    b.reportSetup = c;
    b.PropertyListVersion = propertyListVersion;
    b[mPlayer.userIdentifier] = mPlayer.getHash();
    genericAjaxRequest("ReportAction/changeReportSetup", b, "mReportsView.reportSetupCallback")
  });
  $("#nextReports").click(function(b) {
    mPlayer.nextReportPage();
    $("#reportNumbers").text(mPlayer.currentReports.start + " / " + mPlayer.reports.length);
    mReportsView.showReports();
    return false
  });
  $("#prevReports").click(function(b) {
    mPlayer.prevReportPage();
    $("#reportNumbers").text(mPlayer.currentReports.start + 1 + " - " + mPlayer.currentReports.end + " / " + mPlayer.reports.length);
    mReportsView.showReports();
    return false
  })
};
ReportsView.prototype.showReportSettings = function() {
  $.tmpl("reportSelectionTmpl", mReportsView).appendTo($("div.reportSettingsArea").empty());
  setPapyrusBackgroundForFullScreenView();
  windowSize();
  bindHoverHandler($("#saveReportSelection"));
  bindHoverHandler($("#cancelReportSelection"));
  $("#reportSelection").lightbox_me({centered: true, closeClick: false, destroyOnClose: true, overlayCSS: {background: "black", opacity: 0.85}});
  $(".CheckBoxClass").change(function() {
    if ($(this).is(":checked")) {
      $(this).next("label").addClass("LabelSelected");
      $(this).next("label").find(".fakeCheckBox").attr("src", "../pictures/Icons/TransitAttack.png")
    } else {
      $(this).next("label").removeClass("LabelSelected");
      $(this).next("label").find(".fakeCheckBox").attr("src", "../pictures/Icons/Search.png")
    }
  });
  $("#saveReportSelection").click(function() {
    var c = 0;
    var a = 2;
    $("input.settingsCheckBox:checked").each(function() {
      c = c + Math.pow(2, $(this).metadata().reportType)
    });
    blockUI("Loading...");
    var b = {};
    b.reportSetup = c;
    b.PropertyListVersion = propertyListVersion;
    b[mPlayer.userIdentifier] = mPlayer.getHash();
    genericAjaxRequest("ReportAction/changeReportSetup", b, "mReportsView.reportSetupCallback");
    $("#reportSelection").trigger("close")
  });
  $("#cancelReportSelection, .closeViewMission").click(function() {
    $("#reportSelection").trigger("close")
  })
};
ReportsView.prototype.showReportOverlayCallback = function(b) {
  unblockUI();
  if (typeof b.error != "undefined") {
    if (b.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(b.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(b.error))
    }
    return
  }
  if (typeof b.report == "undefined") {
    return
  }
  var a = new Report(b.report);
  if (a.type == 7 && a.buildings != null) {
    a.buildings = sort_report(a.buildings)
  }
  $.tmpl("reportDetailOverlayTmpl", mReportsView).appendTo($("div.viewport").empty());
  $.tmpl("reportDetailTmpl", a).appendTo($("div#reportDetails").empty());
  setPapyrusBackgroundForFullScreenView();
  windowSize();
  $(".habitatName").click(function() {
    mMapStackUsed = true;
    mapActions.reset();
    boardSetup($(this).metadata().habitatX, $(this).metadata().habitatY)
  });
  $(".unit").click(function(c) {
    mHabitatView.openHabitat(false);
    mHabitatView.unitIdentifierDetailsView = $(this).metadata().primaryKey;
    mHabitatView.openUnitDetailsView($(this).metadata().primaryKey)
  });
  $(".exploredKnowledge").click(function() {
    var c = 0;
    $.each(mPlayer.currentHabitat.habitatBuildings, function(e, d) {
      if (d.getIdentifierWithoutLevel().replace(" ", "").toLowerCase() == "library") {
        c = d.primaryKey
      }
    });
    mHabitatView.openHabitat(true);
    openKnowledgeAndMissionView(c, $(this).metadata().primaryKey)
  });
  $(".startedMission").click(function() {
    var c = 0;
    $.each(mPlayer.currentHabitat.habitatBuildings, function(e, d) {
      if (d.getIdentifierWithoutLevel().replace(" ", "").toLowerCase() == "tavern") {
        c = d.primaryKey
      }
    });
    mHabitatView.openHabitat(true);
    openKnowledgeAndMissionView(c, $(this).metadata().primaryKey)
  });
  $("span.reportheadline").html(mReportsView.getReportHeadline(a));
  $("div#reportDetails .toolbar").hide();
  $("div.closeViewMission").click(function() {
    mBottomBar.callLastView()
  })
};
ReportsView.prototype.reportSetupCallback = function(a) {
  if (a.touchDate) {
    globalTouchDate = a.touchDate
  }
  if (a.error) {
    if (a.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error))
    }
  } else {
    mPlayer.reportSetup = a.reportSetup
  }
  unblockUI()
};
ReportsView.prototype.showReportDetail = function(a) {
  if (a != null) {
    if (a.type == 7 && a.buildings != null) {
      a.buildings = sort_report(a.buildings)
    }
    $.tmpl("reportDetailTmpl", a).appendTo($("div.right50>div.content").empty());
    $("span.reportheadline").html(mReportsView.getReportHeadline(a));
    setHover("div.right50>div.content");
    windowSize();
    $("div#deletereport").click(function() {
      mReportsView.currentScrollValue = $("div.reportScroll").scrollTop();
      blockUI("ReportAction/deleteHabitatReport");
      var b = {};
      b.id = a.id;
      b.PropertyListVersion = propertyListVersion;
      b[mPlayer.userIdentifier] = mPlayer.getHash();
      genericAjaxRequest("ReportAction/deleteHabitatReport", b, "mReportsView.reportsCallback")
    });
    $("div#publishreport").bind("click", {report_id: a.id}, function(c) {
      var b = {};
      b.id = a.id;
      b.PropertyListVersion = propertyListVersion;
      b.published = !a.published;
      b[mPlayer.userIdentifier] = mPlayer.getHash();
      genericAjaxRequest("ReportAction/setReportPublished", b, "mReportsView.toggleReportCopyButton")
    });
    if (!a.published) {
      $("div#copyreport").hide();
      $("div#publishreport .publishedIcon").hide()
    } else {
      $("div#publishreport .publishedIcon").show()
    }
    $("div#copyreport").bind("click", {report_id: a.id, habitat_id: a.habitat.id}, copy_report_link_Handler);
    $(".habitatName").click(function() {
      mMapStackUsed = true;
      mapActions.reset();
      boardSetup($(this).metadata().habitatX, $(this).metadata().habitatY)
    });
    $(".unit").click(function(b) {
      mHabitatView.openHabitat(false);
      mHabitatView.unitIdentifierDetailsView = $(this).metadata().primaryKey;
      mHabitatView.openUnitDetailsView($(this).metadata().primaryKey)
    });
    $(".exploredKnowledge").click(function() {
      var b = 0;
      $.each(mPlayer.currentHabitat.habitatBuildings, function(d, c) {
        if (c.getIdentifierWithoutLevel().replace(" ", "").toLowerCase() == "library") {
          b = c.primaryKey
        }
      });
      mHabitatView.openHabitat(true);
      openKnowledgeAndMissionView(b, $(this).metadata().primaryKey)
    });
    $(".startedMission").click(function() {
      var b = 0;
      $.each(mPlayer.currentHabitat.habitatBuildings, function(d, c) {
        if (c.getIdentifierWithoutLevel().replace(" ", "").toLowerCase() == "tavern") {
          b = c.primaryKey
        }
      });
      mHabitatView.openHabitat(true);
      openKnowledgeAndMissionView(b, $(this).metadata().primaryKey)
    })
  } else {
    $("div.right50>div.content").empty()
  }
};
ReportsView.prototype.getReportHeadline = function(a) {
  var b = "";
  if (a.type == 1 || a.type == 9) {
    b = mStringtable.getValueOf("Defense Report")
  } else {
    if (a.type == 11 || a.type == 10) {
      b = mStringtable.getValueOf("Battle Report")
    } else {
      if (a.type == 6 || a.type == 14 || a.type == 15) {
        b = mStringtable.getValueOf("Transit Report")
      } else {
        if (a.type == 3) {
          b = mStringtable.getValueOf("Knowledge researched report")
        } else {
          if (a.type == 2) {
            b = mStringtable.getValueOf("Mission Report")
          } else {
            if (a.type == 7 || a.type == 13) {
              b = mStringtable.getValueOf("Spy Report")
            } else {
              if (a.type == 8) {
                if (a.battleType == 2) {
                  b = mStringtable.getValueOf("Battle Report")
                } else {
                  b = mStringtable.getValueOf("Defense Report")
                }
              }
            }
          }
        }
      }
    }
  }
  return b
};
ReportsView.prototype.setSelection = function(a) {
  $("select#reporttype").val(a);
  if (a == "all") {
    $("table.reports a.report").parent().parent().show()
  } else {
    $("table.reports a.report:not(reporttype_" + a + ")").parent().parent().hide();
    $("table.reports a.reporttype_" + a).parent().parent().show()
  }
  $("div.cleft").scrollTop(0)
};
ReportsView.prototype.showAllianceReport = function(a) {
  $.tmpl("allianceReportDetailTmpl", a).appendTo($("div.reportdetail").empty());
  windowSize();
  if (mReportsView.currentScrollValue2 > 0) {
    $("div.reportScroll").scrollTop(mReportsView.currentScrollValue2)
  } else {
    $("div.reportScroll").scrollTop(0)
  }
  $("div.statuslink").click(function() {
    mAllianceView.getAllianceInformation($(this).metadata().allianceId)
  });
  $("table.allianceReportSelect").click(function() {
    $("table.allianceReportSelect").each(function() {
      if ($("table.allianceReportSelect").hasClass("isSelected")) {
        $("table.allianceReportSelect").removeClass("isSelected");
        $("table.allianceRe6portSelect").addClass("notSelected")
      }
    });
    $(this).addClass("isSelected")
  });
  $("div.playerProfilelink").click(function() {
    playerProfileCloseButton = true;
    openExternPlayerProfile($(this).metadata().playerId)
  });
  $("#prevAllianceReports").click(function() {
    mPlayer.prevPage(mPlayer.reports.length);
    $("#allianceReportsNumbers").text(mPlayer.currentItems.start + 1 + " - " + mPlayer.currentItems.end + " / " + mPlayer.reports.length);
    mAllianceView.initReportsView();
    return false
  });
  $("#nextAllianceReports").click(function() {
    mPlayer.nextPage(mPlayer.reports.length);
    $("#allianceReportsNumbers").text(mPlayer.currentItems.start + 1 + " - " + mPlayer.currentItems.end + " / " + mPlayer.reports.length);
    mAllianceView.initReportsView();
    return false
  })
};
ReportsView.prototype.allianceReportsCallback = function(b) {
  mReportsView.selectedReports = 0;
  if (b.error) {
    if (b.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(b.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(b.error))
    }
  } else {
    mReportsView.currentScrollValue2 = 0;
    var c = new Array();
    if (b.allianceReportArray) {
      $.each(b.allianceReportArray, function(d, e) {
        c.push(new AllianceReport(e))
      });
      c.sort(function(e, d) {
        if (e.date.getTime() > d.date.getTime()) {
          return -1
        } else {
          return +1
        }
      })
    }
    mPlayer.setReports(c);
    $.tmpl("allianceReportsViewTmpl", mPlayer).appendTo($("div#reports").empty());
    windowSize();
    $(".noscroll").height($(".fullscreeninnerWithHeadlineAndPapyrus").height() * 0.8);
    $("a.report").click(function() {
      mReportsView.currentScrollValue2 = $("div.reportScroll").scrollTop();
      mReportsView.reportId = c[$(this).metadata().reportId].id;
      var d = c[$(this).metadata().reportId];
      mReportsView.showAllianceReport(d)
    });
    if (c.length > 0) {
      $("table.allianceReportSelect:first").removeClass("notSelected").addClass("isSelected");
      mReportsView.reportId = c[0].id;
      var a = c[0];
      mReportsView.showAllianceReport(a)
    }
    unblockUI()
  }
};
ReportsView.prototype.toggleReportCopyButton = function(d) {
  if (d.error) {
    if (d.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(d.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(d.error))
    }
  } else {
    var c, e = d.report.id, b = mReportsView.arrayAll, a = b.length;
    for (c = 0; c < a; c++) {
      if (b[c].id == e) {
        b[c].published = d.report.published;
        break
      }
    }
    if (d.report.published) {
      $("div#copyreport").show();
      $("div#publishreport .publishedIcon").show()
    } else {
      $("div#copyreport").hide();
      $("div#publishreport .publishedIcon").hide()
    }
  }
};
function Resource(c, b, a) {
  this.identifier = c;
  this.primaryKey = b;
  this.order = a
}
function Session(a) {
  this.sessionTimeout = parseInt(a);
  this.countdown = parseInt(a);
  this.secoundsForBlock = mSessionSecoundsForBlock;
  this.updates = new Array()
}
Session.prototype.countDown = function() {
  this.countdown--;
  if (this.countdown < this.sessionTimeout / 2) {
    this.addJob(SESSIONJOBTYPE.SESSION)
  }
  this.secoundsForBlock--;
  if (this.secoundsForBlock == 0) {
    this.updateSession()
  }
};
Session.prototype.resetCountDown = function() {
  this.countdown = this.sessionTimeout
};
Session.prototype.resetJobs = function() {
  this.updates = new Array();
  this.secoundsForBlock = mSessionSecoundsForBlock
};
Session.prototype.addJob = function(a) {
  this.updates.push(a)
};
Session.prototype.updateSession = function() {
  if (this.updates.length > 0) {
    var a = {};
    a.PropertyListVersion = propertyListVersion;
    a[mPlayer.userIdentifier] = mPlayer.getHash();
    genericAjaxRequest("SessionAction/update", a, "Session.updateCallbackWithoutRepaint")
  } else {
    this.secoundsForBlock = mSessionSecoundsForBlock
  }
};
Session.updateCallback = function(a) {
  unblockUI();
  mSession.resetJobs();
  if (!a.error) {
    mSession.resetCountDown();
    mPlayer.updateData(a.player);
    setGlobalNightModus(a);
    globalTouchDate = a.touchDate;
    mTopBar.changeCurrentHabitatFromPlayer();
    if (!mCurrentActionBlocked) {
      mBottomBar.callLastView()
    }
  } else {
    if (a.error == "No session.") {
      window.clearInterval(timeoutId);
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, false, false, false);
      mBottomBar.callLastView()
    }
  }
};
Session.updateCallbackWithoutRepaint = function(a) {
  unblockUI();
  mSession.resetJobs();
  if (!a.error) {
    mSession.resetCountDown();
    mPlayer.updateData(a.player);
    globalTouchDate = a.touchDate;
    setGlobalNightModus(a);
    if (!mCurrentActionBlocked) {
      mBottomBar.callLastView()
    }
  } else {
    if (a.error == "No session.") {
      window.clearInterval(timeoutId);
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, false, false, false);
      mBottomBar.callLastView()
    }
  }
};
Session.error = function() {
  this.secoundsForBlock = 100000
};
function jsonp_errorSessionUpdate(a, c, b) {
  if (a.status != 200 && a.readyState != 4) {
    mSession.resetCountDown();
    mSession.secoundsForBlock = 60
  }
}
function Settings(c, b, a) {
  this.habitatResourcesCapacityColors = c;
  this.maxItemsInBuildingList = b;
  this.maxItemsInRecruitingList = a;
  this.maxDiscussionTitleLength = null;
  this.allianceReportDaysOfExpiry = null;
  this.newbieProtectionDays = null;
  this.maxForumNameLength = null;
  this.spyAttackSecondsPerField = null;
  this.nightDefenseEndHour = null;
  this.reportDaysOfExpiry = null;
  this.maxAllianceDescriptionLength = null;
  this.maxForumThreadTopicLength = null;
  this.conquerHabitatMultiplier = null;
  this.secondsBetweenBattleRounds = null;
  this.maxForumMessageContentLength = null;
  this.maxDiscussionEntryContentLength = null;
  this.nightDefenseStartHour = null;
  this.militaryCampDaysValid = null;
  this.nightDefenseModifier = null;
  this.battleDamageModifier = null;
  this.minAmountForTurnBasedBattleSystem = null;
  this.maxRankingListItemsPerPage = 50
}
function Settings(b) {
  var a = new Array();
  $.each(b.habitatResourcesCapacityColors, function(c, d) {
    if (c == 0) {
      d.color = "#55683D"
    } else {
      if (c == 1) {
        d.color = "#E28B36"
      } else {
        d.color = "#B23116"
      }
    }
    a.push(d)
  });
  this.habitatResourcesCapacityColors = a;
  this.maxItemsInBuildingList = null;
  this.maxItemsInRecruitingList = null;
  this.maxDiscussionTitleLength = null;
  this.allianceReportDaysOfExpiry = null;
  this.newbieProtectionDays = null;
  this.maxForumNameLength = null;
  this.spyAttackSecondsPerField = null;
  this.nightDefenseEndHour = null;
  this.reportDaysOfExpiry = null;
  this.maxAllianceDescriptionLength = null;
  this.maxForumThreadTopicLength = null;
  this.conquerHabitatMultiplier = null;
  this.secondsBetweenBattleRounds = null;
  this.maxForumMessageContentLength = null;
  this.maxDiscussionEntryContentLength = null;
  this.nightDefenseStartHour = null;
  this.militaryCampDaysValid = null;
  this.nightDefenseModifier = null;
  this.battleDamageModifier = null;
  this.minAmountForTurnBasedBattleSystem = null;
  this.maxRankingListItemsPerPage = 50;
  this.newbieProtectionDays = null;
  this.minimumVacationHours = null;
  this.vacationDelayHours = null;
  this.yearlyVacationHours = null;
  this.massMarketCastleCount = null;
  this.massMissionCastleCount = null
}
Settings.prototype.updateData = function(a) {
  this.maxItemsInBuildingList = getValueFromJSON(a.habitatBuildingUpgradeListBoundary);
  this.maxItemsInRecruitingList = getValueFromJSON(a.habitatUnitRecruitingListBoundary);
  this.maxDiscussionTitleLength = getValueFromJSON(a["Discussion.title.length"]);
  this.allianceReportDaysOfExpiry = getValueFromJSON(a.allianceReportDaysOfExpiry);
  this.newbieProtectionDays = getValueFromJSON(a.newbieProtectionDays);
  this.maxForumNameLength = getValueFromJSON(a["Forum.name.length"]);
  this.spyAttackSecondsPerField = getValueFromJSON(a.spyAttackSecondsPerField);
  this.nightDefenseEndHour = getValueFromJSON(a.nightDefenseEndHour);
  this.reportDaysOfExpiry = getValueFromJSON(a.reportDaysOfExpiry);
  this.maxAllianceDescriptionLength = getValueFromJSON(a["Alliance.descriptionText.length"]);
  this.maxForumThreadTopicLength = getValueFromJSON(a["ForumThread.topic.length"]);
  this.conquerHabitatMultiplier = getValueFromJSON(a.conquerHabitatMultiplier);
  this.secondsBetweenBattleRounds = getValueFromJSON(a.secondsBetweenBattleRounds);
  this.maxForumMessageContentLength = getValueFromJSON(a["ForumMessage.content.length"]);
  this.maxDiscussionEntryContentLength = getValueFromJSON(a["DiscussionEntry.content.length"]);
  this.nightDefenseStartHour = getValueFromJSON(a.nightDefenseStartHour);
  this.militaryCampDaysValid = getValueFromJSON(a.militaryCampDaysValid);
  this.nightDefenseModifier = getValueFromJSON(a.nightDefenseModifier);
  this.battleDamageModifier = getValueFromJSON(a.battleDamageModifier);
  this.minAmountForTurnBasedBattleSystem = getValueFromJSON(a.minAmountForTurnBasedBattleSystem);
  this.maxRankingListItemsPerPage = 50;
  this.newbieProtectionDays = getValueFromJSON(a.newbieProtectionDays);
  this.minimumVacationHours = getValueFromJSON(a.minimumVacationHours);
  this.vacationDelayHours = getValueFromJSON(a.vacationDelayHours);
  this.yearlyVacationHours = getValueFromJSON(a.yearlyVacationHours);
  this.massMarketCastleCount = getValueFromJSON(a.massMarketCastleCount);
  this.massMissionCastleCount = getValueFromJSON(a.massMissionCastleCount)
};
function Sound() {
  this.play = true
}
Sound.prototype.isPlaying = function() {
  return this.play
};
Sound.prototype.start = function() {
  this.play = true
};
Sound.prototype.stop = function() {
  this.play = false
};
var ITEMTYPE = {PROFILE_VIEW_ITEM: 1, ALLIANCE_VIEW_ITEM: 2, HABITAT_VIEW_ITEM: 3, BUILDINGDETAIL_VIEW_ITEM: 4, UNITDETAIL_VIEW_ITEM: 5, EXCHANGE_VIEW_ITEM: 6, MISSION_VIEW_ITEM: 7, TROOPS_VIEW_ITEM: 8, MESSAGES_VIEW_ITEM: 9, REPORTS_VIEW_ITEM: 10, BUILDINGLIST_VIEW_ITEM: 11, RECRUITINGLIST_VIEW_ITEM: 12, TROOPACTIONS_VIEW_ITEM: 13, MAP_VIEW: 14, GOLD_VIEW: 15, NEW_ALLIANCE_VIEW: 16};
function StackItem(a, c, b) {
  this.itemType = a;
  this.functionname = c;
  if (typeof b != "undefined") {
    this.objectID = b
  } else {
    this.objectID = null
  }
  this.internCallingSequence = new Array();
  this.additionalParameter = null;
  this.habitatDependency = mPlayer.currentHabitat.id
}
StackItem.prototype.addSequenceItem = function(a) {
  this.internCallingSequence.push(a)
};
StackItem.prototype.equalsItem = function(a) {
  if (this.itemType != a.itemType) {
    return false
  } else {
    if (this.objectID != null && (a.objectID == null || this.objectID != a.objectID)) {
      return false
    } else {
      if (this.additionalParameter != null && this.additionalParameter != a.additionalParameter) {
        return false
      } else {
        return(this.functionname == a.functionname)
      }
    }
  }
};
StackItem.prototype.recallView = function() {
  if (this.internCallingSequence.length > 0) {
    $.each(this.internCallingSequence, function(a, b) {
      b.recallView()
    });
    this.callFunction()
  } else {
    this.callFunction()
  }
};
StackItem.prototype.callFunction = function() {
  var a;
  if (this.itemType == ITEMTYPE.MISSION_VIEW_ITEM || this.itemType == ITEMTYPE.BUILDINGDETAIL_VIEW_ITEM) {
    a = mPlayer.currentHabitat.getBuildingByOrder(this.objectID)
  } else {
    a = this.objectID
  }
  if (this.objectID != null) {
    if (this.additionalParameter == null) {
      this.functionname(a)
    } else {
      if (this.itemType == ITEMTYPE.TROOPS_VIEW_ITEM) {
        this.functionname(this.additionalParameter)
      } else {
        if (this.itemType == ITEMTYPE.REPORTS_VIEW_ITEM) {
          mReportsView.modus = false;
          mReportsView.spyReport = false;
          this.functionname(a)
        } else {
          this.functionname(a, this.additionalParameter)
        }
      }
    }
  } else {
    this.functionname()
  }
};
function Stringtable() {
  this.table
}
Stringtable.prototype.setUpTable = function(b) {
  var a = [];
  $.ajax({type: "GET", url: b, dataType: "json", async: false, success: function(c) {
      $.each(c, function(d, e) {
        a[d] = e
      })
    }});
  this.table = a
};
Stringtable.prototype.getValueOf = function(a) {
  var b = this.table[a];
  if (b == null || b == "") {
    b = "??" + a + "??"
  }
  return b
};
Stringtable.prototype.setValueOf = function(a, b) {
  this.table[a] = b
};
function TopBar() {
  this.curHabitateIndex;
  this.cur_hab_id;
  this.habitate = [];
  this.isOpenCastleList = false;
  this.isNavigateHabitates = false
}
TopBar.prototype.setIsOpenCastleList = function(a) {
  this.isOpenCastleList = a
};
TopBar.prototype.getIsOpenCastleList = function() {
  return this.isOpenCastleList
};
TopBar.prototype.setIsNavigateHabitates = function(a) {
  this.isNavigateHabitates = a
};
TopBar.prototype.getIsNavigateHabitates = function() {
  return this.isNavigateHabitates
};
TopBar.prototype.setHabitate = function() {
  var b = [];
  $.each(mPlayer.getSortedHabitate(), function(a, c) {
    b.push({id: c.id, name: c.name})
  });
  this.habitate = b;
  if (this.curHabitateIndex == undefined) {
    this.setCurHabitateIndex(0);
    this.cur_hab_id = this.habitate[0].id
  } else {
    this.setCurHabitateIndex(this.findIndexById(this.cur_hab_id))
  }
};
TopBar.prototype.findIndexById = function(b) {
  var a = -1;
  $.each(this.habitate, function(c, d) {
    if (d.id == b) {
      a = c
    }
  });
  return a
};
TopBar.prototype.setCurHabitateIndex = function(a) {
  if (isNaN(a)) {
    return false
  }
  this.curHabitateIndex = a;
  this.cur_hab_id = this.habitate[a].id
};
TopBar.prototype.getCurHabitateIndex = function() {
  return this.curHabitateIndex
};
TopBar.prototype.navigateHabitates = function(a) {
  if (a == true) {
    if (this.getCurHabitateIndex() < this.habitate.length - 1) {
      this.setCurHabitateIndex(this.getCurHabitateIndex() + 1);
      $("#btn_hab_name").html(this.habitate[this.getCurHabitateIndex()].name);
      this.changeCurrentHabitatFromPlayer()
    }
  } else {
    if (this.getCurHabitateIndex() > 0) {
      this.setCurHabitateIndex(this.getCurHabitateIndex() - 1);
      $("#btn_hab_name").html(this.habitate[this.getCurHabitateIndex()].name);
      this.changeCurrentHabitatFromPlayer()
    }
  }
};
TopBar.prototype.changeHabitate = function(a) {
  if (isNaN(a)) {
    return false
  }
  this.setCurHabitateIndex(this.findIndexById(a));
  $("#btn_hab_name").html(this.habitate[this.getCurHabitateIndex()].name);
  this.changeCurrentHabitatFromPlayer();
  mTopBar.isOpenCastleList = false
};
TopBar.prototype.changeCurrentHabitatFromPlayer = function() {
  this.setHabitate();
  mPlayer.setCurrentHabitat(mTopBar.getCurHabitateIndex());
  $.tmpl("topBarTmpl", mPlayer).appendTo($("div.topbar").empty());
  $("#gameVersion").text(window.mGameVersion);
  setHover("div.navigation");
  $("a.coins").click(function() {
    openBuyGoldView()
  });
  $("a#previousHabitat").click(function() {
    mTopBar.setIsNavigateHabitates(true);
    mTopBar.navigateHabitates(false)
  });
  $("#nextHabitat").click(function() {
    mTopBar.setIsNavigateHabitates(true);
    mTopBar.navigateHabitates(true)
  });
  $(".habitatesSelect").click(function() {
    openCastleList()
  });
  mTopBar.changePreviousIcon();
  mTopBar.changeNextIcon();
  $("div.resource").tooltip({track: true, delay: 0, showURL: false, showBody: " - ", extraClass: "pretty", fixPNG: true, opacity: 0.95, left: 0});
  Maphab.set_hab(mPlayer.currentHabitat.mapX, mPlayer.currentHabitat.mapY);
  if (mBottomBar.stacksEmpty() == false) {
    if (mTopBar.getIsOpenCastleList() && mTopBar.getIsNavigateHabitates()) {
      mTopBar.changeSelHabInList()
    } else {
      if (str_mCurrentAction == "openMap") {
        if (mTopBar.getIsOpenCastleList()) {
          str_mCurrentAction = "";
          boardSetup()
        } else {
          mapActions.execute();
          Arrow_removal.init();
          Arrow_removal.init()
        }
        mTopBar.setIsOpenCastleList(false)
      } else {
        if (str_mCurrentAction == "openPolMap") {
          if (this.getIsOpenCastleList()) {
            str_mCurrentAction = "";
            boardSetup()
          } else {
          }
          mapActions.execute_default();
          mTopBar.setIsOpenCastleList(false)
        } else {
          mBottomBar.callLastView()
        }
      }
    }
  }
  mTopBar.setIsNavigateHabitates(false);
  if (mResolution == "2x") {
    $(".topbar").addClass("topbar2x");
    $(".resField_Mid").addClass("resField_Mid2x");
    $(".resField_Right").addClass("resField_Right2x");
    $(".resField_Left").addClass("resField_Left2x");
    switchImages()
  }
  setHover("div.habitatesSelect")
};
TopBar.prototype.changeCurrentHabitatFromPlayer2 = function() {
  this.setHabitate();
  mPlayer.setCurrentHabitat(mTopBar.getCurHabitateIndex());
  $.tmpl("topBarTmpl", mPlayer).appendTo($("div.topbar").empty());
  setHover("div.navigation")
};
TopBar.prototype.changeSelHabInList = function() {
  var a = this.cur_hab_id;
  $(".btn_hab").removeClass("currenthabitat");
  $("#btn_hab_" + a).addClass("currenthabitat")
};
TopBar.prototype.changePreviousIcon = function() {
  if (mTopBar.getCurHabitateIndex() <= 0) {
    $("a#previousHabitat").addClass("disabled");
    $("a#previousHabitat > img").attr("src", "pictures/Buttons/ButtonArrow_Left_disabled.png")
  } else {
    $("a#previousHabitat").removeClass("disabled");
    $("a#previousHabitat > img").attr("src", "pictures/Buttons/ButtonArrow_Left_enabled.png")
  }
};
TopBar.prototype.changeNextIcon = function() {
  if (mTopBar.getCurHabitateIndex() >= this.habitate.length - 1) {
    $("a#nextHabitat").addClass("disabled");
    $("a#nextHabitat > img").attr("src", mPath_Images + mDir_Buttons + "ButtonArrow_Right_disabled.png")
  } else {
    $("a#nextHabitat").removeClass("disabled");
    $("a#nextHabitat > img").attr("src", mPath_Images + mDir_Buttons + "ButtonArrow_Right_enabled.png")
  }
};
TopBar.prototype.addToBody = function() {
  $("#" + mDivId).append('<div class="topbar clearFloat"></div>')
};
function Transit(c, b) {
  this.habitatId = c;
  this.transitType = getValueFromJSON(b.transitType);
  this.destinationETA = jsonDateToDate(getValueFromJSON(b.destinationETA));
  this.resources = makeKeyValueArrayFromJSON(b.resourceDictionary);
  this.units = null;
  if (b.unitDictionary) {
    var a = new Array();
    $.each(b.unitDictionary, function(f, e) {
      var d = mUnits[f].clone();
      d.setCount(e);
      a.push(d)
    });
    $.each(mUnits, function(d, g) {
      var f = false;
      $.each(a, function(h, j) {
        if (g.primaryKey == j.primaryKey) {
          f = true;
          return(false)
        }
      });
      if (!f) {
        var e = g.clone();
        e.setCount(0);
        a.push(e)
      }
    });
    a.sort(function(e, d) {
      if (e.order < d.order) {
        return -1
      } else {
        return +1
      }
    });
    this.units = a
  }
  this.generatedTransitId = new String(this.destinationETA.getTime());
  this.generatedTransitId += ("_" + this.transitType);
  this.sourceHabitat = null;
  if (b.sourceHabitat) {
    this.sourceHabitat = new Habitat(b.sourceHabitat);
    this.generatedTransitId += ("_" + this.sourceHabitat.id)
  }
  this.destinationHabitat = null;
  if (b.destinationHabitat) {
    this.destinationHabitat = new Habitat(b.destinationHabitat);
    this.generatedTransitId += ("_" + this.destinationHabitat.id)
  }
}
Transit.prototype.getPictureByType = function() {
  var a;
  if (this instanceof Transit) {
    a = this
  } else {
    a = this.data
  }
  if (a.transitType == TRANSITTYPE.DEFENSE) {
    return mPath_Images + mDir_Icons + "TransitDefense.png"
  } else {
    if (a.transitType == TRANSITTYPE.TRANSIT_DEFENSE) {
      return mPath_Images + mDir_Icons + "TransitDefenseReturn.png"
    } else {
      if (a.transitType == TRANSITTYPE.ATTACKER) {
        return mPath_Images + mDir_Icons + "TransitAttack.png"
      } else {
        if (a.transitType == TRANSITTYPE.TRANSIT_ATTACKER) {
          return mPath_Images + mDir_Icons + "TransitAttackReturn.png"
        } else {
          if (a.transitType == TRANSITTYPE.TRANSPORT) {
            return mPath_Images + mDir_Icons + "TransitTransport.png"
          } else {
            if (a.transitType == TRANSITTYPE.TRANSIT_TRANSPORT) {
              return mPath_Images + mDir_Icons + "TransitTransportReturn.png"
            } else {
              if (a.transitType == TRANSITTYPE.SPY) {
                return mPath_Images + mDir_Icons + "TransitSpy.png"
              } else {
                if (a.transitType == TRANSITTYPE.TRANSIT_SPY) {
                  return mPath_Images + mDir_Icons + "TransitSpyReturn.png"
                }
              }
            }
          }
        }
      }
    }
  }
};
Transit.prototype.updateTimeToComplete = function() {
  var a = this.destinationETA - (new Date() - mTimeDifferenceToServer);
  if (a >= 0) {
    $("span#transit_" + this.generatedTransitId).html(secToTimeStr(Math.round(a / (1000))) + " - " + formatDateTime(this.destinationETA))
  } else {
    mSession.addJob(SESSIONJOBTYPE.TRANSIT);
    mPlayer.habitate[this.habitatId].deleteTransitFormList(this.generatedTransitId)
  }
};
function UniqueID() {
  this.uniqueID = 0
}
UniqueID.prototype.getID = function() {
  return this.uniqueID++
};
function Unit(n, e, k, h, o, g, m, c, f, j, b, d, l, a) {
  this.primaryKey = n;
  this.order = e;
  this.identifier = k;
  this.buildResources = h;
  this.buildDuration = o;
  this.buildSpeedupCost = g;
  this.volumeResource = m;
  this.volumeAmount = c;
  this.storeAmount = f;
  this.storeResources = j;
  this.secondsPerField = b;
  this.corps = d;
  this.battleValues = l;
  this.requiredKnowledges = a
}
function Unit(a) {
  this.primaryKey = getValueFromJSON(a.primaryKey);
  this.order = getValueFromJSON(a.order);
  this.identifier = getValueFromJSON(a.identifier);
  this.buildResources = makeKeyValueArrayFromJSON(a.buildResourceDictionary);
  this.buildDuration = getValueFromJSON(a.buildDuration);
  this.buildSpeedupCost = getValueFromJSON(a.buildSpeedupCost);
  this.volumeResource = getValueFromJSON(a.volumeResource);
  this.volumeAmount = getValueFromJSON(a.volumeAmount);
  this.storeAmount = getValueFromJSON(a.storeAmount);
  this.storeResources = makePointerArray(a.storeResourceArray, mResources, false);
  this.secondsPerField = getValueFromJSON(a.secondsPerField);
  this.corps = getValueFromJSON(a.corps);
  this.battleValues = null;
  if (a.battleValueDictionary) {
    var b = new Array();
    $.each(a.battleValueDictionary, function(d, c) {
      b.push(new BattleValue(d, c))
    });
    this.battleValues = b;
    this.battleValues.sort(function(d, c) {
      d = mStringtable.getValueOf(d.battleName).toLowerCase();
      c = mStringtable.getValueOf(c.battleName).toLowerCase();
      return(d == c) ? 0 : (d > c) ? 1 : -1
    })
  }
  this.requiredKnowledges = makePointerArray(a.requiredKnowledgeArray, mKnowledges, false);
  this.count = 0
}
Unit.prototype.clone = function() {
  var a = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i == "clone") {
      continue
    }
    if (this[i] && typeof this[i] == "object") {
      a[i] = this[i]
    } else {
      a[i] = this[i]
    }
  }
  return a
};
Unit.prototype.getMovement = function() {
  return $.sprintf(mStringtable.getValueOf("%0.1f minutes per field"), (this.data.getSecoundsPerField() / 60))
};
Unit.prototype.getSecoundsPerField = function() {
  var a = 1;
  $.each(mPlayer.currentHabitat.habitatModifier, function(c, b) {
    if (b.type == MODIFIERTYPE.MOVEMENTSPEED) {
      if (jQuery.inArray("Unit", b.targets) > -1) {
        a += (b.percentage - 1)
      }
    }
  });
  if (a == 1) {
    return this.secondsPerField
  } else {
    return Math.floor(this.secondsPerField * new Number(a.toFixed(2)))
  }
};
Unit.prototype.getDescription = function() {
  return mStringtable.getValueOf("BKServerUnit-" + this.data.primaryKey)
};
Unit.prototype.getBuildDuration = function(a, d) {
  var c = mPlayer.currentHabitat;
  if (c.id != d) {
    $.each(mPlayer.habitate, function(e, f) {
      if (f.id == d) {
        c = f
      }
    })
  }
  var b = 1;
  $.each(c.habitatModifier, function(f, e) {
    if (e.type == MODIFIERTYPE.BUILDSPEED) {
      if (jQuery.inArray("Unit", e.targets) > -1) {
        b = e.percentage
      }
    }
  });
  if (b == 1) {
    return a
  } else {
    return Math.floor(a * new Number(b.toFixed(2)))
  }
};
Unit.prototype.setCount = function(a) {
  this.count = a
};
Unit.prototype.getTranslatedIdentifier = function() {
  return mStringtable.getValueOf(this.identifier)
};
Unit.prototype.getMaxRecruiting = function(c) {
  var b = this;
  var a = 100000000;
  $.each(b.buildResources, function(e, d) {
    if (c.habitatResources[e].amount / d < a) {
      a = c.habitatResources[e].amount / d
    }
  });
  if ((c.habitatResources[4].storeAmount - c.habitatResources[4].amount) / b.volumeAmount < a) {
    a = (c.habitatResources[4].storeAmount - c.habitatResources[4].amount) / b.volumeAmount
  }
  return Math.floor(a)
};
Unit.prototype.getMax = function(c) {
  var b = this.data;
  var a = 100000000;
  if (b.isRecruitable(c)) {
    $.each(b.buildResources, function(e, d) {
      if (c.habitatResources[e].amount / d < a) {
        a = c.habitatResources[e].amount / d
      }
    });
    if ((c.habitatResources[4].storeAmount - c.habitatResources[4].amount) / b.volumeAmount < a) {
      a = (c.habitatResources[4].storeAmount - c.habitatResources[4].amount) / b.volumeAmount
    }
  } else {
    a = 0
  }
  return Math.floor(a)
};
Unit.prototype.getImageSrc = function() {
  return mPath_Images + mDir_Units + this.identifier + "Icon.png"
};
Unit.prototype.isRecruitable = function(c) {
  var b;
  var a = true;
  if (this instanceof Unit) {
    b = this
  } else {
    b = this
  }
  if (!c) {
    c = mPlayer.currentHabitat
  }
  if (b.requiredKnowledges) {
    $.each(b.requiredKnowledges, function(e, d) {
      if (!c.habitatKnowledges[d.primaryKey]) {
        a = false;
        return(false)
      }
    })
  }
  if (b.identifier == "Oxcart") {
    $.each(c.getSortedBuildings(), function(d, e) {
      var f = e.identifier;
      if (f.substr(0, 6) == "Market") {
        if (e.units[10002] == null) {
          a = false
        }
      }
    })
  }
  return a
};
function event_unit_build() {
  thisUnit.buildConfirm(habitat, amount, true)
}
Unit.prototype.build = function(d, b) {
  if (b) {
    if (!d) {
      d = mPlayer.currentHabitat
    }
    if (d.habitatUnitOrders.length >= mSettings.maxItemsInRecruitingList) {
      var a;
      if (this instanceof Unit) {
        a = this
      } else {
        a = this.data
      }
      var c = mStringtable.getValueOf("Gold");
      $("#ui-dialog-title-dialog-confirm").text(mStringtable.getValueOf("Additional order slot"));
      $("#dialog-confirm").attr("title", mStringtable.getValueOf("Additional order slot"));
      $("#dialog-confirm > p").html($.sprintf(mStringtable.getValueOf("Your unit order queue is full. An additional slot costs %d %@\nYou have %d %@"), this.buildSpeedupCost * b, c, mPlayer.gold, c));
      $("#dialog:ui-dialog").dialog("destroy");
      $("#dialog-confirm").dialog({resizable: false, width: 375, modal: true, draggable: false, buttons: [{text: mStringtable.getValueOf("cancel"), click: function() {
              $(this).dialog("close")
            }}, {text: mStringtable.getValueOf("ok"), click: function() {
              $(this).dialog("close");
              a.buildConfirm(d, b, true)
            }}]})
    } else {
      this.buildConfirm(d, b, false)
    }
  }
};
Unit.prototype.buildConfirm = function(e, c, a) {
  var b;
  if (this instanceof Unit) {
    b = this
  } else {
    b = this.data
  }
  blockUI("HabitatAction/buildUnit");
  var d = {};
  d.primaryKey = this.primaryKey;
  d.orderAmount = c;
  d.paymentGranted = a;
  d.habitatID = e.id;
  d.PropertyListVersion = propertyListVersion;
  d[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("HabitatAction/buildUnit", d, "Session.updateCallback")
};
function event_unit_speedup(b) {
  blockUI("HabitatAction/speedupBuildUnit");
  var a = {};
  a.id = b;
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("HabitatAction/speedupBuildUnit", a, "Session.updateCallback")
}
Unit.prototype.speedup = function(a) {
  var b = mStringtable.getValueOf("Gold");
  showPapyrusMsgBox($.sprintf(mStringtable.getValueOf("Reducing recruition time for %d x %@ costs %d %@. You have %d %@."), a.orderAmount, this.getTranslatedIdentifier(), (this.buildSpeedupCost * a.orderAmount), b, mPlayer.gold, b), mStringtable.getValueOf("Speedup recruiting"), event_unit_speedup, a.id, true)
};
function event_unit_finish(b) {
  blockUI("HabitatAction/finishBuildUnit");
  var a = {};
  a.id = b;
  a.PropertyListVersion = propertyListVersion;
  a[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("HabitatAction/finishBuildUnit", a, "Session.updateCallback")
}
Unit.prototype.finish = function(a) {
  var b = mStringtable.getValueOf("Gold");
  showPapyrusMsgBox($.sprintf(mStringtable.getValueOf("Finishing recruiting %d x %@ instantly costs %d %@. You have %d %@."), a.orderAmount, this.getTranslatedIdentifier(), (this.buildSpeedupCost * a.orderAmount), b, mPlayer.gold, b), mStringtable.getValueOf("Finish build"), event_unit_finish, a.id, true)
};
function UnitOrder(b, a) {
  this.habitatId = b;
  this.id = getValueFromJSON(a.id);
  this.unit = mUnits[getValueFromJSON(a.unitId)];
  this.complete = jsonDateToDate(getValueFromJSON(a.complete));
  this.durationFactor = getValueFromJSON(a.durationFactor);
  this.durationPerUnitInSeconds = getValueFromJSON(a.durationPerUnitInSeconds);
  this.orderAmount = getValueFromJSON(a.orderAmount);
  this.amountDone = 0
}
UnitOrder.prototype.isSpeededup = function() {
  if (this.durationFactor == 0.5) {
    return true
  } else {
    return false
  }
};
UnitOrder.prototype.isHalfDurationReached = function() {
  var b = (this.complete - (new Date() - mTimeDifferenceToServer)) / 1000;
  var c = this.durationPerUnitInSeconds * this.orderAmount;
  var a = b - c;
  if (a < 0) {
    a = 0
  }
  if (b < ((c / 2) + a)) {
    return true
  } else {
    return false
  }
};
UnitOrder.prototype.updateTimeToComplete = function() {
  var e = 0;
  var b = (Math.round((this.complete - (new Date() - mTimeDifferenceToServer)) / 1000));
  var d = b - (this.durationPerUnitInSeconds * this.orderAmount);
  if (d <= 0) {
    d = 0;
    e = (b % this.durationPerUnitInSeconds)
  } else {
    e = b
  }
  if (b > 0) {
    var a = $.sprintf(mStringtable.getValueOf("%@ - %d in %@"), secToTimeStr(Math.round(e)), this.orderAmount, secToTimeStr(Math.round(b)));
    var c = a.substring(11, a.length);
    $("span#unitOrder_" + this.id).html(a);
    $("span#unitOrderRecruitingList_" + this.id).html(c);
    if (e == 0) {
      mSession.addJob(SESSIONJOBTYPE.UNITORDER)
    }
  } else {
    mSession.addJob(SESSIONJOBTYPE.UNITORDER);
    mPlayer.habitate[this.habitatId].deleteUnitOrderFormList(this.id);
    $("table#" + this.id).remove();
    if ($("table#unitordertable").find("table").length == 0) {
      $("table#unitordertable").remove()
    }
  }
};
UnitOrder.prototype.getLastCompletionString = function() {
  return $.sprintf(mStringtable.getValueOf("Last recruitment done %@"), formatDateTime(this.complete))
};
(function(d) {
  function a(e) {
    return decodeURI((RegExp(e + "=(.+?)(&|$)").exec(d.location.search) || [, null])[1])
  }
  function c(f) {
    var e = null;
    if (f != undefined) {
      if (f == "0" || f == "1") {
        e = f
      } else {
        if (f == "false" || f == "true") {
          if (f == "false") {
            e = false
          } else {
            e = true
          }
        } else {
          if (f) {
            e = f
          } else {
            e = null
          }
        }
      }
    }
    return e
  }
  function b(e) {
    if (e) {
      var f = new Array();
      $.each(e, function(g, h) {
        f.push(h)
      });
      return f
    } else {
      return null
    }
  }
  d.getValueFromJSON = c;
  d.getURLParameter = a;
  d.makeValueArrayFromJSON = b
})(self || this);
(function(a) {
  a.namespace = function(c) {
    var e, g, f, d, b;
    g = c.split(".");
    f = a;
    for (d = 0, b = g.length; d < b; d++) {
      e = g[d];
      if (f[e] == null) {
        f[e] = {}
      }
      f = f[e]
    }
  }
}(this));
(function() {
  namespace("utils.clipboard");
  var d = null, c = null;
  function g(j, h) {
    if (h == null) {
      c = null
    } else {
      c = h
    }
    d = j
  }
  function b() {
    return d
  }
  function f() {
    return c
  }
  function e() {
    if (d == null) {
      return true
    }
    return false
  }
  function a() {
    d = null;
    c = null
  }
  utils.clipboard.set = g;
  utils.clipboard.get = b;
  utils.clipboard.getType = f;
  utils.clipboard.isEmpty = e;
  utils.clipboard.clear = a
})();
function makeKeyValueArrayFromJSON(a) {
  if (a) {
    var b = {};
    $.each(a, function(c, d) {
      b[c] = d
    });
    return b
  } else {
    return null
  }
}
function makePointerArray(b, a, d) {
  if (b) {
    var c = {};
    $.each(b, function(e, f) {
      if (d) {
        c[e] = a[e]
      } else {
        c[f] = a[f]
      }
    });
    return c
  } else {
    return null
  }
}
function makeOrderdPointerArray(c, a) {
  if (c) {
    var e = 0;
    $.each(c, function(f, g) {
      e++
    });
    var d = {};
    for (var b = 1; b < e + 1; b++) {
      $.each(c, function(f, g) {
        if (a[f].order == b) {
          d[f] = a[f];
          return -1
        } else {
          return 1
        }
      })
    }
    return d
  } else {
    return null
  }
}
function jsonDateToDate(b) {
  if (b) {
    var e = b.split(/[a-zA-Z\s]/);
    var c = e[0].split("-");
    var f = e[1].split(":");
    var d = new Date(c[0], c[1] - 1, c[2], f[0], f[1], f[2]);
    var a = d.getTimezoneOffset() * 60 * 1000;
    d.setTime(d.getTime() - a);
    return d
  } else {
    return null
  }
}
function secToTimeStr(c) {
  var a = parseInt(c / 3600);
  var b = parseInt((c - (a * 3600)) / 60);
  var d = c - (a * 3600) - (b * 60);
  return((a < 10) ? "0" + a : a) + ":" + ((b < 10) ? "0" + b : b) + ":" + ((d < 10) ? "0" + d : d)
}
function formatDateTime(b) {
  var c = (b.getDate() < 10) ? "0" + b.getDate() : b.getDate();
  var f = ((b.getMonth() + 1) < 10) ? "0" + (b.getMonth() + 1) : (b.getMonth() + 1);
  var e = b.getFullYear();
  var a = (b.getHours() < 10) ? "0" + b.getHours() : b.getHours();
  var d = (b.getMinutes() < 10) ? "0" + b.getMinutes() : b.getMinutes();
  return c + "." + f + "." + e + " " + a + ":" + d
}
function formatDateTimeForNightModus(b) {
  var a = (b.getHours() < 10) ? "0" + b.getHours() : b.getHours();
  var c = (b.getMinutes() < 10) ? "0" + b.getMinutes() : b.getMinutes();
  return a + ":" + c
}
function formatShortDateTime(a) {
  var b = (a.getDate() < 10) ? "0" + a.getDate() : a.getDate();
  var d = ((a.getMonth() + 1) < 10) ? "0" + (a.getMonth() + 1) : (a.getMonth() + 1);
  var c = a.getFullYear();
  return b + d + c
}
function showFormatShortDateTime(a) {
  var b = (a.getDate() < 10) ? "0" + a.getDate() : a.getDate();
  var d = ((a.getMonth() + 1) < 10) ? "0" + (a.getMonth() + 1) : (a.getMonth() + 1);
  var c = a.getFullYear();
  return b + "." + d + "." + c
}
function setHover(a) {
  $(a + " div.hoverable").each(function() {
    bindHoverHandler($(this))
  })
}
function bindHoverHandler(a) {
  $(a).mouseover(function() {
    $(a).find("div").each(function() {
      var c = "hover_";
      var b = $(this).attr("class");
      if (b.indexOf("iconbutton") > -1) {
        $(this).attr("class", c.concat(b))
      }
    })
  });
  $(a).mouseout(function() {
    $(a).find("div").each(function() {
      var b = $(this).attr("class");
      if (b.indexOf("iconbutton") == 6) {
        $(this).attr("class", b.substr(6))
      }
    })
  })
}
function setDisabled(a) {
  $(a).find("div").each(function() {
    var c = "_disabled";
    var b = $(this).attr("class");
    $(this).attr("class", b.concat(c))
  })
}
function setEnabled(a) {
  $(a).find("div").each(function() {
    var b = $(this).attr("class");
    $(this).attr("class", b.substr(0, b.length - 9))
  })
}
function getCssWithOutPx(a) {
  if (a) {
    return a.substring(0, a.indexOf("px"))
  } else {
    return 0
  }
}
function removeFromArray(c, a) {
  var b = {};
  $.each(c, function(e, d) {
    if (e != a) {
      b[e] = c[e]
    }
  });
  return b
}
function checkArrayLength(b) {
  var a = 0;
  $.each(b, function(c, d) {
    a += 1
  });
  return(a > 0)
}
var mIsBlocked = false;
function blockUI(a) {
  mIsBlocked = true;
  $.msg({fadeIn: 200, fadeOut: 100, timeOut: 500, bgPath: "pictures/", autoUnblock: false, clickUnblock: false, content: mStringtable.getValueOf(a), method: "prependTo", z: 99999, center: {topPercentage: 0.5}})
}
function unblockUI() {
  $.msg("unblock");
  $("body").css("cursor", "default");
  mIsBlocked = false;
  return false
}
function setRoundCornersForSmallBoxes(a) {
  var b = "";
  var c = "";
  var d = "";
  $(a).each(function(e) {
    mBoxId++;
    b = "<table class='buttonborder tablecenter smallBoxTable'></table>";
    c = "<tr id='small_tr_" + mBoxId + "'></tr>";
    d = "<td id='small_td_" + mBoxId + "' class='cellcenter'></td>";
    $(this).wrap(b);
    $(this).wrap(c);
    $(this).wrap(d);
    $("#small_tr_" + mBoxId).before("<tr>   <td class='smallCorner_UpperLeft hasHeightAndWidth'></td>    <td class='smallBorder_Upper hasHeight'></td>   <td class='smallCorner_UpperRight hasHeightAndWidth'></td></tr>");
    $("#small_tr_" + mBoxId).after("<tr>   <td class='smallCorner_LowerLeft hasHeightAndWidth'></td>   <td class='smallBorder_Lower hasHeight'></td>   <td class='smallCorner_LowerRight hasHeightAndWidth'></td></tr>");
    $("#small_td_" + mBoxId).before("<td class='smallBorder_Left hasWidth'></td>");
    $("#small_td_" + mBoxId).after("<td class='smallBorder_Right hasWidth'></td>")
  })
}
function setRoundCornersForBigBoxes(a) {
  var b = "";
  var c = "";
  var d = "";
  $(a).each(function(e) {
    mBoxId++;
    b = "<table class='tableborder tablecenter bigBoxTable'></table>";
    c = "<tr id='big_tr_" + mBoxId + "'></tr>";
    d = "<td id='big_td_" + mBoxId + "'></td>";
    $(this).wrap(b);
    $(this).wrap(c);
    $(this).wrap(d);
    $("#big_tr_" + mBoxId).before("<tr>   <td class='transCorner_UpperLeft hasHeightAndWidth'></td>    <td class='border_Upper hasHeight'></td>   <td class='transCorner_UpperRight hasHeightAndWidth'></td></tr>");
    $("#big_tr_" + mBoxId).after("<tr>   <td class='transCorner_LowerLeft hasHeightAndWidth'></td>   <td class='border_Lower hasHeight'></td>   <td class='transCorner_LowerRight hasHeightAndWidth'></td></tr>");
    $("#big_td_" + mBoxId).before("<td class='border_Left hasWidth'></td>");
    $("#big_td_" + mBoxId).after("<td class='border_Right hasWidth'></td>")
  })
}
function setRoundCornersForHalfSidePapyrusBigBoxes(a) {
  var b = "";
  var c = "";
  var d = "";
  $(a).each(function(e) {
    mBoxId++;
    b = "<table class='tableborder tablecenter bigBoxTable'></table>";
    c = "<tr id='big_tr_" + mBoxId + "'></tr>";
    d = "<td id='big_td_" + mBoxId + "'></td>";
    $(this).wrap(b);
    $(this).wrap(c);
    $(this).wrap(d);
    $("#big_tr_" + mBoxId).before("<tr>   <td class='corner_UpperLeft hasHeightAndWidth'></td>    <td class='border_Upper hasHeight'></td>   <td class='corner_UpperRight hasHeightAndWidth'></td></tr>");
    $("#big_tr_" + mBoxId).after("<tr>   <td class='corner_LowerLeft hasHeightAndWidth'></td>   <td class='border_Lower hasHeight'></td>   <td class='corner_LowerRight hasHeightAndWidth'></td></tr>");
    $("#big_td_" + mBoxId).before("<td class='border_Left hasWidth'></td>");
    $("#big_td_" + mBoxId).after("<td class='border_Right hasWidth'></td>")
  })
}
function setPapyrusBackgroundForGameBoardContainer() {
}
function setPapyrusBackgroundForMapViewContainer() {
  $(".isPapyrusOrnament .inner").wrapAll("<div class='papyruscontent'></div>");
  $(".isPapyrusOrnament .papyruscontent").before(getString())
}
function setPapyrusBackgroundForFullScreenView() {
  $(".isPapyrusOrnamentFullScreen .inner").wrapAll("<div class='papyruscontent'></div>");
  $(".isPapyrusOrnamentFullScreen .papyruscontent").before(getString())
}
function setPapyrusBackgroundForRightSide() {
  $(".isPapyrusOrnament").each(function() {
    $(this).find(".inner").wrapAll("<div class='papyruscontent'></div>");
    $(this).find(".papyruscontent").before(getString())
  })
}
function getString() {
  var a = '<div class="papyrusbg">   <table class="papyrusTable">    <tr class="a">      <td class="topLeft hasHeightAndWidth"></td>      <td class="topCenterLeft varWidth hasHeight"></td>      <td class="topCenterRight varWidth hasHeight"></td>      <td class="topRight hasHeightAndWidth"></td>    </tr>    <tr class="b">      <td class="middleTopLeft hasWidth"></td>      <td class="middleTopCenterLeft varWidth varHeight"></td>      <td class="middleTopCenterRight varWidth varHeight"></td>      <td class="middleTopRight hasWidth"></td>    </tr>    <tr class="c">      <td class="middleBottomLeft hasWidth"></td>      <td class="middleBottomCenterLeft varWidth varHeight"></td>      <td class="middleBottomCenterRight varWidth varHeight"></td>      <td class="middleBottomRight hasWidth"></td>    </tr>    <tr class="d">      <td class="bottomLeft hasHeightAndWidth"></td>      <td class="bottomCenterLeft varWidth hasHeight"></td>      <td class="bottomCenterRight varWidth hasHeight"></td>      <td class="bottomRight hasHeightAndWidth"></td>    </tr>  </table></div>';
  return a
}
function getBgDivForKarte() {
  var a = '<div class="papyrusbg"><img src="pictures/Browser/Background/PapyrusBackground_Top@2x.png" class="papyrusbg_top"><img class="papyrusbg_left" src="pictures/Browser/Background/PapyrusBackground_Left@2x.png"><img class="papyrusbg_bottom" src="pictures/Browser/Background/PapyrusBackground_Bottom@2x.png"><img class="papyrusbg_right" src="pictures/Browser/Background/PapyrusBackground_right@2x.png"></div>';
  return a
}
function switchPapyrusBackgroundImage() {
  if (mResolution == "default") {
    setBackgroundImageUrlsToDefault(".papyrusbg .papyrusTable tr td");
    setBackgroundImageDimensionsDefault(".papyrusbg .papyrusTable", mPapyrusSize1x, mPapyrusSize1x)
  }
  if (mResolution == "2x") {
    setBackgroundImageUrlsTo2x(".papyrusbg .papyrusTable tr td");
    setBackgroundImageDimensions2x(".papyrusbg .papyrusTable", mPapyrusSize2x, mPapyrusSize2x)
  }
}
function switchRoundCornersForBigBoxes() {
  if (mResolution == "default") {
    setBackgroundImageUrlsToDefault(".bigBoxTable tr td");
    setBackgroundImageDimensionsDefault(".bigBoxTable", mCornersBigBoxSize1x, mCornersBigBoxSize1x)
  }
  if (mResolution == "2x") {
    setBackgroundImageUrlsTo2x(".bigBoxTable tr td");
    setBackgroundImageDimensions2x(".bigBoxTable", mCornersBigBoxSize2x, mCornersBigBoxSize2x)
  }
}
function switchRoundCornersForSmallBoxes() {
  if (mResolution == "default") {
    setBackgroundImageUrlsToDefault(".smallBoxTable tr td");
    setBackgroundImageDimensionsDefault(".smallBoxTable", mCornersSmallBoxSize1x, mCornersSmallBoxSize1x)
  }
  if (mResolution == "2x") {
    setBackgroundImageUrlsTo2x(".smallBoxTable tr td");
    setBackgroundImageDimensions2x(".smallBoxTable", mCornersSmallBoxSize2x, mCornersSmallBoxSize2x)
  }
}
function switchImages() {
  if (mResolution == "default") {
    $(".switchImage").each(function(a) {
      setImageSourceUrlToDefault($(this))
    })
  }
  if (mResolution == "2x") {
    $(".switchImage").each(function(a) {
      setImageSourceUrlTo2x($(this))
    })
  }
}
function setImageSourceUrlTo2x(b) {
  var c = b.attr("src");
  var a = c.indexOf(".png");
  var e = c.indexOf("@2x");
  if (a > -1 && e == -1) {
    var d = c.slice(0, a) + "@2x" + c.slice(a);
    b.attr("src", d)
  }
}
function setImageSourceUrlToDefault(b) {
  var c = b.attr("src");
  var a = c.indexOf("@2x");
  if (a > -1) {
    var d = c.slice(0, a) + c.slice(a + 3);
    b.attr("src", d)
  }
}
function setBackgroundImageUrlsTo2x(a) {
  var c;
  var d;
  var b;
  var e;
  $(a).each(function(f) {
    c = $(this).css("background-image");
    f = c.indexOf(".png");
    e = c.indexOf("@2x");
    if (f > -1 && e == -1) {
      d = c.slice(0, f) + "@2x" + c.slice(f);
      $(this).css("background-image", d)
    }
  })
}
function setBackgroundImageUrlsToDefault(a) {
  var c;
  var d;
  var b;
  $(a).each(function(e) {
    c = $(this).css("background-image");
    e = c.indexOf("@2x");
    if (e > -1) {
      d = c.slice(0, e) + c.slice(e + 3);
      $(this).css("background-image", d)
    }
  })
}
function setBackgroundImageDimensions2x(b, c, a) {
  $(b + " .hasHeight").each(function(d) {
    $(this).css("height", a)
  });
  $(b + " .hasWidth").each(function(d) {
    $(this).css("width", c)
  });
  $(b + " .hasHeightAndWidth").each(function(d) {
    $(this).css("height", a);
    $(this).css("width", c)
  })
}
function setBackgroundImageDimensionsDefault(b, c, a) {
  $(b + " .hasHeight").each(function(d) {
    $(this).css("height", a)
  });
  $(b + " .hasWidth").each(function(d) {
    $(this).css("width", c)
  });
  $(b + " .hasHeightAndWidth").each(function(d) {
    $(this).css("height", a);
    $(this).css("width", c)
  })
}
function switchIDs() {
  if (mResolution == "default") {
    $("#mapViewContainer2x").attr("id", "mapViewContainer");
    $("#mapFullScreenContainer2x").attr("id", "mapFullScreenContainer");
    $("#mapHabitatView2x").attr("id", "mapHabitatView");
    $("#mapHabitatFullView2x").attr("id", "mapHabitatFullView");
    $("#mapFullViewHeadlineContainer2x").attr("id", "mapFullViewHeadlineContainer");
    $("#mapHeadlineOrnamentLeft2x").attr("id", "mapHeadlineOrnamentLeft");
    $("#mapFullViewHeadline2x").attr("id", "mapFullViewHeadline");
    $("#mapHeadlineOrnamentRight2x").attr("id", "mapHeadlineOrnamentRight");
    $("#mapCloseButtonContainer2x").attr("id", "mapCloseButtonContainer")
  }
  if (mResolution == "2x") {
    $("#mapViewContainer").attr("id", "mapViewContainer2x");
    $("#mapFullScreenContainer").attr("id", "mapFullScreenContainer2x");
    $("#mapHabitatView").attr("id", "mapHabitatView2x");
    $("#mapHabitatFullView").attr("id", "mapHabitatFullView2x");
    $("#mapFullViewHeadlineContainer").attr("id", "mapFullViewHeadlineContainer2x");
    $("#mapHeadlineOrnamentLeft").attr("id", "mapHeadlineOrnamentLeft2x");
    $("#mapFullViewHeadline").attr("id", "mapFullViewHeadline2x");
    $("#mapHeadlineOrnamentRight").attr("id", "mapHeadlineOrnamentRight2x");
    $("#mapCloseButtonContainer").attr("id", "mapCloseButtonContainer2x")
  }
}
function getRandomInt(b, a) {
  return Math.floor(Math.random() * (a - b + 1)) + b
}
Object.size = function(c) {
  var b = 0, a;
  for (a in c) {
    if (c.hasOwnProperty(a)) {
      b++
    }
  }
  return b
};
Object.getFirstKeyInDict = function(b) {
  var a;
  for (a in b) {
    break
  }
  return a
};
Object.getFirstObjectInDict = function(a) {
  return a[Object.getFirstKeyInDict(a)]
};
function navigateBack() {
  mBottomBar.popFromStack()
}
function brUnEscape(c) {
  var b = c;
  var a = new RegExp("&lt;");
  b = b.replace(a, "<");
  a = new RegExp("&gt;");
  b = b.replace(a, " />");
  a = new RegExp("\\n");
  b = b.replace(a, "<br/>");
  return b
}
Array.prototype.indexOfExtra = function(b) {
  var a = this.length >>> 0;
  var c = Number(arguments[1]) || 0;
  c = (c < 0) ? Math.ceil(c) : Math.floor(c);
  if (c < 0) {
    c += a
  }
  for (; c < a; c++) {
    if (c in this && this[c] === b) {
      return c
    }
  }
  return -1
};
Array.prototype.in_array = function(c) {
  for (var b = 0, a = this.length; b < a; b++) {
    if (c === this[b]) {
      return true
    }
  }
  return false
};
var Animation_controller = {img_base_path: {lumber: "Lumberjack/anim-lumber", towerguard: "TowerGuard/archer-anim", farmsmoke: "FarmSmoke/smoke", wallguard: "WallGuard/Wallguard", wallguard2: "WallGuard2/Wallguard"}, images_size: {lumber: 10, towerguard: 9, farmsmoke: 8, wallguard: 23, wallguard2: 26}, names: ["lumber", "towerguard", "farmsmoke", "wallguard", "wallguard2"], cache: {lumber: [], towerguard: [], farmsmoke: [], wallguard: [], wallguard2: []}, timer: {}, rc: "", r: "", resolution: "notset", change_r: false, set_resolution: function() {
    this.change_r = true;
    if (mResolution == "2x") {
      this.r = "@2x";
      this.rc = "_2x"
    } else {
      this.r = "";
      this.rc = ""
    }
    if (mResolution == this.resolution) {
      this.change_r = false
    }
    this.resolution = mResolution
  }, preload: function() {
    this.set_resolution();
    if (this.change_r == false) {
      return
    }
    var c = [];
    var f = "";
    var b = this.names.length;
    for (var d = 0; d < b; d++) {
      f = "pictures/Animations/" + this.img_base_path[this.names[d]];
      c = [];
      len = this.images_size[this.names[d]];
      for (var e = 0; e < len; e++) {
        var a = document.createElement("img");
        a.src = f + String(e) + this.r + ".png";
        c.push(a)
      }
      this.cache[this.names[d]] = c
    }
  }, start: function() {
    var e = Math.floor(Math.random() * this.names.length);
    var f = this.names[e];
    var a = this.images_size[f];
    var d = 0;
    var c = this.cache[f];
    var b = this.rc;
    window.clearInterval(this.timer);
    $("#anim").removeClass().addClass("anim_" + f + b);
    this.timer = window.setInterval(function() {
      $("#anim").empty().append(c[d]);
      d++;
      if (!$("#anim").hasClass("anim_" + f + b)) {
        $("#anim").addClass("anim_" + f + b)
      }
      if (d > a - 1) {
        d = 0
      }
    }, 200)
  }};
function set_timer_for_handler_flag() {
  setTimeout(execute_timer_for_handler_flag, 1000)
}
function execute_timer_for_handler_flag() {
  HandlerFlag.reset()
}
var HandlerFlag = {centerHabitat: true, switchMap: true, last_action: [], get_centerHabitat: function() {
    return this.centerHabitat
  }, set_centerHabitat: function(a) {
    this.centerHabitat = a;
    if (a === false) {
      this.last_action.push("center");
      setTimeout(set_timer_for_handler_flag, 1000);
      $("#centerHabitatButtonImage").css("cursor", "default")
    }
  }, get_switchMap: function() {
    return this.switchMap
  }, set_switchMap: function(a) {
    this.switchMap = a;
    if (a === false) {
      this.last_action.push("switch");
      set_timer_for_handler_flag();
      $("#wmapButtonImage").css("cursor", "default")
    }
  }, reset: function() {
    var a = this.last_action.shift();
    if (a == "center") {
      this.set_centerHabitat(true);
      $("#centerHabitatButtonImage").css("cursor", "pointer")
    } else {
      if (a == "switch") {
        this.set_switchMap(true);
        $("#wmapButtonImage").css("cursor", "pointer")
      }
    }
  }};
function register_map_events() {
  $("#centerHabitatButtonImage").bind("click", handlerForCenterHabitat);
  $("#wmapButtonImage").bind("click", handlerForWmapButtonClick)
}
function handlerForWmapButtonClick(a) {
  if (HandlerFlag.get_switchMap()) {
    if (Mapcenter.get_map_type() == "politisch") {
      Mapcenter.set_map_type("normal");
      go_to_nmap(wmap.map_view_center_left, wmap.map_view_center_top, false)
    } else {
      if (Mapcenter.get_map_type() == "normal") {
        Mapcenter.set_map_type("politisch");
        wmap.start()
      } else {
        throw"handlerForWmapButtonClick"
      }
    }
    HandlerFlag.set_switchMap(false)
  }
  a.preventDefault();
  a.stopPropagation()
}
function handlerForCenterHabitat(a) {
  if (HandlerFlag.get_centerHabitat()) {
    if (Mapcenter.get_map_type() == "politisch") {
      Mapcenter.setXY(mPlayer.currentHabitat.mapX, mPlayer.currentHabitat.mapY);
      wmap.start()
    } else {
      if (Mapcenter.get_map_type() == "normal") {
        mapActions.reset();
        Nmap.set_load_method("");
        boardSetup()
      } else {
        throw"handlerForWmapButtonClick"
      }
    }
    HandlerFlag.set_centerHabitat(false)
  }
  a.preventDefault();
  a.stopPropagation()
}
function copy_player_link_Handler(a) {
  links.create("player", {id: a.data.player_id, worldID: worldID})
}
function copy_alliance_link_Handler(a) {
  links.create("alliance", {id: a, worldID: worldID})
}
function copy_castle_link_Handler(a) {
  links.create("castle", {x: a.data.x, y: a.data.y, worldID: worldID})
}
function copy_report_link_Handler(a) {
  links.create("report", {id: a.data.report_id, curHabitatID: a.data.habitat_id, worldID: worldID})
}
var Linksmaker = {input_string: "", process_string: "", output_string: "", player_search: /l\+k:\/\/player\?\d+/gi, player_expr: /(l\+k:\/\/player\?\d+)(&\d+)*/gi, castle_search: /l\+k:\/\/coordinates\?\d+,\d+/gi, castle_expr: /(l\+k:\/\/coordinates\?\d+,\d+)(&\d+)*/gi, alliance_search: /l\+k:\/\/alliance\?\d+/gi, alliance_expr: /(l\+k:\/\/alliance\?\d+)(&\d+)*/gi, report_search: /l\+k:\/\/report\?\d+/gi, report_expr: /(l\+k:\/\/report\?\d+)(&\d+)(&\d+)*/gi, process: function(a) {
    if (a == undefined || a == null || a.length < 3) {
      return a
    }
    this.input_string = a;
    this.process_string = strip_tags(a);
    if (this.process_string.length < 13) {
      return this.process_string
    }
    this.output_string = "";
    this.search_player_link();
    if (this.output_string != "") {
      this.process_string = this.output_string + this.process_string;
      this.output_string = ""
    }
    this.search_castle_link();
    if (this.output_string != "") {
      this.process_string = this.output_string + this.process_string;
      this.output_string = ""
    }
    this.search_report_link();
    if (this.output_string != "") {
      this.process_string = this.output_string + this.process_string;
      this.output_string = ""
    }
    this.search_alliance_link();
    if (this.output_string == "") {
      this.output_string = this.process_string
    } else {
      if (this.process_string != "") {
        this.output_string += this.process_string
      }
    }
    return this.output_string
  }, search_player_link: function() {
    var h = this.process_string;
    pos = h.search(this.player_search);
    if (pos != -1) {
      this.player_expr.lastIndex = 0;
      var f = this.player_expr.exec(h);
      var j = f[1];
      var a = j.match(/\d+/g);
      a = parseInt(a[0]);
      var e = j.length + pos;
      var c = h.substring(0, pos);
      var b = h.substring(e);
      var g = f[2];
      if (g != undefined) {
        g = g.substring(1);
        if (g == worldID) {
          j = '<a href="javascript:void()" id="p' + a + '" class="internal_link">' + j + "&" + g + "</a>";
          var d = g.length + 1;
          b = b.substring(d)
        }
      } else {
        j = '<a href="javascript:void()" id="p' + a + '" class="internal_link">' + j + "</a>"
      }
      if (b.length > 14) {
        this.process_string = b;
        this.output_string += c + j;
        this.search_player_link()
      } else {
        this.output_string += c + j + b;
        this.process_string = ""
      }
    }
  }, search_castle_link: function() {
    var g = this.process_string;
    var j = g.search(this.castle_search);
    if (j != -1) {
      this.castle_expr.lastIndex = 0;
      var f = this.castle_expr.exec(g);
      var k = f[1];
      var d = k.length + j;
      var b = g.substring(0, j);
      var a = g.substring(d);
      var l = k.match(/\d+/g);
      var m = parseInt(l[0]);
      var h = parseInt(l[1]);
      var e = f[2];
      if (e != undefined) {
        e = e.substring(1);
        if (e == worldID) {
          k = '<a href="javascript:void()" id="c' + m + "_" + h + '" class="internal_link">' + k + "&" + e + "</a>";
          var c = e.length + 1;
          a = a.substring(c)
        }
      } else {
        k = '<a href="javascript:void()" id="c' + m + "_" + h + '" class="internal_link">' + k + "</a>"
      }
      if (a.length > 19) {
        this.process_string = a;
        this.output_string += b + k;
        this.search_castle_link()
      } else {
        this.output_string += b + k + a;
        this.process_string = ""
      }
    }
  }, search_alliance_link: function() {
    var g = this.process_string;
    var h = g.search(this.alliance_search);
    if (h != -1) {
      this.alliance_expr.lastIndex = 0;
      var f = this.alliance_expr.exec(g);
      var j = f[1];
      var k = j.match(/\d+/g);
      k = parseInt(k[0]);
      var d = j.length + h;
      var b = g.substring(0, h);
      var a = g.substring(d);
      var e = f[2];
      if (e != undefined) {
        e = e.substring(1);
        if (e == worldID) {
          j = '<a href="javascript:void()" id="a' + k + '" class="internal_link">' + j + "&" + e + "</a>";
          var c = e.length + 1;
          a = a.substring(c)
        }
      } else {
        j = '<a href="javascript:void()" id="a' + k + '" class="internal_link">' + j + "</a>"
      }
      if (a.length > 15) {
        this.process_string = a;
        this.output_string += b + j;
        this.search_alliance_link()
      } else {
        this.output_string += b + j + a;
        this.process_string = ""
      }
    }
  }, search_report_link: function() {
    var h = this.process_string;
    var j = h.search(this.report_search);
    if (j != -1) {
      this.report_expr.lastIndex = 0;
      var g = this.report_expr.exec(h);
      var k = g[1];
      var d = k.match(/\d+/g);
      d = parseInt(d[0]);
      var e = k.length + j;
      var b = h.substring(0, j);
      var a = h.substring(e);
      var l = g[2];
      var f = g[3];
      if (f != undefined) {
        f = f.substring(1);
        l = l.substring(1);
        if (f == worldID) {
          k = '<a href="javascript:void()" id="r' + d + "#" + l + '" class="internal_link">' + k + "&" + l + "&" + f + "</a>";
          var c = f.length + 1;
          var m = l.length + 1;
          a = a.substring(c + m)
        }
      } else {
        k = '<a href="javascript:void()" id="r' + d + '" class="internal_link">' + k + "</a>"
      }
      if (a.length > 13) {
        this.process_string = a;
        this.output_string += b + k;
        this.search_report_link()
      } else {
        this.output_string += b + k + a;
        this.process_string = ""
      }
    }
  }, };
var Actionslinks = {open_player_view: function(a) {
    if (isNaN(a)) {
      return false
    }
    if (a != mPlayer.id) {
      openExternPlayerProfile(a)
    } else {
      openPlayerView()
    }
  }, open_castle_map: function(b) {
    var g = b.match(/\d+/g);
    var a = parseInt(g[0]);
    var f = parseInt(g[1]);
    try {
      if (check_coordinates(a, f)) {
        throw"Actionslinks open_castle_map: X,Y is false [" + a + ";" + f + "]"
      }
      boardSetup(a, f, true)
    } catch (d) {
      boardSetup()
    }
  }, open_alliance_view: function(a) {
    openExternAllianceProfile(a)
  }, open_reports_view: function(b) {
    var c = b.split("#"), a = c[0], e = c[1], d = {};
    if (mReportsView == null) {
      mReportsView = new ReportsView(false, false)
    }
    blockUI("Loading...");
    d.PropertyListVersion = propertyListVersion;
    d[mPlayer.userIdentifier] = mPlayer.getHash();
    d.id = a;
    d.habitatID = e;
    genericAjaxRequest("ReportAction/reportInformation", d, "mReportsView.showReportOverlayCallback")
  }, openView: function(b) {
    var a = b.substring(0, 1);
    b = b.substring(1);
    switch (a) {
      case"p":
        Actionslinks.open_player_view(b);
        break;
      case"c":
        Actionslinks.open_castle_map(b);
        break;
      case"a":
        Actionslinks.open_alliance_view(b);
        break;
      case"r":
        Actionslinks.open_reports_view(b);
        break
      }
  }};
(function(c) {
  function e(g) {
    if (isNaN(g.id) || g.id < 1) {
      throw"create Links: ID is not a valid ID! [" + g.id + "]"
    }
    return true
  }
  function b(g) {
    if (c.check_coordinates(g.x, g.y)) {
      throw"make_castle_link: x,y are no real coordinates [" + g.x + "," + g.y + "]"
    }
    return true
  }
  var a = {player: e, alliance: e, report: e, castle: b};
  var d = {player: function(g) {
      return"l+k://player?" + g.id + "&" + g.worldID
    }, alliance: function(g) {
      return"l+k://alliance?" + g.id + "&" + g.worldID
    }, castle: function(g) {
      return"l+k://coordinates?" + g.x + "," + g.y + "&" + g.worldID
    }, report: function(g) {
      return"l+k://report?" + g.id + "&" + g.curHabitatID + "&" + g.worldID
    }};
  function f(g, j) {
    if (a[g](j)) {
      var h = d[g](j);
      utils.clipboard.set(h);
      return true
    }
    return false
  }
  namespace("links");
  links.create = f;
  links.get = utils.clipboard.get;
  namespace("buffer_links");
  buffer_links.get_link = utils.clipboard.get;
  buffer_links.is_link = function() {
    return !utils.clipboard.isEmpty()
  }
}(this));
function stripTags(a) {
  s = a.replace(/<\/?[^>]+>/gi, " ");
  s = strip_tags(a);
  return s
}
function strip_tags(g) {
  var l = "", h = false;
  var f = [];
  var a = ["br"];
  var j = "";
  var d = 0;
  var c = "";
  var e = "";
  var b = function(m, k, n) {
    return n.split(m).join(k)
  };
  g += "";
  f = g.match(/(<\/?[\S][^>]*>)/gi);
  for (l in f) {
    if (isNaN(l)) {
      continue
    }
    e = f[l].toString();
    h = false;
    for (c in a) {
      j = a[c];
      d = -1;
      if (d != 0) {
        d = e.toLowerCase().indexOf("<" + j + ">")
      }
      if (d != 0) {
        d = e.toLowerCase().indexOf("<" + j + "/>")
      }
      if (d != 0) {
        d = e.toLowerCase().indexOf("<" + j + " ")
      }
      if (d != 0) {
        d = e.toLowerCase().indexOf("</" + j)
      }
      if (d == 0) {
        h = true;
        break
      }
    }
    if (!h) {
      g = b(e, "", g)
    }
  }
  return g
}
var map_debug = false;
var blinking_timer;
var url_for_fb = "";
function load_map_template() {
  if ($("#" + map_view_target).length == 0) {
    $.tmpl("karteViewTmpl", mResolution).appendTo($("div.viewport").empty())
  } else {
  }
  window.clearInterval(blinking_timer);
  blinking_timer = setInterval(blinking, 1000)
}
function check_coordinates(a, b) {
  return(isNaN(a) || isNaN(b) || a < 0 || a > 32000 || b < 0 || b > 32000)
}
var blining_stat = 1;
function blinking() {
  if (str_mCurrentAction == "openMap") {
    if (blining_stat == 1) {
      $("span.attacked").removeClass("attacked_color");
      $("span.under_attack").removeClass("under_attack_color");
      blining_stat--
    } else {
      $("span.attacked").addClass("attacked_color");
      $("span.under_attack").addClass("under_attack_color");
      blining_stat++
    }
  }
}
var wst = {start: true, t: null, st: function() {
    if (this.t == null) {
      var a = this;
      this.t = setInterval(function() {
        if (a.start) {
          a.cb();
          window.clearInterval(a.t);
          a.t = null
        }
        a.start = true
      }, 500)
    }
  }, s: function() {
    this.start = false;
    this.st()
  }, cb: function() {
  }};
function fb_send() {
  var b = encodeURIComponent("220177808035948");
  var f = encodeURIComponent(mStringtable.getValueOf("fbCaptureCastleLink"));
  var a = encodeURIComponent("http://lordsandknights.com");
  var e = encodeURIComponent(mStringtable.getValueOf("fbCaptureCastleName"));
  var c = encodeURIComponent(mStringtable.getValueOf("fbCaptureCastlePicture"));
  var g = encodeURIComponent(mStringtable.getValueOf("fbCaptureCastleDescription"));
  window.open("https://www.facebook.com/dialog/feed?app_id=" + b + "&redirect_uri=" + a + "&display=page&link=" + f + "&picture=" + c + "&name=" + e + "&description=" + g + "&show_error=true", "Fasebook", "toolbar=0,status=0,width=800,height=600");
  return false
}
function create_url_for_fb() {
  var c = encodeURIComponent("220177808035948");
  var g = encodeURIComponent(mStringtable.getValueOf("fbCaptureCastleLink"));
  var b = encodeURIComponent("http://lordsandknights.com");
  var f = encodeURIComponent(mStringtable.getValueOf("fbCaptureCastleName"));
  var e = encodeURIComponent(mStringtable.getValueOf("fbCaptureCastlePicture"));
  var h = encodeURIComponent(mStringtable.getValueOf("fbCaptureCastleDescription"));
  var a = "https://www.facebook.com/dialog/feed?app_id=" + c + "&redirect_uri=" + b + "&display=page&link=" + g + "&picture=" + e + "&name=" + f + "&description=" + h + "&show_error=true";
  return a
}
var Mapcenter = new function() {
  var g = -1;
  var f = -1;
  var k = 0;
  var j = 0;
  var c = true;
  var b = 0;
  var a = 0;
  var e = "normal";
  var d = 0;
  var h = 0;
  this.get_info = function() {
  };
  this.setIsHabInCenter = function(l) {
    c = l;
    if (l) {
      Nmap_container.reset_stack()
    }
  };
  this.getIsHabInCenter = function() {
    return c
  };
  this.get_map_type = function() {
    return e
  };
  this.set_map_type = function(l) {
    e = l
  };
  this.get_x = function() {
    return g
  };
  this.set_x = function(l) {
    g = l
  };
  this.get_y = function() {
    return f
  };
  this.set_y = function(l) {
    f = l
  };
  this.setXY = function(l, m) {
    if (map_debug && check_coordinates(l, m)) {
      throw"Mapcenter params is false [" + l + ";" + m + "]"
    }
    this.set_x(l);
    this.set_y(m);
    this.setIsHabInCenter(true);
    this.set_tile_XY();
    this.view_width = Math.round($("#" + map_view_target).width());
    this.view_height = Math.round($("#" + map_view_target).height())
  };
  this.updateXY_window_size = function() {
    var l = this.view_width - map_view_width;
    var m = this.view_height - map_view_height;
    this.updateXY(l, m);
    this.view_width = Math.round($("#" + map_view_target).width());
    this.view_height = Math.round($("#" + map_view_target).height());
    Nmap_container.update_stack_window_size(l, m)
  }, this.updateXY = function(m, l) {
    if (this.get_map_type() == "normal") {
      g -= (m / stepSize_left);
      f -= (l / stepSize_top);
      this.setIsHabInCenter(false);
      Nmap.set_reload(true)
    } else {
      if (this.get_map_type() == "politisch") {
        g -= (m / 16);
        f -= (l / 16)
      } else {
        if (map_debug) {
          throw" map_type is undefined "
        }
      }
    }
  };
  this.get_tile_x = function() {
    if (map_debug && (isNaN(k) || k < 1)) {
      throw"center tile_x is false"
    }
    return k
  };
  this.get_tile_y = function() {
    if (map_debug && (isNaN(j) || j < 1)) {
      throw"center tile_y is false"
    }
    return j
  };
  this.set_tile_XY = function() {
    var l = get_tile_round(this.get_x());
    var m = get_tile_round(this.get_y());
    if (map_debug && (isNaN(l) || isNaN(m) || l < 0 || m < 0)) {
      throw"set center tile coord  is false [" + this.get_x() + "," + this.get_y() + "]"
    }
    k = l;
    j = m
  };
  this.get_distance_tile_x = function() {
    return b
  };
  this.get_distance_tile_y = function() {
    return a
  };
  this.set_distance_tile_x = function(l) {
    b = l
  };
  this.set_distance_tile_y = function(l) {
    a = l
  };
  this.set_distance_tile = function() {
    this.set_distance_tile_x((k - Nmap_container.get_map_x()) * stepSize_left);
    this.set_distance_tile_y((j - Nmap_container.get_map_y()) * stepSize_top)
  };
  this.calc_center_tile = function() {
    var v = $("#" + map_all_target).offset();
    var l = map_view_center_left - v.left;
    var o = map_view_center_top - v.top;
    var n = Math.floor(l / tile_width);
    var u = Math.floor(o / tile_height);
    var m = u * Nmap_container.get_count_tile_x() + n;
    var t = json_data.map.tileArray[m].frame.origin.x;
    var r = json_data.map.tileArray[m].frame.origin.y;
    this.set_tile_XY(t, r);
    this.set_distance_tile()
  }
}(function(e) {
  var h = {list: []}, c = false;
  function b(j) {
    var k = $.jStorage.get(j, '{"list":[]}');
    h = $.parseJSON(k)
  }
  function g(j) {
    $.jStorage.set(j, JSON.stringify(h))
  }
  function f(k) {
    var j = k.data.id;
    d();
    var l = h.list.indexOf(j);
    if (l != -1) {
      h.list.splice(l, 1)
    } else {
      h.list.push(j)
    }
    g(e.mPlayer.id);
    generate_map();
    $("img.markedIcon").toggle()
  }
  function d() {
    if (c == false) {
      b(e.mPlayer.id);
      c = true
    }
    return h
  }
  function a(k) {
    var j = h.list.indexOf(k);
    if (j != -1) {
      return j
    }
    return
  }
  e.markCastleHandler = f;
  e.getMarkedCastles = d;
  e.castleMarked = a
}(this));
function ownHabitatViewHandler(a) {
  switch (a.data.id) {
    case 1:
      mapActions.setData(a.data.click);
      mapActions.setNameFoot("openDefendHabitatView");
      mapActions.execute();
      break;
    case 2:
      mapActions.setNameFoot("openSendResourcesView");
      mapActions.setData(a.data.click);
      mapActions.execute();
      break
    }
}
function foreignHabitatViewHandler(c) {
  switch (c.data.id) {
    case 1:
      openExternPlayerProfile(c.data.click.playerID);
      break;
    case 2:
      var b = {nick: c.data.click.playerName, points: c.data.click.playerPoints, alliancePermission: c.data.click.playerAllyPerm, alliance: c.data.click.playerAlly, id: c.data.click.playerID, rank: c.data.click.playerRank};
      var a = new Player(b);
      openSendMessageView(a);
      break;
    case 3:
      openExternAllianceProfile(c.data.click.allyID);
      break;
    case 4:
      if (mReportsView == null) {
        mReportsView = new ReportsView(false, true)
      }
      mReportsView.modus = false;
      mReportsView.spyReport = true;
      mReportsView.spyedHabitatID = c.data.click.habitatID;
      mReportsView.loadReports(6);
      break;
    case 5:
      mapActions.setNameFoot("openDefendHabitatView");
      mapActions.execute();
      break;
    case 6:
      mapActions.setNameFoot("openSendResourcesView");
      mapActions.execute();
      break;
    case 7:
      mapActions.setNameFoot("openAttackView");
      mapActions.execute();
      break;
    case 8:
      mapActions.setNameFoot("openSendSpyView");
      mapActions.execute();
      break
    }
}
function defendHabitatViewHandler(b) {
  if (b.data.id == "defendHabitat") {
    requestDefendHabitat(b.data.defendHabitat)
  }
  var c = distanceToHabitat(mPlayer.currentHabitat.mapX, mPlayer.currentHabitat.mapY, b.data.defendHabitat.destX, b.data.defendHabitat.destY);
  for (var a = 0; a <= b.data.defendHabitat.sourceUnits.length; a++) {
    if (b.data.id == a) {
      setMaxValue(b.data.defendHabitat, a);
      updateDuration(b.data.defendHabitat, c)
    }
  }
  if (b.data.id == "close") {
    closeOwnHabitatFullView()
  }
}
function sendResourcesViewHandler(b) {
  var c = distanceToHabitat(mPlayer.currentHabitat.mapX, mPlayer.currentHabitat.mapY, b.data.sendResources.destX, b.data.sendResources.destY);
  if (b.data.buttonType == "unitButton") {
    for (var a = 0; a <= b.data.sendResources.sourceUnits.length; a++) {
      if (b.data.id == a) {
        setMaxValue(b.data.sendResources, a, b.data.buttonType);
        updateDuration(b.data.sendResources, c);
        updateCapacity(b.data.sendResources)
      }
    }
  }
  if (b.data.buttonType == "resourceButton") {
    for (var a = 0; a <= b.data.sendResources.sourceResources.length; a++) {
      if (b.data.id == a) {
        setMaxValue(b.data.sendResources, b.data.id, b.data.buttonType);
        updateDuration(b.data.sendResources, c);
        updateCapacity(b.data.sendResources)
      }
    }
  }
  if (b.data.id == "sendResources") {
    requestSendResources(b.data.sendResources)
  }
}
function attackViewHandler(c) {
  var d = distanceToHabitat(mPlayer.currentHabitat.mapX, mPlayer.currentHabitat.mapY, c.data.attack.destX, c.data.attack.destY);
  c.data.attack.sourceUnits = mPlayer.currentHabitat.getHabitatUnits();
  var a = mPlayer.currentHabitat.habitatResources;
  c.data.attack.sourceSilverCount = a[6].getRoundedAmount();
  for (var b = 0; b <= c.data.attack.sourceUnits.length; b++) {
    if (c.data.id == b) {
      setMaxValue(c.data.attack, b);
      updateDuration(c.data.attack, d);
      updateCapacity(c.data.attack)
    }
  }
  if (c.data.id == "silver") {
    setMaxValue(c.data.attack, c.data.id);
    updateDuration(c.data.attack, d);
    updateCapacity(c.data.attack)
  }
  if (c.data.id == "attack") {
    requestAttack(c.data.attack)
  }
}
function sendSpyViewHandler(b) {
  var c = distanceToHabitat(mPlayer.currentHabitat.mapX, mPlayer.currentHabitat.mapY, b.data.sendSpy.destX, b.data.sendSpy.destY);
  var a = mPlayer.currentHabitat.habitatResources;
  b.data.sendSpy.sourceCopperCount = a[5].getRoundedAmount();
  if (b.data.id == "copper") {
    setMaxValue(b.data.sendSpy, b.data.id);
    updateDuration(b.data.sendSpy, c)
  }
  if (b.data.id == "sendSpy") {
    requestSendSpy(b.data.sendSpy)
  }
}
function validateOnBlur(e, c, d, b) {
  if (e.viewType == "attackView") {
    if (b.attr("id") == "attackSilverInput") {
      if (d > e.sourceSilverCount) {
        b.val(e.sourceSilverCount)
      }
    } else {
      if (d > e.sourceUnits[c].count) {
        b.val(e.sourceUnits[c].count)
      }
    }
  }
  if (e.viewType == "sendSpyView") {
    if (b.attr("id") == "sendSpyCopperInput") {
      if (d > e.sourceCopperCount) {
        b.val(e.sourceCopperCount)
      }
    }
  }
  if (e.viewType == "sendResourcesOwnHabitatView" || e.viewType == "sendResourcesForeignHabitatView") {
    var a = e.sourceUnits.length + e.sourceResources.length;
    if (c < (a - 3)) {
      if (d > e.sourceUnits[c].count) {
        b.val(e.sourceUnits[c].count)
      }
    } else {
      if (d > parseInt(e.sourceResources[c - e.sourceUnits.length].amount)) {
        b.val(parseInt(e.sourceResources[c - e.sourceUnits.length].amount))
      }
    }
  }
  if (e.viewType == "defendOwnHabitatView" || e.viewType == "defendForeignHabitatView") {
    if (d > e.sourceUnits[c].count) {
      b.val(e.sourceUnits[c].count)
    }
  }
}
function updateDuration(h, b) {
  var d = -1111;
  if (h.viewType == "attackView" || h.viewType == "sendResourcesOwnHabitatView" || h.viewType == "sendResourcesForeignHabitatView" || h.viewType == "defendOwnHabitatView" || h.viewType == "defendForeignHabitatView") {
    var n = [];
    var k = [];
    var g = [];
    var j = 0;
    var m = 0;
    $.each(mUnits, function(v, c) {
      k[j] = c.getSecoundsPerField();
      j++
    });
    $(".noButtonInputField").each(function(c) {
      var w = $(this).val();
      var v = parseInt(w);
      if (w == "") {
        v = 0
      }
      n[c] = v
    });
    for (var f = 0; f < j; f++) {
      if (n[f] != 0) {
        g[m] = k[f];
        m++
      }
    }
    d = getLongestDuration(g);
    if (isNaN(d)) {
      $(".noButtonTime").text(secToTimeStr(0));
      $(".noButtonTransportTime").text(secToTimeStr(0))
    } else {
      d *= b;
      $(".noButtonTime").text(secToTimeStr(d));
      var r = new Date().getTime();
      $(".noButtonTransportTime").text(formatDateTime(new Date((d * 1000) + r)))
    }
    var u = String(formatDateTimeForNightModus(new Date((d * 1000) + r)));
    var l = String(formatDateTimeForNightModus(worldDawn));
    var a = String(formatDateTimeForNightModus(worldDusk));
    var e = 0;
    u = parseInt(u.replace(/:/i, ""), [10]);
    l = parseInt(l.replace(/:/i, ""), [10]);
    a = parseInt(a.replace(/:/i, ""), [10]);
    if (worldDusk < worldDawn) {
      if (parseInt(formatDateTimeForNightModus(worldDawn), [10]) <= 0) {
        e = 2400
      } else {
        e = l
      }
    }
    if (e > 0) {
      l = e
    }
    if (u > a && u < l) {
      if (mResolution == "2x") {
        $(".dayOrNightIcon").attr("src", "pictures/Icons/NightIcon@2x.png")
      } else {
        $(".dayOrNightIcon").attr("src", "pictures/Icons/NightIcon.png")
      }
    } else {
      if (mResolution == "2x") {
        $(".dayOrNightIcon").attr("src", "pictures/Icons/DayIcon@2x.png")
      } else {
        $(".dayOrNightIcon").attr("src", "pictures/Icons/DayIcon.png")
      }
    }
  }
  if (h.viewType == "sendSpyView") {
    var o = $("#sendSpyCopperInput").val();
    if (isNaN(o) || o == 0) {
      $(".noButtonTime").text(secToTimeStr(0));
      $(".noButtonTransportTime").text(secToTimeStr(0))
    } else {
      d = mSettings.spyAttackSecondsPerField * b;
      $(".noButtonTime").text(secToTimeStr(d));
      var t = new Date().getTime();
      $(".noButtonTransportTime").text(formatDateTime(new Date((d * 1000) + t)))
    }
  }
}
function updateCapacity(f) {
  var e = [];
  var g = [];
  var c = 0;
  var d = 0;
  capacityCur = 0;
  capacityMax = 0;
  capacityLeft = 0;
  $.each(mUnits, function(j, h) {
    g[c] = h.storeAmount;
    c++
  });
  $(".unitsInput").each(function(h) {
    d = $(this).val();
    if (d == "") {
      d = 0
    }
    e[h] = d
  });
  for (var b = 0; b < c; b++) {
    if (e[b] != 0) {
      capacityMax += (g[b] * e[b]);
      capacityLeft = capacityMax
    }
  }
  if (f.viewType == "attackView") {
    capacityCur = $("#attackSilverInput").val();
    if (capacityCur == "") {
      capacityCur = 0
    }
  }
  if (f.viewType == "sendResourcesOwnHabitatView" || f.viewType == "sendResourcesForeignHabitatView") {
    $(".resourcesInput").each(function(h) {
      d = $(this).val();
      if (d == "") {
        d = 0
      }
      capacityCur += parseInt(d)
    });
    capacityLeft -= capacityCur
  }
  if (capacityCur > capacityMax) {
    capacityCur = 0
  }
  if (capacityCur == 0 && capacityMax != 0) {
    $("#capacity").addClass("capacityRed")
  } else {
    $("#capacity").removeClass("capacityRed")
  }
  if (capacityMax == 0) {
    $("#attackSilverInput").attr("disabled", "disabled");
    $("#silverMax").removeClass("hoverable");
    $("#silverMax").find("div.iconbutton_left").removeClass("iconbutton_left").addClass("iconbutton_left_disabled");
    $("#silverMax").find("div.iconbutton_right").removeClass("iconbutton_right").addClass("iconbutton_right_disabled");
    $("#silverMax").find("div.iconbutton_middle").removeClass("iconbutton_middle").addClass("iconbutton_middle_disabled");
    $("#attackSilverInput").val("")
  } else {
    $("#attackSilverInput").removeAttr("disabled", "disabled");
    $("#silverMax").addClass("hoverable");
    $("#silverMax").find("div.iconbutton_left_disabled").removeClass("iconbutton_left_disabled").addClass("iconbutton_left");
    $("#silverMax").find("div.iconbutton_right_disabled").removeClass("iconbutton_right_disabled").addClass("iconbutton_right");
    $("#silverMax").find("div.iconbutton_middle_disabled").removeClass("iconbutton_middle_disabled").addClass("iconbutton_middle")
  }
  var a = capacityCur + "/" + capacityMax;
  $(".noButtonCapacity").text(a)
}
function getLongestDuration(a) {
  a.sort(function(d, c) {
    return c - d
  });
  return a[0]
}
function acceptOnlyNumbers(a) {
  $(a).numeric({decimal: false, negative: false})
}
function setMaxValue(g, f, e) {
  if (g.viewType == "attackView") {
    for (var d = 0; d < g.sourceUnits.length; d++) {
      var a = "#unitInput" + d;
      if (f == d) {
        $(a).val(g.sourceUnits[f].count)
      }
    }
    if (f == "silver") {
      $("#attackSilverInput").val(g.sourceSilverCount)
    }
  }
  if (g.viewType == "sendSpyView") {
    if (f == "copper") {
      $("#sendSpyCopperInput").val(g.sourceCopperCount)
    }
  }
  if (g.viewType == "sendResourcesOwnHabitatView" || g.viewType == "sendResourcesForeignHabitatView") {
    if (e == "unitButton") {
      for (var d = 0; d < g.sourceUnits.length; d++) {
        var a = "#unitInput" + d;
        if (f == d) {
          $(a).val(g.sourceUnits[f].count)
        }
      }
    }
    if (e == "resourceButton") {
      for (var d = 0; d < g.sourceResources.length; d++) {
        var a = "#resourceInput" + d;
        var c = ".resourcesInputCount" + d;
        if (f == d) {
          if (typeof capacityLeft != "undefined" && capacityLeft >= 0) {
            if (capacityCur + parseInt($(c).text()) > capacityLeft) {
              if (capacityLeft > parseInt($(c).text())) {
                $(a).val(parseInt($(c).text()))
              } else {
                var b = parseInt($(a).val());
                if (isNaN(b)) {
                  b = 0
                }
                if ((capacityLeft + b) > parseInt($(c).text())) {
                  $(a).val(parseInt($(c).text()))
                } else {
                  $(a).val(capacityLeft + b)
                }
              }
            } else {
              $(a).val($(c).text())
            }
          } else {
            $(a).val(0)
          }
        }
      }
    }
  }
  if (g.viewType == "defendOwnHabitatView" || g.viewType == "defendForeignHabitatView") {
    for (var d = 0; d < g.sourceUnits.length; d++) {
      var a = "#unitInput" + d;
      if (f == d) {
        $(a).val(g.sourceUnits[f].count)
      }
    }
  }
}
function distanceToHabitat(j, f, h, g) {
  h = parseInt(h);
  g = parseInt(g);
  var b = 0, c = 0, l = 0, a = 0, k = 0;
  if (f & 1) {
    c = j + 0.5
  } else {
    c = j
  }
  l = f;
  if (g & 1) {
    a = h + 0.5
  } else {
    a = h
  }
  k = g;
  var e = Math.abs(a - c);
  var d = Math.abs(k - l);
  if (d * 0.5 >= e) {
    b = d
  } else {
    b = d * 0.5 + e
  }
  return b
}
function setGlobalNightModus(b) {
  var a = false;
  worldDusk = jsonDateToDate(b.worldDusk);
  worldDawn = jsonDateToDate(b.worldDawn);
  serverTime = jsonDateToDate(b.time);
  if ((serverTime < worldDawn) && (worldDawn < worldDusk)) {
    mNightModusActive = true
  } else {
    mNightModusActive = false
  }
  a = $("#gameBoardContainer").is("#gameBoardContainer")
}
function updateSilverMessage(a) {
  $("#silverMessage").html($.sprintf(mStringtable.getValueOf("Needed for conquest: %@"), a * 1000))
}
function updatePermissionAndButton(c, a, b, d, e, f) {
  if (c == 0 || isNaN(c)) {
    b.css("visibility", "hidden");
    $(d).removeClass("greyoutButton");
    if (e == "sendSpy") {
    }
    if (e == "attack") {
      mIsBlurred = false
    }
    if (e == "defendHabitat") {
      if (!mIsDefendHabitatHandlerBinded) {
        $(d).bind("click.defendHabitatView.button", {id: e, defendHabitat: f}, defendHabitatViewHandler);
        mIsDefendHabitatHandlerBinded = true
      }
    }
    if (e == "sendResources") {
      if (!mIsSendResourcesHandlerBinded) {
        $(d).bind("click.sendResourcesView.button", {id: e, sendResources: f}, sendResourcesViewHandler);
        mIsSendResourcesHandlerBinded = true
      }
    }
    $(".buttonContainer").css("cursor", "pointer");
    $(".buttonLabel").css("cursor", "pointer")
  } else {
    if (c > a) {
      b.css("visibility", "visible");
      $(d).addClass("greyoutButton");
      if (e == "sendSpy") {
        mIsBlurred = true
      }
      if (e == "attack") {
        mIsBlurred = true
      }
      if (e == "defendHabitat") {
        $(d).unbind("click.defendHabitatView.button");
        mIsDefendHabitatHandlerBinded = false
      }
      if (e == "sendResources") {
        $(d).unbind("click.sendResourcesView.button");
        mIsSendResourcesHandlerBinded = false
      }
      $(".buttonContainer").css("cursor", "default");
      $(".buttonLabel").css("cursor", "default")
    } else {
      b.css("visibility", "hidden");
      $(d).removeClass("greyoutButton");
      if (e == "sendSpy") {
        mIsBlurred = false
      }
      if (e == "attack") {
        mIsBlurred = false
      }
      if (e == "defendHabitat") {
        if (!mIsDefendHabitatHandlerBinded) {
          $(d).bind("click.defendHabitatView.button", {id: e, defendHabitat: f}, defendHabitatViewHandler);
          mIsDefendHabitatHandlerBinded = true
        }
      }
      if (e == "sendResources") {
        if (!mIsSendResourcesHandlerBinded) {
          $(d).bind("click.sendResourcesView.button", {id: e, sendResources: f}, sendResourcesViewHandler);
          mIsSendResourcesHandlerBinded = true
        }
      }
      $(".buttonContainer").css("cursor", "pointer");
      $(".buttonLabel").css("cursor", "pointer")
    }
  }
}
function removePermissionAndEnableButton(a, b, c, d) {
  a.css("visibility", "hidden");
  $(b).removeClass("greyoutButton");
  if (c == "sendSpy") {
  }
  if (c == "attack") {
  }
  if (c == "defendHabitat") {
    if (!mIsDefendHabitatHandlerBinded) {
      $(b).bind("click.defendHabitatView.button", {id: c, defendHabitat: d}, defendHabitatViewHandler);
      mIsDefendHabitatHandlerBinded = true
    }
  }
  if (c == "sendResources") {
    if (!mIsSendResourcesHandlerBinded) {
      $(b).bind("click.sendResourcesView.button", {id: c, sendResources: d}, sendResourcesViewHandler);
      mIsSendResourcesHandlerBinded = true
    }
  }
  $(".buttonContainer").css("cursor", "pointer");
  $(".buttonLabel").css("cursor", "pointer")
}
function requestAttack(d) {
  var j = mPlayer.currentHabitat.id;
  var b = d.habitatID;
  var a = {};
  var e = {};
  var f = -1111;
  var g = -1111;
  var c = 0;
  $(".unitsInput").each(function(k) {
    g = parseInt($(this).val());
    f = d.sourceUnits[k].primaryKey;
    if (g == 0 || isNaN(g)) {
      c += 0
    } else {
      a[f] = g;
      c += g
    }
  });
  g = parseInt($("#attackSilverInput").val());
  $.each(mResources, function(k, l) {
    if (l.identifier == "Silver") {
      if (g == 0 || isNaN(g)) {
        e[l.primaryKey] = 0
      } else {
        e[l.primaryKey] = g
      }
    }
  });
  if (c == 0 || g > capacityMax) {
    showPapyrusMsgBox(mStringtable.getValueOf("No untis were assigned."))
  } else {
    blockUI("TransitAction/startTransit");
    mCurrentActionBlocked = false;
    var h = {};
    h.sourceHabitatID = j;
    h.destinationHabitatID = b;
    h.transitType = TRANSITTYPE.ATTACKER;
    h.unitDictionary = "{" + $.param(a).replace(/&/g, "; ") + ";}";
    h.resourceDictionary = "{" + $.param(e).replace(/&/g, "; ") + ";}";
    h.PropertyListVersion = propertyListVersion;
    h[mPlayer.userIdentifier] = mPlayer.getHash();
    genericAjaxRequest("TransitAction/startTransit", h, "Session.updateCallback");
    mPlayer.updateData(d.player);
    updateCastleCss("attacked", b)
  }
}
function requestSendSpy(e) {
  var b = mPlayer.currentHabitat.id;
  var c = e.habitatID;
  var a = parseInt($("#sendSpyCopperInput").val());
  if (isNaN(a) || a == 0) {
    showPapyrusMsgBox(mStringtable.getValueOf("You need copper to send a spy!"))
  } else {
    blockUI("SpyAction/startSpyingTransit");
    var d = {};
    d.sourceHabitatID = b;
    d.destinationHabitatID = c;
    d.copperAmount = a;
    d.PropertyListVersion = propertyListVersion;
    d[mPlayer.userIdentifier] = mPlayer.getHash();
    genericAjaxRequest("SpyAction/startSpyingTransit", d, "Session.updateCallback");
    mPlayer.updateData(e.player)
  }
}
function requestDefendHabitat(g) {
  var a = mPlayer.currentHabitat.id;
  var d = g.habitatID;
  var b = {};
  var c = 0;
  var f = 0;
  var h = 0;
  $("input.unitsInput").each(function(j) {
    f = parseInt($(this).val());
    c = g.sourceUnits[j].primaryKey;
    if (f == 0 || isNaN(f)) {
      h += 0
    } else {
      b[c] = f;
      h += f
    }
  });
  unitsBundledInStock = mPlayer.currentHabitat.getOwnBundledHabitatUnits();
  if (h != 0 && unitsBundledInStock != null) {
    $.each(b, function(j, k) {
      if (b[j] > unitsBundledInStock[j]) {
        showPapyrusMsgBox(mStringtable.getValueOf("No untis were assigned."));
        mBottomBar.callLastView();
        return false
      }
    });
    if (mIsBlocked) {
      return false
    }
    blockUI("TransitAction/startTransit");
    var e = {};
    e.sourceHabitatID = a;
    e.destinationHabitatID = d;
    e.transitType = TRANSITTYPE.DEFENSE;
    e.unitDictionary = "{" + $.param(b).replace(/&/g, "; ") + ";}";
    e.PropertyListVersion = propertyListVersion;
    e[mPlayer.userIdentifier] = mPlayer.getHash();
    genericAjaxRequest("TransitAction/startTransit", e, "Session.updateCallback")
  } else {
    if (h == 0) {
      showPapyrusMsgBox(mStringtable.getValueOf("No untis were assigned."))
    } else {
      if (unitsBundledInStock == null) {
        showPapyrusMsgBox(mStringtable.getValueOf("No untis were assigned."));
        mBottomBar.callLastView()
      }
    }
  }
}
function requestSendResources(d) {
  var k = mPlayer.currentHabitat.id;
  var b = d.habitatID;
  var a = {};
  var e = {};
  var f = -1111;
  var h = -1111;
  var c = 0;
  var g = 0;
  $(".unitsInput").each(function(l) {
    h = parseInt($(this).val());
    f = d.sourceUnits[l].primaryKey;
    if (h == 0 || isNaN(h)) {
      c += 0
    } else {
      a[f] = h;
      c += h
    }
  });
  $(".resourcesInput").each(function(l) {
    h = parseInt($(this).val());
    f = d.sourceResources[l].identifier;
    resourceId = d.sourceResources[l].resourceId;
    if (f == "Wood" || f == "Stone" || f == "Ore") {
      if (h == 0 || isNaN(h)) {
        e[resourceId] = 0;
        g += 0
      } else {
        e[resourceId] = h;
        g += h
      }
    }
  });
  unitsBundledInStock = mPlayer.currentHabitat.getOwnBundledHabitatUnits();
  if (c != 0 && g > 0 && unitsBundledInStock != null) {
    if (g > capacityMax) {
      showPapyrusMsgBox(mStringtable.getValueOf("No untis were assigned."));
      $(".resourcesInput").each(function(l) {
        $(this).val(0)
      });
      return false
    }
    $.each(a, function(l, m) {
      if (a[l] > unitsBundledInStock[l]) {
        showPapyrusMsgBox(mStringtable.getValueOf("No untis were assigned."));
        mBottomBar.callLastView();
        return false
      }
    });
    if (mIsBlocked) {
      return false
    }
    blockUI("TransitAction/startTransit");
    var j = {};
    j.sourceHabitatID = k;
    j.destinationHabitatID = b;
    j.transitType = TRANSITTYPE.TRANSPORT;
    j.unitDictionary = "{" + $.param(a).replace(/&/g, "; ") + ";}";
    j.resourceDictionary = "{" + $.param(e).replace(/&/g, "; ") + ";}";
    j.PropertyListVersion = propertyListVersion;
    j[mPlayer.userIdentifier] = mPlayer.getHash();
    genericAjaxRequest("TransitAction/startTransit", j, "Session.updateCallback")
  } else {
    if (c == 0) {
      showPapyrusMsgBox(mStringtable.getValueOf("No untis were assigned."));
      $(".resourcesInput").each(function(l) {
        $(this).val(0)
      })
    } else {
      if (g == 0) {
        showPapyrusMsgBox(mStringtable.getValueOf("Please assign more transport units or reduce the amount of resources."))
      } else {
        if (unitsBundledInStock == null) {
          showPapyrusMsgBox(mStringtable.getValueOf("No untis were assigned."));
          mBottomBar.callLastView()
        }
      }
    }
  }
}
function initGlobalMapViewHandlerVariables() {
  mIsDefendHabitatHandlerBinded = false
}
function openMapExUnitDetails(a, c) {
  var b = a.habitatID;
  $.tmpl("mapOwnTroopsTmpl", a).appendTo($(c).empty());
  setHover("div.troopsview");
  windowSize();
  $("div.closeViewMission").click(function(d) {
    mapCloseButtonAction()
  });
  $("div.recall").click(function(f) {
    var g = {};
    var l = 0;
    var o = 0;
    var k = 0;
    var n = $(this).metadata().externalUnitIndex;
    var m = n.match(/\d+/g);
    var j = m[0];
    var h = m[1];
    $("#externalUnits_" + n).find("input.sendBack").each(function(d) {
      o = parseInt($(this).val());
      l = $(this).metadata().pk;
      if (o > 0 && !isNaN(o)) {
        g[l] = o;
        k += o
      }
    });
    if (Object.size(g) > 0) {
      var e = mPlayer.findHabitatById(j).externalHabitatUnits[h];
      mPlayer.findHabitatById(j).recallTroops(e, $(this).metadata().transittype, g)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf("No untis were assigned."))
    }
  });
  $("div.sendHome").click(function(f) {
    var d = {};
    var e = 0;
    var g = 0;
    var h = 0;
    $("#friendlyUnits_" + $(this).metadata().habitatUnitIndex).find("input.sendBack").each(function(j) {
      g = parseInt($(this).val());
      e = $(this).metadata().pk;
      if (g > 0 && !isNaN(g)) {
        d[e] = g;
        h += g
      }
    });
    if (Object.size(d) > 0) {
      mPlayer.currentHabitat.sendTroopsHome(mPlayer.currentHabitat.habitatUnits[$(this).metadata().habitatUnitIndex], $(this).metadata().transittype, d)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf("No untis were assigned."))
    }
  });
  $("input.sendBack").blur(function(f) {
    var d = parseInt($(this).val());
    var g = parseInt($(this).metadata().count);
    if (d > g) {
      $(this).val(g)
    } else {
      if (isNaN(d)) {
        $(this).val(0)
      }
    }
  });
  $("input.sendBack").numeric({decimal: false, negative: false});
  $("input.sendBack").bind("paste", function(d) {
    d.preventDefault()
  });
  $(".internal_link").click(function() {
    Actionslinks.openView($(this).attr("id"))
  })
}
function openDefendHabitatView(e) {
  mCurrentActionBlocked = true;
  var b = -1111;
  var g = distanceToHabitat(mPlayer.currentHabitat.mapX, mPlayer.currentHabitat.mapY, e.destX, e.destY);
  var f = 0;
  var a = 0;
  var j = {};
  var k = {};
  var h = "#defendHabitatButton";
  var d = "defendHabitat";
  e.sourceUnits = mPlayer.currentHabitat.getHabitatUnits();
  if (e.viewBla == "ownHabitatView") {
    e.viewType = "defendOwnHabitatView";
    mapActions.isAdditiveDivOpen = true;
    $.each(mPlayer.habitate, function(l, m) {
      if (e.habitatID == m.id) {
        e.targetUnits = m.getHabitatUnits()
      }
    });
    $("#gameBoardContainer").css("display", "none");
    $("#mapViewContainer").css("display", "none");
    $("#mapViewContainer2x").css("display", "none");
    if (mResolution == "default") {
      $("div.viewport").append("<div id='mapFullScreenContainer'></div>")
    }
    if (mResolution == "2x") {
      $("div.viewport").append("<div id='mapFullScreenContainer2x'></div>")
    }
    windowSize();
    if (mResolution == "default") {
      $.tmpl("defendOwnHabitatViewTmpl", e).appendTo($("#mapFullScreenContainer"))
    }
    if (mResolution == "2x") {
      $.tmpl("defendOwnHabitatViewTmpl", e).appendTo($("#mapFullScreenContainer2x"))
    }
    setHover("div.viewport");
    setPapyrusBackgroundForFullScreenView();
    setRoundCornersForHalfSidePapyrusBigBoxes(".bigBoxHalfPapyrusStyleClassFull");
    setRoundCornersForBigBoxes(".bigBoxStyleClassFull");
    setRoundCornersForSmallBoxes(".smallBoxStyleClassFull");
    windowSize()
  }
  if (e.viewBla == "foreignHabitatView") {
    e.viewType = "defendForeignHabitatView";
    windowSize();
    if (mResolution == "default") {
      $.tmpl("defendForeignHabitatViewTmpl", e).appendTo($("#mapViewContainer").empty())
    }
    if (mResolution == "2x") {
      $.tmpl("defendForeignHabitatViewTmpl", e).appendTo($("#mapViewContainer2x").empty())
    }
    setHover("div.viewport");
    setPapyrusBackgroundForMapViewContainer();
    setRoundCornersForHalfSidePapyrusBigBoxes(".bigBoxHalfPapyrusStyleClass");
    setRoundCornersForBigBoxes(".bigBoxStyleClass");
    setRoundCornersForSmallBoxes(".smallBoxStyleClass");
    windowSize()
  }
  for (var c = 0; c < e.sourceUnits.length; c++) {
    b = "#unitMax" + c;
    $(b).bind("click.defendHabitatView", {id: c, defendHabitat: e}, defendHabitatViewHandler)
  }
  acceptOnlyNumbers(".noButtonInputField");
  $(h).bind("click.defendHabitatView", {id: d, defendHabitat: e}, defendHabitatViewHandler);
  $(".noButtonInputField").each(function(l) {
    $(this).blur(function(m) {
      validateOnBlur(e, l, $(this).val(), $(this));
      updateDuration(e, g);
      removePermissionAndEnableButton($(this).prev(), h, d, e)
    })
  });
  $(".noButtonInputField").each(function(l) {
    $(this).keyup(function(m) {
      updateDuration(e, g);
      k = $(this).prev();
      j = $(this).next();
      a = parseInt($(this).val());
      f = parseInt(j.text());
      updatePermissionAndButton(a, f, k, h, d, e)
    })
  });
  $("input.noButtonInputField").bind("paste", function(l) {
    l.preventDefault()
  })
}
function openSendResourcesView(w) {
  mCurrentActionBlocked = true;
  var m = -1111;
  var e = "default";
  var a = 0;
  var v = 0;
  var k = distanceToHabitat(mPlayer.currentHabitat.mapX, mPlayer.currentHabitat.mapY, w.destX, w.destY);
  var r = 0;
  var t = 0;
  var c = {};
  var o = {};
  var f = "#sendResourcesButton";
  var g = "sendResources";
  w.sourceUnits = mPlayer.currentHabitat.getHabitatUnits();
  var b = mPlayer.currentHabitat.habitatResources;
  w.sourceResources = [];
  var d = new Object();
  $.each(b, function(j, z) {
    if (z.resourceId == "1" || z.resourceId == "2" || z.resourceId == "3") {
      d = b[z.resourceId];
      d.identifier = mResources[z.resourceId].identifier;
      w.sourceResources[a] = d;
      a++
    }
  });
  if (w.viewBla == "ownHabitatView") {
    w.viewType = "sendResourcesOwnHabitatView";
    var u = mPlayer.habitate[w.habitatID].habitatResources;
    w.targetResources = [];
    var h = new Object();
    $.each(u, function(j, z) {
      if (z.resourceId == "1" || z.resourceId == "2" || z.resourceId == "3") {
        h = u[z.resourceId];
        h.identifier = mResources[z.resourceId].identifier;
        w.targetResources[v] = h;
        v++
      }
    });
    $("#gameBoardContainer").css("display", "none");
    $("#mapViewContainer").css("display", "none");
    $("#mapViewContainer2x").css("display", "none");
    if (mResolution == "default") {
      $("div.viewport").append("<div id='mapFullScreenContainer'></div>")
    }
    if (mResolution == "2x") {
      $("div.viewport").append("<div id='mapFullScreenContainer2x'></div>")
    }
    windowSize();
    if (mResolution == "default") {
      $.tmpl("sendResourcesOwnHabitatViewTmpl", w).appendTo($("#mapFullScreenContainer"))
    }
    if (mResolution == "2x") {
      $.tmpl("sendResourcesOwnHabitatViewTmpl", w).appendTo($("#mapFullScreenContainer2x"))
    }
    setHover("div.viewport");
    setPapyrusBackgroundForFullScreenView();
    setRoundCornersForHalfSidePapyrusBigBoxes(".bigBoxHalfPapyrusStyleClassFull");
    setRoundCornersForBigBoxes(".bigBoxStyleClassFull");
    setRoundCornersForSmallBoxes(".smallBoxStyleClassFull");
    windowSize();
    $("#sendResourcesCapacity").addClass("capacityRed")
  }
  if (w.viewBla == "foreignHabitatView") {
    w.viewType = "sendResourcesForeignHabitatView";
    windowSize();
    if (mResolution == "default") {
      $.tmpl("sendResourcesForeignHabitatViewTmpl", w).appendTo($("#mapViewContainer").empty())
    }
    if (mResolution == "2x") {
      $.tmpl("sendResourcesForeignHabitatViewTmpl", w).appendTo($("#mapViewContainer2x").empty())
    }
    setHover("div.viewport");
    setPapyrusBackgroundForMapViewContainer();
    setRoundCornersForHalfSidePapyrusBigBoxes(".bigBoxHalfPapyrusStyleClass");
    setRoundCornersForBigBoxes(".bigBoxStyleClass");
    setRoundCornersForSmallBoxes(".smallBoxStyleClass");
    windowSize();
    $("#sendResourcesCapacity").addClass("capacityRed")
  }
  for (var n = 0; n < w.sourceUnits.length; n++) {
    m = "#unitMax" + n;
    e = "unitButton";
    $(m).bind("click.sendResourcesView", {buttonType: e, id: n, sendResources: w}, sendResourcesViewHandler)
  }
  for (var l = 0; l < w.sourceResources.length; l++) {
    m = "#resourceMax" + l;
    e = "resourceButton";
    $(m).bind("click.sendResourcesView", {buttonType: e, id: l, sendResources: w}, sendResourcesViewHandler)
  }
  acceptOnlyNumbers(".noButtonInputField");
  $(f).bind("click.sendResourcesView", {id: g, sendResources: w}, sendResourcesViewHandler);
  $(".noButtonInputField").each(function(j) {
    $(this).blur(function(z) {
      validateOnBlur(w, j, $(this).val(), $(this));
      updateDuration(w, k);
      updateCapacity(w);
      mIsBlurred = false;
      removePermissionAndEnableButton($(this).prev(), f, g, w)
    })
  });
  $(".noButtonInputField").each(function(j) {
    $(this).keyup(function(z) {
      updateDuration(w, k);
      updateCapacity(w);
      o = $(this).prev();
      c = $(this).next();
      t = parseInt($(this).val());
      r = parseInt(c.text());
      updatePermissionAndButton(t, r, o, f, g, w)
    })
  });
  $("input.noButtonInputField").bind("paste", function(j) {
    j.preventDefault()
  })
}
function openAttackView(d) {
  mCurrentActionBlocked = true;
  d.viewType = "attackView";
  var g = distanceToHabitat(mPlayer.currentHabitat.mapX, mPlayer.currentHabitat.mapY, d.destX, d.destY);
  var f = 0;
  var a = 0;
  var j = {};
  var l = {};
  var h = "#attackButton";
  d.sourceUnits = mPlayer.currentHabitat.getHabitatUnits();
  var k = mPlayer.currentHabitat.habitatResources;
  d.sourceSilverCount = k[6].getRoundedAmount();
  d.isNight = mNightModusActive;
  var e = 0;
  $.each(mPlayer.habitate, function(m) {
    e++
  });
  windowSize();
  if (mResolution == "default") {
    $.tmpl("attackViewTmpl", d).appendTo($("#mapViewContainer").empty())
  }
  if (mResolution == "2x") {
    $.tmpl("attackViewTmpl", d).appendTo($("#mapViewContainer2x").empty())
  }
  setHover("div.viewport");
  setPapyrusBackgroundForMapViewContainer();
  setRoundCornersForHalfSidePapyrusBigBoxes(".bigBoxHalfPapyrusStyleClass");
  setRoundCornersForBigBoxes(".bigBoxStyleClass");
  setRoundCornersForSmallBoxes(".smallBoxStyleClass");
  windowSize();
  $("#attackCapacity").addClass("capacityRed");
  for (var c = 0; c < d.sourceUnits.length; c++) {
    var b = "#unitMax";
    b += c;
    $(b).bind("click.attackView", {id: c, attack: d}, attackViewHandler)
  }
  $("#silverMax").bind("click.attackView", {id: "silver", attack: d}, attackViewHandler);
  $(h).bind("click.attackView", {id: "attack", attack: d}, attackViewHandler);
  $("input.noButtonInputField").bind("paste", function(m) {
    m.preventDefault()
  });
  $(".noButtonInputField").each(function(m) {
    $(this).blur(function(n) {
      validateOnBlur(d, m, $(this).val(), $(this));
      updateDuration(d, g);
      updateCapacity(d);
      removePermissionAndEnableButton($(this).prev(), h, "attack", d)
    })
  });
  $(".noButtonInputField").each(function(m) {
    $(this).keyup(function(n) {
      updateDuration(d, g);
      updateCapacity(d);
      l = $(this).prev();
      j = $(this).next();
      a = parseInt($(this).val());
      f = parseInt(j.text());
      updatePermissionAndButton(a, f, l, h, "attack", d);
      this.value = this.value.replace(/[^0-9\.]/g, "")
    })
  });
  $("#attackSilverInput").val(function() {
    updateSilverMessage(e)
  })
}
function openSendSpyView(c) {
  mCurrentActionBlocked = true;
  c.viewType = "sendSpyView";
  var f = distanceToHabitat(mPlayer.currentHabitat.mapX, mPlayer.currentHabitat.mapY, c.destX, c.destY);
  var d = 0;
  var a = 0;
  var h = {};
  var j = {};
  var g = "#sendSpyButton";
  var b = "sendSpy";
  var e = mPlayer.currentHabitat.habitatResources;
  c.sourceCopperCount = e[5].getRoundedAmount();
  windowSize();
  if (mResolution == "default") {
    $.tmpl("sendSpyViewTmpl", c).appendTo($("#mapViewContainer").empty())
  }
  if (mResolution == "2x") {
    $.tmpl("sendSpyViewTmpl", c).appendTo($("#mapViewContainer2x").empty())
  }
  setHover("div.viewport");
  setPapyrusBackgroundForMapViewContainer();
  setRoundCornersForHalfSidePapyrusBigBoxes(".bigBoxHalfPapyrusStyleClass");
  setRoundCornersForBigBoxes(".bigBoxStyleClass");
  setRoundCornersForSmallBoxes(".smallBoxStyleClass");
  windowSize();
  $("#copperMax").bind("click.sendSpyView", {id: "copper", sendSpy: c}, sendSpyViewHandler);
  acceptOnlyNumbers(".noButtonInputField");
  $(g).bind("click.sendSpyView", {id: b, sendSpy: c}, sendSpyViewHandler);
  $(".noButtonInputField").blur(function(k) {
    validateOnBlur(c, 0, $(this).val(), $(this));
    updateDuration(c, f);
    removePermissionAndEnableButton($(this).prev(), g, b, c)
  });
  $(".noButtonInputField").keyup(function() {
    updateDuration(c, f);
    j = $(this).prev();
    h = $(this).next();
    a = parseInt($(this).val());
    d = parseInt(h.text());
    updatePermissionAndButton(a, d, j, g, b, c)
  });
  $("input.noButtonInputField").bind("paste", function(k) {
    k.preventDefault()
  })
}
mapActions = new function() {
  this.nameHead = "";
  this.nameFoot = "";
  this.data = {};
  this.data_2 = null;
  this.isAdditiveDivOpen = false
};
mapActions.reset = function() {
  this.data = null;
  this.nameHead = "";
  this.nameFoot = ""
};
mapActions.setData = function(a) {
  this.data = a
};
mapActions.setData_2 = function(a) {
  this.data_2 = a
};
mapActions.setAdditiveDivOpen = function(a) {
  this.isAdditiveDivOpen = a
};
mapActions.setNameHead = function(a) {
  this.nameHead = a
};
mapActions.getNameHead = function() {
  return this.nameHead
};
mapActions.setNameFoot = function(a) {
  this.nameFoot = a
};
mapActions.getNameFoot = function(a) {
  return this.nameFoot
};
mapActions.execute_default = function() {
  this.closeAdditiveDiv();
  this.setNameHead("openOwnHabitatView");
  this.setNameFoot("");
  this.setData(false);
  openOwnHabitatView(false)
};
mapActions.execute = function(a) {
  var c = true;
  var b = true;
  if (this.nameHead == "openOwnHabitatView" || this.nameHead == "") {
    openOwnHabitatView(this.data);
    if (this.nameFoot != "") {
      this.updateAdditiveDiv();
      switch (this.nameFoot) {
        case"openDefendHabitatView":
          openDefendHabitatView(this.data);
          addCloseButton(true);
          break;
        case"openSendResourcesView":
          openSendResourcesView(this.data);
          addCloseButton(true);
          break;
        case"openTroopDetails":
          mHabitatView.openTroopDetails(this.data_2.informationObject, this.data_2.target);
          break;
        case"openMapExUnitDetails":
          openMapExUnitDetails(this.data_2.informationObject, this.data_2.target);
          addCloseButton(true);
          break
        }
    }
  } else {
    openForeignHabitatView(this.data);
    var f = true;
    if (this.data.playerType == "P") {
      if (this.data.player_isOnVaction == "true" || this.data.isNewbieProtected) {
        f = false
      }
    } else {
      c = false
    }
    var e = distanceToHabitat(this.data.destX, this.data.destY, mPlayer.currentHabitat.mapX, mPlayer.currentHabitat.mapY);
    if (mPlayer.currentHabitat.points < e) {
      b = false
    }
    b = true;
    if (this.nameFoot != "" && b) {
      switch (this.nameFoot) {
        case"openAttackView":
          if (f) {
            openAttackView(this.data);
            addCloseButton()
          }
          break;
        case"openSendSpyView":
          if (f) {
            openSendSpyView(this.data);
            addCloseButton()
          }
          break;
        case"openSendResourcesView":
          if (c) {
            openSendResourcesView(this.data);
            addCloseButton()
          }
          break;
        case"openDefendHabitatView":
          if (c) {
            openDefendHabitatView(this.data);
            addCloseButton()
          }
          break;
        case"openTroopDetails":
          mHabitatView.openTroopDetails(this.data_2.informationObject, this.data_2.target);
          break;
        case"openMapExUnitDetails":
          openMapExUnitDetails(this.data_2.informationObject, this.data_2.target);
          addCloseButton(true);
          break
        }
    }
  }
};
mapActions.back = function() {
  this.setNameFoot("");
  this.execute()
};
mapActions.updateAdditiveDiv = function() {
  if (mapActions.isAdditiveDivOpen) {
    closeOwnHabitatFullView()
  }
};
mapActions.closeAdditiveDiv = function() {
  if (mapActions.isAdditiveDivOpen) {
    mapActions.setAdditiveDivOpen(false);
    mapActions.setNameFoot("");
    closeOwnHabitatFullView()
  }
};
function mapCloseButtonAction() {
  mCurrentActionBlocked = false;
  mapActions.closeAdditiveDiv();
  mapActions.back()
}
function addCloseButton(a) {
  if (a != undefined && a === true) {
    mapActions.setAdditiveDivOpen(true)
  }
  if (mapActions.isAdditiveDivOpen) {
    if (mResolution == "default") {
      var b = '<div id="mapCloseButtonContainer" style="position: absolute;top:10px;right: 0px;"></div>';
      $("#mapFullViewHeadlineContainer").append(b)
    } else {
      var b = '<div id="mapCloseButtonContainer" style="position: absolute;top:25px;right: 0px;"></div>';
      $("#mapFullViewHeadlineContainer2x").append(b)
    }
  } else {
    if (mResolution == "default") {
      var b = '<div id="mapCloseButtonContainer" style="position: absolute;top:30px;right: 0px;"></div>';
      $("#mapViewContainer").append(b)
    } else {
      var b = '<div id="mapCloseButtonContainer" style="position: absolute;top:55px;right: 0px;"></div>';
      $("#mapViewContainer2x").append(b)
    }
  }
  $("#mapCloseButtonContainer").bind("click", mapCloseButtonAction)
}
function closeOwnHabitatFullView() {
  if (mResolution == "default") {
    $("#mapFullScreenContainer").remove();
    $("#mapViewContainer").css("display", "block")
  } else {
    $("#mapFullScreenContainer2x").remove();
    $("#mapViewContainer2x").css("display", "block")
  }
  $("#gameBoardContainer").css("display", "block");
  Arrow_removal.init();
  Arrow_removal.show_pointer()
}
var IE8 = ($.browser.msie && $.browser.version.slice(0, 1) < 9) ? true : false;
var IE9 = ($.browser.msie && $.browser.version.slice(0, 1) == 9) ? true : false;
var FF = $.browser.mozilla ? true : false;
var SAFARY = $.browser.webkit ? true : false;
var Arrow = {w: 0, h: 0, left: 0, top: 0, left_pike: 0, top_pike: 0, deg: 0, area: "", css_class: "", init: function() {
    if (mResolution == "2x") {
      this.w = 100;
      this.h = 30
    } else {
      this.w = 70;
      this.h = 20
    }
  }, set_pike_pos: function() {
    this.left_pike = Arrow_removal.left;
    this.top_pike = Arrow_removal.top;
    this.area = Arrow_removal.get_pointer_area();
    this.deg = Arrow_removal.deg
  }, xy_from_lt: function(g, f) {
    var e = Nmap_container.get_width();
    var b = Nmap_container.get_height();
    b = g - Nmap_container.get_top();
    e = f - Nmap_container.get_left();
    var d = Math.floor(e / stepSize_left);
    var c = Math.floor(b / stepSize_top);
    var a = Nmap_container.get_map_x() + d;
    var h = Nmap_container.get_map_y() + c;
    return{x: a, y: h}
  }, calculate_left_and_top_for_FF: function() {
    var b = Math.PI / 180;
    var a = Math.cos(Arrow_removal.deg * b) * this.w / 2;
    var e = Math.sin(Arrow_removal.deg * b) * this.w / 2;
    var d = this.top_pike + e;
    var c = this.left_pike + a;
    switch (this.area) {
      case"o":
        if (Arrow_burg.virt_cphab_left > map_view_center_left) {
          c = this.left_pike - a
        } else {
          c = this.left_pike + a
        }
        break;
      case"r":
        if (Arrow_burg.virt_cphab_top < map_view_center_top) {
          d = this.top_pike + e
        } else {
          d = this.top_pike - e
        }
        c = this.left_pike - a;
        break;
      case"or":
        c = this.left_pike - a;
        break;
      case"ol":
        break;
      case"l":
        if (Arrow_burg.virt_cphab_top > map_view_center_top) {
          d = this.top_pike - e
        }
        break;
      case"ur":
        d = this.top_pike - e;
        c = this.left_pike - a;
        break;
      case"ul":
        d = this.top_pike - e;
        break;
      case"u":
        d = this.top_pike - e;
        if (Arrow_burg.virt_cphab_left > map_view_center_left) {
          c = this.left_pike - a
        } else {
          c = this.left_pike + a
        }
        break
    }
    this.left = c - this.w / 2;
    this.top = d - this.h / 2
  }, calculate_left_and_top: function() {
    var c = Math.PI / 180;
    var b = 90 - Arrow_removal.deg;
    var g = Math.sin(b * c) * this.w;
    var f = Math.cos(b * c) * this.w;
    var h = this.top_pike + f;
    var a = this.left_pike - g;
    var e = Math.sin(b * c) * this.h / 2;
    var d = Math.cos(b * c) * this.h / 2;
    switch (this.area) {
      case"o":
        if (Arrow_burg.virt_cphab_left > map_view_center_left) {
          a = this.left_pike - g
        } else {
          a = this.left_pike - g / 2 + d;
          h = this.top_pike + f - e
        }
        h = this.top_pike;
        break;
      case"r":
        if (Arrow_burg.virt_cphab_top > map_view_center_top) {
          h = this.top_pike - f
        } else {
          h = this.top_pike - e
        }
        break;
      case"or":
        h = this.top_pike - e;
        a = this.left_pike - g;
        break;
      case"ol":
        h = this.top_pike - e;
        a = this.left_pike - d;
        break;
      case"l":
        a = this.left_pike;
        if (Arrow_burg.virt_cphab_top > map_view_center_top) {
          h = this.top_pike - f
        } else {
          h = this.top_pike - e
        }
        break;
      case"ur":
        h = this.top_pike - f - e;
        a = this.left_pike - g;
        break;
      case"ul":
        h = this.top_pike - f;
        a = this.left_pike - d;
        break;
      case"u":
        h = this.top_pike - f;
        if (Arrow_burg.virt_cphab_left > map_view_center_left) {
          a = this.left_pike - g
        } else {
          a = this.left_pike - g / 2 + e
        }
        break
    }
    this.top = h;
    this.left = a
  }, add_css_for_direction: function() {
    if (!IE8) {
      var a = "l";
      var b = this.area;
      if (b == "r" || b == "or" || b == "ur") {
        a = "r"
      }
      if (b == "u" && Arrow_burg.virt_cphab_left > map_view_center_left) {
        a = "r"
      }
      if (b == "o" && Arrow_burg.virt_cphab_left > map_view_center_left) {
        a = "r"
      }
      if (Arrow_removal.resolution == 1) {
        a = a + "k"
      }
      if (this.css_class != "") {
        $("#distance_to_castle").removeClass(this.css_class)
      }
      this.css_class = a;
      $("#distance_to_castle").addClass(a)
    }
  }, calculate_rotate_deg: function() {
    switch (this.area) {
      case"o":
        if (Arrow_burg.virt_cphab_left > map_view_center_left) {
          this.deg = -this.deg
        } else {
        }
        break;
      case"r":
        if (Arrow_burg.virt_cphab_top < map_view_center_top) {
          this.deg = -this.deg
        } else {
        }
        break;
      case"or":
        this.deg = -this.deg;
        break;
      case"l":
        if (Arrow_burg.virt_cphab_top > map_view_center_top) {
          this.deg = -this.deg
        }
        break;
      case"ul":
        this.deg = -this.deg;
        break;
      case"u":
        if (Arrow_burg.virt_cphab_left < map_view_center_left) {
          this.deg = -this.deg
        } else {
        }
        break
      }
  }, execute_css: function() {
    this.top = Math.round(this.top);
    this.left = Math.round(this.left);
    if (IE8) {
      this.top_text = this.top + this.deg * 0.5;
      this.left_text = this.left;
      switch (this.area) {
        case"o":
          this.top_text = this.top + (this.w + this.h) / 2;
          this.left_text = this.left;
          break;
        case"r":
        case"ur":
        case"or":
          this.top_text = this.top - this.deg * 0.7;
          this.left_text = this.left - this.w;
          this.deg += 180;
          break;
        case"ol":
          this.top_text = this.top + this.w / 2;
          this.left_text = this.left + this.w;
          break;
        case"u":
          this.top_text = this.top - this.w / 2;
          this.deg += 180;
          break;
        case"ul":
          this.left_text = this.left + this.w;
          this.top_text = this.top + this.deg * 0.5;
          break;
        case"l":
          this.left_text = this.left + this.w;
          this.top_text = this.top + this.deg * 0.5;
          break
      }
      $("#img_distance_to_castle").offset({top: this.top, left: this.left});
      $("#img_distance_to_castle").rotate(this.deg);
      $("#distance_to_castle_text").offset({top: this.top_text, left: this.left_text})
    } else {
      $("#distance_to_castle").offset({top: this.top, left: this.left});
      $("#distance_to_castle").rotate(this.deg);
      if (SAFARY) {
        $("#distance_to_castle").offset({top: this.top, left: this.left});
        $("#distance_to_castle").offset({top: this.top, left: this.left});
        $("#distance_to_castle").offset({top: this.top, left: this.left})
      }
    }
  }, show: function() {
    this.set_pike_pos();
    this.add_css_for_direction();
    if (!FF) {
      this.calculate_left_and_top()
    } else {
      this.calculate_left_and_top_for_FF()
    }
    this.calculate_rotate_deg();
    this.execute_css();
    this.show_distance();
    if (IE8) {
      $("#distance_to_castle_text").show();
      $("#img_distance_to_castle").show()
    } else {
      $("#distance_to_castle").show()
    }
  }, show_distance: function() {
    var a = this.xy_from_lt(this.top_pike, this.left_pike);
    var c = distanceToHabitat(a.x, a.y, Arrow_burg.burg_x, Arrow_burg.burg_y);
    var b = $.sprintf(mStringtable.getValueOf("%d fields"), c);
    if (IE8) {
      $("#distance_to_castle_text").html(b)
    } else {
      $("#distance_to_castle").html(b)
    }
  }, hide: function() {
    if (IE8) {
      $("#img_distance_to_castle").hide();
      $("#distance_to_castle_text").hide()
    } else {
      $("#distance_to_castle").hide()
    }
  }};
var Arrow_burg = {burg_x: 0, burg_y: 0, is_burg_in_map: false, virt_cphab_left: 0, virt_cphab_top: 0, init: function() {
    this.burg_x = mPlayer.currentHabitat.mapX;
    this.burg_y = mPlayer.currentHabitat.mapY
  }, checkIsHabInMap: function() {
    var a = false;
    var e = Nmap_container.get_map_x();
    var c = Nmap_container.get_map_y();
    var d = e + Nmap_container.get_count_tile_x() * 8;
    var b = c + Nmap_container.get_count_tile_x() * 8;
    if (this.burg_x >= e && e <= d && this.burg_y >= c && this.burg_y <= b) {
      a = true
    }
    return a
  }, calculate_virt_cphab_lt: function() {
    this.virt_cphab_left = Math.round(Nmap_container.get_left() + (this.burg_x - Nmap_container.get_map_x()) * stepSize_left + stepSize_left / 2);
    this.virt_cphab_top = Math.round(Nmap_container.get_top() + (this.burg_y - Nmap_container.get_map_y()) * stepSize_top + stepSize_top / 3);
    if (this.checkIsHabInMap()) {
      var a = $("#img_hab_" + mPlayer.currentHabitat.id).offset();
      if (a != null) {
        this.virt_cphab_top = a.top + imageHeight / 2;
        this.virt_cphab_left = a.left + stepSize_left / 2;
        this.is_burg_in_map = true
      }
    } else {
      this.is_burg_in_map = false
    }
  }};
var Arrow_removal = {left: 0, top: 0, deg: 0, min_left: 0, max_left: 0, min_top: 0, max_top: 0, min_x: 0, min_y: 0, max_x: 0, max_y: 0, area: "o", resolution: 2, change_resolution: false, init: function() {
    var a = 0;
    if (mResolution == "2x") {
      a = 2
    } else {
      a = 1
    }
    if (this.resolution != 0 && a != this.resolution) {
      this.change_resolution = true
    } else {
      this.change_resolution = false
    }
    this.resolution = a;
    Arrow_burg.init();
    Arrow.init();
    this.calculate_arrow_area();
    this.show_pointer()
  }, calculate_arrow_area: function() {
    this.min_left = map_view_left + 15 * this.resolution;
    this.max_left = map_view_left + map_view_width - 15 * this.resolution;
    if (SAFARY) {
      this.min_top = map_view_top + 11 * this.resolution
    } else {
      this.min_top = map_view_top + 15 * this.resolution
    }
    this.max_top = map_view_top + map_view_height - 20 * this.resolution
  }, show_pointer: function() {
    Arrow_burg.calculate_virt_cphab_lt();
    if (Arrow_burg.virt_cphab_left > this.max_left || Arrow_burg.virt_cphab_left < this.min_left || Arrow_burg.virt_cphab_top < this.min_top || Arrow_burg.virt_cphab_top > this.max_top) {
      this.calculate_pointer_area();
      this.calculate_angle();
      this.calculate_left_and_top();
      Arrow.show()
    } else {
      Arrow.hide()
    }
  }, create_punkt: function() {
    if ($("#punkt_distance_to_castle").length == 0) {
      jQuery("<div/>", {id: "punkt_distance_to_castle"}).appendTo("#" + map_view_target)
    }
    $("#punkt_distance_to_castle").offset({top: this.top, left: this.left})
  }, calculate_left_and_top: function() {
    switch (this.get_pointer_area()) {
      case"o":
        this.top = this.min_top;
        this.left = Arrow_burg.virt_cphab_left;
        break;
      case"r":
        this.top = Arrow_burg.virt_cphab_top;
        this.left = this.max_left;
        break;
      case"or":
        this.top = map_view_center_top - Math.tan(this.deg * Math.PI / 180) * (this.max_left - this.min_left) / 2;
        if (this.top < this.min_top) {
          this.top = this.min_top
        }
        this.left = map_view_center_left + ((this.max_top - this.min_top) / 2) / Math.tan(this.deg * Math.PI / 180);
        if (this.left > this.max_left) {
          this.left = this.max_left
        }
        break;
      case"ol":
        this.top = map_view_center_top - Math.tan(this.deg * Math.PI / 180) * (this.max_left - this.min_left) / 2;
        if (this.top < this.min_top) {
          this.top = this.min_top
        }
        this.left = map_view_center_left - ((this.max_top - this.min_top) / 2) / Math.tan(this.deg * Math.PI / 180);
        if (this.left < this.min_left) {
          this.left = this.min_left
        }
        break;
      case"u":
        this.top = this.max_top;
        this.left = Arrow_burg.virt_cphab_left;
        break;
      case"l":
        this.top = Arrow_burg.virt_cphab_top;
        this.left = this.min_left;
        break;
      case"ur":
        this.left = map_view_center_left + ((this.max_top - this.min_top) / 2) / Math.tan(this.deg * Math.PI / 180);
        if (this.left > this.max_left) {
          this.left = this.max_left
        }
        this.top = map_view_center_top + Math.tan(this.deg * Math.PI / 180) * (this.max_left - this.min_left) / 2;
        if (this.top > this.max_top) {
          this.top = this.max_top
        }
        break;
      case"ul":
        this.left = map_view_center_left - ((this.max_top - this.min_top) / 2) / Math.tan(this.deg * Math.PI / 180);
        if (this.left < this.min_left) {
          this.left = this.min_left
        }
        this.top = map_view_center_top + Math.tan(this.deg * Math.PI / 180) * (this.max_left - this.min_left) / 2;
        if (this.top > this.max_top) {
          this.top = this.max_top
        }
        break
      }
  }, calculate_angle: function() {
    var e = 180 / Math.PI;
    var d = Math.abs(map_view_center_left - Arrow_burg.virt_cphab_left);
    var c = Math.abs(map_view_center_top - Arrow_burg.virt_cphab_top);
    if (d != 0) {
      this.deg = Math.round(Math.atan(c / d) * e)
    } else {
      this.deg = 90
    }
  }, calculate_pointer_area: function() {
    var b = "";
    var a = "";
    if (Arrow_burg.virt_cphab_top >= this.max_top) {
      b = "u"
    } else {
      if (Arrow_burg.virt_cphab_top <= this.min_top) {
        b = "o"
      }
    }
    if (Arrow_burg.virt_cphab_left >= this.max_left) {
      a = "r"
    } else {
      if (Arrow_burg.virt_cphab_left <= this.min_left) {
        a = "l"
      }
    }
    this.area = b + a
  }, get_pointer_area: function() {
    return this.area
  }};
var events_for_pol_map = false;
var events_for_nor_map = false;
function register_event() {
  unregister_wmap_events();
  if (!events_for_pol_map) {
    $("#" + map_view_target).bind("mousedown", handlerForMapMouseDown);
    $(document).bind("mouseup", handlerForMapMouseUp);
    events_for_nor_map = true
  }
}
function unregister_map_event() {
  if (events_for_nor_map) {
    $("#" + map_view_target).unbind("mousedown", handlerForMapMouseDown);
    $(document).unbind("mouseup", handlerForMapMouseUp);
    $("#centerHabitatButtonImage").unbind("click", handlerForCenterHabitat);
    $("#wmapButtonImage").unbind("click", handlerForWmapButtonClick);
    $(".clickRectangle").unbind("mouseup", handlerMouseClickForRectangle);
    $("#" + map_view_target).unbind("mousemove");
    $("#" + map_view_target).css("cursor", "default");
    is_moved = false;
    is_can_move = false;
    events_for_nor_map = false;
    if ($("#distance_to_castle").length > 0) {
      $("#distance_to_castle").hide()
    }
  }
}
function handlerForMapMouseMove(c) {
  if (str_mCurrentAction == "openMap") {
    if (is_can_move) {
      is_moved = true;
      mouse_move_left = c.pageX;
      mouse_move_top = c.pageY;
      var b = mouse_move_left - mouse_current_left;
      var a = mouse_move_top - mouse_current_top;
      Nmap_container.updateLT(b, a);
      Mapcenter.updateXY(b, a);
      Nmap_container.move();
      trigger_side = "";
      mouse_current_top = mouse_move_top;
      mouse_current_left = mouse_move_left;
      trigger_for_request()
    }
  }
  c.preventDefault()
}
function handlerForMapMouseDown(a) {
  if (str_mCurrentAction == "openMap") {
    if (ajax_locked) {
      return false
    }
    is_can_move = true;
    is_moved = false;
    $("#" + map_view_target).css("cursor", "move");
    mouse_current_left = a.pageX;
    mouse_current_top = a.pageY;
    $("#" + map_view_target).bind("mousemove", handlerForMapMouseMove)
  }
  a.preventDefault()
}
function handlerForMapMouseUp(a) {
  if (str_mCurrentAction == "openMap") {
    is_moved = false;
    is_can_move = false;
    $("#" + map_view_target).unbind("mousemove");
    $("#" + map_view_target).css("cursor", "default")
  }
  a.preventDefault()
}
function handlerMouseClickForRectangle(c) {
  if (str_mCurrentAction == "openMap") {
    if (is_moved == false) {
      var d = parseInt($(this).attr("id").substr(4));
      var a = parseInt($(this).parent().parent("div.tileDiv").attr("id").substr(5));
      Maphab.set_id(d);
      Maphab.set_tile_id(a);
      var b = getEventDataObject(d, a);
      mapActions.setData(b);
      if (checkForOwnHabitat(d)) {
        mapActions.setNameHead("openOwnHabitatView");
        mapActions.setNameFoot("")
      } else {
        mapActions.setNameHead("openForeignHabitatView")
      }
      mapActions.execute()
    }
  }
}
var map_index_to_json_id = [];
function get_tile_index(a) {
  return map_index_to_json_id[a]
}
function set_tile_index_for_map_from_json() {
  var k, h, b = 0, a, g;
  var d = json_data.map.tileArray.length;
  var f = 0, e = 0;
  for (var l = 0; l < Nmap_container.get_count_tile_y(); l++) {
    for (var m = 0; m < Nmap_container.get_count_tile_x(); m++) {
      a = Nmap_container.get_map_x() + m * 8;
      g = Nmap_container.get_map_y() + l * 8;
      for (var c = 0; c < d; c++) {
        k = json_data.map.tileArray[c].frame.origin.x;
        h = json_data.map.tileArray[c].frame.origin.y;
        if (a == k && g == h) {
          map_index_to_json_id[b] = c
        }
        if (k > f) {
          f = k
        }
        if (h > e) {
          e = h
        }
      }
      b++
    }
  }
}
function generate_map() {
  var d = "";
  z_index = 10000;
  var f = mPlayer.getHabitatsAttack();
  var b = Nmap_container.get_count_tile_x() * Nmap_container.get_count_tile_y();
  set_tile_index_for_map_from_json();
  for (var e = 0; e < b; e++) {
    d += a(e)
  }
  $("#" + map_all_target).empty().append(d);
  trigger = false;
  mCurrentActionBlocked = false;
  ajax_locked = false;
  _handlerForCenterHabitat = true;
  $("#" + map_view_target).css("cursor", "default");
  set_map_all_target_position();
  $(".clickRectangle").bind("mouseup", handlerMouseClickForRectangle);
  is_can_move = true;
  Arrow_removal.init();
  Arrow_removal.show_pointer();
  HandlerFlag.set_switchMap(true);
  register_map_events();
  if (mIsBlocked) {
    unblockUI()
  }
  return true;
  function a(n) {
    var t = "";
    var r = json_data.map.tileArray[get_tile_index(n)].map;
    r = r.replace(/\n/g, ",");
    var F = r.split(",");
    hab_dic = json_data.map.tileArray[get_tile_index(n)].habitatDictionary;
    var v = 0, o = 0;
    var l = n % Nmap_container.get_count_tile_x();
    var m = Math.floor(n / Nmap_container.get_count_tile_x());
    var C = tile_height * m;
    var u = tile_width * l;
    var w = 0;
    var k = 0, H = 0;
    var G = json_data.map.tileArray[get_tile_index(n)].frame.origin.x;
    var E = json_data.map.tileArray[get_tile_index(n)].frame.origin.y;
    if (G == Maphab.get_tile_x() && E == Maphab.get_tile_y()) {
      Maphab.set_tile_id(n)
    }
    var A = G;
    var z = E;
    t = '<div id="tile_' + n + '" class="tileDiv" style="top:' + C + "px;left:" + u + 'px;">';
    for (var D = 1; D <= 8; D++) {
      if ((D % 2) == 0) {
        H += offsetForEvenLines
      }
      for (var B = 1; B <= 8; B++) {
        o = F[v];
        w = h(A * z);
        if (o == 0) {
          t += g(k, H, w)
        } else {
          t += c(k, H, w, o)
        }
        H += stepSize_left;
        A++;
        v++;
        z_index++
      }
      k += stepSize_top;
      H = 0;
      z++;
      A = G
    }
    t += "</div>";
    return t
  }
  function c(C, n, z, u) {
    var r = get_name_hab_from_dic(u);
    var E = r;
    var k = "";
    if (hab_dic[u].player != undefined && hab_dic[u].player.alliance != undefined) {
      k = hab_dic[u].player.alliance.name
    }
    if (r.length > 20) {
      r = r.substring(0, 20) + ".."
    }
    var H = "";
    var B = false;
    var o = hab_dic[u].points;
    var j = get_level(o);
    var A = get_player_type_from_dic(u);
    var v = "default";
    var w = "";
    var D = false;
    if (Mapcenter.getIsHabInCenter()) {
      if (hab_dic[u].mapY == Maphab.get_y() && hab_dic[u].mapX == Maphab.get_x()) {
        Maphab.set_id(u);
        B = true
      }
    }
    if (mNightModusActive) {
      var t = path_images + "Castle" + listGroundForCastle[z] + "N-" + A + "-" + j + ".png"
    } else {
      var t = path_images + "Castle" + listGroundForCastle[z] + "-" + A + "-" + j + ".png"
    }
    var m = '<div class="habitatContainer" style="top:' + C + "px; left:" + n + 'px;">';
    m += '<div id = "hab_' + u + '" class="clickRectangle"/><img';
    m += ' id="img_hab_' + u + '"';
    m += ' src="' + t + '" style="z-index:' + z_index + ';" class="hexagonImageHabitat">';
    if (A == "P") {
      var G = hab_dic[u].player.alliance;
      var F = 0;
      if (G != undefined) {
        F = G.id
      }
      v = getPathForCurrentAllyPicture(F, u);
      switch (v) {
        case"Player.png":
        case"Player@2x.png":
          w = "bg_map_self";
          break;
        case"AllianceEnemy.png":
        case"AllianceEnemy@2x.png":
          w = "bg_alliance_enemy";
          break;
        case"AllianceNeutral.png":
        case"AllianceNeutral@2x.png":
          w = "bg_alliance_neutral";
          break;
        case"AllianceNap.png":
        case"AllianceNap@2x.png":
          w = "bg_alliance_nap";
          break;
        case"AllianceAlly.png":
        case"AllianceAlly@2x.png":
          w = "bg_alliance_ally";
          break;
        case"AllianceMember.png":
        case"AllianceMember@2x.png":
          w = "bg_alliance_member";
          break;
        case"AllianceVassal.png":
        case"AllianceVassal@2x.png":
          w = "bg_alliance_vassal";
          break
      }
      v = mPath_Images + mDir_Diplomacy + v;
      allyImage = '<img class="allyImage" src="' + v + '">'
    } else {
      w = " bg_alliance_neutral";
      allyImage = '<img class="allyImage"  src="' + mPath_Images + mDir_Diplomacy + 'AllianceNeutral.png">'
    }
    var l = getMarkedCastles().list;
    if (l.indexOf(Number(u)) != -1) {
      w += " marked_color "
    }
    if (f.under_attack.in_array(u)) {
      w += " under_attack under_attack_color ";
      D = true
    } else {
      if (f.attacked.in_array(u)) {
        w += " attacked attacked_color ";
        D = true
      }
    }
    w += " nameLabel";
    m += '<div  class="nameAndIdContainter" title="' + E + "\n" + k + '"><span class="' + w + '">' + r + "</span>";
    if (map_debug) {
      H = hab_dic[u].mapX + ":" + hab_dic[u].mapY + ":" + u + "-class>" + w + "<-"
    }
    m += '<br><span title="' + H + '"  class="' + w + '" >' + allyImage + " " + o + "</span></div></div>";
    return m
  }
  function g(m, l, j) {
    if (mNightModusActive) {
      var n = path_images + arrayOfGroundPicsNamesNight[j]
    } else {
      var n = path_images + arrayOfGroundPicsNames[j]
    }
    var k = '<img src="' + n + '" class="hexagonImageNoHabitat" style="top:' + m + "px;left:" + l + "px;z-index:" + z_index + ';" />';
    return k
  }
  function h(j) {
    j = ((j + 2127912214) + (j << 12)) & 4294967295;
    j = ((j ^ 3345072700) ^ (j >> 19)) & 4294967295;
    j = ((j + 374761393) + (j << 5)) & 4294967295;
    j = ((j + 3550635116) ^ (j << 9)) & 4294967295;
    j = ((j + 4251993797) + (j << 3)) & 4294967295;
    j = ((j ^ 3042594569) ^ (j >> 16)) & 4294967295;
    return((j & 2147483647) >> 0) % 11
  }}
function updateCastleCss(b, a) {
  var c = $("#hab_" + a).parent().find(".nameLabel").addClass("attacked")
}
function get_tile_round(b) {
  var a = Math.floor(b / 8) * 8;
  return a
}
function get_name_hab_from_dic(a) {
  var b = hab_dic[a].name;
  if (b == undefined) {
    b = mStringtable.getValueOf("Renegade") + " " + a
  }
  return b
}
function get_level(b) {
  var a = 0;
  if (b >= 110) {
    a = 1
  }
  return a
}
function get_player_type_from_dic(a) {
  var b;
  if (isNaN(a) || hab_dic[a] == undefined) {
    throw"get_player_type_from_dic"
  }
  if (hab_dic[a].player == undefined) {
    b = "N"
  } else {
    b = "P"
  }
  return b
}
var ajax_locked = false;
var trigger_side = "";
var fromOtherView = false;
var json_data;
var hab_dic;
var isButton = false;
var getBackToMap = false;
var map_all_target = "gameBoardInner";
var map_view_target = "gameBoardContainer";
var path_images = "pictures/Map/";
var arrayOfGroundPicsNames = ["Ground0.png", "Ground1.png", "Ground2.png", "Ground3.png", "Ground4.png", "Ground5.png", "Ground6.png", "Ground7.png", "Ground8.png", "Ground9.png", "Ground10.png"];
var arrayOfGroundPicsNamesNight = ["Ground0N.png", "Ground1N.png", "Ground2N.png", "Ground3N.png", "Ground4N.png", "Ground5N.png", "Ground6N.png", "Ground7N.png", "Ground8N.png", "Ground9N.png", "Ground10N.png"];
var listGroundForCastle = [1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 0];
var imageHeight = 64;
var imageWidth = 128;
var offsetBetweenPicturesLeft = -2;
var offsetBetweenPicturesTop = -16;
var offsetForEvenLines = 64;
var stepSize_top = imageHeight + offsetBetweenPicturesTop;
var stepSize_left = imageWidth + offsetBetweenPicturesLeft;
var z_index = 10000;
var tile_height = stepSize_top * 8;
var tile_width = stepSize_left * 8;
var map_view_width = 0;
var map_view_height = 0;
var map_view_top = 0;
var map_view_left = 0;
var map_view_center_left = 0;
var map_view_center_top = 0;
var mouse_current_top = 0;
var mouse_current_left = 0;
var mouse_move_top = 0;
var mouse_move_left = 0;
var is_moved = false;
var trigger = false;
var distance_for_trigger_x = 175;
var distance_for_trigger_y = 175;
var last_time_update_player = new Date().getTime() - 1000;
var Nmap = new function() {
  var b = "";
  this.get_load_method = function() {
    return b
  };
  this.set_load_method = function(c) {
    b = c
  };
  var a = false;
  this.reload = function() {
    map_reloaded = true;
    this.set_reload(true);
    is_can_move = false;
    Nmap_container.reset_stack();
    Mapcenter.calc_center_tile();
    map_json_request()
  };
  this.set_reload = function(c) {
    a = c
  };
  this.get_reload = function(c) {
    return a
  };
  this.set_wh = function() {
    var c = false;
    var f = $("#" + map_view_target).offset();
    if (f != null) {
      map_view_top = f.top;
      map_view_left = f.left
    } else {
      if (map_debug) {
        throw"map_view_target does not exist"
      }
    }
    map_view_width = Math.round($("#" + map_view_target).width());
    map_view_height = Math.round($("#" + map_view_target).height());
    map_view_center_left = Math.round(map_view_left + map_view_width / 2);
    map_view_center_top = Math.round(map_view_top + map_view_height / 2);
    if ((Math.ceil(map_view_width / tile_width) + 4) > e || (Math.ceil(map_view_height / tile_height) + 4) > d) {
      c = true
    }
    var e = Math.ceil(map_view_width / tile_width) + 4;
    var d = Math.ceil(map_view_height / tile_height) + 4;
    Nmap_container.set_count_tile_x(e);
    Nmap_container.set_count_tile_y(d);
    return c
  }
};
var Maphab = new function() {
  var h = 0;
  var b = 0;
  var g = 0;
  var e = 0;
  var d = 0;
  var c = 0;
  var a = 0;
  var f = 0;
  this.set_co_hab_xy = function(j, k) {
    if (checkForOwnHabitat(j, k)) {
      e = j
    }
  };
  this.get_co_hab_x = function() {
    if (e < 1) {
      e = mPlayer.currentHabitat.mapX
    }
    return e
  };
  this.get_co_hab_y = function() {
    if (d < 1) {
      d = mPlayer.currentHabitat.mapY
    }
    return d
  };
  this.get_tile_id = function() {
    if (map_debug && c < 1) {
      throw"tile id is not set[" + c + "]"
    }
    return c
  };
  this.set_hab = function(k, j) {
    if (map_debug && check_coordinates(k, j)) {
      throw"Maphab: parameter is false [" + k + "," + j + "]"
    }
    b = k;
    g = j;
    this.set_tile_xy()
  };
  this.set_tile_xy = function() {
    a = get_tile_round(b);
    f = get_tile_round(g)
  };
  this.set_tile_id = function(j) {
    if (map_debug && j < 1) {
      throw"tile is is not posible " + j
    }
    c = j
  };
  this.set_id = function(j) {
    if (map_debug && j < 1) {
      throw"hab id is not posible"
    }
    h = j
  };
  this.get_tile_id = function() {
    if (map_debug && c < 1) {
      throw"tile id is not set[" + c + "]"
    }
    return c
  };
  this.get_id = function() {
    if (map_debug && h < 0) {
      throw"hab id is not set"
    }
    return h
  };
  this.get_x = function() {
    if (map_debug && b < 1) {
      throw"hab id is not set"
    }
    return b
  };
  this.get_y = function() {
    if (map_debug && g < 1) {
      throw"hab id is not set"
    }
    return g
  };
  this.get_tile_x = function() {
    if (map_debug && a < 1) {
      throw"tile_x is not set"
    }
    return a
  };
  this.get_tile_y = function() {
    if (map_debug && f == 0) {
      throw"tile_y is not set"
    }
    return f
  }
};
var Nmap_container = new function() {
  var b = 0;
  var n = 0;
  var j = 0;
  var d = 0;
  var o = 0;
  var h = 0;
  var e = "";
  var f = 0;
  var c = 0;
  var m = 2;
  var l = 2;
  var a = false;
  this.set_is_move = function(r) {
    a = r
  };
  this.get_is_move = function() {
    return a
  };
  this.set_map_x = function(r) {
    f = r;
    e = "set_map_x"
  };
  this.get_map_x = function() {
    return f
  };
  this.set_map_y = function(r) {
    c = r
  };
  this.get_map_y = function() {
    return c
  };
  this.calculate_map_xy = function() {
    if (trigger_side == "r") {
      f = Mapcenter.get_tile_x() - Math.round(m / 2) * 8
    } else {
      if (trigger_side == "l") {
        f = Mapcenter.get_tile_x() - Math.floor(m / 2) * 8
      } else {
        f = Mapcenter.get_tile_x() - Math.floor(m / 2) * 8
      }
    }
    if (trigger_side == "o") {
      c = Mapcenter.get_tile_y() - Math.floor(l / 2) * 8
    } else {
      if (trigger_side == "u") {
        c = Mapcenter.get_tile_y() - Math.round(l / 2) * 8
      } else {
        c = Mapcenter.get_tile_y() - Math.floor(l / 2) * 8
      }
    }
  };
  this.set_count_tile_x = function(r) {
    m = r;
    k()
  };
  this.get_count_tile_x = function() {
    return m
  };
  this.set_count_tile_y = function(r) {
    l = r;
    g()
  };
  this.get_count_tile_y = function() {
    return l
  };
  function k() {
    b = m * tile_width;
    e = "set_width"
  }
  this.get_width = function() {
    return b
  };
  function g(r) {
    n = l * tile_height
  }
  this.get_height = function() {
    return n
  };
  this.set_top = function(r) {
    j = r;
    e = "set_top"
  };
  this.get_top = function() {
    return j
  };
  this.set_left = function(r) {
    a = false;
    d = r
  };
  this.check_left = function(r) {
    var v = $("#" + map_all_target).offset();
    var r, u;
    if (v != null) {
      u = v.top;
      r = v.left
    } else {
    }
    if (Math.abs(Math.abs(r) - Math.abs(d)) > 10) {
    }
    if (Math.abs(Math.abs(u) - Math.abs(j)) > 10) {
    }
  };
  this.get_left = function() {
    if (a) {
      this.check_left()
    }
    return d
  };
  this.updateLT = function(r, t) {
    this.set_left(this.get_left() + r);
    j += t;
    this.save_in_stack();
    e = "updateLT"
  };
  this.set_top_stack = function(r) {
    o = r
  };
  this.set_left_stack = function(r) {
    h = r
  };
  this.get_top_stack = function() {
    return o
  };
  this.get_left_stack = function() {
    return h
  };
  this.reset_stack = function() {
    o = 0;
    h = 0
  };
  this.is_stack_notempty = function() {
    return !(h + o == 0)
  };
  this.set_from_stack = function() {
    this.set_left(this.get_left_stack());
    this.set_top(this.get_top_stack())
  };
  this.save_in_stack = function() {
    o = j;
    h = d
  };
  this.update_stack_window_size = function(r, t) {
    h -= r;
    o -= t
  };
  this.move = function() {
    $("#" + map_all_target).offset({top: this.get_top(), left: this.get_left()});
    a = true
  }
};
function boardSetup(c, a) {
  if (ajax_locked) {
    return false
  }
  selectButton(4, -1);
  load_map_template();
  var b = "";
  if (c == undefined) {
    c = mPlayer.currentHabitat.mapX;
    a = mPlayer.currentHabitat.mapY;
    if (Mapcenter.get_x() != c && Mapcenter.get_y() != a && !Nmap_container.get_is_move()) {
      Nmap.set_load_method("")
    }
  } else {
    b = "xy"
  }
  if (b == "xy" || str_mCurrentAction == "openMap" || Nmap.get_load_method() == "") {
    Mapcenter.setIsHabInCenter(true);
    Mapcenter.setXY(c, a);
    Maphab.set_hab(c, a);
    Nmap.set_load_method("xy");
    Nmap_container.set_is_move(false);
    Maphab.set_co_hab_xy(c, a)
  }
  if (Mapcenter.get_map_type() == "politisch") {
    wmap.start(1);
    mapActions.execute_default();
    return false
  }
  ajax_locked = true;
  mCurrentAction = openMap;
  Mapcenter.set_map_type("normal");
  mCurrentActionBlocked = true;
  map_reloaded = false;
  str_mCurrentAction = "openMap";
  mIsDefendHabitatHandlerBinded = false;
  mIsSendResourcesHandlerBinded = false;
  Nmap.set_reload(false);
  register_event();
  Nmap.set_wh();
  mapActions.closeAdditiveDiv();
  map_json_request()
}
function boardSetupFromPolMap(a, b) {
  ajax_locked = true;
  mCurrentAction = openMap;
  str_mCurrentAction = "openMap";
  mCurrentActionBlocked = true;
  map_reloaded = false;
  Mapcenter.set_map_type("normal");
  Mapcenter.setXY(a, b);
  Maphab.set_hab(mPlayer.currentHabitat.mapX, mPlayer.currentHabitat.mapY);
  Nmap.set_reload(false);
  register_event();
  Nmap.set_wh();
  map_json_request()
}
function openMapView(a) {
  if (a == undefined) {
    a = getEventDataObject(Maphab.get_id(), Maphab.get_tile_id())
  }
  mapActions.setData(a);
  if (a == false || checkForOwnHabitat(a.habitatID)) {
    mapActions.execute_default()
  } else {
    if (mapActions.getNameFoot() == "") {
      mapActions.setNameHead("openForeignHabitatView")
    }
    mapActions.execute()
  }
}
function openOwnHabitatView(a) {
  if (a == false) {
    a = getEventDataObjectFromPlayer()
  } else {
    a.units = mPlayer.habitate[a.habitatID].getHabitatUnits()
  }
  a.otherView = fromOtherView;
  a.resources_box_show = true;
  if (a.wood + a.stone + a.ore == 0) {
    a.resources_box_show = false
  }
  var b = true;
  $.each(a.units, function(d, e) {
    if (e.count != 0) {
      b = false
    }
  });
  if (b) {
    a.units = false
  }
  a.viewBla = "ownHabitatView";
  a.isOwnHabitat = true;
  if (mPlayer.currentHabitat.id == a.habitatID) {
    a.isCurHabitat = true
  } else {
    a.isCurHabitat = false
  }
  windowSize();
  var c;
  if (mResolution == "default") {
    c = "#mapViewContainer"
  }
  if (mResolution == "2x") {
    c = "#mapViewContainer2x"
  }
  a.HabitatTransits = mPlayer.findHabitatTransitsByHabitatId(a.habitatID);
  a.ExternalHabitatUnits = mPlayer.findExternalHabitatUnitsByHabitatId(a.habitatID, 1);
  a.sizeHabitatTransits = Object.size(a.HabitatTransits);
  a.sizeExternalHabitatUnits = Object.size(a.ExternalHabitatUnits);
  $.tmpl("ownHabitatViewTmpl", a).appendTo($(c).empty());
  setPapyrusBackgroundForMapViewContainer();
  setRoundCornersForHalfSidePapyrusBigBoxes(".bigBoxHalfPapyrusStyleClass");
  setRoundCornersForBigBoxes(".bigBoxStyleClass");
  setRoundCornersForSmallBoxes(".smallBoxStyleClass");
  windowSize();
  $("#own_defense_click").bind("click.ownHabitatView", {id: 1, click: a}, ownHabitatViewHandler);
  $("#own_transport_click").bind("click.ownHabitatView", {id: 2, click: a}, ownHabitatViewHandler);
  $("#copy_castle_link").bind("click.foreignHabitatView", {x: a.destX, y: a.destY}, copy_castle_link_Handler);
  $("#mark_castle").bind("click.ownHabitatView", {id: a.habitatID, x: a.destX, y: a.destY}, markCastleHandler);
  if (castleMarked(a.habitatID)) {
    $("img.markedIcon").show()
  }
  $("table.clickable").click(function(g) {
    var h;
    var f = "openTroopDetails";
    if (mResolution == "default") {
      h = "#mapHabitatView"
    }
    if (mResolution == "2x") {
      h = "#mapHabitatView2x"
    }
    var d;
    var e = $(this).metadata().key;
    if (e == "TRANSIT") {
      d = mPlayer.findHabitatById(a.habitatID).getHabitatTransitById($(this).metadata().index)
    } else {
      if (e == "MISSION") {
        d = mPlayer.findHabitatById(a.habitatID).habitatMissions[$(this).metadata().index]
      } else {
        d = {};
        d.key = e;
        d.habitatID = a.habitatID;
        f = "openMapExUnitDetails"
      }
    }
    mapActions.setData_2({informationObject: d, target: h});
    mapActions.setNameFoot(f);
    mapActions.execute()
  })
}
function openForeignHabitatView(a) {
  if (a == false) {
    a = getEventDataObject(Maphab.get_id(), Maphab.get_tile_id());
    if (a === false) {
      mapActions.execute_default()
    }
    a.otherView = fromOtherView
  }
  a.isOwnHabitat = false;
  a.isCurHabitat = false;
  a.viewBla = "foreignHabitatView";
  a.HabitatTransits = mPlayer.findHabitatTransitsByForeignHabitatId(a.habitatID);
  a.ExternalHabitatUnits = mPlayer.findExternalHabitatUnitsByHabitatId(a.habitatID, 1);
  a.ExternalHabitatUnits2 = mPlayer.findExternalHabitatUnitsByHabitatId(a.habitatID, 2);
  a.sizeHabitatTransits = Object.size(a.HabitatTransits);
  a.sizeExternalHabitatUnits = Object.size(a.ExternalHabitatUnits);
  a.sizeExternalHabitatUnits2 = Object.size(a.ExternalHabitatUnits2);
  var b = distanceToHabitat(a.destX, a.destY, mPlayer.currentHabitat.mapX, mPlayer.currentHabitat.mapY);
  if (mPlayer.currentHabitat.points >= b) {
    a.actions_allowed = true
  } else {
    a.actions_allowed = false;
    a.actions_allowed_msg = $.sprintf(mStringtable.getValueOf("No actions available. Castle is too far away. Troops of selected castle are only trained for distances up to %d fields."), mPlayer.currentHabitat.points)
  }
  a.actions_allowed = true;
  windowSize();
  if (mResolution == "default") {
    $.tmpl("foreignHabitatViewTmpl", a).appendTo($("#mapViewContainer").empty())
  }
  if (mResolution == "2x") {
    $.tmpl("foreignHabitatViewTmpl", a).appendTo($("#mapViewContainer2x").empty())
  }
  setPapyrusBackgroundForMapViewContainer();
  setRoundCornersForHalfSidePapyrusBigBoxes(".bigBoxHalfPapyrusStyleClass");
  setRoundCornersForSmallBoxes(".smallBoxStyleClass");
  setRoundCornersForBigBoxes(".bigBoxStyleClass");
  windowSize();
  $("#foreign_profile_click").bind("click.foreignHabitatView", {id: 1, click: a}, foreignHabitatViewHandler);
  $("#foreign_message_click").bind("click.foreignHabitatView", {id: 2, click: a}, foreignHabitatViewHandler);
  if (a.allyID != -1111) {
    $("#foreign_ally_click").bind("click.foreignHabitatView", {id: 3, click: a}, foreignHabitatViewHandler)
  }
  $("#foreign_report_click").bind("click.foreignHabitatView", {id: 4, click: a}, foreignHabitatViewHandler);
  $("#copy_castle_link").bind("click.foreignHabitatView", {x: a.destX, y: a.destY}, copy_castle_link_Handler);
  $("#mark_castle").bind("click.foreignHabitatView", {id: a.habitatID, x: a.destX, y: a.destY}, markCastleHandler);
  if (castleMarked(a.habitatID)) {
    $("img.markedIcon").show()
  }
  $("#foreign_defense_click").bind("click.foreignHabitatView", {id: 5, click: a}, foreignHabitatViewHandler);
  $("#foreign_transport_click").bind("click.foreignHabitatView", {id: 6, click: a}, foreignHabitatViewHandler);
  $("#foreign_attack_click").bind("click.foreignHabitatView", {id: 7, click: a}, foreignHabitatViewHandler);
  $("#foreign_spy_click").bind("click.foreignHabitatView", {id: 8, click: a}, foreignHabitatViewHandler);
  $("table.clickable").click(function(f) {
    var g;
    var e = "openTroopDetails";
    if (mResolution == "default") {
      g = "#mapHabitatView"
    }
    if (mResolution == "2x") {
      g = "#mapHabitatView2x"
    }
    var c;
    var d = $(this).metadata().key;
    if (d == "TRANSIT") {
      c = mPlayer.findHabitatById($(this).metadata().sourceHabitat_id).getHabitatTransitById($(this).metadata().index)
    } else {
      c = {};
      c.key = d;
      c.habitatID = a.habitatID;
      e = "openMapExUnitDetails"
    }
    mapActions.setData_2({informationObject: c, target: g});
    mapActions.setNameFoot(e);
    mapActions.execute()
  })
}
function getEventDataObjectFromPlayer() {
  var a = mPlayer.currentHabitat;
  var f = a.id;
  var g = -1111;
  var b = mStringtable.getValueOf("No Alliance");
  var c = "";
  var j = -1111;
  var d = mPlayer.alliance;
  if (d != undefined) {
    g = d.id;
    b = mPlayer.alliance.name;
    j = mPlayer.alliancePermission
  } else {
    d = {}
  }
  c = mPath_Images + mDir_Diplomacy + getPathForCurrentAllyPicture(g, f);
  var h = {habitatName: a.name, habitatPoints: a.points, allyPicPath: c, allyName: b, allyID: g, playerType: "P", playerName: mPlayer.nick, playerPoints: mPlayer.points, playerID: mPlayer.id, playerRank: mPlayer.rank, playerAllyPerm: j, playerAlly: d, habitatID: f, destX: a.mapX, destY: a.mapY};
  h.wood = a.habitatResources[1].getRoundedAmount();
  h.stone = a.habitatResources[2].getRoundedAmount();
  h.ore = a.habitatResources[3].getRoundedAmount();
  h.resources_box_show = true;
  if (h.wood + h.stone + h.ore == 0) {
    h.resources_box_show = false
  }
  h.units = a.getHabitatUnits();
  var e = true;
  $.each(h.units, function(k, l) {
    if (l.count != 0) {
      e = false
    }
  });
  if (e) {
    h.units = false
  }
  h.isOwnHabitat = true;
  h.isCurHabitat = true;
  h.viewBla = "ownHabitatView";
  return h
}
function getEventDataObject(f, e) {
  hab_dic = json_data.map.tileArray[get_tile_index(e)].habitatDictionary;
  if (hab_dic[f] == undefined) {
    if (map_debug) {
      alert("getEventDataObject " + f + "," + e)
    }
    return false
  }
  var t = hab_dic[f].player;
  var m = "N";
  var g = mStringtable.getValueOf("Outlaw");
  var b = 0;
  var d = -1111;
  var k = -1111;
  var n = mStringtable.getValueOf("No Alliance");
  var l = "";
  var c = -1111;
  var j = -1111;
  var u = {};
  var h = get_name_hab_from_dic(f);
  var o = "";
  var r = false;
  var a = false;
  if (t != undefined) {
    m = "P";
    k = t.id;
    g = t.nick;
    b = t.points;
    c = t.rank;
    u = t.alliance;
    a = t.isOnVacation;
    if (u != undefined) {
      d = u.id;
      n = t.alliance.name;
      j = t.alliancePermission
    } else {
      u = {}
    }
  }
  l = mPath_Images + mDir_Diplomacy + getPathForCurrentAllyPicture(d, f);
  if (a == "false") {
    a = false
  }
  if (a == "true") {
    a = true
  }
  var v = {habitatName: h, habitatPoints: hab_dic[f].points, allyID: d, allyName: n, allyPicPath: l, playerType: m, playerName: g, playerPoints: b, playerID: k, playerRank: c, playerAllyPerm: j, playerAlly: u, habitatID: f, destX: hab_dic[f].mapX, destY: hab_dic[f].mapY, habitatCreationDate: hab_dic[f].creationDate, player_isOnVaction: a};
  if (checkForOwnHabitat(f)) {
    v.wood = mPlayer.habitate[f].habitatResources[1].getRoundedAmount();
    v.stone = mPlayer.habitate[f].habitatResources[2].getRoundedAmount();
    v.ore = mPlayer.habitate[f].habitatResources[3].getRoundedAmount()
  }
  v.isNewbieProtected = checkForNewbie(hab_dic[f].creationDate, hab_dic[f].player);
  return v
}
function checkForOwnHabitat(e, d) {
  var g = false;
  if (d == undefined) {
    var f = e;
    $.each(mPlayer.habitate, function(a, b) {
      if (f == b.id) {
        g = true
      }
    })
  } else {
    var c = e, h = d;
    $.each(mPlayer.habitate, function(a, b) {
      if (c == b.MapX && h == b.MapY) {
        g = true
      }
    })
  }
  return g
}
function getPathForCurrentAllyPicture(h, d) {
  var b = "";
  var a = false;
  var f = true;
  var c = mPlayer.alliance;
  $.each(mPlayer.habitate, function(j, k) {
    if (d == k.id) {
      if (mResolution == "default") {
        b = "Player.png"
      }
      if (mResolution == "2x") {
        b = "Player@2x.png"
      }
      f = false
    }
  });
  if (f != false && h == 0) {
    if (mResolution == "default") {
      b = "AllianceNeutral.png"
    }
    f = false
  }
  if (f != false && c != undefined) {
    var g = c.diplomacyToArray;
    for (var e = 0; e < g.length; e++) {
      if (h == g[e].id) {
        switch (g[e].relationship) {
          case"-1":
            if (mResolution == "default") {
              b = "AllianceEnemy.png"
            }
            if (mResolution == "2x") {
              b = "AllianceEnemy@2x.png"
            }
            break;
          case"0":
            if (mResolution == "default") {
              b = "AllianceNeutral.png"
            }
            if (mResolution == "2x") {
              b = "AllianceNeutral@2x.png"
            }
            break;
          case"1":
            if (mResolution == "default") {
              b = "AllianceNap.png"
            }
            if (mResolution == "2x") {
              b = "AllianceNap@2x.png"
            }
            break;
          case"2":
            if (mResolution == "default") {
              b = "AllianceAlly.png"
            }
            if (mResolution == "2x") {
              b = "AllianceAlly@2x.png"
            }
            break;
          case"3":
            if (mResolution == "default") {
              b = "AllianceVassal.png"
            }
            if (mResolution == "2x") {
              b = "AllianceVassal@2x.png"
            }
            break;
          default:
            if (mResolution == "default") {
              b = "AllianceNeutral.png"
            }
            if (mResolution == "2x") {
              b = "AllianceNeutral@2x.png"
            }
            break
          }
      }
    }
    if (h == mPlayer.alliance.id && !a) {
      if (mResolution == "default") {
        b = "AllianceMember.png"
      }
      if (mResolution == "2x") {
        b = "AllianceMember@2x.png"
      }
    }
  }
  if (b == "") {
    if (mResolution == "default") {
      b = "AllianceNeutral.png"
    }
    if (mResolution == "2x") {
      b = "AllianceNeutral@2x.png"
    }
  }
  return b
}
function checkForNewbie(d, c) {
  if (typeof d != "undefined") {
    var b = false;
    var a = new Date();
    var f = jsonDateToDate(d);
    var e = parseInt(mSettings.newbieProtectionDays) * 86400000;
    if ((f.getTime() + e) > (new Date() - mTimeDifferenceToServer)) {
      b = true
    } else {
      b = false
    }
    return b
  } else {
    return false
  }
}
function getNewbieProtectionTime(c) {
  var b = jsonDateToDate(c);
  var d = parseInt(mSettings.newbieProtectionDays) * 86400000;
  var a = b.getTime() + d;
  var e = formatDateTime(new Date(a));
  return $.sprintf(mStringtable.getValueOf("Castle is protected by newbie protection until %@."), e)
}
function set_map_all_target_position() {
  var f, d;
  var c, e;
  Mapcenter.get_info();
  if (Mapcenter.getIsHabInCenter()) {
    c = -(Nmap_container.get_width() - map_view_width) / 2 - map_view_left - 20;
    e = map_view_top - (Nmap_container.get_height() - map_view_height) / 2 - stepSize_top;
    f = (Mapcenter.get_x() - Nmap_container.get_map_x()) * stepSize_left;
    d = (Mapcenter.get_y() - Nmap_container.get_map_y()) * stepSize_top;
    if (Math.round(Mapcenter.get_y()) % 2 == 1) {
      e = e + 14;
      c = c - offsetForEvenLines
    }
    var b = Math.round(c - (f - Nmap_container.get_width() / 2));
    var a = Math.round(e - (d - Nmap_container.get_height() / 2));
    Nmap_container.set_left(b);
    Nmap_container.set_top(a)
  } else {
    if (Nmap_container.is_stack_notempty()) {
      Nmap_container.set_from_stack();
      trigger_for_request()
    } else {
      if (Nmap.get_reload()) {
        f = (Mapcenter.get_tile_x() - Nmap_container.get_map_x()) * stepSize_left - Mapcenter.get_distance_tile_x();
        d = (Mapcenter.get_tile_y() - Nmap_container.get_map_y()) * stepSize_top - Mapcenter.get_distance_tile_y();
        var b = Math.round(Nmap_container.get_left() - f);
        var a = Math.round(Nmap_container.get_top() - d);
        Nmap_container.set_left(b);
        Nmap_container.set_top(a)
      } else {
      }
    }
  }
  Nmap_container.move()
}
function trigger_for_request() {
  if (trigger) {
    return false
  }
  if (Nmap_container.get_top() + distance_for_trigger_y > map_view_top) {
    trigger = true;
    trigger_side = "u"
  }
  if (Nmap_container.get_top() + Nmap_container.get_height() < map_view_top + map_view_height + distance_for_trigger_y) {
    trigger = true;
    trigger_side = "o"
  }
  if (Nmap_container.get_left() + distance_for_trigger_x > map_view_left) {
    trigger = true;
    trigger_side = "r"
  }
  if (Nmap_container.get_left() + Nmap_container.get_width() < map_view_left + map_view_width + distance_for_trigger_x) {
    trigger = true;
    trigger_side = "l"
  }
  if (trigger) {
    Nmap.reload();
    return true
  }
  Arrow_removal.show_pointer();
  return false
}
function map_json_request() {
  if (!mIsBlocked) {
    blockUI("MapAction/map")
  }
  var a = (Nmap_container.get_count_tile_x() - 1) * 8;
  var c = (Nmap_container.get_count_tile_y() - 1) * 8;
  Nmap_container.calculate_map_xy();
  var e = Nmap_container.get_map_x();
  var b = Nmap_container.get_map_y();
  if (map_debug && (isNaN(a) || isNaN(c) || isNaN(e) || isNaN(b))) {
    throw"parameter for map_json_request is falsch [" + a + "," + c + "," + e + "," + b + "]"
  }
  var d = {};
  d.mapX = e;
  d.mapY = b;
  d.mapWidth = a;
  d.mapHeight = c;
  d.PropertyListVersion = propertyListVersion;
  d[mPlayer.userIdentifier] = mPlayer.getHash();
  genericAjaxRequest("MapAction/map", d, "callback_map", 5000, "nmap_jsonp_error")
}
function nmap_jsonp_error() {
  showPapyrusMsgBox(mStringtable.getValueOf("Server is offline"), false, false, false, false);
  openHabitatView()
}
function callback_map(a) {
  if (a.error) {
    if (a.error == "No session.") {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error), false, logoutEvent, false, false)
    } else {
      showPapyrusMsgBox(mStringtable.getValueOf(a.error))
    }
  } else {
    json_data = a;
    delete a;
    generate_map();
    openMapView()
  }
}
function register_wmap_events(b) {
  if (!events_for_pol_map || b != undefined) {
    $("#gameBoardContainer").bind("mousedown", handlerForMouseDown);
    $(document).bind("mouseup", handlerForMouseUp);
    wmap.moved = false;
    unregister_map_event();
    events_for_pol_map = true
  }
}
function unregister_wmap_events() {
  if (events_for_pol_map) {
    $("#gameBoardContainer").unbind("mousedown", handlerForMouseDown);
    $(document).unbind("mouseup", handlerForMouseUp);
    $("#gameBoardContainer").unbind("mousemove");
    $("#gameBoardContainer").css("cursor", "default");
    events_for_pol_map = false
  }
}
function handlerForMouseDown(a) {
  if (str_mCurrentAction == "openPolMap") {
    $("#gameBoardContainer").css("cursor", "move");
    wmap.mouse_current_left = a.pageX;
    wmap.mouse_current_top = a.pageY;
    $("#gameBoardContainer").bind("mousemove", handlerForMouseMove);
    a.preventDefault();
    a.stopPropagation()
  }
}
function handlerForMouseMove(a) {
  if (str_mCurrentAction == "openPolMap") {
    wmap.move(a.pageX, a.pageY)
  }
  a.preventDefault();
  a.stopPropagation()
}
function handlerForMouseUp(a) {
  if (str_mCurrentAction == "openPolMap") {
    $("#gameBoardContainer").unbind("mousemove");
    $("#gameBoardContainer").css("cursor", "default");
    if (wmap.moved === false) {
      if (is_map_area(a) && !is_button_area(a, "centerHabitatButtonImage") && !is_button_area(a, "wmapButtonImage")) {
        go_to_nmap(a.pageX, a.pageY)
      }
    }
    wmap.moved = false;
    a.preventDefault()
  }
}
function hPlayerMap() {
  wmap.start_for_ext_plaeyr()
}
function hAlliancePmap(a) {
  wmap.start_for_ext_alliance(a.data.alliance_id)
}
function go_to_nmap(b, d, a) {
  var c = get_xy_from_lt(b, d, a);
  boardSetupFromPolMap(c.x, c.y)
}
function get_xy_from_lt(b, e, d) {
  var a = true;
  if (d != undefined && d === false) {
    a = false
  }
  if (a && wmap.shift && Math.floor(e / config.IMG_SIZE) % 2 == 1) {
    b -= config.SHIFT
  }
  coordinate_converter.con2();
  x = coordinate_converter.leftToX(b);
  y = coordinate_converter.topToY(e);
  p = wmap.get_tile_from_lt(b, e);
  var g = Math.floor((b - p.left) / 16);
  var h = Math.floor((e - p.top) / 16);
  coordinate_converter.con(p.min_x, p.min_y);
  var c = coordinate_converter.leftToX(g);
  var f = coordinate_converter.topToY(h);
  return{x: c, y: f}
}
function is_map_area(a) {
  var b = 30;
  return(a.pageX > wmap.map_view_left + b && a.pageX < (wmap.map_view_left + wmap.map_view_width - b) && a.pageY > (wmap.map_view_top + b) && a.pageY < (wmap.map_view_top + wmap.map_view_height - b))
}
function is_button_area(g, d) {
  var b = 0;
  var c = 0;
  var f = $("#" + d).height();
  var a = $("#" + d).width();
  var j = $("#" + d).offset();
  if (j != null) {
    b = j.left;
    c = j.top
  }
  return(g.pageX < (b + a) && g.pageY < (c + f))
}
var Extern_player = {id: 0, burgs: {}, xs: [], ys: [], median_x: -1, median_y: -1, set_id: function(a) {
    this.id = a
  }, get_id: function() {
    return this.id
  }, set_burgs: function(a) {
    this.burgs = a
  }, create: function() {
    this.set_id(mProfileView.player.id);
    this.set_burgs(mProfileView.player.habitate);
    this.set_xsys();
    this.calculate_median_x();
    this.calculate_median_y()
  }, set_xsys: function() {
    var d = [], c = [];
    $.each(this.burgs, function(a, b) {
      d.push(b.mapX);
      c.push(b.mapY)
    });
    this.xs = d;
    this.ys = c
  }, set_median_x: function(a) {
    this.median_x = a
  }, get_median_x: function() {
    if (map_debug && check_coordinates(this.median_x, this.median_y)) {
      throw"Extern_player is not created [" + this.median_x + "," + this.median_y + "]"
    }
    return this.median_x
  }, set_median_y: function(a) {
    this.median_y = a
  }, get_median_y: function() {
    return this.median_y
  }, calculate_median_x: function() {
    this.set_median_x(calculate_median(this.xs))
  }, calculate_median_y: function() {
    this.set_median_y(calculate_median(this.ys))
  }};
var Extern_alliance = {id: 0, alliance: {}, players_id: [], burgs: {}, xs: [], ys: [], median_x: -1, median_y: -1, set_id: function(a) {
    this.id = a
  }, get_id: function() {
    return this.id
  }, set_burgs: function(a) {
    this.burgs = a
  }, create: function(a) {
    this.set_id(a)
  }, set_players_id: function() {
  }, set_xsys: function() {
    var d = [], c = [];
    $.each(this.burgs, function(a, b) {
      d.push(b.mapX);
      c.push(b.mapY)
    });
    this.xs = d;
    this.ys = c
  }, set_median_x: function(a) {
    this.median_x = a
  }, get_median_x: function() {
    if (map_debug && check_coordinates(this.median_x, this.median_y)) {
      throw"Extern_player is not created [" + this.median_x + "," + this.median_y + "]"
    }
    return this.median_x
  }, set_median_y: function(a) {
    this.median_y = a
  }, get_median_y: function() {
    return this.median_y
  }, calculate_median_x: function() {
    this.set_median_x(calculate_median(this.xs))
  }, calculate_median_y: function() {
    this.set_median_y(calculate_median(this.ys))
  }};
function calculate_median(a) {
  var b = a.length;
  var d = Math.round(b / 2);
  var c = Math.floor(b / 2);
  if (map_debug && b == 0) {
    throw"calculate_median: array is empty"
  } else {
    if (b == 1) {
      return a[0]
    } else {
      if (b % 2 == 1) {
        return a[d]
      } else {
        return Math.round((a[d] + a[c]) / 2)
      }
    }
  }
}
var lines = {top: 0, left: 0, WIDTH: 3242, HEIGHT: 3226, on_create: false, create: function() {
    $("<div/>", {id: "lines"}).appendTo("#" + map_all_target);
    this.on_create = true;
    this.set_left();
    this.set_top();
    this.move()
  }, set_left: function(a) {
    if (a == undefined) {
      this.left = Math.round(Wmap_phab.get_left() - (this.WIDTH / 2)) + 8;
      if (wmap.shift && Wmap_phab.get_y() % 2 == 1) {
        this.left += config.SHIFT
      }
    } else {
      this.left = a
    }
  }, get_left: function() {
    var a = $("#lines").offset();
    return this.left
  }, set_top: function(a) {
    if (a == undefined) {
      this.top = Math.round(Wmap_phab.get_top() - (this.HEIGHT / 2)) + 9
    } else {
      this.top = a
    }
  }, get_top: function() {
    return this.top
  }, move: function() {
    $("#lines").offset({top: this.get_top(), left: this.get_left()})
  }, set_lt_and_move: function() {
    Wmap_phab.find_left();
    Wmap_phab.find_top();
    this.move()
  }, };
var Wmap_phab = {id: 0, x: 0, y: 0, left: 0, top: 0, set_left: function(a) {
    this.left = a
  }, get_left: function() {
    if (map_debug && (isNaN(this.left) || this.left == 0)) {
      throw"Wmap_phab  get_left is falsch [" + this.left + "]"
    }
    return this.left
  }, find_left: function() {
    var d = 0;
    var f = "bg_" + this.get_x() + "_" + this.get_y();
    var e = $("#" + f).offset();
    if (e != null) {
      d = e.left
    } else {
      var b = (Mapcenter.get_x() - this.x) * 16;
      var a = (Mapcenter.get_y() - this.y) * 16;
      d = Math.round(wmap.map_view_center_left - b)
    }
    var c = Math.round(d - (lines.WIDTH / 2)) + 8;
    if (wmap.shift && this.get_y() % 2 == 1 && e == null) {
      c += config.SHIFT
    }
    lines.set_left(c)
  }, find_top: function() {
    var d = 0;
    var f = "bg_" + this.get_x() + "_" + this.get_y();
    var e = $("#" + f).offset();
    if (e != null) {
      d = e.top
    } else {
      var c = (Mapcenter.get_x() - this.x) * 16;
      var a = (Mapcenter.get_y() - this.y) * 16;
      d = Math.round(wmap.map_view_center_top - a)
    }
    var b = Math.round(d - (lines.HEIGHT / 2)) + 9;
    lines.set_top(b)
  }, set_top: function(a) {
    this.top = a
  }, get_top: function() {
    return this.top
  }, set_x: function(a) {
    this.x = a
  }, get_x: function() {
    if (map_debug && check_coordinates(this.x, this.y)) {
      throw"hab X is false :" + this.x
    }
    return this.x
  }, set_y: function(a) {
    this.y = a
  }, get_y: function() {
    if (map_debug && check_coordinates(this.x, this.y)) {
      throw"hab Y is false :" + this.y
    }
    return this.y
  }, create: function() {
    this.set_x(Maphab.get_co_hab_x());
    this.set_y(Maphab.get_co_hab_y());
    var b = (Mapcenter.get_x() - this.x) * 16;
    var a = (Mapcenter.get_y() - this.y) * 16;
    this.set_left(Math.round(wmap.map_view_center_left - b));
    this.set_top(Math.round(wmap.map_view_center_top - a))
  }};
var coordinate_converter = {l_min: 0, l_max: 0, t_min: 0, t_max: 0, x_min: 0, x_max: 0, y_min: 0, y_max: 0, con: function(b, a) {
    this.x_min = b * 32;
    this.x_max = (b + 1) * 32 - 1;
    this.y_min = a * 32;
    this.y_max = (a + 1) * 32 - 1;
    this.l_min = 0;
    this.l_max = 32 - 1;
    this.t_min = 0;
    this.t_max = 32 - 1
  }, con2: function() {
    this.l_min = wmap.map_all_left;
    this.l_max = this.l_min + Math.floor(wmap.map_all_width - 16);
    this.t_min = wmap.map_all_top;
    this.t_max = this.t_min + Math.floor(wmap.map_all_height - 16);
    this.x_min = wmap.tile_x_min * 32;
    this.x_max = (wmap.tile_x_max + 1) * 32 - 1;
    this.y_min = wmap.tile_y_min * 32;
    this.y_max = (wmap.tile_y_max + 1) * 32 - 1
  }, xToleft: function(a) {
    var b = Math.round((a - this.x_min) * (this.l_max - this.l_min) / (this.x_max - this.x_min) + this.l_min);
    return b
  }, yToTop: function(b) {
    var a = Math.round((b - this.y_min) * (this.t_max - this.t_min) / (this.y_max - this.y_min) + this.t_min);
    return a
  }, leftToX: function(b) {
    var a = Math.round((this.x_max - this.x_min) * (b - this.l_min) / (this.l_max - this.l_min) + this.x_min);
    return a
  }, topToY: function(a) {
    var b = Math.round((this.y_max - this.y_min) * (a - this.t_min) / (this.t_max - this.t_min) + this.y_min);
    return b
  }};
var wmap_request_bounds_trial = 0;
function wmap_request_bounds() {
  wmap_request_bounds_trial++;
  if (bounds.start) {
    return false
  }
  var a = mapUrl + "/tiles.jsonp";
  $.ajax({type: "POST", url: a, dataType: "jsonp", jsonp: "callback", jsonpCallback: "callback_politicaltiles", error: hrb, timeout: 2000})
}
function hrb() {
  if (wmap_request_bounds_trial < 4 && !bounds.start) {
    setTimeout(wmap_request_bounds, 1000)
  }
}
function callback_politicaltiles(a) {
  bounds.init(a)
}
function wmap_json_request(b) {
  var a = mapUrl + "/" + b + ".jtile";
  $.ajax({type: "POST", url: a, dataType: "jsonp", jsonp: "callback", jsonpCallback: "callback_politicalmap", error: hck, timeout: 2000})
}
function hck() {
}
function callback_politicalmap(e) {
  var c = e.rect;
  var f = c.match(/\d+/g);
  var b = Math.floor(f[0] / 32);
  var a = Math.floor(f[1] / 32);
  var g = b + "_" + a;
  wmap.add_json(e, g);
  q.shift()
}
var q = {entities: [], requests: [], stack: 0, busy: false, blocked: true, time_request: 0, add: function(a) {
    if (this.requests.in_array(a)) {
      return false
    }
    this.entities.push(a);
    this.requests.push(a);
    this.stack++;
    wmap.json_data_wmap[a] = 0;
    if (!this.busy) {
      this.shift()
    }
    if (!mIsBlocked && this.blocked) {
      blockUI("MapAction/map")
    }
  }, shift: function() {
    if (this.stack == 0) {
      this.busy = false;
      if (mIsBlocked) {
        unblockUI()
      }
      this.blocked = false;
      return
    }
    wmap_json_request(this.entities.shift());
    this.time_request = new Date().getTime();
    this.busy = true;
    this.stack--
  }};
var bounds = new function() {
  var b = false;
  var a = null;
  this.init = function(c) {
    a = c;
    b = true;
    if (str_mCurrentAction == "openPolMap") {
      wmap.create_tiles()
    }
  };
  this.exists = function(c) {
    return a.in_array(c)
  }
};
function Tile() {
  this.id = 0;
  this.tx = 0;
  this.ty = 0;
  this.top = 0;
  this.left = 0;
  this.content = false
}
Tile.prototype.create = function(b, a) {
  this.tx = b;
  this.ty = a;
  var e = b - wmap.tile_x_min;
  var c = a - wmap.tile_y_min;
  this.top = c * config.TILE_HTML_SIZE;
  this.left = e * config.TILE_HTML_SIZE;
  this.id = b + "_" + a;
  var d = '<div id="' + this.id + '" class="tile"  style="top:' + this.top + "px;left:" + this.left + 'px;"></div>';
  $("#" + map_all_target).append(d);
  this.get_tile()
};
Tile.prototype.get_tile = function() {
  if (wmap.json_data_wmap[this.id] === undefined) {
    this.is_visible()
  } else {
    this.add_json(wmap.json_data_wmap[this.id])
  }
};
Tile.prototype.is_visible = function() {
  var d = Math.abs(wmap.map_all_left) + Math.abs(wmap.map_view_left);
  var c = d + wmap.map_view_width;
  var b = Math.abs(wmap.map_all_top) + Math.abs(wmap.map_view_top);
  var a = b + wmap.map_view_height;
  b -= config.TILE_HTML_SIZE;
  d -= config.TILE_HTML_SIZE;
  if (this.top > b && this.top < a && this.left > d && this.left < c) {
    if (bounds.exists(this.id)) {
      q.add(this.id)
    }
  }
};
Tile.prototype.add_json = function(e) {
  if (e == 0) {
    return false
  }
  var c = 0;
  var k = e.habitatArray;
  coordinate_converter.con(this.tx, this.ty);
  var g = "", b = "", d = 0, j = 0;
  for (var f = 0, h = k.length; f < h; f++) {
    b = config.PATH_POLMAP_IMG + getAllyImg(k[f].allianceid, k[f].id, k[f].playerid);
    d = coordinate_converter.xToleft(k[f].mapx) * 16;
    j = coordinate_converter.yToTop(k[f].mapy) * 16;
    if (wmap.shift && k[f].mapy % 2 == 1) {
      d += config.SHIFT
    }
    c = "bg_" + k[f].mapx + "_" + k[f].mapy;
    if (wmap.type_player == "ext" && Extern_player.get_id() == k[f].playerid) {
      b = config.PATH_POLMAP_IMG + "mapMarked.png"
    }
    if (wmap.type_player == "alliance" && Extern_alliance.get_id() == k[f].allianceid) {
      b = config.PATH_POLMAP_IMG + "mapMarked.png"
    }
    g += '<img id="' + c + '" title="' + c + '" src="' + b + '" class="wmap_part" style="top:' + j + "px;left:" + d + 'px;">'
  }
  this.content = true;
  $("#" + this.id).html(g)
};
Tile.prototype.move = function(a) {
  if (a == "left") {
    this.left += config.TILE_HTML_SIZE
  }
  if (a == "top") {
    this.top += config.TILE_HTML_SIZE
  }
};
Tile.prototype.execute_css_lt = function() {
  $("#" + this.id).css("top", this.top + "px").css("left", this.left + "px");
  this.is_visible()
};
function getAllyImg(d, c, b) {
  var h = "mapNeutral.png";
  var f = false;
  if (d == "") {
    if (b == "") {
      h = "mapNPC.png";
      f = true
    } else {
      h = "mapNeutral.png";
      f = true
    }
  }
  $.each(mPlayer.habitate, function(j, k) {
    if (c == k.id) {
      h = "mapSelf.png";
      f = true
    }
  });
  if (castleMarked(Number(c))) {
    h = "mapMarked.png";
    f = true
  }
  if (f) {
    return h
  }
  if (mPlayer.alliance != undefined) {
    var g = mPlayer.alliance.diplomacyToArray;
    for (var e = 0, a = g.length; e < a; e++) {
      if (d == g[e].id) {
        switch (g[e].relationship) {
          case"-1":
            h = "mapEnemy.png";
            break;
          case"0":
            h = "mapNeutral.png";
            break;
          case"1":
            h = "mapNAP.png";
            break;
          case"2":
            h = "mapAlly.png";
            break;
          case"3":
            h = "mapVasall.png";
            break;
          default:
            h = "mapNeutral.png";
            break
          }
      }
    }
    if (d == mPlayer.alliance.id) {
      h = "mapAlliance.png"
    }
  }
  return h
}
var config = {PATH_POLMAP_IMG: "pictures/polmap/", IMG_SIZE: 16, TILE_SIZE: 32, TILE_HTML_SIZE: 512, SHIFT: 8};
var wmap = {json_data_wmap: [], abstand_x: 400, abstand_y: 400, distance_for_trigger: 550, tiles_liste: [], tile_size: 512, tiles_count_x: 1, tiles_count_y: 1, tile_x_min: 0, tile_y_min: 0, tile_x_max: 0, tile_y_max: 0, map_all_top: 0, map_all_left: 0, map_all_height: 0, map_all_width: 0, map_view_top: 0, map_view_left: 0, map_view_height: 0, map_view_width: 0, map_view_center_left: 0, map_view_center_top: 0, mouse_current_left: 0, mouse_current_top: 0, moved: false, onMove: false, shift: true, type_player: "self", start: function(b) {
    this.type_player = "self";
    this.start_normal(b)
  }, start_normal: function(b) {
    selectButton(4, -1);
    if ($("#img_distance_to_castle").is(":visible")) {
      $("#distance_to_castle_text").hide();
      $("#img_distance_to_castle").hide()
    }
    this.onMove = false;
    str_mCurrentAction = "openPolMap";
    $("#" + map_all_target).empty();
    Mapcenter.set_map_type("politisch");
    this.get_map_dimension();
    this.set_start_pos();
    Wmap_phab.create(mPlayer.currentHabitat.mapX, mPlayer.currentHabitat.mapY);
    if (bounds.start) {
      wmap.create_tiles()
    } else {
      wmap_request_bounds()
    }
    register_wmap_events(b);
    register_map_events()
  }, start_for_ext_plaeyr: function() {
    this.type_player = "ext";
    Extern_player.create();
    load_map_template();
    Mapcenter.setXY(Extern_player.get_median_x(), Extern_player.get_median_y());
    this.start_normal(1);
    mapActions.execute_default()
  }, start_for_ext_alliance: function(a) {
    this.type_player = "alliance";
    Extern_alliance.create(a);
    load_map_template();
    Mapcenter.setXY(mPlayer.currentHabitat.mapX, mPlayer.currentHabitat.mapY);
    this.start_normal(1);
    mapActions.execute_default()
  }, helper_for_create_tiles: function() {
  }, create_tiles: function() {
    this.tiles_liste = [];
    var a, d;
    for (var c = this.tile_y_min; c <= this.tile_y_max; c++) {
      for (var b = this.tile_x_min; b <= this.tile_x_max; b++) {
        a = new Tile;
        a.create(b, c);
        d = b + "_" + c;
        this.tiles_liste[d] = a
      }
    }
    this.trigger_for_request();
    lines.create()
  }, get_map_dimension: function() {
    this.map_view_width = Math.round($("#" + map_view_target).width());
    this.map_view_height = Math.round($("#" + map_view_target).height());
    var a = $("#" + map_view_target).offset();
    this.map_view_top = Math.round(a.top);
    this.map_view_left = Math.round(a.left);
    this.map_all_width = Math.round(this.map_view_width + this.abstand_x);
    this.map_all_height = Math.round(this.map_view_height + this.abstand_y);
    this.map_view_center_left = Math.round(this.map_view_left + this.map_view_width / 2);
    this.map_view_center_top = Math.round(this.map_view_top + this.map_view_height / 2);
    this.tiles_count_x = Math.round(this.map_all_width / config.TILE_HTML_SIZE);
    this.map_all_width = this.tiles_count_x * config.TILE_HTML_SIZE;
    this.abstand_x = Math.round((this.map_all_width - this.map_view_width));
    $("#" + map_all_target).width(this.map_all_width);
    this.tiles_count_y = Math.round(this.map_all_height / config.TILE_HTML_SIZE);
    this.map_all_height = this.tiles_count_y * config.TILE_HTML_SIZE;
    this.abstand_y = Math.round((this.map_all_height - this.map_view_height));
    $("#" + map_all_target).height(this.map_all_height);
    this.map_all_top = Math.round(this.map_view_top - this.abstand_y / 2);
    this.map_all_left = Math.round(this.map_view_left - this.abstand_x / 2)
  }, set_start_pos: function() {
    var b = Math.floor(Mapcenter.get_x() / 32);
    var a = Math.floor(Mapcenter.get_y() / 32);
    this.tile_x_min = Math.round(b - this.tiles_count_x / 2);
    this.tile_x_max = this.tile_x_min + this.tiles_count_x - 1;
    this.tile_y_min = Math.round(a - this.tiles_count_y / 2);
    this.tile_y_max = this.tile_y_min + this.tiles_count_y - 1;
    var d = Math.round((this.tile_x_min + this.tile_x_max + 1) * 16);
    var c = Math.round((this.tile_y_min + this.tile_y_max + 1) * 16);
    this.map_all_top += 16 * (c - Mapcenter.get_y());
    this.map_all_left += 16 * (d - Mapcenter.get_x());
    this.set_css_pos_target_all()
  }, set_css_pos_target_all: function() {
    $("#" + map_all_target).offset({top: this.map_all_top, left: this.map_all_left})
  }, get_tile_from_lt: function(a, e) {
    for (var d = 1; d <= this.tiles_count_x; d++) {
      if (a < (this.map_all_left + config.TILE_HTML_SIZE * d)) {
        break
      }
    }
    for (var b = 1; b <= this.tiles_count_y; b++) {
      if (e < (this.map_all_top + config.TILE_HTML_SIZE * b)) {
        break
      }
    }
    var f = wmap.tile_x_min + d - 1;
    var c = wmap.tile_y_min + b - 1;
    var h = f + "_" + c;
    if ($("#" + h).length == 0) {
    }
    var g = $("#" + h).offset();
    if (g == null) {
    } else {
      g.min_x = f;
      g.min_y = c
    }
    return g
  }, move: function(a, d) {
    this.moved = true;
    var c = a - this.mouse_current_left;
    var b = d - this.mouse_current_top;
    this.map_all_top += b;
    this.map_all_left += c;
    this.mouse_current_top = d;
    this.mouse_current_left = a;
    Mapcenter.updateXY(c, b);
    this.set_css_pos_target_all();
    this.trigger_for_request()
  }, trigger_for_request: function() {
    var a = true;
    if (this.map_all_top + this.distance_for_trigger > this.map_view_top) {
      this.map_all_top -= config.TILE_HTML_SIZE;
      $("#" + map_all_target).offset({top: this.map_all_top, left: this.map_all_left});
      this.add_height("min");
      this.tile_move("top");
      this.add_tiles_y(this.tile_y_min);
      this.tile_refresh();
      lines.set_lt_and_move();
      a = false
    }
    if (this.map_all_top + this.map_all_height < this.map_view_top + this.map_view_height + this.distance_for_trigger) {
      this.add_height("max");
      this.tile_refresh();
      a = false
    }
    if (this.map_all_left + this.map_all_width < this.map_view_left + this.map_view_width + this.distance_for_trigger) {
      this.add_width("max");
      a = false
    }
    if (this.map_all_left + this.distance_for_trigger > this.map_view_left) {
      this.map_all_left -= config.TILE_HTML_SIZE;
      this.add_width("min");
      this.tile_move("left");
      this.add_tiles_x(this.tile_x_min);
      this.tile_refresh();
      $("#" + map_all_target).offset({top: this.map_all_top, left: this.map_all_left});
      lines.set_lt_and_move();
      a = false
    }
    if (a) {
      this.tile_refresh()
    }
  }, add_width: function(a) {
    this.map_all_width += config.TILE_HTML_SIZE;
    $("#" + map_all_target).width(this.map_all_width);
    if (a == "max") {
      this.tile_x_max++;
      this.add_tiles_x(this.tile_x_max)
    } else {
      this.tile_x_min--
    }
  }, add_height: function(a) {
    this.map_all_height += config.TILE_HTML_SIZE;
    $("#" + map_all_target).height(this.map_all_height);
    if (a == "max") {
      this.tile_y_max++;
      this.add_tiles_y(this.tile_y_max)
    } else {
      this.tile_y_min--
    }
  }, add_tiles_x: function(b) {
    for (var d = this.tile_y_min; d <= this.tile_y_max; d++) {
      var a = new Tile;
      a.create(b, d);
      var c = b + "_" + d;
      wmap.tiles_liste[c] = a
    }
    this.tile_refresh()
  }, add_tiles_y: function(d) {
    for (var b = this.tile_x_min; b <= this.tile_x_max; b++) {
      var a = new Tile;
      a.create(b, d);
      var c = b + "_" + d;
      wmap.tiles_liste[c] = a
    }
  }, add_json: function(b, c) {
    this.json_data_wmap[c] = b;
    var a = this.tiles_liste[c];
    if (a != undefined) {
      a.add_json(b)
    } else {
    }
  }, tile_move: function(a) {
    for (var c = this.tile_y_min; c <= this.tile_y_max; c++) {
      for (var b = this.tile_x_min; b <= this.tile_x_max; b++) {
        if (this.tiles_liste[b + "_" + c] == undefined) {
        } else {
          this.tiles_liste[b + "_" + c].move(a)
        }
      }
    }
  }, tile_refresh: function() {
    for (var b = wmap.tile_y_min; b <= wmap.tile_y_max; b++) {
      for (var a = wmap.tile_x_min; a <= wmap.tile_x_max; a++) {
        id = a + "_" + b;
        if (wmap.tiles_liste[id] == undefined) {
        } else {
          wmap.tiles_liste[id].execute_css_lt()
        }
      }
    }
  }};