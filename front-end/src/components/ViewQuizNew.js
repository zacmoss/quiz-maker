import React from 'react';
import '../style.css';
import axios from 'axios';
import Header from './Header';
import EditQuestionComponent from './EditQuestionComponent';
import { Link } from 'react-router-dom';



class ViewQuizNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "view",
            quizId: null,
            school: null,
            teacher: null,
            title: null,
            numberOfQuestions: null,
            questionsRender: [],
            questionPassed: null,
            numberPassed: null
        }
        this.backClick = this.backClick.bind(this);
    }

    componentWillMount() {
        this.getQuestions();
    }

    editQuestion(ele, number) {
        this.setState(() => ({ mode: "edit", questionPassed: ele, numberPassed: number }));
        
    }
    backClick() {
        //e.preventDefault();
        // need to re-render questions here
        if (this.state.mode === "view") {
            this.props.history.push('/dashboard');
        } else {
            this.getQuestions(); // contains a synchronous function so this lags....
            // could put the mode state change inside the above function to not change view until updated
            this.setState(() => ({ mode: "view" }));
        }
    }
    getQuestions() {
        let quizId = this.props.location.search.slice(8);
        let self = this;
        let data = { "quizId": quizId };
        axios.post('/getQuizData', data).then(function(result) {
            let questionsRender = self.renderQuestions(result.data.quizObject.questionsArray);
            self.setState(() => ({
                quizId: quizId,
                teacher: result.data.quizObject.teacher,
                school: result.data.quizObject.school,
                title: result.data.quizObject.title,
                numberOfQuestions: result.data.quizObject.numberOfQuestions,
                questionsRender: questionsRender,
                questionPassed: null,
                numberPassed: null
            }));
        }).catch(function(err) {
            console.log(err);
        });
    }


    
    renderQuestions(questionsArray) {
        let self = this;
        let number = 0;
        let array = questionsArray;
        let questionsRender = array.map(function(ele) {
            number ++;
            return (
                <div key={ele._id} className="question_container">
                    <div>Question number {number}</div>
                    <div>{ele.question}</div>
                    <div>
                        <div>a {ele.answerA}</div>
                        <div>b {ele.answerB}</div>
                        <div>c {ele.answerC}</div>
                        <div>d {ele.answerD}</div>
                    </div>
                    <div>{ele.correctAnswer}</div>
                    <div className="form_button_container"><button onClick={() => self.editQuestion(ele, number)}>Edit Question</button></div>
                </div>
            )
        })
        return questionsRender;
    }

    render() {
        return (
            <div>
                <Header />
            
                <div className="new_form_page_container">
                    <div className="column_one">
                        <Link to="/dashboard"><button>&#8592; Back to Dashboard</button></Link>
                    </div>
                    <div className="column_two">
                        <div className="form_container">
                            {this.state.title !== null && <h2>{this.state.title}</h2>}
                            {this.state.mode === "edit" ?
                                <div className="form">
                                    <div className="student_form_inputs_container">
                                        <div>
                                            <EditQuestionComponent mode={"edit"} quizId={this.state.quizId} number={this.state.numberPassed} object={this.state.questionPassed} backClick={this.backClick}/>
                                        </div>
                                    </div>
                                </div>
                            :
                                <div className="form">
                                    <div className="student_form_inputs_container">
                                        <div>
                                            
                                            {this.state.teacher !== null && <div className="center"><h3>Teacher - {this.state.teacher}</h3></div>}
                                            
                                            {this.state.questionsRender}
                                        </div>
                                    </div>
                                </div>
                            
                            }
                        </div>
                    </div>
                    <div className="column_three"></div>
                </div>
            </div>
        )

    }
}

export default ViewQuizNew;