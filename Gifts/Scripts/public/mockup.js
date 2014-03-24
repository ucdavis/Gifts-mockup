angular.module('gift', ['ui.bootstrap', 'angularFileUpload'])
    .controller('DonationController', function($scope, $filter, $upload, $modal, $log) {
        $scope.donorSelected = undefined;
        $scope.additionalDonorSelected = undefined;

        $scope.dt = new Date();
        $scope.tendor = 'Cash';

        $scope.$watch('donorId', function(val) {

            if (val && val.length === 7) {
                $scope.donorFeedbackClasses = "fa-spin fa-spinner";
                //do some ajax search
                var found = $filter('filter')($scope.availableDonors, { id: val }, false);
                console.log(found);
                if (found && found.length) {
                    $scope.donorSelected = found[0];
                    $scope.donorFeedbackClasses = "fa-check";
                } else {
                    $scope.donorFeedbackClasses = "fa-exclamation"; //not found
                }
            } else {
                $scope.donorSelected = '';
                $scope.donorFeedbackClasses = "fa-warning";
            }
        });

        $scope.additionalDonors = [{}];
        $scope.availableDonors = [
            { id: 'ABCDEFG', name: 'alice cooper', display: 'alice cooper (ABCDEFG)', address: '123 street, davis, ca', phone: '555-5555' },
            { id: 'HIJKLMN', name: 'bob dobalina', display: 'bob dobalina (HIJKLMN)', address: '456 street, davis, ca', phone: '555-5555' }
        ];

        $scope.accountSelected = '';
        $scope.kfsAccounts = [
            {
                id: '3-GIMMEIT',
                name: 'some fund',
                display: 'some fund (3-GIMMEIT)',
                ucaccount: '12345',
                agency: 'regents',
                fund: 'the good ole fund',
                purpose: 'to airdrop donations into needy areas',
                program: 'the mondavi center'
            },
            {
                id: 'L-DONATES',
                name: 'a different type of fund',
                display: 'a different type of fund (L-DONATES)',
                ucaccount: '67890',
                agency: 'foundation',
                fund: 'the magic schoolbus fund',
                purpose: 'to be the best account it can be',
                program: 'feed the hungry programmers'
            }
        ];

        $scope.giftFeeOptions = [
            {
                id: 'gift',
                text: 'Gift: Deduct from Gift Fee',
                attachmentRequired: false
            }, {
                id: 'donor',
                text: 'Donor: Deduct 6% from donor\'s contribution',
                attachmentRequired: false
            }, {
                id: 'discretionary',
                text: 'Discretionary: The Dean/Vice Chancellor pays the fee',
                attachmentRequired: true,
                warning: 'An attachment containing both the DaFIS Account number from where the fees will be taken as well as the Dean/Vice Chancellor\'s signature is required'
            }, {
                id: 'earnings',
                text: 'Earnings: For gifts of $100,000 or more',
                attachmentRequired: true,
                warning: 'An approval letter signed by Vice Chancellor, University Relations must be attached'
            }, {
                id: 'none',
                text: 'No Fee: Chancellor\'s approved exception',
                attachmentRequired: true,
                warning: 'An exemption letter signed by the Chancellor must be attached'
            }
        ];

        $scope.giftFee = $scope.giftFeeOptions[0];

        /* -- new donor modal */
        $scope.openNewDonor = function() {
            var modalInstance = $modal.open({
                templateUrl: 'newDonorTemplate.html',
                controller: 'DonorModalController'
            });

            modalInstance.result.then(function(newDonor) {
                if (newDonor && newDonor.id) {
                    newDonor.display = newDonor.name + ' (' + newDonor.id + ')';
                    $scope.donorSelected = newDonor;
                    $scope.availableDonors.push(newDonor);
                }
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        /* -- lookup donor modal */
        $scope.openLookupDonor = function () {
            var modalInstance = $modal.open({
                templateUrl: 'lookupDonorTemplate.html',
                controller: 'DonorLookupModalController',
                resolve: {
                    availableDonors: function() {
                        return $scope.availableDonors;
                    }
                }
            });

            modalInstance.result.then(function (selectedDonor) {
                if (selectedDonor && selectedDonor.id) {
                    $scope.donorId = selectedDonor.id;
                }
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        /* -- new fund modal */
        $scope.openNewFund = function() {
            var modalInstance = $modal.open({
                templateUrl: 'newAccountTemplate.html',
                controller: 'KfsAccountModalController',
                resolve: {
                    kfsAccounts: function() {
                        return $scope.kfsAccounts;
                    }
                }
            });

            modalInstance.result.then(function(newAccount) {
                if (newAccount && newAccount.id) {
                    newAccount.display = newAccount.name + ' (' + newAccount.id + ')';
                    $scope.accountSelected = newAccount;
                    $scope.kfsAccounts.push(newAccount);
                }
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        /* -- datepicker */
        $scope.showWeeks = true;
        $scope.toggleWeeks = function() {
            $scope.showWeeks = !$scope.showWeeks;
        };

        $scope.clear = function() {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };

        $scope.toggleMin = function () {
            var today = new Date();
            $scope.minDate = ($scope.minDate) ? null : today.setDate(today.getDate()-90);
        };
        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'longDate'];
        $scope.format = $scope.formats[2];

        /* -- file upload */
        $scope.onFileSelect = function ($files) {
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: '/Mockup/Upload', //upload.php script, node.js route, or servlet url
                    // method: POST or PUT,
                    // headers: {'headerKey': 'headerValue'},
                    // withCredentials: true,
                    data: { addtl: 'more data' }, //{ myObj: $scope.myModelObj },
                    file: file,
                    // file: $files, //upload multiple files, this feature only works in HTML5 FromData browsers
                    /* set file formData name for 'Content-Desposition' header. Default: 'file' */
                    //fileFormDataName: myFile, //OR for HTML5 multiple upload only a list: ['name1', 'name2', ...]
                    /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
                    //formDataAppender: function(formData, key, val){} //#40#issuecomment-28612000
                }).progress(function (evt) {
                    $scope.donorInstructionsProgress = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function (data, status, headers, config) {
                    // file is uploaded successfully
                    console.log(data);
                });
                //.error(...)
                //.then(success, error, progress); 
            }
            // $scope.upload = $upload.upload({...}) alternative way of uploading, sends the the file content directly with the same content-type of the file. Could be used to upload files to CouchDB, imgur, etc... for HTML5 FileReader browsers. 
        };
    })
    .controller('AdditionalDonorController', function ($scope, $filter) {
        $scope.$watch('additionalDonor.id', function (val) {
            if (val && val.length === 7) {
                $scope.additionalDonor.statusClasses = "fa-spin fa-spinner";
                //do some ajax search
                var found = $filter('filter')($scope.availableDonors, { id: val }, false);
                console.log(found);
                if (found && found.length) {
                    $scope.additionalDonor = angular.copy(found[0]);
                    $scope.additionalDonor.statusClasses = "fa-check";
                    $scope.additionalDonor.valid = true;
                } else {
                    $scope.additionalDonor.statusClasses = "fa-exclamation"; //not found
                    $scope.additionalDonor.valid = false;
                }
            } else {
                $scope.additionalDonor.statusClasses = "fa-warning";
                $scope.additionalDonor.valid = false;
            }
        });
    })
    .controller('KfsAccountModalController', function($scope, $modalInstance) {
        $scope.newAccount = { agency: 'Regents', id: '3-HOLDING', name: 'Advance Holding Account' };

        $scope.ok = function() {
            $modalInstance.close($scope.newAccount);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    })
    .controller('DonorLookupModalController', function ($scope, $modalInstance, availableDonors) {
        $scope.foundDonors = availableDonors;
        $scope.selectedDonor = {};

        $scope.select = function (donor) {
            $modalInstance.close(donor);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    })
    .controller('DonorModalController', function($scope, $modalInstance) {
        $scope.newDonor = {};

        function makeid() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        };

        $scope.ok = function() {
            //call service and create an id for this donor
            $scope.newDonor.id = makeid();
            $modalInstance.close($scope.newDonor);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    });