const axios = require('axios');
const cors = require('cors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');
Promise = require('bluebird');
mongoose.Promise = Promise;
require('dotenv').load();
const session = require('express-session');


let signedIn = false;

app.use(cors());

app.use(express.static(path.join(__dirname, 'front-end/build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//app.use(session({secret: "discopuppy"}));
app.use(session({
    secret: "discopuppy",
    name: "cookie_name",
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

const port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("app server listening on" + port);
});


const CONNECTION_STRING = process.env.DB;


// HTTP Requests


let sessionObject = {
    "user": null,
    "mode": null
}

// below did not work for some reason, something to do with req.session...../////////
// req.session.type = teacher or student
// req.session.mode = init or edit

app.post('/clearUserVariable', (req, res) => {
    sessionObject.user = null;
    console.log('set to null');
    res.end();
});
app.post('/studentUser', (req, res) => {
    sessionObject.user = "student";
    res.end();
});
app.post('/teacherUser', (req, res) => {
    sessionObject.user = "teacher";
    console.log(sessionObject.user);
    res.end();
});
app.get('/getUserData', (req, res) => {
    let type = sessionObject.user;
    let userId = req.session.userId;
    if (type === "teacher") {
        MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
            let dbo = db.db("quiz-creator");
            let collection = dbo.collection('quizzes');
            collection.find({ "createdBy": userId }).toArray(function(err, docs) {
                let quizzesCreated = docs;
                res.send({ type: type, userId: req.session.userId, user: req.session.user, array: quizzesCreated });////////////////// Incredibly redundant...
            });
        });
    }
})









app.get('/getSignedInVar', (req, res) => {
    if (req.session.user) {
        res.send({message: "User is signed in", error: 0, signedIn: true})
    } else {
        res.send({message: "User not signed in", error: 1, signedIn: false})
    }
})
app.post('/createUser', (req, res) => {
    let user = req.body.user;
    let password = req.body.password;
    let userObject = {
        "user": user,
        "password": password
    }
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("quiz-creator");
        let collection = dbo.collection('users');
        collection.findOne({user: user}, function(err, result) {
            if (result) {
                res.send({message: "User already exists", error: 1, signedIn: false});
            } else {
                collection.insertOne(userObject);
                signedIn = true;
                collection.findOne({user: user}, function(err, result) {
                    req.session.userId = result._id;
                    req.session.user = req.body.user;
                    //req.session.password = req.body.password;
                    res.send({message: "User successfully created", error: 0, signedIn: true});
                })
            }
        });
    });
})
app.post('/loginUser', (req, res) => {
    let user = req.body.user;
    let password = req.body.password;
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("quiz-creator");
        let collection = dbo.collection('users');
        collection.findOne({user: user}, function(err, result) {
            if (result) {
                if (result.password === password) {
                    signedIn = true;
                    req.session.userId = result._id;
                    req.session.user = req.body.user;
                    req.session.password = req.body.password;
                    res.send({message: "Successfully signed in", error: 0, signedIn: true});
                } else {
                    res.send({message: "Password incorrect", error: 2, signedIn: false});
                }
            } else {
                res.send({message: "User does not exist", error: 1, signedIn: false});
            }
        });
    });
})
app.post('/logout', (req, res) => {
    if (signedIn) {
        signedIn = false;
        req.session.destroy();
        res.send({message: "User has logged out", error: 0, signedIn: false});
    } else {
        res.send({message: "User not signed in", error: 1, signedIn: false})
    }
})









/*
app.post('/editQuestionOld', (req, res) => {
    
    let quizId = req.body.quizId;
    let questionId = req.body.questionId;
    let question = req.body.question;
    let type = req.body.type;
    let answers = {
        "answerA": req.body.answerA,
        "answerB": req.body.answerB,
        "answerC": req.body.answerC,
        "answerD": req.body.answerD
    }
    let correctAnswer = req.body.correctAnswer; 

    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("quiz-creator");
        let collection = dbo.collection('quizzes');
        collection.findOne({_id: ObjectId(quizId)}, function(err, result) {
            //// save quiz to variable
            // map through questions array to find question with _id === questionId
            // make that question = to new question object
            // save the mapped array as newQuestionArray
            // save questionsArray as newQuestionArray
            // createAndUpdate quiz questionsArray: newQuestionArray
            // Have to do this b/c like with anonymous thread project, we can't edit directly two levels deep in mongodb
            let oldQuestionsArray = result.questionsArray;
            let newQuestionsArray = oldQuestionsArray.map(function(ele) {
                // may need to ObjectId(questionid)
                if (ele._id == questionId) {
                    let newQuestion = {
                        "_id": ObjectId(questionId),
                        "quizId": quizId,
                        "question": question,
                        "answers": answers,
                        "correctAnswer": correctAnswer
                    }
                    return newQuestion;
                } else {
                    return ele;
                }
            });
            collection.findOneAndUpdate({_id: ObjectId(quizId)}, { $set: {questionsArray: newQuestionsArray} }, function(err, doc) {
                if (doc) {
                    res.send({ error: 0, message: "Question Added"});
                } else {
                    res.send({ error: 1, message: err });
                }
            });
        });
    });
})
*/








