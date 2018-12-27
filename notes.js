/*


To Do

Add back buttons on createQuiz and viewQuiz

Need to fix error where, when creating a quiz, if they click back on question that's
not question 1, the prior question was already sent and is not deleted from database.
So, when we submit quiz there is an extra question.

Handle if case where a quiz creation was started, but not finished. When viewing 
quiz maybe if there were no questions submitted show text, no questions with 
a button, add question.

Maybe remove number of questions option, and make it work where as they're 
creating a quiz, have an add question button and a submit quiz button. Only allow
a max of 20 questions though...

Add discussion from createQuizPage to this doc.

Need to handle if they type same teacher at same school types in same name of
an existing quiz we need to send error telling her that that quiz already exists.

Build 'CreatedQuiz' component which shows a submitted quiz fully, with edit 
buttons on each question that sends us to QuestionComponent with 'edit' variable 
passed. Could store some kind of 'edit mode' variable on the server which is 
made 'edit mode' when they click on a submitted quiz from the dashboard and made
'init mode' when they click 'create quiz' from the dashboard. Needs to be nulled
when we return to dashboard....on load of dashboard...




Need to make a decision about the UI...If studentClick then no dashboard and just 
choose quiz / take quiz / show results / re-route back to beginning or if 
studentClick they have a dashboard showing their results and quizzes to take...? To
do the later we have access to userObject in server which we can get user type 
like "student" or "teacher" and conditionally render their dashboard depending on
it.

For now, lets just do the former. StudentClick / choose quiz / take quiz / show
results / re-route to beginning / no login. TeacherClick / Login / dashboard /
create quiz / dashboard / edit quiz / dashboard / view quiz results with user
names and scores






When a quiz is created need to add quizId to user data so it can be shown on
their dashboard and edited.

Need to build the Question Component where it capable of editing an initialized
question like when they first create a quiz as well as an editable question
when they go edit a quiz. So, in the component we need to be able to plug in data
from the server which fills in the inputs (clear if initialized). And then, be
able to alter the answers, type, etc and be able to save question. On click next,
we need some kind of variable the was passed deciding if this is an intialized
question or edited question so that next click either renders the next question
or returns them to view the already submitted quiz...Or we could have that 'edit
mode' variable stored on the server which is called for on load of this component
and determines the render...

Have a singular DashboardComponent that on componentWillRender hits server where
there is a variable stored 'teacher user' or 'student user' and conditional renders
depending on that variable.

Make a video showing the user experience of this site. Post to your portfolio and
LWF portfolio.



Teacher User

TeacherDashboard
(*) CreateQuizPage
(*) QuestionComponent (Init)
EditQuizPage
QuestionComponent (Edit)



Student User

StudentDashboard (TakeQuiz) (QuizResults)
TakeQuizPage
QuestionComponent
ResultsPage





Discussion

Dashboard is conditionally rendered depending on if user logged in as Teacher or
Student.

Lesson Learned: Don't store quizIds on userObject in database, b/c when you delete
the quiz in the quizzes collection, that id is still in userObject. So, what we
can do is on login or dashboard render when we grab user data we can check 
for userId in createdBy in all quizzes....is this secure???

Lesson Re-Learned: When going a child or two children deep regarding components, 
you can return to the HOC view by passing that onSubmit prop with the onSubmit
function in the HOC changing the state how you need...Example is regarding editing
a quiz. The HOC is the Dashboard, the view is rendered to ViewQuiz component, which
holds an onSubmit function that changes the state "mode" to "view" which conditionally
renders the full quiz. When the state "mode" is changed to edit, it is passed 
variables and conditionally renders a QuestionComponent. It's passed the onSubmit
function from ViewQuiz so that when we click "Save" we hit the server with question
changes and then changes state "mode" in the HOC to alter view back to ViewQuiz.

When editing a quiz. We server-call 'getQuizData' on clicking a quiz which can then
render the quiz and questions for 'view' mode and then when we edit a question and
click 'edit' we call server-call 'getQuizData' again through that onSubmit function.

When editing a question. We are rendering the question through props passed from the 
parent component which is ViewQuiz. Then, on clicking 'edit' we server-call 'editQuestion'
which finds and updates the entire quiz in the database. B/c we can't update docs
two levels deep in mongodb, we have to update the whole quiz by copying the quiz
then mapped through the questionsArray to find the edited question and then we
change that one question and save to the new questionsArray dnd new Quiz. That
new quiz is then saved in db.





*/