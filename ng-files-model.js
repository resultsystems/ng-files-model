(function () {
    'use strict';
    angular.module('ng-files-model', [])
    .directive('ngFilesModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
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
                            values.push({
                                lastModified: changeEvent.target.files[index].lastModified,
                                lastModifiedDate: changeEvent.target.files[index].lastModifiedDate,
                                name: changeEvent.target.files[index].name,
                                size: changeEvent.target.files[index].size,
                                type: changeEvent.target.files[index].type,
                                data: loadEvent.target.result
                            });
                        });
                    }
                    reader.readAsDataURL(item);
                });
                scope.$apply(function () {
                    console.log(values);
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