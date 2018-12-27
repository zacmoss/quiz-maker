import React from 'react';
import '../style.css';
import axios from 'axios';
import Header from './Header';
import ViewQuiz from './ViewQuiz';
import { Link } from 'react-router-dom';



class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userType: null,
            quizzesArray: [],
            editQuizObject: null
        }
        //this.searchEvents = this.searchEvents.bind(this);
    }

    componentWillMount() {
        let self = this;
        axios.get('/getUserData').then(function(result) {
            let type = result.data.type;
            //let userId = result.data.userId;
            let array = result.data.array;
            let renderArray = array.map(function(ele) {
                return (
                    <div key={ele._id} onClick={() => self.newClick(ele._id)}>{ele.title}</div>
                   //<div key={ele.quizId}><Link props={ele.quizId} to="/viewQuiz">{ele.title}</Link></div>
                    );
            });
            
            self.setState(() => ({ userType: type, quizzesArray: renderArray }));
        }).catch(function(err) {
            console.log(err);
        })
    }

    clickQuiz(quizId) {
        let self = this;
        let data = { "quizId": quizId };
        axios.post('/getQuizData', data).then(function(result) {
            console.log(result.data.quizObject);
            self.setState(() => ({ editQuizObject: result.data.quizObject }));
        }).catch(function(err) {
            console.log(err);
        });
    }
    newClick(quizId) {
        this.props.history.push('/viewQuizNew?quizId=' + quizId);
    }


    render() {
        return (
            <div>
                {this.state.editQuizObject !== null ? 
                    <div>
                        <Header />
                        <ViewQuiz object={this.state.editQuizObject} />
                    </div>
                :
                    <div>
                        <Header />
                        <div className="teacher_dashboard">
                            <Link className="td_link" to="/createQuizNew"><p className="td_button">Create Quiz</p></Link>
                            <div>
                                <h2>My Quizes</h2>
                                <div>
                                    {this.state.quizzesArray}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )

    }
    /* old render
    render() {
        return (
            <div>
                { this.state.userType === "student" ? 
                    <div>
                        <Header />
                        <div className="teacher_dashboard">
                            <div>
                                <h2>Student Dashboard</h2>
                                <div>
                                    <p>Quiz 1</p>
                                    <p>Quiz 2</p>
                                    <p>Quiz 3</p>
                                </div>
                            </div>
                        </div>
                    </div>
                :
                    <div>
                        <Header />
                        <div className="teacher_dashboard">
                            <Link className="td_link" to="/createQuizPage"><p className="td_button">Create Quiz</p></Link>
                            <div>
                                <h2>My Quizes</h2>
                                <div>
                                    {this.state.quizzesArray}
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {this.state.editQuizObject !== null && <ViewQuiz object={this.state.editQuizObject} test="test" />}
            </div>
        )

    }*/
}

export default Dashboard;