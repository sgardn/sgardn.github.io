var myApp = angular.module('contactGrid', []).controller('MainCtrl', function($scope, contactStorage) {

    $scope.newUser = {};
    $scope.tempModel = {};
    $scope.contacts = [];
    $scope.predicate = 'last_name';
    $scope.reverse = false;
    $scope.editIndex = -1;
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    var idIndex = 1;

    // going to use this later to populate contacts
    var temp = contactStorage.get();
    
    // ********************************
    // functions NOT EXPOSED in the DOM
    // ********************************
    
    var backup = function(){
        contactStorage.put($scope.contacts);
    };

    // return a new, unused user id that will allow us to index into the grid
    var next = function(){
        return idIndex++ - 1;
    };

    var createUser = function(nu_user, silent){
        var copy = {};
        var isValid = validEmail('new');
        // coerce into number instead of string
        nu_user.age = +nu_user.age;
        if (isValid) {
            nu_user.created_on = Date.now();
            nu_user.edited = Date.now();
            nu_user.being_edited = false;
            nu_user.id = next();
            $scope.contacts.push(nu_user);
            $scope.newUser = {};
            
        } else {
            alert("Please enter a unique email to create a new user.");
        }
        if (!silent) {
            backup();
        }
    };

    // checks against the tempModel or newUser
    var validEmail = function(type){
        var valid = true;
        if (type === "temp") {
            angular.forEach($scope.contacts, function(val) {
                if (val.id !== $scope.tempModel.id) {
                    valid = valid && (val.email !== $scope.tempModel.email);
                }
            });
        } else {
            angular.forEach($scope.contacts, function(val) {
                valid = valid && (val.email !== $scope.newUser.email);
            });
        }
        return valid;
    };

    // ********************************
    // functions EXPOSED in the DOM
    // ********************************

    $scope.updateSort = function(val) {
        if (val === $scope.predicate) {
            $scope.reverse = !($scope.reverse);
        } else {
            $scope.reverse = false;
            $scope.predicate = val;
        }
    };

    $scope.deleteUser = function(index) {
        // remove the user to be deleted
        $scope.contacts.splice(index, 1);
        
        // have to reassign the indices for users
        angular.forEach($scope.contacts, function(contact, indx) {
            contact.id = indx;
        });
        
        // if we delete the last user on a page...
        if (($scope.contacts.length === $scope.currentPage * $scope.pageSize) && ($scope.currentPage !== 0)) {
            $scope.currentPage--;
        }
        backup();
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
        if (!validEmail('temp')) {
            alert("Please don't use a duplicate email...");
            return false;
        }
        $scope.contacts[i] = angular.copy($scope.tempModel);
        $scope.contacts[i].being_edited = false;
        $scope.contacts[i].edited = Date.now();
        $scope.editIndex = -1;
        $scope.tempModel = {};
        backup();
    };

    $scope.toggleActive = function(contact){
        contact.active = !contact.active;
    };

    $scope.revert = function() {
        $scope.contacts[$scope.editIndex].being_edited = false;
        $scope.editIndex = -1;
        $scope.tempModel = {};
    };

    $scope.submitForm = function() {
        if ($scope.userForm.$valid) {
            createUser($scope.newUser);
        } else {
            alert("Please submit valid user information...");
        }
    };

    // ************************************************************
    //  INITIALIZE users without attempting to backup (silent flag)
    // ************************************************************

    angular.forEach(temp, function(v) {
        createUser(v, true);
    });
});
