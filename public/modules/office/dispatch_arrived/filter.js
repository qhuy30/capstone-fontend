myApp.registerFilter('da_expiration_date',function(){
    return function(input){
        if(!input){return false;}
        var next_three_date = new Date();
        next_three_date.setDate(new Date().getDate()+3);
        if((input - next_three_date.getTime())>0 ){
            return false;
        }
        return true;
    }
});

myApp.registerFilter('odb_expiration_date',function(){
    return function(input){
        if(!input){return false;}
        var next_three_date = new Date();
        next_three_date.setDate(new Date().getDate()+3);
        if((input - next_three_date.getTime())>0 ){
            return false;
        }
        return true;
    }
});