// Modifier ce lien et mettre le chemin correct vers votre page

var path =  '/android_asset/www/';
var adresseAjax = 'http://bastien.malahieude.net/dual-wine/web/api/';



 // Uncomment on desktop
// var path = 'http://127.0.0.1/projects/annee_2/tests/workshop/www/';
// var adresseAjax = 'http://127.0.0.1:8000/api/';
 $(document).ready(function(){
 if(localStorage.connect){
 router.navigate('/connect/accueil');
 }else {
 router.navigate('/');
 }
 });


var router = new Router();

var menuDisplay = false;

// Loading de la template au chargement
function ShowPage(template,routeName,menu,needconnect){
    if(needconnect){
        if(!localStorage.connect){
            router.navigate('/');
        }
    }
    if(menu && !menuDisplay) {
        $('#nav').load(path + 'templates/connect/menu.html', function (response, status, xhr) {
            if (status == "error") {
                var msg = "Sorry but there was an error: ";
                console.log(msg + xhr.status + " " + xhr.statusText);
            } else {
                console.log('template menu.html loaded');
            }
        });
        menuDisplay = true;
    }else if(!menu){
        $('#nav').empty();
        menuDisplay = false;
    }else if (menuDisplay){
        $('.button-collapse').sideNav('hide');
    }
    $('#container')
        .empty()
        .load(path + 'templates/'+ template ,function( response, status, xhr ) {
            if ( status == "error" ) {
                console.log(xhr);
            }else{
                console.log('template ' + template + ' loaded');
            }
        })
}

// Création des routes
router.route('/password-forgot',
    function()
    {
        // Template de la route (par défaut dans le fichier templates
        var template = 'password-forgot.html';
        var routeName = 'password-forgot';

        ShowPage(template,routeName);
    });

router.route('/',
    function()
    {
        // Template de la route (par défaut dans le fichier templates
        var template = 'index.html';
        var routeName = 'Accueil';

        ShowPage(template,routeName)
    });


router.route('/connect/accueil',
    function()
    {
        // Template de la route (par défaut dans le fichier templates
        var template = 'connect/index.html';
        var routeName = 'index';

        ShowPage(template,routeName,true,true)
    });

router.route('/connect/newpartie',
    function()
    {
        // Template de la route (par défaut dans le fichier templates
        var template = 'connect/newpartie.html';
        var routeName = 'Nouvelle partie';

        ShowPage(template,routeName,true,true)
    });

router.route('/connect/amis',
    function()
    {
        // Template de la route (par défaut dans le fichier templates
        var template = 'connect/amis.html';
        var routeName = 'Mes amis';

        ShowPage(template,routeName,true,true)
    });

router.route('/connect/reloadamis',
    function()
    {
        router.navigate('/connect/amis');
    });

router.route('/connect/newpartie',
    function()
    {

        // Template de la route (par défaut dans le fichier templates
        var template = 'connect/newpartie.html';
        var routeName = 'Nouvelle partie';

        ShowPage(template,routeName,true,true)
    });

router.route('/connect/launchpartie/:iduser',
    function(iduser)
    {
        var val = {
            token : localStorage.getItem('token'),
            id : iduser };

        $.ajax({
            url : adresseAjax + 'connect/newpartie',
            type : 'POST',
            data : val,
            success : function(json, statut){ // success est toujours en place, bien sûr !
                $('.loader').hide();
                console.log(json);
                if(json.partie) {
                    Materialize.toast('Une demande de partie a été communiquée à l\'autre joueur', 4000)
                }else{
                    Materialize.toast('Une erreur est survenue en essayant de créer la partie', 4000)
                }
                router.navigate('/connect/accueil')
            },

            error : function(result, statut, erreur){
                $('.loader').hide();
                Materialize.toast('Erreur de communication avec le serveur', 4000)
                router.navigate('/connect/accueil')
            }
        });
    });


