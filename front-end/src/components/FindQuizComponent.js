import React from 'react';
import '../style.css';
import axios from 'axios';
import Header from './Header';
import EditQuestionComponent from './EditQuestionComponent';
import { Link } from 'react-router-dom';

/* Discussion

We conditionally render two views on this component.

The default view is the 'page 1' view which shows inputs for school and teacher. On
submit of this first view we alter state to conditionally render the 'page 2' view
while also hitting the server and db to grab all quizzes which have the school and
teacher inputed. We then render those quizzes as divs and 
render that. The user then is able to choose from the available quizzes and on submit
of that 'page 2' view we use the this.props.history.push method to send them to
the TakeQuiz component with a query string of the quizId.

At TakeQuiz component the query string quizId is used to hit the server and db and
recieve the appropriate quiz and questions which are rendered and utitlized for the
user to take and submit the quiz.

*/


class FindQuizComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "view",
            school: "",
            teacher: "",
            page: 1,
            quizOptions: [],
            quizSelected: ""
        }
        this.schoolHandler = this.schoolHandler.bind(this);
        this.teacherHandler = this.teacherHandler.bind(this);
        this.quizHandler = this.quizHandler.bind(this);
        this.findQuiz = this.findQuiz.bind(this);
    }

    componentWillMount() {
        //this.getQuestions();
    }

    schoolHandler(e) {
        e.persist();
        this.setState(() => ({ school: e.target.value }));
    }
    teacherHandler(e) {
        e.persist();
        this.setState(() => ({ teacher: e.target.value }));
    }
    quizHandler(e) {
        e.persist();
        this.setState(() => ({ quizSelected: e.target.value }));
    }
    findQuiz(e) {
        e.preventDefault();
        //alert('clickity click');
        let self = this;
        let data = {
            "school": this.state.school,
            "teacher": this.state.teacher
        }
        let quizOptions;
        axios.post('/getQuizOptions', data).then(function(response) {
            console.log(response);
            quizOptions = response.data.quizOptions;
            
            // set quiz options render in a variable and save to state
            let optionsRender;
            if (quizOptions.length < 1) {
                optionsRender = (<div>No Quizes Found</div>);
            } else {
                optionsRender = quizOptions.map(function(ele) {
                    return (
                        <div key={ele._id} onClick={() => self.takeQuiz(ele._id)}>
                            <div className="quiz_list_item_container">{ele.title}</div>
                        </div>
                        );
                });
            }
            
            self.setState(() => ({ page: 2, quizOptions: optionsRender }));
        }).catch(function(err) {
            console.log(err);
        });
    }
    takeQuiz(quizId) {
        //e.preventDefault();
        //alert('click dat');
        //alert(quizId);
        this.props.history.push('/takeQuiz?quizId=' + quizId);
    }

    render() {
        return (
            <div>
                <Header />
            
                <div className="form_page_container">
                    <div className="form_container">
        {this.state.page == 1 ? <p className="find_quiz_small_text">Enter School and Teacher name below.</p> : <p className="find_quiz_small_text">Choose a quiz to take.</p>}                       
                        <div className="form">
                            <div className="student_form_inputs_container">
                            {this.state.page == 1 ?
                                <form onSubmit={this.findQuiz}>
                                    <div><label>School</label></div>
                                    <div>
                                        <input name="school" value={this.state.school} onChange={this.schoolHandler} placeholder="school" autoComplete="off" required></input>
                                    </div>
                                    <div><label>Teacher</label></div>
                                    <div>
                                        <input name="teacher" value={this.state.teacher} onChange={this.teacherHandler} placeholder="teacher" autoComplete="off" required></input>
                                    </div>
                                    <div className="form_button_container">
                                        <button>Find Quiz</button>
                                    </div>
                                </form>
                            :
                                <form onSubmit={this.takeQuiz}>
                                    <div>
                                        {this.state.quizOptions}
                                    </div>
                                    
                                </form>
                            }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FindQuizComponent;