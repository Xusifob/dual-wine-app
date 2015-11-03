$(document).ready(function(){

    $('.loader').slideDown(200);

    $('#me').prepend(localStorage.getItem('pseudo'));
    // Requete Ajax
    $.ajax({
        url : adresseAjax + 'connect/classement',
        type : 'POST',
        data : {'token': localStorage.getItem('token') },
        success : function(json, statut){
            console.log(json);
            for(var i = 0; i < json.firsts.length;i++){

                var place = i+1;
                $('#classement-general').append('<a href="" class="collection-item">'+ json.firsts[i].pseudo +'<span class="badge">'+place+'</span></a>');
                console.log(json.firsts[i]);
            }
            $('#myscore').html(json.me);
            $('.loader').slideUp(200);

        },

        error : function(result, statut, erreur){
            Materialize.toast('Erreur de communication avec le serveur', 4000)
            $('.loader').slideUp(200);

        }

    });


    $('.collection a').on('click',function(){
        return false;
    });

});