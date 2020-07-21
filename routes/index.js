/* Router MAIN FILE */

const feedphoto = require("../models/feedphoto");
const fs = require('fs');
var multer = require('multer');
const dir_location = '../CS496_Project2_Backend/upload_file';
const profile_location = '../CS496_Project2_Backend/profiles';
const path = require('path');
var temp_name1;
var temp_name2;
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, dir_location);
        },
        filename: function (req, file, cb) {
            temp_name1 = new Date().valueOf() + path.extname(file.originalname);
            cb(null, temp_name1);
        }
    }),
});


/* for profile image uploading */
const upload2 = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, profile_location);
        },
        filename: function (req, file, cb) {
            temp_name2 = new Date().valueOf() + path.extname(file.originalname);
            cb(null, temp_name2);
        }
    }),
});

module.exports = function (app, User, Posting, Feedphoto) {

    /* Registration for the first user */
    app.post('/user/register', upload2.single('file'), function (request, response) {
        console.log('/user/register');
        console.log(request.file);
        /** Check the input is valid or not
         * Invalid if there is same value in the database already */
        User.countDocuments({ id: request.body.id }, function (err, cnt) {
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
                user.file_name = temp_name2;
                user.save(function (err) {
                    if (err) {
                        console.err(err);
                        response.json("0");
                        return;
                    }
                    response.json("1");
                });
            }
        });
        return;
    });

    /* Check the new ID is valid or not*/
    app.get('/user/register/:newID', function (request, response) {
        console.log('/user/register/:newID');
        console.log(request.params.newID);
        User.countDocuments({ id: request.params.newID }, function (err, cnt) {
            if (!cnt) {
                /* newID valid */
                return response.json("1");
            }
            /* newID is already exists */
            return response.json("0");
        });
        return;
    });

    /* login for the application use */
    app.post('/user/login', function (request, response) {
        console.log('/user/login');

        /** Check the input is valid or not
         * Invalid if there is no corresponding document values
         * in the database already */
        User.countDocuments({ id: request.body.id }, function (err, cnt) {
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

    app.get('/user/login/get_profile/:ID', function (request, response) {
        console.log('/user/login/   ');
        User.findOne({ id: request.params.ID }, function (err, user) {
            if (err) {
                return response.status(500).send({ error: 'database failure' });
            }
            if (!user) {
                return response.status(404).json({ error: 'user not found' });
            }
            response.json(user.file_name);
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
        fs.readdir(dir_location, (err, files) => {
            files.forEach(file => {
                console.log(file);
            });
            response.json(files);
        });
        return;
    });

    /* Get image file correspoding file_name in upload_file */
    app.get('/gallery/:file_name', function (request, response) {
        console.log('/gallery/:file_name');
        try {
            var filename = request.params.file_name;
            console.log(filename);
            const dir_path = path.join(__dirname, "../upload_file/");
            const filePath = path.join(dir_path, filename);
            console.log(filePath);
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    console.error(err);
                    return response.status(404).json({ msg: "Not Found", error: true });
                } else {
                    return response.status(200).sendFile(filePath);
                }
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ msg: "Internal Error", error: true });
        }
        return;
    });

    /* Get image file correspoding file_name in profiles */
    app.get('/profile/:file_name', function (request, response) {
        console.log('/profile/:file_name');
        try {
            var filename = request.params.file_name;
            console.log(filename);
            const dir_path = path.join(__dirname, "../profiles/");
            const filePath = path.join(dir_path, filename);
            console.log(filePath);
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    console.error(err);
                    return response.status(404).json({ msg: "Not Found", error: true });
                } else {
                    return response.status(200).sendFile(filePath);
                }
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({ msg: "Internal Error", error: true });
        }
        return;
    });

    // app.post('/gallery/post_on_category', function (request, response) {
    //     console.log('/gallery/post_on_category');
    //     response.end();
    // });

    /* return urls of corresponding writer id */
    app.get('/feed/get/:writer_id', function (request, response) {
        console.log('/feed/get:Writer_id');
        console.log(request.params.writer_id);

        Feedphoto.find(function (err, feedphotos) {
            if (err) {
                return res.status(500).send({ error: 'database failure' });
            }
            else {
                return response.json(feedphotos);
            }
        });
    });


    app.post('/feed/write', upload.single('file'), function (request, response) {
        console.log('/feed/write');
        console.log(request.file);

        /* Get request's string */
        var feedphoto = new Feedphoto();
        var post_data = request.body;
        feedphoto.place = post_data.place;
        feedphoto.id = post_data.id;
        feedphoto.like = post_data.like;
        feedphoto.contents = post_data.contents;
        feedphoto.category = post_data.category;
        feedphoto.file_name = temp_name1;
        feedphoto.save(function (err) {
            if (err) {
                console.err(err);
                response.json("0");
                return;
            }
            response.json("1");
        });
        return;
    });
}