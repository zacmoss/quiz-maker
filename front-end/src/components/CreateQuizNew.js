import React from 'react';
//import ReactDOM from 'react-dom';
import axios from 'axios';
import '../style.css';
import Header from './Header';
import { Link } from 'react-router-dom';


/*
With this version

Question ids are generated at the server when they are created in db

We hit the server and db much less frequently, (i.e. for creation
only when submitting a quiz)

When clicking back during question creation, question objects previously
created were saved to the questionsArray, so all we're doing is going back 
through questionsArray and checking for them, then when clicking next we are
checking if there is a questionObject at the count in the questionsArray, if
there is then we populate the question with that data, else it would be an 
empty question...baller

*/

/*

Discussion

This component has two "modes." It starts with questions about school and teacher.
On the next click it conditionally renders questions jsx and disappears the intro jsx.

I'm employing a similar strategy to the Event Poster project here. We are 
generating jsx inside a helper function depending on number of questions entered.
That jsx is then saved to the state questionsRender which is then rendered below.

On nextClick create a questionsArray in server
In QuestionComponent on every component render I'm sending it's initial
data to that server questionsArray
Then, on every change to that component I'm updating that questionsArray at
the server

(No longer the case here) A good problem that I had to figure out, if it works, was the issue with trying
to pass values of Question Component back here, in order to, on submit, send
the proper data to the server then to the database. The way I fixed that, is to
do a server call here to initialize a new quiz object on the server, then
for every QuestionComponent rendered do a server call which pushes a new
question into that quiz object and edits it on every change to the component.



Do like with Event Poster and Interested and Going buttons. Only send this info to
server for conditionally rendering the question "type". The rest, you only have to 
do the server call creating the full Quiz Object when they click submit....

The above is maybe too expensive...if we're making server call every time we toggle
a question's type then that's a lot of server calls....

W/e we'll do it like EP first.

Could always do a 'multiple choice only' quiz down the line if this is too expensive.

The big problem is having to conditionally render the answers part of the form from
the selection of type on a particular question edit. Also, we're running into the
classic issue of, if I make each question edit an individual component, we can't
pass data, like type if it was changed and answers, etc back to hoc...

So, we'll just do a multiply choice only quiz right now...

To solve, we could do a "page" that for each specific question edit, that way
we'll have it all in one component and access and submit all changes and data 
on each submit

If necessary, could solve the original problem with Redux perhaps. Or, could look
into the new Hooks feature....Maybe re-visit this after I've learned about Hooks 
better.

So, two versions we're looking at right now...First, do a 'multiple-choice-only' quiz.
And second, do a version where each question edit is a new "page" (would just re-
render a component which moves to the "next question" on submit)



We can try to do separate QuestionComponents, we have a prop of 'submit' that is saved
as state on this HOC on each QC, onSubmit of form from the HOC we change the state of 
'submit' to 'true.' Then, on each QC have a switch where, if props changes, we do
a server call which pushes this specific questionObject into the bigger quizObject. So,
quizObject would need to already exist in db, we can generate it on nextClick from HOC,
and we also need to pass the quizObject id to the child component so on server call it
has access to that id and can push questionObject into that specific quizObject.

The problem with this scenario now is that the props passed to the child component
is not being updated properly on submit....the child is not getting that change,
event with the lifecycle method I put in....If we want to do a 'one-page' form, we'll
have to just do a vanilla javascript file for that and use ajax requests to the server...



So, we're just gonna do a 'multi-page' form...

*/



class CreateQuizNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quizId: null,
            school: "",
            teacher: "",
            title: "",
            numberOfQuestions: 1,
            question: "",
            number: 1,
            type: "multiple",
            answerA: "",
            answerB: "",
            answerC: "",
            answerD: "",
            correctAnswer: "a",
            page: 0,
            lastPage: false,
            questionsArray: [],
        }
        this.backClick = this.backClick.bind(this);
        //this.createQuiz = this.createQuiz.bind(this);
        //this.sendQuestion = this.sendQuestion.bind(this);
        this.initQuiz = this.initQuiz.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.submitQuiz = this.submitQuiz.bind(this);
        this.schoolHandler = this.schoolHandler.bind(this);
        this.teacherHandler = this.teacherHandler.bind(this);
        this.titleHandler = this.titleHandler.bind(this);
        this.numberOfQuestionsHandler = this.numberOfQuestionsHandler.bind(this);
        this.typeHandler = this.typeHandler.bind(this);
        this.questionHandler = this.questionHandler.bind(this);
        this.answerAHandler = this.answerAHandler.bind(this);
        this.answerBHandler = this.answerBHandler.bind(this);
        this.answerCHandler = this.answerCHandler.bind(this);
        this.answerDHandler = this.answerDHandler.bind(this);
        this.correctAnswerHandler = this.correctAnswerHandler.bind(this);
 
    }

    initQuiz(e) {
        e.preventDefault();
        console.log(this.state.numberOfQuestions);
        let school = this.state.school;
        let teacher = this.state.teacher;
        let title = this.state.title;
        let numberOfQuestions = this.state.numberOfQuestions;
        let lastPage = false;
        if (numberOfQuestions == 1) {
            lastPage = true;
        }
        
        this.setState(() => ({
           school: school,
           teacher: teacher,
           title: title,
           numberOfQuestions: numberOfQuestions,
           page: 1,
           number: 1,
           lastPage: lastPage
        }));
    }

    nextQuestion(e) {
        e.preventDefault();
        let page = this.state.page + 1;
        let number = this.state.number + 1;
        let lastPage;
        if (page == this.state.numberOfQuestions) {
            lastPage = true;
        }
        let questionObject = {
            question: this.state.question,
            type: this.state.type,
            answerA: this.state.answerA,
            answerB: this.state.answerB,
            answerC: this.state.answerC,
            answerD: this.state.answerD,
            correctAnswer: this.state.correctAnswer
        }
        
        let count = page - 1; // array count so 0, 1, 2... etc
        let questionsArray;

        if (this.state.questionsArray[count - 1]) {
            questionsArray = this.state.questionsArray;
            questionsArray[count - 1] = questionObject; // over writing previously saved questionObject
        } else {
            questionsArray = this.state.questionsArray.concat(questionObject);
        }
        

        // if this.state.questionsArray[page - 1] exists then populate with that data
        
        //let length = this.state.questionsArray.length;
        // if the next in the count already exists in the questionsArray then populate with that
        if (this.state.questionsArray[count]) {
            let questionObject = this.state.questionsArray[count]
            this.setState(() => ({
                number: number,
                page: page,
                lastPage: lastPage,
                questionsArray: questionsArray,
                question: questionObject.question,
                answerA: questionObject.answerA,
                answerB: questionObject.answerB,
                answerC: questionObject.answerC,
                answerD: questionObject.answerD,
                correctAnswer: questionObject.correctAnswer
            }));
        } else {
            this.setState(() => ({
                number: number,
                page: page,
                lastPage: lastPage,
                questionsArray: questionsArray,
                question: "",
                answerA: "",
                answerB: "",
                answerC: "",
                answerD: "",
                correctAnswer: "a"
            }));
        }
        //alert('clickity click');
    }

    backClick(e) {
        e.preventDefault();
        let page = this.state.page - 1;
        let number = this.state.number - 1;
        let lastPage = false;
        if (page == 0) {
            this.setState(() => ({
                number: number,
                page: page,
                lastPage: lastPage,
                question: "",
                answerA: "",
                answerB: "",
                answerC: "",
                answerD: "",
                correctAnswer: "a"
            }))
        } else {
            let count = page - 1;
            let questionObject = this.state.questionsArray[count];
            //let newQuestionsArray = 
            this.setState(() => ({
                number: number,
                page: page,
                lastPage: lastPage,
                question: questionObject.question,
                answerA: questionObject.answerA,
                answerB: questionObject.answerB,
                answerC: questionObject.answerC,
                answerD: questionObject.answerD,
                correctAnswer: questionObject.correctAnswer
            }))
        }
    }

    submitQuiz(e) {
        e.preventDefault();

        let questionObject = {
            question: this.state.question,
            type: this.state.type,
            answerA: this.state.answerA,
            answerB: this.state.answerB,
            answerC: this.state.answerC,
            answerD: this.state.answerD,
            correctAnswer: this.state.correctAnswer
        }

        let questionsArray = this.state.questionsArray.concat(questionObject);

        let data = {
            school: this.state.school,
            teacher: this.state.teacher,
            title: this.state.title,
            numberOfQuestions: this.state.numberOfQuestions,
            questionsArray: questionsArray
        }
        let self = this;
        axios.post('/submitQuiz', data).then(function(response) {
            if (response.data.error === 0) {
                alert(response.data.message);
                //self.clearInputs(e);
                self.props.history.push('/dashboard');
            } else {
                alert(response.data.message);
            }
        }).catch(function(err) {
            console.log(err);
        });
        //alert('submit dat quiz');
    }


    schoolHandler(e) {
        e.persist();
        this.setState(() => ({ school: e.target.value }));
    }
    teacherHandler(e) {
        e.persist();
        this.setState(() => ({ teacher: e.target.value }));
    }
    titleHandler(e) {
        e.persist();
        this.setState(() => ({ title: e.target.value }));
    }
    numberOfQuestionsHandler(e) {
        e.persist();
        this.setState(() => ({ numberOfQuestions: e.target.value }));
    }
    typeHandler(e) {
        e.persist();
        this.setState(() => ({ type: e.target.value }));
    }
    questionHandler(e) {
        e.persist();
        this.setState(() => ({ question: e.target.value }));
    }
    answerAHandler(e) {
        e.persist();
        this.setState(() => ({ answerA: e.target.value }));
    }
    answerBHandler(e) {
        e.persist();
        this.setState(() => ({ answerB: e.target.value }));
    }
    answerCHandler(e) {
        e.persist();
        this.setState(() => ({ answerC: e.target.value }));
    }
    answerDHandler(e) {
        e.persist();
        this.setState(() => ({ answerD: e.target.value }));
    }
    correctAnswerHandler(e) {
        e.persist();
        this.setState(() => ({ correctAnswer: e.target.value }));
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
                            <h2>Create a Quiz</h2>
                            
                            <div className="form">
                                <div className="form_inputs_container">
                                    {this.state.page === 0 ?
                                        <form onSubmit={this.initQuiz}>
                                            <div>
                                                <input name="school" value={this.state.school} onChange={this.schoolHandler} placeholder="school" autoComplete="off" required></input>
                                            </div>
                                            <div>
                                                <input name="teacher" value={this.state.teacher} onChange={this.teacherHandler} placeholder="teacher's last name" autoComplete="off" required></input>
                                            </div>
                                            <div>
                                                <input name="title" value={this.state.title} onChange={this.titleHandler} placeholder="quiz title" autoComplete="off" required></input>
                                            </div>
                                            <div>
                                                <select name="numberOfQuestions" value={this.state.numberOfQuestions} onChange={this.numberOfQuestionsHandler}>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                </select>
                                            </div>
                                            <div className="form_button_container">
                                                <button>Next</button>
                                            </div>
                                        </form>
                                    :
                                        <div>
                                            {this.state.title}
                                            {this.state.school}
                                            {this.state.teacher}
                                            <div>
                                                <button onClick={this.backClick}>Back</button>
                                                <form onSubmit={this.state.lastPage ? this.submitQuiz : this.nextQuestion}>
                                                    <div><label>Question {this.state.number}</label></div>
                                                    <input name="question" value={this.state.question} placeholder="question" autoComplete="off" onChange={this.questionHandler}></input>
                                                    <div>
                                                        <div><label>{this.state.submit}</label></div>
                                                        <div><label>a</label><input name="answerA" value={this.state.answerA} onChange={this.answerAHandler} autoComplete="off"></input></div>
                                                        <div><label>b</label><input name="answerB" value={this.state.answerB} onChange={this.answerBHandler} autoComplete="off"></input></div>
                                                        <div><label>c</label><input name="answerC" value={this.state.answerC} onChange={this.answerCHandler} autoComplete="off"></input></div>
                                                        <div><label>d</label><input name="answerD" value={this.state.answerD} onChange={this.answerDHandler} autoComplete="off"></input></div>
                                                        <div>
                                                            <div><label>Correct Answer</label></div>
                                                            <select name="correctAnswer" onChange={this.correctAnswerHandler} value={this.state.correctAnswer}>
                                                                <option value="a">a</option>
                                                                <option value="b">b</option>
                                                                <option value="c">c</option>
                                                                <option value="d">d</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                
                                                    <button className="form_button_container">{this.state.lastPage ? "Submit Quiz" : "Next"}</button>
                                                    
                                                </form>

                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column_three"></div>
                </div>
            </div>
        );
    }

}

export default CreateQuizNew;