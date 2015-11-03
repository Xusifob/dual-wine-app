$('form[name="inscription"]').submit(function(){

    // Je récupère les valeurs
    var val = {
        'username' : $('input[id="pseudo"]').val(),
        'email' : $('input[id="email"]').val(),
        'password' : $('input[id="password"]').val()
    };
    console.log(val);

    // Requete Ajax
    $.ajax({
        url : adresseAjax + 'inscription',
        type : 'POST',
        data : val,
        success : function(json, statut){ // success est toujours en place, bien sûr !
            $('.loader').hide();
            console.log(json);
            if(json.inscription){
                Materialize.toast('Votre inscription a bien été prise en compte', 4000)
            }
            else{
                Materialize.toast('identifiant ou e-mail déja utilisé', 4000)
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


$('form[name="connexion"]').submit(function(){
    // Je récupère les valeurs
    var val = {
        'username' : $('input[id="pseudo2"]').val(),
        'password' : $('input[id="password2"]').val()
    };
    console.log(val);
    // Requete Ajax
    $('.loader').show();

    $.ajax({
        url :  adresseAjax + 'connexion',
        type : 'POST',
        data : val,
        success : function(json, statut){ // success est toujours en place, bien sûr !
            $('.loader').hide();
            console.log(json);
            if(json.connect){
                // Je stocke les données en local
                localStorage.setItem('token',json.token);
                localStorage.setItem('pseudo',json.pseudo);
                localStorage.setItem('connect',json.connect);
                localStorage.setItem('id',json.id);
                localStorage.setItem('email',json.email);

                // Je redirige vers l'accueil connecté
                router.navigate('/connect/accueil');

            }else {
                Materialize.toast('Couple identifiant/Mot de passe incorrect', 4000)
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