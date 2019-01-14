import React from 'react';
import '../style.css';
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
    }

    
    componentWillMount() {
        axios.post('/clearUserVariable').then(function(result) {

        }).catch(function(err) {
            console.log(err);
        });
    }

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
                    <div className="content_container">
                        <div className="home_page_top_section">
                            <h1>Welcome to Quiz Maker</h1>
                            <p className="top_large_text">A free site for building and taking custom quizzes.</p>
                            <p className="top_large_text">Click below to take an existing quiz or create a new quiz.</p>
                            <p>#getyaquizon</p>
                        </div>
                    <div className="row boxes_container">
                        <Link onClick={this.studentClick} className="choice_box" to="/findQuiz" >
                            <span>Take Quiz</span>
                        </Link>
                        <Link onClick={this.teacherClick} className="choice_box" to="/login" >
                            <span>Create a Quiz</span>
                        </Link>
                    {/*
                        <div className="box">
                            <h3></h3>
                        </div>
                        <div className="box">
                        </div>
                    */}
                    {/*
                        <Link onClick={this.studentClick} className="box" to="/findQuiz" >
                            <span>Students</span>
                        </Link>
                        <Link onClick={this.teacherClick} className="box" to="/login" >
                            <span>Teachers</span>
                        </Link>
                    */}
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default HomePage;