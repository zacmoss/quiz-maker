import React from 'react';
import '../style.css';
import axios from 'axios';
import Header from './Header';
import EditQuestionComponent from './EditQuestionComponent';
import { Link } from 'react-router-dom';

/* 

First Page should be them entering their name and email

Check if student's name is already in that quiz's data, if not then render questions.

Then go through quiz questions

Finally, submit at end

Show results page last

Once a name has taken a quiz, save to that quizz's data in studentsTaken,
so that they can't take it again. Also in studentsTaken should be their
results.




To do

Put an alert if they press back during quiz, would mess the whole thing up
Need to figure that use case out...maybe need to find a way to only submit 
answers on finish of quiz, could easily store answers in a state array and
just compare on submit and send answers as well to server with student name
on submit....

*/


class TakeQuizComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            school: "",
            teacher: "",
            title: "",
            questionsArray: [],
            numberOfQuestions: 0,
            quizId: null,
            question: "",
            questionId: null,
            answerA: "",
            answerB: "",
            answerC: "",
            answerD: "",
            chosenAnswers: [],
            page: 0,
            lastPage: false,
            quizOptions: [],
            quizSelected: "",
            results: null
        }
        
        this.answerClick = this.answerClick.bind(this);
        this.firstNameHandler = this.firstNameHandler.bind(this);
        this.lastNameHandler = this.lastNameHandler.bind(this);
        this.startQuiz = this.startQuiz.bind(this);
    }

    componentWillMount() {
        // server request for quizObject using quizId in query string
        // could render "page 0" view without having this data and giving a sec
        // for it to get received
        let self = this;
        let quizId = this.props.location.search.slice(8);
        let data = {
            "quizId": quizId
        }
        axios.post('/getQuizData', data).then(function(response) {
            self.setState(() => ({
                questionsArray: response.data.quizObject.questionsArray,
                title: response.data.quizObject.title,
                numberOfQuestions: response.data.quizObject.numberOfQuestions,
                quizId: quizId
            }));
        }).catch(function(err) {
            console.log(err);
        })
    }

    firstNameHandler(e) {
        e.persist();
        this.setState(() => ({ firstName: e.target.value }));
    }
    lastNameHandler(e) {
        e.persist();
        this.setState(() => ({ lastName: e.target.value }));
    }

    startQuiz(e) {
        e.preventDefault();
        this.setState(() => ({
            page: 1,
            question: this.state.questionsArray[0].question,
            questionId: this.state.questionsArray[0]._id,
            answerA: this.state.questionsArray[0].answerA,
            answerB: this.state.questionsArray[0].answerB,
            answerC: this.state.questionsArray[0].answerC,
            answerD: this.state.questionsArray[0].answerD
        }));
    }

    /* strategy decision here...

    On answer click, should we send ever answer to the server and db

    Or should we send the answer to some kind of state array which is
    only sent to server when quiz is complete.

    If we do the former, it's harder to implement a 'go back' option,
    which I don't really want to have anyway. So, I feel like I can
    get away with the first option for now...It's more expensive though,
    hitting the server every answer click...

    */
    
    answerClick(answer) {
        let self = this;
        // new structure, push to state array chosenAnswers
        // then at end of quiz check with quizObject answers
        // and send results and chosenAnswers array to server and db

        ////////////// should I do resultsPage as a component rather than a third
        ////////////// conditional render????

        let lastPage = false;
        if (this.state.numberOfQuestions == this.state.page) {
            alert('this was the last question');
            lastPage = true;
            let newArray = this.state.chosenAnswers;
            newArray.push(answer);
            let data = {
                "quizId": this.state.quizId,
                "firstName": this.state.firstName,
                "lastName": this.state.lastName,
                "answers": newArray 
            }
            // need to server call and submit answers then compare to correct
            // get all that to render for results page
            // finally setState after all that complete
            axios.post('/submitAnswers', data).then(function(response) {

                console.log("score: " + response.data.score);
                console.log("Answer Check - " + response.data.answerCheck);
                let score = response.data.score;
                self.setState(() => ({
                    chosenAnswers: newArray,
                    lastPage: lastPage,
                    results: score
                }));
            }).catch(function(err) {
                console.log(err);
            })
            
        } else {
            let page = this.state.page + 1;
            let question = page - 1;
            let newArray = this.state.chosenAnswers;
            newArray.push(answer);
            this.setState(() => ({
                page: page,
                question: this.state.questionsArray[question].question,
                questionId: this.state.questionsArray[question]._id,
                answerA: this.state.questionsArray[question].answerA,
                answerB: this.state.questionsArray[question].answerB,
                answerC: this.state.questionsArray[question].answerC,
                answerD: this.state.questionsArray[question].answerD,
                chosenAnswers: newArray,
                lastPage: lastPage
            }));
        }
        /*
        let page = this.state.page + 1;
        let question = page - 1;
        
        let newArray = this.state.chosenAnswers;
        newArray.push(answer);
        this.setState(() => ({
            page: page,
            question: this.state.questionsArray[question].question,
            questionId: this.state.questionsArray[question]._id,
            answerA: this.state.questionsArray[question].answerA,
            answerB: this.state.questionsArray[question].answerB,
            answerC: this.state.questionsArray[question].answerC,
            answerD: this.state.questionsArray[question].answerD,
            chosenAnswers: newArray,
            lastPage: lastPage
        }));
        console.log(newArray);
        */


        /* old but works, messed up if they press back during quiz
        let self = this;
        let data = {
            "firstName": this.state.firstName,
            "lastName": this.state.lastName,
            "quizId": this.state.quizId,
            "questionNumber": this.state.page,
            "answer": answer
        }
        axios.post('/answerQuestion', data).then(function(response) {
            alert(response.data.message);
            let page = self.state.page + 1;
            let question = page - 1;
            self.setState(() => ({
                page: page,
                question: self.state.questionsArray[question].question,
                questionId: self.state.questionsArray[question]._id,
                answerA: self.state.questionsArray[question].answerA,
                answerB: self.state.questionsArray[question].answerB,
                answerC: self.state.questionsArray[question].answerC,
                answerD: self.state.questionsArray[question].answerD
            }))
        }).catch(function(err) {
            console.log(err);
        });
        // push this to server and to db with student name and answer
        // inside axios call set new question state with positive response
        // also increment page count state
        // inside axios call render new question (Should auto render with setState)
        */
    }

    render() {
        return (
            <div>
                {this.state.lastPage ?
                    <div>{this.state.results}</div>
                :
                    <div>
                        {this.state.page == 0 ?
                            <div>
                                <p>Enter first and last name</p>
                                <input placeholder="first name" value={this.state.firstName} onChange={this.firstNameHandler} required></input>
                                <input placeholder="last name" value={this.state.lastName} onChange={this.lastNameHandler} required></input>
                                <button onClick={this.startQuiz}>Start Quiz</button>
                            </div>
                        :
                            <div>
                                <div>{this.state.title}</div>
                                <div>{this.state.question}</div>
                                <p value={"a"} onClick={() => this.answerClick("a")}>{this.state.answerA}</p>
                                <p value={"b"} onClick={() => this.answerClick("b")}>{this.state.answerB}</p>
                                <p value={"c"} onClick={() => this.answerClick("c")}>{this.state.answerC}</p>
                                <p value={"d"} onClick={() => this.answerClick("d")}>{this.state.answerD}</p>
                            </div>
                        }
                    </div>
                }
                
            </div>
        )
    }
}

export default TakeQuizComponent;