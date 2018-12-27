import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import '../style.css';
import HomePage from '../components/HomePage';
import LoginPage from '../components/LoginPage';
import NotFoundPage from '../components/NotFoundPage';
import Footer from '../components/Footer';
import SignUpPage from '../components/SignUpPage';
import Dashboard from '../components/Dashboard';
import StudentDashboard from '../components/StudentDashboard';
import TeacherDashboard from '../components/TeacherDashboard';
import CreateQuizPage from '../components/CreateQuizPage';
import CreateQuizNew from '../components/CreateQuizNew';
import ViewQuiz from '../components/ViewQuiz';
import ViewQuizNew from '../components/ViewQuizNew';
import EditQuestionComponent from '../components/EditQuestionComponent';
import createHistory from 'history/createBrowserHistory';

export const history = createHistory();

class AppRouter extends React.Component { // Client-Side Routing

    /*
    componentDidMount() {
        console.log('rendered');
        axios.get('/getSignedIn').then(function(result) {
            console.log(result.data);
        }).catch(function(err) {
            console.log("error: " + err);
        })
    }
    */

    /* <Footer /> */

    render() {
        
        return (
            <Router history={history}>
                <div className="page_container">
                    <Switch>
                        <Route path="/" component={HomePage} exact={true} />
                        <Route path="/login" component={LoginPage} />
                        <Route path="/signUp" component={SignUpPage} />
                        <Route path="/dashboard" component={Dashboard} />
                        <Route path="/studentDashboard" component={StudentDashboard} />
                        <Route path="/teacherDashboard" component={TeacherDashboard} />
                        <Route path="/createQuizPage" component={CreateQuizPage} />
                        <Route path="/createQuizNew" component={CreateQuizNew} />
                        <Route path="/viewQuiz" component={ViewQuiz} />
                        <Route path="/viewQuizNew" component={ViewQuizNew} />
                        <Route path="/editQuestion" component={EditQuestionComponent} />
                        <Route component={NotFoundPage} />
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default AppRouter;