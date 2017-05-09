'use strict';

/**
 * @ngdoc service
 * @name webdan.MemberSection
 * @description
 * # MemberSection
 * Factory in the webdan.
 */

angular.module('webdan').factory('MemberSection', ['webdanRef', '$firebaseArray', '$firebaseObject', '$firebaseUtils', function (webdanRef, $firebaseArray, $firebaseObject, $firebaseUtils) {

  var ref = webdanRef.child('memberSections');
  var memberSections = $firebaseArray(ref);
  var MemberSection = {};

  MemberSection.query = function () {
    return memberSections;
  };

  MemberSection.remove = function (memberSection) {
    var origMemberSection = memberSections.$getRecord(memberSection.$id);
    return memberSections.$remove(origMemberSection).catch(function (err) {
      throw err;
    });
  };

  MemberSection.save = function (memberSection) {
    var origMemberSection = memberSections.$getRecord(memberSection.$id);
    var plainMemberSection = $firebaseUtils.toJSON(memberSection);
    angular.extend(origMemberSection, plainMemberSection);
    return memberSections.$save(origMemberSection).catch(function (err) {
      throw err;
    });
  };

  MemberSection.add = function (memberSection) {
    return memberSections.$add(memberSection).catch(function (err) {
      throw err;
    });
  };

  MemberSection.isEmpty = function (memberSection) {
    return !memberSection.g_no && !memberSection.g_name;
  };

  MemberSection.selectOptions = function () {
    if (!selectOptions) {
      selectOptions = {};
      memberSections.forEach(function (memberSection) {
        selectOptions[memberSection.$id] = memberSection.name;
      });
    }
    return selectOptions;
  };

  MemberSection.renderName = function (instance, td, row, col, prop, memberSectionId, cellProperties) {
    return renderProp(td, memberSectionId, 'name');
  };

  function renderProp(td, memberSectionId, prop) {
    var memberSection = memberSections.$getRecord(memberSectionId);
    if (memberSection) {
      angular.element(td).html(memberSection[prop] || '');
    }
    return td;
  }

  return MemberSection;
}]);
//# sourceMappingURL=member-section.js.map
