import React from 'react';
import '../style.css';
//import axios from 'axios';
import Header from './Header';
import { Link } from 'react-router-dom';
import axios from 'axios';


class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchComponent: true,
            cec: false,
            eventFeed: true,
            searchResults: false,
            array: undefined
        }
        //this.searchEvents = this.searchEvents.bind(this);
    }

    
    componentWillMount() {
        /*
        console.log('rendered');
        axios.get('/testGet').then(function(result) {
            console.log(result.data);
        }).catch(function(err) {
            console.log("error: " + err);
        })
        */
        axios.post('/clearUserVariable').then(function(result) {

        }).catch(function(err) {
            console.log(err);
        });
    }

    // on page render clear teacher-student variable at server

    // on decision set teacher-student variable at server
    studentClick() {
        axios.post('/studentUser').then(function(result) {

        }).catch(function(err) {
            console.log(err);
        });
    }
    teacherClick() {
        axios.post('/teacherUser').then(function(result) {

        }).catch(function(err) {
            console.log(err);
        });
    }

    render() {
        return (
            <div>
                <Header />
                <div className="home_page_container">
                    <div className="row boxes_container">
                        <Link onClick={this.studentClick} className="box" to="/findQuiz" >
                            <span>Students</span>
                        </Link>
                        <Link onClick={this.teacherClick} className="box" to="/login" >
                            <span>Teachers</span>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default HomePage;