/* old structure
app.post('/createQuiz', (req, res) => {    
    //let quizObject = req.body;
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("quiz-creator");
        let collection = dbo.collection('quizzes');
        //let users = dbo.collection('users');
        //let user = req.session.userId;
        collection.insertOne({
            "createdBy": req.session.userId,
            "school": req.body.school,
            "teacher": req.body.teacher,
            "title": req.body.title,
            "numberOfQuestions": req.body.numberOfQuestions,
            "questionsArray": req.body.questionsArray
            }, function(err, doc) {
            //console.log(doc.insertedId);
            
            let quizId = doc.insertedId;
            //users.findOneAndUpdate({_id: ObjectId(user)}, { $push: { quizzes: userQuizObject } });
            res.json({error: 0, message: "quiz created", quizId: quizId })
        });
    });
})
*/

/* old structure
app.post('/pushQuestion', (req, res) => {
    //let questionObject = req.body;
    //console.log(req.body);
    
   let answers = {
        "answerA": req.body.answerA,
        "answerB": req.body.answerB,
        "answerC": req.body.answerC,
        "answerD": req.body.answerD
    }
    let questionObject = {
        "_id": new ObjectId(),
        "quizId": req.body.quizId,
        "question": req.body.question,
        "answers": answers,
        "correctAnswer": req.body.correctAnswer
    }
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("quiz-creator");
        let collection = dbo.collection('quizzes');
        collection.findOneAndUpdate({_id: ObjectId(questionObject.quizId)}, { $push: { questionsArray: questionObject } }, function(err, result) {
            if (result) {
                res.send({ error: 0, message: "Question Added"});
            } else {
                res.send({ error: 1, message: "Quiz Doesn't Exist" })            }
        });
    });
});
*/







// new requests

app.post('/submitQuiz', (req, res) => {
    // insert quizObject into mongodb

    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("quiz-creator");
        let collection = dbo.collection('quizzes');
        
        // create new questionsArray that gives each question a ObjectId
        let questionsArray = req.body.questionsArray;
        let newQuestionsArray = questionsArray.map(function(ele) {
            ele._id = new ObjectId;
            return ele;
        });
        collection.insertOne({
            "createdBy": req.session.userId,
            "createdOn" : new Date,
            "school": req.body.school,
            "teacher": req.body.teacher,
            "title": req.body.title,
            "numberOfQuestions": req.body.numberOfQuestions,
            "questionsArray": newQuestionsArray,
            "studentsTaken": []
            }, function(err, doc) {
                let quizId = doc.insertedId;
                res.json({error: 0, message: "quiz created", quizId: quizId });
            
        });
    });
})
app.post('/getQuizData', (req, res) => {
    let quizId = req.body.quizId;
    
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("quiz-creator");
        let collection = dbo.collection('quizzes');
        collection.findOne({_id: ObjectId(quizId)}, function(err, result) {
            if (result) {
                console.log(result.title);
                let quizObject = {
                    "quizId": result._id,
                    "title": result.title,
                    "school": result.school,
                    "teacher": result.teacher,
                    "numberOfQuestions": result.numberOfQuestions,
                    "questionsArray": result.questionsArray,
                    "studentsTaken": result.studentsTaken
                }
                res.send({ error: 0, message: "quiz found", quizObject: quizObject });
            } else {
                res.send({ error: 1, message: "Couldn't find quiz" });
            }
        });
    });
})

/*
app.get('/getQuestion', (req, res) => {
    let quizId = req.body.quizId;
    let questionId = req.body.questionId;
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("quiz-creator");
        let collection = dbo.collection('quizzes');
        collection.findOne({_id: quizId})

    });
})
*/

app.post('/editQuestionNew', (req, res) => {
    // find one then find one and update
    // find quiz
    // would need to clone questionsArray
    // create a newQuestionArray with changed spot
    // save to questionsArray
    let quizId = req.body.quizId;
    let questionId = req.body.questionId;
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("quiz-creator");
        let collection = dbo.collection('quizzes');
        collection.findOne({_id: ObjectId(quizId)}, function(err, result) {
            // loop through questionsArray if _id === questionId then change
            let newQuestionsArray = result.questionsArray.map(function(ele) {
                if (ele._id == questionId) {
                    ele.question = req.body.question;
                    ele.type = req.body.type;
                    ele.answerA = req.body.answerA;
                    ele.answerB = req.body.answerB;
                    ele.answerC = req.body.answerC;
                    ele.answerD = req.body.answerD;
                    ele.correctAnswer = req.body.correctAnswer;
                }
                return ele;
            })
            collection.findOneAndUpdate({_id: ObjectId(quizId)}, {$set: {questionsArray: newQuestionsArray}}, function(err, doc) {
                res.json({error: 0, message: "question edited"});
            })
        });
    });
})

