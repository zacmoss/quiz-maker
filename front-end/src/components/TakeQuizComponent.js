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
            results: null,
            ratio: null,
            answerCheck: []
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
    
    answerClick(answer) {
        let self = this;
        let lastPage = false;
        if (this.state.numberOfQuestions == this.state.page) {
            lastPage = true;
            let newArray = this.state.chosenAnswers;
            newArray.push(answer);
            let data = {
                "quizId": this.state.quizId,
                "firstName": this.state.firstName,
                "lastName": this.state.lastName,
                "answers": newArray 
            }

            axios.post('/submitAnswers', data).then(function(response) {

                let score = response.data.score;
                let ratio = response.data.ratio;
                let answerCheck = response.data.answerCheck;
                self.setState(() => ({
                    chosenAnswers: newArray,
                    lastPage: lastPage,
                    results: score,
                    ratio: ratio,
                    answerCheck: answerCheck
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
    }

    render() {
        return (
            <div>
                <Header />
                <div className="form_page_container">
                    <div className="form_container">
                        {this.state.lastPage ?
                            <div>
                                <h1 className="take_quiz_large_text">Results</h1>
                                <p className="find_quiz_small_text">Got {this.state.ratio} out of {this.state.numberOfQuestions}</p>
                                <div className="student_results">{this.state.results}</div>
                            </div>
                        :
                            <div>
                                {this.state.page == 0 ?
                                    <div>
                                        <p className="neo_form_container_title">Enter name</p>
                                        <div className="neo_form">
                                        
                                            <div className="neo_form_inputs_container">
                                                
                                                <input placeholder="first name" value={this.state.firstName} onChange={this.firstNameHandler} required autoFocus></input>
                                                <div className="form_button_container">
                                                    <button onClick={this.startQuiz}>Start Quiz</button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* teacher-student-version
                                        <div className="form">
                                            <div className="student_form_inputs_container">
                                                <p>Enter first and last name</p>
                                                <div><label>First Name</label></div>
                                                <input placeholder="first name" value={this.state.firstName} onChange={this.firstNameHandler} required></input>
                                                <div><label>Last Name</label></div>
                                                <input placeholder="last name" value={this.state.lastName} onChange={this.lastNameHandler} required></input>
                                                <div className="form_button_container">
                                                    <button onClick={this.startQuiz}>Start Quiz</button>
                                                </div>
                                            </div>
                                        </div>
                                        */}
                                    </div>
                                :
                                    <div>
                                        <h2>{this.state.title}</h2>
                                        <div className="form">
                                            <div className="student_form_inputs_container">
                                                <div className="student_question">{this.state.question}</div>
                                                <div className="quiz_list_item_container" value={"a"} onClick={() => this.answerClick("a")}>{this.state.answerA}</div>
                                                <div className="quiz_list_item_container" value={"b"} onClick={() => this.answerClick("b")}>{this.state.answerB}</div>
                                                <div className="quiz_list_item_container" value={"c"} onClick={() => this.answerClick("c")}>{this.state.answerC}</div>
                                                <div className="quiz_list_item_container" value={"d"} onClick={() => this.answerClick("d")}>{this.state.answerD}</div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
                
            </div>
        )
    }
}

export default TakeQuizComponent;