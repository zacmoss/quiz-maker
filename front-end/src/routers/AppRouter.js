import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import '../style.css';
import HomePage from '../components/HomePage';
import LoginPage from '../components/LoginPage';
import NotFoundPage from '../components/NotFoundPage';
import Footer from '../components/Footer';
import SignUpPage from '../components/SignUpPage';
import Dashboard from '../components/Dashboard';
import CreateQuizNew from '../components/CreateQuizNew';
import ViewQuizNew from '../components/ViewQuizNew';
import EditQuestionComponent from '../components/EditQuestionComponent';
import FindQuizComponent from '../components/FindQuizComponent';
import TakeQuizComponent from '../components/TakeQuizComponent';
import createHistory from 'history/createBrowserHistory';

export const history = createHistory();

class AppRouter extends React.Component { // Client-Side Routing
    

    /*
    componentDidMount() {
        console.log('rendered');
        let self = this;
        axios.get('/getSignedIn').then(function(result) {
            console.log(result.data.signedIn);
            self.setState(() => ({ signedIn: result.data.signedIn}));
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
                        <Route path="/createQuizNew" component={CreateQuizNew} />
                        <Route path="/viewQuizNew" component={ViewQuizNew} />
                        <Route path="/editQuestion" component={EditQuestionComponent} />
                        
                        <Route path="/findQuiz" component={FindQuizComponent} />
                        <Route path="/takeQuiz" component={TakeQuizComponent} />
                        <Route component={NotFoundPage} />
                        
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default AppRouter;