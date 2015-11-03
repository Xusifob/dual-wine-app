$('form[name="mdpoublie"]').submit(function(){

    // Je récupère les valeurs
    var val = {
        'email' : $('input[id="email"]').val(),
    };
    console.log(val);

    // Requete Ajax
    $.ajax({
        url : adresseAjax + 'forgot-password',
        type : 'POST',
        data : val,
        success : function(json, statut){ // success est toujours en place, bien sûr !
            $('.loader').hide();
            console.log(json);
            if(json.email){
                Materialize.toast('Votre mot de passe a bien été réinitialisé', 4000)
                // Je redirige vers l'accueil connecté
                router.navigate('/');
            }
            else{
                Materialize.toast('E-mail inexistant', 4000)
            }
        },

        error : function(result, statut, erreur){
            $('.loader').hide();
            Materialize.toast('Erreur de communication avec le serveur', 4000)
        }

    });

    // Je renvoie false
    return false;
});