router.route('/connect/play/:idpart',
    function(idpart)
    {
        $('.loader').show();
        var val = {
            token : localStorage.getItem('token'),
            id : idpart };

        console.log('données envoyés :',val);
        console.log('adresse : ', adresseAjax + 'connect/launchpartie');


        $.ajax({
            url : adresseAjax + 'connect/launchpartie',
            type : 'POST',
            data : val,
            success : function(json, statut){ // success est toujours en place, bien sûr !
                $('.loader').hide();
                console.log('Données récupérés ', + json);
                if(json.partie) {
                    if(json.newtour){
                        // Template de la route (par défaut dans le fichier templates
                        // Je lui retourne l'id de la partie
                        window.categories = json.categories;
                        window.partie = idpart;
                        var template = 'connect/play.html';
                        var routeName = 'Nouvelle partie';

                        ShowPage(template,routeName,true,true)
                    }else{
                        router.navigate('/connect/partie/' + idpart);

                    }
                }else{
                    Materialize.toast('Une erreur est survenue en essayant de créer la partie', 4000)
                    router.navigate('/connect/accueil')
                }
            },

            error : function(result, statut, erreur){
                $('.loader').hide();
                Materialize.toast('Erreur de communication avec le serveur', 4000)
                router.navigate('/connect/accueil')
            }
        });
    });

router.route('/connect/partie/:category',
    function(category)
    {
        // Je split
        var partieId = category.split('-')[0];
        var categoryId = category.split('-')[1] != 'undefined' ? category.split('-')[1] : null ;

        console.log('Partie Id : ' + partieId);
        console.log('Catégorie Id : ' + categoryId);

        var val = {
            'id_part' : partieId ,
            'id_cat' : categoryId ,
            'token' : localStorage.getItem('token')
        };

        $.ajax({
            url : adresseAjax + 'connect/play',
            type : 'POST',
            data : val,
            success : function(json, statut){ // success est toujours en place, bien sûr !
                $('.loader').hide();
                console.log(json);
                if(json.play) {
                    window.tour = json.tour;
                    window.idPartie = partieId;
                    // Template de la route (par défaut dans le fichier templates
                    var template = 'connect/partie.html';
                    var routeName = 'Nouvelle partie';

                    ShowPage(template,routeName,false,true);
                }else{
                    Materialize.toast('Une erreur est survenue en essayant de récupérer la partie', 4000)
                    router.navigate('/connect/accueil')
                }
            },

            error : function(result, statut, erreur){
                $('.loader').hide();
                Materialize.toast('Erreur de communication avec le serveur', 4000)
                 router.navigate('/connect/accueil')
            }
        });
    });

router.route('/connect/deletefriend/:id',
    function(id)
    {
        console.log('deleteUser');

        var val = {
            'id' : id ,
            'token' : localStorage.getItem('token')
        };

        $.ajax({
            url: adresseAjax + 'connect/deletefriend',
            type: 'POST',
            data: val,
            success: function (json, statut) { // success est toujours en place, bien sûr !
                $('.loader').hide();
                console.log(json);
                if(json.delete) {
                    Materialize.toast('Votre ami a bien été supprimé', 4000)
                }
                else{
                    Materialize.toast('Une erreur est survenue, votre ami n\'a pas pu être supprimé', 4000)
                }

            },

            error: function (result, statut, erreur) {
                $('.loader').hide();
                Materialize.toast('Erreur de communication avec le serveur', 4000)
            }
        });


        router.navigate('/connect/amis');
    });

router.route('/connect/refuse/:id',
    function(id)
    {
        console.log('refuse partie ' + id);


        var val = {
            'id' : id ,
            'token' : localStorage.getItem('token')
        };

        $.ajax({
            url: adresseAjax + 'connect/refusePartie',
            type: 'POST',
            data: val,
            success: function (json, statut) { // success est toujours en place, bien sûr !
                $('.loader').hide();
                console.log(json);
                if(json.true) {
                    Materialize.toast('Votre partie a bien été supprimé', 4000)
                }
                else{
                    Materialize.toast('Une erreur est survenue, la partie n\'a pas pu être supprimé', 4000)
                }

            },

            error: function (result, statut, erreur) {
                $('.loader').hide();
                Materialize.toast('Erreur de communication avec le serveur', 4000)
            }
        });

        router.navigate('/connect/accueil');
    });

router.route('/connect/profil',
    function()
    {
        // Template de la route (par défaut dans le fichier templates
        var template = 'connect/profil.html';
        var routeName = 'Mon profil';
        ShowPage(template,routeName,true,true)
    });

router.route('/connect/classement',
    function()
    {
        // Template de la route (par défaut dans le fichier templates
        var template = 'connect/classement.html';
        var routeName = 'Classement';
        ShowPage(template,routeName,true,true)
    });