/* Discussion
We delete a question here by passing quizId and questionId from client. Then,
we grab quiz by quizId. Next, we create a new questions array by filtering old
questions array and removing question == to questionId passed from client. We 
then update the quiz and $set the questionsArray to newQuestionsArray and we
also $inc numberOfQuestions by -1...numberOfQuestions is saved as a string in
db for some reason...so we have to transfer to integer then minus then transfer
to string...
*/
app.post('/deleteQuestion', (req, res) => {
    let quizId = req.body.quizId;
    let questionId = req.body.questionId;
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("quiz-creator");
        let collection = dbo.collection('quizzes');
        collection.findOne({_id: ObjectId(quizId)}, function(err, result) {
            let newQuestionsArray = result.questionsArray.filter(function(ele) {
                // filters out element which is == to questionId passed from client
                if (ele._id != questionId) {
                    return ele;
                }
            })
            let number = result.numberOfQuestions;
            console.log(number);
            number = parseInt(number);
            console.log(number);
            number--;
            console.log(number);
            toString(number);
            console.log(number);
            
            collection.findOneAndUpdate({_id: ObjectId(quizId)}, {$set: {numberOfQuestions: number, questionsArray: newQuestionsArray}}, function(err, doc) {
                /*
                collection.findOneAndUpdate({_id: ObjectId(quizId)}, {$inc: {numberOfQuestions: -1}}, function(err, doc) {
                    res.json({error: 0, message: "question deleted"});
                });
                */
               res.json({error: 0, message: "question deleted"});
                
            })
        });
    });
})

app.post('/deleteQuiz', (req, res) => {
    let quizId = req.body.quizId;
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("quiz-creator");
        let collection = dbo.collection('quizzes');
        collection.remove({_id: ObjectId(quizId)}, function(err, result) {
            res.json({error: 0, message: "quiz deleted"});
        })
    })
})






app.post('/getQuizOptions', (req, res) => {
    let school = req.body.school;
    let teacher = req.body.teacher;

    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("quiz-creator");
        let collection = dbo.collection('quizzes');
        collection.find({ "school": school, "teacher": teacher }).toArray(function(err, docs) {
            let quizOptions = docs;
            //console.log(quizOptions);
            res.send({ quizOptions: quizOptions });
        });
    });
})
app.post('/getAllQuizzes', (req, res) => {
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("quiz-creator");
        let collection = dbo.collection('quizzes');
        collection.find().toArray(function(err, docs) {
            let quizOptions = docs;
            //console.log(quizOptions);
            res.send({ quizOptions: quizOptions });
        });
    });
})

app.post('/submitAnswers', (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let quizId = req.body.quizId;
    //let questionNumber = req.body.questionNumber;
    let answers = req.body.answers;
    let studentObject = {
        "firstName": firstName,
        "lastName": lastName,
        "answers": answers,
        "score": "0"
    }

    // need to check if student name already exists, if so don't run all this
    // send back error student already exists
    // could also run this check on the client end when we get the quizObject there
    // we can check on input of first name and last name if they both exist already
    // could not let them proceed at that point
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("quiz-creator");
        let collection = dbo.collection('quizzes');
        collection.findOne({ _id: ObjectId(quizId) }, function(err, docs) {
            let correctAnswers = docs.questionsArray.map(function(ele) {
                return ele.correctAnswer;
            })
            let studentAnswers = answers;
            let answerCheck = [];
            let score = 0;
            for (i = 0; i < correctAnswers.length; i++) {
                let questionNumber = i + 1
                if (correctAnswers[i] == studentAnswers[i]) {
                    answerCheck.push(questionNumber + "-Correct");
                    score++;
                } else {
                    //answerCheck.push("0");
                    answerCheck.push(questionNumber + "-Wrong-Answered " + studentAnswers[i]);
                    score = score; ////// could take this out
                }
            }

            let percent = score / correctAnswers.length;
            percent = percent * 100;
            percent = percent.toFixed(0);
            percent = percent + "%";
            studentObject.score = percent;
            studentObject.correctAnswers = answerCheck;
            studentObject.ratio = score;
            
            collection.findOneAndUpdate({ _id: ObjectId(quizId)}, {$push: { studentsTaken: studentObject }}, function(err, result) {
                res.send({ error: 0, message: "answers sent", answerCheck: answerCheck, score: percent, ratio: score });
            });
            
        });
    });


})



module.exports = app;