'use strict';

/**
 * @ngdoc service
 * @name webdan.Member
 * @description
 * # Member
 * Factory in the webdan.
 */

angular.module('webdan').factory('Member', ['webdanRef', '$firebaseArray', '$firebaseObject', '$firebaseUtils', function (webdanRef, $firebaseArray, $firebaseObject, $firebaseUtils) {

  var ref = webdanRef.child('members');
  var members = $firebaseArray(ref);
  var Member = {};
  var selectOptions = void 0;

  Member.query = function (copy) {
    return members;
  };

  Member.remove = function (member) {
    var origMember = members.$getRecord(member.$id);
    return members.$remove(origMember).catch(function (err) {
      throw err;
    });
  };

  Member.save = function (member) {
    var origMember = members.$getRecord(member.$id);
    var plainMember = $firebaseUtils.toJSON(member);
    angular.extend(origMember, plainMember);
    return members.$save(origMember).catch(function (err) {
      throw err;
    });
  };

  Member.add = function (member) {
    return members.$add(member).catch(function (err) {
      throw err;
    });
  };

  Member.isEmpty = function (member) {
    return !member.g_no.trim() && !member.g_name.trim();
  };

  Member.selectOptions = function () {
    if (!selectOptions) {
      selectOptions = {};
      members.forEach(function (member) {
        selectOptions[member.$id] = member.g_name;
      });
    }
    return selectOptions;
  };

  Member.renderName = function (instance, td, row, col, prop, memberId, cellProperties) {
    return renderProp(td, memberId, 'g_name');
  };

  Member.renderNo = function (instance, td, row, col, prop, memberId, cellProperties) {
    return renderProp(td, memberId, 'g_no');
  };

  function renderProp(td, memberId, prop) {
    var member = members.$getRecord(memberId);
    if (member) {
      angular.element(td).html(member[prop] || '');
    }
    return td;
  }

  return Member;
}]);
//# sourceMappingURL=member.js.map
