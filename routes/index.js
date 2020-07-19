/* Router MAIN FILE */

const feedphoto = require("../models/feedphoto");

module.exports = function (app, User, Posting, Feedphoto) {

    /* Registration for the first user */
    app.post('/user/register', function (request, response) {
        console.log('/user/register');

        /** Check the input is valid or not
         * Invalid if there is same value in the database already */
        User.count({ id: request.body.id }, function (err, cnt) {
            if (cnt) {
                response.json('ID already exists');
                console.log('ID already exists');
            } else {
                /* Get request's string */
                var user = new User();
                var post_data = request.body;
                user.id = post_data.id;
                user.password = post_data.password;
                user.phone_number = post_data.phone_number;
                user.save(function (err) {
                    if (err) {
                        console.err(err);
                        response.json({ result: 0 });
                        return;
                    }
                    response.json({ result: 1 });
                })
            }
        });
        return;
    });
    /* login for the application use */
    app.post('/user/login', function (request, response) {
        console.log('/user/login');

        /** Check the input is valid or not
         * Invalid if there is no corresponding document values
         * in the database already */
        User.count({ id: request.body.id }, function (err, cnt) {
            if (!cnt) {
                response.json('ID not exists');
                console.log('ID not exists');
                return;
            } else {
                /* Get request's string */
                var post_data = request.body;
                var id = post_data.id;
                var password = post_data.password;
                User.findOne({ id: request.body.id }, function (err, user) {
                    /* unknown error */
                    if (err) {
                        response.end();
                    } else if (password == user.password) {
                        response.json('Login success');
                        console.log('Login success');
                    } else {
                        response.json('Wrong password');
                        console.log('Wrong password');
                    }

                });
            }
        });
        return;
    });

    /* for the request in the main tab */
    /* get the public post infomation */
    app.get('/main/get', function (request, response) {
        console.log('/main/get');
        Posting.find(function (err, postings) {
            if (err) {
                return res.status(500).send({ error: 'database failure' });
            }
            response.json(postings);
        })
        return;
    });

    /* post the information about the travel on the public post tab */
    app.post('/main/write', function (request, response) {
        console.log('/main/write');

        /* Get request's string */
        var posting = new Posting();
        var post_data = request.body;
        posting.id = post_data.id;
        posting.place = post_data.place;
        posting.date = post_data.date;
        posting.category = post_data.category;
        posting.save(function (err) {
            if (err) {
                console.err(err);
                response.json("0");
                return;
            }
            response.json("1");
        })
        return;
    });

    /* long click the recycler view send writer information*/
    app.get('/main/:writer_id', function (request, response) {
        console.log('/main/:writer_id');
        console.log(request.params.writer_id);
        User.findOne({ id: request.params.writer_id }, function (err, user) {
            if (err) {
                return response.status(500).send({ error: 'database failure' });
            }
            if (!user) {
                return response.status(404).json({ error: 'user not found' });
            }
            response.json(user);
        });
        return;
    });







    app.get('/gallery/post_all', function (request, response) {
        console.log('/gallery/post_all');
        response.end();
    });
    app.post('/gallery/post_on_category', function (request, response) {
        console.log('/gallery/post_on_category');
        response.end();
    });


    app.get('/feed/get', function (request, response) {
        console.log('/feed/get');
        response.end();
    });

    app.post('/feed/write', function (request, response) {
        console.log('/feed/write');
        response.end();
    });
}