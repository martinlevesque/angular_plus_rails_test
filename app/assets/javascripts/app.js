app = angular.module('flapperNews', ['ui.router']);

    app.config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: '/home.html',
                    controller: 'MainCtrl'
                });

            $stateProvider
            .state('posts', {
                url: '/posts/{id}',
                templateUrl: '/posts.html',
                controller: 'PostsCtrl'
            });


            $urlRouterProvider.otherwise('home');
        }]);

app.config([
    "$httpProvider", function($httpProvider) {
        $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
    }
]);

app.factory('posts', [function(){
        var o = {
            posts: []
        };
        return o;
    }]);

app.controller('MainCtrl', [
        '$scope',
        'posts',
        function($scope, posts){
            $scope.posts = posts.posts;
            $scope.test = 'Hello world!';


            $scope.addPost = function(){

                if ( ! $scope.title || $scope.title === '') { return; }

                $scope.posts.push(
                    {
                        title: $scope.title,
                        link: $scope.link,
                        upvotes: 0
                    }
                );
                $scope.title = '';
                $scope.link = '';
            };

            $scope.incrementUpvotes = function(post) {
                post.upvotes += 1;
            };

        }]);

app.controller('PostsCtrl', [
    '$scope',
    '$stateParams',
    'posts',
    '$http',
    function($scope, $stateParams, posts, $http){

        $scope.getAll = function($http) {
            return $http.get('/posts.json').success(function(data){
                angular.copy(data, $scope.posts);
            });
        };

        $scope.getAll($http);

        $scope.comments = [];


        $scope.addPost = function() {
            // $http.post(url, data, config)
            $http.post('/posts/create.json', {post: {title: $scope.title, link: $scope.link}}).success(function(data){
                $scope.title = '';
                $scope.link = "";
                $scope.getAll($http);
            });
        };

        $scope.new_comments = {};
        $scope.addComment = function(post_index) {
            // $http.post(url, data, config)

            cur_post = null;

            $http.post('/comments/create.json', {

                comment: {
                    body: $scope.new_comments[post_index].body,
                    post_id: $scope.posts[post_index].id,
                    upvotes: 0
                }
            }).success(function (data) {
                $scope.body = '';
                $scope.link = "";
                $scope.getAll($http);
                $scope.new_comments[post_index] = "";
            });

        };

    }]);