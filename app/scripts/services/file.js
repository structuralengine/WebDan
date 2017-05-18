'use strict';

/**
 * @ngdoc service
 * @name webdan.File
 * @description
 * # File
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('File', function (webdanRef, $fbResource, HtHelper, filesConfig) {

    let File = $fbResource({
      ref: webdanRef.child('files'),
      foreignKeysIn: {
        entry: {
          children: {
            Group: 'groups'
          }
        },
        child: {
          parent: {
            File: 'file'
          }
        }
      }
    });

    function init() {
      File.nestedHeaders = HtHelper.parseNestedHeaders(filesConfig);
      File.columns = HtHelper.parseColumns(filesConfig);
    }

    init();

    return File;
  });
