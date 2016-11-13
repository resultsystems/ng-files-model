/*
* @author: Leandro Henrique Reis <emtudo@gmail.com>
* @date:   2016-10-04 16:05:33
* @last modified by:   Leandro Henrique Reis
* @last modified time: 2016-11-13 16:34:47
*/

(function () {
    'use strict';
    angular.module('ng-files-model', [])
    .directive('ngFilesModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        scope: {
            callback: '=',
            data: '='
        },
        link: function (scope, element, attrs) {
            var model = $parse(attrs.ngFilesModel);
            var isMultiple = attrs.multiple;
            var modelSetter = model.assign;
            element.bind('change', function (changeEvent) {
                var values = [];
                angular.forEach(element[0].files, function (item, index) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            var data={
                                lastModified: changeEvent.target.files[index].lastModified,
                                lastModifiedDate: changeEvent.target.files[index].lastModifiedDate,
                                name: changeEvent.target.files[index].name,
                                size: changeEvent.target.files[index].size,
                                type: changeEvent.target.files[index].type,
                                file: loadEvent.target.result.replace('data:'+changeEvent.target.files[index].type+';base64,','')
                            }
                            values.push(data);
                            if (typeof(scope.callback)=='function') {
                                scope.callback(data, scope.data);
                            }
                        });
                    }
                    reader.readAsDataURL(item);
                });
                scope.$apply(function () {
                    if (isMultiple) {
                        modelSetter(scope, values);
                    } else {
                        modelSetter(scope, values[0]);
                    }
                });
            });
        }
    };
    }]);
    if( typeof exports !== 'undefined' ) {
      exports['default'] = angular.module('ng-files-model');
      module.exports = exports['default'];
    }
})();