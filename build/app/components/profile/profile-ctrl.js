app.controller('profileCtrl', function($scope, dataFactory) {

});


$(function () {
  $('#delete').on('click', function(event){
    event.preventDefault();

    alertify.confirm("Delete Account: Are you sure?", function (e) {
      if (e) {
        $('#deleteForm').submit();
      } else {
        return false;
      }
    });
  });
});
