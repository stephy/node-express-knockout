$(function(){

    var Expense = function(data){
        this._desc = ko.observable(data._desc);
        this._time = ko.observable(data._time);
    };

    Expense.prototype.addToDB = function(){
        var request = $.ajax({
            type: "POST",
            url: "/api/expenses/",
            dataType: "json", 
            data: {
                _desc : this._desc(),
                _time : this._time()
            }
        });

        request.done(function(response){
            console.log(response);
            viewModel.expenses.push(new Expense({
                _desc: response._desc,
                _time: response._time
            }));
        });
    }

    var ExpensesViewModel = function() {
        var self = this;
        self.expenses = ko.observableArray();

        self.total = ko.computed(function(){
            var total = 0;
            var hourly_rate = 100;
            for(var p=0; p < self.expenses().length; p++){
                total += parseFloat(self.expenses()[p]._time());
            }
            return (total*hourly_rate).toFixed(2);
        })

        self.addExpense = function(){
            var expense = new Expense({
                _desc: $('#desc').val(),
                _time: $('#time').val()
            });

            expense.addToDB();
        }
        
        var refresh = function() {
           var request = $.ajax({
                url: "/api/expenses/",
                type: "GET",
                dataType: "json"
            });

           request.done(function(response){
            for (var i=0; i < response.length; i++ ){
                self.expenses.push(new Expense(response[i]));
            }
           });

           request.fail(function( jqXHR, textStatus ) {
              console.log( "Request failed: " + textStatus );
            });

       }
        //refresh immediately to load initial data
        refresh();

    };


	var viewModel = new ExpensesViewModel();

	//insert some fake users for now
	viewModel.expenses.push(new Expense({
		_desc: "phone call",
        _time: "0.5",
	}));

	ko.applyBindings(viewModel);
});