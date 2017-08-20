/**
 * Created by jacob on 6/7/2017.
 */

var Post = class Post{

    constructor(title, url){
        this.title = title;
        this.url = url;
    };


    getPost(){
      return (this.title + " "+ this.url);
    };

    getTitle(){
        return this.title;
    }

    getUrl(){
        return this.url;
    }

};

module.exports = Post;


