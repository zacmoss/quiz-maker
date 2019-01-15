import React from 'react';
import axios from 'axios';
import '../style.css';




class EditQuestionComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quizId: this.props.quizId,
            school: "",
            teacher: "",
            title: "",
            number: 0,
            numberOfQuestions: 0,
            questionId: null,
            question: "",
            type: "multiple",
            answerA: "",
            answerB: "",
            answerC: "",
            answerD: "",
            correctAnswer: ""
        }
    
        this.typeHandler = this.typeHandler.bind(this);
        this.questionHandler = this.questionHandler.bind(this);
        this.answerAHandler = this.answerAHandler.bind(this);
        this.answerBHandler = this.answerBHandler.bind(this);
        this.answerCHandler = this.answerCHandler.bind(this);
        this.answerDHandler = this.answerDHandler.bind(this);
        this.correctAnswerHandler = this.correctAnswerHandler.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    
    componentWillMount() {        
        this.setState(() => ({
            questionId: this.props.object._id,
            question: this.props.object.question,
            answerA: this.props.object.answerA,
            answerB: this.props.object.answerB,
            answerC: this.props.object.answerC,
            answerD: this.props.object.answerD,
            correctAnswer: this.props.object.correctAnswer,
            number: this.props.number
        }));
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

    
    onSubmit(e) {
        e.preventDefault();
        let self = this;
        let data = {
            "quizId": this.state.quizId,
            "questionId": this.state.questionId,
            "question": this.state.question,
            "type": this.state.type,
            "answerA": this.state.answerA,
            "answerB": this.state.answerB,
            "answerC": this.state.answerC,
            "answerD": this.state.answerD,
            "correctAnswer": this.state.correctAnswer
        }
        // new edit question request
        axios.post('/editQuestionNew', data).then(function(response) {
            console.log(response);
            if (response.data.error === 0) {
                console.log(response.data.message);
                self.props.backClick();
            } else {
                console.log('error here');
                console.log(response.data.message);
            }
        }).catch(function(err) {
            console.log(err);
        })
    }
    
    

    render() {
        return (
            <div>
                {this.state.title}
                {this.state.school}
                {this.state.teacher}
                <div className="edit_container">
                    {/*<button onClick={this.props.backClick}>Back</button>*/}
                    <form onSubmit={this.onSubmit}>
                        <div><label>Question {this.state.number}</label></div>
                        <input name="question" value={this.state.question} placeholder="question" autoComplete="off" onChange={this.questionHandler}></input>
                        <div>
                            <div><label>{this.state.submit}</label></div>
                            <div><label>a.</label></div>
                            <div><input name="answerA" value={this.state.answerA} onChange={this.answerAHandler} autoComplete="off"></input></div>
                            <div><label>b.</label></div>
                            <div><input name="answerB" value={this.state.answerB} onChange={this.answerBHandler} autoComplete="off"></input></div>
                            <div><label>c.</label></div>
                            <div><input name="answerC" value={this.state.answerC} onChange={this.answerCHandler} autoComplete="off"></input></div>
                            <div><label>d.</label></div>
                            <div><input name="answerD" value={this.state.answerD} onChange={this.answerDHandler} autoComplete="off"></input></div>
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
                        <div className="edit_button_container">
                            <button className="edit_save_button">Save</button>
                        </div>
                        
                    </form>

                </div>
            </div>
        )
    }

}

export default EditQuestionComponent;