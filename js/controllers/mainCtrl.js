angular.module('contactGrid', []).controller('MainCtrl', function($scope, contactStorage) {

    $scope.newUser = {};
    $scope.tempModel = {};
    
    // going to use this later to populate contacts
    var temp = contactStorage.get();
    
    $scope.contacts = [];
    $scope.predicate = 'last_name';
    $scope.reverse = false;
    $scope.editIndex = -1;
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.idIndex = 1;

    $scope.backup = function() {
        contactStorage.put($scope.contacts);
    };

    $scope.numberOfPages = function() {
        return Math.ceil($scope.contacts.length / $scope.pageSize);
    };

    $scope.pageMax = function() {
        return Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.contacts.length);
    };

    $scope.navigate = function(num) {
        var cont;
        if ($scope.editIndex !== -1) { // we're editing something...
            cont = window.confirm("Do you want to change pages without saving your edits?");
            if (cont) {
                $scope.contacts[$scope.editIndex].being_edited = false;
                $scope.editIndex = -1;
                $scope.currentPage = $scope.currentPage + num;
            }
        } else {
            $scope.currentPage = $scope.currentPage + num;
        }
    };

    $scope.updateSort = function(val) {
        if (val === $scope.predicate) {
            $scope.reverse = !($scope.reverse);
        } else {
            $scope.reverse = false;
            $scope.predicate = val;
        }
    };

    $scope.reset = function() {
        $scope.newUser = {};
    };

    // return a new, unused user id that will allow us to index into the grid
    $scope.next = function() {
        return $scope.idIndex++-1;
    };

    $scope.deleteUser = function(index) {
        $scope.contacts.splice(index, 1);
        // have to reassign the indices for users
        angular.forEach($scope.contacts, function(value, indx) {
            value.id = indx;
        });
        // if we delete the last user on a page...
        if (($scope.contacts.length === $scope.currentPage * $scope.pageSize) && ($scope.currentPage !== 0)) {
            $scope.currentPage--;
        }
        $scope.backup();
    };

    $scope.createUser = function(nu_user, silent) {
        var copy = {};
        var isValid = $scope.validEmail('new');
        if (isValid) {
            nu_user.created_on = Date.now();
            nu_user.edited = Date.now();
            nu_user.being_edited = false;
            nu_user.id = $scope.next();
            $scope.contacts.push(nu_user);
            $scope.reset();
        } else {
            alert("Please enter a unique email to create a new user.");
        }
        if (!silent) {
            $scope.backup();
        }
    };

    // checks against the tempModel or newUser
    $scope.validEmail = function(type) {
        var validEmail = true;
        if (type === "temp") {
            angular.forEach($scope.contacts, function(val) {
                if (val.id !== $scope.tempModel.id) {
                    validEmail = validEmail && (val.email !== $scope.tempModel.email);
                }
            });
        } else {
            angular.forEach($scope.contacts, function(val) {
                validEmail = validEmail && (val.email !== $scope.newUser.email);
            });
        }
        return validEmail;
    };

    $scope.edit = function(i) {
        if ($scope.editIndex > -1) {
            $scope.contacts[$scope.editIndex].being_edited = false;
        }
        $scope.editIndex = i;
        $scope.contacts[i].being_edited = true;
        $scope.tempModel = angular.copy($scope.contacts[i]);
    };

    $scope.save = function(i) {
        if (!($scope.tempModel.last_name) || !($scope.tempModel.first_name) || !($scope.tempModel.email)) {
            alert("Please enter a valid email, first name, and last name!");
            return false;
        }
        if (!$scope.validEmail('temp')) {
            alert("Please don't use a duplicate email...");
            return false;
        }
        $scope.contacts[i] = angular.copy($scope.tempModel);
        $scope.contacts[i].being_edited = false;
        $scope.contacts[i].edited = Date.now();
        $scope.editIndex = -1;
        $scope.tempModel = {};
        $scope.backup();
    };

    // no need to save data
    $scope.revert = function() {
        $scope.contacts[$scope.editIndex].being_edited = false;
        $scope.editIndex = -1;
        $scope.tempModel = {};
    };

    $scope.submitForm = function() {
        if ($scope.userForm.$valid) {
            $scope.createUser($scope.newUser);
        } else {
            alert("Please submit valid user info...");
        }
    };

    angular.forEach(temp, function(v) {
        $scope.createUser(v, true);
    });

}).filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    };
});
