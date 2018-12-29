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

*/


class TakeQuizComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            school: "",
            teacher: "",
            title: "",
            questionsArray: [],
            numberOfQuestions: 0,
            question: "",
            answerA: "",
            answerB: "",
            answerC: "",
            answerD: "",
            chosenAnswer: "",
            page: 0,
            quizOptions: [],
            quizSelected: ""
        }
        
        this.answerClick = this.answerClick.bind(this);
        this.nameHandler = this.nameHandler.bind(this);
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
                numberOfQuestions: response.data.quizObject.numberOfQuestions
            }));
        }).catch(function(err) {
            console.log(err);
        })
    }

    nameHandler(e) {
        e.persist();
        this.setState(() => ({ name: e.target.value }));
    }

    startQuiz(e) {
        e.preventDefault();
        this.setState(() => ({
            page: 1,
            question: this.state.questionsArray[0].question,
            answerA: this.state.questionsArray[0].answerA,
            answerB: this.state.questionsArray[0].answerB,
            answerC: this.state.questionsArray[0].answerC,
            answerD: this.state.questionsArray[0].answerD,
        }));
    }

    answerClick(e) {
        alert(e.target.value);
    }

    render() {
        return (
            <div>
                {this.state.page == 0 ?
                <div>
                    <p>Enter name and email</p>
                    <input placeholder="name" value={this.state.name} onChange={this.nameHandler} required></input>
                    <button onClick={this.startQuiz}>Start Quiz</button>
                </div>
                :
                <div>
                    <div>{this.state.title}</div>
                    <div>{this.state.question}</div>
                    <p value={"a"} onClick={this.answerClick}>{this.state.answerA}</p>
                    <p value={"b"} onClick={this.answerClick}>{this.state.answerB}</p>
                    <p value={"c"} onClick={this.answerClick}>{this.state.answerC}</p>
                    <p value={"d"} onClick={this.answerClick}>{this.state.answerD}</p>
                </div>
                }
            </div>
        )
    }
}

export default TakeQuizComponent;