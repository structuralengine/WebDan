'use strict';

/**
 * @ngdoc service
 * @name webdan.Member
 * @description
 * # Member
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Member', ['webdanRef', '$firebaseArray', '$firebaseObject', '$firebaseUtils',
    function(webdanRef, $firebaseArray, $firebaseObject, $firebaseUtils) {

      var ref = webdanRef.child('members');
      var members = $firebaseArray(ref);
      var Member = {};

      Member.query = function(copy) {
        return members;
      }

      Member.remove = function(member) {
        let origMember = members.$getRecord(member.$id);
        return members.$remove(origMember).catch(function(err) {
          throw err;
        });
      }

      Member.save = function(member) {
        let origMember = members.$getRecord(member.$id);
        let plainMember = $firebaseUtils.toJSON(member);
        angular.extend(origMember, plainMember);
        return members.$save(origMember).catch(function(err) {
          throw err;
        });
      }

      Member.add = function(member) {
        return members.$add(member).catch(function(err) {
          throw err;
        });
      }

      Member.isEmpty = function(member) {
        return !member.g_no.trim() && !member.g_name.trim();
      }

      return Member;
    }
  ]);
