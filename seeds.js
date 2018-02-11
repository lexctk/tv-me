var mongoose = require ("mongoose");
var Tvtitle = require ("./models/tvtitle");
var Comment = require ("./models/comment");


//seed data (temporary): movies about space because space is awesome
var data = [
    {
        name: "The Martian",
        image: "https://images-na.ssl-images-amazon.com/images/M/MV5BMTc2MTQ3MDA1Nl5BMl5BanBnXkFtZTgwODA3OTI4NjE@._V1_SX300.jpg",
        slug: "the-martian",
        description: "An astronaut becomes stranded on Mars after his team assume him dead, and must rely on his ingenuity to find a way to signal to Earth that he is alive"
    },
    {
        name: "Apollo 13",
        image: "https://images-na.ssl-images-amazon.com/images/M/MV5BNjEzYjJmNzgtNDkwNy00MTQ4LTlmMWMtNzA4YjE2NjI0ZDg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
        slug: "apollo-13",
        description: "NASA must devise a strategy to return Apollo 13 to Earth safely after the spacecraft undergoes massive internal damage putting the lives of the three astronauts on board in jeopardy."
    },
    {
        name: "Gravity",
        image: "https://images-na.ssl-images-amazon.com/images/M/MV5BNjE5MzYwMzYxMF5BMl5BanBnXkFtZTcwOTk4MTk0OQ@@._V1_SX300.jpg",
        slug: "gravity",
        description: "Two astronauts work together to survive after an accident which leaves them stranded in space."
    },
    {
        name: "Interstellar",
        image: "https://images-na.ssl-images-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
        slug: "interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival"
    }     
];

function seedDB () {
    //Empty out all titles
    Tvtitle.remove({}, function (error) {
        if (error) {
            console.log ("Couldn't empty database" + error);
        } else {
            console.log ("Database emptied");
            //Add a few movies
            data.forEach(function (title){
                Tvtitle.create(title, function (error, title) {
                    if (error) {
                        console.log (error);
                    } else {
                        console.log ("Added title");
                        
                        //once title is added, add a comment to it
                        Comment.create ({
                            text: "Loved this, space is awesome",
                            author: "Starman"
                        }, function (error, comment) {
                            if (error) {
                                console.log ("Couldn't create comment " + error);
                            } else {
                                title.comments.push(comment._id);
                                title.save(function (error, title) {
                                    if (error) {
                                        console.log ("Couldn't save comment to title" + error);
                                    } else {
                                        console.log ("Saved comment to title");
                                    }
                                });
                            }
                        });
                    }
                })
            });            
        }
    });
}

module.exports = seedDB;